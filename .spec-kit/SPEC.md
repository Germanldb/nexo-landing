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
| Documentación (`/doc/docpage`) | Manual completo de usuario con22 secciones, sidebar sticky y scroll spy |

## Audiencia objetivo

- **Primaria:** Dueños y gerentes de ISPs en Latinoamérica (21 países hispanos).
- **Secundaria:** Equipos técnicos que evalúan infraestructura (MikroTik, OLT, FTTH, WISP).
- **Contexto:** Ferias como Expo ISP donde se capturan leads presencialmente.

## Sistema de Documentación

### Estructura
- **Ruta:** `/doc/docpage` (única ruta de documentación)
- **Layout:** Sidebar fijo izquierdo + contenido principal sin restricción de ancho
- **Componentes:**22 secciones en `src/components/doc/` (cada una es un componente Astro independiente)
- **Estilos:** Clases reutilizables en `global.css` (`.doc-card`, `.doc-section-divider`, `.doc-code-inline`)
- **Dark mode:** Soportado vía CSS variables heredadas del sistema de diseño

### Secciones del manual (22)
1. Introducción — Qué es Nexo, para quién, dos portales, SPA
2. Conceptos básicos — Glosario de15 términos clave
3. Acceso al sistema — Login, problemas comunes, cerrar sesión, cambiar contraseña
4. Barra superior — Buscar cliente, pago rápido, notificaciones, dark mode, menú usuario
5. Dashboard — Métricas, gráficos, alertas, cómo consultar
6. Gestión de Red — Routers, OLT, Redes, Monitoreo, NAP, Tráfico, IPs, BlackList
7. Servicios y perfiles — Internet, Voz, CATV, Personalizado, IPTV
8. Promociones — Crear ofertas, descuentos, vigencia
9. Clientes — Listado, wizard alta, mapa, anuncios, push, instalaciones, contratos
10. Ficha del cliente — 8 pestañas, suspender/activar, pago, ONU, herramientas
11. Fichas Hotspot — Inventario, routers, plantillas, ventas, SMS
12. Tareas y planificación — Crear, gestionar, cronología, monitoreo vehicular
13. Finanzas — Facturas, pagos, transacciones, pago móvil, pasarelas, SyH, estadísticas
14. Almacén — Categorías, proveedores, productos, asignar a instalación
15. Reportes — 5 tipos de reportes, cómo generar
16. Soporte y tickets — Tickets interno, estados, crear, Zendesk
17. Mensajería — SMS/WhatsApp, enviar mensajes
18. Ajustes generales — 6 sub-secciones, crear operador, portal, pasarelas
19. Portal del cliente — Login, menú, dashboard, pagar, tickets, informar pago
20. Flujos de trabajo — 6 flujos visuales con pasos numerados
21. Permisos y roles — Roles, 12 áreas de permisos, solicitar acceso
22. Preguntas frecuentes — 8 preguntas comunes en accordion

### Funcionalidades del sidebar
- Scroll spy con IntersectionObserver (resalta sección visible)
- Navegación con scroll suave (`scroll-behavior: smooth`)
- Toggle mobile con hamburger button + overlay
- Transiciones opacity para mobile sidebar
- Scrollbar personalizado en desktop (4px width)
- Sidebar responsive: `w-72` (lg) / `w-80` (xl)

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
