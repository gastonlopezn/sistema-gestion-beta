# Deploy en Vercel

La app se despliega en [Vercel](https://vercel.com). Vercel detecta Next.js solo, así que no hace falta `vercel.json`.

## Cómo queda armado

| Rama | Entorno en Vercel | URL |
| --- | --- | --- |
| `main` | Production | dominio principal (por ahora `*.vercel.app`) |
| `develop` | Preview con dominio fijo | p. ej. `develop-sm-repuestos.vercel.app` |
| `feat/...`, `fix/...`, etc. | Preview por cada push | URL única que Vercel comenta en el PR |

## Pasos para conectarlo (una sola vez)

1. Entrar a [vercel.com/new](https://vercel.com/new) con la cuenta de GitHub.
2. **Import Git Repository** → elegir `gastonlopezn/sistema-gestion-beta`. Si no aparece, darle acceso a la app de Vercel en GitHub.
3. Dejar los valores detectados: Framework `Next.js`, Build `npm run build`, Install `npm install`. Click en **Deploy**.
4. **Importante:** Vercel toma como producción la rama por defecto del repo, que es `develop`. Cambiarla:
   - Project → **Settings → Environments → Production → Branch Tracking** → `main`.
5. Dominio fijo para `develop`:
   - **Settings → Domains → Add** → `develop-sm-repuestos.vercel.app` (o el nombre libre que elijas) → asignarlo a la rama `develop`.
6. Abrir un PR de prueba y verificar que el bot de Vercel comente la URL de preview.

## Variables de entorno

Se cargan en **Settings → Environment Variables**, separadas por entorno (Production, Preview, Development). Nunca van al repo.

| Variable | Production | Preview | Cuándo |
| --- | --- | --- | --- |
| `DATABASE_URL` | base MySQL de producción | base MySQL de demo/pruebas | al conectar la base (issue #3) |

## Plan

- **Demo:** plan Hobby (gratis).
- **Producción con el cliente:** plan Pro, porque Hobby no permite uso comercial. Verificar precios en [vercel.com/pricing](https://vercel.com/pricing).
