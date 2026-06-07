const http = require('http');
const fs = require('fs');
const https = require('https');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url !== '/') {
    const ext = path.extname(req.url);
    const filePath = path.join(__dirname, req.url);

    if (mimeTypes[ext] && fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  if (req.method === 'GET') {
    fs.readFile('index.html', 'utf8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/fetch-log') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { logId } = JSON.parse(body);
      const url = `https://tenhou.net/0/log/?${logId}`;

      const options = {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      };

      https.get(url, options, (fileRes) => {
        let data = '';
        fileRes.setEncoding('utf8');
        fileRes.on('data', chunk => data += chunk);
        fileRes.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(data);
        });
      }).on('error', (err) => {
        res.writeHead(500);
        res.end('取得失敗: ' + err.message);
      });
    });
    return;
  }
});

server.listen(process.env.PORT || 3000);