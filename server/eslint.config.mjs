// filepath: /home/vespertine/super-forum/server/eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

const prettierPlugin = await import('eslint-plugin-prettier').then(
  (mod) => mod.default ?? mod
);
const prettierConfig = await import('eslint-config-prettier').then(
  (mod) => mod.default ?? mod
);

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.browser },
    plugins: { prettier: prettierPlugin },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
        },
      ],
    },
  },
  prettierConfig,
]);
