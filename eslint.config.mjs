import tseslint from 'typescript-eslint';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import mocha from 'eslint-plugin-mocha';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '.vscode/*',
      '**/.husky/',
      '**/*.js',
      '**/package-lock.json',
      'eslint.config.mjs',
    ],
  },
  // 1. Base JS Recommended
  js.configs.recommended,
  // 2. Modern TS Recommended (Handles the plugin registration automatically)
  ...tseslint.configs.recommended,
  // 3. Legacy Plugins via Compat
  ...fixupConfigRules(
    compat.extends(
      'plugin:mocha/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:prettier/recommended'
    )
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      // EXPLICIT MAPPING: This ensures the rules find the plugin logic
      '@typescript-eslint': tseslint.plugin,
      mocha: fixupPluginRules(mocha),
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
      playwright: playwright,
    },
    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.node,
      },
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',

      // Type-aware rules now have a direct link to tseslint.plugin
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],

      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-absolute-path': 'error',
      'import/no-self-import': 'error',
      'require-await': 'off',
      'no-trailing-spaces': 'error',
      'no-console': 'error',
      'spaced-comment': ['error', 'always', { line: { markers: ['/'] }, block: { balanced: true } }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      complexity: ['warn', { max: 11 }],

      // Playwright Rules
      'playwright/missing-playwright-await': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/valid-expect': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-contain': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-useless-not': 'warn',
      'playwright/expect-expect': 'off',
      'playwright/no-conditional-in-test': 'off',
      'playwright/no-standalone-expect': 'off',
      'mocha/no-skipped-tests': 'off',
    },
  }
);
