
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSite } from '../src/render.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const opt=(k,fallback)=>{const index=args.indexOf(k);return index<0?fallback:args[index+1];};
const configPath=resolve(process.cwd(),opt('--config',join(root,'starter/site.json')));
const out=resolve(process.cwd(),opt('--out',join(root,'dist')));
const site=JSON.parse(await readFile(configPath,'utf8'));
const html=renderSite(site);
await mkdir(out,{recursive:true});
await writeFile(join(out,'index.html'),html);
await writeFile(join(out,'styles.css'),await readFile(join(root,'templates/styles.css')));
await writeFile(join(out,'app.js'),await readFile(join(root,'templates/app.js')));
await writeFile(join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Generated '+site.brand+' in '+out+' (prototype: noindex)');
