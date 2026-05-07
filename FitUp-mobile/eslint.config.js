const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'android/**',
      'ios/**',
      'dist/**',
      'web-build/**',
      'node_modules/**',
      'google-services.json',
      'GoogleService-Info.plist',
    ],
  },
]);
