const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>マイサイト</title>
    </head>
    <body>
      <h1>こんにちは！</h1>
      <p>Vercelで動いてます。</p>
    </body>
    </html>
  `);
});

server.listen(process.env.PORT || 3000);