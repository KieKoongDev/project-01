import {useEffect,useRef,useState} from 'react';
import {Briefcase,GripVertical,Users} from 'lucide-react';
import {VillagerArt,WORKPLACE} from './scene/VillagerArt';
import {ItemArt} from './scene/ItemArt';
import {JOBS,JOB_NAMES,assigned,has,type Action,type Job,type Village} from './model';

const output=(v:Village,j:Job)=>j==='forage'?'อาหาร +3 / รอบ':j==='wood'?`ไม้ +${2+Number(v.axe)+Number(has(v,'lumber'))} / รอบ`:j==='stone'?'หิน +2 / รอบ':j==='clay'?'ดิน +2 / รอบ':j==='water'?`น้ำ +${3+Number(v.pots)} / รอบ`:'น้ำ −2 → อาหาร +6 / รอบ / แปลง';

export function PeopleBoard({v,dispatch}:{v:Village;dispatch:(a:Action)=>void}){
 const [selected,setSelected]=useState<number|null>(null),[dragging,setDragging]=useState<number|null>(null);const start=useRef<{person:number;x:number;y:number}|null>(null),didDrag=useRef(false);
 useEffect(()=>{const move=(e:PointerEvent)=>{if(start.current&&Math.hypot(e.clientX-start.current.x,e.clientY-start.current.y)>9){didDrag.current=true;setDragging(start.current.person);}};const up=(e:PointerEvent)=>{if(start.current&&didDrag.current){const target=document.elementsFromPoint(e.clientX,e.clientY).find(el=>el instanceof HTMLElement&&el.dataset.job!==undefined) as HTMLElement|undefined;if(target){const job=target.dataset.job as Job;dispatch({type:'assign-person',person:start.current.person,job});setSelected(null);}}start.current=null;didDrag.current=false;setDragging(null);};document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);return()=>{document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);};},[dispatch]);
 function assign(job:Job){if(selected===null)return;dispatch({type:'assign-person',person:selected,job});setSelected(null);}
 return <><div className="people-roster" aria-label="เลือกชาวบ้านเพื่อมอบหมายงาน">{Array.from({length:v.people},(_,i)=>{const job=v.assignments[i];return <button key={i} className={'person-card '+(selected===i?'selected ':'')+(dragging===i?'dragging':'')} aria-pressed={selected===i} onClick={()=>setSelected(selected===i?null:i)} onPointerDown={e=>{if(e.button!==0)return;didDrag.current=false;start.current={person:i,x:e.clientX,y:e.clientY};setSelected(i);}}><span className="person-avatar"><VillagerArt index={i} job={job}/></span><span><strong>{v.names[i]}</strong><small>{job?'ประจำงาน · '+JOB_NAMES[job]:'ว่าง · เลือกงานได้'}</small></span><GripVertical size={18}/></button>;})}</div>
 <p className="people-instruction"><Users size={16}/>{selected===null?'แตะชาวบ้าน แล้วแตะงาน · หรือลากการ์ดไปวาง':'เลือกงานให้ '+v.names[selected]}</p>
 <div className="job-board">{JOBS.map(j=>{const unavailable=j==='farm'&&!v.plots.includes('farm');return <button key={j} data-job={j} className="job-card" disabled={unavailable} onClick={()=>assign(j)}><ItemArt kind={WORKPLACE[j]}/><span><strong>{JOB_NAMES[j]}</strong><small>{output(v,j)}</small><em>{v.jobs[j]} คน · ทำต่อขณะ AFK</em></span></button>;})}</div>
 <button className="rest-worker" disabled={selected===null||v.assignments[selected]===null} onClick={()=>{if(selected!==null)dispatch({type:'assign-person',person:selected,job:null});}}>ให้คนที่เลือกพักงาน</button>
 <small className="afk-note"><Briefcase size={14}/> ทำงานแล้ว {assigned(v)}/{v.people} คน · ผลผลิตเข้าคลังอัตโนมัติทุก 30 วินาที</small></>;
}
