<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Morilog\Jalali\Jalalian;

class JalaliDate implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            // سعی می‌کند تاریخ را با فرمت شمسی پارس کند
            Jalalian::fromFormat('Y-m-d', $value);
        } catch (\Exception $e) {
            $fail('فرمت :attribute معتبر نیست (مثال معتبر: 1402-05-25)');
        }
    }
}
