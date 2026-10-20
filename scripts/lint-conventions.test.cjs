const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const { lintProject, lintSource } = require('./lint-conventions.cjs');

const FEATURE = 'app/src/features/x/components/Card/Card.tsx';
const rulesOf = (path, src) => lintSource(path, src).map((f) => f.rule);
const flags = (rule, path, src) => assert.ok(rulesOf(path, src).includes(rule), `${rule} expected`);
const passes = (rule, path, src) =>
  assert.ok(!rulesOf(path, src).includes(rule), `${rule} not expected`);

describe('scope', () => {
  it('skips test files, reference and node_modules', () => {
    const src = 'export const A = () => <button style={{}}>Hi</button>;';
    assert.deepEqual(lintSource('app/src/features/x/Card.test.tsx', src), []);
    assert.deepEqual(lintSource('reference/figma-make/src/A.tsx', src), []);
    assert.deepEqual(lintSource('app/src/node_modules/y/A.tsx', src), []);
    assert.deepEqual(lintSource('docs/A.tsx', src), []);
  });
});

describe('R1', () => {
  it('flags style=', () => flags('R1', FEATURE, 'export const A = () => <div style={{}} />;'));
  it('allows style= in ToolLogo.tsx', () =>
    passes(
      'R1',
      'packages/ui/src/components/ToolLogo/ToolLogo.tsx',
      'export const ToolLogo = () => <div style={{}} />;',
    ));
});

describe('R3', () => {
  it('flags raw elements outside ui', () =>
    flags('R3', FEATURE, 'export const A = () => <a>x</a>;'));
  it('allows raw elements in packages/ui/src', () =>
    passes(
      'R3',
      'packages/ui/src/components/Button/Button.tsx',
      'export const Button = () => <button />;',
    ));
  it('allows primitives', () => passes('R3', FEATURE, 'export const A = () => <Button />;'));
});

describe('R4', () => {
  it('flags hex in strings', () => flags('R4', FEATURE, "export const c = '#fff';"));
  it('flags 8-digit hex in templates', () => flags('R4', FEATURE, 'export const c = `#11223344`;'));
  it('flags hex in JSX text', () =>
    flags('R4', FEATURE, 'export const A = () => <Text>#ff0000</Text>;'));
  it('allows tokens dir', () =>
    passes('R4', 'packages/ui/src/tokens/colors.ts', "export const c = '#fff';"));
  it('allows firebase seed', () =>
    passes('R4', 'firebase/seed/tools.ts', "export const c = '#ff00aa';"));
  it('allows regex literals', () => passes('R4', FEATURE, 'export const re = /#fff/;'));
  it('ignores non-hex hashes', () => passes('R4', FEATURE, "export const c = 'issue #12';"));
});

describe('R4b', () => {
  it('flags px values', () => flags('R4b', FEATURE, "export const c = 'w-[13px] flex';"));
  it('flags hex values', () => flags('R4b', FEATURE, "export const c = 'text-[#f25c1f]';"));
  it('flags variants with arbitrary values', () =>
    flags('R4b', FEATURE, "export const c = 'md:h-[50vh]';"));
  it('allows token utilities', () =>
    passes('R4b', FEATURE, "export const c = 'w-full text-muted';"));
  it('allows unitless brackets', () =>
    passes('R4b', FEATURE, "export const c = 'data-[state=open]:flex';"));
});

describe('R5', () => {
  it('flags two components in a tsx file', () =>
    flags(
      'R5',
      FEATURE,
      'export function A() { return <div />; }\nexport const B = () => <span />;',
    ));
  it('counts wrapped components', () =>
    flags(
      'R5',
      FEATURE,
      'export function A() { return <div />; }\nexport const B = forwardRef((p, r) => <span />);',
    ));
  it('allows one component plus helpers', () =>
    passes('R5', FEATURE, 'const helper = () => 1;\nexport function A() { return <div />; }'));
  it('ignores ts files', () =>
    passes('R5', 'app/src/lib/x.ts', 'export const A = () => 1;\nexport const B = () => 2;'));
});

describe('R5b', () => {
  it('flags nested components folders', () =>
    flags(
      'R5b',
      'app/src/features/x/components/Card/components/Inner/Inner.ts',
      'export const a = 1;',
    ));
  it('allows a single components folder', () =>
    passes('R5b', 'app/src/features/x/components/Card/Card.ts', 'export const a = 1;'));
});

describe('R7', () => {
  it('flags literal href', () =>
    flags('R7', FEATURE, 'export const A = () => <Link href="/tools" />;'));
  it('flags href in expression', () =>
    flags('R7', FEATURE, "export const A = () => <Link href={'/tools'} />;"));
  it('allows route helpers', () =>
    passes('R7', FEATURE, 'export const A = () => <Link href={routes.tools} />;'));
  it('allows external urls', () =>
    passes('R7', FEATURE, 'export const A = () => <Link href="https://x.io" />;'));
});

describe('R7b', () => {
  it('flags useRouter from next/navigation', () =>
    flags('R7b', FEATURE, "import { useRouter } from 'next/navigation';"));
  it('flags redirect from next/navigation', () =>
    flags('R7b', FEATURE, "import { redirect } from 'next/navigation';"));
  it('allows other next/navigation exports', () =>
    passes('R7b', FEATURE, "import { useSearchParams } from 'next/navigation';"));
  it('allows the wrapper', () =>
    passes('R7b', FEATURE, "import { useRouter } from '@/i18n/navigation';"));
});

describe('R7c', () => {
  it('flags next/link', () => flags('R7c', FEATURE, "import Link from 'next/link';"));
  it('allows the wrapper', () =>
    passes('R7c', FEATURE, "import { Link } from '@/i18n/navigation';"));
});

describe('R8', () => {
  it('flags next/font/google outside fonts.ts', () =>
    flags('R8', 'app/src/app/layout.tsx', "import { Inter } from 'next/font/google';"));
  it('flags next/font/local outside fonts.ts', () =>
    flags('R8', FEATURE, "import local from 'next/font/local';"));
  it('allows fonts.ts', () =>
    passes('R8', 'app/src/app/fonts.ts', "import { Inter } from 'next/font/google';"));
});

describe('R12', () => {
  const layerCases = [
    ['config imports shared', 'app/src/config/env.ts', "import { x } from '@/lib/x';", true],
    ['config imports nothing', 'app/src/config/env.ts', "import { z } from 'zod';", false],
    [
      'shared imports features',
      'app/src/lib/x.ts',
      "import { y } from '@/features/a/components/Y';",
      true,
    ],
    ['shared imports shell', 'app/src/api/x.ts', "import { y } from '@/shell/Y';", true],
    ['shared imports config', 'app/src/lib/x.ts', "import { y } from '@/config/routes';", false],
    ['shared imports shared', 'app/src/lib/x.ts', "import { y } from '@/i18n/navigation';", false],
    [
      'features import shell',
      'app/src/features/a/hooks/x.ts',
      "import { y } from '@/shell/Y';",
      true,
    ],
    [
      'features import shared',
      'app/src/features/a/hooks/x.ts',
      "import { y } from '@/api/x';",
      false,
    ],
    [
      'shell imports features',
      'app/src/shell/Header.ts',
      "import { y } from '@/features/a/utils/y';",
      false,
    ],
    ['shell imports shared', 'app/src/shell/Header.ts', "import { y } from '@/lib/y';", false],
    ['anything imports @/app', 'app/src/shell/Header.ts', "import { y } from '@/app/fonts';", true],
    ['app imports shell', 'app/src/app/page.tsx', "import { y } from '@/shell/Y';", false],
    [
      'relative import climbs a layer',
      'app/src/lib/x.ts',
      "import { y } from '../features/a/utils/y';",
      true,
    ],
    ['relative import stays in layer', 'app/src/lib/x.ts', "import { y } from './y';", false],
  ];
  for (const [name, file, src, bad] of layerCases)
    it(name, () => (bad ? flags('R12', file, src) : passes('R12', file, src)));

  const own = 'app/src/features/a/hooks/useA.ts';
  it('flags cross-feature deep import', () =>
    flags('R12', own, "import { y } from '@/features/b/api/y';"));
  it('flags cross-feature import of a non-public area', () =>
    flags('R12', own, "import { y } from '@/features/b/Thing';"));
  it('allows cross-feature through public areas', () => {
    for (const area of ['components', 'hooks', 'utils', 'config'])
      passes('R12', own, `import { y } from '@/features/b/${area}/y';`);
  });
  it('allows same-feature imports anywhere', () =>
    passes('R12', own, "import { y } from '@/features/a/api/y';"));

  it('flags a cross-feature cycle', () => {
    const findings = lintProject([
      { path: 'app/src/features/a/hooks/a.ts', text: "import { b } from '@/features/b/hooks/b';" },
      { path: 'app/src/features/b/hooks/b.ts', text: "import { a } from '@/features/a/hooks/a';" },
    ]);
    assert.equal(findings.filter((f) => f.message.includes('cycle')).length, 2);
  });
  it('allows one-way cross-feature imports', () => {
    const findings = lintProject([
      { path: 'app/src/features/a/hooks/a.ts', text: "import { b } from '@/features/b/hooks/b';" },
      { path: 'app/src/features/b/hooks/b.ts', text: 'export const b = 1;' },
    ]);
    assert.deepEqual(findings, []);
  });
});

describe('T5', () => {
  const lines = (n) => `${'export const a = 1;\n'.repeat(n)}`;
  it('flags files over 200 lines', () => flags('T5', 'app/src/lib/big.ts', lines(201)));
  it('allows exactly 200 lines', () => passes('T5', 'app/src/lib/ok.ts', lines(200)));
  it('exempts firebase/seed/data', () => passes('T5', 'firebase/seed/data/tools.ts', lines(500)));
  it('does not exempt other seed files', () => flags('T5', 'firebase/seed/seed.ts', lines(201)));
});

describe('C1', () => {
  it('flags JSX text', () => flags('C1', FEATURE, 'export const A = () => <Text>Hello</Text>;'));
  it('flags digits in JSX text', () =>
    flags('C1', FEATURE, 'export const A = () => <Text>42</Text>;'));
  it('flags non-latin letters', () =>
    flags('C1', FEATURE, 'export const A = () => <Text>Здравей</Text>;'));
  it('flags string-literal children', () =>
    flags('C1', FEATURE, "export const A = () => <Text>{'Hello'}</Text>;"));
  it('flags copy attributes', () => {
    for (const attr of ['aria-label', 'alt', 'title', 'placeholder', 'label'])
      flags('C1', FEATURE, `export const A = () => <Field ${attr}="Name" />;`);
  });
  it('allows translated text', () =>
    passes('C1', FEATURE, 'export const A = () => <Text>{t("hi")}</Text>;'));
  it('allows punctuation-only text', () =>
    passes('C1', FEATURE, 'export const A = () => <Text>{" "} / &nbsp;</Text>;'));
  it('allows translated attributes', () =>
    passes('C1', FEATURE, 'export const A = () => <Field alt={t("a")} />;'));
  it('applies only to app/src', () =>
    passes('C1', 'packages/ui/src/components/A/A.tsx', 'export const A = () => <b>Hello</b>;'));
});

describe('output shape', () => {
  it('reports line, column and fix', () => {
    const [finding] = lintSource(FEATURE, "\n  export const c = '#fff';");
    assert.equal(finding.line, 2);
    assert.equal(finding.rule, 'R4');
    assert.ok(finding.fix.length > 0);
  });
  it('reports R1, R3, R4 and C1 for the sanity case', () => {
    const rules = rulesOf(
      'app/src/features/x/components/Bad/Bad.tsx',
      "export const Bad = () => <button style={{ color: '#fff' }}>Hi</button>;",
    );
    for (const rule of ['R1', 'R3', 'R4', 'C1']) assert.ok(rules.includes(rule), rule);
  });
});
