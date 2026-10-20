import { z } from 'zod';
import { DISPLAY_NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './constants';

const email = z
  .string()
  .trim()
  .pipe(z.email({ error: 'validation.emailInvalid' }));

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: 'validation.passwordRequired' }),
});

export const signUpSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, { error: 'validation.displayNameRequired' })
    .max(DISPLAY_NAME_MAX_LENGTH, { error: 'validation.displayNameTooLong' }),
  email,
  password: z.string().min(PASSWORD_MIN_LENGTH, { error: 'validation.passwordTooShort' }),
});

export const resetPasswordSchema = z.object({ email });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
