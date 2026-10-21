import { Heading, Tag } from '@ai-explore/ui';
import { Tag as TagIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { routes } from '@/config/routes';
import { tagLabel } from '@/features/library/utils/tagOptions';
import { Link } from '@/i18n/navigation';

export type ToolTagsProps = {
  tags: readonly string[];
};

export function ToolTags({ tags }: ToolTagsProps) {
  const t = useTranslations('tool.header');
  const headingId = useId();
  if (tags.length === 0) return null;
  return (
    <div>
      <Heading level={2} size="md" id={headingId} className="mb-3">
        {t('tags')}
      </Heading>
      <ul aria-labelledby={headingId} className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Tag asChild icon={TagIcon} data-id={tag} className="h-7 font-normal">
              <Link href={routes.libraryWith({ tags: [tag] })}>{tagLabel(tag)}</Link>
            </Tag>
          </li>
        ))}
      </ul>
    </div>
  );
}
