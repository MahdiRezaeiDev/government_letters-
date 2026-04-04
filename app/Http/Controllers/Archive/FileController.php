<?php

namespace App\Http\Controllers\Archive;

use App\Http\Controllers\Controller;
use App\Models\Archive;
use App\Models\File;
use App\Models\Letter;
use App\Models\LetterFile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FileController extends Controller
{
    public function index(Archive $archive)
    {
        return Inertia::render('Archives/Files/Index', [
            'archive' => $archive->load('parent:id,name'),
            'files'   => $archive->files()->withCount('letters')->with('letters')->get(),
        ]);
    }

    public function store(Request $request, Archive $archive)
    {
        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'code'             => 'nullable|string|max:50|unique:files',
            'description'      => 'nullable|string',
            'retention_period' => 'nullable|integer',
            'retention_unit'   => 'nullable|in:days,months,years',
        ]);

        $expiryDate = null;
        if (!empty($validated['retention_period']) && !empty($validated['retention_unit'])) {
            $expiryDate = now()->add($validated['retention_period'], $validated['retention_unit'])->toDateString();
        }

        File::create([
            ...$validated,
            'archive_id'  => $archive->id,
            'expiry_date' => $expiryDate,
            'is_active'   => true,
        ]);

        return back()->with('success', 'پرونده ایجاد شد');
    }

    public function attachLetter(Request $request, File $file)
    {
        $validated = $request->validate([
            'letter_id' => 'required|exists:letters,id',
        ]);

        $exists = LetterFile::where('file_id', $file->id)
                            ->where('letter_id', $validated['letter_id'])
                            ->exists();

        if ($exists) {
            return back()->with('error', 'این نامه قبلاً به این پرونده الصاق شده');
        }

        LetterFile::create([
            'file_id'   => $file->id,
            'letter_id' => $validated['letter_id'],
        ]);

        Letter::find($validated['letter_id'])->update(['final_status' => 'archived']);

        return back()->with('success', 'نامه به پرونده الصاق شد');
    }

    public function detachLetter(File $file, Letter $letter)
    {
        LetterFile::where('file_id', $file->id)->where('letter_id', $letter->id)->delete();
        $letter->update(['final_status' => 'approved']);

        return back()->with('success', 'نامه از پرونده جدا شد');
    }
}
