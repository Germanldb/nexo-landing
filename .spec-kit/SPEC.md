# SPEC.md — Qué es Nexo Landing y Por qué existe

## Problema que resuelve

Los ISPs (proveedores de servicio de internet) en Latinoamérica operan con sistemas desconectados: facturación aparte, soporte aparte, monitoreo aparte, pagos aparte. Esto genera:

1. **Pérdida de ingresos** por procesos manuales de cobranza y reconciliación.
2. **Falta de visibilidad operativa** — no saben qué está pasando en tiempo real.
3. **Experiencia fragmentada** para el cliente final (portal, WhatsApp, pagos).

**Nexo** es la plataforma SaaS que centraliza todo: facturación, pagos, red, soporte, inventario, logística y expansión en un solo sistema.

## Qué es este repositorio

Este **NO** es el producto Nexo. Es el **sitio de marketing y captación de leads**:

| Componente | Función |
|---|---|
| Landing page (`/`) | Página de larga duración que comunica valor, módulos, cobertura LATAM y FAQ |
| Formulario Expo ISP (`/registro-expoisp`) | Formulario de captación de leads para ferias/Expo ISP con geo-cascading y detección de carrier |
| Panel Admin (`/admin/`) | CRM básico para ver, buscar, restaurar y eliminar leads captados |
| API (`/api/`) | Backend Express para persistir leads en MySQL y autenticar admin |
| Documentación (`/doc/docpage`) | Manual de usuario Nexo (22 secciones + capturas), sidebar acordeón y scroll spy |

## Audiencia objetivo

- **Primaria:** Dueños y gerentes de ISPs en Latinoamérica (21 países hispanos).
- **Secundaria:** Equipos técnicos que evalúan infraestructura (MikroTik, OLT, FTTH, WISP).
- **Contexto:** Ferias como Expo ISP donde se capturan leads presencialmente.

## Sistema de Documentación

Manual operativo del panel Nexo para operadores ISP (no es API reference). Debe servir para consultar flujos diarios (caja, ficha, red, portal) sin relleno mecánico.

### Estructura
- **Ruta:** `/doc/docpage` (única ruta pública del manual)
- **Layout:** Sin `Header` de landing; sidebar full-height (`top-0`) + contenido principal flexible
- **Secciones:** 22 componentes en `src/components/doc/` (`Props { id?: string }`)
- **Imágenes:** `DocImage.astro` + `src/assets/img-docs/doc-XX.png` (optimizadas por Astro/`sharp`)
- **Inventario:** `src/assets/img-docs/FALTANTES.txt` — integradas, descartadas a propósito, siguiente número libre
- **Estilos:** `.doc-card`, `.doc-section-divider`, `.doc-code-inline`, `.doc-figure*`, `.doc-nav*` en `global.css`
- **Dark mode:** CSS variables del design system Nexo

### Criterios de contenido
- Explicaciones densas pero **completas**: campos del wizard, pasos de cobro/ONU, avisos (ej. precio de perfil no actualiza clientes ya contratados), conciliación, informar pago + aprobación en Finanzas.
- Layout compacto: grids, `mb-16`, intros `text-sm`, captions cortas.
- Evitar boilerplate “Menú:…”, “¿Para qué sirve?”, “Vaya a…” redundante con título/screenshot.
- No pie de versión ni texto “actualice este manual…”.

### Secciones del manual (22)
1. Introducción — Qué es Nexo, audiencias, portales admin/cliente, SPA
2. Conceptos básicos — Glosario ampliado (~40 términos en 4 grupos: clientes, red, facturación, inventario)
3. Acceso al sistema — Login, problemas comunes, cerrar sesión, cambiar contraseña
4. Barra superior — Buscar, pago rápido `$`, notificaciones, tema, menú usuario (capturas doc-55/56)
5. Dashboard — Métricas, gráficos, alertas
6. Gestión de Red — Routers, Smart/AdminOLT, Redes, Monitoreo, NAP, Tráfico, IPs Visitadas, BlackList
7. Servicios y perfiles — Internet (campos + aviso de precio), Voz, CATV, Personalizado, IPTV
8. Promociones — Crear ofertas, vigencia, aplicación al alta
9. Clientes — Listado/acciones, wizard 3 pasos, mapa, anuncios, push, instalaciones, contratos, correos
10. Ficha del cliente — Centro de operaciones; pestañas, estado, suspender/activar, pago, ONU, herramientas (doc-52)
11. Fichas Hotspot — Inventario, impresion/SMS/ventas, routers, plantillas
12. Tareas y planificación — Crear, instalación, controles, calendario, monitoreo vehicular
13. Finanzas — Facturas, Registrar Pagos (doc-53), masivos, transacciones, pago móvil, pasarelas, dólar, SyH, estadísticas, reportes portal
14. Almacén — Categorías, proveedores, ingresar producto, asignar a instalación
15. Reportes — Tipos de reporte y cómo generar
16. Soporte y tickets — Estados, atender (respuesta vs nota), crear, Zendesk
17. Mensajería — Enviados/recibidos, enviar SMS desde ficha o módulo
18. Ajustes generales — Hub de config + crear operador, portal, pasarela
19. Portal del cliente — Login, menú configurable, pagar, tickets, informar pago (doc-54)
20. Flujos de trabajo — Alta, instalación, caja, morosidad, hotspot, soporte
21. Permisos y roles — Roles y áreas de permiso
22. Preguntas frecuentes — Accordion por categoría (sin pie de documento)

### Capturas esenciales ya integradas
| Archivo | Sección |
|---|---|
| `doc-01`…`doc-50` | Módulos varios (mapa en FALTANTES / componentes) |
| `doc-52` | Ficha del cliente |
| `doc-53` | Finanzas → Registrar Pagos |
| `doc-54` | Portal del cliente |
| `doc-55` / `doc-56` | Barra superior + menú usuario |

Descartado a propósito (no saturar): login admin, wizard alta paso a paso, 2FA, PlaceToPay dedicado, etc. (ver `FALTANTES.txt`).

### Navegación lateral
- Grupos tipo docs (Introducción, Primeros pasos, Módulos, Análisis, Configuración, Portal/flujos, Referencia)
- Acordeón: colapsado por defecto; un grupo abierto; scroll spy abre el grupo activo y marca el link
- IntersectionObserver + scroll suave
- Mobile: hamburger + overlay
- Sidebar: `w-72` (lg) / `w-80` (xl)

## Módulos del ecosistema Nexo (comunicados en la landing)

### Admin & Finanzas
- Facturación automatizada
- Reconciliación bancaria
- Módulo Cashea (financiamiento)
- Autopago y cortes automáticos
- Notificaciones WhatsApp

### Técnico & Red
- API de red (MikroTik)
- PPPoE / Hotspot / Radius
- Smart OLT / FTTH
- Auditoría de tráfico
- Monitoreo de equipos
- Tickets de soporte

### Logística & Expansión
- Inventario de almacén
- Multi-sucursal
- Portal de clientes
- Planes y servicios
- VoIP
- Integración IA

## Cobertura geográfica

10 países con marcadores activos en el mapa:
México, Guatemala, Puerto Rico, Colombia, Venezuela, Ecuador, Perú, Brasil, Argentina, Chile.

Total de países con geo-data para el formulario: 21 países hispanos.

## Canales de pago (módulo de reconciliación)

6 canales destacados en la landing:
1. Cashea (cuotas/financiamiento)
2. Pago Móvil
3. Transferencia bancaria
4. Pagos C2P
5. Mercado Pago
6. PayPal

## Formulario de captación — campos clave

| Sección | Campos |
|---|---|
| Contacto | Nombre, cargo, WhatsApp (con selector de país y carrier Venezuela), email corporativo |
| ISP | Empresa, rango de clientes (4 opciones), país, estado, ciudad, tipo de infraestructura |
| Soluciones | Multi-select: RSG, Nexo, Callme + marcas de hardware (14 opciones) si selecciona RSG |
| Stack actual | Software de facturación actual, inconvenientes, expectativas |

## Decisiones de diseño

- **Tipografía:** Inter (Google Fonts, pesos 300–800).
- **Paleta primaria:** Verde lima `#B3CD1D` sobre fondo oscuro teal `#0D2E34`.
- **Modo oscuro:** Implementado con CSS custom properties y clase `html.theme-dark`.
- **Animaciones:** GSAP + ScrollTrigger, con respeto a `prefers-reduced-motion`.
- **Componentes:** Cards elevadas, pills navegables, tags seleccionables con `:has()`.
