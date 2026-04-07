<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Morilog\Jalali\Jalalian;
use InvalidArgumentException;

class JalaliDateCast implements CastsAttributes
{
    protected $format;

    public function __construct(string $format = 'Y-m-d')
    {
        $this->format = $format;
    }

    private function convertToEnglish($string) {
    $newPairs = [
        '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4', 
        '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
        '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4', 
        '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9'
    ];
    return strtr($string, $newPairs);
}

    /**
     * تبدیل مقدار ذخیره شده در دیتابیس به مقدار مورد استفاده در مدل
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (is_null($value)) {
            return null;
        }

        // تبدیل تاریخ میلادی دیتابیس به تاریخ شمسی
        return Jalalian::fromCarbon(Carbon::parse($value))->format($this->format);
    }

    /**
     * تبدیل مقدار ورودی به مقدار مناسب برای ذخیره در دیتابیس
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {

        if (is_null($value)) {
            return null;
        }

        $value = $this->convertToEnglish($value);

        // اگر مقدار از نوع Jalalian باشد
        if ($value instanceof Jalalian) {
            return $value->toCarbon();
        }

        // اگر مقدار رشته شمسی باشد
        if (is_string($value)) {
            return Jalalian::fromFormat($this->format, $value)->toCarbon();
        }

        // اگر مقدار از نوع Carbon باشد
        if ($value instanceof \Carbon\Carbon) {
            return $value;
        }

        throw new InvalidArgumentException('Invalid date format for Jalali cast');
    }
}