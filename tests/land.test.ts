import test from 'node:test';
import assert from 'node:assert/strict';
import {act,initial,restore} from '../src/village/model.ts';
import {groundTile,tilePosition} from '../src/village/scene/layout.ts';
import {nodeCapacity} from '../src/village/land.ts';

test('land unlock spends once, preserves original slots, and stops at 36',()=>{
 let v=initial(1000);v.stock.wood=100;v.stock.stone=100;v.plots[1]='shelter';v.decorations[1]='flowers';v.rotations[1]=90;
 v=act(v,{type:'expand'});assert.equal(v.plots.length,24);assert.equal(v.stock.wood,88);assert.equal(v.stock.stone,92);assert.equal(v.plots[1],'shelter');assert.equal(v.decorations[1],'flowers');assert.equal(v.rotations[1],90);assert.equal(v.nodes.length,6);
 v=act(v,{type:'expand'});assert.equal(v.plots.length,36);assert.equal(v.stock.wood,68);assert.equal(v.nodes.length,9);assert.ok(restore(v));const before={...v.stock};v=act(v,{type:'expand'});assert.deepEqual(v.stock,before);
 const poor=initial(0);assert.equal(act(poor,{type:'expand'}).plots.length,12);
});
test('expanded geometry maps uniquely and locked land rejects drops',()=>{
 for(const count of [12,24,36])for(let i=0;i<count;i++){const [x,,z]=tilePosition(i);assert.equal(groundTile(x,z,count),i);}
 assert.equal(groundTile(-8,0,12),null);assert.equal(groundTile(8,0,24),null);assert.equal(groundTile(-12.01,0,36),null);assert.equal(groundTile(12,0,36),null);
 let v=initial();v.known=['shelter'];assert.equal(act(v,{type:'build',building:'shelter',tile:13}).plots.length,12);
 v.stock.wood=30;v.stock.stone=30;v=act(v,{type:'expand'});v=act(v,{type:'build',building:'shelter',tile:13});assert.equal(v.plots[13],'shelter');
});
test('rotation survives cross-land relocation with terrain constraints',()=>{
 let v=initial();v.stock.wood=30;v.stock.stone=30;v=act(v,{type:'expand'});v.plots[1]='shelter';
 v=act(v,{type:'rotate',tile:1});assert.equal(v.rotations[1],90);const stock={...v.stock};v=act(v,{type:'move',from:1,to:14});assert.equal(v.rotations[14],90);assert.equal(v.rotations[1],0);assert.deepEqual(v.stock,stock);
 for(let i=0;i<3;i++)v=act(v,{type:'rotate',tile:14});assert.equal(v.rotations[14],0);
 v.plots[3]='farm';assert.equal(act(v,{type:'move',from:3,to:12}).plots[3],'farm');
});
test('resource objects mature with time, cap locally, and collect exactly once',()=>{
 let v=initial(1000);const id=v.nodes[0].id;v.jobs.wood=0;
 v=act(v,{type:'sync',now:60_999});assert.equal(v.nodes[0].stored,0);
 v=act(v,{type:'sync',now:61_000});assert.equal(v.nodes[0].stored,2);const stock=v.stock.wood;
 v=act(v,{type:'collect-node',id});assert.equal(v.stock.wood,stock+2);assert.equal(v.nodes[0].stored,0);assert.equal(act(v,{type:'collect-node',id}).stock.wood,v.stock.wood);
 v=act(v,{type:'sync',now:3_601_000});assert.equal(v.nodes[0].stored,nodeCapacity(v.nodes[0]));
 v.stock.wood=39;v=act(v,{type:'collect-node',id});assert.equal(v.stock.wood,40);assert.equal(v.nodes[0].stored,5);
});
test('node automation requires upgrade and preserves stock above the cap',()=>{
 let v=initial(1000);const id=v.nodes[0].id;v=act(v,{type:'toggle-node-auto',id});assert.equal(v.nodes[0].auto,false);
 v.stock.wood=30;v.stock.stone=30;v=act(v,{type:'upgrade-node',id});assert.equal(v.nodes[0].level,2);const paid={...v.stock};assert.deepEqual(act(v,{type:'upgrade-node',id}).stock,paid);
 v=act(v,{type:'toggle-node-auto',id});v.jobs.wood=0;const before=v.stock.wood;v=act(v,{type:'sync',now:31_000});assert.equal(v.stock.wood,before+2);
 v.stock.wood=123;v=act(v,{type:'sync',now:61_000});assert.equal(v.stock.wood,123);
});
test('old saves gain safe node defaults and corrupted expansion state is rejected',()=>{
 const v=initial();const {nodes,rotations,...legacy}=v;const migrated=restore(legacy)!;assert.equal(migrated.nodes.length,3);assert.equal(migrated.rotations.length,12);assert.ok(migrated.nodes.every(n=>n.stored===0));assert.deepEqual(migrated.plots,v.plots);
 assert.equal(restore({...v,rotations:[0]}),null);assert.equal(restore({...v,nodes:[nodes[0],nodes[0],nodes[2]]}),null);assert.equal(restore({...v,plots:Array(13).fill(null)}),null);
});
