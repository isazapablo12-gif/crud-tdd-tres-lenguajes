<?php

namespace Tests\Feature;

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
}
