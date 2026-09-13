import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,act,restore} from '../src/village/model.ts';
test('industry quests, reserved inputs and offline output are sequential and exactly once',()=>{
 let s=initial(0);s.plots[1]='kiln';s=act(s,{type:'industry-claim'});const reward=s.stock.wood;s=act(s,{type:'industry-claim'});assert.equal(s.stock.wood,reward);
 s=act(s,{type:'industry-start',kind:'charcoal',now:0});assert.equal(s.stock.wood,reward-4);const wood=s.stock.wood;s=act(s,{type:'industry-start',kind:'charcoal',now:0});assert.equal(s.stock.wood,wood);
 s=act(s,{type:'demolish',tile:1});assert.equal(s.plots[1],'kiln');assert.ok(restore(s));
 s=act(s,{type:'sync',now:60000});assert.equal(s.industry?.charcoal,2);s=act(s,{type:'sync',now:60000});assert.equal(s.industry?.charcoal,2);
 s=act(s,{type:'industry-claim'});s=act(s,{type:'industry-start',kind:'brick',now:60000});assert.equal(s.industry?.charcoal,0);s=act(s,{type:'sync',now:180000});assert.equal(s.industry?.brick,2);s=act(s,{type:'industry-claim'});s=act(s,{type:'industry-claim'});assert.equal(s.industry?.claimed,3);assert.equal(s.decorationGifts.lantern,1);
});
test('locked recipes, missing facilities, invalid saves and early timers cannot create output',()=>{
 let s=initial(0);s=act(s,{type:'industry-start',kind:'brick',now:0});assert.equal(s.industry?.task,null);assert.equal(restore({...s,industry:{charcoal:-1,brick:0,claimed:0,task:null}}),null);
 s.plots[1]='kiln';s=act(s,{type:'industry-claim'});s=act(s,{type:'industry-start',kind:'charcoal',now:0});s=act(s,{type:'sync',now:59000});assert.equal(s.industry?.charcoal,0);
});
