# Global Think Challenge Web

Tienda de productos informáticos para la entrevista técnica.

## Requisitos previos

Antes de comenzar, asegurate de tener instalado en tu máquina:

- [Node.js](https://nodejs.org/) (versión recomendada LTS)
- Un gestor de paquetes: `npm`, `yarn`, `pnpm` o `bun`

## Instalación

Cloná este repositorio en tu equipo y accedé al directorio del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd global-think-challenge-web
```

Luego instalá las dependencias:

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

## Levantar el proyecto

Para iniciar el servidor de desarrollo, ejecutá:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Una vez que el servidor esté corriendo, abrí tu navegador en [http://localhost:3000](http://localhost:3000).

### API local

Para iniciar la API de productos, ejecutá en otra terminal:

```bash
cd backend
npm install
npm start
```

La colección de productos queda disponible en [http://localhost:3001/products](http://localhost:3001/products) y las categorías en [http://localhost:3001/categories](http://localhost:3001/categories). Para consultar páginas de 8 productos, usá `http://localhost:3001/products?_page=1&_per_page=8`; json-server devuelve `data`, `pages` e `items` junto con los enlaces de navegación. También se pueden combinar filtros, por ejemplo `http://localhost:3001/products?_page=1&_per_page=8&titulo:contains=Canon&categoria=Electr%C3%B3nica`.

El backend muestra al iniciar los enlaces directos a cada endpoint. También registra cada petición con colores, método, ruta, código HTTP y duración, con una separación visual entre el mensaje de inicio y los logs.

El frontend toma la URL de la API desde `frontend/.env.local`, configurada mediante `NEXT_PUBLIC_API_URL`. Al clonar el proyecto, copiá `frontend/.env.example` a `frontend/.env.local` y reiniciá Next.js después de cambiar la variable.

Los favoritos y el carrito se guardan en el `localStorage` del navegador para conservarse al recargar la página.

### Deploy en Vercel

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/reactions-demo)

## Screenshots

![Screenshot_1](./screenshots/Screenshot_1.png)

![Screenshot_2](./screenshots/Screenshot_2.png)

![Screenshot_3](./screenshots/Screenshot_3.png)

![Screenshot_4](./screenshots/Screenshot_4.png)

![Screenshot_5](./screenshots/Screenshot_5.png)

![Screenshot_6](./screenshots/Screenshot_6.png)
