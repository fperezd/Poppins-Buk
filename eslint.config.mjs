import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Fitness functions dependen de vitest/glob aun no instalados
    // (ver docs/sprint-0-prep/fitness-functions/README.md "TODO antes de Sprint 1").
    "docs/sprint-0-prep/fitness-functions/**",
  ]),
  {
    rules: {
      // Convencion estandar: _-prefijo marca argumentos/vars intencionalmente
      // sin uso (handlers obligados por signature, destructuring partial, etc).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
