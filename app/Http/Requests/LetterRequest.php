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
            'letter_type' => 'required|in:incoming,outgoing,internal',
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
}
