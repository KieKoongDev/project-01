import {useRef,type RefObject} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import {Vector3} from 'three';
import {Tree} from './Models';
import {nodePosition,type ResourceNode} from '../land';
export function ResourceNodes({nodes,motion,onChoose,elements}:{nodes:ResourceNode[];motion:boolean;onChoose:(id:string)=>void;elements:RefObject<Map<string,HTMLButtonElement>>}){
 const {camera,size}=useThree();const point=useRef(new Vector3());
 useFrame(()=>{for(const n of nodes){const e=elements.current.get(n.id);if(!e)continue;const [x,,z]=nodePosition(n);const p=point.current.set(x,1.7,z).project(camera),left=(p.x+1)*size.width/2,top=(1-p.y)*size.height/2;e.style.visibility=left>24&&left<size.width-24&&top>24&&top<size.height-24?'visible':'hidden';e.style.transform=`translate(${left-22}px,${top-22}px)`;}});
 return <>{nodes.map(n=><group key={n.id} position={nodePosition(n)} onClick={e=>{e.stopPropagation();onChoose(n.id);}}>{n.resource==='wood'?<Tree motion={motion} scale={.8}/>:<><mesh position={[0,.35,0]} castShadow><icosahedronGeometry args={[.65,0]}/><meshStandardMaterial color={n.resource==='stone'?'#a8b6ad':'#cba48a'}/></mesh><mesh position={[.45,.2,.25]} castShadow><icosahedronGeometry args={[.35,0]}/><meshStandardMaterial color={n.resource==='stone'?'#cad1bc':'#dbba9c'}/></mesh></>}<mesh position={[0,-.03,0]} receiveShadow><cylinderGeometry args={[.85,.9,.1,12]}/><meshStandardMaterial color="#c3cda4"/></mesh></group>)}</>;
}
