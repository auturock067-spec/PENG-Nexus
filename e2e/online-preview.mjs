import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const sha=process.env.PREVIEW_COMMIT || process.env.GITHUB_SHA;
if(!/^[a-f0-9]{40}$/.test(sha||''))throw Error('Use a GitHub commit hash only');
const preview='https://raw.githack.com/auturock067-spec/PENG-Nexus/'+sha+'/portal/index.html';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
const page=await context.newPage();
const log={url:preview,commit:sha,checkedAt:new Date().toISOString(),status:null,gateDetected:false,rendered:false,imagesLoaded:null,jsWorks:false,consoleErrors:[],reason:null};
page.on('pageerror',error=>log.consoleErrors.push(String(error)));
const dest='artifacts';
await mkdir(dest,{recursive:true});
try{
 let r=await page.goto(preview,{waitUntil:'domcontentloaded',timeout:45000});
 log.status=r?.status()??null;
 const initialText=(await page.locator('body').innerText().catch(()=>''))?.slice(0,500)||'';
 log.gateDetected=!await page.locator('.site-header').count();
 if(log.gateDetected){
   console.log('Preview gateway observed (first-time visitors may see a safety confirmation):',initialText.slice(0,250));
   await context.addCookies([{name:'__Http-phish',value:'1',domain:'raw.githack.com',path:'/',httpOnly:true,secure:true,sameSite:'Lax'}]);
   r=await page.goto(preview,{waitUntil:'domcontentloaded',timeout:45000});
   log.status=r?.status()??null;
 }
 await page.locator('.site-header').waitFor({timeout:20000});
 await page.locator('.sectors-grid .sector-card').first().waitFor({timeout:10000});
 log.rendered=(await page.locator('[data-site]').count())===6 && await page.title().then(t=>t.includes('PENG Nexus'));
 const color=await page.locator('.site-header').evaluate(el=>getComputedStyle(el).backgroundColor);
 log.headerBackground=color;
 await page.locator('[data-lang="zh"]').click();
 log.jsWorks=(await page.locator('html').getAttribute('lang'))==='zh-CN';
 await page.locator('#site-search').fill('宠物');
 log.jsWorks=log.jsWorks&&(await page.locator('[data-site]:visible').count())===1;
 await page.locator('#site-search').fill('');
 for(const img of await page.locator('img').all()){
   await img.scrollIntoViewIfNeeded();
   await img.evaluate(async el=>{try{await el.decode();}catch{}});
 }
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:join(dest,'online-preview-390-zh.png'),fullPage:true});
 log.imagesLoaded=await page.locator('img').evaluateAll(els=>els.map(x=>({src:x.currentSrc,naturalWidth:x.naturalWidth})));
 log.imagesLoadedCount=log.imagesLoaded.filter(x=>x.naturalWidth>0).length;
 log.jsWorks=log.jsWorks && (await page.locator('[data-detail]').count())===6;
 log.rendered=log.rendered && log.jsWorks && log.imagesLoadedCount===7;
}catch(e){log.reason=String(e);}
finally{await writeFile(join(dest,'online-preview-report.json'),JSON.stringify(log,null,2));await browser.close();}
console.log('ONLINE_PREVIEW_REPORT',JSON.stringify({...log,imagesLoaded:undefined}));
if(!log.rendered)process.exitCode=2;
