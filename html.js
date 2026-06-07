document.getElementById('submit').addEventListener('click', async () => {
            const url = document.getElementById('url').value;

            const logId = url.split('?')[1];

            if (!logId) {
                alert('URLが正しくありません');
                return;
            }

            const res = await fetch('/fetch-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logId })
            });

            const text = await res.text();
            document.getElementById('result').textContent = text;
});