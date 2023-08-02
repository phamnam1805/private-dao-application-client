module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "linebreak-style": "off",
    quotes: ["error", "double"],
    semi: ["warn", "always"],
    "no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_$",
        argsIgnorePattern: "^_$",
        ignoreRestSiblings: true,
      },
    ],
    "no-console": "off",
    "no-prototype-builtins": "off",
    "no-empty": "warn",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
