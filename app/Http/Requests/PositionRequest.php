<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PositionRequest extends FormRequest
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
            'department_id'              => 'required|exists:departments,id',
            'name'                       => 'required|string|max:255',
            'code'                       => 'required|string|max:50|unique:positions,code',
            'level'                      => 'required|integer|min:0',
            'is_management'              => 'boolean',
            'description'                => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'department_id.required'                => 'انتخاب ریاست الزامی است.',
            'department_id.exists'                  => 'ریاست انتخاب شده معتبر نیست.',
            'name.required'                         => 'نام بست الزامی است.',
            'name.string'                           => 'نام بست باید متن باشد.',
            'name.max'                              => 'نام بست نباید بیشتر از ۲۵۵ کاراکتر باشد.',
            'code.required'                         => 'کد بست الزامی است.',
            'code.string'                           => 'کد بست باید متن باشد.',
            'code.max'                              => 'کد بست نباید بیشتر از ۵۰ کاراکتر باشد.',
            'code.unique'                           => 'این کد بست قبلاً استفاده شده است.',
            'level.required'                        => 'سطح بست الزامی است.',
            'level.integer'                         => 'سطح بست باید عدد صحیح باشد.',
            'level.min'                             => 'سطح بست نمی‌تواند منفی باشد.',
            'is_management.boolean'                 => 'مقدار مدیریتی بودن باید درست یا نادرست باشد.',
            'description.string'                    => 'توضیحات باید متن باشد.',
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
            'department_id'             => 'ریاست',
            'name'                      => 'نام بست',
            'code'                      => 'کد بست',
            'level'                     => 'سطح بست',
            'is_management'             => 'مدیریتی',
            'description'               => 'توضیحات',
        ];
    }
}
