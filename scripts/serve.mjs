import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.bib': 'application/x-bibtex; charset=utf-8' };

try { await stat(path.join(root, 'index.html')); }
catch { console.error('Run npm run build before starting the preview.'); process.exit(1); }

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  try {
    const url = new URL(request.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.split('/').some((segment) => segment.startsWith('.') && segment !== '')) { response.writeHead(404); response.end(); return; }
    let filename = path.resolve(root, `.${decoded}`);
    if (!filename.startsWith(root + path.sep) && filename !== root) { response.writeHead(403); response.end(); return; }
    const info = await stat(filename);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(308, { Location: `${url.pathname}/${url.search}` }); response.end(); return; }
      filename = path.join(filename, 'index.html');
    }
    const content = await readFile(filename);
    response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Content-Length': content.byteLength, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const code = error instanceof URIError ? 400 : 404;
    response.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    const page = code === 404 ? await readFile(path.join(root, '404.html'), 'utf8').catch(() => 'Not found') : 'Bad request';
    response.end(request.method === 'HEAD' ? undefined : page);
  }
});

let port = Number(process.env.PORT || 4173);
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < 4183) { port += 1; server.listen(port, '127.0.0.1'); }
  else { console.error(error.message); process.exit(1); }
});
server.on('listening', () => console.log(`Local: http://127.0.0.1:${port}/`));
server.listen(port, '127.0.0.1');
