import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { greeting } from './greeting.js';

const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
].map(([route, [file, type]]) => [route, {
  body: readFileSync(new URL(`./public/${file}`, import.meta.url)), type,
}]));

export function createApp() {
  return createServer((request, response) => {
    const send = (status, body, type = 'text/plain; charset=utf-8') => {
      response.writeHead(status, {
        'Content-Type': type,
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(body);
    };

    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      return send(405, 'Method not allowed');
    }

    // A fixed base keeps routing independent of an untrusted Host header.
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/health') {
      return send(200, JSON.stringify({ status: 'ok', stack: 'npm' }), 'application/json');
    }
    if (url.pathname === '/api/greet') {
      try {
        return send(200, greeting(url.searchParams.get('name') ?? ''));
      } catch (error) {
        return send(400, error.message);
      }
    }
    const asset = assets.get(url.pathname);
    if (asset) return send(200, asset.body, asset.type);
    return send(404, 'Not found');
  });
}
