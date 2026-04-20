<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LetterRequest extends FormRequest
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
            'letter_type' => 'nullable|in:incoming,outgoing,internal',
            'category_id' => 'nullable|exists:letter_categories,id',
            'subject' => 'required|string|max:500',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'security_level' => 'required|in:public,internal,confidential,secret,top_secret',
            'priority' => 'required|in:low,normal,high,urgent,very_urgent',
            'date' => 'nullable|date',
            'due_date' => 'nullable|date|after_or_equal:date',
            'response_deadline' => 'nullable|date|after_or_equal:date',
            'sheet_count' => 'nullable|integer|min:1',
            'is_draft' => 'boolean',

            // فقط فیلدهایی که در دیتابیس وجود دارند
            'recipient_name' => 'nullable|string|max:255',
            'recipient_position_name' => 'nullable|string|max:255',
            'recipient_user_id' => 'nullable|exists:users,id',
            'recipient_department_id' => 'nullable|exists:departments,id',
            'recipient_position_id' => 'nullable|exists:positions,id',

            'sender_name' => 'nullable|string|max:255',
            'sender_position_name' => 'nullable|string|max:255',
            'sender_user_id' => 'nullable|exists:users,id',
            'sender_department_id' => 'nullable|exists:departments,id',
            'sender_position_id' => 'nullable|exists:positions,id',

            'cc_recipients' => 'nullable|array',
            'instruction' => 'nullable|string',

            'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png',
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
            // letter_type
            'letter_type.required' => 'نوع مکتوب الزامی است.',
            'letter_type.in' => 'نوع مکتوب انتخاب شده معتبر نیست.',

            // category_id
            'category_id.exists' => 'کتگوری انتخاب شده وجود ندارد.',

            // subject
            'subject.required' => 'موضوع مکتوب الزامی است.',
            'subject.string' => 'موضوع باید متن باشد.',
            'subject.max' => 'موضوع نمی‌تواند بیشتر از ۵۰۰ حرف باشد.',

            // summary
            'summary.string' => 'خلاصه باید متن باشد.',

            // content
            'content.string' => 'متن مکتوب باید متن باشد.',

            // security_level
            'security_level.required' => 'سطح امنیتی الزامی است.',
            'security_level.in' => 'سطح امنیتی انتخاب شده معتبر نیست.',

            // priority
            'priority.required' => 'اولویت مکتوب الزامی است.',
            'priority.in' => 'اولویت انتخاب شده معتبر نیست.',

            // date
            'date.date' => 'تاریخ مکتوب معتبر نیست.',

            // due_date
            'due_date.date' => 'تاریخ سررسید معتبر نیست.',
            'due_date.after_or_equal' => 'تاریخ سررسید باید بعد از تاریخ مکتوب باشد.',

            // response_deadline
            'response_deadline.date' => 'مهلت پاسخ‌دهی معتبر نیست.',
            'response_deadline.after_or_equal' => 'مهلت پاسخ‌دهی باید بعد از تاریخ مکتوب باشد.',

            // sheet_count
            'sheet_count.integer' => 'تعداد صفحات باید عدد باشد.',
            'sheet_count.min' => 'تعداد صفحات باید حداقل ۱ باشد.',

            // is_draft
            'is_draft.boolean' => 'وضعیت مسوده معتبر نیست.',

            // recipient fields
            'recipient_name.string' => 'نام گیرنده باید متن باشد.',
            'recipient_name.max' => 'نام گیرنده نمی‌تواند بیشتر از ۲۵۵ حرف باشد.',
            'recipient_position_name.string' => 'عنوان بست گیرنده باید متن باشد.',
            'recipient_position_name.max' => 'عنوان بست گیرنده نمی‌تواند بیشتر از ۲۵۵ حرف باشد.',
            'recipient_user_id.exists' => 'کاربر گیرنده انتخاب شده وجود ندارد.',
            'recipient_department_id.exists' => 'دیپارتمنت گیرنده انتخاب شده وجود ندارد.',
            'recipient_position_id.exists' => 'بست گیرنده انتخاب شده وجود ندارد.',

            // sender fields
            'sender_name.string' => 'نام فرستنده باید متن باشد.',
            'sender_name.max' => 'نام فرستنده نمی‌تواند بیشتر از ۲۵۵ حرف باشد.',
            'sender_position_name.string' => 'عنوان بست فرستنده باید متن باشد.',
            'sender_position_name.max' => 'عنوان بست فرستنده نمی‌تواند بیشتر از ۲۵۵ حرف باشد.',
            'sender_user_id.exists' => 'کاربر فرستنده انتخاب شده وجود ندارد.',
            'sender_department_id.exists' => 'دیپارتمنت فرستنده انتخاب شده وجود ندارد.',
            'sender_position_id.exists' => 'بست فرستنده انتخاب شده وجود ندارد.',

            // cc_recipients
            'cc_recipients.array' => 'لیست رونوشت باید آرایه باشد.',

            // instruction
            'instruction.string' => 'رهنمود باید متن باشد.',

            // attachments
            'attachments.*.file' => 'ضمیمه باید فایل باشد.',
            'attachments.*.max' => 'حجم هر ضمیمه نمی‌تواند بیشتر از ۱۰ مگابایت باشد.',
            'attachments.*.mimes' => 'ضمیمه باید یکی از انواع PDF، Word یا تصویر باشد.',
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
            'letter_type' => 'نوع مکتوب',
            'category_id' => 'کتگوری',
            'subject' => 'موضوع',
            'summary' => 'خلاصه',
            'content' => 'متن مکتوب',
            'security_level' => 'سطح امنیتی',
            'priority' => 'اولویت',
            'date' => 'تاریخ مکتوب',
            'due_date' => 'تاریخ سررسید',
            'response_deadline' => 'مهلت پاسخ‌دهی',
            'sheet_count' => 'تعداد صفحات',
            'is_draft' => 'وضعیت مسوده',
            'recipient_name' => 'نام گیرنده',
            'recipient_position_name' => 'عنوان بست گیرنده',
            'recipient_user_id' => 'کاربر گیرنده',
            'recipient_department_id' => 'دیپارتمنت گیرنده',
            'recipient_position_id' => 'بست گیرنده',
            'sender_name' => 'نام فرستنده',
            'sender_position_name' => 'عنوان بست فرستنده',
            'sender_user_id' => 'کاربر فرستنده',
            'sender_department_id' => 'دیپارتمنت فرستنده',
            'sender_position_id' => 'بست فرستنده',
            'cc_recipients' => 'لیست رونوشت',
            'instruction' => 'رهنمود',
            'attachments.*' => 'ضمیمه',
        ];
    }
}
