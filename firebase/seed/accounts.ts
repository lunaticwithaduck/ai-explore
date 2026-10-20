export const E2E_ACCOUNTS = {
  admin: {
    uid: 'e2e-admin',
    email: 'admin@ai-explore.test',
    password: 'admin-pass-123',
    displayName: 'Ada Admin',
  },
  member: {
    uid: 'e2e-member',
    email: 'member@ai-explore.test',
    password: 'member-pass-123',
    displayName: 'Mila Member',
    savedToolIds: ['midjourney'],
  },
} as const;
