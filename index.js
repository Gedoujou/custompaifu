const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

  if (req.method === 'POST' && req.url === '/fetch-log') {
    let body = '';

    req.on('data', chunk => { body += chunk; });

    req.on('end', () => {
      let logId;
      try {
        ({ logId } = JSON.parse(body));
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('リクエストが不正です');
        return;
      }

      if (!logId) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('logIdがありません');
        return;
      }

      const tenhouUrl = `https://tenhou.net/0/log/?${logId}`;

      const options = {
        hostname: 'tenhou.net',
        path: `/0/log/?${logId}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://tenhou.net/'
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.setEncoding('utf8');
        proxyRes.on('data', chunk => { data += chunk; });
        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(data);
        });
      });

      proxyReq.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('取得に失敗しました: ' + err.message);
      });

      proxyReq.end();
    });

    return;
  }

  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('エラーが発生しました');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

server.listen(process.env.PORT || 3000)