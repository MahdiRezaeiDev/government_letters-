<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Inertia\Inertia;

class QrCodeController extends Controller
{
    public function index()
    {
        return Inertia::render('QrCode/Generate');
    }

    public function generate(Request $request)
    {
        $request->validate([
            'data' => 'required|string|max:500',
            'size' => 'nullable|integer|min:100|max:1000',
            'color' => 'nullable|string',
            'backgroundColor' => 'nullable|string',
        ]);

        try {
            $size = $request->size ?? 300;
            $color = $request->color ?? '#000000';
            $backgroundColor = $request->backgroundColor ?? '#ffffff';

            // Extract hex colors
            $color = str_replace('#', '', $color);
            $bgColor = str_replace('#', '', $backgroundColor);

            // Generate QR code as base64
            $qrCode = QrCode::format('png')
                ->size($size)
                ->color((int)hexdec($color), (int)hexdec($bgColor))
                ->backgroundColor((int)hexdec($bgColor))
                ->generate($request->data);

            $base64 = base64_encode($qrCode);
            $dataUri = 'data:image/png;base64,' . $base64;

            return response()->json([
                'success' => true,
                'image' => $dataUri,
                'data' => $request->data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate QR code: ' . $e->getMessage()
            ], 500);
        }
    }

    public function download($type, $data)
    {
        try {
            $decodedData = base64_decode($data);

            switch ($type) {
                case 'svg':
                    $qrCode = QrCode::format('svg')
                        ->size(300)
                        ->generate($decodedData);

                    return response($qrCode)
                        ->header('Content-Type', 'image/svg+xml')
                        ->header('Content-Disposition', 'attachment; filename="qrcode.svg"');

                case 'png':
                default:
                    $qrCode = QrCode::format('png')
                        ->size(300)
                        ->generate($decodedData);

                    return response($qrCode)
                        ->header('Content-Type', 'image/png')
                        ->header('Content-Disposition', 'attachment; filename="qrcode.png"');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Download failed');
        }
    }
}
