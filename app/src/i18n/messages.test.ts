import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { NAMESPACES } from './namespaces';
import { routing } from './routing';

const MESSAGES_DIR = join(__dirname, '..', 'messages');

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

function load(locale: string): Map<string, string> {
  const all = new Map<string, string>();
  for (const namespace of NAMESPACES) {
    const tree = JSON.parse(readFileSync(join(MESSAGES_DIR, locale, `${namespace}.json`), 'utf8'));
    for (const [k, v] of flatten(tree, namespace)) all.set(k, v);
  }
  return all;
}

describe('INV-15 message catalogues', () => {
  it('every locale folder holds exactly the declared namespaces', () => {
    for (const locale of routing.locales) {
      const files = readdirSync(join(MESSAGES_DIR, locale)).map((file) =>
        file.replace(/\.json$/, ''),
      );
      expect(files.sort()).toEqual([...NAMESPACES].sort());
    }
  });

  it('en and bg have identical keys', () => {
    expect([...load('bg').keys()].sort()).toEqual([...load('en').keys()].sort());
  });

  it('no message is empty', () => {
    for (const locale of routing.locales) {
      const empty = [...load(locale)].filter(([, value]) => value.trim() === '').map(([k]) => k);
      expect(empty).toEqual([]);
    }
  });
});
