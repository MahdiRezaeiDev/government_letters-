<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Announcement extends Model {
    protected $table = 'announcements';
    protected $fillable = ['organization_id','title','content','priority','target_type','target_ids','attachment_path','publish_date','expiry_date','is_published','created_by'];
    protected $casts = ['target_ids'=>'array','publish_date'=>'datetime','expiry_date'=>'datetime','is_published'=>'boolean'];
    public function organization(): BelongsTo { return $this->belongsTo(Organization::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class,'created_by'); }
}

class Archive extends Model {
    protected $table = 'archives';
    protected $fillable = ['organization_id','name','code','parent_id','description','location','is_active'];
    protected $casts = ['is_active'=>'boolean'];
    public function organization(): BelongsTo { return $this->belongsTo(Organization::class); }
    public function parent(): BelongsTo { return $this->belongsTo(Archive::class,'parent_id'); }
    public function children(): HasMany { return $this->hasMany(Archive::class,'parent_id'); }
    public function archiveFiles(): HasMany { return $this->hasMany(ArchiveFile::class,'archive_id'); }
}

class ArchiveFile extends Model {
    protected $table = 'files';
    protected $fillable = ['archive_id','name','code','description','retention_period','retention_unit','expiry_date','is_active'];
    protected $casts = ['is_active'=>'boolean','expiry_date'=>'date'];
    public function archive(): BelongsTo { return $this->belongsTo(Archive::class); }
    public function letters(): BelongsToMany { return $this->belongsToMany(Letter::class,'letter_files','file_id','letter_id'); }
}

class LetterParty extends Model {
    protected $table = 'letter_parties';
    protected $fillable = ['organization_id','party_type','name','legal_name','national_id','economic_code','registration_number','address','phone','fax','email','website','contact_person','description','status'];
    protected $casts = ['status'=>'boolean'];
    public function organization(): BelongsTo { return $this->belongsTo(Organization::class); }
}
