# CRUD de tareas con JavaScript y Vue

Aplicación independiente que combina una API REST en Express, persistencia
SQLite y una interfaz web en Vue 3. El módulo `node:sqlite` incluido en Node.js
evita instalar controladores nativos adicionales.

## Requisitos

- Node.js 24.15 o superior.
- npm, incluido con Node.js.

Después de instalar Node por primera vez, abre una terminal nueva de VS Code para
que el comando quede disponible en el `PATH`.

## Instalación

Desde esta carpeta:

```powershell
npm install
```

`package-lock.json` conserva las versiones exactas verificadas.

## Ejecutar las pruebas

```powershell
npm test
```

Con cobertura:

```powershell
npm run test:coverage
```

La suite usa una base SQLite en memoria para la API y `jsdom` para renderizar Vue
sin abrir un navegador. La base de desarrollo no se modifica.

## Ejecutar la aplicación completa

```powershell
npm run dev
```

Este comando abre dos procesos:

- API Express: `http://127.0.0.1:3000/api/tasks`
- Interfaz Vue: `http://localhost:5173`

Vite reenvía las solicitudes `/api` del navegador hacia Express. La base de
desarrollo se crea automáticamente en `data/tasks.sqlite`.

## Otros comandos

```powershell
npm run dev:api
npm run dev:web
npm run build
```

- `dev:api` ejecuta solamente Express.
- `dev:web` ejecuta solamente Vue y requiere que la API esté en el puerto 3000.
- `build` comprueba y genera la versión compilada en `dist/`.

## Demostración sugerida

1. Ejecuta `npm test` y muestra que pasan las pruebas de `tests/api` y
   `tests/web`.
2. Ejecuta `npm run dev`.
3. Abre `http://localhost:5173`.
4. Crea una tarea.
5. Pulsa **Editar**, cambia el texto y marca **Completada**.
6. Guarda los cambios.
7. Pulsa **Eliminar**.
8. Regresa al código y relaciona esas acciones con `server/app.js` y
   `tests/web/App.test.js`.

## Estructura

```text
server/
├── app.js          # API Express y almacenamiento SQLite
├── index.js        # Inicio del servidor HTTP
└── validation.js   # Reglas de entrada
src/
├── api/            # Cliente HTTP utilizado por Vue
├── App.vue         # Interfaz y estado del CRUD
├── main.js         # Arranque de Vue
└── styles.css      # Presentación adaptable
tests/
├── api/            # Pruebas HTTP con Supertest
└── web/            # Pruebas de Vue y del cliente HTTP
```

## Relación con TDD

El historial alterna commits `test(javascript)` y `feat(javascript)` para los
endpoints. Los commits `test(vue)` definen la interacción esperada antes de que
aparezcan los controles y comportamientos visuales correspondientes.

