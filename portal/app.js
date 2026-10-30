(()=>{'use strict';
const buttons=[...document.querySelectorAll('[data-lang]')];
const filters=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('[data-site]')];
const search=document.querySelector('#site-search');
const count=document.querySelector('#site-count');
const empty=document.querySelector('#no-results');
const dialog=document.querySelector('#detail-dialog');
const details={
plumbing:{en:["PlumbingSource","Understand the components behind reliable piping systems.",["Thread standards and dimensions","Material and pressure-temperature requirements","Installation and applicable local codes"]],zh:["水暖与管道","从技术规格入手，了解管道系统产品的采购要点。",["螺纹标准与尺寸","材质及压力、温度范围","安装方式与当地法规"]]},
material:{en:["BuildMaterialHub","Build a clearer view of common building material specifications.",["Material grades and dimensions","Performance and testing documentation","Project applications and handling requirements"]],zh:["建筑材料","梳理建材规格、工程要求与采购中需要确认的事项。",["材料等级与尺寸","性能及检测文件","工程应用和运输存储要求"]]},
appliance:{en:["ApplianceSource","Compare household product features and requirements before sourcing.",["Electrical ratings and intended markets","Safety standards and documentation","Warranty, packaging and usability specifications"]],zh:["家用电器","了解家电产品参数与目标市场的安全和质量要求。",["电气参数及目标市场","安全标准和相关证明","保修、包装与使用规格"]]},
tea:{en:["TeaSource","Explore tea categories, origins and preparation for sourcing.",["Tea type, origin and processing","Grading, packaging and freshness","Import and labelling requirements"]],zh:["茶叶与产地","了解茶叶品类、原产地、加工与进口基本知识。",["茶类、原产地与制作工艺","等级、包装与新鲜度","进口和标签要求"]]},
pet:{en:["PetSupplyHub","Review pet accessories through material and use-case questions.",["Materials and pet safety","Size compatibility and durability","Labelling, packaging and supplier documentation"]],zh:["宠物用品","从用途、材质和安全出发，梳理宠物用品采购问题。",["材质及宠物安全","尺寸适配与耐用性","标签、包装和供应商文件"]]},
hair:{en:["HairSource","Understand hair, salon products and their quality characteristics.",["Material and product type","Performance, quality and care instructions","Packaging, compliance and market requirements"]],zh:["美发与沙龙用品","了解发制品、沙龙耗材及品质检验要点。",["材质与产品类型","性能、质量和护理说明","包装、合规与市场要求"]]}
};
let lang='en',sector='all';
function setRich(node,value){
  const tokens=value.split(/(<br>|<em>|<\/em>)/g);
  const root=document.createDocumentFragment();
  let parent=root;
  for(const token of tokens){
    if(token==='<br>')parent.append(document.createElement('br'));
    else if(token==='<em>'){const em=document.createElement('em');parent.append(em);parent=em;}
    else if(token==='</em>')parent=root;
    else parent.append(document.createTextNode(token));
  }
  node.replaceChildren(root);
}
function translate(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.title=lang==='zh'?'PENG Nexus — 让国际采购更清晰':'PENG Nexus — Better sourcing begins with knowledge';
  for(const node of document.querySelectorAll('[data-i18n]')){
    const value=node.getAttribute('data-'+lang);
    if(value!==null)setRich(node,value);
  }
  search.placeholder=lang==='zh'?'搜索行业或产品…':'Search industries or products...';
  search.setAttribute('aria-label',lang==='zh'?'搜索行业或产品':'Search industries or products');
  for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.lang===lang));
  if(dialog.open){const active=dialog.dataset.active;if(active)fillDetail(active);}
  render();
}
function render(){
  const term=search.value.trim().toLocaleLowerCase();
  let shown=0;
  for(const card of cards){
    const visible=(sector==='all'||card.dataset.sector===sector)&&card.dataset.search.includes(term);
    card.hidden=!visible;
    if(visible)shown++;
  }
  empty.hidden=shown>0;
  count.textContent=lang==='zh'?'显示 '+shown+' 个行业':shown+' '+(shown===1?'industry':'industries');
  for(const button of filters)button.setAttribute('aria-pressed',String(button.dataset.filter===sector));
}
function fillDetail(key){
  const data=details[key]?.[lang];if(!data)return;
  dialog.dataset.active=key;
  document.getElementById('detail-title').textContent=data[0];
  document.getElementById('detail-intro').textContent=data[1];
  const ul=document.getElementById('detail-checks');
  ul.replaceChildren(...data[2].map(item=>{const li=document.createElement('li');li.textContent=item;return li;}));
  dialog.querySelector('.dialog-close').setAttribute('aria-label',lang==='zh'?'关闭':'Close');
}
for(const button of buttons)button.addEventListener('click',()=>{lang=button.dataset.lang;translate();});
for(const button of filters)button.addEventListener('click',()=>{sector=button.dataset.filter;render();});
for(const button of document.querySelectorAll('[data-detail]'))button.addEventListener('click',()=>{
  const key=button.dataset.detail;
  if(!details[key])return;
  fillDetail(key);
  if(typeof dialog.showModal==='function')dialog.showModal();
  else dialog.setAttribute('open','');
});
search.addEventListener('input',render);
translate();
})();
