import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["extension/js/*.js"],
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  prettierConfig,
]);
