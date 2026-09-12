import {eras,weather,stages,featureNames} from '@/i18n/th';
import {memo,useEffect,useMemo,useRef,useState} from 'react';
import {Map as MapIcon,Pause,Play,ChevronRight} from 'lucide-react';
import {deriveCity,FEATURE_INFO,type CityFeature} from '@/civilization/model';
import {cityObjects,drawCity,type Hotspot} from '@/civilization/render';
import type {Card,Era} from '@/game/engine';
export const CivilizationView=memo(function CivilizationView({cards,era,event,mode}:{cards:Card[];era:Era;event:string;mode:string}){
 const city=useMemo(()=>deriveCity(cards,era,event),[cards,era,event]);
 const canvas=useRef<HTMLCanvasElement>(null),host=useRef<HTMLDivElement>(null),hotspots=useRef<Hotspot[]>([]);
 const [motion,setMotion]=useState(true),[reduced,setReduced]=useState(false),[supported,setSupported]=useState(true),[selected,setSelected]=useState<CityFeature|null>(null);
 const latest=useRef(city);latest.current=city;
 const clock=useRef(0),births=useRef(new Map<string,number>()),previousKey=useRef(mode+era),initialized=useRef(false);
 useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);update();m.addEventListener('change',update);try{setMotion(localStorage.getItem('paperbound-city-motion')!=='off');}catch{}return()=>m.removeEventListener('change',update);},[]);
 useEffect(()=>{if(previousKey.current!==mode+era){births.current.clear();initialized.current=false;previousKey.current=mode+era;}},[mode,era]);
 useEffect(()=>{
  const el=canvas.current,container=host.current;if(!el||!container)return;const ctx=el.getContext('2d');if(!ctx){setSupported(false);return;}
  let frame=0,lastFrame=0,lastTime=0,visible=true,disposed=false;const animate=motion&&!reduced;
  function paint(timestamp:number){if(disposed)return;const model=latest.current,objects=cityObjects(model);const scales=new Map<string,number>();const ids=new Set(objects.map(o=>o.id));
   for(const id of births.current.keys())if(!ids.has(id))births.current.delete(id);
   for(const o of objects){if(!births.current.has(o.id))births.current.set(o.id,initialized.current?clock.current:-1000);const age=clock.current-births.current.get(o.id)!;scales.set(o.id,!animate?1:Math.min(1,Math.max(.05,1-Math.pow(1-Math.min(1,age/.65),3))));}
   initialized.current=true;ctx!.setTransform(el!.width/480,0,0,el!.height/300,0,0);hotspots.current=drawCity(ctx!,model,clock.current,objects,scales);
  }
  function loop(t:number){if(disposed||document.hidden||!visible){frame=0;return;}if(!lastTime)lastTime=t;const delta=Math.min(.05,(t-lastTime)/1000);lastTime=t;
   if(animate)clock.current+=delta;
   if(t-lastFrame>=1000/30){paint(t);lastFrame=t;}
   if(animate)frame=requestAnimationFrame(loop);else frame=0;
  }
  function wake(){cancelAnimationFrame(frame);lastTime=0;if(!disposed&&!document.hidden&&visible){paint(performance.now());if(animate)frame=requestAnimationFrame(loop);}}
  function resize(){const box=container!.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);el!.width=Math.max(1,Math.round(box.width*dpr));el!.height=Math.max(1,Math.round(box.height*dpr));wake();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;wake();},{threshold:0});intersection.observe(container);
  document.addEventListener('visibilitychange',wake);resize();
  return()=>{disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',wake);};
 },[motion,reduced,city.signature,city.xp]);
 function toggleMotion(){setMotion(v=>{try{localStorage.setItem('paperbound-city-motion',v?'off':'on');}catch{}return !v;});}
 const sources:Record<CityFeature,string>={fire:'ค้นพบไฟ',shelter:'ค้นพบเพิงพักหรือบ้าน',nature:'ค้นพบต้นอ่อน สวน หรือป่า',farming:'ค้นพบสวนหรือไร่นา',pottery:'ค้นพบเครื่องปั้นดินเผาและไฟ',boats:'ค้นพบแพ',metallurgy:'เปิดยุคสำริด แล้วค้นพบเตาหลอมและโลหะ'};
 return <section className="civilization" aria-label="อารยธรรมที่กำลังเติบโต"><div className="city-header"><div><span><MapIcon size={14}/> {eras[era]} · {weather[event]}</span><h2>{stages[city.stage]}</h2></div><button className="icon-button" aria-label={motion?'พักภาพเคลื่อนไหว':'เปิดภาพเคลื่อนไหว'} aria-pressed={motion&&!reduced} disabled={reduced} onClick={toggleMotion}>{motion&&!reduced?<Pause size={17}/>:<Play size={17}/>}</button></div><div className="city-stage"><div className="city-canvas" ref={host}><canvas ref={canvas} width="480" height="300" role="img" aria-label={`${stages[city.stage]} บ้าน ${city.homes} หลัง ไร่นา ${city.fields} แปลง ต้นไม้ ${city.trees} ต้น`} onClick={e=>{const rect=e.currentTarget.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*480,y=(e.clientY-rect.top)/rect.height*300;const hit=[...hotspots.current].sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];if(hit&&Math.hypot(hit.x-x,hit.y-y)<35)setSelected(hit.feature);}}/>{!supported&&<p>แสดงฉากไม่ได้ แต่ความคืบหน้ายังทำงาน: {city.xp} XP</p>}</div></div><div className="city-bottom"><div className="city-progress"><div><b>ระดับ {city.stage+1} · {city.xp} XP</b><span>{city.next?`${city.next.xp} XP → ${stages[city.stage+1]}`:'ถึงขั้นสูงสุดของต้นแบบแล้ว'}</span></div><progress value={city.next?city.next.progress:1} max="1" aria-label="ความคืบหน้าของเมือง"/>{city.next&&<small>{city.next.requirements.slice(1).some(r=>!r.met)?['','ต้องค้นพบไฟ','ต้องค้นพบเพิงพักหรือบ้าน','ต้องค้นพบสวนหรือไร่นา','ต้องเปิดยุคสำริดและค้นพบเตาหลอมกับโลหะ'][city.stage+1]:'สะสม XP จากการค้นพบใหม่เพื่อให้เมืองเติบโต'}</small>}</div><div className="city-features" aria-label="สิ่งแวดล้อมที่ปลดล็อก">{(Object.keys(FEATURE_INFO) as CityFeature[]).map(key=><button key={key} aria-pressed={selected===key} onClick={()=>setSelected(selected===key?null:key)}>{city.features[key]?'✓':'○'} {featureNames[key]}</button>)}</div>{selected&&<p className="city-feature-detail" role="status">{city.features[selected]?'✓ เปิดแล้ว':'○ ยังไม่เปิด'} · {sources[selected]} <button onClick={()=>setSelected(null)} aria-label="ปิดรายละเอียด">×</button></p>}</div></section>;
});
