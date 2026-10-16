# Tarea Viernes 16 - Grupo

Aplicación web para administrar usuarios y tareas. El repositorio contiene un frontend en Angular y una API REST en Fastify conectada a PostgreSQL.

## Requisitos

- Node.js y pnpm.
- Docker Desktop en ejecución, con el motor de contenedores iniciado.
- Git para clonar el repositorio.

## Preparar la API y la base de datos

Desde la raíz del repositorio, abre una terminal en la carpeta `api`:

```bash
cd api
```

Crea el archivo de configuración local a partir del ejemplo:

```bash
cp .env.example .env
```

El archivo `.env.example` trae valores locales para PostgreSQL (`localhost:5437`, base `tareas`) y la API (`PORT=3000`). Para desarrollo local puedes conservar esos valores. No subas el archivo `.env` al repositorio.

Instala las dependencias e inicia PostgreSQL con Docker Compose:

```bash
pnpm install
pnpm run db:up
```

Docker Compose crea el contenedor de PostgreSQL/PostGIS y carga el SQL inicial desde `api/db` cuando la base de datos se inicializa por primera vez.

## Iniciar la API

En otra terminal, desde la raíz del repositorio, ve a `api` e inicia la API:

```bash
cd api
pnpm dev
```

La API queda disponible en `http://localhost:3000`. La documentación interactiva de Swagger está en `http://localhost:3000/documentation`.

## Preparar e iniciar el frontend

En otra terminal, desde la raíz del repositorio:

```bash
cd frontend
pnpm install
pnpm start
```

Abre `http://localhost:4200`. El entorno de desarrollo del frontend apunta a la API en `http://localhost:3000`.

## Detener la base de datos

Desde una terminal en `api`:

```bash
pnpm run db:down
```

## Comprobaciones

La prueba completa de crear, listar, editar y borrar usuarios y tareas desde el frontend, contra la API y la base de datos, está pendiente.

Cuando se realice la prueba, anotar aquí los resultados y registrar como issues nuevas los problemas encontrados.

```

```
