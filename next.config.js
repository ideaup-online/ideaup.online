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

    const svgrWebpackRules = {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    };
    if (config.module) {
      if (config.module.rules) {
        config.module.rules.push(svgrWebpackRules);
      } else {
        config.module.rules = [svgrWebpackRules];
      }
    } else {
      config.module = {
        rules: [],
      };
    }

    return config;
  },
};
