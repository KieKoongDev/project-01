import {Component,useEffect,useRef,useState,type ReactNode,type RefObject} from 'react';
import {Canvas,useFrame,useThree,type ThreeEvent} from '@react-three/fiber';
import {Group,OrthographicCamera,Plane,Raycaster,Vector2,Vector3} from 'three';
import {Pause,Play,MapPin,Users,Droplets,FlaskConical,UserPlus} from 'lucide-react';
import {BUILD,TILES,assigned,buildingStatus,type Village,type Building,type Decoration} from '../model';
import {BuildingModel,DecorationModel,Tree,Villager} from './Models';
import {tilePosition,groundTile,type SceneHandle} from './layout';
import {worldHints,type WorldHint} from '../guidance';
const ground=new Plane(new Vector3(0,1,0),0);
type Props={v:Village;selected:number|null;placing:Building|null;decorating:Decoration|null;moving:number|null;onChoose:(tile:number)=>void;onPeople:()=>void;onMove:(from:number,to:number)=>void;handle:RefObject<SceneHandle|null>};
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?this.props.fallback:this.props.children;}}
function CameraAndClock({handle,animate}:{handle:Props['handle'];animate:boolean}){
 const {camera,size,gl,invalidate}=useThree();useEffect(()=>{const c=camera as OrthographicCamera;c.position.set(9,11,12);c.lookAt(0,.2,0);c.zoom=Math.min(size.width/14,size.height/10);c.updateProjectionMatrix();invalidate();},[camera,size.width,size.height,invalidate]);
 useEffect(()=>{const caster=new Raycaster(),xy=new Vector2(),point=new Vector3();handle.current={tileAt:p=>{const rect=gl.domElement.getBoundingClientRect();if(p.x<rect.left||p.x>rect.right||p.y<rect.top||p.y>rect.bottom)return null;xy.set((p.x-rect.left)/rect.width*2-1,-(p.y-rect.top)/rect.height*2+1);caster.setFromCamera(xy,camera);return caster.ray.intersectPlane(ground,point)?groundTile(point.x,point.z):null;}};return()=>{handle.current=null;};},[camera,gl,handle]);
 useEffect(()=>{if(!animate){invalidate();return;}const interval=setInterval(()=>{if(!document.hidden)invalidate();},1000/30);return()=>clearInterval(interval);},[animate,invalidate]);return null;
}
// DOM buttons stay accessible while their anchors follow the orthographic camera.
function HintAnchors({hints,elements}:{hints:WorldHint[];elements:RefObject<Map<number,HTMLButtonElement>>}){
 const {camera,size}=useThree();
 useFrame(()=>{const occupied:{x:number;y:number}[]=[];for(const hint of hints){const element=elements.current.get(hint.tile);if(!element)continue;const [x,,z]=tilePosition(hint.tile),p=new Vector3(x,1.65,z).project(camera);const left=(p.x+1)*size.width/2,top=(1-p.y)*size.height/2;const visible=left>=24&&left<=size.width-24&&top>=24&&top<=size.height-24&&!occupied.some(a=>Math.hypot(a.x-left,a.y-top)<50);element.style.visibility=visible?'visible':'hidden';element.style.transform=`translate(${left-22}px,${top-22}px)`;if(visible)occupied.push({x:left,y:top});}});
 return null;
}
function ObjectAt({tile,kind,motion,onChoose,onMove,selected}:{tile:number;kind:Building;motion:boolean;onChoose:Props['onChoose'];onMove:Props['onMove'];selected:boolean}){
 const model=useRef<Group>(null),start=useRef<{x:number;y:number;drag:boolean;pointer:number;ox:number;oz:number}|null>(null);const position=tilePosition(tile);
 function reset(){if(model.current)model.current.position.set(...position);start.current=null;}
 useEffect(()=>reset(),[tile,kind]);
 function down(e:ThreeEvent<PointerEvent>){if(e.button!==0)return;e.stopPropagation();const p=e.ray.intersectPlane(ground,new Vector3());start.current={x:e.clientX,y:e.clientY,drag:false,pointer:e.pointerId,ox:(p?.x??position[0])-position[0],oz:(p?.z??position[2])-position[2]};(e.target as Element).setPointerCapture(e.pointerId);}
 function move(e:ThreeEvent<PointerEvent>){const s=start.current;if(!s)return;e.stopPropagation();if(Math.hypot(e.clientX-s.x,e.clientY-s.y)<7&&!s.drag)return;s.drag=true;const p=new Vector3();if(e.ray.intersectPlane(ground,p)&&model.current)model.current.position.set(Math.max(-4,Math.min(4,p.x-s.ox)),.25,Math.max(-3,Math.min(3,p.z-s.oz)));}
 function up(e:ThreeEvent<PointerEvent>){const s=start.current;if(!s)return;e.stopPropagation();const p=new Vector3(),destination=e.ray.intersectPlane(ground,p)?groundTile(p.x-s.ox,p.z-s.oz):null;if((e.target as Element).hasPointerCapture(e.pointerId))(e.target as Element).releasePointerCapture(e.pointerId);reset();if(s.drag){if(destination!==null)onMove(tile,destination);}else onChoose(tile);}
 return <group><group ref={model} position={position} onClick={e=>e.stopPropagation()} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={reset}><BuildingModel kind={kind} motion={motion}/></group>{selected&&<mesh position={[position[0],.025,position[2]]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.85,.93,48]}/><meshBasicMaterial color="#e7ad65"/></mesh>}</group>;
}
function World(props:Props&{motion:boolean;hints:WorldHint[];elements:RefObject<Map<number,HTMLButtonElement>>}){
 const {v,placing,decorating,moving,onChoose,onMove,selected,motion}=props;const intended=placing??(moving!==null?v.plots[moving]:null);
 return <><HintAnchors hints={props.hints} elements={props.elements}/><CameraAndClock handle={props.handle} animate={motion}/><ambientLight intensity={1.6}/><hemisphereLight args={['#fff4da','#a9b68c',1.5]}/><directionalLight position={[-5,10,5]} intensity={2.3} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-9} shadow-normalBias={.04}/>
 <mesh position={[0,-.34,0]} receiveShadow><boxGeometry args={[9.5,.65,7.2]}/><meshStandardMaterial color="#c9c3a0"/></mesh><mesh position={[0,-.035,0]} receiveShadow><boxGeometry args={[9.5,.07,7.2]}/><meshStandardMaterial color="#c9d7b3"/></mesh>
 <mesh position={[4.1,.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[1.2,7.2]}/><meshStandardMaterial color="#a6ccc6" roughness={.6}/></mesh>
 {[-2.7,-1.5,0,1.6,2.7].map((z,i)=><mesh key={z} position={[4.12,.02,z]} rotation={[-Math.PI/2,0,.2]}><planeGeometry args={[.6,.03]}/><meshBasicMaterial color="#d6e9df"/></mesh>)}
 <mesh position={[0,.008,0]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[7.8,.25]}/><meshStandardMaterial color="#ddd1b1"/></mesh>
 {[-2.8,-.9,1.1,2.7].map((z,i)=><group key={z} position={[-4.15,0,z]} onClick={e=>{e.stopPropagation();props.onPeople();}}><Tree scale={.8+i%2*.2} motion={motion}/></group>)}
 {TILES.map((terrain,i)=>{const [x,,z]=tilePosition(i);const show=decorating?!v.decorations[i]:intended&&!v.plots[i]&&(!BUILD[intended].terrain||BUILD[intended].terrain===terrain);return <group key={i}><mesh position={[x,.015,z]} rotation={[-Math.PI/2,0,0]} onClick={e=>{e.stopPropagation();if(e.delta<7)onChoose(i);}}><planeGeometry args={[1.85,1.85]}/><meshBasicMaterial color={show?'#f4e5b4':'#ffffff'} transparent opacity={show ? .45 : 0} depthWrite={false}/></mesh>{show&&<mesh position={[x,.022,z]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.69,.72,40]}/><meshBasicMaterial color="#809e6c"/></mesh>}</group>;})}
 {v.plots.map((b,i)=>b&&<ObjectAt key={i+'-'+b} kind={b} tile={i} motion={motion} onChoose={onChoose} onMove={onMove} selected={selected===i}/>)}
 {v.decorations.map((d,i)=>d&&<group key={i} position={[tilePosition(i)[0]-.48,.04,tilePosition(i)[2]+.42]} scale={.8} onClick={e=>{e.stopPropagation();onChoose(i);}}><DecorationModel kind={d} motion={motion}/></group>)}
 {Array.from({length:v.people},(_,i)=><group key={i} onClick={e=>{e.stopPropagation();props.onPeople();}}><Villager index={i} motion={motion} working={i<assigned(v)}/></group>)}
 </>;
}
export default function WorldScene(props:Props){
 const [motion,setMotion]=useState(true),[reduced,setReduced]=useState(false),[list,setList]=useState(false),[visible,setVisible]=useState(true),[lost,setLost]=useState(false);const host=useRef<HTMLDivElement>(null);const elements=useRef(new Map<number,HTMLButtonElement>());const hints=props.placing||props.decorating||props.moving!==null?[]:worldHints(props.v).filter(h=>h.tile!==props.selected);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),changed=()=>setReduced(q.matches);changed();q.addEventListener('change',changed);const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));if(host.current)observer.observe(host.current);return()=>{q.removeEventListener('change',changed);observer.disconnect();};},[]);
 const fallback=<div className="world-fallback"><p>อุปกรณ์นี้เปิดฉาก 3D ไม่ได้ ใช้รายการวัตถุด้านล่างเพื่อเล่นต่อ</p><button onClick={()=>setList(true)}>เปิดรายการวัตถุ</button></div>;
 return <div ref={host} className="three-world" aria-label="หมู่บ้าน 2.5D แบบโต้ตอบ"><SceneBoundary fallback={fallback}>{lost?fallback:<Canvas orthographic frameloop="demand" dpr={[1,1.5]} shadows camera={{position:[9,11,12],near:.1,far:100,zoom:40}} gl={{antialias:true,alpha:true,powerPreference:'low-power'}} fallback={fallback} onCreated={({gl})=>{gl.domElement.setAttribute('aria-label','ฉากหมู่บ้าน: แตะอาคารเพื่อใช้งาน หรือลากเพื่อย้าย');gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();setLost(true);},{once:true});}}><World {...props} hints={hints} elements={elements} motion={motion&&!reduced&&visible}/></Canvas>}</SceneBoundary>
 <div className="scene-tools"><button className="icon-button" aria-label="รายการวัตถุและพื้นที่" aria-expanded={list} onClick={()=>setList(!list)}><MapPin size={18}/></button><button className="icon-button" disabled={reduced} aria-label={motion?'พักการเคลื่อนไหว':'เปิดการเคลื่อนไหว'} onClick={()=>setMotion(!motion)}>{motion&&!reduced?<Pause size={18}/>:<Play size={18}/>}</button></div>
 {!lost&&!list&&<div className="world-hints" aria-label="สิ่งที่หมู่บ้านต้องการ">{hints.map(h=>{const Icon={people:Users,water:Droplets,craft:FlaskConical,welcome:UserPlus}[h.kind];return <button key={h.tile} ref={el=>{if(el)elements.current.set(h.tile,el);else elements.current.delete(h.tile);}} className={'world-hint '+h.kind} style={{visibility:'hidden'}} aria-label={h.label} title={h.label} onClick={()=>props.onChoose(h.tile)}><Icon size={21}/></button>;})}</div>}

 {list&&<div className="scene-object-list"><button onClick={()=>setList(false)}>ปิดรายการ</button><button onClick={()=>{props.onPeople();setList(false);}}>เลือกชาวบ้านและจัดงาน</button>{TILES.map((t,i)=><button key={i} onClick={()=>{props.onChoose(i);setList(false);}}>{i+1} · {props.v.plots[i]?BUILD[props.v.plots[i]!].name:t==='forest'?'พื้นที่ใกล้ป่า':t==='river'?'พื้นที่ริมน้ำ':'พื้นที่ว่าง'}</button>)}</div>}
 </div>;
}
