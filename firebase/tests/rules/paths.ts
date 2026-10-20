import { APP_CONFIG_DOC, COLLECTIONS, SUBCOLLECTIONS } from '@ai-explore/schemas';

const user = (uid: string) => `${COLLECTIONS.users}/${uid}`;
const tool = (slug: string) => `${COLLECTIONS.tools}/${slug}`;
const review = (slug: string, authorUid: string) =>
  `${tool(slug)}/${SUBCOLLECTIONS.reviews}/${authorUid}`;

export const paths = {
  admin: (uid: string) => `${COLLECTIONS.admins}/${uid}`,
  appConfig: `${COLLECTIONS.config}/${APP_CONFIG_DOC}`,
  category: (id: string) => `${COLLECTIONS.categories}/${id}`,
  bundle: (slug: string) => `${COLLECTIONS.bundles}/${slug}`,
  tool,
  update: (slug: string, id: string) => `${tool(slug)}/${SUBCOLLECTIONS.updates}/${id}`,
  reviews: (slug: string) => `${tool(slug)}/${SUBCOLLECTIONS.reviews}`,
  review,
  votes: (slug: string, authorUid: string) => `${review(slug, authorUid)}/${SUBCOLLECTIONS.votes}`,
  vote: (slug: string, authorUid: string, voterUid: string) =>
    `${review(slug, authorUid)}/${SUBCOLLECTIONS.votes}/${voterUid}`,
  user,
  savedList: (uid: string) => `${user(uid)}/${SUBCOLLECTIONS.saved}`,
  saved: (uid: string, slug: string) => `${user(uid)}/${SUBCOLLECTIONS.saved}/${slug}`,
  collectionList: (uid: string) => `${user(uid)}/${SUBCOLLECTIONS.collections}`,
  collection: (uid: string, id: string) => `${user(uid)}/${SUBCOLLECTIONS.collections}/${id}`,
  bundleInterest: (uid: string, slug: string) =>
    `${user(uid)}/${SUBCOLLECTIONS.bundleInterest}/${slug}`,
  subscriptionList: (uid: string) => `${user(uid)}/${SUBCOLLECTIONS.subscriptions}`,
  subscription: (uid: string, id: string) => `${user(uid)}/${SUBCOLLECTIONS.subscriptions}/${id}`,
};
