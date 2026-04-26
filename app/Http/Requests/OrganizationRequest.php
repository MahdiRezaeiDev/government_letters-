<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class OrganizationRequest extends FormRequest
{
    /**
     * تعیین می‌کند که آیا کاربر مجاز به ارسال این درخواست است یا خیر.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * قوانین اعتبارسنجی برای درخواست.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * پیام‌های خطای فارسی برای قوانین اعتبارسنجی.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'نام وزارت الزامی است.',
            'name.string' => 'نام وزارت باید متن باشد.',
            'name.max' => 'نام وزارت نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.',

            'logo.image' => 'فایل انتخابی باید تصویر باشد.',
            'logo.mimes' => 'فرمت لوگو باید jpeg، png، jpg یا gif باشد.',
            'logo.max' => 'حجم لوگو نمی‌تواند بیشتر از ۲ مگابایت باشد.',

            'email.email' => 'لطفاً یک ایمیل معتبر وارد کنید.',
            'email.max' => 'ایمیل نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.',

            'phone.string' => 'تلفن باید متن باشد.',
            'phone.max' => 'تلفن نمی‌تواند بیشتر از ۵۰ کاراکتر باشد.',

            'address.string' => 'آدرس باید متن باشد.',

            'website.url' => 'لطفاً یک آدرس وبسایت معتبر وارد کنید.',
            'website.max' => 'وبسایت نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.',

            'status.required' => 'وضعیت وزارت الزامی است.',
            'status.in' => 'وضعیت وزارت باید فعال یا غیرفعال باشد.',
        ];
    }

    /**
     * نام‌های فارسی فیلدها.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'نام وزارت',
            'logo' => 'لوگو',
            'email' => 'ایمیل',
            'phone' => 'تلفن',
            'address' => 'آدرس',
            'website' => 'وبسایت',
            'status' => 'وضعیت',
        ];
    }
}
