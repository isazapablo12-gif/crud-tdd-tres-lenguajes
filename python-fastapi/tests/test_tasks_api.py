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
