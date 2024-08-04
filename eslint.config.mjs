import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["extension/js/*.js"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
];
