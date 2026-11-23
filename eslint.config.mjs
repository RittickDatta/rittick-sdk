import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig(
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
    extends: [js.configs.recommended, tseslint.configs.recommended],
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
    name: "rittick/react-javascript",
    files: ["packages/ui/src/**/*.jsx"],
    extends: [eslintReact.configs.recommended],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  {
    name: "rittick/react-typescript",
    files: ["packages/ui/src/**/*.tsx"],
    extends: [eslintReact.configs["recommended-typescript"]],
  },

  {
    name: "rittick/react-hooks",
    files: ["packages/ui/src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  {
    name: "rittick/react-hooks-deduplication",
    files: ["packages/ui/src/**/*.{jsx,tsx}"],
    rules: {
      "@eslint-react/rules-of-hooks": "off",
    },
  },

  eslintConfigPrettier,
);
