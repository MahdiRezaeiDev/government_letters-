<?php

namespace App\Providers;

use App\Models\Department;
use App\Models\Organization;
use App\Models\Position;
use App\Models\User;
use App\Policies\DepartmentPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\PositionPolicy;
use App\Policies\UserPolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        Department::class => DepartmentPolicy::class,
        Position::class => PositionPolicy::class,
        User::class => UserPolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
