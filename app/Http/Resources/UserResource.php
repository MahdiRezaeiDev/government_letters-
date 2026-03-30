<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'username'        => $this->username,
            'email'           => $this->email,
            'full_name'       => $this->full_name,
            'first_name'      => $this->first_name,
            'last_name'       => $this->last_name,
            'national_code'   => $this->national_code,
            'mobile'          => $this->mobile,
            'employment_code' => $this->employment_code,
            'avatar'          => $this->avatar ? asset("storage/{$this->avatar}") : null,
            'status'          => $this->status,
            'last_login_at'   => $this->last_login_at?->diffForHumans(),
            'organization'    => $this->whenLoaded('organization', fn() => [
                'id'   => $this->organization->id,
                'name' => $this->organization->name,
            ]),
            'roles'           => $this->whenLoaded('roles', fn() =>
                $this->roles->pluck('name')
            ),
            'permissions'     => $this->whenLoaded('roles', fn() =>
                $this->getAllPermissions()->pluck('name')
            ),
            'primary_position' => $this->whenLoaded('userPositions', fn() => [
                'position'   => $this->primaryPosition()?->position?->name,
                'department' => $this->primaryPosition()?->position?->department?->name,
            ]),
            'created_at'      => $this->created_at?->toISOString(),
        ];
    }
}