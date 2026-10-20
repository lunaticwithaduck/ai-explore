export type LibraryQuery = {
  q?: string | undefined;
  category?: string | undefined;
  tags?: readonly string[] | undefined;
  sort?: string | undefined;
  price?: string | undefined;
};

const withQuery = (path: string, query: Record<string, string | undefined>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
};

export const routes = {
  library: '/',
  libraryWith: (query: LibraryQuery) =>
    withQuery('/', {
      q: query.q,
      category: query.category,
      tags: query.tags?.length ? query.tags.join(',') : undefined,
      sort: query.sort,
      price: query.price,
    }),
  tool: (slug: string) => `/tools/${encodeURIComponent(slug)}`,
  bundles: '/bundles',
  bundle: (slug: string) => `/bundles/${encodeURIComponent(slug)}`,
  compare: (a?: string, b?: string) => withQuery('/compare', { a, b }),
  myLibrary: '/library',
  myCollection: (collectionId: string) => withQuery('/library', { collection: collectionId }),
  profile: '/profile',
  settings: '/settings',
  signIn: '/sign-in',
  signUp: '/sign-up',
  resetPassword: '/reset-password',
  admin: '/admin',
  adminNewTool: '/admin/tools/new',
  adminTool: (slug: string) => `/admin/tools/${encodeURIComponent(slug)}`,
  adminNewBundle: '/admin/bundles/new',
  adminBundle: (slug: string) => `/admin/bundles/${encodeURIComponent(slug)}`,
  adminNewUpdate: '/admin/updates/new',
} as const;
