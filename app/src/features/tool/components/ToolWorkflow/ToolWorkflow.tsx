import type { Tool, WithId } from '@ai-explore/schemas';
import { cn, Text, ToolLogo } from '@ai-explore/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { toolWorkflowStyles as styles } from './ToolWorkflow.styles';

export type ToolWorkflowProps = {
  tool: WithId<Tool>;
  complementary: WithId<Tool>[];
};

export function ToolWorkflow({ tool, complementary }: ToolWorkflowProps) {
  const t = useTranslations('tool.complementary');
  return (
    <div className={styles.scroller}>
      <ol aria-label={t('workflow')} className={styles.list}>
        <li className={styles.step}>
          <div className={styles.tile}>
            <ToolLogo
              aria-hidden
              size="lg"
              src={tool.logo.path}
              alt={tool.name}
              background={tool.logo.background}
              className={styles.current}
            />
            <Text as="span" size="xs" weight="medium">
              {tool.name}
              <Text as="span" size="xs" tone="muted" className="block">
                {t('current')}
              </Text>
            </Text>
          </div>
        </li>
        {complementary.map((other, index) => (
          <li key={other.id} className={styles.step}>
            <span className={styles.connector}>
              <ArrowRight aria-hidden className={styles.arrow} />
              <Text as="span" size="xs" tone="muted" className="whitespace-nowrap">
                {index === 0 ? t('then') : t('combine')}
              </Text>
            </span>
            <Link href={routes.tool(other.id)} className={cn(styles.tile, styles.link)}>
              <ToolLogo
                aria-hidden
                size="lg"
                src={other.logo.path}
                alt={other.name}
                background={other.logo.background}
              />
              <Text as="span" size="xs" weight="medium">
                {other.name}
              </Text>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
