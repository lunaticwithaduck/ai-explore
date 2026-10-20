import { DISPLAY_NAME_MAX } from '@ai-explore/schemas';
import { routes } from '@/config/routes';

export const AUTH_ROUTES: readonly string[] = [routes.signIn, routes.signUp, routes.resetPassword];

export const PASSWORD_MIN_LENGTH = 6;
export const DISPLAY_NAME_MAX_LENGTH = DISPLAY_NAME_MAX;
export const PHOTO_URL_MAX_LENGTH = 2048;
