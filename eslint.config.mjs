// eslint.config.mjs
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"], // Target TypeScript files
    rules: {
      // Add or override specific rules here
      // For example, to warn about unused variables:
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
    },
  },
  {
    // Configuration for all files to ignore common build artifacts
    ignores: [".next/**", "out/**", "build/**", "dist/**", "node_modules/**"],
  },
);
