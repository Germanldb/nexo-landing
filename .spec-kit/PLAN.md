# PLAN.md — Estructura Técnica del Proyecto

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Astro | ^7.0.7 |
| CSS | Tailwind CSS | ^3.4.1 |
| Animaciones | GSAP + ScrollTrigger | ^3.14.2 |
| Icons | Font Awesome (CDN) + lucide-astro | 6.5.1 / ^0.363.0 |
| Backend | Express.js | ^4.21.2 |
| Base de datos | MySQL | 8.4 |
| Runtime | Node.js | 20 (Alpine) |
| Web server | Nginx | Alpine |
| Package manager | pnpm | 10.13.1 |
| Containers | Docker + Docker Compose | — |
| Image optimization | sharp | ^0.33.5 |

## Estructura de directorios

```
nexo-landing/
├── api/                          # Backend Express
│   ├── Dockerfile                # Node 20 Alpine
│   ├── package.json              # express + mysql2
│   └── src/
│       ├── index.js              # Server principal (rutas, validación, DB)
│       ├── auth.js               # Sesiones HMAC-SHA256
│       └── migrate.js            # Migraciones + purge de papelera
│
├── db/
│   └── init.sql                  # Schema: tabla captaciones
│
├── nginx/
│   └── nginx.conf                # Proxy inverso /api/ → api:3000
│
├── public/
│   ├── data/geo/*.json           # Generados en build (21 países)
│   ├── *.svg, *.png              # Assets estáticos
│   └── reconciliation/           # Imágenes de canales de pago
│
├── scripts/
│   ├── generate-geo.mjs          # Build-time geo data generator
│   └── sources/venezuela.json    # Datos fuente Venezuela
│
├── src/
│   ├── assets/
│   │   └── img-docs/             # Capturas del manual (doc-01…doc-56.png)
│   │       ├── doc-XX.png        # Screenshots del panel Nexo
│   │       └── FALTANTES.txt     # Integradas / descartadas / próximo número
│   ├── components/               # Componentes Astro (.astro)
│   │   ├── Header.astro          # Nav fijo + toggle dark/light (landing; NO en docpage)
│   │   ├── Hero.astro            # Hero con laptop preview
│   │   ├── ProblemSection.astro  # 3 pain points
│   │   ├── ReconciliationSection.astro  # Demo interactiva 6 canales
│   │   ├── MapSection.astro      # Mapa LATAM con pulsos
│   │   ├── EcosystemSection.astro # Grid 17 módulos
│   │   ├── FAQSection.astro      # 8 accordions
│   │   ├── CTASection.astro      # Call to action final
│   │   ├── Footer.astro          # Footer
│   │   ├── ExpoIspRegistrationForm.astro  # Form 743 líneas
│   │   └── doc/                  # Manual de usuario (22 secciones + DocImage)
│   │       ├── DocImage.astro    # Figure + Image (astro:assets) + caption
│   │       ├── intro.astro … faq-doc.astro  # Secciones 1–22 (ver SPEC.md)
│   ├── data/
│   │   └── geo-hispano.ts        # Tipos + índice de 21 países
│   ├── layouts/
│   │   └── BaseLayout.astro      # Shell HTML, GSAP, dark mode init
│   ├── pages/
│   │   ├── index.astro           # Landing page principal
│   │   ├── registro-expoisp.astro # Formulario de captación
│   │   ├── terminos.astro        # Términos y condiciones
│   │   ├── 404.astro             # Página 404 personalizada
│   │   ├── doc/
│   │   │   ├── docpage.astro     # Manual: sidebar acordeón + 22 secciones
│   │   │   └── doc-nexo.md       # Fuente markdown (referencia; no es la ruta pública)
│   │   └── admin/
│   │       ├── index.astro       # Login admin
│   │       └── captaciones.astro # Dashboard de leads
│   ├── scripts/
│   │   └── landing-theme.ts      # Lógica toggle dark/light
│   └── styles/
│       └── global.css            # CSS vars, dark mode, forms, doc-card/figure/nav
│
├── .spec-kit/                    # Contexto del proyecto
│   ├── CONSTITUTION.md           # Reglas de oro
│   ├── SPEC.md                   # Qué es y por qué existe
│   └── PLAN.md                   # Estructura técnica (este archivo)
├── astro.config.mjs              # Config Astro (static, Tailwind, proxy)
├── tailwind.config.mjs           # Design tokens Nexo
├── Dockerfile                    # Multi-stage: build Astro → Nginx
├── docker-compose.yml            # 3 servicios: web, api, db
└── .env.example                  # Variables de entorno de ejemplo
```

## Arquitectura Docker

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  web:80     │────▶│  api:3000   │────▶│  db:3306    │
│  Nginx      │     │  Express    │     │  MySQL 8.4  │
│  Astro SPA  │     │  Node 20    │     │  clientes_  │
│             │     │             │     │  captacion  │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **web:** Archivos estáticos + proxy `/api/` → api:3000. Puerto expuesto: `${WEB_PORT:-8081}`.
- **api:** Solo interno. Healthcheck cada 5s vía `wget /health`.
- **db:** MySQL con volumen persistente `db_data`. Init script: `db/init.sql`.

## Base de datos

### Tabla: `captaciones`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INT AUTO_INCREMENT PK | Identificador único |
| `nombre` | VARCHAR(255) NOT NULL | Nombre completo |
| `cargo` | VARCHAR(255) NOT NULL | Cargo/rol |
| `whatsapp` | VARCHAR(30) NOT NULL | Teléfono con código país |
| `email` | VARCHAR(255) NOT NULL | Email corporativo |
| `empresa` | VARCHAR(255) NOT NULL | Nombre ISP |
| `num_clientes` | VARCHAR(50) | Rango de clientes |
| `pais` | VARCHAR(100) | País |
| `estado` | VARCHAR(100) | Estado/provincia |
| `ciudad_region` | VARCHAR(255) | Ciudad |
| `infraestructura` | VARCHAR(50) | WISP/FTTH/Hybrid |
| `soluciones` | JSON | Array de soluciones seleccionadas |
| `rsg_marcas` | JSON | Array de marcas hardware |
| `rsg_marcas_otro` | VARCHAR(255) | Texto libre "otros" marcas |
| `software_actual` | VARCHAR(50) | Software de facturación actual |
| `software_otro` | VARCHAR(255) | Texto libre "otro" software |
| `inconvenientes_sistema` | TEXT | Pain points |
| `expectativas` | TEXT | Qué esperan de Nexo |
| `fecha_ingreso` | TIMESTAMP DEFAULT NOW | Fecha de captación |
| `deleted_at` | TIMESTAMP NULL | Soft delete (retención 3 días) |

**Índices:** `fecha_ingreso`, `email`, `deleted_at`.

## API endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | No | Healthcheck DB |
| `POST` | `/registro` | No | Crear lead |
| `POST` | `/admin/login` | No | Login admin → cookie |
| `POST` | `/admin/logout` | No | Limpiar sesión |
| `GET` | `/admin/session` | No | Verificar sesión válida |
| `GET` | `/captaciones` | Admin | Listar leads (paginado, filtro papelera) |
| `DELETE` | `/captaciones/:id` | Admin | Soft delete |
| `POST` | `/captaciones/:id/restaurar` | Admin | Restaurar de papelera |

## Enrutamiento Astro (archivos → URLs)

| Archivo | URL |
|---|---|
| `src/pages/index.astro` | `/` |
| `src/pages/registro-expoisp.astro` | `/registro-expoisp` |
| `src/pages/terminos.astro` | `/terminos` |
| `src/pages/404.astro` | `/404` |
| `src/pages/doc/docpage.astro` | `/doc/docpage` |
| `src/pages/admin/index.astro` | `/admin` |
| `src/pages/admin/captaciones.astro` | `/admin/captaciones` |

## Variables de entorno

```env
MYSQL_PASSWORD=nexo_secret
MYSQL_ROOT_PASSWORD=root_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=lmujica
ADMIN_SESSION_SECRET=cambia-este-secreto-en-produccion
WEB_PORT=8081
```

## Comandos clave

```bash
pnpm dev                    # Dev server con proxy a API
pnpm run build              # generate-geo + astro build
docker-compose up --build   # Desarrollo completo
docker-compose up -d        # Producción
```

## Design tokens (Tailwind)

| Token | Valor | Uso |
|---|---|---|
| `nexo-primary` | `#B3CD1D` | Verde lima primario |
| `nexo-dark` | `#0D2E34` | Teal oscuro marca |
| `nexo-bg-base` | `#ffffff` / `#1a1d21` | Fondo página (light/dark) |
| `nexo-bg-surface` | `#f8fafc` / oscuro | Superficie cards |
| `nexo-bg-elevated` | `#ffffff` / `#2d323a` | Superficie elevada (cards, sidebar) |
| `nexo-border` | `#e2e8f0` / `#3f4650` | Bordes |
| `nexo-text` | `#1e293b` / `#e4e7ec` | Texto primario |

## Clases de componentes reutilizables

| Clase | Descripción |
|---|---|
| `nexo-form-card` | Card elevada con sombra y borde |
| `nexo-form-submit` | Botón primario lime/oscuro |
| `nexo-form-input` | Input con focus ring |
| `nexo-form-label` | Label uppercase extrabold |
| `nexo-brand-tag` | Tag seleccionable pill con dot indicator |
| `gsap-reveal` | Trigger de animación scroll |
| `preserve-brand-colors` | Eximir del dark mode override |
| `doc-card` | Card para pasos/listas del manual (elevated bg, border, hover) |
| `doc-section-divider` | Separador horizontal entre secciones |
| `doc-code-inline` | Código inline con fondo lime transparente |
| `doc-figure` / `-frame` / `-img` / `-caption` | Screenshot del manual vía `DocImage` |
| `doc-nav` / `-group` / `-toggle` / `-link` | Nav lateral agrupada (acordeón + active) |

## Layout de documentación

```
┌──────────┬──────────────────────────────────────────────┐
│ Sidebar  │ Contenido (sin Header de landing)            │
│ top-0    │                                              │
│ h-screen │ padding superior contenido (sin hueco extra) │
│ w-72/80  │                                              │
│          │                                              │
│ Manual   │ Grupos nav (acordeón):                       │
│ Nexo     │   Introducción / Primeros pasos / Módulos… │
│          │                                              │
│ • Grupo  │ Sección + DocImage + pasos compactos         │
│  ▾ items │ …                                            │
│ Scroll   │ FAQ                                          │
│ spy      │ [Volver al inicio]                           │
└──────────┴──────────────────────────────────────────────┘
```

### Cómo extender el manual
1. Nuevo componente en `src/components/doc/` con `Props { id?: string }`.
2. Importarlo y montarlo en `docpage.astro`; añadir entrada en `navGroups`.
3. Captura nueva: `doc-XX.png` en `img-docs/`, importar y usar `<DocImage />`; actualizar `FALTANTES.txt`.
4. Mantener densidad + info operativa (R11 en CONSTITUTION).

- **Sidebar:** Fixed `top-0` `h-screen`, `w-72`/`w-80`, acordeón + scroll spy
- **Contenido:** `flex-1`, sin max-width, sin Header global
- **Mobile:** Sidebar hidden, hamburger toggle, overlay
