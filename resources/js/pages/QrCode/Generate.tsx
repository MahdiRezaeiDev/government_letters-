import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrCodeGenerate() {
    const [qrData, setQrData] = useState('');
    const [qrSettings, setQrSettings] = useState({
        size: 300,
        fgColor: '#000000',
        bgColor: '#ffffff',
        level: 'M',
    });

    const qrRef = useRef<HTMLDivElement>(null);
    const [serverQrCode, setServerQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const downloadQRCode = (format: 'png' | 'svg') => {
        if (format === 'png') {
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = url;
                link.click();
            }
        }
    };

    const copyToClipboard = () => {
        if (qrData) {
            navigator.clipboard.writeText(qrData);
        }
    };

    return (
        <>
            <Head title="Generate QR Code" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-6">QR Code Generator</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Input Section */}
                                <div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Content for QR Code
                                        </label>
                                        <textarea
                                            value={qrData}
                                            onChange={(e) => setQrData(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                            rows={4}
                                            placeholder="Enter URL, text, or any data..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Size (px)
                                            </label>
                                            <input
                                                type="number"
                                                value={qrSettings.size}
                                                onChange={(e) => setQrSettings({
                                                    ...qrSettings,
                                                    size: parseInt(e.target.value) || 300
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                                min={100}
                                                max={1000}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Error Correction Level
                                            </label>
                                            <select
                                                value={qrSettings.level}
                                                onChange={(e) => setQrSettings({
                                                    ...qrSettings,
                                                    level: e.target.value
                                                })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            >
                                                <option value="L">Low (L)</option>
                                                <option value="M">Medium (M)</option>
                                                <option value="Q">Quartile (Q)</option>
                                                <option value="H">High (H)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Foreground Color
                                            </label>
                                            <input
                                                type="color"
                                                value={qrSettings.fgColor}
                                                onChange={(e) => setQrSettings({
                                                    ...qrSettings,
                                                    fgColor: e.target.value
                                                })}
                                                className="w-full h-10 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Background Color
                                            </label>
                                            <input
                                                type="color"
                                                value={qrSettings.bgColor}
                                                onChange={(e) => setQrSettings({
                                                    ...qrSettings,
                                                    bgColor: e.target.value
                                                })}
                                                className="w-full h-10 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={copyToClipboard}
                                            disabled={!qrData}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Copy Content
                                        </button>
                                    </div>
                                </div>

                                {/* QR Code Display */}
                                <div className="flex flex-col items-center">
                                    <div
                                        ref={qrRef}
                                        className="mb-4 p-4 border rounded-lg bg-white"
                                        style={{ minHeight: '300px', minWidth: '300px' }}
                                    >
                                        {qrData ? (
                                            <QRCodeCanvas
                                                value={qrData}
                                                size={qrSettings.size}
                                                bgColor={qrSettings.bgColor}
                                                fgColor={qrSettings.fgColor}
                                                level={qrSettings.level}
                                                includeMargin={true}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-64 text-gray-400">
                                                Enter content to generate QR code
                                            </div>
                                        )}
                                    </div>

                                    {qrData && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => downloadQRCode('png')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                Download PNG
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (qrRef.current) {
                                                        const svg = qrRef.current.querySelector('svg');
                                                        if (svg) {
                                                            const svgData = new XMLSerializer().serializeToString(svg);
                                                            const blob = new Blob([svgData], { type: 'image/svg+xml' });
                                                            const url = URL.createObjectURL(blob);
                                                            const link = document.createElement('a');
                                                            link.download = 'qrcode.svg';
                                                            link.href = url;
                                                            link.click();
                                                        }
                                                    }
                                                }}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Download SVG
                                            </button>
                                        </div>
                                    )}

                                    {/* Server-side generated QR Code (optional) */}
                                    {serverQrCode && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">Server Generated:</h3>
                                            <img
                                                src={serverQrCode}
                                                alt="Server Generated QR Code"
                                                className="border"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}