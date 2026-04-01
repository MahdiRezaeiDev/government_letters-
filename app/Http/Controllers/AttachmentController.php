<?php
namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function store(Request $request, Letter $letter)
    {
        $request->validate([
            'files'   => 'required|array|max:10',
            'files.*' => 'file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
        ]);

        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store("letters/{$letter->id}", 'public');

            $attachment = Attachment::create([
                'letter_id'         => $letter->id,
                'user_id'           => auth()->id(),
                'uploader_name'     => auth()->user()->first_name . ' ' . auth()->user()->last_name,
                'uploader_position' => auth()->user()->activePosition?->name,
                'file_name'         => $file->getClientOriginalName(),
                'file_path'         => $path,
                'file_size'         => $file->getSize(),
                'mime_type'         => $file->getMimeType(),
                'extension'         => $file->getClientOriginalExtension(),
            ]);

            $uploaded[] = $attachment;
        }

        return back()->with('success', count($uploaded) . ' فایل آپلود شد');
    }

    public function destroy(Attachment $attachment)
    {
        // فقط آپلودکننده یا ادمین می‌تونه حذف کنه
        if ($attachment->user_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        // حذف فایل از storage
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back()->with('success', 'فایل حذف شد');
    }

    public function download(Attachment $attachment)
    {
        // شمارنده دانلود
        $attachment->increment('download_count');

        return Storage::disk('public')->download(
            $attachment->file_path,
            $attachment->file_name
        );
    }
}