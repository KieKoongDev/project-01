import {BUILD,TILES,RESOURCES,act,assigned,canPay,foodNeed,goals,has,housing,missing,type Building,type Recipe,type Village} from './model.ts';
export type Guidance={title:string;detail:string;label:string;art:Building|'pottery'|'food'|'wood';tab:string;recipe?:Recipe;building?:Building;celebrate?:boolean};
export function nextGoal(v:Village):Guidance{
 const build=(b:Building,detail:string):Guidance=>{const d=BUILD[b];return {title:`สร้าง${d.name}`,detail,label:d.recipe&&!v.known.includes(d.recipe)?'ค้นพบสูตร':canPay(v,d.cost)?'เลือกจุดสร้าง':'จัดหาวัสดุ',art:b,tab:d.recipe&&!v.known.includes(d.recipe)?'discover':canPay(v,d.cost)?'build':'people',recipe:d.recipe&&!v.known.includes(d.recipe)?d.recipe:undefined,building:canPay(v,d.cost)?b:undefined};};
 if(dayForecast(v).shortage)return {title:'ช่วยกันหาอาหารก่อน',detail:'อาหารวันถัดไปไม่พอ ลองย้ายคนมาหาอาหาร',label:'แบ่งงาน',art:'food',tab:'people'};
 if(!has(v,'fire'))return build('fire','จุดเริ่มต้นของบ้าน และความรู้สำหรับเตาเผา');
 if(housing(v)<5)return build('shelter','สร้างบ้านให้เพื่อนใหม่ · ต้องการที่พักรวม 5 คน');
 if(v.people<5)return {title:'ชวนเพื่อนมาอยู่ด้วยกัน',detail:'อาหาร 4 ต่อคน · เพื่อนใหม่ช่วยเก็บทรัพยากรได้',label:'ต้อนรับเพื่อน',art:'shelter',tab:'people'};
 if(assigned(v)<v.people)return {title:'เพื่อนพร้อมช่วยงาน',detail:`มีคนว่าง ${v.people-assigned(v)} คน เลือกงานให้เขา`,label:'แบ่งงาน',art:'lumber',tab:'people'};
 if(v.stock.food<20)return {title:'เตรียมมื้อใหญ่ของหมู่บ้าน',detail:`อาหาร ${v.stock.food}/20 · คนหาอาหารช่วยสะสมได้`,label:'จัดคนหาอาหาร',art:'food',tab:'people'};
 if(v.stock.wood<8)return {title:'เตรียมไม้สำหรับงานเลี้ยง',detail:`ไม้ ${v.stock.wood}/8 · เก็บไม้ก่อนชวนทุกคนมา`,label:'จัดคนตัดไม้',art:'wood',tab:'people'};
 if(!v.won&&goals(v).every(g=>g.met))return {title:'บ้านของเราพร้อมแล้ว!',detail:'ทุกคนมีที่พักและเสบียง มาฉลองบทแรกกัน',label:'จัดงานเลี้ยง',art:'fire',tab:'build',celebrate:true};
 if(!has(v,'kiln'))return build('kiln','บทต่อไป · ใช้ความร้อนสร้างภาชนะให้หมู่บ้าน');
 if(!v.pots)return {title:'จากดินสู่ภาชนะใบแรก',detail:'ติดตั้งแล้วตักน้ำได้เพิ่ม และเปิดทางสร้างคลัง',label:v.known.includes('pottery')?'ไปที่เตาเผา':'เรียนรู้ภาชนะ',art:'pottery',tab:'discover',recipe:v.known.includes('pottery')?undefined:'pottery'};
 if(!has(v,'store'))return build('store','ใช้ภาชนะเก็บเสบียง ลดอาหารที่ใช้ทุกวัน');
 return {title:'เติมความเป็นคุณให้หมู่บ้าน',detail:'ทำคำขอเพื่อนบ้านเพื่อเปิดม้านั่งและโคมไฟ',label:'ดูคำขอ',art:'shelter',tab:'requests'};
}
export type WorldHint={tile:number;kind:'people'|'water'|'craft'|'welcome';label:string;priority:number};
export function worldHints(v:Village):WorldHint[]{
 const hints:WorldHint[]=[];let welcomed=false;
 v.plots.forEach((b,tile)=>{
 if(b==='farm'){
 const rank=v.plots.slice(0,tile).filter(p=>p==='farm').length;
 if(rank>=v.jobs.farm)hints.push({tile,kind:'people',label:'แปลงนี้ต้องการคนทำไร่',priority:0});
 else if(rank>=Math.floor((v.stock.water+v.jobs.water*(3+Number(v.pots)))/2))hints.push({tile,kind:'water',label:'แปลงนี้ต้องการน้ำ',priority:0});
 }else if(b==='lumber'&&!v.jobs.wood)hints.push({tile,kind:'people',label:'ค่ายนี้ต้องการคนตัดไม้',priority:1});
 else if(b==='kiln'&&!v.pots)hints.push({tile,kind:'craft',label:v.known.includes('pottery')?'ทำภาชนะที่เตาเผา':'ค้นพบสูตรภาชนะ',priority:2});
 else if(b==='shelter'&&!welcomed&&v.people<5&&housing(v)>v.people&&canPay(v,{food:4})){welcomed=true;hints.push({tile,kind:'welcome',label:'มีบ้านว่าง ต้อนรับเพื่อนใหม่',priority:3});}
 });
 return hints.sort((a,b)=>a.priority-b.priority||a.tile-b.tile).slice(0,3);
}
export function buildReason(v:Village,b:Building):string|null{
 const d=BUILD[b];
 if(d.recipe&&!v.known.includes(d.recipe))return 'ค้นพบสูตรก่อน';
 if(b==='kiln'&&!has(v,'fire'))return 'ต้องมีกองไฟ';
 if(b==='store'&&!v.pots)return 'ติดตั้งภาชนะก่อน';
 if(!v.plots.some((b,i)=>!b&&(!d.terrain||d.terrain===TILES[i])))return 'ไม่มีพื้นที่ที่เหมาะสม';
 return canPay(v,d.cost)?null:'ขาด '+missing(v,d.cost);
}
// Use the same pure rule engine as the actual day; never maintain a second economy.
export function dayForecast(v:Village){const after=act(v,{type:'day'});return {delta:RESOURCES.map(resource=>({resource,amount:after.stock[resource]-v.stock[resource]})),foodNeed:foodNeed(v),shortage:v.stock.food+v.jobs.forage*3+Math.min(v.jobs.farm,Math.floor((v.stock.water+v.jobs.water*(3+Number(v.pots)))/2))*6<foodNeed(v)};}
