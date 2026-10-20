export type ShareIntentKey = 'x' | 'facebook' | 'linkedin' | 'email';

export function buildShareIntents(url: string, title: string): Record<ShareIntentKey, string> {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    email: `mailto:?subject=${t}&body=${encodeURIComponent(`${title}\n${url}`)}`,
  };
}
