import { IconButton } from '@ai-explore/ui';
import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { repeaterStyles } from '../RepeaterSection/RepeaterSection.styles';

export type RepeaterRowProps = {
  removeLabel: string;
  onRemove: () => void;
  children: ReactNode;
};

export function RepeaterRow({ removeLabel, onRemove, children }: RepeaterRowProps) {
  return (
    <div className={repeaterStyles.row}>
      <div className={repeaterStyles.fields}>{children}</div>
      <IconButton type="button" icon={Trash2} label={removeLabel} size="sm" onClick={onRemove} />
    </div>
  );
}
