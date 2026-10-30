import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as matrix } from '../edge-functions/_matrix/client/[[path]].js';
import { onRequest as synapse } from '../edge-functions/_synapse/client/[[path]].js';
import { onRequest as versions } from '../dist/edge-functions/_matrix/client/versions.js';

for (const [handler, path] of [[matrix, '/_matrix/client/v3/login'], [synapse, '/_synapse/client/oidc/callback']]) {
    test(`307 preserves method, encoded path and query: ${path}`, async () => {
        const query = '?a=x%20y&b=%2F&b=two';
        const response = handler({ request: new Request('https://chat.neboer.site' + path + query, { method: 'POST' }) });
        assert.equal(response.status, 307);
        assert.equal(response.headers.get('Location'), 'https://matrix.neboer.site:8448' + path + query);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
    });
}
test('versions serves JSON with CORS and supports preflight and HEAD', async () => {
    const url = 'https://chat.neboer.site/_matrix/client/versions';
    const response = versions({ request: new Request(url) });
    assert.equal(response.status, 200);
    assert.ok((await response.json()).versions.length);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(versions({ request: new Request(url, { method: 'OPTIONS' }) }).status, 204);
    assert.equal(await versions({ request: new Request(url, { method: 'HEAD' }) }).text(), '');
    assert.equal(versions({ request: new Request(url, { method: 'POST' }) }).status, 405);
});
