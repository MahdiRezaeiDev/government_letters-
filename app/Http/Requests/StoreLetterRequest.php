<?php
// app/Http/Requests/StoreLetterRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLetterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $maxSize  = config('correspondence.upload.max_file_size', 10240); // KB
        $mimes    = implode(',', config('correspondence.upload.allowed_mimes', []));
        $maxFiles = config('correspondence.upload.max_files_per_letter', 10);

        return [
            'letter_type'      => 'required|in:incoming,outgoing,internal',
            'subject'          => 'required|string|max:500',
            'summary'          => 'nullable|string|max:2000',
            'content'          => 'nullable|string',
            'draft_content'    => 'nullable|array',
            'security_level'   => 'required|in:public,internal,confidential,secret,top_secret',
            'priority'         => 'required|in:low,normal,high,urgent,very_urgent',
            'category_id'      => 'nullable|exists:letter_categories,id',
            'date'             => 'required|date',
            'due_date'         => 'nullable|date|after_or_equal:date',
            'response_deadline'=> 'nullable|date|after_or_equal:date',
            'sender_type'      => 'required|in:internal,external',
            'sender_id'        => 'nullable|integer',
            'sender_name'      => 'nullable|string|max:255',
            'sender_position'  => 'nullable|string|max:255',
            'recipient_type'   => 'required|in:internal,external',
            'recipient_id'     => 'nullable|integer',
            'recipient_name'   => 'nullable|string|max:255',
            'recipient_position'=> 'nullable|string|max:255',
            'cc_recipients'    => 'nullable|array',
            'sheet_count'      => 'nullable|integer|min:1',
            'is_draft'         => 'boolean',
            'is_response_to'   => 'nullable|exists:letters,id',
            'is_follow_up'     => 'nullable|exists:letters,id',
            'keywords'         => 'nullable|array',
            'keywords.*'       => 'string|max:100',

            // پیوست‌ها
            'attachments'      => "nullable|array|max:{$maxFiles}",
            'attachments.*'    => "file|max:{$maxSize}|mimes:{$mimes}",
        ];
    }

    public function messages(): array
    {
        return [
            'letter_type.required' => 'نوع نامه الزامی است',
            'subject.required'     => 'موضوع نامه الزامی است',
            'date.required'        => 'تاریخ نامه الزامی است',
            'security_level.required' => 'سطح امنیتی الزامی است',
            'priority.required'    => 'اولویت نامه الزامی است',
            'attachments.*.max'    => 'حجم هر فایل نمی‌تواند بیشتر از ۱۰ مگابایت باشد',
        ];
    }
}