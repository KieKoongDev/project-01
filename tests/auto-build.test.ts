import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,act,canPay,BUILD,restore} from '../src/village/model.ts';
test('auto preparation takes real cycles, changes jobs, persists and never builds or spends',()=>{
 let s=initial(0);s.stock.wood=0;s.stock.stone=0;s=act(s,{type:'auto-build',building:'lumber'});
 assert.equal(s.stock.wood,0);s=act(s,{type:'sync',now:30000});assert.ok(s.stock.wood>0);assert.equal(s.stock.stone,0);
 s=act(s,{type:'sync',now:300000});assert.ok(canPay(s,BUILD.lumber.cost));assert.equal(s.plots.filter(Boolean).length,0);assert.equal(restore(s)?.autoBuild,'lumber');
 const stock={...s.stock};s=act(s,{type:'build',building:'lumber',tile:0});assert.equal(s.autoBuild,null);assert.equal(s.stock.wood,stock.wood-3);
});
test('cancel stops job reassignment and invalid saved target is rejected',()=>{
 let s=act(initial(0),{type:'auto-build',building:'well'});s=act(s,{type:'auto-build',building:null});const jobs=[...s.assignments];s=act(s,{type:'sync',now:30000});assert.deepEqual(s.assignments,jobs);assert.equal(restore({...s,autoBuild:'invalid'}),null);
});
test('new production buildings require research and bonuses do not stack',()=>{
 let s=initial(0);s.stock={wood:40,stone:40,clay:40,water:40,food:40};s=act(s,{type:'build',building:'quarry',tile:1});assert.equal(s.plots[1],null);s.known.push('axe');s=act(s,{type:'build',building:'quarry',tile:1});s=act(s,{type:'build',building:'quarry',tile:2});s=act(s,{type:'assign-person',person:0,job:'stone'});s.stock.stone=0;s=act(s,{type:'sync',now:30000});assert.equal(s.stock.stone,3);assert.ok(restore(s));
});
