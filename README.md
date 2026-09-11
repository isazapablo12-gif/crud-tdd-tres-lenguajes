# CRUD con TDD en tres lenguajes

Proyecto académico que implementa el mismo administrador de tareas en tres lenguajes diferentes, sin Java ni Kotlin, y conserva evidencia del proceso de desarrollo guiado por pruebas (TDD).

## Implementaciones

| Carpeta | Lenguaje | Tecnologías | Alcance | Pruebas verificadas |
| --- | --- | --- | --- | ---: |
| `javascript-vue/` | JavaScript | Vue 3, Express, SQLite y Vitest | API REST e interfaz web | 25 |
| `python-fastapi/` | Python | FastAPI, SQLite y pytest | API REST | 14 |
| `php-laravel/` | PHP | Laravel, Eloquent, SQLite y PHPUnit | API REST | 17 |

Las aplicaciones son independientes, almacenan sus propios datos y respetan el mismo [contrato REST](docs/contrato-api.md). Vue cumple el requisito de usar un framework de frontend.

## Qué demuestra el repositorio

- Las operaciones Create, Read, Update y Delete.
- La misma especificación implementada en JavaScript, Python y PHP.
- Una interfaz web completa construida con Vue.
- Pruebas de API, persistencia, validación e interacción de interfaz.
- Ciclos TDD verificables mediante pares de commits `test` y `feat`.
- Bases SQLite de prueba aisladas de los datos usados en una demostración.
- Integración continua con un trabajo independiente por lenguaje.

## Inicio rápido

Cada aplicación incluye instrucciones completas para Windows y una demostración manual:

- [JavaScript, Vue y Express](javascript-vue/README.md): `npm install`, `npm test` y `npm run dev`.
- [Python y FastAPI](python-fastapi/README.md): crear `.venv`, instalar `requirements.lock` y ejecutar pytest o Uvicorn.
- [PHP y Laravel](php-laravel/README.md): `composer install`, preparar `.env`, migrar y ejecutar PHPUnit o Artisan.

Una vez instaladas las dependencias de las tres carpetas, toda la verificación local se puede lanzar desde la raíz:

```powershell
.\scripts\verificar-todo.ps1
```

El script exige al menos 80 % de cobertura en Python y JavaScript, compila Vue, ejecuta PHPUnit, comprueba el formato PHP y, cuando Composer está disponible en `PATH`, audita sus dependencias.

## Documentación

- [Alcance y decisiones](docs/alcance.md)
- [Contrato común de la API](docs/contrato-api.md)
- [Estrategia TDD](docs/estrategia-tdd.md)
- [Evidencias TDD en Git](docs/evidencias-tdd.md)
- [Guía para estudiar, probar y exponer](docs/guia-companeros.md)

## Estructura

```text
crud-tdd-tres-lenguajes/
├── .github/workflows/ci.yml
├── docs/
├── javascript-vue/
├── php-laravel/
├── python-fastapi/
└── scripts/verificar-todo.ps1
```

## Estado verificado

Las 56 pruebas automatizadas pasan en el entorno local. También se recorrieron las cinco rutas de cada API contra servidores HTTP reales y la interfaz Vue compiló correctamente para producción. GitHub Actions repetirá las verificaciones en cada pull request y en cada actualización de `main` después de publicar el repositorio.

