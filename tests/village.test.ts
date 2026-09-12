import test from 'node:test';
import assert from 'node:assert/strict';
import {act,initial,restore,goals,assigned,BUILD,type Village,type Action} from '../src/village/model.ts';
test('a fresh village can complete winter goals using gathering within twelve days',()=>{
 let s=initial();const run=(a:Action)=>s=act(s,a);
 run({type:'experiment',a:'wood',b:'stone'});run({type:'build',building:'fire',tile:1});
 run({type:'experiment',a:'wood',b:'wood'});run({type:'day'});run({type:'build',building:'shelter',tile:2});
 run({type:'recruit'});run({type:'assign',job:'wood',delta:1});run({type:'day'});run({type:'day'});
 run({type:'build',building:'shelter',tile:5});run({type:'recruit'});run({type:'recruit'});
 run({type:'assign',job:'forage',delta:1});run({type:'assign',job:'forage',delta:1});
 for(let i=0;i<5;i++)run({type:'day'});
 assert.equal(s.people,5);assert.ok(goals(s).every(g=>g.met));assert.ok(s.day<=12);run({type:'winter'});assert.equal(s.won,true);
});
test('research spends only on unknown results; production requires facilities and never creates duplicate tools',()=>{
 let s=initial();s=act(s,{type:'experiment',a:'stone',b:'stone'});assert.equal(s.stock.stone,4);
 const repeat=act(s,{type:'experiment',a:'stone',b:'stone'});assert.deepEqual(repeat.stock,s.stock);assert.deepEqual(repeat.known,['axe']);
 s=act(s,{type:'produce',item:'axe'});assert.ok(s.axe);assert.deepEqual(act(s,{type:'produce',item:'axe'}).stock,s.stock);
 s={...initial(),known:['pottery'],stock:{wood:20,stone:20,clay:20,food:20,water:20}};
 assert.equal(act(s,{type:'produce',item:'pottery'}).pots,false);s.plots[1]='kiln';assert.equal(act(s,{type:'produce',item:'pottery'}).pots,true);
});
test('placement, worker limits, housing and demolition cannot bypass requirements',()=>{
 let s=initial();assert.equal(act(s,{type:'build',building:'fire',tile:1}).plots[1],null);
 s.known=['fire','kiln','farm','shelter'];s.stock={wood:50,stone:50,clay:50,food:50,water:50};
 assert.equal(act(s,{type:'build',building:'kiln',tile:1}).plots[1],null);
 assert.equal(act(s,{type:'build',building:'farm',tile:1}).plots[1],null);
 s=act(s,{type:'build',building:'farm',tile:3});assert.equal(s.plots[3],'farm');
 const original={...s.stock};assert.deepEqual(act(s,{type:'build',building:'fire',tile:3}).stock,original);
 assert.equal(assigned(act(s,{type:'assign',job:'farm',delta:1})),2);
 assert.equal(act(s,{type:'recruit'}).people,2);
 s=act(s,{type:'build',building:'shelter',tile:1});s=act(s,{type:'recruit'});assert.equal(act(s,{type:'demolish',tile:1}).plots[1],'shelter');
 s=act(s,{type:'assign',job:'farm',delta:1});assert.equal(act(s,{type:'demolish',tile:3}).plots[3],'farm');
});
test('farming consumes water, people consume food, and saves never advance time offline',()=>{
 let s=initial();s.plots[3]='farm';s.jobs={forage:0,wood:0,stone:0,clay:0,water:1,farm:1};s.stock.water=0;s.stock.food=0;
 const end=act(s,{type:'day'});assert.equal(end.stock.water,1);assert.equal(end.stock.food,4);assert.equal(end.day,2);
 const restored=restore(JSON.parse(JSON.stringify(end)))!;assert.deepEqual(restored.stock,end.stock);assert.equal(restored.day,2);
 assert.equal(restore({...s,people:99}),null);assert.equal(restore({...s,stock:{...s.stock,wood:-1}}),null);assert.equal(restore({...s,plots:['oops']}),null);
});
test('winter is gated and failed experiments cannot create negative inventory',()=>{
 let s=initial();assert.equal(act(s,{type:'winter'}).won,false);s.stock.wood=1;
 const out=act(s,{type:'experiment',a:'wood',b:'wood'});assert.equal(out.stock.wood,1);assert.deepEqual(out.known,[]);
 assert.deepEqual(act(s,{type:'experiment',a:'water',b:'water'}).stock,s.stock);
});
