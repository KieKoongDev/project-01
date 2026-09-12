import {useEffect,useRef,useState,type CSSProperties,type PointerEvent as ReactPointerEvent,type RefObject} from 'react';
import {BookOpen,ChevronLeft,ChevronRight,Package,Users} from 'lucide-react';
import {BUILD,TILES,JOB_NAMES,buildingStatus,type Building,type Decoration,type Village} from '../model';
import {LAND_NAMES,NODE_NAMES,nodeDuration} from '../land';
import {VillagerArt} from './VillagerArt';
import {ItemArt} from './ItemArt';
import type {SceneHandle} from './layout';

type Props={now:number;onResearch:()=>void;onNode:(id:string)=>void;v:Village;selected:number|null;placing:Building|null;decorating:Decoration|null;moving:number|null;onChoose:(tile:number)=>void;onPeople:()=>void;onMove:(from:number,to:number)=>void;handle:RefObject<SceneHandle|null>};
const tileStyle=(tile:number):CSSProperties=>{const local=tile%12,col=local%4,row=Math.floor(local/4);return {left:`${12.5+col*25}%`,top:`${39+row*20}%`};};

function BuildingButton({tile,kind,props}:{tile:number;kind:Building;props:Props}){
 const start=useRef<{x:number;y:number;drag:boolean}|null>(null);const status=buildingStatus(props.v,kind,tile);
 function down(e:ReactPointerEvent<HTMLButtonElement>){if(e.button!==0||props.placing||props.decorating||props.moving!==null)return;start.current={x:e.clientX,y:e.clientY,drag:false};e.currentTarget.setPointerCapture(e.pointerId);}
 function move(e:ReactPointerEvent<HTMLButtonElement>){if(start.current&&Math.hypot(e.clientX-start.current.x,e.clientY-start.current.y)>8){start.current.drag=true;e.currentTarget.classList.add('dragging');}}
 function up(e:ReactPointerEvent<HTMLButtonElement>){const s=start.current;e.currentTarget.classList.remove('dragging');start.current=null;if(!s)return;if(s.drag){const target=props.handle.current?.tileAt({x:e.clientX,y:e.clientY});if(target!==null&&target!==undefined)props.onMove(tile,target);}else props.onChoose(tile);}
 return <button data-map-tile={tile} className={'map2d-object '+(props.selected===tile?'selected':'')} style={tileStyle(tile)} onClick={e=>{if(e.detail===0)props.onChoose(tile);}} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={e=>{start.current=null;e.currentTarget.classList.remove('dragging');}} aria-label={`${BUILD[kind].name} · ${status.label}`}><ItemArt kind={kind}/><span>{BUILD[kind].name}</span>{['farm','kiln','lumber'].includes(kind)&&<small>{status.label}</small>}</button>;
}

export default function WorldMap2D(props:Props){
 const [page,setPage]=useState(0),[list,setList]=useState(false);const viewport=useRef<HTMLDivElement>(null),swipe=useRef<{x:number;y:number}|null>(null),lands=props.v.plots.length/12;
 useEffect(()=>{if(page>=lands)setPage(lands-1);},[lands,page]);
 useEffect(()=>{props.handle.current={tileAt:p=>{const tiles=viewport.current?.querySelectorAll<HTMLElement>('.map2d-tile')??[];for(const tile of tiles){const r=tile.getBoundingClientRect();const frame=viewport.current!.getBoundingClientRect();if(p.x>=frame.left&&p.x<=frame.right&&p.y>=frame.top&&p.y<=frame.bottom&&p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom)return Number(tile.dataset.mapTile);}return null;}};return()=>{props.handle.current=null;};},[props.handle]);
 function swipeStart(e:ReactPointerEvent<HTMLDivElement>){if((e.target as Element).closest('button'))return;swipe.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}
 function swipeEnd(e:ReactPointerEvent<HTMLDivElement>){if(!swipe.current)return;const dx=e.clientX-swipe.current.x,dy=e.clientY-swipe.current.y;swipe.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))setPage(p=>Math.max(0,Math.min(lands-1,p+(dx<0?1:-1))));}
 return <div ref={viewport} className="map2d-viewport" aria-label="แผนที่หมู่บ้าน 2D ลากซ้ายขวาเพื่อเปลี่ยนพื้นที่" onPointerDown={swipeStart} onPointerUp={swipeEnd} onPointerCancel={()=>{swipe.current=null;}}>
  <div className="map2d-canvas" style={{width:`${lands*100}%`,transform:`translateX(-${page*100/lands}%)`}}>{Array.from({length:lands},(_,chunk)=><section className={'map2d-land land-'+chunk} style={{width:`${100/lands}%`}} key={chunk} aria-label={LAND_NAMES[chunk]}>
   <div className="map2d-sky"><i/><i/><i/></div><div className="map2d-river"/><div className="map2d-path main"/><div className="map2d-path cross"/>
   {[7,19,31,69,82,92].map((x,i)=><span className={'map2d-tree tree-'+i} style={{left:x+'%',top:(i%2?28:9)+(i>3?15:0)+'%'}} key={x}><ItemArt kind="tree"/></span>)}
   {props.v.nodes.filter(n=>n.chunk===chunk).map((node,i)=>{const left=[20,50,80][i],ready=node.stored>0,leftMs=Math.max(0,node.readyAt-props.now),progress=Math.max(0,Math.min(100,100-leftMs/nodeDuration(node)*100));return <button className={'map2d-node '+(ready?'ready':'')} style={{left:left+'%',top:'22%'}} key={node.id} onClick={()=>props.onNode(node.id)} aria-label={`${NODE_NAMES[node.resource]} ${ready?'พร้อมเก็บ '+node.stored:`เหลือ ${Math.ceil(leftMs/1000)} วินาที`}`}><ItemArt kind={node.resource}/><span>{ready?<><Package size={13}/>{node.stored}</>:Math.ceil(leftMs/1000)+' วิ'}</span><i style={{width:progress+'%'}}/></button>;})}
   {chunk===0&&<button className={'map2d-research '+(props.v.research.length?'working':'')} onClick={props.onResearch}><span className="research-table"><BookOpen size={27}/><i/><i/></span><strong>โต๊ะค้นคว้า</strong><small>{props.v.research.length?`เหลือ ${Math.max(0,Math.ceil((props.v.research[0].finishAt-props.now)/1000))} วิ`:'รวมการ์ดเพื่อค้นพบ'}</small></button>}
   {TILES.slice(chunk*12,chunk*12+12).map((terrain,local)=>{const tile=chunk*12+local,occupied=props.v.plots[tile],show=!occupied&&(!!props.placing||props.moving!==null||!!props.decorating);return <button data-map-tile={tile} key={tile} className={'map2d-tile '+terrain+(show?' available':'')} style={tileStyle(tile)} onClick={()=>show&&props.onChoose(tile)} aria-label={`พื้นที่ ${tile+1} ${terrain==='forest'?'ใกล้ป่า':terrain==='river'?'ริมน้ำ':'ทุ่งหญ้า'}`}>{show&&<span>+</span>}</button>;})}
   {props.v.plots.slice(chunk*12,chunk*12+12).map((kind,local)=>kind&&<BuildingButton key={chunk*12+local+'-'+kind} tile={chunk*12+local} kind={kind} props={props}/>)}
   {props.v.decorations.slice(chunk*12,chunk*12+12).map((kind,local)=>kind&&<button key={'d-'+local} className="map2d-decoration" style={tileStyle(chunk*12+local)} onClick={()=>props.onChoose(chunk*12+local)} aria-label={'ของตกแต่ง '+kind}><ItemArt kind={kind}/></button>)}
   {chunk===0&&Array.from({length:props.v.people},(_,i)=><button className={'map2d-person person-'+i+(!!props.v.assignments[i]?' busy':'')} key={i} onClick={props.onPeople} aria-label={`${props.v.names[i]} ${props.v.assignments[i]?'กำลัง'+JOB_NAMES[props.v.assignments[i]!] :'ว่าง'}`}><VillagerArt index={i} job={props.v.assignments[i]}/><small>{props.v.names[i]}</small></button>)}
  </section>)}</div>
  <button className="map2d-list-button" aria-expanded={list} onClick={()=>setList(!list)}>รายการ</button>
  {list&&<div className="map2d-object-list"><button onClick={()=>setList(false)}>ปิด</button><button onClick={props.onResearch}>โต๊ะค้นคว้า</button><button onClick={props.onPeople}><Users size={15}/> จัดงานชาวบ้าน</button>{props.v.nodes.map(n=><button key={n.id} onClick={()=>props.onNode(n.id)}>{LAND_NAMES[n.chunk]} · {NODE_NAMES[n.resource]} · {n.stored}</button>)}</div>}
  <nav className="map2d-pagination" aria-label="เปลี่ยนพื้นที่"><button disabled={page===0} onClick={()=>setPage(page-1)} aria-label="พื้นที่ก่อนหน้า"><ChevronLeft size={18}/></button>{LAND_NAMES.slice(0,lands).map((name,i)=><button key={name} className={page===i?'active':''} aria-label={`ไป${name}`} aria-current={page===i?'page':undefined} onClick={()=>setPage(i)}>{i===page?name:'•'}</button>)}<button disabled={page===lands-1} onClick={()=>setPage(page+1)} aria-label="พื้นที่ถัดไป"><ChevronRight size={18}/></button></nav>
 </div>;
}
