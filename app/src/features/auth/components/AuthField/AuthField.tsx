'use client';

import { IconButton, Input, type InputProps, Label, Text } from '@ai-explore/ui';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, type Ref, useState } from 'react';
import { authFieldStyles } from './AuthField.styles';

export type AuthFieldProps = Omit<InputProps, 'id' | 'invalid'> & {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  labelAction?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function AuthField({
  id,
  label,
  error,
  hint,
  labelAction,
  ref,
  type,
  ...inputProps
}: AuthFieldProps) {
  const t = useTranslations('auth.fields');
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const messageId = `${id}-message`;
  const message = error ?? hint;
  return (
    <div className={authFieldStyles.root}>
      <div className={authFieldStyles.labelRow}>
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <div className={authFieldStyles.control}>
        <Input
          ref={ref}
          id={id}
          type={isPassword && revealed ? 'text' : type}
          invalid={Boolean(error)}
          aria-describedby={message ? messageId : undefined}
          className={isPassword ? authFieldStyles.passwordInput : undefined}
          {...inputProps}
        />
        {isPassword && (
          <IconButton
            icon={revealed ? EyeOff : Eye}
            label={revealed ? t('hidePassword') : t('showPassword')}
            aria-pressed={revealed}
            size="sm"
            onClick={() => setRevealed((value) => !value)}
            className={authFieldStyles.toggle}
          />
        )}
      </div>
      {message && (
        <Text id={messageId} size="xs" tone={error ? 'danger' : 'subtle'}>
          {message}
        </Text>
      )}
    </div>
  );
}
