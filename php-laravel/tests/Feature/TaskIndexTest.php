<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

final class TaskIndexTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_empty_collection_returns_200(): void
    {
        $response = $this->getJson('/api/tasks');

        $response
            ->assertOk()
            ->assertExactJson([]);
    }

    public function test_tasks_are_returned_in_id_order_with_expected_shape(): void
    {
        $first = Task::factory()->create([
            'title' => 'Primera',
            'description' => null,
            'completed' => false,
        ]);
        $second = Task::factory()->create([
            'title' => 'Segunda',
            'description' => 'Con descripción',
            'completed' => true,
        ]);

        $response = $this->getJson('/api/tasks');

        $response
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $first->id,
                    'title' => 'Primera',
                    'description' => null,
                    'completed' => false,
                ],
                [
                    'id' => $second->id,
                    'title' => 'Segunda',
                    'description' => 'Con descripción',
                    'completed' => true,
                ],
            ]);
    }
}
