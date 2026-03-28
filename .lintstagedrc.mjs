export default {
  // ESLint only for web — runs from apps/web/ where eslint.config.js lives
  'apps/web/src/**/*.{ts,tsx}': [
    'pnpm --filter @recipe4you/web exec eslint --fix --max-warnings 0',
    'prettier --write',
  ],

  // API + packages — type-safe but no JSX rules; just format
  'apps/api/src/**/*.ts': ['prettier --write'],
  'packages/**/*.ts': ['prettier --write'],

  // Everything else
  '*.{json,md,css}': ['prettier --write'],
  'apps/**/*.{json,md,css}': ['prettier --write'],
  'packages/**/*.{json,md}': ['prettier --write'],
}
