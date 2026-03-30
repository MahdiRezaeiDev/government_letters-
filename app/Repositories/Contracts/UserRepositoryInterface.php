<?php

namespace App\Repositories\Contracts;

interface UserRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
    public function assignPosition(int $userId, int $positionId, array $options = []);
    public function removePosition(int $userId, int $positionId): void;
}