from pathlib import Path

from fastapi import FastAPI, HTTPException, Response

from .repository import TaskRepository
from .schemas import TaskCreate, TaskResponse, TaskUpdate


def create_app(database_path: Path | str | None = None) -> FastAPI:
    app = FastAPI(title="CRUD de tareas - Python", version="1.0.0")
    resolved_database_path = database_path or (
        Path(__file__).resolve().parents[1] / "data" / "tasks.sqlite"
    )
    repository = TaskRepository(resolved_database_path)
    repository.initialize()

    @app.get("/api/tasks", response_model=list[TaskResponse])
    def list_tasks() -> list[dict]:
        return repository.list_all()

    @app.post("/api/tasks", response_model=TaskResponse, status_code=201)
    def create_task(task: TaskCreate) -> dict:
        return repository.create(task.title, task.description, task.completed)

    @app.get("/api/tasks/{task_id}", response_model=TaskResponse)
    def get_task(task_id: int) -> dict:
        task = repository.get(task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    @app.put("/api/tasks/{task_id}", response_model=TaskResponse)
    def update_task(task_id: int, changes: TaskUpdate) -> dict:
        task = repository.update(
            task_id,
            changes.title,
            changes.description,
            changes.completed,
        )
        if task is None:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    @app.delete("/api/tasks/{task_id}", status_code=204)
    def delete_task(task_id: int) -> Response:
        if not repository.delete(task_id):
            raise HTTPException(status_code=404, detail="Task not found")
        return Response(status_code=204)

    return app


app = create_app()
