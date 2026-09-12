import type {Card} from './engine.ts';
export const PAGE_SIZE=48;
export const indexCards=(cards:Card[])=>cards.map(card=>({card,text:(card.name+' '+card.tags.join(' ')).toLowerCase()}));
export type FilterOptions={tag?:string;era?:string;tier?:string;sort?:string;favorites?:string[];partners?:Set<string>};
export function filterCards(index:ReturnType<typeof indexCards>,query:string,filter:string,options:FilterOptions={}){
 const q=query.trim().toLowerCase(),favorites=new Set(options.favorites??[]);
 const matches=index.filter(({card:c,text})=>(filter==='all'||filter==='base'&&c.depth===0||filter==='new'&&c.depth>0||filter==='inventions'&&!!c.mods||filter==='favorites'&&favorites.has(c.id)||filter==='partners'&&options.partners?.has(c.id))&&text.includes(q)&&(!options.tag||options.tag==='all'||c.tags.includes(options.tag))&&(!options.era||options.era==='all'||c.era===options.era)&&(!options.tier||options.tier==='all'||String(c.depth)===options.tier)).map(x=>x.card);
 if(options.sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
 if(options.sort==='points')matches.sort((a,b)=>(b.depth*10+(b.mods?5:0))-(a.depth*10+(a.mods?5:0))||a.name.localeCompare(b.name));
 if(options.sort==='recent')matches.reverse();return matches;
}
export function pageCards(cards:Card[],page:number){return cards.slice(Math.max(0,page)*PAGE_SIZE,(Math.max(0,page)+1)*PAGE_SIZE);}
