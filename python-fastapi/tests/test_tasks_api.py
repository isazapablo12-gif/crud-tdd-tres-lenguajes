def test_list_tasks_returns_empty_collection(client):
    response = client.get("/api/tasks")

    assert response.status_code == 200
    assert response.json() == []

