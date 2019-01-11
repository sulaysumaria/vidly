module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules: {
    quotes: ['error', 'single'],
    'no-console': ['error', { allow: ['error', 'log'] }],
  },
}
