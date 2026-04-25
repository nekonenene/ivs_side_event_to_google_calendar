import nextConfig from 'eslint-config-next/core-web-vitals';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...nextConfig,
  prettierPluginRecommended,
  {
    rules: {
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
    },
  },
];
