const tabStrip=document.getElementById('tabStrip');
const newTab=document.getElementById('newTab');
const homeUrl='./';
let tabId=1;

function saveTabs(){
  const tabs=[...tabStrip.querySelectorAll('.tab')].map(t=>({title:t.querySelector('.tab-label')?.textContent||'New Tab',url:t.dataset.url||homeUrl}));
  localStorage.setItem('nova-tabs',JSON.stringify(tabs));
}

function activateTab(tab){
  tabStrip.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  const url=tab.dataset.url||homeUrl;
  if(url===homeUrl){
    if(location.pathname!==new URL(homeUrl,location.href).pathname) location.href=homeUrl;
    else document.getElementById('searchInput')?.focus();
  }else{
    window.open(url,'_blank','noopener');
  }
  saveTabs();
}

function addTab(){
  const tab=document.createElement('button');
  tab.className='tab active';
  tab.dataset.url=homeUrl;
  tab.dataset.id=String(++tabId);
  tab.innerHTML='<span class="tab-dot nova-dot"></span><span class="tab-label">New Tab</span><span class="tab-close">×</span>';
  tabStrip.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  tabStrip.insertBefore(tab,newTab);
  bindTab(tab);
  saveTabs();
  setTimeout(()=>document.getElementById('searchInput')?.focus(),50);
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

tabStrip.querySelectorAll('.tab').forEach(bindTab);
newTab.addEventListener('click',addTab);

document.getElementById('browserBack')?.addEventListener('click',()=>history.back());
document.getElementById('browserForward')?.addEventListener('click',()=>history.forward());
document.getElementById('browserRefresh')?.addEventListener('click',()=>location.reload());

window.addEventListener('beforeunload',saveTabs);