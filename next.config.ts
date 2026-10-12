import type { NextConfig } from 'next';

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubPagesBuild
    ? {
        output: 'export' as const,
        basePath: '/Crewami-mock',
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
