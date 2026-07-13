# Nexo — Manual de Usuario Completo

**Versión del documento:** 1.0  
**Fecha:** Julio 2026  
**Sistema:** Nexo (Mikrowisp 6) — Plataforma de gestión para proveedores de internet (ISP)

---

## Tabla de contenidos

1. [Introducción](#1-introducción)
2. [Conceptos básicos y glosario](#2-conceptos-básicos-y-glosario)
3. [Acceso al sistema](#3-acceso-al-sistema)
4. [Panel de administración — Barra superior](#4-panel-de-administración--barra-superior)
5. [Dashboard](#5-dashboard)
6. [Gestión de Red](#6-gestión-de-red)
7. [Servicios y perfiles](#7-servicios-y-perfiles)
8. [Promociones](#8-promociones)
9. [Clientes](#9-clientes)
10. [Ficha del cliente (ViewUser)](#10-ficha-del-cliente-viewuser)
11. [Fichas Hotspot](#11-fichas-hotspot)
12. [Tareas y planificación](#12-tareas-y-planificación)
13. [Finanzas](#13-finanzas)
14. [Almacén](#14-almacén)
15. [Reportes](#15-reportes)
16. [Soporte y tickets](#16-soporte-y-tickets)
17. [Mensajería (SMS / WhatsApp)](#17-mensajería-sms--whatsapp)
18. [Ajustes generales](#18-ajustes-generales)
19. [Portal del cliente](#19-portal-del-cliente)
20. [Flujos de trabajo integrados](#20-flujos-de-trabajo-integrados)
21. [Permisos y roles](#21-permisos-y-roles)
22. [Preguntas frecuentes](#22-preguntas-frecuentes)

---

## 1. Introducción

### ¿Qué es Nexo?

Nexo es una plataforma integral para la gestión de proveedores de servicios de internet (ISP). Permite administrar clientes, facturación, pagos, red, instalaciones, soporte técnico, hotspot, almacén y más, desde un único panel web.

### ¿Para quién es este manual?

Este documento está dirigido a **operadores del ISP**: personal de caja, soporte técnico, instaladores, administradores de red y gerentes. No requiere conocimientos de programación.

### Dos portales, dos audiencias

| Portal | URL | Usuario |
|--------|-----|---------|
| **Panel Admin** | `/admin/` | Personal del ISP (operadores) |
| **Portal Cliente** | `/cliente/` | Abonados / clientes finales |

### Cómo navegar el panel admin

El panel admin funciona como una aplicación de una sola página (SPA). Al hacer clic en el menú lateral, la URL cambia con el formato `#ajax/nombre-modulo` pero la página no se recarga por completo. El contenido se carga dinámicamente en el área central.

---

## 2. Conceptos básicos y glosario

| Término | Significado |
|---------|-------------|
| **Cliente / Usuario** | Persona o empresa que contrata servicios del ISP |
| **Servicio** | Conexión activa (Internet, Voz, CATV, IPTV, etc.) asociada a un cliente |
| **Perfil** | Plan de servicio con velocidad, precio y reglas de facturación |
| **Router / Nodo** | Equipo MikroTik que gestiona la conexión del cliente |
| **OLT** | Equipo de fibra óptica (AdminOLT o SmartOLT) que gestiona ONUs |
| **ONU / ONT** | Equipo de fibra en casa del cliente |
| **NAP** | Caja de distribución de fibra en la calle |
| **Radius** | Servidor de autenticación de usuarios en la red |
| **Corte** | Suspensión automática del servicio por falta de pago |
| **Prepago** | El cliente paga antes de usar el servicio |
| **Postpago** | El cliente paga después de consumir el periodo |
| **Ficha Hotspot** | Ticket de acceso temporal a WiFi (PIN + usuario) |
| **Pasarela** | Integración con banco o procesador de pagos en línea |
| **Sucursal** | Sede o punto de operación del ISP |
| **Ticket** | Solicitud de soporte técnico del cliente |

---

## 3. Acceso al sistema

### 3.1 Iniciar sesión en el panel admin

**Paso a paso:**

1. Abra su navegador web (Chrome, Firefox o Edge recomendados).
2. Ingrese la URL del panel: `https://su-servidor/admin/`
3. Se mostrará la pantalla de login.
4. Ingrese su **usuario** y **contraseña** asignados por el administrador.
5. Si el sistema tiene autenticación de dos factores (2FA) activa, complete el código SMS, email o app autenticadora.
6. Presione **Iniciar sesión**.
7. Será redirigido al **Dashboard** (pantalla de inicio).

**Problemas comunes:**

| Problema | Solución |
|----------|----------|
| Usuario o contraseña incorrectos | Verifique mayúsculas/minúsculas. Contacte al administrador para restablecer. |
| Sesión expirada | Vuelva a iniciar sesión. El sistema cierra sesión automáticamente tras inactividad. |
| No veo ciertos módulos en el menú | Su rol no tiene permisos para esos módulos. Solicite acceso al administrador. |

### 3.2 Cerrar sesión

1. Haga clic en su **avatar o nombre** en la esquina superior derecha.
2. Seleccione **Cerrar Sesión**.
3. Será redirigido a la pantalla de login.

### 3.3 Cambiar contraseña

1. Clic en avatar → **Cambiar Contraseña**.
2. Ingrese contraseña actual y la nueva (dos veces).
3. Confirme con **Guardar**.

---

## 4. Panel de administración — Barra superior

La barra superior está siempre visible y ofrece accesos rápidos.

### 4.1 Buscar cliente

**Ubicación:** Campo de búsqueda con icono de lupa.

**Paso a paso:**

1. Escriba al menos 3 caracteres del nombre, cédula o código del cliente.
2. Aparecerá una lista desplegable con coincidencias.
3. Haga clic en el cliente deseado.
4. Se abrirá directamente su **ficha de cliente** (ViewUser).

> **Consejo:** Este es el acceso más rápido para atender a un cliente en mostrador o por teléfono.

### 4.2 Registrar pago rápido

**Ubicación:** Icono de dólar ($) en la barra superior.  
**Permiso requerido:** Widget de pago activo.

Redirige directamente al módulo **Registrar Pagos** sin pasar por el menú lateral.

### 4.3 Notificaciones

**Ubicación:** Icono de campana.

Muestra alertas del sistema: pagos recibidos, tickets pendientes, avisos de red, etc. Haga clic para ver el detalle y marcar como leídas.

### 4.4 Modo oscuro y personalización

- **Modo oscuro:** Botón luna/sol para alternar tema claro/oscuro.
- **Personalización:** Panel de colores para ajustar acentos primario y secundario del panel. Los cambios se guardan por usuario con **Guardar mi estilo**.

### 4.5 Menú de usuario

| Opción | Descripción |
|--------|-------------|
| Asistencia | Registro de asistencia del operador |
| Mi Perfil | Datos del operador logueado |
| Cambiar Contraseña | Actualizar credenciales |
| Cerrar Sesión | Salir del sistema |

---

## 5. Dashboard

**Menú:** Dashboard (primer ítem del menú lateral)  
**Ruta:** `/admin/` o `#ajax/home`

### ¿Para qué sirve?

Pantalla de inicio con métricas y resumen operativo del ISP: clientes activos, ingresos, desconexiones, gráficos de tráfico y alertas.

### Elementos principales

| Elemento | Descripción |
|----------|-------------|
| Saludo personalizado | Buenos días / tardes / noches según la hora |
| Tarjetas de métricas | Totales de clientes, facturación, pagos del periodo |
| Gráficos | Evolución de clientes, ingresos, tráfico |
| Alertas | Clientes desconectados, morosos, licencia |
| Accesos rápidos | Enlaces a módulos frecuentes |

### Paso a paso — Consultar métricas

1. Inicie sesión; el Dashboard se carga automáticamente.
2. Revise las tarjetas superiores para obtener cifras del día/mes.
3. Use los filtros de periodo (24h, 7 días, mes) en los gráficos si están disponibles.
4. Haga clic en cualquier métrica para ir al módulo detallado (si el enlace está activo).

---

## 6. Gestión de Red

**Menú:** Gestión de Red (menú expandible)

Esta sección agrupa todo lo relacionado con la infraestructura de red del ISP.

---

### 6.1 Routers

**Menú:** Gestión de Red → Routers  
**Permiso:** Gestión de Red → Router → Menú

#### ¿Para qué sirve?

Administrar los equipos MikroTik (routers) que dan servicio a los clientes: conexión, configuración, monitoreo y backups.

#### Paso a paso — Agregar un router

1. Vaya a **Gestión de Red → Routers**.
2. Haga clic en **Nuevo**.
3. Complete los campos:
   - **Nombre:** Identificador descriptivo (ej. "Nodo Centro").
   - **IP:** Dirección IP del MikroTik.
   - **Usuario / Contraseña:** Credenciales API del router.
   - **Coordenadas:** Ubicación GPS (opcional, para mapa).
4. Presione **Guardar**.
5. El router aparecerá en la lista con indicador de estado (conectado/desconectado).

#### Paso a paso — Editar un router

1. En la lista, haga clic en el router deseado o en el botón **Editar**.
2. Se abrirá la ficha con pestañas:

| Pestaña | Contenido |
|---------|-----------|
| Datos & Configuración | IP, credenciales, RADIUS, colas |
| Bloqueo de Páginas | Reglas de firewall |
| Mikrotik | Información en vivo del equipo |
| Gráficos | Tráfico histórico |
| Log | Eventos del router |
| Backups | Respaldos de configuración |

3. Modifique los campos necesarios y guarde.

#### Acciones disponibles

| Acción | Permiso |
|--------|---------|
| Nuevo router | Router → Nuevo |
| Editar | Router → Editar |
| Eliminar | Router → Eliminar |
| Backups Mikrotik | Enlace en barra superior de la lista |

---

### 6.2 Smart OLT / AdminOLT

**Menú:** Gestión de Red → Smart OLT o AdminOLT  
**Permiso:** Gestión de Red → Router → Menú (solo aparece el OLT configurado)

#### ¿Para qué sirve?

Gestionar equipos OLT de fibra óptica: autorizar ONUs, monitorear señal, configurar perfiles de velocidad en la OLT.

#### Paso a paso — Autorizar una ONU (desde ficha de cliente)

> La autorización de ONUs se realiza normalmente desde la **ficha del cliente** (ver sección 10). Aquí se describe la vista general del módulo OLT.

1. Vaya a **Gestión de Red → AdminOLT** (o Smart OLT).
2. Revise el listado de ONUs registradas.
3. Para autorizar una ONU nueva, vaya a la ficha del cliente → pestaña **Servicios** → botón **AdminOLT/SmartOLT**.
4. Seleccione la ONU pendiente de la lista de no autorizadas.
5. Haga clic en **Autorizar**.
6. Configure los parámetros WAN si aplica.
7. Guarde. La ONU quedará activa en la OLT y el servicio del cliente se habilitará.

---

### 6.3 Redes (IPv4 / IPv6)

**Menú:** Gestión de Red → Redes  
**Permiso:** Gestión de Red → IPv4 → Menú

#### ¿Para qué sirve?

Administrar pools de direcciones IP, subredes y asignaciones para clientes.

#### Paso a paso — Consultar pools de IP

1. Vaya a **Gestión de Red → Redes**.
2. Revise la lista de pools/subredes configuradas.
3. Cada pool muestra: rango, router asociado, IPs usadas vs disponibles.
4. Para asignar IP a un cliente, hágalo desde la ficha del cliente al crear/editar el servicio.

---

### 6.4 Monitoreo (Emisores)

**Menú:** Gestión de Red → Monitoreo  
**Permiso:** Gestión de Red → Monitoreo → Menú

#### ¿Para qué sirve?

Monitorear el estado de emisores inalámbricos, antenas y equipos de transmisión.

#### Paso a paso

1. Vaya a **Gestión de Red → Monitoreo**.
2. Revise la lista de emisores con indicadores de estado (online/offline).
3. Haga clic en un emisor para ver detalle: señal, clientes conectados, uptime.

---

### 6.5 Cajas NAP

**Menú:** Gestión de Red → Cajas Nap  
**Permiso:** Gestión de Red → NAP → Menú

#### ¿Para qué sirve?

Gestionar cajas de distribución de fibra óptica (NAP) en calle: ubicación, puertos, clientes conectados.

#### Paso a paso — Registrar una caja NAP

1. Vaya a **Gestión de Red → Cajas Nap**.
2. Haga clic en **Nuevo**.
3. Complete: nombre, ubicación (dirección/coordenadas), capacidad de puertos.
4. Guarde.
5. Al dar de alta clientes con fibra, asigne el puerto NAP correspondiente en la ficha del servicio.

---

### 6.6 Tráfico

**Menú:** Gestión de Red → Tráfico  
**Permiso:** Gestión de Red → Tráfico → Lista

#### ¿Para qué sirve?

Visualizar el consumo de ancho de banda por router, cliente o periodo.

#### Paso a paso

1. Vaya a **Gestión de Red → Tráfico**.
2. Seleccione el router o cliente a consultar.
3. Elija el rango de fechas.
4. Revise los gráficos de subida/bajada.
5. Exporte a Excel/PDF si necesita un reporte.

---

### 6.7 IPs Visitadas

**Menú:** Gestión de Red → Ips Visitadas  
**Permiso:** Gestión de Red → Tráfico → Lista visitadas

#### ¿Para qué sirve?

Ver qué sitios web o destinos IP visitan los clientes (requiere logging activo en el router).

---

### 6.8 Monitor BlackList

**Menú:** Gestión de Red → Monitor BlackList  
**Permiso:** Gestión de Red → Router → Menú

#### ¿Para qué sirve?

Monitorear y gestionar listas negras de IPs o dominios bloqueados en la red.

---

## 7. Servicios y perfiles

**Menú:** Servicios (menú expandible)

Los perfiles definen los planes de servicio que se ofrecen a los clientes.

---

### 7.1 Perfiles de Internet

**Menú:** Servicios → Internet  
**Permiso:** Servicios → Internet → Menú

#### ¿Para qué sirve?

Crear y administrar planes de internet: velocidad de bajada/subida, precio, tipo de conexión (PPPoE, Hotspot, DHCP), límites.

#### Paso a paso — Crear un perfil de Internet

1. Vaya a **Servicios → Internet**.
2. Haga clic en **Nuevo**.
3. Complete:
   - **Nombre del perfil:** Ej. "Plan 50 Mbps".
   - **Velocidad bajada / subida:** En Kbps o Mbps.
   - **Precio:** Monto mensual.
   - **Tipo de conexión:** PPPoE, Hotspot, DHCP, IP estática.
   - **Router asociado:** Nodo donde aplica.
   - **Límite de tráfico:** Opcional (GB mensuales).
4. Configure colas y reglas de MikroTik si aplica.
5. Presione **Guardar**.

#### Paso a paso — Editar o desactivar un perfil

1. En la lista de perfiles, haga clic en **Editar** en la fila deseada.
2. Modifique los campos necesarios.
3. Para desactivar un plan sin eliminarlo, cambie su estado a **Inactivo**.
4. Guarde los cambios.

> **Importante:** Cambiar el precio de un perfil no modifica automáticamente el precio de clientes ya contratados. Debe actualizar cada servicio individualmente o usar **Cambios Masivos** en Ajustes.

---

### 7.2 Perfiles de Voz (VoIP)

**Menú:** Servicios → Voz  
**Permiso:** Servicios → Voz → Menú

Misma lógica que Internet pero para servicios de telefonía IP. Configure extensiones, minutos incluidos y tarifas.

---

### 7.3 Perfiles CATV

**Menú:** Servicios → Catv  
**Permiso:** Servicios → CATV → Menú

Planes de televisión por cable analógico/digital.

---

### 7.4 Perfiles Personalizados

**Menú:** Servicios → Personalizado  
**Permiso:** Servicios → Personalizado → Menú

Servicios no estándar definidos por el ISP (cámaras, enlaces dedicados, etc.).

---

### 7.5 IPTV

**Menú:** Servicios → IPTV  
**Permiso:** Admin o cualquier permiso de servicios

#### ¿Para qué sirve?

Gestionar servicios de televisión por protocolo IP, incluyendo integración con plataformas como Setplex/Nora.

#### Paso a paso — Gestionar suscriptores IPTV

1. Vaya a **Servicios → IPTV**.
2. Revise el listado de suscriptores activos.
3. Use los filtros para buscar por nombre, plan o estado.
4. Acciones disponibles:
   - **Activar / Suspender** suscripción.
   - **Editar** datos del suscriptor.
   - **Actualizar plan** de suscripción.
5. Para vincular IPTV a un cliente del ISP, hágalo desde la ficha del cliente en la pestaña Servicios.

---

## 8. Promociones

**Menú:** Promociones (ítem directo)  
**Permiso:** Admin o permisos de servicios

### ¿Para qué sirve?

Crear ofertas especiales: descuentos, meses gratis, precios promocionales temporales.

### Paso a paso — Crear una promoción

1. Vaya a **Promociones**.
2. Haga clic en **Nueva promoción**.
3. Configure:
   - **Nombre** de la promoción.
   - **Tipo:** Descuento porcentual, monto fijo, meses gratis.
   - **Perfiles aplicables:** Qué planes incluye.
   - **Vigencia:** Fecha inicio y fin.
   - **Condiciones:** Nuevos clientes, clientes existentes, etc.
4. Guarde y active la promoción.
5. Al registrar un cliente o servicio, seleccione la promoción aplicable.

---

## 9. Clientes

**Menú:** Clientes (menú expandible)

---

### 9.1 Usuarios (Listado de clientes)

**Menú:** Clientes → Usuarios  
**Permiso:** Clientes → Usuarios → Menú

#### ¿Para qué sirve?

Listar, buscar, filtrar y gestionar todos los clientes del ISP.

#### Barra de herramientas

| Botón | Permiso | Descripción |
|-------|---------|-------------|
| Nuevo | Usuarios → Nuevo | Alta de cliente |
| Filtrar | Todos | Filtro avanzado colapsable |
| Estado | Todos | TODOS / ACTIVOS / SUSPENDIDOS / RETIRADOS / ONLINE |
| Suspender masivo | Usuarios → Activar | Suspender seleccionados |
| Activar masivo | Usuarios → Activar | Activar seleccionados |
| Retirar masivo | Usuarios → Retirar | Retirar seleccionados |
| Eliminar masivo | Usuarios → Eliminar | Eliminar seleccionados |

#### Paso a paso — Alta de nuevo cliente (Wizard 3 pasos)

1. Vaya a **Clientes → Usuarios**.
2. Haga clic en **Nuevo**.
3. **Paso 1 — Datos personales:**
   - Nombre completo o razón social.
   - Cédula / RIF / documento (validación automática según país).
   - Dirección, teléfono, email.
   - Coordenadas GPS (opcional).
4. **Paso 2 — Facturación y notificaciones:**
   - Tipo: Prepago o Postpago.
   - Día de pago (1-28).
   - Día de corte automático.
   - Activar/desactivar avisos por SMS, email, push.
   - Configuración de mora.
5. **Paso 3 — Servicios:**
   - Seleccione router/nodo.
   - Elija perfil de servicio.
   - Configure tipo de conexión (PPPoE, Hotspot, etc.).
   - Asigne IP (automática o estática).
   - Configure IPv6 si aplica.
   - Seleccione ubicación/NAP si es fibra.
6. Presione **Registrar Cliente**.
7. El sistema crea el cliente, el servicio y opcionalmente la primera factura.

> **Consejo:** Si el cliente viene de una instalación, use el botón **Dar de alta** desde el módulo Instalaciones para pre-cargar los datos.

#### Paso a paso — Buscar y filtrar clientes

1. Use el campo de búsqueda global (barra superior) para acceso rápido.
2. O en la lista de Usuarios, use el selector de **Estado** para filtrar.
3. Expanda **Filtrar** para criterios avanzados: router, perfil, zona, día de pago, etc.
4. Haga clic en el nombre del cliente para abrir su ficha completa.

---

### 9.2 Mapa de Clientes

**Menú:** Clientes → Mapa Clientes  
**Permiso:** Clientes → Mapa

#### ¿Para qué sirve?

Visualizar geográficamente la ubicación de todos los clientes en un mapa interactivo.

#### Paso a paso

1. Vaya a **Clientes → Mapa Clientes**.
2. El mapa muestra marcadores por cliente (requiere coordenadas GPS en la ficha).
3. Haga clic en un marcador para ver datos básicos del cliente.
4. Use los filtros para mostrar solo activos, suspendidos, etc.

---

### 9.3 Anuncios

**Menú:** Clientes → Anuncios  
**Permiso:** Clientes → Anuncios → Menú

#### ¿Para qué sirve?

Publicar avisos visibles en el portal del cliente (mantenimientos, promociones, etc.).

#### Paso a paso — Crear un anuncio

1. Vaya a **Clientes → Anuncios**.
2. Haga clic en **Nuevo**.
3. Escriba título y contenido del anuncio.
4. Configure vigencia (fecha inicio/fin).
5. Seleccione si aplica a todos los clientes o a un grupo específico.
6. Publique.

---

### 9.4 Notificaciones Push

**Menú:** Clientes → Notificaciones push  
**Permiso:** Clientes → Anuncios → Menú

Enviar notificaciones push a la app móvil o navegador del cliente.

---

### 9.5 Instalaciones

**Menú:** Clientes → Instalaciones  
**Permiso:** Clientes → Instalaciones → Menú

#### ¿Para qué sirve?

Gestionar el ciclo completo de instalaciones: pre-registro de prospectos, órdenes de instalación, materiales y alta final del cliente.

#### Pestañas

| Pestaña | Contenido |
|---------|-----------|
| Registro | Pre-instalaciones / prospectos |
| Instalaciones | Órdenes activas en campo |

#### Paso a paso — Flujo completo de instalación

1. **Crear pre-registro:**
   - Vaya a **Clientes → Instalaciones → Registro**.
   - Clic en **Nuevo**.
   - Ingrese cédula, nombre, teléfono, dirección, plan deseado.
   - Guarde. El prospecto queda en estado "Pendiente".

2. **Aceptar instalación:**
   - En la pestaña **Instalaciones**, localice la orden.
   - Clic en **Aceptar instalación**.
   - Asigne técnico responsable y fecha/hora.
   - Confirme.

3. **Agregar materiales:**
   - Clic en **Materiales**.
   - Seleccione productos del almacén (ONU, cable, conectores, etc.).
   - Confirme. El inventario se descuenta automáticamente.

4. **Imprimir hoja de instalación:**
   - Clic en **Imprimir** para generar PDF con datos del cliente, materiales y plan.
   - Entregue al técnico de campo.

5. **Dar de alta al cliente:**
   - Una vez completada la instalación en campo, clic en **Dar de alta**.
   - Se abre el wizard de alta de cliente con datos pre-cargados.
   - Complete servicio, IP, credenciales y confirme.
   - El prospecto pasa a ser cliente activo.

> **Permisos granulares:** editar-registro, eliminar-registro, aceptar-instalacion, materiales-instalacion, alta-instalacion.

---

### 9.6 Contratos

**Menú:** Clientes → Contratos  
**Permiso:** Clientes → Contratos → Menú

#### ¿Para qué sirve?

Gestionar contratos formales con clientes: generación, firma, renovación.

#### Paso a paso — Generar contrato

1. Vaya a **Clientes → Contratos** o desde la ficha del cliente.
2. Clic en **Nuevo contrato**.
3. Seleccione plantilla de contrato.
4. Revise datos pre-cargados del cliente.
5. Genere PDF.
6. Envíe por correo al cliente o imprima para firma física.

---

### 9.7 Correos

**Menú:** Clientes → Correos  
**Permiso:** Clientes → Correo → Menú

#### ¿Para qué sirve?

Bandeja de correos enviados/recibidos relacionados con clientes: facturas, avisos, respuestas.

---

## 10. Ficha del cliente (ViewUser)

**Acceso:** Buscar cliente (barra superior) o clic en nombre desde cualquier listado.

### ¿Para qué sirve?

Es el **centro de operaciones** de cada cliente. Desde aquí se gestiona todo: servicios, facturación, pagos, tickets, documentos, estadísticas.

### Pestañas principales

| Pestaña | Contenido |
|---------|-----------|
| **Resumen** | Datos generales, estado del servicio, accesos rápidos |
| **Servicios** | Servicios contratados, configuración técnica, OLT/ONU |
| **Facturación** | Facturas, pagos, saldos, configuración de cobro |
| **Tickets** | Historial de soporte del cliente |
| **Email & SMS** | Comunicaciones enviadas |
| **Documentos** | Archivos adjuntos (contratos, cédulas, etc.) |
| **Estadísticas** | Tráfico, gráficos de consumo, sitios visitados |
| **Log** | Auditoría de acciones sobre el cliente |

### Paso a paso — Consultar estado de un cliente

1. Busque al cliente (barra superior o listado).
2. Se abre la ficha. Revise la pestaña **Resumen**:
   - Estado: Activo / Suspendido / Retirado.
   - Saldo pendiente.
   - Servicios activos.
   - Última conexión.
3. Para ver deuda, vaya a pestaña **Facturación**.

### Paso a paso — Suspender un cliente

1. En la ficha, botón **Suspender** (visible según permisos).
2. Confirme la acción.
3. El servicio se corta en el router/OLT automáticamente.
4. El estado cambia a "Suspendido".

### Paso a paso — Activar un cliente

1. En la ficha de un cliente suspendido, botón **Activar**.
2. Confirme.
3. El servicio se restaura en router/OLT.

### Paso a paso — Registrar pago desde ficha

1. Pestaña **Facturación** → sub-pestaña **Facturas**.
2. Localice la factura pendiente.
3. Clic en **Agregar pago** (✓).
4. Complete: monto, forma de pago, referencia bancaria.
5. Confirme. Si el pago cubre la deuda, el servicio se activa automáticamente (si estaba suspendido por mora).

### Paso a paso — Configurar ONU (AdminOLT / SmartOLT)

1. Pestaña **Servicios**.
2. Clic en botón **AdminOLT** o **SmartOLT** junto al servicio de fibra.
3. Se abre modal con ONUs pendientes de autorización.
4. Seleccione la ONU correcta (por serial number).
5. Clic en **Autorizar**.
6. Configure parámetros WAN (VLAN, PPPoE credentials).
7. Clic en **Autorizar y Continuar**.
8. Espere la confirmación de configuración WAN.
9. Clic en **Concluir Configuración WAN**.
10. La ONU queda operativa.

### Paso a paso — Enviar factura por correo

1. Pestaña **Facturación** → seleccione la factura.
2. Clic en botón **Compartir** (icono de envío).
3. Elija **Enviar por correo**.
4. Confirme. El cliente recibe la factura en PDF.

### Herramientas rápidas (llave inglesa)

Desde la ficha, el botón de **herramientas** (llave inglesa) abre un panel con:

| Herramienta | Descripción |
|-------------|-------------|
| Ver antena | Estado de conexión inalámbrica |
| Tráfico Mikrotik | Consumo en tiempo real |
| Ping | Prueba de conectividad |
| Gráficos | Histórico de tráfico |
| Portal cliente | Abrir portal como el cliente (enmascarado) |
| Enviar correo/SMS | Comunicación directa |
| Activar/Suspender | Control de servicio |

**Permiso requerido:** Clientes → Usuarios → Herramientas

---

## 11. Fichas Hotspot

**Menú:** Fichas Hotspot (menú expandible)

---

### 11.1 Fichas (Inventario)

**Menú:** Fichas Hotspot → Fichas  
**Permiso:** Fichas Hotspot → Fichas → Menú

#### ¿Para qué sirve?

Gestionar el inventario de tickets de acceso WiFi temporal (fichas hotspot): crear lotes, imprimir, vender, consultar.

#### Pestañas

| Pestaña | Contenido |
|---------|-----------|
| Disponibles | Fichas sin vender (estado NUEVO) |
| Vendidas | Fichas ya comercializadas |

#### Paso a paso — Crear lote de fichas

1. Vaya a **Fichas Hotspot → Fichas**.
2. Pestaña **Disponibles**.
3. Clic en **Nuevo**.
4. Seleccione:
   - **Perfil hotspot:** Plan de tiempo/velocidad.
   - **Cantidad:** Número de fichas a generar.
5. Clic en **Crear**.
6. Las fichas aparecen en la tabla con usuario y PIN generados.
7. Opcional: clic en **Imprimir** para generar PDF con las fichas.

#### Paso a paso — Imprimir fichas

1. Seleccione las fichas deseadas (checkbox).
2. Clic en **Imprimir**.
3. Elija plantilla de impresión.
4. Se genera PDF listo para imprimir y entregar.

#### Paso a paso — Enviar ficha por SMS

1. En pestaña **Vendidas**, seleccione la ficha.
2. Clic en **Enviar SMS**.
3. Ingrese número de teléfono.
4. El cliente recibe usuario y PIN por mensaje de texto.

---

### 11.2 Routers Hotspot

**Menú:** Fichas Hotspot → Routers  
**Permiso:** Fichas Hotspot → Router → Menú

#### ¿Para qué sirve?

Configurar routers dedicados a hotspot: perfiles, límites, WiFi Social.

#### Pestañas

| Pestaña | Contenido |
|---------|-----------|
| Routers | Equipos hotspot |
| Perfiles | Planes de tiempo/velocidad |
| Wi-Fi Social | Registro con redes sociales |

#### Paso a paso — Agregar router hotspot

1. Vaya a **Fichas Hotspot → Routers**.
2. Clic en **Nuevo router**.
3. Configure IP, credenciales API, zona.
4. Guarde.

---

### 11.3 Plantillas

**Menú:** Fichas Hotspot → Plantillas  
**Permiso:** Fichas Hotspot → Plantillas → Menú

Editor visual de plantillas de impresión de fichas (tamaño, logo, campos, diseño A4/ticket).

---

### 11.4 Ventas

**Menú:** Fichas Hotspot → Ventas  
**Permiso:** Fichas Hotspot → Ventas → Menú

Reporte de ventas de fichas: fecha, vendedor, monto, plan vendido.

---

## 12. Tareas y planificación

**Menú:** Tareas (menú expandible)

---

### 12.1 Tareas del día

**Menú:** Tareas → Tareas  
**Permiso:** Tareas → Nuevo, Editar o Eliminar

#### ¿Para qué sirve?

Organizar trabajo diario: instalaciones programadas, visitas técnicas, tareas libres.

#### Paso a paso — Crear una tarea

1. Vaya a **Tareas → Tareas** (fecha de hoy por defecto).
2. Clic en **Agregar Tarea**.
3. Complete:
   - **Tipo:** Instalación, visita técnica, tarea libre.
   - **Cliente vinculado** (si aplica).
   - **Técnico asignado.**
   - **Fecha y hora.**
   - **Descripción / notas.**
4. Guarde.

#### Paso a paso — Gestionar tarea de instalación

1. Localice la tarea en la vista **Cronología** o **Tareas**.
2. Estados del flujo:
   - **Pendiente** → Clic **En curso** cuando el técnico sale a campo.
   - **En curso** → Clic **Finalizar instalación** (redirige a alta de cliente) o **Reprogramar**.
3. Si reprograma, seleccione nueva fecha/hora y motivo.

#### Controles adicionales

| Control | Descripción |
|---------|-------------|
| Plantillas de duración | Tiempos estimados por tipo de tarea |
| Cola reprogramadas | Tareas reprogramadas pendientes de reasignación |
| Vista Cronología | Línea de tiempo visual |
| Vista Tareas | Tabla con filtros |
| Filtro Mis Tareas | Solo tareas asignadas al operador logueado |
| Navegación por fecha | Flechas ◀ ▶ para cambiar día |

---

### 12.2 Planificación (Calendario)

**Menú:** Tareas → Planificación  
**Ruta:** `#ajax/calendar_tareas`

Vista de calendario mensual/semanal con todas las tareas programadas. Permite arrastrar tareas para reprogramar.

---

### 12.3 Monitoreo Vehicular

**Menú:** Tareas → Monitoreo Vehicular  
**Permiso:** Admin o Vehículos → Monitoreo → Menú

Seguimiento GPS de vehículos de la empresa en mapa en tiempo real.

---

## 13. Finanzas

**Menú:** Finanzas (menú expandible)

---

### 13.1 Facturas

**Menú:** Finanzas → Facturas  
**Permiso:** Finanzas → Facturas → Menú

#### ¿Para qué sirve?

Consultar, generar, cobrar y administrar todas las facturas del ISP.

#### Filtros disponibles

- Tipo de fecha (emisión / vencimiento).
- Estado (pendiente, pagada, anulada, vencida).
- Rango de fechas.
- Router / nodo.

#### Paso a paso — Consultar facturas pendientes

1. Vaya a **Finanzas → Facturas**.
2. Filtro de estado: **Pendiente**.
3. Revise la lista con montos y fechas de vencimiento.
4. Use la búsqueda para localizar por cliente o número de factura.

#### Paso a paso — Cobrar una factura

1. Localice la factura en la lista.
2. Clic en **Agregar pago** (✓).
3. Se abre modal de pago (mismo flujo que desde ficha de cliente).
4. Complete monto y forma de pago.
5. Confirme.

#### Acciones por factura

| Acción | Permiso | Descripción |
|--------|---------|-------------|
| Agregar pago | Facturas → Pagar | Registrar cobro |
| Editar | Facturas → Editar | Modificar datos |
| Eliminar | Facturas → Eliminar | Borrar factura |
| Anular | Facturas → Anular | Anular sin eliminar |
| Compartir | — | Enviar por correo, Telegram, pasarela |

---

### 13.2 Registrar Pagos

**Menú:** Finanzas → Registrar Pagos  
**Atajo:** Icono $ en barra superior  
**Permiso:** Finanzas → Registrar Pago → Menú

#### ¿Para qué sirve?

Módulo optimizado para caja: registrar pagos de forma rápida en mostrador.

#### Pestañas

| Pestaña | Contenido |
|---------|-----------|
| Registrar pago | Formulario activo de cobro |
| Pagos registrados (hoy) | Listado del día |
| Promesas de pago | Compromisos de pago activos |

#### Paso a paso — Registrar pago en caja

1. Vaya a **Finanzas → Registrar Pagos** (o clic en $ de la barra).
2. Modo de búsqueda:
   - **Buscar Cliente:** Escriba nombre/cédula → seleccione de la lista.
   - **Buscar Nº comprobante:** Escanee código de barras de la factura.
3. Se despliega panel con facturas pendientes del cliente.
4. Seleccione la factura a pagar.
5. Configure:
   - **Forma de pago:** Efectivo, transferencia, pago móvil, etc.
   - **Monto:** Total o parcial.
   - **Referencia:** Número de transferencia/comprobante.
6. Elija impresión: Recibo / Factura / POS / Ninguna.
7. Clic en **Registrar pago**.
8. Si hay saldo pendiente, el sistema pregunta si desea registrar pago parcial.
9. Confirme. Opcional: impresión automática del recibo.

---

### 13.3 Registrar Pagos Masivos

**Menú:** Finanzas → Registrar Pagos Masivos  
**Permiso:** Finanzas → Registrar Pago Masivo → Menú

Importar archivo (Excel/CSV) con múltiples pagos para procesarlos de una sola vez.

---

### 13.4 Transacciones

**Menú:** Finanzas → Transacciones  
**Permiso:** Finanzas → Transacciones → Menú

Listado de todas las transacciones financieras: pagos, notas de crédito, ajustes de saldo.

---

### 13.5 Pago móvil recibidos

**Menú:** Finanzas → Pago móvil recibidos  
**Permiso:** Finanzas → Pago móvil (solo Venezuela, zona Caracas)

#### ¿Para qué sirve?

Ver pagos móviles recibidos automáticamente desde el banco y conciliarlos con facturas de clientes.

#### Paso a paso — Conciliar pago móvil

1. Vaya a **Finanzas → Pago móvil recibidos**.
2. Revise la lista de pagos recibidos (fecha, monto, referencia, banco).
3. Para pagos no conciliados automáticamente:
   - Clic en **Conciliar**.
   - Busque al cliente por cédula o nombre.
   - Asigne a la factura correspondiente.
4. Confirme. El pago se aplica y el servicio se activa si corresponde.

---

### 13.6 Pasarelas de pago (Evertec, Banco Provincial, Cashea)

| Módulo | Menú | Condición |
|--------|------|-----------|
| Pagos via Place To Pay | Finanzas → Pagos via Place To Pay | Pasarela Evertec activa |
| Pagos Banco Provincial | Finanzas → Pagos Banco Provincial | Pasarela BBVA activa |
| Cashea (órdenes) | Finanzas → Cashea | Pasarela Cashea activa |

Consulte pagos procesados por pasarelas en línea, verifique estados y gestione devoluciones.

---

### 13.7 Dólar Price / Casa de cambio

**Menú:** Finanzas → Dolar price / Casa de cambio

Gestión de tasa de cambio para facturación en moneda extranjera (USD) con conversión a moneda local (Bs, ARS, etc.).

---

### 13.8 Otros Ingresos & Egresos

**Menú:** Finanzas → Otros Ingresos & Egresos

Registrar movimientos financieros no relacionados con clientes: gastos operativos, ingresos extraordinarios.

---

### 13.9 Reportes de Pagos (Portal Cliente)

**Menú:** Finanzas → Reportes de Pagos (Portal Cliente)

Pagos reportados por clientes desde el portal (informar pago). El operador verifica y aprueba/rechaza.

---

### 13.10 Facturación SyH

**Menú:** Finanzas → Facturación SyH  
**Condición:** Módulo SyH activo (`issyh=on`)

Facturación electrónica integrada con sistema SyH (Venezuela).

---

### 13.11 Estadísticas de pagos

**Menú:** Finanzas → Estadísticas  
**Permiso:** Finanzas → Transacciones → Estadísticas

Gráficos y reportes de ingresos por periodo, forma de pago, operador, sucursal.

---

## 14. Almacén

**Menú:** Almacén (menú expandible)

---

### 14.1 Tipos de productos (Categorías)

**Menú:** Almacén → Tipos de productos  
**Permiso:** Almacén → Categorías → Menú

Categorías de inventario: ONUs, cables, conectores, antenas, etc.

---

### 14.2 Proveedores

**Menú:** Almacén → Proveedores  
**Permiso:** Almacén → Categorías → Menú

Registro de proveedores de equipos y materiales.

---

### 14.3 Productos

**Menú:** Almacén → Productos  
**Permiso:** Almacén → Productos → Menú

#### Pestañas

| Pestaña | Contenido |
|---------|-----------|
| Productos | Equipos e inventario principal |
| Accesorios | Materiales menores |

#### Paso a paso — Ingresar producto al almacén

1. Vaya a **Almacén → Productos**.
2. Clic en **Nuevo Producto**.
3. Complete:
   - **Categoría** (tipo de producto).
   - **Nombre / descripción.**
   - **Serial / MAC** (si aplica).
   - **Proveedor.**
   - **Condición:** Nuevo, Comodato, Vendido.
   - **Precio de costo** (opcional).
4. Guarde. El producto queda en estado **Disponible**.

#### Paso a paso — Asignar producto a instalación

1. Desde **Clientes → Instalaciones**, abra la orden.
2. Clic en **Materiales**.
3. Busque el producto por serial o categoría.
4. Asigne cantidad.
5. Confirme. El producto pasa a estado **Asignado/Vendido**.

#### Filtros

- Estado: Disponible, No disponible, Comodato.
- Categoría.

---

## 15. Reportes

**Menú:** Reportes (menú expandible)  
**Permiso:** Reportes → Administración → Menú (o admin)

| Sub-módulo | Contenido |
|------------|-----------|
| **Administración** | Clientes activos/suspendidos, morosos, crecimiento |
| **Ventas** | Ingresos por periodo, por plan, por operador |
| **Almacén** | Inventario, movimientos, productos asignados |
| **Red** | Tráfico, uptime de routers, clientes online |
| **Soporte** | Tickets abiertos/cerrados, tiempos de respuesta |

### Paso a paso — Generar un reporte

1. Vaya a **Reportes → [tipo deseado]**.
2. Configure filtros: fechas, sucursal, router, operador.
3. Clic en **Generar** o **Buscar**.
4. Revise la tabla/gráfico resultante.
5. Exporte a Excel o PDF con el botón correspondiente.

---

## 16. Soporte y tickets

**Menú:** Tickets (menú expandible) o Zendesk Support  
**Permiso:** Soporte → Menú

---

### 16.1 Sistema de tickets interno

#### Sub-menús

| Estado | Ruta | Descripción |
|--------|------|-------------|
| Esperando Respuesta | `#ajax/soporte?action=open` | Tickets sin responder |
| Respondidos | `#ajax/soporte?action=answered` | Tickets con respuesta pendiente de cierre |
| Cerrados | `#ajax/soporte?action=close` | Tickets resueltos |

#### Paso a paso — Atender un ticket

1. Vaya a **Tickets → Esperando Respuesta**.
2. Revise la lista ordenada por prioridad/fecha.
3. Haga clic en el ticket para abrirlo.
4. Pestañas del ticket:
   - **Añadir respuesta:** Escriba respuesta visible para el cliente.
   - **Añadir nota:** Nota interna (no visible para el cliente).
   - **Otros tickets:** Historial del mismo cliente.
   - **Opciones:** Asignar técnico, cambiar prioridad, departamento.
5. Escriba la respuesta y adjunte archivos si es necesario.
6. Clic en **Enviar respuesta**. El cliente recibe notificación (email/push).
7. Cuando esté resuelto, clic en **Cerrar ticket**.

#### Paso a paso — Crear ticket manualmente

1. Clic en **Nuevo Ticket**.
2. Seleccione cliente (buscador).
3. Elija departamento (Soporte, Facturación, Comercial).
4. Escriba asunto y descripción.
5. Adjunte archivos si aplica.
6. Asigne prioridad y técnico.
7. Guarde.

---

### 16.2 Zendesk Support

Si la integración Zendesk está activa, el menú muestra **Zendesk Support** que redirige al módulo conectado con Zendesk.

---

## 17. Mensajería (SMS / WhatsApp)

**Menú:** Mensajería (menú expandible)  
**Permiso:** SMS → Menú

| Sub-módulo | Contenido |
|------------|-----------|
| Mensajes enviados | Historial de SMS enviados |
| Mensajes recibidos | SMS entrantes + contador WhatsApp |

### Paso a paso — Enviar SMS a un cliente

1. Desde la **ficha del cliente** → pestaña Email & SMS → **Enviar SMS**.
2. O desde **Mensajería → Mensajes enviados → Nuevo**.
3. Seleccione plantilla o escriba mensaje personalizado.
4. Confirme envío.

---

## 18. Ajustes generales

**Menú:** Ajustes Generales  
**Permiso:** Ajustes → Menú

Pantalla de configuración del sistema organizada en categorías.

---

### 18.1 Configuración

| Sección | Descripción |
|---------|-------------|
| **General** | Nombre empresa, logo, moneda, zona horaria, datos fiscales |
| **Ubicaciones** | Zonas geográficas de operación |
| **Sucursales** | Sedes/puntos de venta |
| **Cloud** | Integración con servicios en la nube |
| **Google** | Integración Google (Maps, Calendar) |
| **Calendario** | Sincronización calendario técnicos |

---

### 18.2 Administración

| Sección | Descripción |
|---------|-------------|
| **Gestión personal** | Operadores, roles y permisos |
| **Portal cliente** | Configuración del portal de abonados |
| **Importar clientes** | Importación masiva desde Excel/CSV |
| **Cambios masivos** | Modificar configuración de facturación en lote |
| **Login RADIUS** | Equipos NAS autorizados |
| **Backups Mikrotik** | Configuración de respaldos automáticos |

#### Paso a paso — Crear operador con permisos

1. Vaya a **Ajustes → Gestión personal**.
2. Pestaña **Operadores**.
3. Clic en **Nuevo operador**.
4. Complete: nombre, usuario, contraseña, email, sucursal.
5. Asigne **plantilla de rol** o configure permisos manualmente en el árbol de permisos.
6. Guarde.

#### Paso a paso — Configurar portal del cliente

1. Vaya a **Ajustes → Portal cliente**.
2. Pestañas: General, Reporte pago, Banners.
3. Active/desactive secciones visibles para el abonado.
4. Configure textos, logos y colores del portal.
5. Guarde.

---

### 18.3 Facturación

| Sección | Descripción |
|---------|-------------|
| **Facturación** | Día de facturación, corte, mora, impuestos, numeración |
| **Pasarelas de pago** | Configuración de bancos y procesadores |

#### Paso a paso — Configurar pasarela de pago

1. Vaya a **Ajustes → Pasarelas de pago**.
2. Localice el banco deseado (Banesco, Mercantil, BDV, Bancaribe, etc.).
3. Active la pasarela con el switch.
4. Complete credenciales API del banco.
5. Configure método: Botón de pago, C2P, Pago móvil, Transferencia, Debin.
6. Guarde y pruebe con un pago de prueba.

---

### 18.4 Soporte y mensajes

| Sección | Descripción |
|---------|-------------|
| **Servidor de correo** | SMTP para envío de emails |
| **Tickets** | Departamentos de soporte |
| **Zendesk** | Integración Zendesk |
| **Mensajería (SMS)** | Proveedor SMS, plantillas, WhatsApp |

---

### 18.5 Herramientas

| Sección | Descripción |
|---------|-------------|
| **Editor plantillas** | PDF, correos, avisos |
| **Configuración plantillas** | Valores predeterminados al registrar clientes |
| **Mensajes facturas** | Textos en facturas y recibos |
| **Campos personalizados** | Campos extra en ficha de cliente |
| **Configuración VPN** | Servidor OpenVPN para operadores |

---

### 18.6 Sistema

| Sección | Descripción |
|---------|-------------|
| **Base de datos** | Backup y restauración |
| **Crontab** | Tareas programadas |
| **Logs** | Registros del sistema y accesos |
| **Servidor** | Estado de servicios (MySQL, Radius, VPN) |
| **Migrar sistema** | Migración desde Mikrowisp 5 |
| **Freeradius** | Logs y estado del servidor Radius |
| **Licencia** | Token de licencia, límites, actualizaciones |

---

## 19. Portal del cliente

**URL:** `/cliente/`  
**Usuario:** Abonados del ISP

---

### 19.1 Inicio de sesión del cliente

1. El cliente accede a `https://su-servidor/cliente/`.
2. Ingresa usuario (cédula o email) y contraseña.
3. Si el operador le envió un enlace con token, accede automáticamente.

---

### 19.2 Menú del portal

| Sección | Descripción | Configurable |
|---------|-------------|--------------|
| **Inicio (Dashboard)** | Resumen: deuda, estado, consumo | Siempre visible |
| **Mis comprobantes** | Facturas y recibos en PDF | Sí |
| **Mis métodos de pago** | Tarjetas, cuentas bancarias guardadas | Sí |
| **Soporte técnico** | Abrir y consultar tickets | Sí |
| **Documentos** | Contratos, reglamentos | Sí |
| **Informar pago** | Reportar transferencia/pago móvil | Sí |
| **Utilidades** | Submenú (ver abajo) | Parcial |
| **Mi Wifi** | Gestión de red doméstica | Si módulo activo |
| **Salir** | Cerrar sesión | Siempre |

#### Submenú Utilidades

| Opción | Descripción |
|--------|-------------|
| Test de Velocidad | Medir velocidad de conexión |
| Mi tráfico actual | Consumo del mes en curso |
| Actualizar Datos | Modificar teléfono, email, dirección |

---

### 19.3 Dashboard del cliente

Al iniciar sesión, el cliente ve:

| Widget | Descripción |
|--------|-------------|
| Deuda actual | Monto pendiente con enlace a comprobantes |
| Tickets abiertos | Soporte pendiente |
| Consumo del mes | Tráfico utilizado |
| Estado del servicio | Activo / Suspendido |

---

### 19.4 Paso a paso — Cliente paga su factura

1. Cliente inicia sesión en el portal.
2. Vaya a **Mis comprobantes**.
3. Localice la factura pendiente.
4. Clic en **Pagar**.
5. Seleccione método de pago (botón de pago, transferencia, pago móvil).
6. Complete datos bancarios y confirme.
7. Si paga por transferencia manual, vaya a **Informar pago** y suba comprobante.

---

### 19.5 Paso a paso — Cliente abre ticket de soporte

1. Vaya a **Soporte técnico**.
2. Clic en **Nuevo ticket**.
3. Seleccione departamento.
4. Escriba asunto y describa el problema.
5. Adjunte foto/captura si es necesario.
6. Envíe. Recibirá respuesta por email/push cuando el operador responda.

---

### 19.6 Paso a paso — Cliente informa un pago

1. Vaya a **Informar pago**.
2. Complete: monto, fecha, banco, número de referencia.
3. Adjunte foto del comprobante de transferencia.
4. Envíe.
5. El operador verifica en **Finanzas → Reportes de Pagos (Portal Cliente)** y aprueba.

---

## 20. Flujos de trabajo integrados

### 20.1 Alta completa de cliente (sin instalación)

```
Clientes → Usuarios → Nuevo
  → Paso 1: Datos personales
  → Paso 2: Facturación
  → Paso 3: Servicios
  → Registrar Cliente
  → [Automático] Factura generada + servicio activo en router
```

### 20.2 Alta con instalación

```
Clientes → Instalaciones → Nuevo registro
  → Aceptar instalación (asignar técnico)
  → Agregar materiales (almacén)
  → Imprimir hoja → Técnico instala en campo
  → Tareas: marcar "En curso" → "Finalizar"
  → Dar de alta → Wizard de usuarios (datos pre-cargados)
  → Cliente activo
```

### 20.3 Cobro en caja

```
Barra superior → $ (Registrar pago)
  → Buscar cliente
  → Seleccionar factura
  → Forma de pago + monto
  → Registrar pago
  → [Automático] Servicio activado si estaba suspendido
  → Imprimir recibo
```

### 20.4 Ciclo de morosidad

```
[Automático - Cron] Factura generada el día configurado
  → [Automático] Avisos SMS/email según configuración
  → [Automático] Corte el día de corte configurado
  → Cliente suspendido en router/OLT
  → Cliente paga (caja o portal)
  → [Automático] Servicio reactivado
```

### 20.5 Venta de ficha hotspot

```
Fichas Hotspot → Fichas → Nuevo (lote)
  → Imprimir fichas
  → Entregar al cliente (venta manual)
  → Marcar como vendida (automático al usar o manual)
  → Consultar ventas en Fichas Hotspot → Ventas
```

### 20.6 Atención de soporte

```
Cliente abre ticket (portal) o operador crea ticket (admin)
  → Aparece en Tickets → Esperando Respuesta
  → Operador responde
  → Cliente recibe notificación
  → Operador cierra ticket cuando resuelto
```

---

## 21. Permisos y roles

### ¿Cómo funciona?

Cada operador tiene un **rol** con permisos granulares. Los permisos determinan qué módulos del menú lateral son visibles y qué acciones puede ejecutar.

### Niveles

| Nivel | Descripción |
|-------|-------------|
| **Administrador** (`nivelusername = 0`) | Acceso total a todos los módulos |
| **Operador** | Acceso según permisos asignados |

### Áreas de permisos principales

| Área | Ejemplos de permisos |
|------|---------------------|
| Widget barra | Pago, Telegram, Notificaciones, Soporte |
| Gestión de Red | Router (menu, nuevo, editar, eliminar), IPv4, Monitoreo, NAP, Tráfico |
| Servicios | Internet, Voz, CATV, Personalizado (menu) |
| Clientes | Usuarios (menu, nuevo, editar, eliminar, activar, retirar, herramientas), Mapa, Anuncios, Instalaciones, Contratos, Correo |
| Fichas Hotspot | Fichas (menu, nuevo, eliminar, imprimir), Router, Plantillas, Ventas |
| Tareas | Nuevo, Editar, Eliminar |
| Finanzas | Facturas (menu, pagar, editar, eliminar, anular), Registrar pago, Transacciones, Reporte, etc. |
| Almacén | Categorías, Productos (menu, editar, eliminar) |
| Reportes | Administración |
| Soporte | Menu, Nuevo, Listar, Editar, Eliminar, Cerrar |
| SMS | Menu, Nuevo |
| Ajustes | General, Gestión, Facturación, Portal, Importar, Pasarela, Plantillas, Base de datos, Licencia, etc. |

### Paso a paso — Solicitar acceso a un módulo

1. Identifique qué módulo necesita y no ve en su menú.
2. Contacte al administrador del sistema.
3. El administrador debe ir a **Ajustes → Gestión personal → [su usuario] → Permisos**.
4. Activar el permiso correspondiente en el árbol.
5. Cierre sesión y vuelva a entrar para ver los cambios.

---

## 22. Preguntas frecuentes

### General

**P: ¿Por qué no veo un módulo en el menú?**  
R: Su rol no tiene permiso para ese módulo. Contacte al administrador.

**P: ¿Puedo usar Nexo desde el celular?**  
R: Sí, el panel es responsive. Sin embargo, se recomienda escritorio para tareas complejas (alta de clientes, facturación).

**P: ¿Cómo busco un cliente rápidamente?**  
R: Use el buscador de la barra superior. Escriba al menos 3 caracteres.

### Facturación

**P: ¿Cómo genero una factura manual?**  
R: Desde la ficha del cliente → Facturación → botón "Nueva factura". O espere la generación automática del cron.

**P: El cliente pagó pero sigue suspendido.**  
R: Verifique que el pago se aplicó a la factura correcta y cubre el monto total. Revise en Finanzas → Transacciones.

**P: ¿Cómo anulo una factura?**  
R: Finanzas → Facturas → botón Anular en la factura. Requiere permiso de anular.

### Red

**P: Un cliente no tiene internet pero aparece activo en Nexo.**  
R: Verifique: 1) Estado en router (¿conectado?), 2) ONU autorizada en OLT, 3) Queues/colas en MikroTik, 4) Saldo/corte.

**P: ¿Cómo reinicio la ONU de un cliente?**  
R: Ficha del cliente → Servicios → botón AdminOLT/SmartOLT → Reiniciar ONT.

### Hotspot

**P: ¿Cómo vendo una ficha hotspot?**  
R: Cree un lote en Fichas Hotspot → Fichas → Nuevo. Imprima y entregue. La ficha se marca vendida al usarse o manualmente.

### Soporte

**P: ¿El cliente puede ver las notas internas de un ticket?**  
R: No. Las notas internas solo son visibles para operadores.

---

## Apéndice A — Mapa completo del menú admin

```
Dashboard
Gestión de Red
  ├── Routers
  ├── Smart OLT / AdminOLT
  ├── Redes
  ├── Monitoreo
  ├── Cajas Nap
  ├── Tráfico
  ├── Ips Visitadas
  └── Monitor BlackList
Servicios
  ├── Internet
  ├── Voz
  ├── Catv
  ├── Personalizado
  └── IPTV
Promociones
Clientes
  ├── Usuarios
  ├── Mapa Clientes
  ├── Anuncios
  ├── Notificaciones push
  ├── Instalaciones
  ├── Contratos
  └── Correos
Fichas Hotspot
  ├── Fichas
  ├── Routers
  ├── Plantillas
  └── Ventas
Tareas
  ├── Tareas
  ├── Planificación
  └── Monitoreo Vehicular
Finanzas
  ├── Facturas
  ├── Registrar Pagos
  ├── Registrar Pagos Masivos
  ├── Transacciones
  ├── Dolar price
  ├── Casa de cambio
  ├── Pago móvil recibidos
  ├── Pagos via Place To Pay
  ├── Pagos Banco Provincial
  ├── Cashea (órdenes)
  ├── Otros Ingresos & Egresos
  ├── Reportes de Pagos (Portal Cliente)
  ├── Facturación SyH
  └── Estadísticas
Almacén
  ├── Tipos de productos
  ├── Proveedores
  └── Productos
Reportes
  ├── Administración
  ├── Ventas
  ├── Almacén
  ├── Red
  └── Soporte
Tickets / Zendesk Support
Mensajería
  ├── Mensajes enviados
  └── Mensajes recibidos
Ajustes Generales
```

## Apéndice B — Mapa del menú portal cliente

```
Inicio (Dashboard)
Mis comprobantes
Mis métodos de pago
Soporte técnico
Documentos
Informar pago
[Pestaña personalizada]
Utilidades
  ├── Test de Velocidad
  ├── Mi tráfico actual
  └── Actualizar Datos
Mi Wifi
Salir
```

---

*Documento generado para Nexo (Mikrowisp 6). Actualice este manual cuando se agreguen módulos o cambien flujos de trabajo.*
