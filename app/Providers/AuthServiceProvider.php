<?php

namespace App\Providers;

use App\Models\Department;
use App\Models\Letter;
use App\Models\Organization;
use App\Models\Position;
use App\Models\Tazkira;
use App\Models\User;
use App\Policies\DepartmentPolicy;
use App\Policies\LetterPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\PositionPolicy;
use App\Policies\TazkiraPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        Department::class => DepartmentPolicy::class,
        Position::class => PositionPolicy::class,
        User::class => UserPolicy::class,
        Tazkira::class => TazkiraPolicy::class,
        Letter::class => LetterPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
