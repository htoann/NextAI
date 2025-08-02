import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next'),

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ignores: ['.next/', 'node_modules/', 'dist/', 'build/'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    },
  },
];

export default eslintConfig;
