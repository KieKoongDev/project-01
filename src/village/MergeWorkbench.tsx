import {useEffect,useRef,useState,type Dispatch,type PointerEvent as ReactPointerEvent,type SetStateAction} from 'react';
import {Grip,Plus,Sparkles} from 'lucide-react';
import {LABEL,RESOURCES,type Recipe,type Resource,type Village} from './model';
import {ItemArt} from './scene/ItemArt';

type Props={v:Village;pair:Resource[];setPair:Dispatch<SetStateAction<Resource[]>>;candidate:Recipe|null;duration:number|null;disabled:boolean;onMerge:()=>boolean};
function ResourceCard({resource,v,onPick,onDrop}:{resource:Resource;v:Village;onPick:()=>void;onDrop:(slot:number)=>void}){
 const start=useRef<{x:number;y:number;drag:boolean}|null>(null),ghost=useRef<HTMLDivElement|null>(null),suppress=useRef(false);
 function cleanup(){ghost.current?.remove();ghost.current=null;start.current=null;}
 useEffect(()=>cleanup,[]);
 function down(e:ReactPointerEvent<HTMLButtonElement>){if(e.button!==0)return;start.current={x:e.clientX,y:e.clientY,drag:false};e.currentTarget.setPointerCapture(e.pointerId);}
 function move(e:ReactPointerEvent<HTMLButtonElement>){const s=start.current;if(!s)return;if(!s.drag&&Math.hypot(e.clientX-s.x,e.clientY-s.y)>7){s.drag=true;const g=document.createElement('div');g.className='merge-card-ghost';g.innerHTML=e.currentTarget.innerHTML;document.body.appendChild(g);ghost.current=g;}if(s.drag&&ghost.current){ghost.current.style.left=e.clientX-39+'px';ghost.current.style.top=e.clientY-48+'px';}}
 function up(e:ReactPointerEvent<HTMLButtonElement>){const dragged=start.current?.drag;if(dragged){suppress.current=true;const slot=document.elementsFromPoint(e.clientX,e.clientY).find(el=>(el as HTMLElement).dataset?.mergeSlot!==undefined) as HTMLElement|undefined;if(slot)onDrop(Number(slot.dataset.mergeSlot));}cleanup();}
 return <button className="merge-resource-card" disabled={!v.stock[resource]} onClick={()=>{if(suppress.current){suppress.current=false;return;}onPick();}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cleanup}><ItemArt kind={resource}/><strong>{LABEL[resource]}</strong><small>{v.stock[resource]}</small><Grip size={14}/></button>;
}

export function MergeWorkbench({v,pair,setPair,candidate,duration,disabled,onMerge}:Props){
 const [merging,setMerging]=useState(false),timer=useRef(0);useEffect(()=>()=>clearTimeout(timer.current),[]);function place(resource:Resource,slot?:number){setPair(old=>slot===undefined?(old.length<2?[...old,resource]:[resource]):slot===0?[resource,...old.slice(1)]:old.length?[old[0],resource]:[resource]);}
 function merge(){if(!onMerge())return;setMerging(true);timer.current=window.setTimeout(()=>{setMerging(false);setPair([]);},520);}
 return <div className={'merge-workbench '+(merging?'merging':'')}>
  <div className="merge-stage" aria-label="วางการ์ดสองใบเพื่อรวม">{[0,1].map(i=><button data-merge-slot={i} className={'merge-slot slot-'+i+(pair[i]?' filled':'')} key={i} onClick={()=>setPair(old=>old.filter((_,n)=>n!==i))} aria-label={`ช่องผสม ${i+1}${pair[i]?' '+LABEL[pair[i]]:''}`}>{pair[i]?<><ItemArt kind={pair[i]}/><strong>{LABEL[pair[i]]}</strong><small>แตะเพื่อนำออก</small></>:<><span>?</span><small>ลากหรือแตะการ์ด</small></>}</button>)}<span className="merge-plus"><Plus/></span><div className="merge-result"><Sparkles/><strong>{merging?'กำลังค้นคว้า…':pair.length===2?(candidate?'สิ่งใหม่?':'คู่นี้เคยลองแล้ว'):'ผลการค้นพบ'}</strong><small>{candidate&&duration?`${duration/1000} วินาที`:'เลือก 2 ใบ'}</small></div></div>
  <div className="merge-tray" aria-label="การ์ดวัตถุดิบ เลื่อนซ้ายขวาได้">{RESOURCES.map(r=><ResourceCard key={r} resource={r} v={v} onPick={()=>place(r)} onDrop={slot=>place(r,slot)}/>)}</div>
  <button className="merge-action" disabled={disabled||merging} onClick={merge}>{merging?'การ์ดกำลังรวมกัน…':candidate?'รวมการ์ดและเริ่มวิจัย':'เลือกคู่ใหม่ที่ยังไม่เคยค้นพบ'}</button>
 </div>;
}
