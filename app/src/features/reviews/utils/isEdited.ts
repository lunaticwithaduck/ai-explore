import { EDITED_AFTER_MS } from '../config/constants';

export const isEdited = (review: { createdAt: Date; updatedAt: Date }): boolean =>
  review.updatedAt.getTime() - review.createdAt.getTime() > EDITED_AFTER_MS;
