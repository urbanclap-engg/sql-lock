module.exports =  {
  parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
  plugins: ["@typescript-eslint"],
  extends:  [
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  env: {
    node: true,
    jest: true
  },
  parserOptions:  {
    project: ['./tsconfig.json', './test/tsconfig.json']
  },
  rules:  {
    "@typescript-eslint/camelcase": "off",
    "quotes": "off",
    "@typescript-eslint/quotes": ["error", "single"],
    "semi": "off",
    "@typescript-eslint/semi": ["error"],
    "brace-style": "off",
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "error",
    "comma-spacing": "error"
  },
};
