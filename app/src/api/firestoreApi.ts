import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppError } from './errors';

export const firestoreApi = createApi({
  reducerPath: 'firestoreApi',
  baseQuery: fakeBaseQuery<AppError>(),
  tagTypes: [
    'Profile',
    'Saved',
    'Collection',
    'Review',
    'Vote',
    'Notification',
    'BundleInterest',
    'AdminTool',
    'AdminBundle',
    'AdminUpdate',
    'AdminInterest',
  ],
  endpoints: () => ({}),
});
