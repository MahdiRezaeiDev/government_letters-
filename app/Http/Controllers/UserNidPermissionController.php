<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\PermissionEnum;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserNidPermissionController extends Controller
{
    // نمایش فرم مدیریت دسترسی‌های تذکره برای کاربر
    public function edit(User $user)
    {
        // فقط دسترسی‌های مربوط به تذکره
        $nidPermissions = [
            PermissionEnum::NID_REGISTER,
            PermissionEnum::NID_APPROVE,
            PermissionEnum::NID_VIEW,
            PermissionEnum::NID_DESTROY,
        ];

        $userDirectPermissions = $user->getDirectPermissions()->pluck('name')->toArray();

        return view('admin.users.nid-permissions', compact('user', 'nidPermissions', 'userDirectPermissions'));
    }

    // بروزرسانی دسترسی‌های تذکره
    public function update(Request $request, User $user)
    {
        $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'string|in:' . implode(',', PermissionEnum::all())
        ]);

        // حذف دسترسی‌های قبلی تذکره
        $currentNidPermissions = $user->getDirectPermissions()
            ->filter(function ($perm) {
                return str_starts_with($perm->name, 'nid-');
            });

        foreach ($currentNidPermissions as $perm) {
            $user->revokePermissionTo($perm->name);
        }

        // اعطای دسترسی‌های جدید
        if ($request->has('permissions')) {
            $user->givePermissionTo($request->permissions);
        }

        return redirect()->back()->with('success', 'دسترسی‌های تذکره با موفقیت بروزرسانی شد.');
    }

    // اضافه کردن دسترسی خاص
    public function addPermission(Request $request, User $user)
    {
        $request->validate([
            'permission' => 'required|string|in:' . implode(',', PermissionEnum::all())
        ]);

        $user->givePermissionTo($request->permission);

        return response()->json([
            'success' => true,
            'message' => 'دسترسی با موفقیت اضافه شد'
        ]);
    }

    // حذف دسترسی خاص
    public function removePermission(User $user, string $permission)
    {
        $user->revokePermissionTo($permission);

        return response()->json([
            'success' => true,
            'message' => 'دسترسی با موفقیت حذف شد'
        ]);
    }
}
