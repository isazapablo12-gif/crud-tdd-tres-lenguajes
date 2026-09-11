<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

final class TaskDestroyTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_existing_task_is_deleted_and_returns_204(): void
    {
        $task = Task::factory()->create(['title' => 'Temporal']);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertNoContent();
        $this->assertModelMissing($task);
    }

    public function test_missing_task_returns_404(): void
    {
        $response = $this->deleteJson('/api/tasks/999');

        $response->assertNotFound();
    }
}
