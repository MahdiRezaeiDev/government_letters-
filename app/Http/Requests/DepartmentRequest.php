<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'organization_id'            => 'required|exists:organizations,id',
            'name'                       => 'required|string|max:255',
            'parent_id'                  => 'nullable|exists:departments,id',
            'manager_position_id'        => 'nullable|exists:positions,id',
            'status'                     => 'required|in:active,inactive',
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'organization_id.required'          => 'انتخاب سازمان الزامی است.',
            'organization_id.exists'            => 'سازمان انتخاب شده معتبر نیست.',

            'name.required'                     => 'نام دپارتمان الزامی است.',
            'name.string'                       => 'نام دپارتمان باید متن باشد.',
            'name.max'                          => 'نام دپارتمان نمی‌تواند بیش از ۲۵۵ کاراکتر باشد.',

            'parent_id.exists'                  => 'دپارتمان والد انتخاب شده معتبر نیست.',

            'manager_position_id.exists'        => 'سمت مدیر انتخاب شده معتبر نیست.',

            'status.required'                   => 'وضعیت دپارتمان الزامی است.',
            'status.in'                         => 'وضعیت دپارتمان باید فعال یا غیرفعال باشد.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'organization_id'                      => 'سازمان',
            'name'                                 => 'نام دپارتمان',
            'parent_id'                            => 'دپارتمان والد',
            'manager_position_id'                  => 'سمت مدیر',
            'status'                               => 'وضعیت',
        ];
    }
}
