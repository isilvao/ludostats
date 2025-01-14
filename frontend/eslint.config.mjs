import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "standard", "plugin:tailwindcss/recommended", "prettier", "next"),
  ...compat.rules({
    "tailwindcss/no-custom-classname": "off",
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
  }),
];

export default eslintConfig;
