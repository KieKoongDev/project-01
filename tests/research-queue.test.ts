import test from 'node:test';
import assert from 'node:assert/strict';
import {act,initial,restore,RESEARCH_TIME_MS,CRATE_COOLDOWN_MS,researchCapacity} from '../src/village/model.ts';

test('research reserves its pair once and completes while away',()=>{
 const start=1_000;let s=initial(start);const before={...s.stock};s=act(s,{type:'queue-research',a:'wood',b:'stone',now:start});
 assert.equal(s.stock.wood,before.wood-1);assert.equal(s.stock.stone,before.stone-1);assert.equal(s.research.length,1);assert.deepEqual(s.known,[]);
 const repeated=act(s,{type:'queue-research',a:'wood',b:'stone',now:start+1});assert.deepEqual(repeated.stock,s.stock);
 s=act(s,{type:'sync',now:start+RESEARCH_TIME_MS.fire});assert.deepEqual(s.known,['fire']);assert.equal(s.research.length,0);
});

test('fire and kiln grow a sequential research queue without duplicate outcomes',()=>{
 const start=5_000;let s=initial(start);s.plots[0]='fire';s.plots[1]='kiln';assert.equal(researchCapacity(s),3);
 s=act(s,{type:'queue-research',a:'clay',b:'wood',now:start});s=act(s,{type:'queue-research',a:'wood',b:'clay',now:start+10});
 assert.deepEqual(s.research.map(t=>t.recipe),['pottery','store']);assert.equal(s.research[1].startedAt,s.research[0].finishAt);
 s=act(s,{type:'sync',now:s.research[1].finishAt});assert.deepEqual(s.known,['pottery','store']);
});

test('person-by-person work assignment stays consistent with AFK job totals',()=>{
 let s=initial(10_000);s=act(s,{type:'assign-person',person:0,job:'stone'});assert.equal(s.assignments[0],'stone');assert.equal(s.jobs.forage,0);assert.equal(s.jobs.stone,1);
 const before=s.stock.stone;s=act(s,{type:'sync',now:40_000});assert.equal(s.stock.stone,before+2);
 s=act(s,{type:'assign-person',person:0,job:null});assert.equal(s.jobs.stone,0);
});

test('restore migrates legacy assignments and rejects malformed research queues',()=>{
 const original=initial(20_000);const legacy=structuredClone(original) as Partial<typeof original>;delete legacy.research;delete legacy.assignments;delete legacy.crateReadyAt;delete legacy.decorationGifts;delete legacy.giftedTiles;delete legacy.lastFind;
 const migrated=restore(legacy)!;assert.deepEqual(migrated.research,[]);assert.deepEqual(migrated.assignments.slice(0,2),['forage','wood']);
 const queued=act(original,{type:'queue-research',a:'wood',b:'stone',now:20_000});assert.ok(restore(queued));
 const broken=structuredClone(queued);broken.research[0].finishAt++;assert.equal(restore(broken),null);
});

test('exploration crate is free, cooldown gated, and can find items or a housed visitor',()=>{
 const now=30_000;let s=initial(now);s=act(s,{type:'open-crate',now,roll:.7});assert.equal(s.decorationGifts.flowers,1);assert.equal(s.crateReadyAt,now+CRATE_COOLDOWN_MS);
 const blocked=act(s,{type:'open-crate',now:now+1,roll:.1});assert.deepEqual(blocked.stock,s.stock);
 s=act(s,{type:'decorate',decoration:'flowers',tile:0});assert.equal(s.decorationGifts.flowers,0);assert.deepEqual(s.giftedTiles,[0]);s=act(s,{type:'remove-decoration',tile:0});assert.equal(s.decorationGifts.flowers,1);assert.deepEqual(s.giftedTiles,[]);
 s.plots[1]='shelter';s=act(s,{type:'open-crate',now:s.crateReadyAt,roll:.95});assert.equal(s.people,3);assert.equal(s.assignments[2],null);
});
