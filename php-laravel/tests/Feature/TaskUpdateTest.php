<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

final class TaskUpdateTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_valid_payload_updates_task_and_returns_200(): void
    {
        $task = Task::factory()->create([
            'title' => 'Borrador',
            'description' => null,
            'completed' => false,
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => '  Versión final  ',
            'description' => 'Lista para exponer',
            'completed' => true,
        ]);

        $response
            ->assertOk()
            ->assertExactJson([
                'id' => $task->id,
                'title' => 'Versión final',
                'description' => 'Lista para exponer',
                'completed' => true,
            ]);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Versión final',
            'description' => 'Lista para exponer',
            'completed' => true,
        ]);
    }

    public function test_invalid_payload_returns_422_and_preserves_task(): void
    {
        $task = Task::factory()->create([
            'title' => 'Original',
            'completed' => false,
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => '   ',
            'description' => null,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'completed']);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Original',
            'completed' => false,
        ]);
    }

    public function test_missing_task_returns_404(): void
    {
        $response = $this->putJson('/api/tasks/999', [
            'title' => 'No existe',
            'description' => null,
            'completed' => false,
        ]);

        $response->assertNotFound();
    }
}
