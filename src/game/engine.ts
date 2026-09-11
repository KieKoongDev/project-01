import catalog from '../data/catalog.json' with {type:'json'};
export type Era='stone'|'bronze'|'industrial';
export type Card={id:string;name:string;icon:string;tone:string;tags:string[];depth:number;era:Era;artKey:string;base?:string;mods?:string[]};
export type Context={era:Era;known:string[];event:string};
export type Result={card:Card;why:string;kind:'recipe'|'emergent'};
export const DATA=catalog;
export const CARDS=new Map(catalog.cards.map(c=>[c.id,c as Card]));
export const BASE=catalog.cards.filter(c=>c.depth===0&&c.era==='stone') as Card[];
export const ERA_RANK:Record<Era,number>={stone:0,bronze:1,industrial:2};
const pairKey=(a:string,b:string)=>[a,b].sort().join('|');
export const EXACT=new Map(catalog.recipes.map(r=>[pairKey(...r.inputs as [string,string]),r]));
export const knowledge=(known:string[])=>new Set(catalog.innovations.filter(i=>i.discover.every(id=>known.includes(id))).map(i=>i.id));
export function eligible(c:Card,ctx:Context){return ERA_RANK[c.era]<=ERA_RANK[ctx.era]&&catalog.eras.some(e=>e.id===c.era&&e.enabled);}
export const MODIFIERS=[
 {id:'aquatic',name:'Aquatic',tag:'water',add:['water'],era:'stone',requires:[],why:'Water adapts this creation for a wet environment.'},
 {id:'living',name:'Living',tag:'life',add:['life','organic'],era:'stone',requires:['cultivation'],why:'Living material gives the creation a biological property.'},
 {id:'thermal',name:'Thermal',tag:'heat',add:['heat'],era:'stone',requires:['firecraft'],why:'Controlled heat gives this creation a thermal use.'},
 {id:'ventilated',name:'Ventilated',tag:'air',add:['air'],era:'stone',requires:[],why:'Airflow gives this creation a new way to breathe or dry.'},
 {id:'stonebound',name:'Stonebound',tag:'mineral',add:['mineral'],era:'stone',requires:['toolmaking'],why:'Shaped stone reinforces this invention.'},
 {id:'framed',name:'Wood-framed',tag:'wood',add:['wood'],era:'stone',requires:['toolmaking'],why:'A wooden frame supports the invention.'},
 {id:'woven',name:'Woven',tag:'organic',add:['organic'],era:'stone',requires:['toolmaking'],why:'Flexible organic fibers become a woven layer.'},
 {id:'reinforced',name:'Metal-clad',tag:'metal',add:['metal'],era:'bronze',requires:['metallurgy'],why:'Metal adds a stronger outer structure.'},
 {id:'intelligent',name:'Inscribed',tag:'knowledge',add:['knowledge'],era:'bronze',requires:[],why:'Recorded knowledge gives this invention a new purpose.'}
];
export function reaction(a:Card,b:Card,ctx:Context):{result:Result|null;reason:string}{
 if(!eligible(a,ctx)||!eligible(b,ctx))return {result:null,reason:'This material belongs to an era not yet unlocked.'};
 const know=knowledge(ctx.known);const exact=EXACT.get(pairKey(a.id,b.id));
 if(exact){const card=CARDS.get(exact.output)!;
 if(!eligible(card,ctx))return {result:null,reason:`This idea needs the ${card.era==='bronze'?'Bronze':'Industrial'} Age. Your current knowledge cannot create it yet.`};
 const missing=exact.requires.filter(id=>!know.has(id));if(missing.length)return {result:null,reason:'First unlock '+missing.map(id=>catalog.innovations.find(i=>i.id===id)?.name??id).join(' and ')+'.'};
 if(ctx.event==='cold'&&['plant','garden','farm'].includes(card.id)&&!know.has('firecraft'))return {result:null,reason:'Cold snap: establish fire before growing plants.'};
 return {result:{card:{...card},why:exact.why,kind:'recipe'},reason:''};}
 const candidates=[[a,b],[b,a]].sort((x,y)=>y[0].depth-x[0].depth||x[0].id.localeCompare(y[0].id));
 for(const [target,source] of candidates){if(target.depth<1)continue;const mods=target.mods??[];if(mods.length>=3)continue;
 for(const m of MODIFIERS){if(ERA_RANK[m.era as Era]>ERA_RANK[ctx.era]||m.requires.some(id=>!know.has(id))||!source.tags.includes(m.tag)||mods.includes(m.id)||target.tags.includes(m.tag))continue;
 const next=[...mods,m.id].sort();const root=target.base??target.id;const original=CARDS.get(root)!;
 const era=ERA_RANK[m.era as Era]>ERA_RANK[target.era]?m.era as Era:target.era;
 return {result:{card:{...target,id:root+'~'+next.join('.'),base:root,mods:next,name:next.map(id=>MODIFIERS.find(x=>x.id===id)!.name).join(' ')+' '+original.name,tags:[...new Set([...target.tags,...m.add])],depth:Math.min(5,original.depth+next.length),era,artKey:original.artKey},why:m.why+' An imaginative possibility, not a scientific claim.',kind:'emergent'},reason:''};}}
 return {result:null,reason:'No connection yet. Try a different property or unlock another innovation.'};
}
export const combine=(a:Card,b:Card,ctx:Context)=>reaction(a,b,ctx).result;
export function nextHint(cards:Card[],ctx:Context):[Card,Card]|null{
 const owned=new Map(cards.map(c=>[c.id,c]));
 for(const r of catalog.recipes){const a=owned.get(r.inputs[0]),b=owned.get(r.inputs[1]);if(a&&b){const out=combine(a,b,ctx);if(out&&!owned.has(out.card.id))return [a,b];}}
 // One representative per property, avoiding an O(n²) pair scan for large collections.
 const sources=MODIFIERS.map(m=>cards.find(c=>c.tags.includes(m.tag))).filter(Boolean) as Card[];
 for(const a of cards)for(const b of sources){const out=combine(a,b,ctx);if(out&&!owned.has(out.card.id))return [a,b];}return null;
}
export function advanceRequirements(known:string[]){const k=knowledge(known);return [{label:'Master fire',met:k.has('firecraft')},{label:'Make a tool',met:k.has('toolmaking')},{label:'Create pottery',met:k.has('pottery')},{label:'Discover 12 creations',met:known.filter(id=>!BASE.some(c=>c.id===id)).length>=12}];}
export function points(result:Result,eventId:string){const e=catalog.events.find(e=>e.id===eventId);return result.card.depth*10+(result.kind==='emergent'?5:0)+(e&&e.bonusTags.some(tag=>result.card.tags.includes(tag))?e.bonus:0);}
export function restoreCard(raw:unknown):Card|null{if(!raw||typeof raw!=='object')return null;const r=raw as Card;const root=CARDS.get(r.base??r.id);if(!root)return null;if(!r.mods?.length)return {...root};const mods=[...new Set(r.mods)].sort();if(mods.length>3||mods.some(id=>!MODIFIERS.some(m=>m.id===id)))return null;const definitions=mods.map(id=>MODIFIERS.find(m=>m.id===id)!);return {...root,id:root.id+'~'+mods.join('.'),base:root.id,mods,name:definitions.map(m=>m.name).join(' ')+' '+root.name,tags:[...new Set([...root.tags,...definitions.flatMap(m=>m.add)])],depth:Math.min(5,root.depth+mods.length),era:definitions.some(m=>m.era==='bronze')?'bronze':root.era};}
