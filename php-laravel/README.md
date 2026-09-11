# CRUD de tareas con PHP y Laravel

Esta carpeta contiene la tercera implementación del mismo contrato CRUD del proyecto. Es una API REST construida con PHP 8.5, Laravel 13, Eloquent y SQLite. Su comportamiento se desarrolló con TDD y se verifica con PHPUnit.

## Qué permite hacer

- Listar todas las tareas.
- Crear una tarea.
- Consultar una tarea por identificador.
- Actualizar todos sus datos.
- Eliminarla.
- Rechazar títulos vacíos o con más de 100 caracteres.
- Responder `404` cuando una tarea no existe.

Cada tarea usa esta forma:

```json
{
  "id": 1,
  "title": "Preparar exposición",
  "description": "Explicar el ciclo rojo-verde-refactorizar",
  "completed": false
}
```

## Requisitos

- PHP 8.3, 8.4 o 8.5 con las extensiones `fileinfo`, `mbstring`, `openssl`, `pdo_sqlite`, `sqlite3` y `zip`.
- Composer 2.

## Instalación

Desde PowerShell, situado en esta carpeta:

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
if (-not (Test-Path database\database.sqlite)) {
    New-Item -ItemType File database\database.sqlite
}
php artisan migrate
```

El archivo `.env.example` ya selecciona SQLite, por lo que no hay que instalar ni configurar un servidor de base de datos.

## Ejecutar las pruebas

```powershell
php artisan test --compact
```

La suite tiene 17 pruebas y comprueba 52 aserciones. Los casos están separados por operación en `tests/Feature/Tasks`.

Para ejecutar únicamente una parte durante la exposición:

```powershell
php artisan test --compact --filter=TaskStoreTest
php artisan test --compact --filter=TaskUpdateTest
```

## Iniciar la API

```powershell
php artisan serve --port=8002
```

La API quedará disponible en `http://127.0.0.1:8002/api/tasks`.

## Probar el CRUD manualmente

En otra terminal de PowerShell:

```powershell
$baseUrl = 'http://127.0.0.1:8002/api/tasks'

# CREATE
$created = Invoke-RestMethod -Method Post -Uri $baseUrl `
    -ContentType 'application/json' `
    -Body '{"title":"Estudiar Laravel","description":"Preparar la demostración","completed":false}'
$created

# READ
Invoke-RestMethod -Method Get -Uri $baseUrl
Invoke-RestMethod -Method Get -Uri "$baseUrl/$($created.id)"

# UPDATE
Invoke-RestMethod -Method Put -Uri "$baseUrl/$($created.id)" `
    -ContentType 'application/json' `
    -Body '{"title":"Estudiar Laravel","description":"Demostración lista","completed":true}'

# DELETE
Invoke-WebRequest -Method Delete -Uri "$baseUrl/$($created.id)"
```

## Dónde está cada responsabilidad

- `routes/api.php`: declara las rutas REST.
- `app/Http/Controllers/TaskController.php`: coordina cada operación.
- `app/Http/Requests`: valida y normaliza las entradas.
- `app/Http/Resources/TaskResource.php`: define la representación JSON pública.
- `app/Models/Task.php`: representa la entidad persistida con Eloquent.
- `database/migrations`: crea la tabla `tasks`.
- `database/factories/TaskFactory.php`: fabrica datos de prueba.
- `tests/Feature/Tasks`: demuestra el comportamiento externo de la API.

## Cómo se aplicó TDD

Cada comportamiento comenzó con una prueba de característica. La prueba se ejecutó en rojo, se añadió la implementación mínima para llevarla a verde y luego se revisaron nombres, responsabilidades y estilo. El historial Git conserva por separado los commits `test(php)` y `feat(php)` para que este proceso sea verificable.

Ejemplo para explicarlo:

1. `TaskStoreTest` exige `201`, el JSON esperado y una fila en la base de datos.
2. Antes de implementar `store`, la prueba falla porque la ruta no satisface el contrato.
3. `StoreTaskRequest`, `TaskController` y `TaskResource` aportan la implementación mínima.
4. Al volver a ejecutar, la prueba pasa y protege el comportamiento ante cambios futuros.

## Formato y seguridad de dependencias

```powershell
vendor\bin\pint --test
composer audit
```

`Pint` comprueba el estilo de PHP y `composer audit` revisa avisos de seguridad conocidos en las dependencias instaladas.
