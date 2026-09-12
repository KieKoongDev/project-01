import test from 'node:test';
import assert from 'node:assert/strict';
import {OrthographicCamera,Vector3,Vector2,Raycaster,Plane} from 'three';
import {groundTile,tilePosition} from '../src/village/scene/layout.ts';
import {initial,act} from '../src/village/model.ts';
test('all twelve world positions map to the same saved tile, with safe outer boundaries',()=>{
 for(let i=0;i<12;i++){const [x,,z]=tilePosition(i);assert.equal(groundTile(x,z),i);assert.equal(groundTile(x+.8,z-.8),i);}
 assert.equal(groundTile(-4,-3),0);for(const [x,z] of [[4,0],[-4.01,0],[0,3],[0,-3.01],[NaN,0],[0,Infinity]])assert.equal(groundTile(x,z),null);
});
test('orthographic pointer projection reaches every tile after portrait and landscape resize',()=>{
 const floor=new Plane(new Vector3(0,1,0),0),caster=new Raycaster();
 for(const [width,height] of [[390,220],[600,360],[430,210],[320,130]]){
 const camera=new OrthographicCamera(-width/2,width/2,height/2,-height/2,.1,100);camera.position.set(9,11,12);camera.lookAt(0,.2,0);camera.zoom=Math.min(width/14,height/10);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 for(let i=0;i<12;i++){const point=new Vector3(...tilePosition(i)),screen=point.clone().project(camera);assert.ok(Math.abs(screen.x)<1&&Math.abs(screen.y)<1);caster.setFromCamera(new Vector2(screen.x,screen.y),camera);const hit=caster.ray.intersectPlane(floor,new Vector3())!;assert.equal(groundTile(hit.x,hit.z),i);}
 }
});
test('a projected drop still respects material costs, occupancy and terrain rules',()=>{
 let s=initial();s.known=['farm'];const before={...s.stock};
 s=act(s,{type:'build',building:'farm',tile:groundTile(...[tilePosition(1)[0],tilePosition(1)[2]] as [number,number])!});assert.deepEqual(s.stock,before);
 const [x,,z]=tilePosition(3);s=act(s,{type:'build',building:'farm',tile:groundTile(x,z)!});assert.equal(s.plots[3],'farm');assert.equal(s.stock.wood,before.wood-3);
 const paid={...s.stock};s=act(s,{type:'build',building:'farm',tile:3});assert.deepEqual(s.stock,paid);s=act(s,{type:'move',from:3,to:7});assert.equal(s.plots[7],'farm');assert.deepEqual(s.stock,paid);
});
