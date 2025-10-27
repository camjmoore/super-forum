import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const prettierPlugin = await import('eslint-plugin-prettier').then(
  (mod) => mod.default ?? mod
);
const prettierConfig = await import('eslint-config-prettier').then(
  (mod) => mod.default ?? mod
);

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: { prettier: prettierPlugin },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
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
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off' // Allow any in .ts files for GraphQL generated types
    }
  },
  prettierConfig,
];
