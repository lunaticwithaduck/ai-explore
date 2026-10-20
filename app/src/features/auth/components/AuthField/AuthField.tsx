import { Input, type InputProps, Label, Text } from '@ai-explore/ui';
import type { ReactNode, Ref } from 'react';
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
  ...inputProps
}: AuthFieldProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;
  return (
    <div className={authFieldStyles.root}>
      <div className={authFieldStyles.labelRow}>
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <Input
        ref={ref}
        id={id}
        invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <Text id={messageId} size="xs" tone={error ? 'danger' : 'subtle'}>
          {message}
        </Text>
      )}
    </div>
  );
}
