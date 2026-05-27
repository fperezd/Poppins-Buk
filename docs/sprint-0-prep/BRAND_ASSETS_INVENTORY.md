# 🎨 Brand Assets Inventory — Poppins v1.0

> Inventario de assets disponibles del Manual de Marca Poppins v1.0 + plan de distribución a `poppins-web/public/`.
>
> Fuente: `Poppins_Kit_Marca/` (en raíz del repo) provisto por CTO.

## 📦 Assets disponibles hoy

### `01_Logos/` — Logos completos con wordmark

| Archivo | Descripción | Uso recomendado |
|---|---|---|
| `poppins_logo_fondo_azul.png` | Logo sobre fondo navy `#0B0D2B` | Login hero · Email signatures · Decks |
| `poppins_logo_fondo_blanco.png` | Logo sobre fondo blanco | Documentos · Reportes PDF · Materiales impresos |
| `poppins_logo_fondo_negro.png` | Logo sobre fondo negro puro | Casos especiales (impresión 1 tinta) |
| `poppins_logo_monocromo_azul.png` | Monocromo navy | Documentos formales |
| `poppins_logo_monocromo_blanco_fondo_negro.png` | Monocromo blanco | Print 1 tinta, contextos limitados |
| `poppins_logo_transparente_para_fondo_claro.png` | PNG transparente, textos dark | Overlays sobre imágenes claras |
| `poppins_logo_transparente_para_fondo_oscuro.png` | PNG transparente, textos light | Overlays sobre imágenes oscuras |

### `02_Isotipo/` — Solo el isotipo (paraguas + casa + arco)

| Archivo | Uso |
|---|---|
| `poppins_isotipo_fondo_azul.png` | Avatar admin (perfil), redes sociales |
| `poppins_isotipo_fondo_blanco.png` | Documentos formales |
| `poppins_isotipo_monocromo_azul.png` | Contexto monocromo |
| `poppins_isotipo_transparente.png` | Sidebar colapsada (<140px), favicon variants |

### `03_Favicon/` — Favicons multi-size

| Archivo | Size | Uso |
|---|---|---|
| `poppins_favicon.ico` | Multi-size ICO | Browser tabs (legacy support) |
| `poppins_favicon_16x16.png` | 16×16 | Browser tabs |
| `poppins_favicon_32x32.png` | 32×32 | Browser tabs HiDPI |
| `poppins_favicon_64x64.png` | 64×64 | Apple shortcuts |
| `poppins_favicon_128x128.png` | 128×128 | macOS dock |
| `poppins_favicon_256x256.png` | 256×256 | Windows tiles |
| `poppins_favicon_512x512.png` | 512×512 | iOS apple-touch-icon, Android home screen |

### `04_Manual/` — Manual de Marca

| Archivo | Contenido |
|---|---|
| `Poppins_Manual_de_Marca.pdf` | Manual v1.0 (5 colores, gradiente, tipografía, sistema de logo, usos) |

### `05_Preview/` — Lámina visual

Preview sheet con todos los assets en contexto.

## 📐 Plan de distribución a `poppins-web/public/`

Cuando se cree el repo `poppins-web` en Sprint 0 Día 4, mover los assets así:

```
poppins-web/public/
├── favicon.ico                          ← copia de poppins_favicon.ico
├── favicon-16x16.png                    ← copia
├── favicon-32x32.png                    ← copia
├── favicon-64x64.png                    ← copia
├── favicon-128x128.png                  ← copia
├── favicon-256x256.png                  ← copia
├── favicon-512x512.png                  ← copia
├── apple-touch-icon.png                 ← copia de poppins_favicon_512x512.png renombrada
├── android-chrome-192x192.png           ← derivar de 256x256 (TODO Sprint 1)
├── android-chrome-512x512.png           ← copia de favicon_512x512
├── manifest.json                        ← generar
│
├── poppins-logo-full-dark.png           ← copia de poppins_logo_fondo_azul.png
├── poppins-logo-full-light.png          ← copia de poppins_logo_fondo_blanco.png
├── poppins-logo-mono.png                ← copia de poppins_logo_monocromo_azul.png
├── poppins-logo-transparent-light.png   ← copia de poppins_logo_transparente_para_fondo_claro.png
├── poppins-logo-transparent-dark.png    ← copia de poppins_logo_transparente_para_fondo_oscuro.png
│
├── poppins-isotipo.png                  ← copia de poppins_isotipo_transparente.png (default uso)
├── poppins-isotipo-dark.png             ← copia de poppins_isotipo_fondo_azul.png
├── poppins-isotipo-light.png            ← copia de poppins_isotipo_fondo_blanco.png
├── poppins-isotipo-mono.png             ← copia de poppins_isotipo_monocromo_azul.png
│
└── og-image.png                         ← generar 1200x630 con gradiente brand (TODO Sprint 1)
```

## 🔧 Configuración en `app/layout.tsx`

```tsx
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'Poppins · ERP Doméstico',
    template: '%s · Poppins',
  },
  description: 'ERP de RRHH para el hogar. Gestiona nanas, cocineras y cuidadoras con la potencia de BUK. Magia en tu casa.',
  metadataBase: new URL('https://poppins.cl'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Poppins · ERP Doméstico',
    description: 'Magia en tu casa. La potencia de BUK al alcance de tu familia.',
    url: 'https://poppins.cl',
    siteName: 'Poppins',
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'Poppins ERP Doméstico' },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poppins · ERP Doméstico',
    description: 'Magia en tu casa.',
    images: ['/og-image.png'],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D2B' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

## 📝 manifest.json a generar

```json
{
  "name": "Poppins · ERP Doméstico",
  "short_name": "Poppins",
  "description": "Magia en tu casa. ERP doméstico con BUK.",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#0B0D2B",
  "theme_color": "#FF2CA0",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## ⚠️ Limitaciones actuales

- **Solo PNGs disponibles.** No hay SVGs vectoriales. PNG escala con calidad limitada en zoom.
- **TODO Sprint 1:**
  - Vectorizar logos con `potrace` o re-trazar en Figma para tener SVGs limpios
  - Generar `og-image.png` 1200×630 con composición de marca
  - Generar `android-chrome-192x192.png` desde 256×256
  - Generar versión "dark mode" del logo full si Manual lo define

## 🎯 Reglas del logo (Manual pág. 02-04)

Recordatorio para todos los agentes:

- ❌ NO deformar (no `transform: scale(x,y)` con valores distintos)
- ❌ NO cambiar colores (paleta oficial únicamente)
- ❌ NO aplicar efectos al logo (no `box-shadow`, no `filter`, no contornos)
- ❌ NO fondos complejos detrás del logo (fotos, texturas)
- ✅ Tamaño mínimo digital: 140px
- ✅ Área de seguridad: ancho del isotipo (`x`) en los 4 lados
- ✅ Sidebar colapsada (<140px): usar SOLO isotipo, no logo full

## 🚦 Asignación de responsabilidad

- **Owner de assets:** Product Lead (desde Sprint 5)
- **Interim:** CTO (Sprint 0-4)
- **Cualquier cambio al logo o paleta:** requiere update del Manual de Marca + nuevo número de versión
