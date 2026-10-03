// Integrates the Italian overlay into the existing language menu.
(()=>{
  const UI_KEY='arcUiLanguage';
  const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
  function syncMenu(){
    const menu=document.getElementById('arcLanguageMenu'),main=document.getElementById('arcLanguageButton'),legacy=document.getElementById('itBtn');
    if(!menu||!main||!legacy)return false;
    const sep=legacy.previousElementSibling;if(sep&&sep.tagName==='SPAN'&&sep.textContent==='/')sep.remove();legacy.style.display='none';
    let option=menu.querySelector('[data-arc-language="it"]');
    if(!option){option=document.createElement('button');option.type='button';option.dataset.arcLanguage='it';option.setAttribute('role','menuitemradio');option.textContent='Italiano';option.addEventListener('click',()=>{legacy.click();menu.hidden=true;main.setAttribute('aria-expanded','false');setTimeout(syncMenu,0)});menu.append(option)}
    const italian=safeGet(UI_KEY)==='it';
    if(italian){menu.querySelectorAll('[data-arc-language]').forEach(node=>{const selected=node.dataset.arcLanguage==='it';node.classList.toggle('is-selected',selected);node.setAttribute('aria-checked',String(selected))});main.innerHTML='<span aria-hidden="true">🌐</span> IT';main.setAttribute('aria-label','Cambia lingua');main.title='Cambia lingua'}else{option.classList.remove('is-selected');option.setAttribute('aria-checked','false')}
    return true;
  }
  function install(){if(!syncMenu()){setTimeout(install,40);return}document.addEventListener('click',e=>{if(e.target.closest('#arcLanguageMenu [data-arc-language]:not([data-arc-language="it"])'))setTimeout(syncMenu,0)});window.addEventListener('arc-language-change',()=>setTimeout(syncMenu,0));new MutationObserver(syncMenu).observe(document.querySelector('.lang-switch'),{childList:true,subtree:true})}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install,{once:true}):install();
})();
