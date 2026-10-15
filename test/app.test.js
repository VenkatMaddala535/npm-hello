import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { once } from 'node:events';
import { createApp } from '../src/app.js';
import { greeting } from '../src/greeting.js';

const server = createApp();
let baseUrl;
before(async () => {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve, reject) => {
  server.close((error) => error ? reject(error) : resolve());
}));

test('greeting defaults, whitespace, unicode and length boundary', () => {
  assert.equal(greeting(), 'Hello, World!');
  assert.equal(greeting('   '), 'Hello, World!');
  assert.equal(greeting(' Balaji '), 'Hello, Balaji!');
  assert.equal(greeting('உலகம்'), 'Hello, உலகம்!');
  assert.equal(greeting('a'.repeat(80)), `Hello, ${'a'.repeat(80)}!`);
  assert.throws(() => greeting('a'.repeat(81)), RangeError);
});

test('serves the website and its CSS and JavaScript', async () => {
  const page = await fetch(baseUrl);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.match(await page.text(), /Hello from npm/);
  for (const asset of ['/style.css', '/app.js']) {
    const response = await fetch(baseUrl + asset);
    assert.equal(response.status, 200);
    assert.ok((await response.text()).length > 0);
  }
});

test('health identifies the stack', async () => {
  const response = await fetch(baseUrl + '/health');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', stack: 'npm' });
});

test('greeting endpoint handles a missing name and encoded input', async () => {
  assert.equal(await (await fetch(baseUrl + '/api/greet')).text(), 'Hello, World!');
  const response = await fetch(baseUrl + '/api/greet?name=Ada%20Lovelace');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'Hello, Ada Lovelace!');
});

test('too-long names produce a client error', async () => {
  const response = await fetch(baseUrl + '/api/greet?name=' + 'a'.repeat(81));
  assert.equal(response.status, 400);
  assert.match(await response.text(), /80 characters/);
});

test('unknown routes and unsupported methods are rejected', async () => {
  for (const route of ['/missing', '/health/extra']) {
    const response = await fetch(baseUrl + route);
    assert.equal(response.status, 404);
    await response.text();
  }
  const response = await fetch(baseUrl + '/api/greet', { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
  await response.text();
});
