<?php

return [

    /*
    |--------------------------------------------------------------------------
    | د اعتبار سنجی ژبنی کرښې
    |--------------------------------------------------------------------------
    |
    | لاندې ژبنی کرښې هغه تېر اوتومات تېروتنې پیغامونه لري چې د
    | اعتبار سنجي ټولګي لخوا کارول کیږي. د دې قواعدو ځینې ډیری نسخې لري
    | لکه د اندازې قواعد. مهرباني وکړئ دلته د دې هر یو پیغام تنظیم کړئ.
    |
    */

    'accepted' => 'د :attribute ساحه باید ومنل شي.',
    'accepted_if' => 'د :attribute ساحه باید ومنل شي کله چې :other له :value سره مساوي وي.',
    'active_url' => 'د :attribute ساحه باید یو معتبر URL آدرس وي.',
    'after' => 'د :attribute ساحه باید د :date وروسته نیټه وي.',
    'after_or_equal' => 'د :attribute ساحه باید د :date وروسته یا مساوي نیټه وي.',
    'alpha' => 'د :attribute ساحه باید یوازې توري ولري.',
    'alpha_dash' => 'د :attribute ساحه باید یوازې توري، شمېرې، ډش او انډر سکور ولري.',
    'alpha_num' => 'د :attribute ساحه باید یوازې توري او شمېرې ولري.',
    'any_of' => 'د :attribute ساحه ناسمه ده.',
    'array' => 'د :attribute ساحه باید یو آری وي.',
    'ascii' => 'د :attribute ساحه باید یوازې واحد بایټ الفبايي حروف او سمبولونه ولري.',
    'before' => 'د :attribute ساحه باید د :date دمخه نیټه وي.',
    'before_or_equal' => 'د :attribute ساحه باید د :date دمخه یا مساوي نیټه وي.',
    'between' => [
        'array' => 'د :attribute ساحه باید د :min او :max ترمنځ توکي ولري.',
        'file' => 'د :attribute ساحه باید د :min او :max کیلوبایټ ترمنځ وي.',
        'numeric' => 'د :attribute ساحه باید د :min او :max ترمنځ وي.',
        'string' => 'د :attribute ساحه باید د :min او :max توري ترمنځ وي.',
    ],
    'boolean' => 'د :attribute ساحه باید سم یا غلط وي.',
    'can' => 'د :attribute ساحه غیر مجاز ارزښت لري.',
    'confirmed' => 'د :attribute ساحه تایید سمون نه خوري.',
    'contains' => 'د :attribute ساحه اړین ارزښت نلري.',
    'current_password' => 'رمز تېر ناسم دی.',
    'date' => 'د :attribute ساحه باید یوه معتبره نیټه وي.',
    'date_equals' => 'د :attribute ساحه باید له :date سره مساوي نیټه وي.',
    'date_format' => 'د :attribute ساحه باید د :format بڼې سره سمون ولري.',
    'decimal' => 'د :attribute ساحه باید :decimal لسیزې ځایونه ولري.',
    'declined' => 'د :attribute ساحه باید رد شي.',
    'declined_if' => 'د :attribute ساحه باید رد شي کله چې :other له :value سره مساوي وي.',
    'different' => 'د :attribute ساحه او :other باید مختلف وي.',
    'digits' => 'د :attribute ساحه باید :digits رقمه وي.',
    'digits_between' => 'د :attribute ساحه باید د :min او :max رقمونو ترمنځ وي.',
    'dimensions' => 'د :attribute ساحه ناسم عکس ابعاد لري.',
    'distinct' => 'د :attribute ساحه تکراري ارزښت لري.',
    'doesnt_contain' => 'د :attribute ساحه باید لاندې هیڅ یو ارزښت ونه لري: :values.',
    'doesnt_end_with' => 'د :attribute ساحه باید د لاندې ارزښتونو سره پای ته ونه رسیږي: :values.',
    'doesnt_start_with' => 'د :attribute ساحه باید د لاندې ارزښتونو سره پیل نشي: :values.',
    'email' => 'د :attribute ساحه باید یو معتبر برېښنالیک آدرس وي.',
    'encoding' => 'د :attribute ساحه باید د :encoding انکوډینګ سره کوډ شوی وي.',
    'ends_with' => 'د :attribute ساحه باید د لاندې ارزښتونو څخه په یوه پای ته ورسیږي: :values.',
    'enum' => 'ټاکل شوی :attribute ناسم دی.',
    'exists' => 'ټاکل شوی :attribute ناسم دی.',
    'extensions' => 'د :attribute ساحه باید لاندې توسیعونه ولري: :values.',
    'file' => 'د :attribute ساحه باید یو فایل وي.',
    'filled' => 'د :attribute ساحه باید ارزښت ولري.',
    'gt' => [
        'array' => 'د :attribute ساحه باید له :value څخه ډیر توکي ولري.',
        'file' => 'د :attribute ساحه باید له :value کیلوبایټ څخه لویه وي.',
        'numeric' => 'د :attribute ساحه باید له :value څخه لویه وي.',
        'string' => 'د :attribute ساحه باید له :value څخه ډیر توري ولري.',
    ],
    'gte' => [
        'array' => 'د :attribute ساحه باید :value توکي یا ډیر ولري.',
        'file' => 'د :attribute ساحه باید له :value کیلوبایټ څخه لویه یا مساوي وي.',
        'numeric' => 'د :attribute ساحه باید له :value څخه لویه یا مساوي وي.',
        'string' => 'د :attribute ساحه باید له :value څخه ډیر یا مساوي توري ولري.',
    ],
    'hex_color' => 'د :attribute ساحه باید یو معتبر هیکساډیسیمل رنگ وي.',
    'image' => 'د :attribute ساحه باید یو انځور وي.',
    'in' => 'ټاکل شوی :attribute ناسم دی.',
    'in_array' => 'د :attribute ساحه باید په :other کې وجود ولري.',
    'in_array_keys' => 'د :attribute ساحه باید لږترلږه د لاندې کیلي څخه یوه ولري: :values.',
    'integer' => 'د :attribute ساحه باید یو بشپړ عدد وي.',
    'ip' => 'د :attribute ساحه باید یو معتبر IP آدرس وي.',
    'ipv4' => 'د :attribute ساحه باید یو معتبر IPv4 آدرس وي.',
    'ipv6' => 'د :attribute ساحه باید یو معتبر IPv6 آدرس وي.',
    'json' => 'د :attribute ساحه باید یو معتبر JSON تار وي.',
    'list' => 'د :attribute ساحه باید یو لیست وي.',
    'lowercase' => 'د :attribute ساحه باید کوچني توري وي.',
    'lt' => [
        'array' => 'د :attribute ساحه باید له :value څخه لږ توکي ولري.',
        'file' => 'د :attribute ساحه باید له :value کیلوبایټ څخه کوچنۍ وي.',
        'numeric' => 'د :attribute ساحه باید له :value څخه کوچنۍ وي.',
        'string' => 'د :attribute ساحه باید له :value څخه لږ توري ولري.',
    ],
    'lte' => [
        'array' => 'د :attribute ساحه باید له :value څخه ډیر توکي ونه لري.',
        'file' => 'د :attribute ساحه باید له :value کیلوبایټ څخه کوچنۍ یا مساوي وي.',
        'numeric' => 'د :attribute ساحه باید له :value څخه کوچنۍ یا مساوي وي.',
        'string' => 'د :attribute ساحه باید له :value څخه لږ یا مساوي توري ولري.',
    ],
    'mac_address' => 'د :attribute ساحه باید یو معتبر MAC آدرس وي.',
    'max' => [
        'array' => 'د :attribute ساحه باید له :max څخه ډیر توکي ونه لري.',
        'file' => 'د :attribute ساحه باید له :max کیلوبایټ څخه لویه نه وي.',
        'numeric' => 'د :attribute ساحه باید له :max څخه لویه نه وي.',
        'string' => 'د :attribute ساحه باید له :max څخه ډیر توري ونه لري.',
    ],
    'max_digits' => 'د :attribute ساحه باید له :max څخه ډیر رقمونه ونه لري.',
    'mimes' => 'د :attribute ساحه باید د دې ډول فایل وي: :values.',
    'mimetypes' => 'د :attribute ساحه باید د دې ډول فایل وي: :values.',
    'min' => [
        'array' => 'د :attribute ساحه باید لږترلږه :min توکي ولري.',
        'file' => 'د :attribute ساحه باید لږترلږه :min کیلوبایټ وي.',
        'numeric' => 'د :attribute ساحه باید لږترلږه :min وي.',
        'string' => 'د :attribute ساحه باید لږترلږه :min توري ولري.',
    ],
    'min_digits' => 'د :attribute ساحه باید لږترلږه :min رقمونه ولري.',
    'missing' => 'د :attribute ساحه باید وجود ونه لري.',
    'missing_if' => 'د :attribute ساحه باید وجود ونه لري کله چې :other له :value سره مساوي وي.',
    'missing_unless' => 'د :attribute ساحه باید وجود ونه لري پرته لدې چې :other له :value سره مساوي وي.',
    'missing_with' => 'د :attribute ساحه باید وجود ونه لري کله چې :values وجود ولري.',
    'missing_with_all' => 'د :attribute ساحه باید وجود ونه لري کله چې :values وجود ولري.',
    'multiple_of' => 'د :attribute ساحه باید د :value ضرب وي.',
    'not_in' => 'ټاکل شوی :attribute ناسم دی.',
    'not_regex' => 'د :attribute ساحه بڼه ناسمه ده.',
    'numeric' => 'د :attribute ساحه باید یو عدد وي.',
    'password' => [
        'letters' => 'د :attribute ساحه باید لږترلږه یو توری ولري.',
        'mixed' => 'د :attribute ساحه باید لږترلږه یو لوی او یو کوچنی توری ولري.',
        'numbers' => 'د :attribute ساحه باید لږترلږه یوه شمېره ولري.',
        'symbols' => 'د :attribute ساحه باید لږترلږه یو سمبول ولري.',
        'uncompromised' => 'ورکړل شوی :attribute د معلوماتو په لیک کې ښکاره شوی. مهرباني وکړئ بل :attribute غوره کړئ.',
    ],
    'present' => 'د :attribute ساحه باید وجود ولري.',
    'present_if' => 'د :attribute ساحه باید وجود ولري کله چې :other له :value سره مساوي وي.',
    'present_unless' => 'د :attribute ساحه باید وجود ولري پرته لدې چې :other له :value سره مساوي وي.',
    'present_with' => 'د :attribute ساحه باید وجود ولري کله چې :values وجود ولري.',
    'present_with_all' => 'د :attribute ساحه باید وجود ولري کله چې :values وجود ولري.',
    'prohibited' => 'د :attribute ساحه منع ده.',
    'prohibited_if' => 'د :attribute ساحه منع ده کله چې :other له :value سره مساوي وي.',
    'prohibited_if_accepted' => 'د :attribute ساحه منع ده کله چې :other ومنل شي.',
    'prohibited_if_declined' => 'د :attribute ساحه منع ده کله چې :other رد شي.',
    'prohibited_unless' => 'د :attribute ساحه منع ده پرته لدې چې :other په :values کې وي.',
    'prohibits' => 'د :attribute ساحه د :other شتون منع کوي.',
    'regex' => 'د :attribute ساحه بڼه ناسمه ده.',
    'required' => 'د :attribute ساحه اړینه ده.',
    'required_array_keys' => 'د :attribute ساحه باید د دې لپاره داخلې ولري: :values.',
    'required_if' => 'د :attribute ساحه اړینه ده کله چې :other له :value سره مساوي وي.',
    'required_if_accepted' => 'د :attribute ساحه اړینه ده کله چې :other ومنل شي.',
    'required_if_declined' => 'د :attribute ساحه اړینه ده کله چې :other رد شي.',
    'required_unless' => 'د :attribute ساحه اړینه ده پرته لدې چې :other په :values کې وي.',
    'required_with' => 'د :attribute ساحه اړینه ده کله چې :values وجود ولري.',
    'required_with_all' => 'د :attribute ساحه اړینه ده کله چې :values وجود ولري.',
    'required_without' => 'د :attribute ساحه اړینه ده کله چې :values وجود ونه لري.',
    'required_without_all' => 'د :attribute ساحه اړینه ده کله چې هیڅ یو له :values څخه وجود ونه لري.',
    'same' => 'د :attribute ساحه باید له :other سره سمون ولري.',
    'size' => [
        'array' => 'د :attribute ساحه باید :size توکي ولري.',
        'file' => 'د :attribute ساحه باید :size کیلوبایټ وي.',
        'numeric' => 'د :attribute ساحه باید :size وي.',
        'string' => 'د :attribute ساحه باید :size توري ولري.',
    ],
    'starts_with' => 'د :attribute ساحه باید د لاندې ارزښتونو څخه په یوه پیل شي: :values.',
    'string' => 'د :attribute ساحه باید یو تار وي.',
    'timezone' => 'د :attribute ساحه باید یو معتبر وخت سیمه وي.',
    'unique' => ':attribute دمخه کارول شوی دی.',
    'uploaded' => 'د :attribute ساحه اپلوډ ناکامه شوه.',
    'uppercase' => 'د :attribute ساحه باید لوی توري وي.',
    'url' => 'د :attribute ساحه باید یو معتبر URL آدرس وي.',
    'ulid' => 'د :attribute ساحه باید یو معتبر ULID وي.',
    'uuid' => 'د :attribute ساحه باید یو معتبر UUID وي.',

    /*
    |--------------------------------------------------------------------------
    | د دودیز اعتبار سنجي ژبنی کرښې
    |--------------------------------------------------------------------------
    |
    | دلته تاسو کولی شئ د صفتونو لپاره دودیز اعتبار سنجي پیغامونه د
    | "attribute.rule" کنوانسیون په کارولو سره د کرښو نومولو لپاره مشخص کړئ.
    | دا چټک کوي چې د یو مشخص صفت قاعدې لپاره یو ځانګړی دودیز ژبنی کرښه مشخص کړئ.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'دودیز-پیغام',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | د دودیز اعتبار سنجي صفتونه
    |--------------------------------------------------------------------------
    |
    | لاندې ژبنی کرښې د دې لپاره کارول کیږي چې زموږ د صفت ځای ناستی د یو څه ډیر لوستونکي دوستانه سره
    | لکه "برېښنالیک آدرس" د "email" پرځای. دا په ساده ډول موږ سره مرسته کوي چې خپل پیغام ډیر څرګند کړو.
    |
    */

    'attributes' => [],

];