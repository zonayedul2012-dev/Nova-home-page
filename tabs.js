const tabStrip=document.getElementById('tabStrip');
const newTab=document.getElementById('newTab');
const homeUrl='./';
let tabId=1;
let tabsState=[];

function saveTabs(){
  tabsState=[...tabStrip.querySelectorAll('.tab')].map(t=>({id:t.dataset.id||'',title:t.querySelector('.tab-label')?.textContent||'New Tab',url:t.dataset.url||homeUrl}));
  localStorage.setItem('nova-tabs',JSON.stringify(tabsState));
}

function getSiteName(url){
  try{
    const host=new URL(url).hostname.replace(/^www\./,'');
    if(host==='dailymotion.com') return 'Dailymotion';
    if(host==='youtube.com') return 'YouTube';
    if(host==='google.com') return 'Google';
    if(host==='github.com') return 'GitHub';
    if(host==='gmail.com' || host==='mail.google.com') return 'Gmail';
    return host.split('.')[0]||'Website';
  }catch{return 'Website'}
}

function activateTab(tab){
  tabStrip.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  const url=tab.dataset.url||homeUrl;
  saveTabs();
  if(url===homeUrl){
    document.getElementById('searchInput')?.focus();
  }else{
    window.open(url,'_blank');
  }
}

function returnToNova(){
  if(location.pathname!==new URL(homeUrl,location.href).pathname) location.href=homeUrl;
  else document.getElementById('searchInput')?.focus();
}

function addTab(){
  const current=tabStrip.querySelector('.tab.active');
  if(current) current.classList.remove('active');
  const tab=document.createElement('button');
  tab.className='tab active';
  tab.dataset.url=homeUrl;
  tab.dataset.id=String(++tabId);
  tab.innerHTML='<span class="tab-dot nova-dot"></span><span class="tab-label">New Tab</span><span class="tab-close">×</span>';
  tabStrip.insertBefore(tab,newTab);
  bindTab(tab);
  saveTabs();
  returnToNova();
  setTimeout(()=>document.getElementById('searchInput')?.focus(),80);
}

function bindTab(tab){
  tab.addEventListener('click',e=>{
    if(e.target.closest('.tab-close')) return;
    activateTab(tab);
  });
  tab.querySelector('.tab-close').addEventListener('click',e=>{
    e.stopPropagation();
    const tabs=tabStrip.querySelectorAll('.tab');
    if(tabs.length<=1) return;
    const wasActive=tab.classList.contains('active');
    const next=tab.nextElementSibling?.classList.contains('tab')?tab.nextElementSibling:tab.previousElementSibling;
    tab.remove();
    if(wasActive&&next) activateTab(next);
    saveTabs();
  });
}

function restoreTabs(){
  try{
    const saved=JSON.parse(localStorage.getItem('nova-tabs')||'[]');
    if(!Array.isArray(saved)||!saved.length) return;
    const first=tabStrip.querySelector('.tab');
    if(first) first.remove();
    saved.forEach((item,index)=>{
      const tab=document.createElement('button');
      tab.className='tab'+(index===0?' active':'');
      tab.dataset.url=item.url||homeUrl;
      tab.dataset.id=item.id||String(++tabId);
      tab.innerHTML='<span class="tab-dot nova-dot"></span><span class="tab-label"></span><span class="tab-close">×</span>';
      tab.querySelector('.tab-label').textContent=item.title||'New Tab';
      tabStrip.insertBefore(tab,newTab);
      bindTab(tab);
      tabId=Math.max(tabId,Number(tab.dataset.id)||0);
    });
  }catch{localStorage.removeItem('nova-tabs')}
}

tabStrip.querySelectorAll('.tab').forEach(bindTab);
newTab.addEventListener('click',addTab);
restoreTabs();

document.getElementById('browserBack')?.addEventListener('click',()=>history.back());
document.getElementById('browserForward')?.addEventListener('click',()=>history.forward());
document.getElementById('browserRefresh')?.addEventListener('click',()=>location.reload());
window.addEventListener('beforeunload',saveTabs);