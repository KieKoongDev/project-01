import test from 'node:test';
import assert from 'node:assert/strict';
import {CRAFT_TIME_MS,OFFLINE_CAP_MS,PRODUCTION_CYCLE_MS,act,initial,restore} from '../src/village/model.ts';

test('real-time production carries partial cycles and never double-counts sync',()=>{
 const start=1_000_000;let v=initial(start),wood=v.stock.wood,food=v.stock.food;
 v=act(v,{type:'sync',now:start+PRODUCTION_CYCLE_MS-1});assert.equal(v.stock.wood,wood);assert.equal(v.stock.food,food);
 v=act(v,{type:'sync',now:start+PRODUCTION_CYCLE_MS});assert.equal(v.stock.wood,wood+2);assert.equal(v.stock.food,food+3);
 const same=act(v,{type:'sync',now:start+PRODUCTION_CYCLE_MS});assert.deepEqual(same.stock,v.stock);
});

test('offline work is capped at four hours and by storage capacity',()=>{
 const start=2_000_000;let v=initial(start);v.jobs={forage:0,wood:2,stone:0,clay:0,water:0,farm:0};v.stock.wood=0;
 v=act(v,{type:'sync',now:start+OFFLINE_CAP_MS*3});assert.equal(v.stock.wood,40);assert.match(v.awayReport!,/4\.0 ชม\./);
 const full=act(v,{type:'sync',now:start+OFFLINE_CAP_MS*3+PRODUCTION_CYCLE_MS});assert.equal(full.stock.wood,40);
});

test('crafting reserves materials, takes time, completes offline and cannot queue twice',()=>{
 const start=3_000_000;let v=initial(start);v.known=['axe'];const before={...v.stock};
 v=act(v,{type:'queue-craft',item:'axe',now:start});assert.equal(v.stock.wood,before.wood-2);assert.equal(v.stock.stone,before.stone-3);assert.equal(v.axe,false);assert.equal(v.craft?.item,'axe');
 const reserved={...v.stock};v=act(v,{type:'queue-craft',item:'axe',now:start+1});assert.deepEqual(v.stock,reserved);
 v=act(v,{type:'sync',now:start+CRAFT_TIME_MS-1});assert.equal(v.axe,false);v=act(v,{type:'sync',now:start+CRAFT_TIME_MS});assert.equal(v.axe,true);assert.equal(v.craft,null);
});

test('legacy village saves migrate to real-time fields without offline windfall',()=>{
 const legacy=initial();const raw:any=structuredClone(legacy);delete raw.lastActiveAt;delete raw.productionCarryMs;delete raw.craft;delete raw.awayReport;
 const migrated=restore(raw)!;assert.ok(Number.isFinite(migrated.lastActiveAt));assert.equal(migrated.productionCarryMs,0);assert.equal(migrated.craft,null);
});
