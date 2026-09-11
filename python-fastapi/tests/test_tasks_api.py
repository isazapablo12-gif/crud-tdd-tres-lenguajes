import pytest


def test_list_tasks_returns_empty_collection(client):
    response = client.get("/api/tasks")

    assert response.status_code == 200
    assert response.json() == []


def test_create_task_persists_and_returns_it(client):
    response = client.post(
        "/api/tasks",
        json={
            "title": "Preparar exposición",
            "description": "Repasar el ciclo TDD",
        },
    )

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "title": "Preparar exposición",
        "description": "Repasar el ciclo TDD",
        "completed": False,
    }

    list_response = client.get("/api/tasks")
    assert list_response.json() == [response.json()]


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"title": "   "},
        {"title": "a" * 101},
    ],
)
def test_create_task_rejects_invalid_title(client, payload):
    response = client.post("/api/tasks", json=payload)

    assert response.status_code == 422


def test_create_task_trims_title(client):
    response = client.post("/api/tasks", json={"title": "  Estudiar TDD  "})

    assert response.status_code == 201
    assert response.json()["title"] == "Estudiar TDD"


def test_create_task_validates_limits_after_trimming(client):
    accepted = client.post("/api/tasks", json={"title": f"  {'a' * 100}  "})
    rejected = client.post(
        "/api/tasks",
        json={"title": "Válida", "description": "a" * 501},
    )

    assert accepted.status_code == 201
    assert len(accepted.json()["title"]) == 100
    assert rejected.status_code == 422


def test_get_existing_task_by_id(client):
    created = client.post(
        "/api/tasks",
        json={"title": "Documentar", "completed": True},
    ).json()

    response = client.get(f"/api/tasks/{created['id']}")

    assert response.status_code == 200
    assert response.json() == created


def test_get_missing_task_returns_404(client):
    response = client.get("/api/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


def test_update_existing_task_persists_changes(client):
    created = client.post("/api/tasks", json={"title": "Borrador"}).json()
    payload = {
        "title": "Versión final",
        "description": "Lista para exponer",
        "completed": True,
    }

    response = client.put(f"/api/tasks/{created['id']}", json=payload)

    assert response.status_code == 200
    assert response.json() == {"id": created["id"], **payload}
    assert client.get(f"/api/tasks/{created['id']}").json() == response.json()


def test_update_task_rejects_invalid_data(client):
    created = client.post("/api/tasks", json={"title": "Borrador"}).json()

    response = client.put(
        f"/api/tasks/{created['id']}",
        json={"title": "   ", "description": None, "completed": False},
    )

    assert response.status_code == 422


def test_update_missing_task_returns_404(client):
    response = client.put(
        "/api/tasks/999",
        json={"title": "No existe", "description": None, "completed": False},
    )

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


def test_delete_existing_task_removes_it(client):
    created = client.post("/api/tasks", json={"title": "Temporal"}).json()

    response = client.delete(f"/api/tasks/{created['id']}")

    assert response.status_code == 204
    assert response.content == b""
    assert client.get(f"/api/tasks/{created['id']}").status_code == 404


def test_delete_missing_task_returns_404(client):
    response = client.delete("/api/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}
