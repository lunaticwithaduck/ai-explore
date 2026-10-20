import { Text, TextLink } from '@ai-explore/ui';
import { Link } from '@/i18n/navigation';

export type AuthFooterLinkProps = {
  prompt: string;
  label: string;
  href: string;
};

export function AuthFooterLink({ prompt, label, href }: AuthFooterLinkProps) {
  return (
    <>
      <Text as="span" size="sm" tone="muted">
        {prompt}
      </Text>
      <TextLink asChild size="sm">
        <Link href={href}>{label}</Link>
      </TextLink>
    </>
  );
}
