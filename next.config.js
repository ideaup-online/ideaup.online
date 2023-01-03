/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (!isServer) {
      config.externals = {
        sharp: 'commonjs sharp',
      };
    }

    return config;
  },
};
