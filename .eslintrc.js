module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  env: {
    jest: true,
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y"],
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // FE & BE general
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "@typescript-eslint/no-var-requires": "off",
    "no-console": "off",

    // FE specific
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react/display-name": "off",
    "react/prop-types": "off",
    "prefer-spread": "off",
  },
};
