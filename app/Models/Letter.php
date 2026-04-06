<?php
namespace App\Models;

use App\Casts\JalaliDateCast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Letter extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organization_id', 'letter_type', 'letter_number', 'tracking_number',
        'security_level', 'priority', 'category_id', 'subject', 'summary',
        'content', 'draft_content', 'sender_id', 'sender_name',
        'sender_position', 'sender_department_id', 'recipient_id', 'recipient_name',
        'recipient_position', 'recipient_department_id', 'cc_recipients', 'date', 'due_date',
        'response_deadline', 'is_response_to', 'is_follow_up', 'follow_up_count',
        'sheet_count', 'is_draft', 'draft_of', 'draft_step',
        'final_status', 'created_by', 'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'draft_content'     => 'array',
            'cc_recipients'     => 'array',
            'date'              => JalaliDateCast::class,
            'due_date'          => JalaliDateCast::class,
            'response_deadline' => JalaliDateCast::class,
            'is_draft'          => 'boolean',
        ];
    }

    // ─── سازمان و دسته‌بندی ───────────────

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function category()
    {
        return $this->belongsTo(LetterCategory::class);
    }

    // ─── فرستنده ──────────────────────────

    public function senderPosition()
    {
        return $this->belongsTo(Position::class, 'sender_id');
    }

    public function senderOrganization()
    {
        return $this->belongsTo(Organization::class, 'sender_id');
    }

    public function senderDepartment()
    {
        return $this->belongsTo(Department::class, 'sender_department_id');
    }

    // accessor — بسته به نوع نامه، درست برمیگردونه
    public function getSenderAttribute()
    {
        return $this->letter_type === 'incoming'
            ? $this->senderOrganization
            : $this->senderPosition;
    }

    // ─── گیرنده ───────────────────────────

    public function recipientPosition()
    {
        return $this->belongsTo(Position::class, 'recipient_id');
    }

    public function recipientOrganization()
    {
        return $this->belongsTo(Organization::class, 'recipient_id');
    }

    public function recipientDepartment()
    {
        return $this->belongsTo(Department::class, 'recipient_department_id');
    }

    public function getRecipientAttribute()
    {
        return $this->letter_type === 'outgoing'
            ? $this->recipientOrganization
            : $this->recipientPosition;
    }

    // ─── کاربران ──────────────────────────

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // ─── پیوست و کلمات کلیدی ─────────────

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function keywords()
    {
        return $this->belongsToMany(Keyword::class, 'letter_keywords');
    }

    // ─── گردش کار ─────────────────────────

    public function routings()
    {
        return $this->hasMany(Routing::class);
    }

    // ─── ارتباط نامه به نامه ──────────────

    public function responseTo()
    {
        return $this->belongsTo(Letter::class, 'is_response_to');
    }

    public function responses()
    {
        return $this->hasMany(Letter::class, 'is_response_to');
    }

    public function originalLetter()
    {
        return $this->belongsTo(Letter::class, 'is_follow_up');
    }

    public function followUps()
    {
        return $this->hasMany(Letter::class, 'is_follow_up');
    }

    public function files() : HasMany
    {
        return $this->hasMany(File::class);
    }
}