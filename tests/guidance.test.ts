import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,act,RESOURCES} from '../src/village/model.ts';
import {nextGoal,worldHints,dayForecast,buildReason} from '../src/village/guidance.ts';
test('guidance takes knowledge into usable buildings then continues after the celebration',()=>{
 let v=initial();assert.equal(nextGoal(v).recipe,'fire');
 v=act(v,{type:'experiment',a:'wood',b:'stone'});assert.equal(nextGoal(v).building,'fire');assert.equal(nextGoal(v).tab,'build');
 v=act(v,{type:'build',building:'fire',tile:1});assert.equal(nextGoal(v).recipe,'shelter');
 v.plots[2]='shelter';v.plots[5]='shelter';v.people=5;v.jobs.forage=4;v.stock.food=20;v.stock.wood=8;assert.equal(nextGoal(v).celebrate,true);
 v=act(v,{type:'winter'});assert.equal(nextGoal(v).recipe,'kiln');
 v.known.push('kiln');v.stock.stone=0;assert.equal(nextGoal(v).tab,'people');
 v.plots[6]='kiln';assert.equal(nextGoal(v).recipe,'pottery');v.pots=true;assert.equal(nextGoal(v).recipe,'store');
});
test('world hints prioritize real shortages, disappear after resolution, and stay bounded',()=>{
 const v=initial();v.plots[3]='farm';v.plots[7]='farm';v.plots[1]='kiln';v.plots[2]='shelter';v.plots[0]='lumber';v.jobs.wood=0;
 let hints=worldHints(v);assert.equal(hints.length,3);assert.deepEqual(hints.slice(0,2).map(h=>h.tile),[3,7]);assert.equal(hints[0].kind,'people');
 v.jobs.farm=2;v.jobs.forage=0;v.stock.water=2;hints=worldHints(v);assert.equal(hints[0].tile,7);assert.equal(hints[0].kind,'water');
 v.stock.water=4;assert.ok(!worldHints(v).some(h=>h.kind==='water'||h.tile===3||h.tile===7));v.pots=true;assert.ok(!worldHints(v).some(h=>h.kind==='craft'));
});
test('next-day previews match actual water, food and tool economics without mutation',()=>{
 for(const food of [0,12])for(const water of [0,1,4]){
 const v=initial();v.stock.food=food;v.stock.water=water;v.plots[3]='farm';v.jobs={wood:0,stone:0,clay:0,forage:0,water:1,farm:1};v.pots=true;
 const before=structuredClone(v),preview=dayForecast(v),next=act(v,{type:'day'});assert.deepEqual(v,before);
 for(const r of RESOURCES)assert.equal(preview.delta.find(d=>d.resource===r)!.amount,next.stock[r]-v.stock[r]);
 }
 const starving=initial();starving.stock.food=0;starving.jobs.forage=0;assert.equal(dayForecast(starving).shortage,true);
});
test('ready filter respects facility dependencies and costs',()=>{
 const v=initial();v.known=['kiln','store'];v.stock={wood:100,stone:100,clay:100,food:100,water:100};
 assert.equal(buildReason(v,'kiln'),'ต้องมีกองไฟ');assert.equal(buildReason(v,'store'),'ติดตั้งภาชนะก่อน');v.plots[0]='fire';assert.equal(buildReason(v,'kiln'),null);v.pots=true;assert.equal(buildReason(v,'store'),null);v.stock.wood=0;assert.match(buildReason(v,'store')!,/ขาด/);
});
test('a ready building needs suitable free land and starvation overrides expansion advice',()=>{
 const v=initial();v.known=['farm'];v.plots[3]=v.plots[7]=v.plots[11]='farm';assert.equal(buildReason(v,'farm'),'ไม่มีพื้นที่ที่เหมาะสม');
 v.stock.food=0;v.jobs.forage=0;assert.equal(nextGoal(v).art,'food');assert.equal(nextGoal(v).tab,'people');
});
