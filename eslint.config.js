// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      // Must stay last among `extends`: turns off stylistic rules that would
      // otherwise conflict with Prettier's own formatting.
      eslintConfigPrettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // 03-coding-standards.md: signal-based inputs/outputs over legacy decorators.
      '@angular-eslint/prefer-signals': 'error',
      // 02/03: class names carry the type suffix (ProjectCaseStudyComponent), matching
      // the 2016 file-name style guide this workspace uses.
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      // 01-tech-stack-and-principles.md #6: no console.log left behind.
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  {
    // Express/SSR bootstrap boilerplate legitimately logs its own startup URL.
    files: ['src/server.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]);
