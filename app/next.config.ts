import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-explore/schemas', '@ai-explore/ui'],
};

export default nextConfig;
