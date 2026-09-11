from pathlib import Path

from fastapi import FastAPI


def create_app(database_path: Path | str | None = None) -> FastAPI:
    app = FastAPI(title="CRUD de tareas - Python", version="1.0.0")

    @app.get("/api/tasks")
    def list_tasks() -> list[dict]:
        return []

    return app


app = create_app()

