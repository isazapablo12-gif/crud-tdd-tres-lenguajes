<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

final class TaskShowTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_existing_task_returns_200_with_expected_json(): void
    {
        $task = Task::factory()->create([
            'title' => 'Documentar',
            'description' => 'Explicar el controlador',
            'completed' => true,
        ]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response
            ->assertOk()
            ->assertExactJson([
                'id' => $task->id,
                'title' => 'Documentar',
                'description' => 'Explicar el controlador',
                'completed' => true,
            ]);
    }

    public function test_missing_task_returns_404(): void
    {
        $response = $this->getJson('/api/tasks/999');

        $response->assertNotFound();
    }
}
