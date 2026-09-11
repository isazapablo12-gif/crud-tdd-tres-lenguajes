# Guía para estudiar, probar y exponer el proyecto

Esta guía permite que cada integrante prepare uno de los tres lenguajes aunque no haya escrito la implementación. La meta no es memorizar todo el código: es poder seguir una operación desde la prueba hasta la respuesta HTTP y demostrarla con seguridad.

## 1. Preparación común

Después de recibir la URL del repositorio:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd crud-tdd-tres-lenguajes
code .
```

En VS Code conviene abrir una terminal nueva después de instalar Node, Python, PHP o Composer. Comprueben qué herramientas reconoce el equipo:

```powershell
git --version
node --version
npm --version
py --version
php --version
composer --version
```

No hace falta instalar MySQL, PostgreSQL ni otro servidor: las tres aplicaciones usan SQLite.

## 2. Reparto recomendado

| Expositor | Tema | Demostración principal | Prueba que debe entender |
| --- | --- | --- | --- |
| 1 | JavaScript, Vue y Express | CRUD completo en el navegador | `tests/web/App.test.js` |
| 2 | Python y FastAPI | CRUD desde Swagger UI | `tests/test_tasks_api.py` |
| 3 | PHP y Laravel | CRUD por HTTP y estructura MVC | `tests/Feature/TaskStoreTest.php` |

Si solamente exponen dos personas, una puede presentar JavaScript/Vue y la otra comparar Python con PHP. Si expone una sola persona, debe dedicar más tiempo a Vue y mostrar solo una operación representativa en cada API adicional.

## 3. Conceptos comunes que todos deben dominar

CRUD significa:

| Letra | Acción | HTTP en el proyecto |
| --- | --- | --- |
| C | Create, crear | `POST /api/tasks` |
| R | Read, leer | `GET /api/tasks` y `GET /api/tasks/{id}` |
| U | Update, actualizar | `PUT /api/tasks/{id}` |
| D | Delete, eliminar | `DELETE /api/tasks/{id}` |

Estados importantes:

- `200 OK`: consulta o actualización correcta.
- `201 Created`: creación correcta.
- `204 No Content`: eliminación correcta, sin cuerpo de respuesta.
- `404 Not Found`: el identificador no existe.
- `422 Unprocessable Content`: el JSON llegó, pero incumple una regla de validación.

TDD usa un ciclo pequeño:

1. **Rojo:** escribir una prueba de un comportamiento que aún no existe y comprobar que falla por la razón esperada.
2. **Verde:** agregar el código mínimo que hace pasar la prueba.
3. **Refactorización:** mejorar el diseño sin cambiar el comportamiento y ejecutar nuevamente toda la suite.

Una prueba automatizada no es “probar a ver qué pasa”. Contiene una entrada concreta y aserciones que definen la salida esperada. Al quedar en el repositorio, protege ese comportamiento frente a cambios posteriores.

## 4. Expositor de JavaScript, Vue y Express

### Instalación y pruebas

```powershell
cd javascript-vue
npm install
npm test
npm run test:coverage
npm run build
```

Resultado de referencia: 25 pruebas aprobadas. La cobertura verificada supera 90 % y el mínimo automático es 80 %.

### Archivos que debe recorrer

1. `tests/web/App.test.js`: describe lo que hace una persona en la interfaz.
2. `src/App.vue`: mantiene el estado y coordina formularios, edición y eliminación.
3. `src/api/tasksApi.js`: traduce esas acciones en solicitudes HTTP.
4. `tests/api/tasks.test.js`: verifica el contrato de Express.
5. `server/app.js`: implementa las rutas y usa SQLite.
6. `server/validation.js`: contiene las reglas de entrada.

### Demostración

```powershell
npm run dev
```

Abrir `http://localhost:5173` y hacer lo siguiente:

1. Mostrar el estado vacío.
2. Intentar guardar un título compuesto solo por espacios; la interfaz debe impedirlo.
3. Crear una tarea válida.
4. Editarla, cambiar la descripción y marcarla como completada.
5. Recargar el navegador para evidenciar que SQLite conservó el dato.
6. Eliminar la tarea.

### Ciclo TDD que puede enseñar

```powershell
git show 876544f
git show e9ce970
```

El primer commit define mediante pruebas la carga y creación desde Vue; el segundo agrega la interfaz mínima que cumple esas expectativas.

### Explicación breve sugerida

“Vue presenta el CRUD y administra el estado del formulario. No accede directamente a la base de datos: usa un cliente HTTP para comunicarse con Express. Express valida la entrada y persiste las tareas en SQLite. Vitest prueba tanto la API como las interacciones del componente.”

## 5. Expositor de Python y FastAPI

### Instalación y pruebas

```powershell
cd python-fastapi
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing --cov-fail-under=80
```

Resultado de referencia: 14 pruebas aprobadas y 98 % de cobertura verificada.

### Archivos que debe recorrer

1. `tests/test_tasks_api.py`: contiene los escenarios HTTP.
2. `tests/conftest.py`: crea un cliente y una base temporal para cada prueba.
3. `app/main.py`: declara FastAPI y los endpoints.
4. `app/schemas.py`: valida y transforma el JSON mediante Pydantic.
5. `app/repository.py`: encapsula las consultas SQLite.

### Demostración con Swagger

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001
```

Abrir `http://127.0.0.1:8001/docs`:

1. Expandir `POST /api/tasks`, pulsar **Try it out** y crear una tarea.
2. Ejecutar `GET /api/tasks` y mostrar el arreglo.
3. Ejecutar `PUT /api/tasks/{task_id}` con el identificador creado.
4. Ejecutar `DELETE /api/tasks/{task_id}`.
5. Repetir `GET /api/tasks/{task_id}` y mostrar el `404`.
6. Intentar crear `{"title":"   "}` y mostrar el `422`.

### Ciclo TDD que puede enseñar

```powershell
git show dc7f609
git show 64484b3
```

El primer commit exige crear y persistir una tarea; el segundo implementa el repositorio SQLite y el endpoint necesario para volver verde la prueba.

### Explicación breve sugerida

“FastAPI recibe la solicitud y Pydantic valida su estructura. El repositorio separa el código SQL de las rutas. pytest usa una base SQLite temporal, por lo que repetir la suite no contamina los datos de la demostración.”

## 6. Expositor de PHP y Laravel

### Instalación y pruebas

```powershell
cd php-laravel
composer install
Copy-Item .env.example .env
php artisan key:generate
if (-not (Test-Path database\database.sqlite)) {
    New-Item -ItemType File database\database.sqlite
}
php artisan migrate
php artisan test --compact
```

Resultado de referencia: 17 pruebas y 52 aserciones aprobadas.

### Archivos que debe recorrer

1. `routes/api.php`: mapea las cinco operaciones REST.
2. `tests/Feature/TaskStoreTest.php`: comprueba respuesta y persistencia.
3. `app/Http/Controllers/Api/TaskController.php`: coordina el caso de uso.
4. `app/Http/Requests/StoreTaskRequest.php`: valida y normaliza la creación.
5. `app/Http/Resources/TaskResource.php`: controla el JSON público.
6. `app/Models/Task.php`: representa la tarea con Eloquent.
7. `database/migrations/*create_tasks_table.php`: define la tabla.

### Demostración por PowerShell

Primera terminal:

```powershell
php artisan serve --port=8002
```

Segunda terminal:

```powershell
$url = 'http://127.0.0.1:8002/api/tasks'
$task = Invoke-RestMethod -Method Post -Uri $url `
  -ContentType 'application/json' `
  -Body '{"title":"Exponer Laravel","description":"Mostrar Eloquent","completed":false}'

Invoke-RestMethod -Method Get -Uri $url

Invoke-RestMethod -Method Put -Uri "$url/$($task.id)" `
  -ContentType 'application/json' `
  -Body '{"title":"Exponer Laravel","description":"Demostración lista","completed":true}'

Invoke-WebRequest -Method Delete -Uri "$url/$($task.id)"
```

Para mostrar validación:

```powershell
Invoke-WebRequest -SkipHttpErrorCheck -Method Post -Uri $url `
  -ContentType 'application/json' `
  -Body '{"title":"   "}'
```

### Ciclo TDD que puede enseñar

```powershell
git show 58e8ce9
git show 9d10be2
```

El primer commit agrega pruebas de creación y validación que fallan; el segundo incorpora Form Request, controlador, recurso y modelo para cumplirlas.

### Explicación breve sugerida

“Laravel resuelve la ruta y entrega la solicitud al controlador. Un Form Request autoriza, normaliza y valida los datos. Eloquent persiste el modelo y un API Resource limita el JSON que se expone. PHPUnit ejecuta pruebas Feature con una base SQLite en memoria.”

## 7. Cómo comprobar la evidencia TDD

Desde la raíz:

```powershell
git log --oneline --all --reverse
git show <HASH_DEL_COMMIT_ROJO>
git show <HASH_DEL_COMMIT_VERDE>
git diff <HASH_ROJO>^ <HASH_VERDE>
```

Los commits `test(...)` se guardaron deliberadamente cuando la prueba nueva estaba roja. Por eso no se debe cambiar temporalmente a uno de esos commits justo antes de la exposición. `main` siempre queda verde. La tabla completa está en `docs/evidencias-tdd.md`.

## 8. Verificación de todo el repositorio

Después de instalar una vez las dependencias de las tres carpetas:

```powershell
cd ..
.\scripts\verificar-todo.ps1
```

En GitHub, la pestaña **Actions** mostrará tres trabajos independientes. Un visto bueno verde en los tres significa que las pruebas, coberturas, compilación y formato configurados pasaron en un equipo limpio.

## 9. Guion de exposición de cinco minutos por persona

1. **30 segundos:** nombrar lenguaje, framework y responsabilidad.
2. **45 segundos:** enseñar las carpetas clave.
3. **45 segundos:** ejecutar la suite y explicar qué aísla la base temporal.
4. **90 segundos:** demostrar Create, Read, Update y Delete.
5. **45 segundos:** provocar un `422` o `404`.
6. **45 segundos:** mostrar un par de commits rojo-verde.

Si el tiempo total es corto, solo JavaScript necesita demostrar visualmente las cuatro operaciones; Python y PHP pueden enseñar una prueba distinta y comparar cómo llegan al mismo resultado.

## 10. Preguntas frecuentes y respuestas

**¿Las tres implementaciones comparten una base de datos?**

No. Comparten el contrato, pero cada una es independiente y tiene su propio SQLite.

**¿Por qué usar el mismo dominio?**

Permite comparar lenguajes y herramientas sin que cambien los requisitos funcionales.

**¿Dónde está el framework de frontend?**

En `javascript-vue`, donde Vue 3 renderiza y prueba el CRUD visual.

**¿Una cobertura alta demuestra TDD?**

No. La cobertura dice qué código fue ejecutado. La secuencia de commits y las pruebas escritas antes de la implementación son la evidencia de TDD.

**¿Son unitarias todas las pruebas?**

No. Predominan pruebas de integración o Feature porque recorren rutas HTTP y persistencia. Las pruebas Vue también comprueban interacciones del componente y el cliente HTTP.

**¿Por qué usar SQLite?**

Reduce la preparación, funciona en un archivo o en memoria y permite concentrar la exposición en CRUD y TDD.

**¿Por qué 422 y no 400?**

El cuerpo puede ser JSON válido, pero su contenido incumple reglas como título obligatorio o longitud máxima.

**¿Por qué DELETE responde 204?**

La operación terminó correctamente y no necesita devolver una representación.

**¿Qué ocurre si se repiten las pruebas?**

Deben producir el mismo resultado porque cada suite usa almacenamiento temporal o reinicia su estado.

## 11. Solución rápida de problemas

- **“node/npm no se reconoce”**: cerrar y abrir una terminal nueva de VS Code.
- **“No module named…” en Python**: usar el ejecutable dentro de `.venv`, no otro Python del sistema.
- **PHP informa una extensión faltante**: habilitar `fileinfo`, `mbstring`, `pdo_sqlite`, `sqlite3` y `zip` en `php.ini`.
- **Laravel dice “No application encryption key”**: ejecutar `php artisan key:generate`.
- **Laravel no encuentra la tabla**: crear `database/database.sqlite` y ejecutar `php artisan migrate`.
- **Un puerto ya está ocupado**: cerrar la ejecución anterior o elegir otro puerto y ajustar la URL de la demostración.
- **La interfaz Vue no encuentra la API**: usar `npm run dev`, que inicia tanto Express como Vite.

## 12. Lista de control antes de exponer

- Clonar o actualizar `main` con anticipación.
- Instalar las dependencias, sin depender de la red durante la clase.
- Ejecutar la suite correspondiente al menos una vez.
- Hacer la demostración completa y anotar el identificador creado.
- Cerrar servidores anteriores antes de comenzar.
- Mantener abiertas solo las pestañas de código que se van a explicar.
- Tener como respaldo las salidas verdes de GitHub Actions.
- No editar la implementación minutos antes de la presentación.
