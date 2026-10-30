import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL(path,import.meta.url),'utf8');
const [html,js,css,robots]=await Promise.all([
  read('../portal/index.html'),read('../portal/app.js'),read('../portal/styles.css'),read('../portal/robots.txt')
]);
test('six independent industry links are present and unique',()=>{
 const urls=[...html.matchAll(/href="(https:\/\/github\.com\/auturock067-spec\/[^"]+)" target="_blank"/g)].map(m=>m[1]);
 assert.equal(urls.length,6);
 assert.equal(new Set(urls).size,6);
 for(const repo of ['plumbing-source','build-material-hub','appliance-source','tea-source','pet-supply-hub','hair-source'])
   assert.ok(urls.includes('https://github.com/auturock067-spec/'+repo),repo);
});
test('default prototype has noindex and crawler block',()=>{
 assert.match(html,/<meta name="robots" content="noindex,nofollow">/);
 assert.match(robots,/Disallow: \/\s*$/);
 assert.doesNotMatch(html,/<form\b/i);
});
test('bilingual source and accessible controls',()=>{
 assert.match(html,/<html lang="en">/);
 assert.match(html,/<button[^>]*data-lang="en"[^>]*aria-pressed="true"/);
 assert.match(html,/<button[^>]*data-lang="zh"/);
 assert.match(html,/id="site-search"/);
 assert.match(html,/id="site-count"[^>]*role="status"[^>]*aria-live="polite"/);
 assert.equal((html.match(/data-site data-sector=/g)||[]).length,6);
 assert.match(html,/data-zh="选择你的采购行业"/);
 assert.match(js,/document\.documentElement\.lang=/);
 assert.match(js,/\.dataset\.search/);
});
test('no network submission, secrets, or tracking code',()=>{
 assert.doesNotMatch(html+js, /fetch\s*\(|XMLHttpRequest|sendBeacon|gtag\s*\(|api[_-]?key|localStorage|sessionStorage/i);
 assert.match(html,/not currently authenticate suppliers/);
});
test('mobile and reduced-motion styles included',()=>{
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/grid-template-columns:1fr/);
 assert.match(css, /prefers-reduced-motion:reduce/);
});
test('browser script parses without executing',()=>{
 assert.doesNotThrow(()=>new Function(js));
});
