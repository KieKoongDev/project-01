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
export type Village={version:1;day:number;stock:Stock;people:number;jobs:Record<Job,number>;plots:(Building|null)[];known:Recipe[];axe:boolean;pots:boolean;won:boolean;winter:boolean;message:string;log:string[]};
export const initial=():Village=>({version:1,day:1,stock:{wood:9,stone:6,clay:4,food:12,water:6},people:2,jobs:{forage:1,wood:1,stone:0,clay:0,water:0,farm:0},plots:Array(12).fill(null),known:[],axe:false,pots:false,won:false,winter:false,message:'เป้าหมายแรก: ทดลองไม้ + หิน แล้ววางกองไฟในหมู่บ้าน',log:[]});
export const has=(s:Village,b:Building)=>s.plots.includes(b);
export const housing=(s:Village)=>2+s.plots.filter(b=>b==='shelter').length*2;
export const assigned=(s:Village)=>Object.values(s.jobs).reduce((a,b)=>a+b,0);
export const canPay=(s:Village,c:Cost)=>RESOURCES.every(r=>s.stock[r]>=(c[r]??0));
export const missing=(s:Village,c:Cost)=>RESOURCES.filter(r=>s.stock[r]<(c[r]??0)).map(r=>`${LABEL[r]} ${(c[r]??0)-s.stock[r]}`).join(' · ');
export const foodNeed=(s:Village)=>Math.max(1,s.people-(has(s,'store')?1:0));
export const goals=(s:Village)=>[{name:'มีผู้ตั้งถิ่นฐาน 5 คน',met:s.people>=5},{name:'ที่พักรองรับทุกคน',met:housing(s)>=s.people&&housing(s)>=5},{name:'อาหารสำรอง 20',met:s.stock.food>=20},{name:'ไม้สำรอง 8 และกองไฟ',met:s.stock.wood>=8&&has(s,'fire')}];
function pay(s:Village,c:Cost){for(const r of RESOURCES)s.stock[r]-=c[r]??0;}
function message(s:Village,text:string){s.message=text;return s;}
export type Action={type:'experiment';a:Resource;b:Resource}|{type:'build';building:Building;tile:number}|{type:'demolish';tile:number}|{type:'assign';job:Job;delta:1|-1}|{type:'recruit'}|{type:'produce';item:'axe'|'pottery'}|{type:'day'}|{type:'winter'};
export function act(state:Village,action:Action):Village{
 const s:Village=structuredClone(state);
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
 if(!canPay(s,d.cost))return message(s,'ขาด '+missing(s,d.cost)+' — มอบหมายคนเก็บทรัพยากรแล้วจบวัน');
 pay(s,d.cost);s.plots[tile]=b;return message(s,'สร้าง'+d.name+'แล้ว · '+d.effect);
 }
 if(action.type==='demolish'){
 const b=s.plots[action.tile];if(!b)return s;
 if(b==='shelter'&&housing(s)-2<s.people)return message(s,'ยังรื้อไม่ได้ คนจะไม่มีที่พัก');
 if(b==='farm'&&s.jobs.farm>s.plots.filter(x=>x==='farm').length-1)return message(s,'ย้ายคนออกจากงานทำไร่ก่อนรื้อ');
 for(const r of RESOURCES)s.stock[r]+=Math.floor((BUILD[b].cost[r]??0)/2);s.plots[action.tile]=null;return message(s,'รื้อแล้ว ได้วัสดุก่อสร้างคืนครึ่งหนึ่ง (ปัดลง)');
 }
 if(action.type==='assign'){
 const {job,delta}=action;if(delta===-1&&s.jobs[job]>0)s.jobs[job]--;else if(delta===1&&assigned(s)<s.people){if(job==='farm'&&s.jobs.farm>=s.plots.filter(x=>x==='farm').length)return message(s,'ต้องมีแปลงว่าง 1 แปลงต่อคนทำไร่');s.jobs[job]++;}else return message(s,'ย้ายคนจากงานเดิมก่อน หรือรับผู้ตั้งถิ่นฐานเพิ่ม');return message(s,'จัดงานแล้ว กดจบวันเพื่อรับผลผลิต');
 }
 if(action.type==='recruit'){
 if(s.people>=5)return message(s,'ต้นแบบนี้รองรับคน 5 คน');if(housing(s)<=s.people)return message(s,'สร้างเพิงพักเพิ่มก่อนรับคน');if(!canPay(s,{food:4}))return message(s,'ต้องใช้อาหาร 4 เพื่อต้อนรับคนใหม่');pay(s,{food:4});s.people++;return message(s,'ยินดีต้อนรับ! มีคนว่างเพิ่ม 1 คน เลือกงานให้เขาได้เลย');
 }
 if(action.type==='produce'){
 const key=action.item;if(!s.known.includes(key))return message(s,'ค้นพบสูตรก่อนผลิต');if(key==='pottery'&&!has(s,'kiln'))return message(s,'ต้องมีเตาเผาเพื่อผลิตภาชนะ');if(key==='axe'?s.axe:s.pots)return message(s,'ติดตั้งแล้ว ไม่ต้องผลิตซ้ำ');if(!canPay(s,RECIPES[key].cost))return message(s,'ขาด '+missing(s,RECIPES[key].cost));pay(s,RECIPES[key].cost);if(key==='axe')s.axe=true;else{s.pots=true;s.stock.water+=4;}return message(s,key==='axe'?'มอบขวานให้ทีมตัดไม้แล้ว ผลผลิตไม้ +1 ต่อคน':'ติดตั้งภาชนะแล้ว ได้สำรองน้ำ 4 และตักน้ำได้เพิ่ม 1 ต่อคน');
 }
 if(action.type==='winter'){
 if(!goals(s).every(g=>g.met))return message(s,'เตรียมคน ที่พัก อาหาร และไม้ตามเป้าหมายให้ครบก่อน');s.won=true;s.winter=true;return message(s,'หมู่บ้านพร้อมผ่านฤดูหนาวแล้ว! เล่นต่อและจัดโลกของคุณได้อิสระ');
 }
 if(action.type==='day'){
 const before={...s.stock};s.stock.wood+=s.jobs.wood*(2+Number(s.axe)+Number(has(s,'lumber')));s.stock.stone+=s.jobs.stone*2;s.stock.clay+=s.jobs.clay*2;s.stock.water+=s.jobs.water*(3+Number(s.pots));s.stock.food+=s.jobs.forage*3;
 const watered=Math.min(s.jobs.farm,Math.floor(s.stock.water/2));s.stock.water-=watered*2;s.stock.food+=watered*6;
 const need=foodNeed(s),short=s.stock.food<need;s.stock.food=Math.max(0,s.stock.food-need);s.day++;
 const changes=RESOURCES.map(r=>`${LABEL[r]} ${s.stock[r]-before[r]>=0?'+':''}${s.stock[r]-before[r]}`).join(' · ');
 const text=`วันที่ ${s.day-1}: ${changes}`;s.log=[text,...s.log].slice(0,20);
 return message(s,short?'อาหารไม่พอวันนี้ คนยังอยู่กับคุณ ย้ายคนไปหาอาหารเพื่อฟื้นตัว':watered<s.jobs.farm?'บางแปลงขาดน้ำ จัดคนตักน้ำเพิ่ม':s.day===13&&!s.won?'ฤดูหนาวใกล้มาแล้ว เป้าหมายยังไม่ครบ เล่นต่อเพื่อเตรียมให้พร้อมได้':text);
 }return s;
}
// Save only validated domain state; reject malformed or incompatible saves safely.
export function restore(raw:unknown):Village|null{
 if(!raw||typeof raw!=='object')return null;const s=raw as Village;const integer=(n:unknown,max=1000000)=>typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<=max;
 if(s.version!==1||!integer(s.day)||s.day<1||!integer(s.people,5)||s.people<2||!s.stock||!RESOURCES.every(r=>integer(s.stock[r]))||!s.jobs||!JOBS.every(j=>integer(s.jobs[j],5))||assigned(s)>s.people||!Array.isArray(s.plots)||s.plots.length!==12||!s.plots.every((b,i)=>b===null||BUILDINGS.includes(b)&&(!BUILD[b].terrain||BUILD[b].terrain===TILES[i]))||!Array.isArray(s.known)||!s.known.every(k=>Object.hasOwn(RECIPES,k)))return null;
 if(housing(s)<s.people||s.jobs.farm>s.plots.filter(x=>x==='farm').length)return null;
 return {...initial(),...s,known:[...new Set(s.known)],axe:s.axe===true,pots:s.pots===true,won:s.won===true,winter:s.winter===true,log:Array.isArray(s.log)?s.log.filter(x=>typeof x==='string').slice(0,20):[],message:'กลับมาแล้ว หมู่บ้านรอการตัดสินใจของคุณ ไม่มีเวลาหรือทรัพยากรหายไประหว่างปิดเกม'};
}
