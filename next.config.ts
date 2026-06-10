import type { NextConfig } from "next";
import path from "path";

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const repoName = "Tectonic-EVM-WebUI";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: isGitHubPagesBuild ? `/${repoName}` : "",
  assetPrefix: isGitHubPagesBuild ? `/${repoName}/` : undefined,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
