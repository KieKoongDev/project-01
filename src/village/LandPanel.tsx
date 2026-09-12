import {useEffect,useRef} from 'react';
import {X,RotateCw} from 'lucide-react';
import {LAND_COSTS,LAND_NAMES,NODE_NAMES,nodeCapacity,nodeDuration,type ResourceNode} from './land';
import {canPay,storageCapacity,type Village,type Action} from './model';
import {ItemArt} from './scene/ItemArt';
export function LandPanel({v,dispatch}:{v:Village;dispatch:(a:Action)=>void}){
 const count=v.plots.length/12,cost=LAND_COSTS[count-1];
 return <section><h2>โลกของเรา · {v.plots.length} ช่อง</h2><p>อาคารเดิมอยู่ที่เดิมเสมอ เปิดพื้นที่ใหม่เพื่อสร้างและพบจุดเก็บของเพิ่ม</p>{LAND_NAMES.map((name,i)=><div className="land-option" key={name}><ItemArt kind={i===1?'wood':i===2?'stone':'shelter'}/><span><strong>{name}</strong><small>{i<count?'เปิดแล้ว · 12 ช่อง':i===count?'พื้นที่ถัดไป · 12 ช่อง':'เปิดพื้นที่ก่อนหน้าก่อน'}</small></span></div>)}{cost?<button className="village-primary" disabled={!canPay(v,cost)} onClick={()=>dispatch({type:'expand'})}>เปิด{LAND_NAMES[count]} · ไม้ {cost.wood} หิน {cost.stone}</button>:<p>เปิดครบสามพื้นที่ของต้นแบบแล้ว</p>}<p>แตะชื่อพื้นที่เหนือฉากเพื่อเลื่อนกล้อง ใช้ + / − เพื่อซูม หรือเปิดไอคอนมือเพื่อลากฉากและบีบนิ้วซูม ส่วนการหมุนอาคารอยู่ในเมนูเมื่อแตะอาคาร</p></section>;
}
export function NodePanel({v,node:n,now,dispatch,onClose}:{v:Village;node:ResourceNode;now:number;dispatch:(a:Action)=>void;onClose:()=>void}){
 const panel=useRef<HTMLElement>(null);useEffect(()=>{const prev=document.activeElement as HTMLElement|null;panel.current?.focus({preventScroll:true});return()=>{if(prev?.isConnected)prev.focus({preventScroll:true});};},[n.id]);
 const full=n.stored>=nodeCapacity(n),remaining=Math.max(0,Math.ceil((n.readyAt-now)/1000));
 return <section ref={panel} tabIndex={-1} className="world-actions node-actions" aria-label={NODE_NAMES[n.resource]} onKeyDown={e=>{if(e.key==='Escape')onClose();}}>
 <div className="world-action-title"><ItemArt kind={n.resource}/><span><strong>{NODE_NAMES[n.resource]} · Lv.{n.level}</strong><small>{full?'ที่เก็บเต็ม · แตะรับของ':`รอบถัดไป ${remaining} วิ · ครั้งละ 2`}</small></span><button className="icon-button" aria-label="ปิดจุดทรัพยากร" onClick={onClose}><X size={18}/></button></div>
 <progress aria-label="ความคืบหน้าการผลิต" max={100} value={full?100:Math.max(0,100-(n.readyAt-now)/nodeDuration(n)*100)}/>
 <div className="world-action-buttons"><button disabled={!n.stored||v.stock[n.resource]>=storageCapacity(v)} onClick={()=>dispatch({type:'collect-node',id:n.id})}>เก็บ {n.stored}/{nodeCapacity(n)}</button>{n.level===1?<button disabled={!canPay(v,{wood:8,stone:8})} onClick={()=>dispatch({type:'upgrade-node',id:n.id})}><RotateCw size={16}/>อัปเกรด · ไม้ 8 หิน 8</button>:<button aria-pressed={n.auto} onClick={()=>dispatch({type:'toggle-node-auto',id:n.id})}>ส่งเข้าคลัง {n.auto?'เปิด':'ปิด'}</button>}</div>
 </section>;
}
