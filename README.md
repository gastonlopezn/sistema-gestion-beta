# sistema-gestion-beta

Sitio web y sistema de gestión para **SM Repuestos**.

El proyecto tiene dos partes que viven en la misma aplicación:

1. **Landing pública** (`/`): para que los clientes conozcan el negocio, lo contacten y lo ubiquen en la ciudad.
2. **Sistema de gestión** (`/panel`): stock, historial de ventas, presupuestos y estadísticas.

> Estado: **Fase 0, demo**. Por ahora el repo tiene solo la estructura base; las funcionalidades se definen con el cliente.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router) + TypeScript |
| Estilos | Tailwind CSS (+ shadcn/ui más adelante) |
| Base de datos | MySQL 8 (Docker en local) |
| ORM | Drizzle ORM con driver `mysql2` |
| Login | Better Auth (email y contraseña, sesiones en MySQL) |
| Calidad | ESLint, Prettier, GitHub Actions |
| Hosting | Vercel (app) + MySQL administrado (Aiven o Railway) |

## Requisitos

- Node.js 22 o superior
- Docker (para la base MySQL local)

## Cómo levantarlo en local

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.example .env

# 3. Base de datos MySQL
docker compose up -d

# 4. Crear las tablas y cargar datos de prueba
npm run db:migrate
npm run db:seed

# 5. Servidor de desarrollo
npm run dev
```

La app queda en http://localhost:3000.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos de TypeScript |
| `npm run format` | Formatea el código con Prettier |
| `npm run format:check` | Verifica el formato sin modificar archivos |
| `npm run db:generate` | Genera una migración a partir de cambios en el esquema |
| `npm run db:migrate` | Aplica las migraciones pendientes |
| `npm run db:seed` | Borra los datos y carga datos de prueba (nunca en producción) |
| `npm run db:studio` | Abre Drizzle Studio para ver la base en el navegador |

## Estructura de carpetas

```
.
├── .github/
│   ├── workflows/ci.yml          # Lint, typecheck y build en cada PR
│   └── pull_request_template.md
├── docs/                         # Planificación, decisiones y notas de reuniones
├── public/
│   └── images/                   # Logo, fotos del local y de productos
├── src/
│   ├── app/                      # Rutas (App Router)
│   │   ├── (landing)/            # Landing pública
│   │   ├── (panel)/panel/        # Sistema de gestión (requiere login)
│   │   └── api/                  # Endpoints
│   ├── components/
│   │   ├── ui/                   # Componentes base reutilizables
│   │   ├── landing/              # Secciones de la landing
│   │   └── panel/                # Componentes del panel
│   ├── features/                 # Lógica por módulo de negocio
│   │   ├── auth/
│   │   ├── stock/
│   │   ├── ventas/
│   │   ├── presupuestos/
│   │   ├── clientes/
│   │   └── estadisticas/
│   ├── db/
│   │   ├── index.ts              # Conexión a MySQL
│   │   ├── schema/               # Una tabla por archivo + relaciones
│   │   ├── migrations/           # Migraciones generadas por drizzle-kit
│   │   └── seed/                 # Datos de prueba para la demo
│   ├── lib/                      # Utilidades (moneda, fechas, etc.)
│   ├── hooks/                    # Hooks de React compartidos
│   ├── types/                    # Tipos compartidos
│   └── config/                   # Datos del negocio (dirección, horarios, WhatsApp)
├── tests/
│   ├── unit/
│   └── e2e/
├── docker-compose.yml            # MySQL local
└── .env.example
```

**Criterio:** `app/` solo arma rutas y páginas; la lógica de cada módulo vive en `features/<modulo>/` y los componentes visuales en `components/`. Así cada módulo crece sin mezclarse con los demás.

## Flujo de trabajo

Usamos dos ramas permanentes y una rama corta por cada cambio:

| Rama | Para qué |
| --- | --- |
| `main` | Producción. Solo recibe merges desde `develop` cuando todo funciona. |
| `develop` | Integración. Acá se juntan todos los cambios y se prueban antes de pasar a `main`. |
| `feat/...`, `fix/...`, `chore/...`, `docs/...` | Una rama por feature o cambio. Se borra al mergearse a `develop`. |

1. Cada tarea es una issue en el tablero de GitHub Projects.
2. Se crea la rama **desde `develop`** con prefijo y número de issue:
   - `feat/12-alta-de-productos`
   - `fix/18-stock-negativo`
   - `chore/3-config-ci`
   - `docs/5-readme`
3. Commits chicos con [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/), por ejemplo `feat(stock): alerta de stock mínimo`.
4. Se abre un pull request **hacia `develop`** con `Closes #N` en la descripción.
5. CI tiene que pasar en verde y Vercel genera una preview para revisar.
6. Merge con **squash** a `develop`; la rama del cambio se borra.
7. Cuando `develop` está estable y probada, se abre un PR de `develop` a `main` (merge commit, sin squash) y se despliega a producción.

```bash
git switch develop && git pull
git switch -c feat/12-alta-de-productos
# ...commits...
git push -u origin feat/12-alta-de-productos   # y abrir el PR hacia develop
```

`main` y `develop` están protegidas: no se hace push directo.

## Panel de gestión y login

- `/login`: ingreso con email y contraseña. No hay registro público; los usuarios los crea el administrador.
- `/panel`: protegido. `src/proxy.ts` redirige al login si no hay cookie de sesión y el servidor valida la sesión con `requerirSesion()` (`src/lib/sesion.ts`).
- Cada usuario tiene un rol: `admin` o `vendedor`.
- `npm run db:seed` crea un usuario de demo (`demo@smrepuestos.com.ar`); su contraseña está en `src/db/seed/usuarios.ts` o en `DEMO_PASSWORD`.

### Stock

- `/panel/stock`: listado paginado con búsqueda por código, descripción, marca o vehículo, filtro por rubro y por productos bajo el stock mínimo.
- `/panel/stock/nuevo` y `/panel/stock/[id]`: alta y edición de productos. Los productos no se borran: se dan de baja y dejan de aparecer.
- Cada cambio de stock queda registrado en `movimientos_stock` (ingreso inicial al crear, ajuste al editar).

### Ventas

- `/panel/ventas`: historial paginado con filtros por fecha (en hora de Argentina), medio de pago y cliente, y un resumen del período (cantidad, facturado y ticket promedio).
- `/panel/ventas/nueva`: buscador de productos con stock, carrito, cliente (o consumidor final), medio de pago y notas. Enter agrega el primer resultado.
- Al registrar, en una sola transacción se bloquean los productos, se valida el stock, se guarda la venta con los precios de la base y se descuenta el stock con un movimiento `venta` por producto. Si otra venta se llevó el stock antes, se muestra un aviso y no se guarda nada.
- `/panel/ventas/[id]`: detalle de la venta.

### Presupuestos

- `/panel/presupuestos`: listado con filtro por estado. Un presupuesto pendiente cuya fecha de validez ya pasó se muestra como vencido.
- `/panel/presupuestos/nuevo`: usa el mismo carrito que la venta, con cliente, fecha de validez (15 días por defecto) y notas. Los precios quedan fijos en el presupuesto y no se descuenta stock.
- `/panel/presupuestos/[id]`: detalle con tres acciones:
  - **Descargar PDF** (`/panel/presupuestos/[id]/pdf`): se genera en el servidor con `@react-pdf/renderer`, con logo y datos de `src/config/negocio.ts`.
  - **Enviar por WhatsApp**: abre `wa.me` con el detalle y el total. Si el teléfono del cliente se puede interpretar como número argentino, abre directo su chat; si no, WhatsApp deja elegir el contacto. El PDF no se adjunta solo: wa.me solo acepta texto.
  - **Convertir en venta** (o marcarlo como rechazado): registra la venta con los precios del presupuesto, descuenta stock y deja el presupuesto como aceptado con el enlace a la venta.

## Base de datos

El esquema vive en `src/db/schema/`, con una tabla por archivo:

| Tabla | Para qué |
| --- | --- |
| `productos` | Catálogo con código, marca, rubro, compatibilidad, costo, precio y stock |
| `proveedores` | A quién se le compra cada producto |
| `clientes` | Particulares, talleres y mayoristas |
| `ventas` / `venta_items` | Cada venta y sus productos, con el precio del momento |
| `presupuestos` / `presupuesto_items` | Presupuestos y su estado; se pueden convertir en venta |
| `movimientos_stock` | Cada entrada y salida de stock, para auditar |
| `user` / `session` / `account` / `verification` | Usuarios y sesiones de Better Auth |

Para cambiar el esquema: editar el archivo de la tabla, correr `npm run db:generate`, revisar el SQL generado en `src/db/migrations/` y commitearlo junto con el cambio.

El seed genera siempre los mismos datos: 200 repuestos, 60 clientes, 8 proveedores, 6 meses de ventas y 40 presupuestos, con algunos productos por debajo del stock mínimo.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Conexión a MySQL. En local coincide con `docker-compose.yml`. |
| `BETTER_AUTH_SECRET` | Secreto para firmar sesiones. Generarlo con `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | URL pública de la app (`http://localhost:3000` en local). |
| `DEMO_PASSWORD` | Opcional: contraseña del usuario de demo que crea el seed. |

Nunca subir `.env` al repo; en producción las variables se cargan en Vercel.

## Deploy

`main` se despliega a producción y `develop` y cada PR tienen su preview en Vercel. Ver [docs/deploy.md](./docs/deploy.md).
