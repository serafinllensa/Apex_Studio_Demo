const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const LOG_FILE_PATH = 'C:\\Users\\Serafin\\.gemini\\antigravity\\brain\\2f203ba2-8cfc-4807-bda4-073528546f02\\.system_generated\\logs\\transcript.jsonl';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const parsedUrl = req.url.split('?')[0];

  if (parsedUrl === '/api/logs') {
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read log file' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      // Splitting the JSONL into an array of objects
      const lines = data.trim().split('\n');
      const jsonLogs = lines.map(line => {
        try { return JSON.parse(line); } catch(e) { return null; }
      }).filter(Boolean);
      
      res.end(JSON.stringify(jsonLogs));
    });
    return;
  }

  // Serve static files
  let filePath = path.join(PUBLIC_DIR, parsedUrl === '/' ? 'index.html' : parsedUrl);
  
  // Security Fix: Path Traversal Prevention
  const absolutePublicDir = path.resolve(PUBLIC_DIR);
  const absoluteFilePath = path.resolve(filePath);
  if (!absoluteFilePath.startsWith(absolutePublicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden - Access Denied');
      return;
  }
  
  const extname = path.extname(absoluteFilePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(absoluteFilePath, (err, content) => {
    if (err) {
      if(err.code == 'ENOENT'){
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
