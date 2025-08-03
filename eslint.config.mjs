import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['.next/', 'node_modules/', 'dist/', 'public/', '.turbo/'],
  },

  ...compat.extends('next'),

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },
];
