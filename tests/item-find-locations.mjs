import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../item-find-locations.js',import.meta.url),'utf8');
const must=[
  "Mögliche Fundorte",
  "Possible find locations",
  "Lieux possibles",
  "Posibles lugares",
  "Possibili luoghi",
  "magnetic_accelerator",
  "arc_matriarch",
  "arc_the_queen",
  "foundIn",
  "Community-Daten zu möglichen Fundquellen. Kein garantierter Fund.",
  "https://github.com/RaidTheory/arcraiders-data"
];
for(const value of must){if(!source.includes(value))throw new Error(`Missing item-find-locations contract: ${value}`)}
if(!source.includes("Array.isArray(v)?v:typeof v==='string'?v.split(','):[]"))throw new Error('foundIn string/array normalization missing');
if(!source.includes("const opened=new Set()"))throw new Error('Open-state preservation missing');
if(!source.includes("const esc="))throw new Error('Escaping guard missing');
new vm.Script(source,{filename:'item-find-locations.js'});
console.log('item-find-locations static regression: OK');
