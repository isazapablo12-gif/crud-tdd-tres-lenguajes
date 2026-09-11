import sqlite3
from pathlib import Path


class TaskRepository:
    def __init__(self, database_path: Path | str) -> None:
        self.database_path = Path(database_path)

    def initialize(self) -> None:
        self.database_path.parent.mkdir(parents=True, exist_ok=True)

        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    completed INTEGER NOT NULL DEFAULT 0
                )
                """
            )

    def list_all(self) -> list[dict]:
        with self._connect() as connection:
            rows = connection.execute(
                "SELECT id, title, description, completed FROM tasks ORDER BY id"
            ).fetchall()

        return [self._to_dict(row) for row in rows]

    def create(
        self, title: str, description: str | None, completed: bool
    ) -> dict:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO tasks (title, description, completed)
                VALUES (?, ?, ?)
                """,
                (title, description, int(completed)),
            )
            row = connection.execute(
                """
                SELECT id, title, description, completed
                FROM tasks
                WHERE id = ?
                """,
                (cursor.lastrowid,),
            ).fetchone()

        return self._to_dict(row)

    def get(self, task_id: int) -> dict | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT id, title, description, completed
                FROM tasks
                WHERE id = ?
                """,
                (task_id,),
            ).fetchone()

        return self._to_dict(row) if row is not None else None

    def update(
        self,
        task_id: int,
        title: str,
        description: str | None,
        completed: bool,
    ) -> dict | None:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE tasks
                SET title = ?, description = ?, completed = ?
                WHERE id = ?
                """,
                (title, description, int(completed), task_id),
            )
            if cursor.rowcount == 0:
                return None

            row = connection.execute(
                """
                SELECT id, title, description, completed
                FROM tasks
                WHERE id = ?
                """,
                (task_id,),
            ).fetchone()

        return self._to_dict(row)

    def delete(self, task_id: int) -> bool:
        with self._connect() as connection:
            cursor = connection.execute(
                "DELETE FROM tasks WHERE id = ?",
                (task_id,),
            )

        return cursor.rowcount > 0

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    @staticmethod
    def _to_dict(row: sqlite3.Row) -> dict:
        return {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "completed": bool(row["completed"]),
        }
