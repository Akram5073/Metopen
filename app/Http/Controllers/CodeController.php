<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CodeController extends Controller
{
    /**
     * Menjalankan kode Python dari input user.
     */
    public function run(Request $request)
    {
        $code = $request->input('code');

        // Simpan ke file sementara
        $tempFile = tempnam(sys_get_temp_dir(), 'py');
        file_put_contents($tempFile, $code);

        // Jalankan dengan Python
        $output = shell_exec("python $tempFile 2>&1");

        // Hapus file setelah dijalankan
        unlink($tempFile);

        return response($output);
    }

    /**
     * Mengirimkan kode ke Google Gemini untuk penjelasan dengan AI.
     */
    public function ai(Request $request)
    {
        set_time_limit(120);
        $code = $request->input('code');
        $apiKey = env('GEMINI_API_KEY');

        if (empty($apiKey)) {
            return response("API Key belum disetel. Tambahkan GEMINI_API_KEY di .env", 500);
        }

        $prompt = "Tolong jelaskan kode Python berikut ini dalam Bahasa Indonesia, termasuk kesalahan jika ada.\n\n```python\n$code\n```";
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$apiKey";

        try {
            $response = Http::withOptions([
                'verify' => false // sementara, jika SSL bermasalah
            ])->withHeaders([
                'Content-Type' => 'application/json'
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            $result = $response->json();

            if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                return response($result['candidates'][0]['content']['parts'][0]['text']);
            }

            return response("Respon tidak valid dari Gemini:\n" . json_encode($result, JSON_PRETTY_PRINT), 500);
        } catch (\Exception $e) {
            return response("Gagal memanggil Gemini API:\n" . $e->getMessage(), 500);
        }
    }
}
