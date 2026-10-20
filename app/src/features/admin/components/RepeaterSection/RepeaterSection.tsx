import { Button, Heading } from '@ai-explore/ui';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { repeaterStyles } from './RepeaterSection.styles';

export type RepeaterSectionProps = {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
};

export function RepeaterSection({ title, addLabel, onAdd, children }: RepeaterSectionProps) {
  return (
    <section className={repeaterStyles.root}>
      <div className={repeaterStyles.header}>
        <Heading level={2} size="sm">
          {title}
        </Heading>
        <Button type="button" variant="secondary" size="sm" iconLeft={Plus} onClick={onAdd}>
          {addLabel}
        </Button>
      </div>
      {children}
    </section>
  );
}
