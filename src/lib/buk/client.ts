/**
 * DEPRECATED — Archivo neutralizado el 2026-05-09 (Fase 0 de cleanup).
 *
 * Este cliente HTTP usaba:
 *   - Header de auth incorrecto (`Authorization: Bearer ...` en lugar de `auth_token: ...`)
 *   - Base URL incorrecta por default (`/api/v1` sin `/chile`)
 *   - Endpoints fantasma (`/absence_requests`, `/benefits`) que no existen en el Swagger oficial de Buk
 *
 * Nadie lo importaba ya. Toda la integracion con Buk va por:
 *   - `@/lib/buk-sdk` -> cliente moderno tipado (BukHttpClient + modulos)
 *   - `@/lib/buk` (index.ts) -> service layer que decide mock / Supabase / SDK
 *
 * No re-implementar aqui. Si necesitas un endpoint nuevo, agregarlo al modulo
 * correspondiente en `src/lib/buk-sdk/modules/`.
 */
export {};
