module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: 0,
    'no-console': 0,
    'no-plusplus': 0,
    'import/no-extraneous-dependencies': [
      0, {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'consistent-return': 0,
    'no-underscore-dangle': 0,
  },
};
