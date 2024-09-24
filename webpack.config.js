const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add a rule for handling .proto files
  config.module.rules.push({
    test: /\.proto$/,
    use: 'file-loader', // Ensure proto files are treated as assets
  });

  return config;
};