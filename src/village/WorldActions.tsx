import {useEffect,useRef} from 'react';
import {ArrowUpRight,FlaskConical,Move,UserPlus,Users,X} from 'lucide-react';
import {BUILD,RECIPES,canPay,housing,missing,buildingStatus,type Village,type Action,type Recipe} from './model';
import {ItemArt} from './scene/ItemArt';
export function WorldActions({v,tile,dispatch,onTab,onRecipe,onMove,onClose}:{v:Village;tile:number;dispatch:(a:Action)=>void;onTab:(tab:string)=>void;onRecipe:(r:Recipe)=>void;onMove:()=>void;onClose:()=>void}){
 const panel=useRef<HTMLElement>(null);useEffect(()=>{const previous=document.activeElement as HTMLElement|null;panel.current?.focus({preventScroll:true});return()=>{if(previous?.isConnected)previous.focus({preventScroll:true});};},[tile]);
 const b=v.plots[tile];if(!b)return null;
 const status=buildingStatus(v,b,tile),recruitReason=v.people>=5?'เพื่อนครบ 5 คนแล้ว':housing(v)<=v.people?'ต้องมีบ้านว่าง':!canPay(v,{food:4})?'ต้องมีอาหาร 4':null;
 const potteryReason=!canPay(v,RECIPES.pottery.cost)?'ขาด '+missing(v,RECIPES.pottery.cost):null;
 return <section ref={panel} tabIndex={-1} className="world-actions" aria-label={`ใช้งาน${BUILD[b].name}`} onKeyDown={e=>{if(e.key==='Escape')onClose();}}>
 <div className="world-action-title"><ItemArt kind={b}/><span><strong>{BUILD[b].name}</strong><small>{status.label}</small></span><button className="icon-button" aria-label="ปิดเมนูอาคาร" onClick={onClose}><X size={18}/></button></div>
 <div className="world-action-buttons">
 {b==='shelter'?<button disabled={!!recruitReason} title={recruitReason??'ใช้อาหาร 4'} onClick={()=>dispatch({type:'recruit'})}><UserPlus size={18}/>{recruitReason??'รับเพื่อน · อาหาร 4'}</button>:b==='kiln'&&!v.pots?<button disabled={!!v.craft||v.known.includes('pottery')&&!!potteryReason} onClick={()=>v.known.includes('pottery')?dispatch({type:'queue-craft',item:'pottery',now:Date.now()}):onRecipe('pottery')}><FlaskConical size={18}/>{v.craft?'โต๊ะงานไม่ว่าง':!v.known.includes('pottery')?'เรียนรู้ภาชนะ':potteryReason??'เข้าคิวทำภาชนะ · 90 วิ'}</button>:<button onClick={()=>onTab(status.tab)}><Users size={18}/>{b==='farm'||b==='lumber'?'จัดคนทำงาน':'ดูการใช้งาน'}</button>}
 <button aria-label="ย้ายอาคารฟรี" onClick={onMove}><Move size={18}/><span>ย้าย</span></button><button aria-label="รายละเอียดอาคาร" onClick={()=>onTab('object')}><ArrowUpRight size={18}/><span>เพิ่มเติม</span></button>
 </div></section>;
}
