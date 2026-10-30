(()=>{'use strict';
const localeButtons=[...document.querySelectorAll('[data-lang]')];
const filterButtons=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('[data-site]')];
const input=document.getElementById('site-search');
const count=document.getElementById('site-count');
const empty=document.getElementById('no-results');
if(!input||!count||!empty||cards.length!==6)return;
let language='en', sector='all';
function translate(){
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.title=language==='zh'?'PENG Nexus | 了解更多，采购更明智':'PENG Nexus | Know more before you source';
  for(const node of document.querySelectorAll('[data-i18n]')){
    const content=node.getAttribute('data-'+language);
    if(content===null)continue;
    if(node.hasAttribute('data-rich')){
      const parts=content.split('<br>');
      const children=[];
      parts.forEach((part,index)=>{if(index)children.push(document.createElement('br'));children.push(document.createTextNode(part));});
      node.replaceChildren(...children);
    }else node.textContent=content;
  }
  for(const link of document.querySelectorAll('[data-link-en]')){
    link.replaceChildren(document.createTextNode(link.getAttribute('data-link-'+language)+' '));
    const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';link.append(arrow);
    const name=link.closest('[data-site]')?.querySelector('h3')?.textContent||'';
    link.setAttribute('aria-label',(language==='zh'?'查看 ':'View ')+name+(language==='zh'?' GitHub 项目仓库':' GitHub repository'));
  }
  input.placeholder=language==='zh'?'搜索行业、产品或关键词…':'Search by industry, product, or keyword…';
  input.setAttribute('aria-label',language==='zh'?'搜索行业':'Search industries');
  for(const button of localeButtons)button.setAttribute('aria-pressed',String(button.dataset.lang===language));
  render();
}
function render(){
  const term=input.value.trim().toLocaleLowerCase();
  let shown=0;
  for(const card of cards){
    const matches=(sector==='all'||card.dataset.sector===sector)&&
      (card.dataset.search||'').includes(term);
    card.hidden=!matches;
    if(matches)shown++;
  }
  empty.hidden=shown!==0;
  count.textContent=language==='zh'?'显示 '+shown+' 个行业':shown+' '+(shown===1?'industry':'industries');
  for(const button of filterButtons)button.setAttribute('aria-pressed',String(button.dataset.filter===sector));
}
for(const button of localeButtons)button.addEventListener('click',()=>{language=button.dataset.lang;translate();});
for(const button of filterButtons)button.addEventListener('click',()=>{sector=button.dataset.filter;render();});
input.addEventListener('input',render);
translate();
})();
