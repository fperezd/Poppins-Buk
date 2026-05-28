# Architecture Fitness Functions

> Tests automatizados que validan que la arquitectura se respeta. Si fallan, CI rojo, no se mergea PR.
>
> Definidos en ADR-001 y PLAN_MAESTRO.md §19.2.

## Cómo correrlos

```bash
npm run fitness          # corre todos
npm run fitness -- --grep "no-cross"   # corre subset
```

## Cómo instalar

Estos archivos viven en `tests/fitness/` de cada repo. Copy correspondientes según el lane:

| Fitness function | Aplica a |
|---|---|
| 01-no-cross-repo-imports | api-id · api-buk · web |
| 02-api-routes-have-scope | api-id · api-buk |
| 03-web-uses-api-client | web |
| 04-mutations-validate-tenant | api-id · api-buk |
| 05-contracts-version-locked | api-id · api-buk · web (runs en CI compartido) |
| 06-no-secrets-in-code | TODOS |
| 07-bundle-size-budget | web |
| 08-no-typescript-suppressions | TODOS |
| 09-handlers-use-zod-validation | api-id · api-buk |
| 10-buk-sdk-only-in-api-buk | api-id (verifica que NO usa SDK directamente) |

## Política

- **PR no se mergea si UN solo fitness function falla.** Sin excepciones.
- Si necesitás temporalmente saltar uno: abrir PR en `poppins-contracts` documentando excepción con razón + fecha expiración.
- Fitness suite corre también en push a `main` post-merge (defense in depth).

## Stack

- Vitest para los tests
- glob para file scanning
- @poppins/contracts metadata para version locking

## TODO antes de Sprint 1

- [ ] Implementar dependencias: `npm i -D vitest glob`
- [ ] Crear script `npm run fitness` en package.json: `vitest run tests/fitness`
- [ ] Agregar a CI: `npm run fitness` después de `npm run test`
