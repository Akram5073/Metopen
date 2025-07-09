<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Python Online Editor</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset(path: 'css/style.css') }}">

<body>
    <div class="container">
        <h1>🐍 Python Online Editor</h1>
        <p>Tulis kode Python Anda di bawah ini dan jalankan.</p>
        <div class="editor-container">
            <textarea id="codeInput" placeholder="print('Halo, Dunia!')"></textarea>
        </div>
        <div class="controls">
            <button id="runBtn">▶️ Jalankan Kode</button>
            <button id="aiBtn">🤖 Minta Bantuan AI</button>
        </div>
        <div class="output-container">
            <h2>Output:</h2>
            <pre id="output"></pre>
        </div>
    </div>
    <script src="{{ asset(path: 'js/script.js') }}"></script>
</body>

</html>