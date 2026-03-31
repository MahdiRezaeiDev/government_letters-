<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Letter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id', 'letter_type', 'letter_number', 'tracking_number',
        'security_level', 'priority', 'category_id', 'subject', 'summary',
        'content', 'draft_content', 'sender_type', 'sender_id', 'sender_name',
        'sender_position', 'recipient_type', 'recipient_id', 'recipient_name',
        'recipient_position', 'cc_recipients', 'date', 'due_date',
        'response_deadline', 'is_response_to', 'is_follow_up', 'follow_up_count',
        'sheet_count', 'is_draft', 'draft_of', 'draft_step',
        'final_status', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'draft_content' => 'array',
        'cc_recipients' => 'array',
        'date' => 'date',
        'due_date' => 'date',
        'response_deadline' => 'date',
        'is_draft' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function category()
    {
        return $this->belongsTo(LetterCategory::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function routings()
    {
        return $this->hasMany(Routing::class);
    }

    public function keywords()
    {
        return $this->belongsToMany(Keyword::class, 'letter_keywords');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function responseTo()
    {
        return $this->belongsTo(Letter::class, 'is_response_to');
    }

    public function responses()
    {
        return $this->hasMany(Letter::class, 'is_response_to');
    }

    public function sender()
    {
        return match($this->letter_type) {
            'incoming' => $this->belongsTo(Organization::class, 'sender_id'),
            'outgoing', 'internal' => $this->belongsTo(Position::class, 'sender_id'),
        };
    }

    public function recipient()
    {
        return match($this->letter_type) {
            'outgoing' => $this->belongsTo(Organization::class, 'recipient_id'),
            'incoming', 'internal' => $this->belongsTo(Position::class, 'recipient_id'),
        };
    }
}