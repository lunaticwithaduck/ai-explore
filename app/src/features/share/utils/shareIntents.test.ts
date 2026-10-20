import { describe, expect, it } from 'vitest';
import { buildShareIntents } from './shareIntents';

const URL_ = 'https://ai-explore.test/tools/midjourney?x=1&y=2';
const TITLE = 'Midjourney & friends: "AI" art';

describe('buildShareIntents', () => {
  const intents = buildShareIntents(URL_, TITLE);

  it('encodes the url and title in every intent', () => {
    const u = encodeURIComponent(URL_);
    const t = encodeURIComponent(TITLE);
    expect(intents.x).toBe(`https://twitter.com/intent/tweet?url=${u}&text=${t}`);
    expect(intents.facebook).toBe(`https://www.facebook.com/sharer/sharer.php?u=${u}`);
    expect(intents.linkedin).toBe(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`);
    expect(intents.email.startsWith(`mailto:?subject=${t}&body=`)).toBe(true);
  });

  it('never leaks raw separators from the inputs', () => {
    expect(intents.x).not.toContain('&y=2');
    expect(intents.x).not.toContain(' ');
    expect(
      decodeURIComponent(new globalThis.URL(intents.facebook).searchParams.get('u') ?? ''),
    ).toBe(URL_);
  });
});
