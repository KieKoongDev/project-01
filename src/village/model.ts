export const RESOURCES=['wood','stone','clay','food','water'] as const;
export type Resource=typeof RESOURCES[number];
export type Stock=Record<Resource,number>;
export type Cost=Partial<Stock>;
export const LABEL:Record<Resource,string>={wood:'ไม้',stone:'หิน',clay:'ดินเหนียว',food:'อาหาร',water:'น้ำ'};
export const RECIPES={
 fire:{name:'กองไฟ',pair:['wood','stone'],why:'หินจุดประกายกับไม้ เปิดความรู้เรื่องไฟ',cost:{wood:3,stone:2}},
 shelter:{name:'เพิงพัก',pair:['wood','wood'],why:'โครงไม้กลายเป็นที่พัก รองรับคนเพิ่ม 2 คน',cost:{wood:5,stone:1}},
 axe:{name:'ขวานหิน',pair:['stone','stone'],why:'ขึ้นรูปหินเป็นเครื่องมือ เพิ่มผลผลิตไม้จากคนตัดไม้',cost:{wood:2,stone:3}},
 kiln:{name:'เตาเผา',pair:['clay','stone'],why:'ดินและหินกักความร้อน ต้องมีกองไฟก่อนสร้าง',cost:{clay:5,stone:4,wood:2}},
 pottery:{name:'ภาชนะดินเผา',pair:['clay','wood'],why:'ดินเผาด้วยเชื้อเพลิง ต้องมีเตาเผาเพื่อผลิต',cost:{clay:2,wood:1}},
 farm:{name:'แปลงเพาะปลูก',pair:['food','water'],why:'อาหารบางส่วนเป็นพันธุ์พืช ปลูกใกล้น้ำเพื่อผลิตอาหาร',cost:{wood:3,clay:2}},
 store:{name:'คลังเสบียง',pair:['wood','clay'],why:'ความรู้ภาชนะช่วยเก็บอาหาร ต้องติดตั้งภาชนะก่อน',cost:{wood:5,stone:2}},
} satisfies Record<string,{name:string;pair:string[];why:string;cost:Cost}>;
export type Recipe=keyof typeof RECIPES;
// A pair may have multiple outcomes; successive experiments reveal only unknown knowledge.
export const BUILDINGS=['fire','shelter','kiln','farm','store','lumber'] as const;
export type Building=typeof BUILDINGS[number];
export const BUILD:Record<Building,{name:string;cost:Cost;recipe:Recipe|null;effect:string;terrain?:string}>={
 fire:{...RECIPES.fire,recipe:'fire',effect:'ให้ความอบอุ่นและเปิดทางสร้างเตาเผา'},
 shelter:{...RECIPES.shelter,recipe:'shelter',effect:'เพิ่มที่พัก 2 คน'},
 kiln:{...RECIPES.kiln,recipe:'kiln',effect:'ผลิตภาชนะเพื่อเพิ่มน้ำและเก็บเสบียง'},
 farm:{...RECIPES.farm,recipe:'farm',terrain:'river',effect:'คนทำไร่ 1 คน: น้ำ 2 → อาหาร 6 ต่อวัน'},
 store:{...RECIPES.store,recipe:'store',effect:'ลดอาหารที่ใช้ต่อวัน 1 หน่วย (ไม่สะสมหลายหลัง)'},
 lumber:{name:'ค่ายตัดไม้',cost:{wood:3,stone:2},recipe:null,terrain:'forest',effect:'เพิ่มไม้ 1 ต่อคนตัดไม้ (ไม่สะสมหลายหลัง)'},
};
export const JOBS=['forage','wood','stone','clay','water','farm'] as const;
export type Job=typeof JOBS[number];
export const JOB_NAMES:Record<Job,string>={forage:'หาอาหาร',wood:'ตัดไม้',stone:'เก็บหิน',clay:'ขุดดิน',water:'ตักน้ำ',farm:'ทำไร่'};
export const TILES=['forest','grass','grass','river','forest','grass','grass','river','forest','grass','grass','river'];
export const DECORATIONS={
 flowers:{name:'แปลงดอกไม้',cost:{water:1,clay:1},symbol:'✿'},
 tree:{name:'ต้นไม้ร่มรื่น',cost:{wood:1,water:1},symbol:'♧'},
 path:{name:'ทางเดินหิน',cost:{stone:1},symbol:'⋯'},
 bench:{name:'ม้านั่งพักใจ',cost:{wood:2},symbol:'⌑'},
 lantern:{name:'โคมไฟดินเผา',cost:{clay:1,wood:1},symbol:'✧'},
} satisfies Record<string,{name:string;cost:Cost;symbol:string}>;
export type Decoration=keyof typeof DECORATIONS;
export const REQUESTS={
 garden:{title:'สวนเล็ก ๆ หน้าบ้าน',from:0,text:'อยากมีดอกไม้ตรงที่พักสักหน่อย เวลากลับจากทำงานจะได้สดชื่น',reward:'เปิดแบบม้านั่งพักใจ',cost:{}},
 picnic:{title:'มื้อเล็ก ๆ ริมธาร',from:1,text:'แบ่งอาหาร 6 และน้ำ 2 ให้ทุกคนพักด้วยกันสักมื้อ',reward:'ได้ไม้ 3 และหิน 2 เป็นของขอบคุณ',cost:{food:6,water:2}},
 light:{title:'แสงอุ่นจากเตาเผา',from:0,text:'เมื่อทำภาชนะได้แล้ว ขอใช้ดิน 2 และไม้ 1 ทำของขวัญให้เพื่อนบ้าน',reward:'เปิดแบบโคมไฟดินเผา',cost:{clay:2,wood:1}},
} satisfies Record<string,{title:string;from:number;text:string;reward:string;cost:Cost}>;
export type RequestId=keyof typeof REQUESTS;
export const PRODUCTION_CYCLE_MS=30_000;
export const OFFLINE_CAP_MS=4*60*60*1000;
export const CRAFT_TIME_MS=90_000;
export type CraftTask={item:'axe'|'pottery';startedAt:number;finishAt:number};
export const DEFAULT_NAMES=['มะลิ','ต้นกล้า','ใบชา','ข้าวปั้น','อุ่นใจ'];
export const validName=(value:unknown,max:number)=>typeof value==='string'&&[...value.trim()].length>0&&[...value.trim()].length<=max&&!/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/.test(value);
export type Village={version:1;name:string;names:string[];decorations:(Decoration|null)[];completed:RequestId[];day:number;stock:Stock;people:number;jobs:Record<Job,number>;plots:(Building|null)[];known:Recipe[];axe:boolean;pots:boolean;won:boolean;winter:boolean;message:string;log:string[];lastActiveAt:number;productionCarryMs:number;craft:CraftTask|null;awayReport:string|null};
export const initial=(now=Date.now()):Village=>({version:1,name:'หมู่บ้านริมธาร',names:[...DEFAULT_NAMES],decorations:Array(12).fill(null),completed:[],day:1,stock:{wood:9,stone:6,clay:4,food:12,water:6},people:2,jobs:{forage:1,wood:1,stone:0,clay:0,water:0,farm:0},plots:Array(12).fill(null),known:[],axe:false,pots:false,won:false,winter:false,message:'เป้าหมายแรก: ทดลองไม้ + หิน แล้ววางกองไฟในหมู่บ้าน',log:[],lastActiveAt:now,productionCarryMs:0,craft:null,awayReport:null});
export const has=(s:Village,b:Building)=>s.plots.includes(b);
export const housing=(s:Village)=>2+s.plots.filter(b=>b==='shelter').length*2;
export const assigned=(s:Village)=>Object.values(s.jobs).reduce((a,b)=>a+b,0);
export const canPay=(s:Village,c:Cost)=>RESOURCES.every(r=>s.stock[r]>=(c[r]??0));
export const missing=(s:Village,c:Cost)=>RESOURCES.filter(r=>s.stock[r]<(c[r]??0)).map(r=>`${LABEL[r]} ${(c[r]??0)-s.stock[r]}`).join(' · ');
export const foodNeed=(s:Village)=>Math.max(1,s.people-(has(s,'store')?1:0));
export const storageCapacity=(s:Village)=>40+(has(s,'store')?40:0);
export const goals=(s:Village)=>[{name:'มีผู้ตั้งถิ่นฐาน 5 คน',met:s.people>=5},{name:'ที่พักรองรับทุกคน',met:housing(s)>=s.people&&housing(s)>=5},{name:'อาหารสำรอง 20',met:s.stock.food>=20},{name:'ไม้สำรอง 8 และกองไฟ',met:s.stock.wood>=8&&has(s,'fire')}];
function pay(s:Village,c:Cost){for(const r of RESOURCES)s.stock[r]-=c[r]??0;}
function message(s:Village,text:string){s.message=text;return s;}
export type Action={type:'rename';name:string}|{type:'rename-person';person:number;name:string}|{type:'move';from:number;to:number}|{type:'decorate';decoration:Decoration;tile:number}|{type:'remove-decoration';tile:number}|{type:'fulfill';request:RequestId}|{type:'experiment';a:Resource;b:Resource}|{type:'build';building:Building;tile:number}|{type:'demolish';tile:number}|{type:'assign';job:Job;delta:1|-1}|{type:'recruit'}|{type:'produce';item:'axe'|'pottery'}|{type:'queue-craft';item:'axe'|'pottery';now:number}|{type:'sync';now:number}|{type:'clear-away'}|{type:'day'}|{type:'winter'};
function productionCycle(s:Village){
 const cap=storageCapacity(s),before={...s.stock},add=(r:Resource,n:number)=>{s.stock[r]=Math.min(cap,s.stock[r]+n);};
 add('wood',s.jobs.wood*(2+Number(s.axe)+Number(has(s,'lumber'))));add('stone',s.jobs.stone*2);add('clay',s.jobs.clay*2);add('water',s.jobs.water*(3+Number(s.pots)));add('food',s.jobs.forage*3);
 const watered=Math.min(s.jobs.farm,Math.floor(s.stock.water/2),Math.floor((cap-s.stock.food)/6));s.stock.water-=watered*2;add('food',watered*6);
 return RESOURCES.some(r=>s.stock[r]!==before[r]);
}
export function act(state:Village,action:Action):Village{
 const s:Village=structuredClone(state);
 if(action.type==='clear-away'){s.awayReport=null;return s;}
 if(action.type==='sync'){
  if(!Number.isFinite(action.now)||action.now<s.lastActiveAt)return s;
  const elapsed=Math.min(action.now-s.lastActiveAt,OFFLINE_CAP_MS),total=s.productionCarryMs+elapsed,cycles=Math.floor(total/PRODUCTION_CYCLE_MS);s.productionCarryMs=total%PRODUCTION_CYCLE_MS;s.lastActiveAt=action.now;
  let productive=0;for(let i=0;i<cycles;i++)if(productionCycle(s))productive++;
  if(s.craft&&action.now>=s.craft.finishAt){const item=s.craft.item;if(item==='axe')s.axe=true;else{s.pots=true;s.stock.water=Math.min(storageCapacity(s),s.stock.water+4);}s.craft=null;s.message=`${RECIPES[item].name} พร้อมใช้งานแล้ว!`;}
  if(elapsed>=60_000){const hours=Math.min(elapsed,OFFLINE_CAP_MS)/3_600_000;s.awayReport=productive?`ระหว่างพัก ${hours<1?Math.floor(hours*60)+' นาที':hours.toFixed(1)+' ชม.'} หมู่บ้านทำงาน ${productive} รอบ`:'ระหว่างพัก สถานีหยุดเพราะไม่มีคนทำงานหรือคลังเต็ม';}
  return s;
 }
 if(action.type==='rename'||action.type==='rename-person'){
 const max=action.type==='rename'?32:20;if(!validName(action.name,max))return message(s,`กรุณาใช้ชื่อ 1–${max} ตัวอักษร ไม่ใส่อักขระควบคุม`);
 if(action.type==='rename')s.name=action.name.trim();else{if(!Number.isInteger(action.person)||action.person<0||action.person>=s.people)return s;s.names[action.person]=action.name.trim();}return message(s,'บันทึกชื่อใหม่แล้ว ♡');
 }
 if(action.type==='move'){
 const {from,to}=action;if(![from,to].every(i=>Number.isInteger(i)&&i>=0&&i<12)||from===to||!s.plots[from]||s.plots[to])return message(s,'เลือกพื้นที่ว่างเพื่อย้ายอาคาร');
 const b=s.plots[from]!,terrain=BUILD[b].terrain;if(terrain&&TILES[to]!==terrain)return message(s,terrain==='river'?'แปลงเพาะปลูกยังต้องอยู่ริมน้ำ':'ค่ายตัดไม้ยังต้องอยู่ใกล้ป่า');
 s.plots[to]=b;s.plots[from]=null;return message(s,'ย้าย'+BUILD[b].name+'แล้ว ไม่เสียทรัพยากร ของตกแต่งยังอยู่ที่เดิม');
 }
 if(action.type==='decorate'){
 const {tile,decoration:d}=action;if(!Number.isInteger(tile)||tile<0||tile>=12||s.decorations[tile])return message(s,'เลือกพื้นที่ที่ยังไม่มีของตกแต่ง หรือเก็บของเดิมก่อน');
 if(!decorationUnlocked(s,d))return message(s,'ทำคำขอเพื่อนบ้านเพื่อเปิดแบบตกแต่งนี้ก่อน');
 if(!canPay(s,DECORATIONS[d].cost))return message(s,'ขาด '+missing(s,DECORATIONS[d].cost));pay(s,DECORATIONS[d].cost);s.decorations[tile]=d;return message(s,'แต่งด้วย'+DECORATIONS[d].name+'แล้ว ♡ ไม่เพิ่มผลผลิต แค่ทำให้เป็นบ้านของเรา');
 }
 if(action.type==='remove-decoration'){
 const d=s.decorations[action.tile];if(!d)return s;for(const r of RESOURCES)s.stock[r]+=(DECORATIONS[d].cost as Cost)[r]??0;s.decorations[action.tile]=null;return message(s,'เก็บของตกแต่งแล้ว คืนวัสดุเต็มจำนวน จัดใหม่ได้เลย');
 }
 if(action.type==='fulfill'){
 const id=action.request;if(s.completed.includes(id))return message(s,'ส่งคำขอนี้แล้ว ขอบคุณนะ ♡');
 const reason=requestMissing(s,id);if(reason)return message(s,reason);pay(s,REQUESTS[id].cost);s.completed.push(id);if(id==='picnic'){s.stock.wood+=3;s.stock.stone+=2;}return message(s,'เพื่อนบ้านดีใจมาก! '+REQUESTS[id].reward);
 }
 if(action.type==='experiment'){
 const pair=[action.a,action.b].sort().join('|');const recipe=(Object.keys(RECIPES) as Recipe[]).find(k=>!s.known.includes(k)&&[...RECIPES[k].pair].sort().join('|')===pair);
 if(!recipe)return message(s,'ยังไม่มีความรู้ใหม่จากคู่นี้ ลองดูคำใบ้ในสมุดสูตร');
 const cost:Cost={};for(const r of [action.a,action.b])cost[r]=(cost[r]??0)+1;
 if(!canPay(s,cost))return message(s,'วัสดุทดลองไม่พอ: '+missing(s,cost));pay(s,cost);s.known.push(recipe);return message(s,'ค้นพบสูตร '+RECIPES[recipe].name+'! '+RECIPES[recipe].why);
 }
 if(action.type==='build'){
 const {building:b,tile}=action,d=BUILD[b];if(!Number.isInteger(tile)||tile<0||tile>=12||s.plots[tile])return message(s,'เลือกพื้นที่ว่างก่อน');
 if(d.recipe&&!s.known.includes(d.recipe))return message(s,'ต้องค้นพบสูตร '+d.name+' ก่อน');
 if(d.terrain&&TILES[tile]!==d.terrain)return message(s,d.terrain==='river'?'แปลงเพาะปลูกต้องอยู่ริมแม่น้ำ':'ค่ายตัดไม้ต้องอยู่ใกล้ป่า');
 if(b==='kiln'&&!has(s,'fire'))return message(s,'สร้างกองไฟก่อนเพื่อใช้ความรู้เรื่องความร้อน');
 if(b==='store'&&!s.pots)return message(s,'ผลิตและติดตั้งภาชนะที่เตาเผาก่อน');
 if(!canPay(s,d.cost))return message(s,'ขาด '+missing(s,d.cost)+' — มอบหมายคนให้สถานีแล้วรอผลผลิตรอบถัดไป');
 pay(s,d.cost);s.plots[tile]=b;return message(s,'สร้าง'+d.name+'แล้ว · '+d.effect);
 }
 if(action.type==='demolish'){
 const b=s.plots[action.tile];if(!b)return s;
 if(b==='shelter'&&housing(s)-2<s.people)return message(s,'ยังรื้อไม่ได้ คนจะไม่มีที่พัก');
 if(b==='farm'&&s.jobs.farm>s.plots.filter(x=>x==='farm').length-1)return message(s,'ย้ายคนออกจากงานทำไร่ก่อนรื้อ');
 for(const r of RESOURCES)s.stock[r]+=Math.floor((BUILD[b].cost[r]??0)/2);s.plots[action.tile]=null;return message(s,'รื้อแล้ว ได้วัสดุก่อสร้างคืนครึ่งหนึ่ง (ปัดลง)');
 }
 if(action.type==='assign'){
 const {job,delta}=action;if(delta===-1&&s.jobs[job]>0)s.jobs[job]--;else if(delta===1&&assigned(s)<s.people){if(job==='farm'&&s.jobs.farm>=s.plots.filter(x=>x==='farm').length)return message(s,'ต้องมีแปลงว่าง 1 แปลงต่อคนทำไร่');s.jobs[job]++;}else return message(s,'ย้ายคนจากงานเดิมก่อน หรือรับผู้ตั้งถิ่นฐานเพิ่ม');return message(s,'จัดงานแล้ว ชาวบ้านจะนำผลผลิตเข้าคลังอัตโนมัติ');
 }
 if(action.type==='recruit'){
 if(s.people>=5)return message(s,'ต้นแบบนี้รองรับคน 5 คน');if(housing(s)<=s.people)return message(s,'สร้างเพิงพักเพิ่มก่อนรับคน');if(!canPay(s,{food:4}))return message(s,'ต้องใช้อาหาร 4 เพื่อต้อนรับคนใหม่');pay(s,{food:4});s.people++;return message(s,'ยินดีต้อนรับ! มีคนว่างเพิ่ม 1 คน เลือกงานให้เขาได้เลย');
 }
 if(action.type==='queue-craft'){
 const key=action.item;if(s.craft)return message(s,'โต๊ะงานกำลังผลิตอย่างอื่นอยู่');if(!Number.isFinite(action.now))return s;
 if(!s.known.includes(key))return message(s,'ค้นพบสูตรก่อนผลิต');if(key==='pottery'&&!has(s,'kiln'))return message(s,'ต้องมีเตาเผาเพื่อผลิตภาชนะ');if(key==='axe'?s.axe:s.pots)return message(s,'ติดตั้งแล้ว ไม่ต้องผลิตซ้ำ');if(!canPay(s,RECIPES[key].cost))return message(s,'ขาด '+missing(s,RECIPES[key].cost));pay(s,RECIPES[key].cost);s.craft={item:key,startedAt:action.now,finishAt:action.now+CRAFT_TIME_MS};return message(s,`เริ่มทำ${RECIPES[key].name} · วัตถุดิบถูกจองแล้ว`);
 }
 if(action.type==='produce'){
 const key=action.item;if(!s.known.includes(key))return message(s,'ค้นพบสูตรก่อนผลิต');if(key==='pottery'&&!has(s,'kiln'))return message(s,'ต้องมีเตาเผาเพื่อผลิตภาชนะ');if(key==='axe'?s.axe:s.pots)return message(s,'ติดตั้งแล้ว ไม่ต้องผลิตซ้ำ');if(!canPay(s,RECIPES[key].cost))return message(s,'ขาด '+missing(s,RECIPES[key].cost));pay(s,RECIPES[key].cost);if(key==='axe')s.axe=true;else{s.pots=true;s.stock.water+=4;}return message(s,key==='axe'?'มอบขวานให้ทีมตัดไม้แล้ว ผลผลิตไม้ +1 ต่อคน':'ติดตั้งภาชนะแล้ว ได้สำรองน้ำ 4 และตักน้ำได้เพิ่ม 1 ต่อคน');
 }
 if(action.type==='winter'){
 if(!goals(s).every(g=>g.met))return message(s,'เตรียมคน ที่พัก อาหาร และไม้ตามเป้าหมายให้ครบก่อน');s.won=true;s.winter=true;return message(s,'งานเลี้ยงฤดูหนาวพร้อมแล้ว! ทุกคนมารวมตัวกัน เล่นต่อและแต่งหมู่บ้านได้ตามใจ');
 }
 if(action.type==='day'){
 const before={...s.stock};productionCycle(s);
 const need=foodNeed(s),short=s.stock.food<need;s.stock.food=Math.max(0,s.stock.food-need);s.day++;
 const changes=RESOURCES.map(r=>`${LABEL[r]} ${s.stock[r]-before[r]>=0?'+':''}${s.stock[r]-before[r]}`).join(' · ');
 const text=`วันที่ ${s.day-1}: ${changes}`;s.log=[text,...s.log].slice(0,20);
 return message(s,short?'อาหารไม่พอวันนี้ คนยังอยู่กับคุณ ย้ายคนไปหาอาหารเพื่อฟื้นตัว':text);
 }return s;
}
// Save only validated domain state; reject malformed or incompatible saves safely.
export function restore(raw:unknown):Village|null{
 if(!raw||typeof raw!=='object')return null;const s=raw as Village;const integer=(n:unknown,max=1000000)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=max;
 if(s.version!==1||!integer(s.day)||s.day<1||!integer(s.people,5)||s.people<2||!s.stock||!RESOURCES.every(r=>integer(s.stock[r]))||!s.jobs||!JOBS.every(j=>integer(s.jobs[j],5))||assigned(s)>s.people||!Array.isArray(s.plots)||s.plots.length!==12||!s.plots.every((b,i)=>b===null||BUILDINGS.includes(b)&&(!BUILD[b].terrain||BUILD[b].terrain===TILES[i]))||!Array.isArray(s.known)||!s.known.every(k=>Object.hasOwn(RECIPES,k)))return null;
 if(housing(s)<s.people||s.jobs.farm>s.plots.filter(x=>x==='farm').length)return null;
 const legacy=s as Partial<Village>;
 if(legacy.name!==undefined&&!validName(legacy.name,32)||legacy.names!==undefined&&(!Array.isArray(legacy.names)||legacy.names.length!==5||!legacy.names.every(n=>validName(n,20)))||legacy.decorations!==undefined&&(!Array.isArray(legacy.decorations)||legacy.decorations.length!==12||!legacy.decorations.every(d=>d===null||Object.hasOwn(DECORATIONS,d)))||legacy.completed!==undefined&&(!Array.isArray(legacy.completed)||!legacy.completed.every(k=>Object.hasOwn(REQUESTS,k))))return null;
 const now=Date.now(),lastActiveAt=integer(legacy.lastActiveAt,Number.MAX_SAFE_INTEGER)?legacy.lastActiveAt!:now,productionCarryMs=integer(legacy.productionCarryMs,PRODUCTION_CYCLE_MS-1)?legacy.productionCarryMs!:0,craft=legacy.craft&&['axe','pottery'].includes(legacy.craft.item)&&Number.isFinite(legacy.craft.startedAt)&&Number.isFinite(legacy.craft.finishAt)&&legacy.craft.finishAt>=legacy.craft.startedAt?legacy.craft:null;
 return {version:1,name:legacy.name?.trim()??initial().name,names:legacy.names?.map(n=>n.trim())??[...DEFAULT_NAMES],decorations:legacy.decorations??Array(12).fill(null),completed:[...new Set(legacy.completed??[])],day:s.day,stock:Object.fromEntries(RESOURCES.map(r=>[r,s.stock[r]])) as Stock,people:s.people,jobs:Object.fromEntries(JOBS.map(j=>[j,s.jobs[j]])) as Record<Job,number>,plots:[...s.plots],known:[...new Set(s.known)],axe:s.axe===true,pots:s.pots===true,won:s.won===true,winter:s.winter===true,log:Array.isArray(s.log)?s.log.filter(x=>typeof x==='string').slice(0,20):[],message:'กลับบ้านแล้ว ♡ ระบบจะคำนวณงานที่ทำต่อระหว่างพัก',lastActiveAt,productionCarryMs,craft,awayReport:typeof legacy.awayReport==='string'?legacy.awayReport:null};
}
export const decorationUnlocked=(s:Village,d:Decoration)=>d==='bench'?s.completed.includes('garden'):d==='lantern'?s.completed.includes('light'):true;
export function requestMissing(s:Village,id:RequestId):string|null{
 if(id==='garden'&&!s.plots.some((b,i)=>b==='shelter'&&s.decorations[i]==='flowers'))return 'วางดอกไม้บนพื้นที่เดียวกับเพิงพักอย่างน้อย 1 แห่ง';
 if(id==='light'&&(!s.pots||!has(s,'kiln')))return 'ต้องมีเตาเผาและติดตั้งภาชนะก่อน';
 if(!canPay(s,REQUESTS[id].cost))return 'ต้องเตรียม '+missing(s,REQUESTS[id].cost);
 return null;
}
export function buildingStatus(s:Village,b:Building,tile?:number):{label:string;tab:string}{
 if(b==='farm'){
 const farms=s.plots.map((v,i)=>v==='farm'?i:-1).filter(i=>i>=0),rank=tile===undefined?0:farms.indexOf(tile);
 return rank>=s.jobs.farm?{label:'ขาดคนทำไร่',tab:'people'}:Math.floor((s.stock.water+s.jobs.water*(3+Number(s.pots)))/2)<=rank?{label:'ขาดน้ำสำหรับรอบถัดไป',tab:'people'}:{label:'พร้อมปลูก · รับผลผลิตอัตโนมัติ',tab:'people'};
 }
 if(b==='lumber')return {label:s.jobs.wood?'ทีมตัดไม้พร้อมทำงาน':'ยังไม่มีคนตัดไม้',tab:'people'};
 if(b==='shelter')return {label:housing(s)>s.people&&s.people<5?'มีที่ว่าง · ต้อนรับเพื่อนได้':'ทุกคนมีบ้านพัก',tab:'people'};
 if(b==='kiln')return {label:s.pots?'ภาชนะติดตั้งแล้ว':s.craft?.item==='pottery'?'กำลังเผาภาชนะ':!s.known.includes('pottery')?'ยังไม่รู้สูตรภาชนะ':!canPay(s,RECIPES.pottery.cost)?'ขาด '+missing(s,RECIPES.pottery.cost):'พร้อมเข้าคิวผลิตภาชนะ',tab:'discover'};
 return {label:b==='store'?'ช่วยประหยัดอาหารวันละ 1':'กองไฟพร้อมให้ความอบอุ่น',tab:'build'};
}
