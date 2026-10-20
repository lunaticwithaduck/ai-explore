'use client';

import { Button, Heading, Label, RatingInput, Text, Textarea } from '@ai-explore/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TEST_IDS } from '@/config/test-ids';
import { REVIEW_BODY_MAX } from '../../config/constants';
import { EMPTY_REVIEW_FORM, type ReviewFormValues, reviewFormSchema } from '../../config/schemas';
import { reviewFormStyles as styles } from './ReviewForm.styles';

export type ReviewFormProps = {
  title: string;
  submitLabel: string;
  initialValues?: ReviewFormValues | undefined;
  pending: boolean;
  onSubmit: (values: ReviewFormValues) => Promise<unknown>;
  onCancel?: (() => void) | undefined;
};

export function ReviewForm({
  title,
  submitLabel,
  initialValues = EMPTY_REVIEW_FORM,
  pending,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const t = useTranslations('reviews.form');
  const ids = { title: useId(), body: useId(), counter: useId() };
  const { control, register, handleSubmit, watch, formState } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: initialValues,
  });
  const { errors, isSubmitting } = formState;
  const bodyLength = watch('body').length;
  const message = (key?: string) => (key ? t(`validation.${key}`, { max: REVIEW_BODY_MAX }) : null);
  const ratingError = message(errors.rating?.message);
  const bodyError = message(errors.body?.message);

  return (
    <form
      noValidate
      aria-labelledby={ids.title}
      onSubmit={handleSubmit(onSubmit)}
      className={styles.root}
      data-testid={TEST_IDS.reviews.form}
    >
      <Heading level={3} size="md" id={ids.title}>
        {title}
      </Heading>
      <div className={styles.field}>
        <Text as="span" size="sm" weight="medium">
          {t('ratingLabel')}
        </Text>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <RatingInput
              ref={field.ref}
              value={field.value || null}
              onChange={field.onChange}
              label={t('ratingLabel')}
              getOptionLabel={(rating) => t('ratingOption', { rating })}
              size="lg"
              invalid={Boolean(ratingError)}
              disabled={pending}
              data-testid={TEST_IDS.reviews.ratingInput}
            />
          )}
        />
        {ratingError && (
          <Text size="xs" tone="danger" role="alert">
            {ratingError}
          </Text>
        )}
      </div>
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <Label htmlFor={ids.body}>
            {t('bodyLabel')}
            <Text as="span" size="xs" tone="subtle" className={styles.optional}>
              {t('bodyOptional')}
            </Text>
          </Label>
          <Text as="span" size="xs" tone="subtle" numeric id={ids.counter}>
            {t('counter', { count: bodyLength, max: REVIEW_BODY_MAX })}
          </Text>
        </div>
        <Textarea
          id={ids.body}
          rows={5}
          maxLength={REVIEW_BODY_MAX}
          placeholder={t('bodyPlaceholder')}
          invalid={Boolean(bodyError)}
          aria-describedby={ids.counter}
          disabled={pending}
          data-testid={TEST_IDS.reviews.bodyInput}
          {...register('body')}
        />
        {bodyError && (
          <Text size="xs" tone="danger" role="alert">
            {bodyError}
          </Text>
        )}
      </div>
      <div className={styles.actions}>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={pending}>
            {t('cancel')}
          </Button>
        )}
        <Button
          type="submit"
          loading={pending || isSubmitting}
          data-testid={TEST_IDS.reviews.submit}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
