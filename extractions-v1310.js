// Deprecated Spaceport V1 extraction prototype.
// Intentionally disabled on test/spaceport-extractions-v1.
// Spaceport V2 is a full rebuild and must not reuse V1 marker coordinates or rendering.
(()=>{
  const oldLayer=document.getElementById('extractionMarkers');
  if(oldLayer){oldLayer.innerHTML='';oldLayer.hidden=true}
  const oldButton=document.getElementById('layerExtractions');
  if(oldButton)oldButton.remove();
})();
