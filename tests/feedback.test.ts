import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE,CARDS,restoreCard} from '../src/game/engine.ts';
import {useGame} from '../src/game/store.ts';
import {cardName,names,feedbackText} from '../src/i18n/th.ts';
import {indexCards,filterCards} from '../src/game/collection.ts';
Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{setItem(){},getItem(){return null;}}});
test('feedback distinguishes new discoveries, repeats and failed attempts without rewarding failures',()=>{
 useGame.setState({cards:[...BASE],slots:[null,null],journal:[],mode:'sandbox',era:'stone',event:'clear',score:0,discovered:[],roundIds:[],milestones:[],feedback:null,researchProgress:0,researchCredits:3});
 const g=()=>useGame.getState();g().loadPair(['stone','stone']);g().craft();assert.deepEqual(g().feedback,{id:1,kind:'success',points:10});
 g().loadPair(['stone','stone']);g().craft();assert.deepEqual(g().feedback,{id:2,kind:'success',points:0});
 g().loadPair(['water','water']);g().craft();assert.deepEqual(g().feedback,{id:3,kind:'fail',points:0});assert.equal(g().score,10);
 const event=g().feedback;g().clear();g().hydrate();assert.equal(g().feedback,event);
});
test('Thai catalog covers all roots, searches in Thai and preserves crafted identity',()=>{
 for(const c of CARDS.values())assert.ok(names[c.id],c.id);
 const c=restoreCard({...CARDS.get('pottery')!,base:'pottery',mods:['aquatic','framed']})!;
 const id=c.id;assert.equal(cardName(c),'เครื่องปั้นดินเผา · ใช้งานในน้ำ · โครงไม้');assert.equal(c.id,id);
 const index=indexCards([{...c,name:cardName(c)+' '+c.name}]);assert.equal(filterCards(index,'โครงไม้','all')[0].id,id);
 assert.equal(feedbackText('First unlock Firecraft and Toolmaking.'),'ต้องเรียนรู้ก่อน: ควบคุมไฟ + ทำเครื่องมือ');
});
