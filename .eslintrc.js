module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        browser: false,
        commonjs: true,
        es6: true,
        node: true,
    },
    plugins: ['@typescript-eslint'],
    extends: ['plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
};
