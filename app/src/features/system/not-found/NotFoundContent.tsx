import { Button, Heading, Text } from '@ai-explore/ui';
import { Home } from 'lucide-react';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { notFoundStyles } from './NotFoundView.styles';

export type NotFoundContentProps = {
  title: string;
  body: string;
  action: string;
};

export function NotFoundContent({ title, body, action }: NotFoundContentProps) {
  return (
    <main className={notFoundStyles.page}>
      <Heading level={1}>{title}</Heading>
      <Text tone="muted">{body}</Text>
      <Button asChild iconLeft={Home}>
        <Link href={routes.library}>{action}</Link>
      </Button>
    </main>
  );
}
