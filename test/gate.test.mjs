// Testes do portão de acesso. O código correto é passado por variável de ambiente (TEST_CODE), nunca fica no repositório:
//   TEST_CODE='...' node test/gate.test.mjs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import middleware from '../middleware.js';

const CODE = process.env.TEST_CODE;
assert.ok(CODE, 'defina TEST_CODE com o código de acesso');
const B = 'https://exemplo.vercel.app';
const run = (p, o = {}) => middleware(new Request(B + p, { redirect: 'manual', ...o }));
const post = (code) => run('/acesso/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'codigo=' + encodeURIComponent(code) });
const blocked = (r) => r.status === 303 && /\/acesso\/$/.test(r.headers.get('location'));
const passed = (r) => r.headers.get('x-middleware-next') === '1';
let n = 0; const ok = (m) => console.log('ok', ++n, m);

for (const p of ['/', '/index.html', '/css/styles.css', '/js/app.js', '/assets/img/app-01.png', '/assets/parceiros/nike.webp']) assert.ok(blocked(await run(p)), p);
ok('sem cookie: página, CSS, JS e imagens bloqueados');
assert.ok(passed(await run('/acesso/'))); assert.ok(passed(await run('/acesso/logo.svg'))); assert.ok(passed(await run('/robots.txt')));
assert.equal((await run('/acesso')).status, 303);
ok('portão, arquivos do portão e robots.txt abertos');
for (const c of ['', 'errado', CODE.toLowerCase(), CODE + 'x']) {
  const r = await post(c); assert.equal(r.status, 303); assert.match(r.headers.get('location'), /acesso\/\?erro=1$/); assert.ok(!r.headers.get('set-cookie'));
}
ok('códigos errados recusados sem cookie');
const r = await post(CODE); assert.equal(r.status, 303); assert.equal(new URL(r.headers.get('location')).pathname, '/');
const ck = r.headers.get('set-cookie'); assert.match(ck, /HttpOnly/); assert.match(ck, /SameSite=Lax/); assert.match(ck, /Max-Age=604800/); assert.match(ck, /Secure/);
ok('código certo: cookie HttpOnly/Secure de 7 dias e volta ao site');
const cookie = ck.split(';')[0];
for (const p of ['/', '/css/styles.css', '/assets/img/app-01.png']) assert.ok(passed(await run(p, { headers: { cookie } })), p);
assert.equal((await run('/acesso/', { headers: { cookie } })).status, 303);
ok('com cookie: site liberado; /acesso/ leva ao site');
assert.ok(blocked(await run('/', { headers: { cookie: 'rav_acesso=abc' } }))); assert.ok(blocked(await run('/', { headers: { cookie: 'rav_acesso=' } })));
const out = await run('/sair', { headers: { cookie } }); assert.match(out.headers.get('set-cookie'), /Max-Age=0/);
ok('cookie forjado/vazio recusado; /sair apaga o cookie');
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const hit = ['middleware.js', 'vercel.json', 'README.md', ...walk('site').filter(f => /\.(html|css|js|txt|svg)$/.test(f))].filter(f => readFileSync(f, 'utf8').includes(CODE));
assert.deepEqual(hit, []); ok('o código em texto puro não aparece no middleware nem no site');
console.log('\nTudo certo:', n, 'grupos de teste');
