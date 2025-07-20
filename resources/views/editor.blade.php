<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Python Online Editor Multi-Cell</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">

    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f0f2f5;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .cell {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fafafa;
        }

        .output {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            white-space: pre-wrap;
        }

        textarea {
            width: 100%;
            height: 200px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px;
            padding: 10px;
            resize: vertical;
        }

        .controls {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }

        .controls button {
            padding: 10px 16px;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
        }

        .runBtn {
            background-color: #28a745;
        }

        .runBtn:hover {
            background-color: #218838;
        }

        .aiBtn {
            background-color: #007bff;
        }

        .aiBtn:hover {
            background-color: #0056b3;
        }

        .deleteBtn {
            background-color: #dc3545;
        }

        .deleteBtn:hover {
            background-color: #c82333;
        }

        #addCellBtn,
        #toggleModal {
            margin-bottom: 20px;
            padding: 10px 16px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
        }

        h1 {
            text-align: center;
            color: #0d47a1;
            margin-bottom: 25px;
        }

        #toggleModal {
            float: right;
            background-color: #17a2b8;
        }

        /* MODAL SIDE PANEL */
        .modal {
            position: fixed;
            right: -400px;
            top: 0;
            width: 350px;
            height: 100%;
            background-color: #ffffff;
            box-shadow: -3px 0 10px rgba(0, 0, 0, 0.2);
            padding: 20px;
            transition: right 0.3s ease;
            overflow-y: auto;
            z-index: 9999;
        }

        .modal.open {
            right: 0;
        }

        .modal-content h2 {
            font-size: 18px;
            margin-top: 0;
            color: #0d47a1;
        }

        .modal-content textarea {
            width: 100%;
            height: 120px;
            margin: 10px 0;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
        }

        .modal-content button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }

        #aiAnswer {
            margin-top: 15px;
            padding: 10px;
            background-color: #f4f4f4;
            border-left: 3px solid #007bff;
            white-space: pre-wrap;
        }
    </style>
</head>

<body>
    <header class="header">
        <h2>🔷 Python Editor</h2>
        <div class="file-actions">
            <input type="file" id="fileInput" accept=".py,.ipynb" hidden>
            <button onclick="document.getElementById('fileInput').click()">📂 Open File</button>
            <button id="savePyBtn">💾 Save as .py</button>
            <button id="saveIpynbBtn">💾 Save .ipynb</button>
        </div>
    </header>

    <div class="container">
        <h1>🐍 Python Online Editor Multi-Cell</h1>
        <button id="toggleModal">💬 Tanya AI</button>
        <button id="addCellBtn">➕ Tambah Cell</button>
        <div id="cellsContainer"></div>
    </div>

    <!-- Modal GPT -->
    <div id="gptModal" class="modal">
        <div class="modal-content">
            <h2>🤖 Tanyakan Sesuatu</h2>
            <textarea id="questionInput" placeholder="Tulis pertanyaan..."></textarea>
            <button id="askBtn">Kirim ke AI</button>
            <div id="aiAnswer"></div>
        </div>
    </div>

    <script src="{{ asset('js/script.js') }}"></script>
</body>

</html>