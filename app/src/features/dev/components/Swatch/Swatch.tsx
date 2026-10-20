import { cn, Text } from '@ai-explore/ui';

export type SwatchProps = {
  token: string;
  className: string;
};

export function Swatch({ token, className }: SwatchProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className={cn('h-12 rounded-md border border-border', className)} />
      <Text as="span" size="xs" tone="muted" className="truncate font-mono">
        {token}
      </Text>
    </div>
  );
}
