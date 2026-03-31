<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LetterParty extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id',
        'party_type',
        'name',
        'legal_name',
        'national_id',
        'economic_code',
        'registration_number',
        'address',
        'phone',
        'fax',
        'email',
        'website',
        'contact_person',
        'description',
        'status',
    ];


    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
