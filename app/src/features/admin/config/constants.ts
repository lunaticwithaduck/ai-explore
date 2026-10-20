export const ADMIN_TABS = ['tools', 'bundles', 'updates', 'interest'] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];
