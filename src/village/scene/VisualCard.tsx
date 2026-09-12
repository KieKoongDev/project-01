import {useEffect,useRef} from 'react';
import {Grip,LockKeyhole} from 'lucide-react';
import {ItemArt,type ArtKind} from './ItemArt';
import type {ScreenPoint} from './layout';
export function VisualCard({kind,name,cost,locked=false,onSelect,onDragStart,onDrop}:{kind:ArtKind;name:string;cost?:string;locked?:boolean;onSelect:()=>void;onDragStart?:()=>void;onDrop?:(p:ScreenPoint)=>void}){
 const start=useRef<{x:number;y:number;drag:boolean}|null>(null),ghost=useRef<HTMLElement|null>(null),suppress=useRef(false),frame=useRef(0);
 function cleanup(){cancelAnimationFrame(frame.current);ghost.current?.remove();ghost.current=null;start.current=null;}
 useEffect(()=>cleanup,[]);
 return <button className={'visual-card '+(locked?'locked':'')} onClick={()=>{if(suppress.current){suppress.current=false;return;}onSelect();}} aria-label={`${name}${locked?' ยังไม่เปิดสูตร':''}${cost?' · '+cost:''}`} onPointerDown={e=>{if(!onDrop||locked||e.button!==0)return;if(e.pointerType==='touch'&&!(e.target as Element).closest('[data-card-grip]'))return;suppress.current=false;start.current={x:e.clientX,y:e.clientY,drag:false};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{const s=start.current;if(!s)return;if(!s.drag&&Math.hypot(e.clientX-s.x,e.clientY-s.y)>7){s.drag=true;onDragStart?.();const g=e.currentTarget.cloneNode(true) as HTMLElement;g.classList.add('card-drag-ghost');g.setAttribute('aria-hidden','true');g.style.width='106px';document.body.appendChild(g);ghost.current=g;}if(s.drag){const x=e.clientX,y=e.clientY;cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(()=>{if(ghost.current){ghost.current.style.left=x-53+'px';ghost.current.style.top=y-70+'px';}});}}} onPointerUp={e=>{if(start.current?.drag){suppress.current=true;onDrop?.({x:e.clientX,y:e.clientY});}cleanup();}} onPointerCancel={cleanup}>
 {locked&&<LockKeyhole className="card-lock" size={14}/>}<ItemArt kind={kind}/><strong>{name}</strong>{cost&&<small>{cost}</small>}{onDrop&&!locked&&<span className="card-grip" data-card-grip title="ลากจากจุดจับเพื่อวาง"><Grip size={18}/></span>}
 </button>;
}
