import { Text } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { settingRowStyles as styles } from './SettingRow.styles';

export type SettingRowProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  as?: 'div' | 'li' | undefined;
  icon?: LucideIcon | undefined;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

export function SettingRow({
  as: Tag = 'div',
  icon: Icon,
  title,
  description,
  children,
  ...props
}: SettingRowProps) {
  return (
    <Tag className={styles.root} {...props}>
      <div className={styles.lead}>
        {Icon && <Icon aria-hidden className={styles.icon} />}
        <div className={styles.copy}>
          <div className={styles.title}>{title}</div>
          {description && (
            <Text size="xs" tone="muted">
              {description}
            </Text>
          )}
        </div>
      </div>
      {children && <div className={styles.control}>{children}</div>}
    </Tag>
  );
}
