import {CARDS,type Card} from '../game/engine.ts';
export const names:Record<string,string>={water:'น้ำ',earth:'ดิน',air:'ลม',wood:'ไม้',seed:'เมล็ดพันธุ์',stone:'หิน',clay:'ดินเหนียว',steam:'ไอน้ำ',plant:'ต้นอ่อน',garden:'สวน',charcoal:'ถ่าน',brick:'อิฐ',lava:'ลาวา',dust:'ฝุ่น',sand:'ทราย',tool:'เครื่องมือ',axe:'ขวาน',light:'แสง',raft:'แพ',pottery:'เครื่องปั้นดินเผา',glass:'แก้ว',tea:'ชา',marsh:'บึง',forest:'ป่า',farm:'ไร่นา',house:'บ้าน',tower:'หอคอย',lens:'เลนส์',engine:'เครื่องยนต์',steamboat:'เรือไอน้ำ',kite:'ว่าว',reservoir:'อ่างเก็บน้ำ',greenhouse:'เรือนกระจก',telescope:'กล้องดูดาว',prism:'ปริซึม',wheel:'ล้อ',vehicle:'ยานพาหนะ',compass:'เข็มทิศ',paper:'กระดาษ',blueprint:'แบบแปลน',academy:'สำนักเรียน',flint:'หินเหล็กไฟ',fire:'ไฟ',furnace:'เตาหลอม',copper_ore:'แร่ทองแดง',tin_ore:'แร่ดีบุก',metal:'โลหะ',basket:'ตะกร้า',shelter:'เพิงพัก'};
const mods:Record<string,string>={aquatic:'ใช้งานในน้ำ',living:'มีชีวิต',thermal:'พลังความร้อน',ventilated:'ระบายอากาศ',stonebound:'เสริมหิน',framed:'โครงไม้',woven:'หุ้มใยสาน',reinforced:'หุ้มโลหะ',intelligent:'จารึกความรู้'};
export const cardName=(c:Card)=>[names[c.base??c.id]??c.name,...(c.mods??[]).map(m=>mods[m]??m)].join(' · ');
export const nameById=(id:string)=>{const c=CARDS.get(id);return c?cardName(c):names[id]??id;};
export const tags:Record<string,string>={air:'ลม',container:'ภาชนะ',earth:'ดิน',energy:'พลังงาน',food:'อาหาร',fuel:'เชื้อเพลิง',heat:'ความร้อน',knowledge:'ความรู้',life:'ชีวิต',light:'แสง',liquid:'ของเหลว',machine:'เครื่องจักร',metal:'โลหะ',mineral:'แร่',moldable:'ปั้นได้',ore:'สินแร่',organic:'อินทรีย์',plant:'พืช',sand:'ทราย',science:'วิทยาศาสตร์',seed:'เมล็ด',solid:'ของแข็ง',structure:'สิ่งปลูกสร้าง',tool:'เครื่องมือ',transparent:'โปร่งใส',transport:'ขนส่ง',water:'น้ำ',wood:'ไม้'};
export const innovations:Record<string,string>={firecraft:'ควบคุมไฟ',toolmaking:'ทำเครื่องมือ',pottery:'งานดินเผา',cultivation:'เพาะปลูก',metallurgy:'หลอมโลหะ'};
export const eras:Record<string,string>={stone:'ยุคหิน',bronze:'ยุคสำริด',industrial:'ยุคอุตสาหกรรม'};
export const weather:Record<string,string>={clear:'ฟ้าใส',cold:'อากาศหนาว',rain:'ฤดูฝน'};
export const stages=['หุบเขาแห่งความเป็นไปได้','กองไฟแรกของเรา','ชุมชนเล็ก ๆ','หมู่บ้านที่เติบโต','เมืองช่างสำริด'];
export const featureNames:Record<string,string>={fire:'กองไฟ',shelter:'บ้าน',nature:'ธรรมชาติ',farming:'ไร่นา',pottery:'เตาเผา',boats:'ล่องแม่น้ำ',metallurgy:'โรงหลอม'};
export function explain(c:Card){return c.mods?.length?'แนวคิดทดลองจากคุณสมบัติของวัสดุ ลองต่อยอดได้อีก (ไม่ใช่ข้อยืนยันทางวิทยาศาสตร์)':'ค้นพบสูตรใหม่แล้ว! เลือกการ์ดนี้เพื่อทดลองต่อยอด';}
export function feedbackText(message:string){
 if(/[ก-๙]/.test(message))return message;
 if(message.startsWith('First unlock '))return 'ต้องเรียนรู้ก่อน: '+message.slice(13).replace(/\.$/,'').split(' and ').map(n=>Object.entries(innovations).find(([id])=>({firecraft:'Firecraft',toolmaking:'Toolmaking',pottery:'Pottery',cultivation:'Cultivation',metallurgy:'Metallurgy'}[id]===n))?.[1]??n).join(' + ');
 if(message.includes('Bronze')||message.includes('Industrial')||message.includes('era not yet'))return 'แนวคิดนี้ต้องใช้ความรู้จากยุคถัดไป';
 if(message.startsWith('Discovery!'))return 'ค้นพบแล้ว! ลองนำสิ่งใหม่นี้ไปผสมต่อ';
 if(message.includes('Already discovered'))return 'เคยค้นพบแล้ว ลองเปลี่ยนคุณสมบัติเพื่อหาแนวคิดใหม่';
 if(message.startsWith('Cold snap'))return 'อากาศหนาว ต้องค้นพบไฟก่อนปลูกพืช';
 if(message.startsWith('No connection'))return 'ยังไม่พบความเชื่อมโยง ลองเปลี่ยนวัสดุหรือวิจัยเพิ่ม';
 return message;
}
