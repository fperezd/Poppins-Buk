import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vitest config — POP-C1-03 (testing foundation).
 *
 * - `node` environment: estos son tests de lógica pura (helpers de seguridad,
 *   observabilidad, validación y fitness functions). No tocan el DOM.
 * - `vite-tsconfig-paths` resuelve el alias `@/*` definido en tsconfig.json.
 * - Fitness functions corren con cwd = repo root, así sus globs (`src/**`)
 *   resuelven igual que en CI.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    // Sentry y otras deps server-only se mockean por test; no global setup.
    clearMocks: true,
    restoreMocks: true,
  },
});
