/**
 * serve.js — a minimal local web server for previewing dist/.
 *
 * Run with:  npm run dev   (builds first, then serves)
 * Then open http://localhost:8080
 *
 * Needed because browsers block loading the case data files when a page is
 * opened directly from disk (file://). Not used on the live site.
 *
 * To mimic GitHub Pages, which serves the site from a subfolder:
 *   node scripts/serve.js --base /case-interview-engine --port 8091
 * then open http://localhost:8091/case-interview-engine/
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const PORT = Number(process.env.PORT || arg('port')) || 8080;
const BASE = (arg('base') || '').replace(/\/$/, ''); // e.g. "/case-interview-engine"

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (BASE) {
      if (urlPath === BASE) urlPath += '/';
      if (!urlPath.startsWith(`${BASE}/`)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found (outside the base path)');
        return;
      }
      urlPath = urlPath.slice(BASE.length);
    }
    let file = path.join(DIST, urlPath);
    // Never serve files outside dist/
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}${BASE}/`));
