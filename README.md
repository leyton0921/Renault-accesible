# Renault Accesible

Plataforma web para que el personal de Renault Colombia se comunique con
clientes sordos o con discapacidad auditiva mediante videos en Lengua de
Señas Colombiana (LSC).

## Qué cambió respecto a la versión de v0

- **Se quitó el login del panel de administración.** El brief original decía
  explícitamente "sin login, sin autenticación", pero v0 había agregado
  usuario/contraseña con Supabase Auth. Ahora `/admin` se abre directo.
- **Un solo cliente de Supabase**, usado solo en el servidor con la
  `service_role key`. Sin esto no hacía falta `middleware.ts`, cookies de
  sesión, ni el paquete `@supabase/ssr` — menos piezas, menos que se puede
  romper.
- **Sin shadcn/ui.** Se reemplazó por componentes propios muy simples con
  Tailwind. Menos dependencias, menos archivos de configuración, más fácil
  de personalizar sin pelear con una librería de componentes.
- **Next.js 14 estable** (en vez de Next 16 / React 19, ambos aún en fases
  tempranas cuando se generó el proyecto original). Es la versión con más
  documentación, soporte y estabilidad en producción.
- **Reordenar con flechas ↑↓** en vez de arrastrar y soltar (drag & drop).
  Cumple el mismo objetivo sin añadir una librería extra de arrastre.
- **Reproductor de video nativo** (`<video controls>`) en vez de un
  reproductor hecho a mano. El navegador ya trae play/pausa, volumen,
  pantalla completa y barra de progreso — no hay que reconstruirlo.
- **Todo con Server Actions** (formularios normales de HTML que llaman
  funciones del servidor). Sin gestores de estado ni llamadas `fetch`
  manuales desde el cliente.

## Estructura del proyecto

```
app/
  page.tsx                 → Inicio público (categorías)
  categoria/[id]/page.tsx  → Videos de una categoría
  video/[id]/page.tsx      → Reproductor de un video
  admin/
    page.tsx               → Panel: estadísticas
    categorias/page.tsx    → Panel: gestionar categorías
    videos/page.tsx        → Panel: gestionar videos (incluye subida)
    actions.ts             → Toda la lógica de escritura (crear/editar/borrar)
components/                → Piezas de interfaz reutilizables
lib/
  supabase.ts               → Único cliente de base de datos
  queries.ts                → Lecturas para el sitio público
  admin-queries.ts          → Lecturas para el panel de administración
  types.ts                  → Tipos compartidos
scripts/001_schema.sql      → Crea las tablas y el bucket de almacenamiento
```

## Puesta en marcha

### 1. Crear el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Entra a **SQL Editor** y ejecuta el contenido de `scripts/001_schema.sql`.
   Esto crea las tablas `categories` y `videos`, el bucket de almacenamiento
   `media` (público, para que los videos se puedan reproducir) y unas
   categorías de ejemplo.
3. Ve a **Project Settings → API** y copia:
   - `Project URL`
   - `service_role key` (⚠️ no la `anon key` — esta app necesita la
     `service_role` porque no hay login; guárdala solo en el servidor)

### 2. Configurar el proyecto localmente

```bash
cp .env.example .env.local
```

Pega en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

Instala dependencias y arranca:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` (sitio público) y
`http://localhost:3000/admin` (panel de administración).

### 3. Desplegar

El proyecto funciona en Vercel sin configuración adicional: solo
conecta el repositorio y agrega las mismas dos variables de entorno
en **Project Settings → Environment Variables**.

### 4. Generar el código QR

El QR debe apuntar a la URL pública final (por ejemplo
`https://renault-accesible.vercel.app`). Como las categorías y videos
se cargan siempre desde la base de datos, el mismo QR sigue funcionando
aunque agregues o cambies contenido después.

## Cómo agregar contenido

Todo se hace desde `/admin`, sin tocar código:

- **Categorías**: crear, editar nombre/descripción/ícono, activar u
  ocultar, reordenar con las flechas, eliminar.
- **Videos**: subir el archivo `.mp4` y una miniatura opcional, asignar a
  una categoría, editar, reemplazar el archivo, activar u ocultar,
  reordenar, eliminar.

Los nombres de íconos deben existir en <https://lucide.dev/icons> (por
ejemplo `Hand`, `Car`, `Wrench`, `Calendar`, `FileText`, `CreditCard`,
`ShieldCheck`, `Phone`).

## Nota sobre seguridad de `/admin`

Tal como pedía el requerimiento original, no hay usuario ni contraseña:
cualquiera que conozca la URL `/admin` puede editar el contenido. Como
el sitio no maneja datos personales de clientes, esto es aceptable para
un panel de uso interno, pero si más adelante quieres protegerlo, la
forma más simple es añadir un `middleware.ts` que pida una clave
compartida (una sola contraseña para todo el personal, sin cuentas
individuales) antes de dejar pasar a `/admin`.
