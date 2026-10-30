import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSite } from '../src/render.mjs';
import { readFile } from 'node:fs/promises';
const sample=JSON.parse(await readFile(new URL('../starter/site.json',import.meta.url),'utf8'));
test('renders search and categories',()=>{const html=renderSite(sample);assert.match(html,/id="product-search"/);assert.match(html,/data-product/);assert.match(html,/id="suppliers"/);});
test('does not claim verified suppliers',()=>{const html=renderSite(sample);assert.match(html,/No factory is currently endorsed/);assert.match(html,/noindex,nofollow/);});
test('escapes external strings',()=>{const html=renderSite({...sample,brand:'<script>alert("oops")</script>'});assert.doesNotMatch(html,/<script>alert/);assert.match(html,/&lt;script&gt;/);});
test('rejects incomplete configuration',()=>{assert.throws(()=>renderSite({brand:'x'}),/products/);});
