import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import messages from '@/messages/en/admin.json';
import { AdminMoneyField } from '../AdminMoneyField/AdminMoneyField';

let captured: unknown;

function Harness({ initial }: { initial: number }) {
  const methods = useForm({ defaultValues: { price: initial } });
  captured = methods.watch('price');
  return (
    <FormProvider {...methods}>
      <AdminMoneyField name="price" label="Price" />
    </FormProvider>
  );
}

const renderField = (initial: number) =>
  render(
    <NextIntlClientProvider locale="en" messages={{ admin: messages }}>
      <Harness initial={initial} />
    </NextIntlClientProvider>,
  );

describe('AdminMoneyField', () => {
  it('shows cents as dollars and stores typed dollars as cents', async () => {
    renderField(1999);
    const input = screen.getByLabelText('Price');
    expect(input).toHaveValue('19.99');
    await userEvent.clear(input);
    await userEvent.type(input, '5.5');
    expect(captured).toBe(550);
  });
});
