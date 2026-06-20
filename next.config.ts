import type { NextConfig } from "next";
import path from "path";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Tectonic-EVM-WebUI";
// Allow explicit override via NEXT_PUBLIC_BASE_PATH so local or CI builds
// can set the site base path unambiguously.
const publicBase = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = publicBase ?? (isGitHubPagesBuild ? `/${repoName}` : "");
const assetPrefix = basePath ? `${basePath}/` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
