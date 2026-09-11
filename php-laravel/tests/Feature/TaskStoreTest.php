<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

final class TaskStoreTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_valid_payload_creates_task_and_returns_201(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title' => '  Preparar exposición  ',
            'description' => 'Repasar el ciclo TDD',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('title', 'Preparar exposición')
            ->assertJsonPath('description', 'Repasar el ciclo TDD')
            ->assertJsonPath('completed', false);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Preparar exposición',
            'description' => 'Repasar el ciclo TDD',
            'completed' => false,
        ]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    #[DataProvider('invalidPayloads')]
    public function test_invalid_payload_returns_422_and_does_not_create_task(
        array $payload,
        string $field,
        string $message,
    ): void {
        $response = $this->postJson('/api/tasks', $payload);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([$field])
            ->assertJsonPath("errors.{$field}.0", $message);
        $this->assertDatabaseCount('tasks', 0);
    }

    /**
     * @return array<string, array{array<string, mixed>, string, string}>
     */
    public static function invalidPayloads(): array
    {
        return [
            'missing title' => [[], 'title', 'Title is required'],
            'blank title' => [['title' => '   '], 'title', 'Title is required'],
            'long title' => [['title' => str_repeat('a', 101)], 'title', 'Title must not exceed 100 characters'],
            'long description' => [
                ['title' => 'Válida', 'description' => str_repeat('a', 501)],
                'description',
                'Description must not exceed 500 characters',
            ],
            'non boolean completed' => [
                ['title' => 'Válida', 'completed' => 'yes'],
                'completed',
                'Completed must be a boolean',
            ],
        ];
    }
}
