# CONSTITUTION.md — Reglas de Oro del Proyecto Nexo Landing

## Identidad

- **Proyecto:** Nexo Landing Premium — sitio marketing + captación de leads para la plataforma Nexo (SaaS para ISPS en Latinoamérica).
- **Equipo:** Remote Solution Group (RSG).
- **Idioma:** Español (es_VE por defecto).

## Reglas Fundamentales

### R1 — El frontend es estático
- Astro corre en modo `output: 'static'`. No hay SSR en producción.
- Toda página nueva debe generar HTML estático en build time.
- Si se necesita dinamismo, se hace del lado del cliente (JS) o vía la API Express.

### R2 — Arquitectura de 3 capas
- **Web (Nginx):** Archivos estáticos de Astro + proxy inverso a `/api/`.
- **API (Express):** Backend Node.js en el puerto 3000, solo accesible internamente.
- **DB (MySQL 8.4):** Base de datos `clientes_captacion`, persistencia con volumen Docker.

### R3 — Un solo panel admin protegido
- Autenticación basada en cookie HMAC-SHA256, TTL de 24h.
- Credenciales por variables de entorno (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- Nunca hardcodear credenciales en el código fuente.

### R4 — Soft delete con retención de 3 días
- Los registros nunca se borran físicamente de inmediato.
- `deleted_at` marca el momento del borrado lógico.
- El purge automático elimina registros con más de 3 días en papelera.

### R5 — Diseño con soporte dark/light
- Todos los colores usan CSS custom properties (`--nexo-*`).
- El toggle se persiste en `localStorage`.
- Cualquier componente nuevo debe respetar ambos modos.
- Clase `preserve-brand-colors` para eximir secciones del override automático.

### R6 — Formularios con validación dual
- Validación en cliente (UX) + validación en servidor (seguridad).
- Nunca confiar solo en la validación del frontend.

### R7 — Geo data generado en build
- Los archivos `public/data/geo/*.json` se generan antes del build de Astro.
- Script: `scripts/generate-geo.mjs` con datos de 21 países hispanos.
- No editar manualmente los JSON generados.

### R8 — Responsive y accesibilidad
- Breakpoints: mobile-first con `md:` y `lg:`.
- Respetar `prefers-reduced-motion` para animaciones GSAP.
- Formularios con labels explícitos y aria attributes.

### R9 — Docker como único medio de despliegue
- `docker-compose.yml` orquesta los 3 servicios: web, api, db.
- El build del frontend es multi-stage: Node (build) → Nginx (runtime).
- Variables de entorno se inyectan por `.env` o entorno Docker.

### R10 — No romper el admin
- Cualquier cambio en la API debe ser retrocompatible con el admin existente.
- Los endpoints de admin (`/admin/*`, `/captaciones`) son contratos que otros consumen.

### R11 — Documentación como componentes Astro
- Los componentes de documentación van en `src/components/doc/`.
- Solo `docpage.astro` va en `src/pages/doc/` (es la única ruta pública del manual).
- Cada sección es un componente `.astro` independiente con interfaz `Props { id?: string }`.
- Capturas de pantalla: `src/assets/img-docs/doc-XX.png` vía `DocImage.astro` (`astro:assets` + lazy load).
- Inventario de capturas: `src/assets/img-docs/FALTANTES.txt` (integradas / descartadas / próximo número).
- Estilos en `global.css`: `.doc-card`, `.doc-section-divider`, `.doc-code-inline`, `.doc-figure*`, `.doc-nav*`.
- NO usar `@tailwindcss/typography` ni plugins externos para estilos de docs.
- Contenido: denso y consultable. Mantener pasos, campos, advertencias y flujos operativos; no vaciar la explicación “para ganar espacio”.
- Evitar tono mecánico: no repetir en cada bloque “Menú:…”, “¿Para qué sirve?” ni primer paso “Vaya a X → Y” si el título/screenshot ya lo dicen.
- Preferir grids, listas cortas y captions breves (sin eco del título). Párrafos cortos; lo operativo va en `.doc-card` con pasos numerados.
- No poner pie de versión ni mensajes “actualice este manual…” al final del documento.

### R12 — Layout de documentación
- La página del manual **no** monta el `Header` de la landing: el sidebar ocupa `top-0` / `h-screen`.
- Sidebar fijo izquierdo (`w-72` / `w-80` en xl), overflow-y-auto, scrollbar personalizado en desktop.
- Navegación agrupada en acordeón (`navGroups`): categorías colapsadas por defecto; una abierta a la vez; el scroll spy abre el grupo de la sección visible.
- Contenido principal sin max-width artificial; padding superior contenido (sin hueco de header).
- Mobile: hamburger + overlay con transición opacity.
- Botón “Volver al inicio” al final del contenido (discreto).
