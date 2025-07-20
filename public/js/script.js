document.addEventListener('DOMContentLoaded', () => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const cellsContainer = document.getElementById('cellsContainer');
    const addCellBtn = document.getElementById('addCellBtn');
    const modal = document.getElementById('gptModal');
    const toggleModalBtn = document.getElementById('toggleModal');
    const askBtn = document.getElementById('askBtn');
    const questionInput = document.getElementById('questionInput');
    const aiAnswer = document.getElementById('aiAnswer');
    const fileInput = document.getElementById('fileInput');
    const savePyBtn = document.getElementById('savePyBtn');
    const saveIpynbBtn = document.getElementById('saveIpynbBtn');

    function createCell(content = '') {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const textarea = document.createElement('textarea');
        textarea.placeholder = "print('Halo, Dunia!')";
        textarea.value = content;

        const controls = document.createElement('div');
        controls.className = 'controls';

        const runBtn = makeButton('▶️ Jalankan Kode', 'runBtn');
        const aiBtn = makeButton('🤖 Bantuan AI', 'aiBtn');
        const deleteBtn = makeButton('❌ Hapus', 'deleteBtn');

        const output = document.createElement('div');
        output.className = 'output';
        output.textContent = 'Output akan tampil di sini...';

        runBtn.addEventListener('click', () => runCode(textarea.value, output));
        aiBtn.addEventListener('click', () => askAIWithRetry(textarea.value, output));
        deleteBtn.addEventListener('click', () => {
            if (confirm('Yakin ingin menghapus cell ini?')) cell.remove();
        });

        controls.append(runBtn, aiBtn, deleteBtn);
        cell.append(textarea, controls, output);
        cellsContainer.appendChild(cell);
    }

    function makeButton(text, className) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = className;
        return btn;
    }

    function runCode(code, outputElem) {
        if (!code.trim()) return alert('Tulis kodenya dulu ya!');
        outputElem.textContent = '⏳ Menjalankan kode...';

        fetch('/run-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: `code=${encodeURIComponent(code)}`
        })
        .then(res => res.text())
        .then(result => outputElem.textContent = result)
        .catch(err => outputElem.textContent = '❌ Gagal: ' + err);
    }

    function askAIWithRetry(code, outputElem, retries = 3) {
        if (!code.trim()) return alert('Tulis kodenya dulu ya!');
        outputElem.textContent = '🤖 Meminta bantuan AI...';

        fetch('/ai-helper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: `code=${encodeURIComponent(code)}`
        })
        .then(res => res.text())
        .then(result => {
            try {
                const json = JSON.parse(result);

                // Retry kalau error 503 dari Gemini
                if (json?.error?.code === 503 && retries > 0) {
                    outputElem.textContent = `⚠️ Gemini sibuk. Coba lagi (${4 - retries}/3)...`;
                    setTimeout(() => askAIWithRetry(code, outputElem, retries - 1), 2000);
                }

                // Penanganan timeout dari curl error 28
                else if (json?.error?.message?.includes('Operation timed out') && retries > 0) {
                    outputElem.textContent = `⚠️ Waktu habis. Ulangi (${4 - retries}/3)...`;
                    setTimeout(() => askAIWithRetry(code, outputElem, retries - 1), 2000);
                }

                else if (json?.error?.message) {
                    outputElem.textContent = `❌ ${json.error.message}`;
                } else {
                    outputElem.textContent = result;
                }
            } catch {
                outputElem.textContent = result;
            }
        })
        .catch(err => {
            if (retries > 0) {
                outputElem.textContent = `⚠️ Gagal terhubung. Mengulang... (${4 - retries}/3)`;
                setTimeout(() => askAIWithRetry(code, outputElem, retries - 1), 2000);
            } else {
                outputElem.textContent = '❌ Gagal: ' + err;
            }
        });
    }

    toggleModalBtn.addEventListener('click', () => modal.classList.toggle('open'));

    askBtn.addEventListener('click', () => {
        const question = questionInput.value.trim();
        if (!question) return alert('Tulis pertanyaannya dulu!');
        aiAnswer.textContent = '🤖 Sedang menjawab...';
        askAIWithRetry(question, aiAnswer);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            cellsContainer.innerHTML = '';

            if (file.name.endsWith('.py')) {
                createCell(content);
            } else if (file.name.endsWith('.ipynb')) {
                try {
                    const json = JSON.parse(content);
                    const cells = json.cells.filter(c => c.cell_type === "code");
                    cells.forEach(c => createCell(c.source.join('\n')));
                } catch (err) {
                    alert("❌ Gagal membuka .ipynb: " + err.message);
                }
            } else {
                alert("❌ Format tidak didukung. Gunakan .py atau .ipynb");
            }
        };
        reader.readAsText(file);
    });

    savePyBtn.addEventListener('click', async () => {
        const code = [...document.querySelectorAll('.cell textarea')]
            .map(t => t.value)
            .join('\n\n');

        if (!window.showSaveFilePicker) {
            alert("Browser tidak mendukung Save As. Gunakan Chrome/Edge versi terbaru.");
            return;
        }

        try {
            const handle = await showSaveFilePicker({
                suggestedName: 'notebook.py',
                types: [{ description: 'Python Files', accept: { 'text/x-python': ['.py'] } }]
            });

            const writable = await handle.createWritable();
            await writable.write(code);
            await writable.close();
            alert('✅ File berhasil disimpan sebagai .py!');
        } catch (err) {
            if (err.name !== 'AbortError') {
                alert('❌ Gagal menyimpan: ' + err.message);
            }
        }
    });

    saveIpynbBtn.addEventListener('click', async () => {
        const cells = [...document.querySelectorAll('.cell textarea')].map(textarea => ({
            cell_type: "code",
            metadata: {},
            source: textarea.value.split('\n'),
            outputs: [],
            execution_count: null
        }));

        const notebook = {
            cells,
            metadata: {},
            nbformat: 4,
            nbformat_minor: 5
        };

        const json = JSON.stringify(notebook, null, 2);

        if (!window.showSaveFilePicker) {
            alert("Browser tidak mendukung Save As modern. Gunakan Chrome/Edge terbaru.");
            return;
        }

        try {
            const handle = await showSaveFilePicker({
                suggestedName: 'notebook.ipynb',
                types: [{
                    description: 'Jupyter Notebook',
                    accept: { 'application/json': ['.ipynb'] }
                }]
            });

            const writable = await handle.createWritable();
            await writable.write(json);
            await writable.close();
            alert('✅ File berhasil disimpan sebagai .ipynb!');
        } catch (err) {
            if (err.name !== 'AbortError') {
                alert('❌ Gagal menyimpan: ' + err.message);
            }
        }
    });

    // Tambahkan cell pertama saat dimuat
    createCell();
    addCellBtn.addEventListener('click', () => createCell());
});
