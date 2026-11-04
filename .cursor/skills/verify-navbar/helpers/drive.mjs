#!/usr/bin/env node
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
const args=process.argv.slice(2),mode=args[0],opt=(k,d)=>{const i=args.indexOf('--'+k);return i>=0?args[i+1]:d;};
if(!['doctor','drive'].includes(mode))throw Error('Use doctor or drive');
const out=path.resolve(opt('out','.verification-evidence')),base=opt('base','http://127.0.0.1:5198/'),width=Number(opt('width','390'));
fs.mkdirSync(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const page=await browser.newPage();await page.setViewport({width,height:844});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
const result={mode,base,width,steps:[],errors,ok:false};const assert=(v,m)=>{if(!v)throw Error(m);};
try{
 const response=await page.goto(base,{waitUntil:'networkidle0'});assert(response.status()===200,'Page HTTP');
 await page.waitForSelector('nav.navbar');assert(await page.title()==='Bootstrap Navbar','Wrong target');
 const links=await page.$$eval('#navbarNav a',els=>els.map(e=>e.textContent.trim()));assert(JSON.stringify(links)===JSON.stringify(['Home','About','Contact']),'Link contract');result.steps.push({doctor:'boot+nav+three links'});
 if(mode==='drive'){
  const visible=()=>page.$eval('#navbarNav',e=>getComputedStyle(e).display!=='none');
  if(width<992){
   assert(!await visible(),'Mobile menu should start collapsed');
   await page.click('.navbar-toggler');await page.waitForFunction(()=>document.querySelector('#navbarNav').classList.contains('show'));
   assert(await visible(),'Mobile menu not visible');assert(await page.$eval('.navbar-toggler',e=>e.getAttribute('aria-expanded'))==='true','Expand ARIA');
   await page.screenshot({path:path.join(out,'expanded.png')});result.steps.push({action:'Toggle open',show:true,ariaExpanded:true});
   await page.click('.navbar-toggler');await page.waitForFunction(()=>document.querySelector('#navbarNav').classList.contains('collapse')&&!document.querySelector('#navbarNav').classList.contains('show'));
   assert(!await visible(),'Mobile menu not collapsed');result.steps.push({action:'Toggle close',show:false});
  }else{assert(await visible(),'Desktop links not visible');assert(await page.$eval('.navbar-toggler',e=>getComputedStyle(e).display)==='none','Desktop toggle unexpectedly visible');result.steps.push({desktopExpanded:true});}
  // Source links are placeholders, not real navigation routes. Do not invent pages.
  assert(await page.$$eval('#navbarNav a',els=>els.every(e=>e.getAttribute('href')==='#')),'Link semantics changed');
 }
 assert(errors.length===0,'Runtime errors');await page.screenshot({path:path.join(out,'final.png')});result.ok=true;
}catch(e){result.failure=String(e);}finally{await browser.close();}
fs.writeFileSync(path.join(out,mode+'.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));process.exit(result.ok?0:1);
