<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TempUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
        ]);

        $file   = $request->file('file');
        $tempId = Str::uuid();

        $file->storeAs(
            'temp/' . auth()->id(),
            $tempId . '.' . $file->getClientOriginalExtension(),
            'local'
        );

        return response()->json([
            'temp_id'   => $tempId,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'extension' => $file->getClientOriginalExtension(),
            'mime_type' => $file->getMimeType(),
        ]);
    }

    public function destroy(Request $request)
    {
        $request->validate(['temp_id' => 'required|string']);

        $files = \Storage::disk('local')->files('temp/' . auth()->id());

        foreach ($files as $file) {
            if (str_contains($file, $request->temp_id)) {
                \Storage::disk('local')->delete($file);
                break;
            }
        }

        return response()->json(['deleted' => true]);
    }
}
