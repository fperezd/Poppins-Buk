# Architecture Fitness Functions (single-repo)

Estos tests son **fitness functions**: aserciones automatizadas sobre propiedades
arquitectónicas del código (seguridad, validación, deuda técnica) que corren en CI
junto a los unit tests.

Son una adaptación de `docs/sprint-0-prep/fitness-functions/` (escritas para la
arquitectura futura de 4 repos) al monolito actual `Poppins-back`. Cuando Sprint 0
divida el repo, las versiones de `docs/` reemplazan a estas.

| # | Test | Propiedad que protege | Plan |
|---|------|----------------------|------|
| 06 | `no-secrets.test.ts` | Ningún secret hardcodeado en el repo | POP-C0-03 |
| 08 | `no-ts-suppressions.test.ts` | `@ts-ignore`/`@ts-expect-error` sólo con ticket POP-XXX | POP-C0-04 |
| 09 | `handlers-use-zod.test.ts` | Todo handler que lee body lo valida con Zod | POP-C0-01 / R9 |
| 02 | `mutations-have-authz.test.ts` | Toda **mutación** está autorizada (requireScope inline o guard de middleware) | POP-C0-01 |
| 02b | `routes-require-auth.test.ts` | **Todo** route handler (incl. GET) está autorizado — cierra fugas de lectura de PII | POP-C0-01 |

## Notas de adaptación

- **02** acepta dos patrones de autz: `requireScope()` inline (rutas `/v1/*`) **o**
  el guard de `middleware.ts` para las rutas legacy `/api/buk/<entity>` (POP-C0-01,
  que bloquea no-admins a nivel middleware). El allowlist `LEGACY_MIDDLEWARE_GUARDED`
  documenta exactamente qué rutas dependen del middleware y se vacía cuando Sprint 0
  elimine los endpoints legacy.
- **09** valida contra los schemas locales `@/lib/api/schemas/*` (en vez de
  `@poppins/contracts`, que todavía no existe).
