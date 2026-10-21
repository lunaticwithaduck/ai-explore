import type { Tool, WithId } from '@ai-explore/schemas';
import { Button } from '@ai-explore/ui';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { CompareLink } from '@/features/compare/components/CompareLink/CompareLink';
import { AddToCollectionMenu } from '@/features/my-library/components/AddToCollectionMenu/AddToCollectionMenu';
import { ShareButton } from '@/features/share/components/ShareButton/ShareButton';
import { Link } from '@/i18n/navigation';
import { ToolSaveButton } from '../ToolSaveButton/ToolSaveButton';
import { toolActionsStyles as styles } from './ToolActions.styles';

export type ToolActionsProps = {
  tool: WithId<Tool>;
  compareWithId: string | undefined;
};

export function ToolActions({ tool, compareWithId }: ToolActionsProps) {
  const t = useTranslations('tool.header');
  return (
    <div className={styles.root}>
      <Button asChild size="lg" iconLeft={ExternalLink} className={styles.open}>
        <Link
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={TEST_IDS.tool.openButton}
        >
          {t('open')}
        </Link>
      </Button>
      <ToolSaveButton toolId={tool.id} className={styles.action} />
      <AddToCollectionMenu toolId={tool.id} className={styles.action} />
      <ShareButton
        url={`${env.NEXT_PUBLIC_SITE_URL}${routes.tool(tool.slug)}`}
        title={tool.name}
        className={styles.action}
      />
      <CompareLink toolId={tool.id} otherToolId={compareWithId} className={styles.action} />
    </div>
  );
}
