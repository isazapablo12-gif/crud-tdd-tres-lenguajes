# CRUD de tareas con Python y FastAPI

API REST independiente que implementa el contrato común del proyecto mediante
FastAPI y SQLite.

## Requisitos

- Python 3.11 o superior.

## Instalación en Windows

Desde esta carpeta:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock
```

Si `py -3.11` no está disponible, se puede usar `python`:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.lock
```

## Ejecutar las pruebas

```powershell
.\.venv\Scripts\python.exe -m pytest
```

Con cobertura:

```powershell
.\.venv\Scripts\python.exe -m pytest --cov=app --cov-report=term-missing
```

Cada prueba recibe una base SQLite temporal mediante la fixture de
`tests/conftest.py`. La base de desarrollo nunca es modificada por la suite.

## Ejecutar la API

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001
```

Direcciones útiles:

- API: `http://127.0.0.1:8001/api/tasks`
- Swagger UI: `http://127.0.0.1:8001/docs`
- Esquema OpenAPI: `http://127.0.0.1:8001/openapi.json`

La base de desarrollo se crea automáticamente en `data/tasks.sqlite`.

## Prueba manual rápida

Con la API ejecutándose:

```powershell
$task = Invoke-RestMethod `
  -Method Post `
  -Uri http://127.0.0.1:8001/api/tasks `
  -ContentType 'application/json' `
  -Body '{"title":"Estudiar FastAPI","description":"Preparar la exposición"}'

Invoke-RestMethod -Uri http://127.0.0.1:8001/api/tasks

Invoke-RestMethod `
  -Method Put `
  -Uri "http://127.0.0.1:8001/api/tasks/$($task.id)" `
  -ContentType 'application/json' `
  -Body '{"title":"Exponer FastAPI","description":"Demostración lista","completed":true}'

Invoke-RestMethod `
  -Method Delete `
  -Uri "http://127.0.0.1:8001/api/tasks/$($task.id)"
```

## Estructura

```text
app/
├── main.py        # Creación de FastAPI y rutas HTTP
├── repository.py  # Persistencia SQLite
└── schemas.py     # Entrada, salida y validaciones
tests/
├── conftest.py    # Cliente y base temporal
└── test_tasks_api.py
```

## Relación con TDD

Los commits `test(python)` agregan primero un comportamiento que falla. El commit
`feat(python)` inmediatamente posterior contiene el mínimo necesario para dejar la
suite en verde. El historial incluye ciclos para listado, creación, validación,
consulta, actualización y eliminación.

