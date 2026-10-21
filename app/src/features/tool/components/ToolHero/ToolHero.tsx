import type { Tool } from '@ai-explore/schemas';
import { ToolLogo } from '@ai-explore/ui';
import { ToolBackButton } from '../ToolBackButton/ToolBackButton';
import { toolHeroStyles as styles } from './ToolHero.styles';

export type ToolHeroProps = {
  tool: Pick<Tool, 'name' | 'logo'>;
};

export function ToolHero({ tool }: ToolHeroProps) {
  return (
    <div className={styles.root}>
      <ToolLogo
        aria-hidden
        size={null}
        src={tool.logo.path}
        alt={tool.name}
        background={tool.logo.background}
        className={styles.logo}
      />
      <div aria-hidden className={styles.shade} />
      <div aria-hidden className={styles.fade} />
      <ToolBackButton className={styles.back} />
    </div>
  );
}
