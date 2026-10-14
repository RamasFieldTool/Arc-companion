// Read-only reference shared with material search. No inventory items or player-state writes.
(()=>{'use strict';
const shared=window.RFTAmplified;if(!shared)return;
let root,query='';
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node};
function render(){
 const anchor=document.getElementById('outpostFurnitureDesigns');if(!anchor)return;
 if(!root){root=el('section');root.id='outpostAmplifiedWeapons';root.className='outpost-amplified';anchor.before(root)}
 const locale=shared.language(),data=shared.data,t=shared.labels[locale];
 if(root.dataset.renderedLanguage===locale&&root.dataset.dataReady===String(Boolean(data))&&root.dataset.error===String(shared.error))return;
 root.dataset.renderedLanguage=locale;root.dataset.dataReady=String(Boolean(data));root.dataset.error=String(shared.error);root.replaceChildren();
 root.append(el('h3',t.title),el('p',t.note),el('p',t.evidence));
 if(!data){root.append(el('p',shared.error?t.error:t.loading));return}
 const integration=data.testIntegration,nodeById=new Map(integration.nodes.map(n=>[n.id,n])),configById=new Map(integration.configurations.map(c=>[c.id,c]));
 const sourceLink=url=>{const a=el('a',t.source);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a};
 const materialList=materials=>{const list=el('ul');for(const m of materials)list.append(el('li',m.quantity+'× '+shared.materialName(m.itemId,locale)));return list};
 const configLabel=id=>{const c=configById.get(id);return c?.nodeIds.length?c.nodeIds.map(n=>nodeById.get(n).name).join(' + '):t.base};
 const search=el('input');search.type='search';search.placeholder=t.search;search.setAttribute('aria-label',t.search);search.value=query;root.append(search);
 const list=el('div');list.className='amplified-families';root.append(list);
 function draw(){
  list.replaceChildren();let count=0;
  for(const family of data.families){
   const name=shared.familyName(family.id),nodes=integration.nodes.filter(n=>n.familyId===family.id),unresolved=integration.unresolved.filter(n=>n.familyId===family.id);
   if(![name,...nodes.map(n=>n.name),...unresolved.map(n=>n.name)].some(n=>n.toLowerCase().includes(query.toLowerCase())))continue;
   count++;const panel=el('details');panel.className='amplified-family';panel.dataset.familyId=family.id;panel.append(el('summary',name+' · MK '+family.moduleMark));panel.append(el('p',t.module+': MK '+family.moduleMark));panel.append(el('h4',t.options));
   for(const n of nodes){
    const detail=el('details');detail.className='amplified-node';detail.dataset.nodeId=n.id;detail.append(el('summary',n.name));detail.append(el('p',t.evidence),el('h5',t.materials),materialList(n.materials));
    detail.append(el('h5',t.research));
    if(!n.researchIds.length)detail.append(el('p',t.unlisted));
    for(const id of n.researchIds){
     const r=integration.research.find(r=>r.id===id);if(!r)continue;
     detail.append(el('p',r.name+' · '+t.station+' '+r.stationLevel),el('h5',t.step1),el('p',r.tasks[locale]||r.tasks.en),el('small',t.tasksNote),el('h5',t.step2),el('p',r.points.toLocaleString(locale)+' '+t.points),materialList(r.materials),sourceLink(r.source));
    }
    const paths=integration.connections.filter(e=>e.nodeId===n.id);
    detail.append(el('h5',t.paths));const pathList=el('ul');
    for(const path of paths)pathList.append(el('li',configLabel(path.from)+' → '+configLabel(path.to)));
    detail.append(pathList,sourceLink(n.source));panel.append(detail);
   }
   for(const n of unresolved){const pending=el('p',n.name+' · '+t.unknown);pending.className='amplified-unresolved';panel.append(pending)}
   list.append(panel);
  }
  if(!count)list.append(el('p',t.none));
 }
 search.addEventListener('input',()=>{query=search.value;draw()});draw();
}
const style=el('style');style.textContent='#outpostAmplifiedWeapons{margin:14px 0;padding:12px;border:1px solid var(--ui-line,#666);border-radius:10px;min-width:0}#outpostAmplifiedWeapons input{box-sizing:border-box;width:100%;min-height:44px;padding:8px;background:var(--ui-panel,#222);color:var(--ui-text,#fff);border:1px solid var(--ui-line,#666)}#outpostAmplifiedWeapons details{min-width:0;padding:6px 0;border-bottom:1px solid var(--ui-line,#666)}#outpostAmplifiedWeapons summary{cursor:pointer;font-weight:600;min-height:44px;display:flex;align-items:center;overflow-wrap:anywhere}#outpostAmplifiedWeapons .amplified-node{margin:6px 0 6px 8px;padding:8px;border:1px solid var(--ui-line,#666);border-radius:8px}#outpostAmplifiedWeapons p,#outpostAmplifiedWeapons li,#outpostAmplifiedWeapons small{overflow-wrap:anywhere}#outpostAmplifiedWeapons h5{font-size:inherit;margin:12px 0 6px}#outpostAmplifiedWeapons ul{padding-left:22px}#outpostAmplifiedWeapons a{display:inline-block;min-height:44px;padding:10px 4px;box-sizing:border-box;color:var(--ui-text,#fff);text-decoration:underline}.amplified-search-note summary{cursor:pointer;min-height:44px;overflow-wrap:anywhere}.amplified-search-note li{overflow-wrap:anywhere}';document.head.append(style);
window.addEventListener('arc-language-change',render);window.addEventListener('rft-amplified-data-ready',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});render();
})();
