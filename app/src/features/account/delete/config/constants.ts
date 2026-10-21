import { SUBCOLLECTIONS } from '@ai-explore/schemas';

export const DELETE_STEPS = ['reviews', 'library', 'profile', 'account'] as const;

export type DeleteStep = (typeof DELETE_STEPS)[number];

export const DELETED_ITEMS = ['reviews', 'library', 'profile'] as const;

export const OWNED_SUBCOLLECTIONS = [
  SUBCOLLECTIONS.saved,
  SUBCOLLECTIONS.collections,
  SUBCOLLECTIONS.bundleInterest,
] as const;

export type OwnedSubcollection = (typeof OWNED_SUBCOLLECTIONS)[number];

export const DELETE_BATCH_SIZE = 400;
