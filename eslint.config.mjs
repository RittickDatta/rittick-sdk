import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
  {
    name: "rittick/global-ignores",
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.storybook-out/**",
      "**/storybook-static/**",
      "**/.cache/**",
      "**/*.tsbuildinfo",
      "**/*.tgz",
    ],
  },

  {
    name: "rittick/javascript",
    files: ["**/*.{js,mjs,cjs,jsx}"],
    extends: [js.configs.recommended],
  },

  {
    name: "rittick/typescript",
    files: ["**/*.{ts,tsx,mts,cts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },

  {
    name: "rittick/node-tooling",
    files: [
      "*.{js,mjs,cjs}",
      "scripts/**/*.{js,mjs,cjs,ts,mts,cts}",
      "**/*.config.{js,mjs,cjs,ts,mts,cts}",
    ],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    name: "rittick/ui-browser",
    files: ["packages/ui/src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  {
    name: "rittick/react",
    files: ["packages/ui/src/**/*.{jsx,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      "react/prop-types": "off",

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  eslintConfigPrettier,
);
