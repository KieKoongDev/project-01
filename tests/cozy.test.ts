import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,act,restore,decorationUnlocked,requestMissing,buildingStatus} from '../src/village/model.ts';
import {decode,envelope,sameRevision,SAVE_KEY,BACKUP_KEY,LEGACY_KEY} from '../src/village/save.ts';
import {useVillage} from '../src/village/store.ts';
test('free relocation preserves homes, workers, resources and independently placed decorations',()=>{
 let s=initial();s.plots[1]='shelter';s.people=3;s.decorations[1]='flowers';s.plots[3]='farm';s.jobs={forage:1,wood:1,stone:0,clay:0,water:0,farm:1};
 const moved=act(s,{type:'move',from:1,to:2});assert.equal(moved.plots[2],'shelter');assert.equal(moved.plots[1],null);assert.equal(moved.decorations[1],'flowers');assert.deepEqual(moved.stock,s.stock);assert.deepEqual(moved.jobs,s.jobs);
 assert.deepEqual(act(s,{type:'move',from:3,to:2}).plots,s.plots);assert.equal(act(s,{type:'move',from:3,to:7}).plots[7],'farm');assert.deepEqual(act(s,{type:'move',from:1,to:3}).plots,s.plots);
});
test('decorations coexist with buildings, refund exactly once and respect request unlocks',()=>{
 let s=initial();s.plots[1]='shelter';const before={...s.stock};s=act(s,{type:'decorate',decoration:'flowers',tile:1});assert.equal(s.plots[1],'shelter');assert.equal(s.stock.water,before.water-1);
 assert.deepEqual(act(s,{type:'decorate',decoration:'tree',tile:1}).stock,s.stock);
 s=act(s,{type:'remove-decoration',tile:1});assert.deepEqual(s.stock,before);assert.deepEqual(act(s,{type:'remove-decoration',tile:1}).stock,before);
 assert.equal(act(s,{type:'decorate',decoration:'bench',tile:2}).decorations[2],null);
});
test('neighbor requests validate requirements, spend only once and unlock cosmetic rewards',()=>{
 let s=initial();assert.ok(requestMissing(s,'garden'));assert.deepEqual(act(s,{type:'fulfill',request:'garden'}).completed,[]);
 s.plots[1]='shelter';s=act(s,{type:'decorate',decoration:'flowers',tile:1});s=act(s,{type:'fulfill',request:'garden'});assert.ok(decorationUnlocked(s,'bench'));
 const before={...s.stock};s=act(s,{type:'fulfill',request:'picnic'});assert.equal(s.stock.food,before.food-6);assert.equal(s.stock.wood,before.wood+3);assert.deepEqual(act(s,{type:'fulfill',request:'picnic'}).stock,s.stock);
 s.pots=true;assert.ok(requestMissing(s,'light'));s.plots[2]='kiln';s=act(s,{type:'fulfill',request:'light'});assert.ok(decorationUnlocked(s,'lantern'));
});
test('legacy village migration preserves progress and rejects malformed personalization',()=>{
 const s=initial();s.day=20;s.stock.wood=123;const {name,names,decorations,completed,...legacy}=s;
 const migrated=restore(legacy)!;assert.equal(migrated.stock.wood,123);assert.equal(migrated.day,20);assert.equal(migrated.names.length,5);assert.equal(migrated.decorations.length,12);
 assert.equal(restore({...s,names:['x']}),null);assert.equal(restore({...s,decorations:['flowers']}),null);assert.equal(restore({...s,completed:['invented']}),null);
 assert.equal(act(s,{type:'rename',name:'   '}).name,s.name);assert.equal(act(s,{type:'rename-person',person:3,name:'น้องเมฆ'}).names[3],s.names[3]);assert.equal(act(s,{type:'rename',name:' บ้านใบชา '}).name,'บ้านใบชา');
});
test('per-building farm statuses account for actual workers and water allocation',()=>{
 const s=initial();s.plots[3]='farm';s.plots[7]='farm';s.jobs.farm=1;s.stock.water=2;
 assert.match(buildingStatus(s,'farm',3).label,/พร้อม/);assert.match(buildingStatus(s,'farm',7).label,/ขาดคน/);
 s.jobs.farm=2;assert.match(buildingStatus(s,'farm',7).label,/ขาดน้ำ/);
});
test('save envelopes validate revisions and preserve stable village identity',()=>{
 const a=envelope(initial()),b=envelope(act(a.state,{type:'day'}),a);assert.equal(a.villageId,b.villageId);assert.equal(b.revision,a.revision+1);assert.ok(!sameRevision(a,b));assert.ok(decode(JSON.stringify(b)));assert.equal(decode(JSON.stringify({...b,revision:-1})),null);
});
const memory=new Map<string,string>();
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>memory.set(k,v)}});
test('local save migrates legacy, keeps backup and refuses stale or corrupt writes',()=>{
 memory.clear();const legacy=initial();legacy.stock.wood=81;memory.set(LEGACY_KEY,JSON.stringify(legacy));useVillage.getState().reloadSave();assert.equal(useVillage.getState().v.stock.wood,81);
 useVillage.getState().dispatch({type:'rename',name:'บ้านใหม่'});const first=memory.get(SAVE_KEY)!;assert.equal(decode(first)?.state.name,'บ้านใหม่');assert.ok(memory.has(LEGACY_KEY));
 useVillage.getState().dispatch({type:'day'});assert.equal(memory.get(BACKUP_KEY),first);
 const other=envelope(initial(),decode(memory.get(SAVE_KEY)!)!);memory.set(SAVE_KEY,JSON.stringify(other));useVillage.getState().dispatch({type:'day'});assert.ok(useVillage.getState().blocked);assert.equal(memory.get(SAVE_KEY),JSON.stringify(other));
 useVillage.getState().reloadSave();assert.ok(!useVillage.getState().blocked);
 memory.set(SAVE_KEY,'{broken');useVillage.getState().reloadSave();assert.ok(useVillage.getState().blocked);useVillage.getState().dispatch({type:'day'});assert.equal(memory.get(SAVE_KEY),'{broken');
});
