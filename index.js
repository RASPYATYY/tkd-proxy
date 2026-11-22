const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = new URL(req.url, 'http://localhost');
  const target = url.searchParams.get('url');
  if (!target) { res.writeHead(400); res.end('missing url'); return; }

  https.get(target, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
  }, r => {
    res.writeHead(r.statusCode, { 'Content-Type': r.headers['content-type'] || 'application/json' });
    r.pipe(res);
  }).on('error', e => { res.writeHead(500); res.end(e.message); });

}).listen(PORT, () => console.log('proxy on ' + PORT));
