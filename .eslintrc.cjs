module.exports = {
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'import/order': 'error',
    'import/no-anonymous-default-export': 'off',
  },
  settings: {
    next: {
      rootDir: '.',
    },
  },
};
