<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Morilog\Jalali\Jalalian;

class UserRequest extends FormRequest
{
    /**
     * تعیین مجوز کاربر برای ارسال درخواست
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * دریافت قوانین اعتبارسنجی
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user'); // برای ویرایش (update)

        return [
            // اطلاعات سازمانی
            'organization_id' => 'required|exists:organizations,id',
            'department_id' => 'nullable|exists:departments,id',
            'primary_position_id' => 'nullable|exists:positions,id',

            // اطلاعات حساب کاربری
            'email' => 'required|email|max:255|unique:users,email,' . $userId,
            'password' => 'required|string|min:8|confirmed',

            // اطلاعات شخصی
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'national_code' => 'required|string|size:10|unique:users,national_code,' . $userId,
            'mobile' => 'nullable|string|max:20',
            'employment_code' => 'nullable|string|max:50|unique:users,employment_code,' . $userId,

            // فیلدهای اضافی جدید
            'gender' => 'nullable|in:male,female',
            'birth_date' => [
                'nullable',
                'date',
                'before:today',
            ],
            'emergency_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',

            // وضعیت و امنیت
            'status' => 'required|in:active,inactive,suspended',
            'security_clearance' => 'required|in:public,internal,confidential,secret',

            // نقش کاربری
            'role' => 'required|string|exists:roles,name',
        ];
    }

    /**
     * دریافت پیام‌های خطای فارسی
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // ============================================
            // سازمان
            // ============================================
            'organization_id.required' => 'انتخاب سازمان الزامی است.',
            'organization_id.exists' => 'سازمان انتخاب شده معتبر نیست.',

            // ============================================
            // دپارتمان
            // ============================================
            'department_id.exists' => 'دپارتمان انتخاب شده معتبر نیست.',

            // ============================================
            // سمت
            // ============================================
            'primary_position_id.exists' => 'سمت انتخاب شده معتبر نیست.',

            // ============================================
            // ایمیل
            // ============================================
            'email.required' => 'آدرس ایمیل الزامی است.',
            'email.email' => 'فرمت آدرس ایمیل نامعتبر است.',
            'email.max' => 'آدرس ایمیل نباید بیشتر از ۲۵۵ کاراکتر باشد.',
            'email.unique' => 'این آدرس ایمیل قبلاً ثبت شده است.',

            // ============================================
            // رمز عبور
            // ============================================
            'password.required' => 'رمز عبور الزامی است.',
            'password.string' => 'رمز عبور باید متن باشد.',
            'password.min' => 'رمز عبور باید حداقل ۸ کاراکتر باشد.',
            'password.confirmed' => 'تکرار رمز عبور مطابقت ندارد.',

            // ============================================
            // نام و نام خانوادگی
            // ============================================
            'first_name.required' => 'نام الزامی است.',
            'first_name.string' => 'نام باید متن باشد.',
            'first_name.max' => 'نام نباید بیشتر از ۲۵۵ کاراکتر باشد.',

            'last_name.required' => 'نام خانوادگی الزامی است.',
            'last_name.string' => 'نام خانوادگی باید متن باشد.',
            'last_name.max' => 'نام خانوادگی نباید بیشتر از ۲۵۵ کاراکتر باشد.',

            // ============================================
            // کد ملی
            // ============================================
            'national_code.required' => 'کد ملی الزامی است.',
            'national_code.string' => 'کد ملی باید متن باشد.',
            'national_code.size' => 'کد ملی باید دقیقاً ۱۰ رقم باشد.',
            'national_code.unique' => 'این کد ملی قبلاً ثبت شده است.',

            // ============================================
            // تلفن همراه
            // ============================================
            'mobile.string' => 'تلفن همراه باید متن باشد.',
            'mobile.max' => 'تلفن همراه نباید بیشتر از ۲۰ کاراکتر باشد.',

            // ============================================
            // کد پرسنلی
            // ============================================
            'employment_code.string' => 'کد پرسنلی باید متن باشد.',
            'employment_code.max' => 'کد پرسنلی نباید بیشتر از ۵۰ کاراکتر باشد.',
            'employment_code.unique' => 'این کد پرسنلی قبلاً ثبت شده است.',

            // ============================================
            // جنسیت
            // ============================================
            'gender.in' => 'جنسیت انتخاب شده معتبر نیست (مرد، زن).',

            // ============================================
            // تاریخ تولد
            // ============================================
            'birth_date.date' => 'فرمت تاریخ تولد نامعتبر است.',
            'birth_date.before' => 'تاریخ تولد باید کمتر از امروز باشد.',

            // ============================================
            // تلفن اضطراری
            // ============================================
            'emergency_phone.string' => 'تلفن اضطراری باید متن باشد.',
            'emergency_phone.max' => 'تلفن اضطراری نباید بیشتر از ۲۰ کاراکتر باشد.',

            // ============================================
            // آدرس
            // ============================================
            'address.string' => 'آدرس باید متن باشد.',
            'address.max' => 'آدرس نباید بیشتر از ۵۰۰ کاراکتر باشد.',

            // ============================================
            // وضعیت
            // ============================================
            'status.required' => 'وضعیت کاربر الزامی است.',
            'status.in' => 'وضعیت انتخاب شده معتبر نیست (فعال، غیرفعال، تعلیق).',

            // ============================================
            // سطح امنیتی
            // ============================================
            'security_clearance.required' => 'سطح امنیتی الزامی است.',
            'security_clearance.in' => 'سطح امنیتی انتخاب شده معتبر نیست (عمومی، داخلی، محرمانه، سری).',

            // ============================================
            // نقش
            // ============================================
            'role.required' => 'نقش کاربری الزامی است.',
            'role.string' => 'نقش کاربری باید متن باشد.',
            'role.exists' => 'نقش انتخاب شده معتبر نیست.',
        ];
    }

    /**
     * دریافت نام‌های فارسی فیلدها
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'organization_id' => 'سازمان',
            'department_id' => 'دپارتمان',
            'primary_position_id' => 'سمت اصلی',
            'email' => 'آدرس ایمیل',
            'password' => 'رمز عبور',
            'first_name' => 'نام',
            'last_name' => 'نام خانوادگی',
            'national_code' => 'کد ملی',
            'mobile' => 'تلفن همراه',
            'employment_code' => 'کد پرسنلی',
            'gender' => 'جنسیت',
            'birth_date' => 'تاریخ تولد',
            'emergency_phone' => 'تلفن اضطراری',
            'address' => 'آدرس',
            'status' => 'وضعیت',
            'security_clearance' => 'سطح امنیتی',
            'role' => 'نقش کاربری',
        ];
    }
    protected function prepareForValidation()
    {
        $dateFields = ['date', 'due_date', 'response_deadline'];
        $merged = [];

        foreach ($dateFields as $field) {
            $value = $this->$field;

            if (empty($value)) {
                continue;
            }

            try {
                // ۱. تبدیل اعداد فارسی/عربی به انگلیسی
                $englishDigits = str_replace(
                    [
                        '۰',
                        '۱',
                        '۲',
                        '۳',
                        '۴',
                        '۵',
                        '۶',
                        '۷',
                        '۸',
                        '۹',
                        '٠',
                        '١',
                        '٢',
                        '٣',
                        '٤',
                        '٥',
                        '٦',
                        '٧',
                        '٨',
                        '٩'
                    ],
                    [
                        '0',
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '0',
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9'
                    ],
                    $value
                );

                $normalized = str_replace('-', '/', $englishDigits);

                return $normalized;
            } catch (\Exception $e) {
            }
        }

        if (!empty($merged)) {
            $this->merge($merged);
        }
    }
}
