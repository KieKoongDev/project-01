import {CARDS,DATA,combine,eligible,knowledge,nextHint,type Card,type Context,type Result} from './engine.ts';
export type ResearchPlan={ingredients:[string,string];names:[string,string];result:Result;goal:string};
export const HELPERS=[{id:'camp_tinkerer',name:'Camp Tinkerer',era:'stone',requires:['firecraft','toolmaking'],description:'An unnamed prehistoric experimenter. Completes one valid experiment every 12 seconds, spending 1 research credit. Pauses while your workbench is occupied.'}];
export const MILESTONES=[{id:'first_flame',card:'fire',name:'First flame',bonus:20},{id:'first_shelter',card:'shelter',name:'A place to stay',bonus:25},{id:'first_vessel',card:'pottery',name:'Beyond the hand',bonus:30}];
export function researchPlan(cards:Card[],ctx:Context,goal='any'):ResearchPlan|null{
 const owned=new Map(cards.map(c=>[c.id,c]));
 function walk(id:string,seen=new Set<string>()):[Card,Card]|null{
  if(owned.has(id)||seen.has(id))return null;const card=CARDS.get(id);if(!card||!eligible(card,ctx))return null;seen=new Set([...seen,id]);
  for(const r of DATA.recipes.filter(r=>r.output===id)){
   const a=owned.get(r.inputs[0]),b=owned.get(r.inputs[1]);
   if(a&&b&&combine(a,b,ctx))return [a,b];
   for(const k of r.requires){if(!knowledge(ctx.known).has(k))for(const dep of DATA.innovations.find(i=>i.id===k)?.discover??[]){const next=walk(dep,seen);if(next)return next;}}
   if(ctx.event==='cold'&&['plant','garden','farm'].includes(id)&&!ctx.known.includes('fire')){const next=walk('fire',seen);if(next)return next;}
   for(const input of r.inputs){const next=walk(input,seen);if(next)return next;}
  }return null;
 }
 let pair:[Card,Card]|null=null;
 if(goal==='any')pair=nextHint(cards,ctx);else{const innovation=DATA.innovations.find(i=>i.id===goal);for(const target of innovation?.discover??[]){pair=walk(target);if(pair)break;}}
 if(!pair)return null;const result=combine(...pair,ctx);if(!result||owned.has(result.card.id))return null;
 return {ingredients:[pair[0].id,pair[1].id],names:[pair[0].name,pair[1].name],result,goal};
}
/** O(n) partner scan for a selected card; never enumerate all n² pairs. */
export function newPartners(selected:Card|null,cards:Card[],ctx:Context):Set<string>{
 const ids=new Set<string>();if(!selected)return ids;const known=new Set(cards.map(c=>c.id));
 for(const candidate of cards){const result=combine(selected,candidate,ctx);if(result&&!known.has(result.card.id))ids.add(candidate.id);}return ids;
}
