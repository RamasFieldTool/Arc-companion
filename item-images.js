// Test-branch integration only. Image publication permission remains unresolved.
(()=>{
  const failed=new Set();
  function source(item){
    if(!item||typeof item.id!=='string'||!/^[a-z0-9_-]+$/i.test(item.id)||typeof item.imageFilename!=='string')return '';
    try{
      const url=new URL(item.imageFilename);
      if(url.protocol!=='https:'||url.hostname!=='cdn.arctracker.io'||url.port||url.username||url.password||url.search||url.hash)return '';
      // Catalog variants may share artwork; trust the explicit URL, never guess it from ID.
      if(!/^\/items\/(?:v2\/)?[a-z0-9_-]+\.(?:png|webp|jpg)$/i.test(url.pathname))return '';
      return failed.has(url.href)?'':url.href;
    }catch{return ''}
  }
  function thumbnail(item){
    const url=source(item);
    if(!url)return '';
    return `<img class="item-thumbnail" src="${url}" alt="" width="48" height="48" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  }
  document.addEventListener('error',event=>{
    const image=event.target;
    if(!(image instanceof HTMLImageElement)||!image.classList.contains('item-thumbnail'))return;
    failed.add(image.src);image.remove();
  },true);
  window.RFTItemImages={source,thumbnail};
})();
