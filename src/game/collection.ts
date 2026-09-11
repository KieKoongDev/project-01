import type {Card} from './engine.ts';
export const PAGE_SIZE=48;
export const indexCards=(cards:Card[])=>cards.map(card=>({card,text:(card.name+' '+card.tags.join(' ')).toLowerCase()}));
export function filterCards(index:ReturnType<typeof indexCards>,query:string,filter:string){const q=query.trim().toLowerCase();return index.filter(({card:c,text})=>(filter==='all'||filter==='base'&&c.depth===0||filter==='new'&&c.depth>0)&&text.includes(q)).map(x=>x.card);}
export function pageCards(cards:Card[],page:number){return cards.slice(Math.max(0,page)*PAGE_SIZE,(Math.max(0,page)+1)*PAGE_SIZE);}
