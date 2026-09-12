import type {CityModel,CityFeature} from './model.ts';
type Point={x:number;y:number};
export type Hotspot={feature:CityFeature;x:number;y:number};
export type SceneObject={id:string;x:number;y:number;kind:'tree'|'home'|'field'|'fire'|'kiln'|'forge'|'rock';feature?:CityFeature};
export function cityObjects(city:CityModel):SceneObject[]{
 const objects:SceneObject[]=[{id:'rock1',x:-2.7,y:-1.8,kind:'rock'},{id:'rock2',x:2.9,y:1.1,kind:'rock'}];
 const trees=[[-3,-1],[-2.1,-2.8],[-1.1,-3],[.1,-2.9],[1.2,-2.7],[-3,0],[-2.9,1],[2.6,-1.9]];
 for(let i=0;i<city.trees;i++)objects.push({id:'tree'+i,x:trees[i][0],y:trees[i][1],kind:'tree',feature:'nature'});
 const homes=[[-1.5,-.9],[-.2,-1.6],[1.15,-1.3],[1.75,.15]];
 for(let i=0;i<city.homes;i++)objects.push({id:'home'+i,x:homes[i][0],y:homes[i][1],kind:'home',feature:'shelter'});
 for(let i=0;i<city.fields;i++)objects.push({id:'field'+i,x:-2.2+i*.9,y:1.2,kind:'field',feature:'farming'});
 if(city.features.fire)objects.push({id:'fire',x:0,y:0,kind:'fire',feature:'fire'});
 if(city.features.pottery)objects.push({id:'kiln',x:1.8,y:1.2,kind:'kiln',feature:'pottery'});
 if(city.features.metallurgy)objects.push({id:'forge',x:2,y:-1.5,kind:'forge',feature:'metallurgy'});
 return objects.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
}
const project=(x:number,y:number,z=0):Point=>({x:240+(x-y)*31,y:160+(x+y)*15-z});
export function drawCity(ctx:CanvasRenderingContext2D,city:CityModel,seconds:number,objects:SceneObject[],scales:Map<string,number>):Hotspot[]{
 const hotspots:Hotspot[]=[];const cold=city.event==='cold',wet=city.event==='rain';
 ctx.clearRect(0,0,480,300);
 const sky=ctx.createLinearGradient(0,0,0,300);sky.addColorStop(0,cold?'#e1e9e6':wet?'#dae6df':'#eaf0dd');sky.addColorStop(1,'#f6f1e3');ctx.fillStyle=sky;ctx.fillRect(0,0,480,300);
 function polygon(points:Point[],fill:string,stroke?:string){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke();}}
 function ellipse(x:number,y:number,rx:number,ry:number,fill:string){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();}
 function line(a:Point,b:Point,color:string,width=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
 const corners=[project(-3.7,-3.7),project(3.7,-3.7),project(3.7,3.7),project(-3.7,3.7)];
 ellipse(240,226,185,53,'#5c6a4512');
 polygon([corners[3],corners[2],{x:corners[2].x,y:corners[2].y+16},{x:corners[3].x,y:corners[3].y+16}],'#c5b795');
 polygon([corners[1],corners[2],{x:corners[2].x,y:corners[2].y+16},{x:corners[1].x,y:corners[1].y+16}],'#b1a583');
 polygon(corners,cold?'#dce1cf':'#cbd6a5','#afbd8d');
 // Terrain patches, independent of animation time.
 for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++){const p=project(x,y);polygon([p,project(x+.83,y),project(x+.83,y+.83),project(x,y+.83)],(x+y)%3===0?(cold?'#e8e9dc':'#d5deb7'):(cold?'#d9dfcf':'#c5d09f'));}
 // The river crosses the front edge of the island.
 polygon([project(-3.7,2.25),project(3.7,2.25),project(3.7,3.15),project(-3.7,3.15)],'#86b8b4');
 line(project(-3.7,2.22),project(3.7,2.22),'#d8ddbe',3);
 for(let i=0;i<16;i++){const phase=((i*.61+seconds*.12)%7.1)-3.55;const p=project(phase,2.45+(i%3)*.21);line(p,{x:p.x+7,y:p.y+3},'#d5e9d2',1.1);}
 // Warm paper paths appear only when a camp has been established.
 if(city.features.fire){line(project(-2.5,0),project(2.4,0),'#ded1a8',9);line(project(0,-2),project(0,2.1),'#ded1a8',8);}
 function smoke(p:Point,amount:number){for(let i=0;i<amount;i++){const f=(seconds*.28+i/amount)%1;ctx.globalAlpha=(1-f)*.32;ellipse(p.x+Math.sin(f*5+seconds)*7,p.y-f*35,3+f*5,2+f*4,'#ede8dc');}ctx.globalAlpha=1;}
 for(const o of objects){const p=project(o.x,o.y),scale=scales.get(o.id)??1;ctx.save();ctx.translate(p.x,p.y);ctx.scale(scale,scale);ctx.translate(-p.x,-p.y);ellipse(p.x+3,p.y+3,o.kind==='tree'?13:20,6,'#50604020');
  if(o.kind==='tree'){const sway=Math.sin(seconds*1.35+o.x)*1.8;line(p,{x:p.x,y:p.y-28},'#826b44',4);polygon([{x:p.x-16+sway,y:p.y-13},{x:p.x+sway,y:p.y-52},{x:p.x+17+sway,y:p.y-13}],cold?'#91a494':'#64845b');polygon([{x:p.x+sway,y:p.y-52},{x:p.x+17+sway,y:p.y-13},{x:p.x+1+sway,y:p.y-18}],cold?'#afbeaf':'#87a16a');if(cold)polygon([{x:p.x-8+sway,y:p.y-33},{x:p.x+sway,y:p.y-52},{x:p.x+8+sway,y:p.y-33}],'#eef0e3');}
  if(o.kind==='home'||o.kind==='forge'){
   const forge=o.kind==='forge',h=forge?23:18,w=forge?21:18;
   polygon([{x:p.x-w,y:p.y-h},{x:p.x,y:p.y-h+9},{x:p.x,y:p.y+7},{x:p.x-w,y:p.y-2}],forge?'#a58d6c':'#e4d1a4');
   polygon([{x:p.x,y:p.y-h+9},{x:p.x+w,y:p.y-h},{x:p.x+w,y:p.y-2},{x:p.x,y:p.y+7}],forge?'#847d61':'#c5b58e');
   polygon([{x:p.x-w-4,y:p.y-h},{x:p.x-3,y:p.y-h-20},{x:p.x+w+3,y:p.y-h},{x:p.x,y:p.y-h+12}],forge?'#986c51':'#bda371');
   polygon([{x:p.x-3,y:p.y-h-20},{x:p.x+w+3,y:p.y-h},{x:p.x,y:p.y-h+12}],forge?'#b47e53':'#d9bb7c');
   polygon([{x:p.x+5,y:p.y-7},{x:p.x+11,y:p.y-10},{x:p.x+11,y:p.y+1},{x:p.x+5,y:p.y+4}],forge?'#e8a04c':'#6e7258');
   if(forge){polygon([{x:p.x+10,y:p.y-27},{x:p.x+17,y:p.y-30},{x:p.x+17,y:p.y-51},{x:p.x+10,y:p.y-48}],'#85765c');smoke({x:p.x+13,y:p.y-53},4);}
  }
  if(o.kind==='field'){polygon([project(o.x-.32,o.y-.38),project(o.x+.4,o.y-.38),project(o.x+.4,o.y+.4),project(o.x-.32,o.y+.4)],'#af9671');for(let j=0;j<3;j++)for(let k=0;k<3;k++){const q=project(o.x-.2+j*.2,o.y-.2+k*.2);line(q,{x:q.x+Math.sin(seconds*1.4+j)*1.3,y:q.y-7},cold?'#bbc8a0':'#788b42',2);}}
  if(o.kind==='fire'){for(let j=0;j<6;j++){const a=j*Math.PI/3;ellipse(p.x+Math.cos(a)*9,p.y+Math.sin(a)*4,4,3,'#a4a18a');}const f=Math.sin(seconds*9)*2;ellipse(p.x,p.y-2,15,7,'#e6b85328');polygon([{x:p.x-6,y:p.y-2},{x:p.x-3,y:p.y-12},{x:p.x+2,y:p.y-21-f},{x:p.x+7,y:p.y-5},{x:p.x+4,y:p.y}], '#d57f42');polygon([{x:p.x-3,y:p.y-2},{x:p.x+1,y:p.y-14-f},{x:p.x+4,y:p.y-2}], '#f2c867');smoke({x:p.x,y:p.y-23},4);}
  if(o.kind==='kiln'){ellipse(p.x,p.y-8,13,13,'#be9570');ellipse(p.x,p.y+1,13,5,'#a97d5e');ellipse(p.x+1,p.y-3,5,6,'#685b44');ellipse(p.x+1,p.y-2,3,3,'#eab265');smoke({x:p.x,y:p.y-22},3);}
  if(o.kind==='rock')polygon([{x:p.x-9,y:p.y},{x:p.x-6,y:p.y-9},{x:p.x+3,y:p.y-13},{x:p.x+10,y:p.y-3},{x:p.x+5,y:p.y+3}],'#a6ae99');
  ctx.restore();if(o.feature&&!hotspots.some(h=>h.feature===o.feature))hotspots.push({feature:o.feature,x:p.x,y:p.y-14});
 }
 if(city.features.boats){const x=Math.sin(seconds*.17)*2.2,p=project(x,2.65);polygon([{x:p.x-15,y:p.y-4},{x:p.x+2,y:p.y-11},{x:p.x+17,y:p.y-4},{x:p.x,y:p.y+3}],'#ae8d5e');for(let j=0;j<4;j++)line({x:p.x-10+j*5,y:p.y-5-j*.1},{x:p.x+j*5,y:p.y},'#d2b384',2);line({x:p.x+4,y:p.y-5},{x:p.x+4,y:p.y-24},'#7e6c48',1.5);hotspots.push({feature:'boats',x:p.x,y:p.y-8});}
 for(let i=0;i<city.people;i++){const phase=seconds*.18+i*.9;const p=project(Math.sin(phase)*1.2,Math.cos(phase*.8+i)*.6);ellipse(p.x,p.y+2,3,1.5,'#62715030');line({x:p.x,y:p.y-7},{x:p.x,y:p.y-1},i%2?'#bd8458':'#6d8877',3);ellipse(p.x,p.y-10,2.5,2.7,'#c69d75');const step=Math.sin(seconds*5+i)*1.6;line({x:p.x-1,y:p.y},{x:p.x-1+step,y:p.y+3},'#6f654d',1);line({x:p.x+1,y:p.y},{x:p.x+1-step,y:p.y+3},'#6f654d',1);}
 if(wet||cold){ctx.save();for(let i=0;i<26;i++){const x=(i*79.3+seconds*(cold?4:10))%480,y=(i*53.1+seconds*(cold?15:90))%280;ctx.globalAlpha=cold?.6:.24;if(cold)ellipse(x,y,1.4,1.4,'#fff');else line({x,y},{x:x-3,y:y+9},'#628b8b',1);}ctx.restore();}
 return hotspots;
}
