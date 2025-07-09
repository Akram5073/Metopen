document.addEventListener('DOMContentLoaded', () => {
    // Ambil token dari meta tag <meta name="csrf-token" content="...">
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const codeInput = document.getElementById('codeInput');
    const runBtn = document.getElementById('runBtn');
    const aiBtn = document.getElementById('aiBtn');
    const output = document.getElementById('output');

    // Fungsi untuk menampilkan status loading
    const showLoading = (message) => {
        output.style.color = '#888';
        output.textContent = message;
    };

    // Event listener untuk tombol "Jalankan Kode"
    runBtn.addEventListener('click', () => {
        const code = codeInput.value;
        if (code.trim() === '') {
            alert('Silakan tulis kode terlebih dahulu!');
            return;
        }

        showLoading('Menjalankan kode...');

        fetch('/run-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: `code=${encodeURIComponent(code)}`
        })
            .then(response => response.text())
            .then(data => {
                output.style.color = '#d4d4d4'; // Warna teks normal
                output.textContent = data;
            })
            .catch(error => {
                output.style.color = '#ff4d4d'; // Warna error
                output.textContent = 'Terjadi kesalahan saat menghubungi server: ' + error;
            });
    });

    // Event listener untuk tombol "Minta Bantuan AI"
    aiBtn.addEventListener('click', () => {
        const code = codeInput.value;
        if (code.trim() === '') {
            alert('Silakan tulis kode yang butuh bantuan!');
            return;
        }

        showLoading('Meminta bantuan dari AI...');

        fetch('/ai-helper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': csrfToken
            },
            body: `code=${encodeURIComponent(code)}`
        })
            .then(response => response.text())
            .then(data => {
                output.style.color = '#d4d4d4'; // Warna teks normal
                output.textContent = data;
            })
            .catch(error => {
                output.style.color = '#ff4d4d'; // Warna error
                output.textContent = 'Terjadi kesalahan saat menghubungi AI: ' + error;
            });
    });
});