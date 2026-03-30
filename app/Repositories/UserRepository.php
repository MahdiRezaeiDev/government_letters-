<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserPosition;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UserRepository implements UserRepositoryInterface
{
    public function __construct(private readonly User $model) {}

    public function all(array $filters = []): LengthAwarePaginator
    {
        return $this->model
            ->with(['organization', 'roles', 'userPositions.position.department'])
            ->when(isset($filters['organization_id']), fn($q) =>
                $q->where('organization_id', $filters['organization_id'])
            )
            ->when(isset($filters['status']), fn($q) =>
                $q->where('status', $filters['status'])
            )
            ->when(isset($filters['search']), fn($q) =>
                $q->where(function ($query) use ($filters) {
                    $query->where('first_name', 'like', "%{$filters['search']}%")
                          ->orWhere('last_name', 'like', "%{$filters['search']}%")
                          ->orWhere('username', 'like', "%{$filters['search']}%")
                          ->orWhere('email', 'like', "%{$filters['search']}%")
                          ->orWhere('employment_code', 'like', "%{$filters['search']}%");
                })
            )
            ->when(isset($filters['role']), fn($q) =>
                $q->role($filters['role'])
            )
            ->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function findById(int $id): User
    {
        return $this->model
            ->with(['organization', 'roles.permissions', 'userPositions.position.department'])
            ->findOrFail($id);
    }

    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = $this->model->create($data);

            if (!empty($data['roles'])) {
                $user->syncRoles($data['roles']);
            }

            return $user;
        });
    }

    public function update(int $id, array $data): User
    {
        return DB::transaction(function () use ($id, $data) {
            $user = $this->findById($id);
            $user->update($data);

            if (isset($data['roles'])) {
                $user->syncRoles($data['roles']);
            }

            return $user->fresh(['organization', 'roles']);
        });
    }

    public function delete(int $id): void
    {
        $this->findById($id)->delete();
    }

    public function assignPosition(int $userId, int $positionId, array $options = []): UserPosition
    {
        return DB::transaction(function () use ($userId, $positionId, $options) {
            // اگر این سمت به عنوان اصلی انتخاب شده، بقیه را غیراصلی کن
            if ($options['is_primary'] ?? false) {
                UserPosition::where('user_id', $userId)
                    ->update(['is_primary' => false]);
            }

            return UserPosition::updateOrCreate(
                ['user_id' => $userId, 'position_id' => $positionId],
                array_merge([
                    'is_primary'  => false,
                    'start_date'  => now(),
                    'status'      => 'active',
                ], $options)
            );
        });
    }

    public function removePosition(int $userId, int $positionId): void
    {
        UserPosition::where('user_id', $userId)
            ->where('position_id', $positionId)
            ->update(['status' => 'inactive', 'end_date' => now()]);
    }
}