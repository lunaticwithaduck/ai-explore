export const NAMESPACES = ['common'] as const;

export type Namespace = (typeof NAMESPACES)[number];
