import {eligible,type Card,type Era} from '../game/engine.ts';
export type CityFeature='fire'|'shelter'|'nature'|'farming'|'pottery'|'boats'|'metallurgy';
export type CityModel={xp:number;discoveryCount:number;stage:number;stageName:string;era:Era;event:string;features:Record<CityFeature,boolean>;trees:number;homes:number;fields:number;people:number;next:{name:string;xp:number;progress:number;requirements:{label:string;met:boolean}[]}|null;signature:string};
const STAGES=[
 {name:'Untouched valley',xp:0},
 {name:'First camp',xp:20},
 {name:'Small settlement',xp:120},
 {name:'Growing village',xp:300},
 {name:'Bronze workshop town',xp:700}
];
export const FEATURE_INFO:Record<CityFeature,{name:string;source:string;description:string}>={
 fire:{name:'Fire',source:'Discover Fire',description:'A campfire lights the gathering place. Its glow and smoke bring the first camp to life.'},
 shelter:{name:'Homes',source:'Discover Shelter or House',description:'Shelters appear beside the path. More homes arrive as your settlement reaches a new stage.'},
 nature:{name:'Nature',source:'Discover Plant, Garden or Forest',description:'New plant discoveries add greenery. Trees sway gently in the breeze.'},
 farming:{name:'Fields',source:'Discover Garden or Farm',description:'Cultivated plots grow beside the river. Villagers begin working around the fields.'},
 pottery:{name:'Kiln',source:'Discover Pottery and Fire',description:'A small earthen kiln appears. Knowledge of heat has become a useful craft.'},
 boats:{name:'River travel',source:'Discover Raft',description:'A raft moves along the river, turning your transport discovery into a living part of the world.'},
 metallurgy:{name:'Workshop',source:'Reach Bronze Age and discover Furnace + Metal',description:'A metalworking workshop appears with warm light and rising smoke.'}
};
export function deriveCity(cards:Card[],era:Era,event='clear'):CityModel{
 const unique=[...new Map(cards.filter(c=>eligible(c,{era,event,known:[]})).map(c=>[c.id,c])).values()];
 const roots=new Set(unique.map(c=>c.base??c.id));const discoveries=unique.filter(c=>c.depth>0);
 // Independent from spendable/session VP: stable across refreshes and event switches.
 const xp=discoveries.reduce((sum,c)=>sum+c.depth*10+(c.mods?.length?5:0),0);
 const features:Record<CityFeature,boolean>={fire:roots.has('fire'),shelter:roots.has('shelter')||roots.has('house'),nature:['plant','garden','forest'].some(id=>roots.has(id)),farming:roots.has('garden')||roots.has('farm'),pottery:roots.has('pottery')&&roots.has('fire'),boats:roots.has('raft'),metallurgy:era==='bronze'&&roots.has('furnace')&&roots.has('metal')};
 const gates=[[],[{label:'Discover fire',met:features.fire}],[{label:'Build a shelter or house',met:features.shelter}],[{label:'Discover a garden or farm',met:features.farming}],[{label:'Reach the Bronze Age',met:era==='bronze'},{label:'Discover furnace and metal',met:features.metallurgy}]];
 let stage=0;for(let i=1;i<STAGES.length;i++){if(xp>=STAGES[i].xp&&gates[i].every(g=>g.met))stage=i;else break;}
 const nextStage=STAGES[stage+1];const next=nextStage?{name:nextStage.name,xp:nextStage.xp,progress:Math.min(1,Math.max(0,(xp-STAGES[stage].xp)/(nextStage.xp-STAGES[stage].xp))),requirements:[{label:`Reach ${nextStage.xp} civilization XP`,met:xp>=nextStage.xp},...gates[stage+1]]}:null;
 const natureCount=discoveries.filter(c=>c.tags.includes('life')||c.tags.includes('plant')).length;
 return {xp,discoveryCount:discoveries.length,stage,stageName:STAGES[stage].name,era,event,features,trees:features.nature?Math.min(8,2+natureCount):0,homes:features.shelter?Math.min(4,1+Math.max(0,stage-1)):0,fields:features.farming?Math.min(3,stage):0,people:features.fire?Math.min(7,1+stage+Number(features.shelter)):0,next,signature:JSON.stringify([stage,features,natureCount,event])};
}
