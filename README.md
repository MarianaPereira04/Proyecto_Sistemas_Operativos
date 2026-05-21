# Simulador de Algoritmos de Sistemas Operativos

Este es un simulador interactivo de algoritmos de sistemas operativos creado para fines educativos. 
Está construido con una arquitectura Fullstack utilizando Next.js (Frontend) y NestJS (Backend).

## Tecnologías

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript
- **Backend:** NestJS, TypeScript

## Requisitos Previos

- Node.js (v18+)
- npm (v9+)

## Instalación

1. Clona el repositorio o descarga el código.
2. Desde el directorio raíz del proyecto, instala todas las dependencias (raíz, frontend y backend):
   ```bash
   npm run install:all
   ```

## Ejecución en Desarrollo

Para iniciar tanto el frontend como el backend simultáneamente, ejecuta:

```bash
npm run dev
```

Esto iniciará:
- El servidor de Frontend en [http://localhost:3000](http://localhost:3000)
- El servidor de Backend en [http://localhost:3001](http://localhost:3001) (Nota: El backend por defecto corre en 3000, pero se configurará en el puerto 3001 para no causar conflictos con Next.js).

## Estructura del Proyecto

- `/frontend`: Aplicación Next.js. Contiene la interfaz de usuario.
- `/backend`: Aplicación NestJS. Contiene la lógica de negocio y las APIs de los algoritmos.