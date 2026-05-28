# ADR-006: shadcn/ui style `base-nova` como component foundation

**Status:** Accepted
**Date:** 2026-05-27
**Decision-makers:** CTO + Product Lead (Sprint 5+)
**Categoría:** Técnica · Producto

## Contexto

`poppins-web` necesita design system implementado en código React. Hoy el front es custom-built (inline styles + Tailwind utilities mezcladas). Para escalar el equipo de design system tenemos que elegir entre:

1. Construir propio desde cero
2. Material UI (MUI)
3. Chakra UI
4. shadcn/ui
5. Mantine
6. Ant Design

Adicionalmente, ya existe `qavante-web` que usa **shadcn `base-nova`** (Qavante es producto hermano de Tooxs). Convergencia entre productos Tooxs es deseable.

Manual de marca Poppins v1.0 define:
- 5 colores corporativos + gradiente firma
- Tipografía Poppins (Google Fonts)
- Sistema de radios 4/8/12/16

shadcn permite override total de tokens via CSS vars → compatible 100% con Manual de Marca.

## Decisión

**Adoptamos `shadcn/ui` con style `base-nova` + tokens Poppins v1.0 override.**

### Detalles de implementación

```json
// poppins-web/components.json
{
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle"
}
```

Tokens Poppins v1.0 override en `globals.css`:

```css
@import "tailwindcss";
@import "../../packages/ui/tokens/_base.css";
@import "../../packages/ui/tokens/poppins.css";

@theme inline {
  --color-primary: var(--pp-magenta);
  --color-primary-foreground: var(--pp-white);
  --color-secondary: var(--pp-purple);
  --color-accent: var(--pp-lavender);
  /* ... */
}
```

### Primitives a instalar en Sprint 1

8 primitives base (`npx shadcn@latest add ...`):

1. `button` — con variantes primary/secondary/destructive/outline/ghost
2. `input`
3. `label`
4. `card`
5. `dialog`
6. `tabs`
7. `badge`
8. `skeleton`

Plus 3 specific Poppins:

9. `sonner` (toast notifications)
10. `form` (con react-hook-form)
11. `table` (con TanStack Table)

## Consecuencias

### Positivas

- **No reinventamos la rueda.** shadcn tiene ~50 componentes maduros copy-paste.
- **Customización total.** Cada componente vive en tu repo, lo editás libremente.
- **Sin lock-in.** No es una dependencia npm con upgrade rituals, son archivos tuyos.
- **Compatibilidad con Manual de Marca.** Tokens via CSS vars permiten brand override sin tocar componentes.
- **Convergencia con Qavante:** mismo style `base-nova` permite eventualmente compartir `packages/ui` cross-producto.
- **Accessibility built-in** (basado en Radix/Base UI que son a11y-first).
- **TanStack Query/Table integration natural** (mismo ecosistema).
- **Storybook compatible** out-of-the-box.

### Negativas / Trade-offs

- **Cada componente copiado vive en tu repo:** mantener actualizaciones de shadcn upstream requiere re-copy manual (cuando un component bug se arregla aguas arriba).
- **Curva de aprendizaje** para devs que no conocen Radix/Base UI primitives.
- **Tailwind 4 dependency** (no usable en proyecto Tailwind 3).
- **Bundle size** moderado (componentes incluyen poligrass de Radix). Mitigación: tree-shaking.

### Neutras

- shadcn no es npm dependency tradicional. Es CLI + manifest.
- Componentes copiados, no instalados. Esto requiere disciplina al actualizar.

## Alternativas consideradas

### Alternativa A: Construir design system propio desde cero

**Pros:**
- Control absoluto.
- Sin dependencias.
- Optimizable al uso específico.

**Contras:**
- 4-6 sprints de inversión en infra de UI antes de hacer producto.
- A11y desde cero es trampa (años de tooling Radix maduros).
- Reinvención de la rueda.

**Por qué no la elegimos:** Tooxs es startup, no Spotify. No tenemos meses para reinventar primitives.

### Alternativa B: MUI (Material UI)

**Pros:**
- Maduro, masivo, documentado.
- Many components disponibles.

**Contras:**
- Estética Material Design no encaja con Manual Poppins (rosa/morado vibrant).
- Override de tokens más complejo (theme provider).
- Bundle size grande.
- Sensación "googly" no premium.

**Por qué no la elegimos:** No estética Poppins. Estilo MUI compite con identidad de marca.

### Alternativa C: Chakra UI

**Pros:**
- DX excelente.
- Tema config simple.
- A11y built-in.

**Contras:**
- Runtime emotion CSS-in-JS (lento, conflicto con RSC Next 16).
- Comunidad migrando hacia headless + Tailwind tras adopción RSC.

**Por qué no la elegimos:** RSC compatibility es deal-breaker en Next 16.

### Alternativa D: Mantine

**Pros:**
- Muy completo, +100 componentes.
- Hook-rich.

**Contras:**
- CSS-in-JS también.
- Estilo distintivo Mantine difícil de override profundo.
- Comunidad más chica que shadcn.

**Por qué no la elegimos:** Misma razón Chakra. Y comunidad shadcn supera.

### Alternativa E: Ant Design

**Pros:**
- Maduro, popular en enterprise.

**Contras:**
- Estética enterprise corporativa, no consumer.
- Override de estilo costoso.

**Por qué no la elegimos:** Estética anti-Poppins.

## Referencias

- shadcn/ui: <https://ui.shadcn.com/>
- Base UI: <https://base-ui.com/>
- `qavante-web/components.json` (referencia, style `base-nova`)
- `Poppins_Manual_de_Marca.pdf`
- `docs/PLAN_MAESTRO.md` §6 Design System Poppins v1.0

## Revisión

Re-evaluar:
- Cuando shadcn release v2 major (TBD).
- Cuando Base UI alcance feature parity con Radix (decisión upstream shadcn).
- Si Tailwind 5 saliera con breaking changes (TBD).
