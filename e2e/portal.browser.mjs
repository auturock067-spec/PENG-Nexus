import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=fileURLToPath(new URL('../portal/',import.meta.url));
const artifacts=fileURLToPath(new URL('../artifacts/',import.meta.url));
const assets={'/':'index.html','/index.html':'index.html','/styles.css':'styles.css','/app.js':'app.js','/robots.txt':'robots.txt'};
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',txt:'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 const name=assets[(req.url||'').split('?')[0]];
 if(!name){res.writeHead(404);res.end('Not found');return;}
 try{
   const file=await readFile(join(root,name));
   res.writeHead(200,{'content-type':mime[name.split('.').pop()],'cache-control':'no-store'});
   res.end(file);
 }catch{res.writeHead(500);res.end('Asset missing');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port+'/';
await mkdir(artifacts,{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true});
 for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',error=>errors.push(String(error)));
   const response=await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   assert.match(await page.title(),/PENG Nexus/);
   assert.equal(await page.locator('[data-site]:visible').count(),6);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),true,'horizontal overflow at '+width);
   await page.screenshot({path:join(artifacts,'portal-'+width+'-en.png'),fullPage:true});
   if(width===390){
     await page.locator('[data-lang="zh"]').click();
     assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
     await page.locator('#site-search').fill('宠物');
     assert.equal(await page.locator('[data-site]:visible').count(),1);
     await page.locator('#site-search').fill('');
     await page.locator('[data-filter="industrial"]').click();
     assert.equal(await page.locator('[data-site]:visible').count(),3);
     await page.locator('[data-filter="all"]').click();
     await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
     await page.waitForTimeout(200);
     await page.screenshot({path:join(artifacts,'portal-390-zh.png'),fullPage:true});
     await page.locator('[data-lang="en"]').click();
     await page.locator('#site-search').fill('Plumbing');
     assert.equal(await page.locator('[data-site]:visible').count(),1);
   }
   assert.deepEqual(errors,[],'runtime errors at '+width);
   await page.close();
   console.log('PASS portal Chromium '+width+'px; screenshot saved');
 }
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
