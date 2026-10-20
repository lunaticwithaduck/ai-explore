#!/usr/bin/env node

const { readFileSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['app/src', 'packages/ui/src', 'packages/schemas/src', 'firebase/seed'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'reference']);
const MAX_LINES = 200;

const RAW_ELEMENTS = new Set([
  'button',
  'input',
  'textarea',
  'select',
  'a',
  'img',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'label',
]);
const COPY_ATTRS = new Set(['aria-label', 'alt', 'title', 'placeholder', 'label']);
const NAVIGATION_BANNED = new Set(['useRouter', 'redirect', 'permanentRedirect', 'usePathname']);
const CROSS_FEATURE_AREAS = new Set(['components', 'hooks', 'utils', 'config']);
const LAYER_ALLOWED = {
  app: new Set(['app', 'shell', 'features', 'shared', 'config']),
  shell: new Set(['shell', 'features', 'shared', 'config']),
  features: new Set(['features', 'shared', 'config']),
  shared: new Set(['shared', 'config']),
  config: new Set(),
};
const LAYER_OF_DIR = {
  app: 'app',
  shell: 'shell',
  features: 'features',
  api: 'shared',
  lib: 'shared',
  i18n: 'shared',
  config: 'config',
};

const HEX_RE = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})(?![\w])/i;
const ARBITRARY_RE = /(?:^|[-:!])\[[^\]]*(?:\d(?:px|rem|em|vh|vw|%)|#)[^\]]*\]/;
const LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/u;
const ENTITY_RE = /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/gi;
const NESTED_COMPONENTS_RE = /(?:^|\/)components\/(?:.*\/)?components\//;
const PASCAL_RE = /^[A-Z][A-Za-z0-9]*$/;

const isTestFile = (p) => /\.(?:test|spec)\.[^/]*$/.test(p);
const isSkippedPath = (p) => p.split('/').some((seg) => SKIP_DIRS.has(seg));
const isScanned = (p) =>
  /\.tsx?$/.test(p) &&
  !isTestFile(p) &&
  !isSkippedPath(p) &&
  SCAN_DIRS.some((dir) => p.startsWith(`${dir}/`));

const STRING_KINDS = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
]);
const isStringish = (n) => STRING_KINDS.has(n.kind);
const isPlainString = (n) =>
  n.kind === ts.SyntaxKind.StringLiteral || n.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral;

function layerOf(rel) {
  const [seg] = rel.slice('app/src/'.length).split('/');
  return LAYER_OF_DIR[seg] ?? null;
}

function resolveImport(fromRel, spec) {
  if (spec.startsWith('@/')) return { target: `app/src/${spec.slice(2)}`, alias: true };
  if (spec.startsWith('.'))
    return { target: path.posix.join(path.posix.dirname(fromRel), spec), alias: false };
  return null;
}

function jsxName(attr) {
  return ts.isIdentifier(attr.name) ? attr.name.text : attr.name.getText();
}

function attrStringValue(attr) {
  const init = attr.initializer;
  if (!init) return null;
  if (isPlainString(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression && isPlainString(init.expression))
    return init.expression.text;
  return null;
}

function unwrapFunction(init) {
  if (!init) return null;
  if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return init;
  if (ts.isCallExpression(init)) {
    for (const arg of init.arguments) {
      const fn = unwrapFunction(arg);
      if (fn) return fn;
    }
  }
  if (ts.isParenthesizedExpression(init) || ts.isAsExpression(init))
    return unwrapFunction(init.expression);
  return null;
}

function containsJsx(node) {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node))
    return true;
  return ts.forEachChild(node, (child) => (containsJsx(child) ? true : undefined)) === true;
}

function topLevelComponents(sf) {
  const found = [];
  for (const stmt of sf.statements) {
    if (ts.isFunctionDeclaration(stmt) && stmt.name && PASCAL_RE.test(stmt.name.text)) {
      if (stmt.body && containsJsx(stmt.body)) found.push(stmt.name);
    } else if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !PASCAL_RE.test(decl.name.text)) continue;
        const fn = unwrapFunction(decl.initializer);
        if (fn?.body && containsJsx(fn.body)) found.push(decl.name);
      }
    }
  }
  return found;
}

function analyze(relPath, sourceText) {
  if (!isScanned(relPath)) return { findings: [], edges: [] };
  const isTsx = relPath.endsWith('.tsx');
  const sf = ts.createSourceFile(
    relPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const findings = [];
  const edges = [];
  const inApp = relPath.startsWith('app/src/');
  const inUi = relPath.startsWith('packages/ui/src/');
  const inTokens = relPath.startsWith('packages/ui/src/tokens/');
  const inSeed = relPath.startsWith('firebase/seed/');
  const baseName = path.posix.basename(relPath);
  const fileLayer = inApp ? layerOf(relPath) : null;
  const fileDomain = relPath.startsWith('app/src/features/') ? relPath.split('/')[3] : null;

  const position = (node) => {
    const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    return { line: line + 1, col: character + 1 };
  };

  const report = (node, rule, message, fix) => {
    findings.push({ file: relPath, ...position(node), rule, message, fix });
  };

  const checkLayering = (node, spec) => {
    const resolved = resolveImport(relPath, spec);
    if (!resolved?.target.startsWith('app/src/') || !fileLayer) return;
    const { target, alias } = resolved;
    const targetLayer = layerOf(target);
    if (!targetLayer) return;
    const hint = 'Layers: app → shell → features → shared (api, lib, i18n) → config.';
    if (targetLayer === 'app' && (alias || fileLayer !== 'app')) {
      report(
        node,
        'R12',
        `nothing imports ${spec} (app layer)`,
        'move the shared code down into features, shared or config',
      );
      return;
    }
    if (
      !LAYER_ALLOWED[fileLayer].has(targetLayer) &&
      !(fileLayer === 'app' && targetLayer === 'app')
    ) {
      report(node, 'R12', `${fileLayer} must not import ${targetLayer} (${spec})`, hint);
      return;
    }
    if (fileLayer === 'features' && targetLayer === 'features') {
      const [, , , domain, area] = target.split('/');
      if (domain === fileDomain) return;
      edges.push({ from: fileDomain, to: domain, file: relPath, ...position(node) });
      if (!CROSS_FEATURE_AREAS.has(area ?? '')) {
        report(
          node,
          'R12',
          `cross-feature import ${spec} bypasses the public surface`,
          'import only @/features/<domain>/(components|hooks|utils|config)/…',
        );
      }
    }
  };

  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const name = jsxName(node);
      if (name === 'style' && baseName !== 'ToolLogo.tsx')
        report(
          node,
          'R1',
          'inline style= attribute',
          'use a token utility class from the *.styles.ts cva definition',
        );
      if (inApp) {
        const value = attrStringValue(node);
        if (name === 'href' && value?.startsWith('/'))
          report(node, 'R7', `string-literal href="${value}"`, 'use a path from @/config/routes');
        if (COPY_ATTRS.has(name) && value !== null)
          report(
            node,
            'C1',
            `string-literal ${name}`,
            'read the text from next-intl (useTranslations / getTranslations)',
          );
      }
    }

    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      if (!inUi && RAW_ELEMENTS.has(tag))
        report(
          node,
          'R3',
          `raw <${tag}> element`,
          'use the matching primitive from @ai-explore/ui',
        );
    }

    if (ts.isJsxText(node) || isStringish(node)) {
      const { text } = node;
      if (!inTokens && !inSeed && HEX_RE.test(text))
        report(
          node,
          'R4',
          'hex colour literal',
          'use a colour token defined in packages/ui/src/tokens/tokens.css',
        );
      if (!ts.isJsxText(node) && text.split(/\s+/).some((tok) => ARBITRARY_RE.test(tok)))
        report(node, 'R4b', 'arbitrary Tailwind value', 'use a design-token utility class');
      if (inApp && ts.isJsxText(node) && LETTER_OR_DIGIT_RE.test(text.replace(ENTITY_RE, '')))
        report(
          node,
          'C1',
          'literal text in JSX',
          'read the text from next-intl (useTranslations / getTranslations)',
        );
    }

    if (
      inApp &&
      ts.isJsxExpression(node) &&
      node.expression &&
      isPlainString(node.expression) &&
      (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent)) &&
      LETTER_OR_DIGIT_RE.test(node.expression.text)
    )
      report(
        node,
        'C1',
        'string literal as JSX child',
        'read the text from next-intl (useTranslations / getTranslations)',
      );

    const spec =
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : null;
    if (spec !== null) {
      if (inApp) {
        checkLayering(node, spec);
        if (spec === 'next/link')
          report(
            node,
            'R7c',
            'next/link is imported directly',
            "import Link from '@/i18n/navigation'",
          );
        if (spec === 'next/navigation' && ts.isImportDeclaration(node)) {
          const bindings = node.importClause?.namedBindings;
          if (bindings && ts.isNamedImports(bindings))
            for (const el of bindings.elements)
              if (NAVIGATION_BANNED.has((el.propertyName ?? el.name).text))
                report(
                  el,
                  'R7b',
                  `${(el.propertyName ?? el.name).text} imported from next/navigation`,
                  "import it from '@/i18n/navigation'",
                );
        }
        if (
          (spec === 'next/font/google' || spec === 'next/font/local') &&
          relPath !== 'app/src/app/fonts.ts'
        )
          report(
            node,
            'R8',
            `${spec} imported outside app/src/app/fonts.ts`,
            'declare the font in app/src/app/fonts.ts and import it from there',
          );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (isTsx) {
    const comps = topLevelComponents(sf);
    for (const extra of comps.slice(1))
      report(
        extra,
        'R5',
        `second component ${extra.text} in one file`,
        'one React component per file; move it to its own folder',
      );
  }

  if (NESTED_COMPONENTS_RE.test(relPath))
    findings.push({
      file: relPath,
      line: 1,
      col: 1,
      rule: 'R5b',
      message: 'components/ folder nested inside a components/ folder',
      fix: 'flatten: parts sit beside the component, shared ones move up to the domain components/',
    });

  const lineCount = sourceText.replace(/\n$/, '').split('\n').length;
  if (lineCount > MAX_LINES && !relPath.startsWith('firebase/seed/data/'))
    findings.push({
      file: relPath,
      line: MAX_LINES + 1,
      col: 1,
      rule: 'T5',
      message: `file has ${lineCount} lines (max ${MAX_LINES})`,
      fix: 'split the file before it grows past 200 lines',
    });

  return { findings, edges };
}

function lintSource(relPath, sourceText) {
  return analyze(relPath, sourceText).findings;
}

function lintProject(files) {
  const findings = [];
  const edgeMap = new Map();
  for (const { path: rel, text } of files) {
    const result = analyze(rel, text);
    findings.push(...result.findings);
    for (const edge of result.edges) {
      const key = `${edge.from}>${edge.to}`;
      if (!edgeMap.has(key)) edgeMap.set(key, edge);
    }
  }
  for (const [key, edge] of edgeMap) {
    if (!edgeMap.has(`${edge.to}>${edge.from}`)) continue;
    findings.push({
      file: edge.file,
      line: edge.line,
      col: edge.col,
      rule: 'R12',
      message: `feature cycle ${key.replace('>', ' → ')} and back`,
      fix: 'move the shared piece down into shared or config so features stay acyclic',
    });
  }
  return findings;
}

function walk(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
}

function main() {
  const abs = [];
  for (const dir of SCAN_DIRS) walk(path.join(ROOT, dir), abs);
  const files = abs
    .map((f) => path.relative(ROOT, f).split(path.sep).join('/'))
    .filter(isScanned)
    .map((rel) => ({ path: rel, text: readFileSync(path.join(ROOT, rel), 'utf8') }));
  const findings = lintProject(files).sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.col - b.col,
  );
  for (const f of findings)
    process.stdout.write(`${f.file}:${f.line}:${f.col}  ${f.rule}  ${f.message} — ${f.fix}\n`);
  process.stdout.write(
    `lint-conventions: ${findings.length} finding(s) in ${files.length} file(s)\n`,
  );
  process.exit(findings.length > 0 ? 1 : 0);
}

module.exports = { lintSource, lintProject };

if (require.main === module) main();
