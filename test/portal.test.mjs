import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const [html,js,css,robots]=await Promise.all([
  read('../portal/index.html'),read('../portal/app.js'),read('../portal/styles.css'),read('../portal/robots.txt')
]);
test('homepage introduces brand, purpose and six distinct industry sectors',()=>{
 assert.match(html,/ABOUT PENG NEXUS/);
 assert.match(html,/WELCOME TO PENG NEXUS/);
 assert.match(html,/OUR INDUSTRIES/);
 assert.match(html,/OUR DIRECTION/);
 const entries=[...html.matchAll(/data-site data-sector="[^"]+" data-key="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(entries,['plumbing','material','appliance','tea','pet','hair']);
 assert.equal((html.match(/data-detail="/g)||[]).length,6);
});
test('site is a preview and no supplier verification or sales claims are made',()=>{
 assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
 assert.match(robots,/Disallow: \/\s*$/);
 assert.match(html,/not currently verify suppliers/);
 assert.doesNotMatch(html,/<form[^>]*action=/);
});
test('bilingual navigation, live search, industry modal and accessible controls',()=>{
 assert.match(html,/<html lang="en">/);
 assert.match(html,/<button[^>]*data-lang="en"[^>]*aria-pressed="true"/);
 assert.match(html,/<button[^>]*data-lang="zh"/);
 assert.match(html,/id="site-search"/);
 assert.match(html,/id="site-count"[^>]*role="status"[^>]*aria-live="polite"/);
 assert.match(html,/id="detail-dialog"/);
 assert.match(html,/data-zh="探索六大专业领域。"/);
 assert.match(js,/document\.documentElement\.lang=/);
 assert.match(js,/\.dataset\.search/);
 assert.match(js,/\.showModal\(/);
});
test('photography present for hero and six sectors; clear attributions',()=>{
 assert.match(html,/class="hero-photo"/);
 assert.equal((html.match(/class="sector-image"/g)||[]).length,6);
 assert.equal((html.match(/<img\b/g)||[]).length,7);
 assert.match(html,/unsplash\.com\/license/);
});
test('no customer data submission, secrets or analytics',()=>{
 assert.doesNotMatch(html+js, /fetch\s*\(|XMLHttpRequest|sendBeacon|gtag\s*\(|api[_-]?key|localStorage|sessionStorage/i);
});
test('mobile typography, grids and reduced-motion styles included',()=>{
 assert.match(css,/@media\(max-width:580px\)/);
 assert.match(css,/grid-template-columns:1fr/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('browser script parses without executing',()=>{
 assert.doesNotThrow(()=>new Function(js));
});
