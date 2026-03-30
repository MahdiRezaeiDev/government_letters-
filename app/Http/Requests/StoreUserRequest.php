<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // اتوریزیشن در Controller انجام می‌شود
    }

    public function rules(): array
    {
        return [
            'organization_id'   => 'required|exists:organizations,id',
            'username'          => 'required|string|min:3|max:50|unique:users,username|alpha_dash',
            'email'             => 'required|email|unique:users,email',
            'password'          => 'required|string|min:8|confirmed',
            'first_name'        => 'required|string|max:100',
            'last_name'         => 'required|string|max:100',
            'national_code'     => 'nullable|string|size:10|unique:users,national_code',
            'mobile'            => 'nullable|string|max:20',
            'employment_code'   => 'nullable|string|max:50|unique:users,employment_code',
            'status'            => 'required|in:active,inactive,suspended',
            'roles'             => 'nullable|array',
            'roles.*'           => 'exists:roles,name',
        ];
    }

    public function messages(): array
    {
        return [
            'username.required'       => 'نام کاربری الزامی است',
            'username.unique'         => 'این نام کاربری قبلاً استفاده شده',
            'email.unique'            => 'این ایمیل قبلاً ثبت شده',
            'national_code.size'      => 'کد ملی باید ۱۰ رقم باشد',
            'national_code.unique'    => 'این کد ملی قبلاً ثبت شده',
            'password.min'            => 'رمز عبور باید حداقل ۸ کاراکتر باشد',
        ];
    }
}