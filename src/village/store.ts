import {create} from 'zustand';
import {act,initial,restore,type Action,type Village} from './model.ts';
import {SAVE_KEY,BACKUP_KEY,LEGACY_KEY,decode,envelope,sameRevision,type SaveEnvelope} from './save.ts';
type State={v:Village;loaded:boolean;storageError:boolean;save:SaveEnvelope|null;saveNote:string;blocked:boolean;dispatch:(a:Action)=>void;hydrate:()=>void;restart:()=>void;reloadSave:()=>void};
export const useVillage=create<State>((set,get)=>{
 function load(){
  try{
   const raw=localStorage.getItem(SAVE_KEY),saved=decode(raw),backup=decode(localStorage.getItem(BACKUP_KEY));
   if(saved){set({v:saved.state,save:saved,loaded:true,storageError:false,blocked:false,saveNote:'บันทึกในเครื่องแล้ว'});return;}
   if(raw){set({v:backup?.state??get().v,save:backup,loaded:true,storageError:true,blocked:true,saveNote:backup?'พบเซฟเสีย เปิดสำเนาสำรองให้อ่านได้ ยังไม่เขียนทับเซฟเดิม':'อ่านเซฟไม่ได้ เก็บข้อมูลเดิมไว้แล้ว กรุณาอย่าเริ่มใหม่หากยังต้องการกู้ข้อมูล'});return;}
   const legacyRaw=localStorage.getItem(LEGACY_KEY);const legacy=legacyRaw?restore(JSON.parse(legacyRaw)):null;
   if(legacyRaw&&!legacy){set({loaded:true,storageError:true,blocked:true,saveNote:'อ่านเซฟเดิมไม่ได้ ยังไม่เขียนทับข้อมูล'});return;}
   set({v:legacy??initial(),save:null,loaded:true,storageError:false,blocked:false,saveNote:legacy?'เปิดหมู่บ้านเดิมแล้ว จะบันทึกรูปแบบใหม่เมื่อเล่นต่อ':'เล่นแบบแขก · บันทึกในเบราว์เซอร์นี้'});
  }catch{set({loaded:true,storageError:true,blocked:true,saveNote:'เข้าถึงเซฟไม่ได้ ข้อมูลเดิมจะไม่ถูกเขียนทับ'});}
 }
 function persist(v:Village,previous:SaveEnvelope|null,reset=false){
  const next=envelope(v,reset?null:previous);const old=localStorage.getItem(SAVE_KEY);
  if(decode(old))localStorage.setItem(BACKUP_KEY,old!);
  localStorage.setItem(SAVE_KEY,JSON.stringify(next));set({save:next,storageError:false,blocked:false,saveNote:'บันทึกในเครื่องแล้ว'});
 }
 return {v:initial(),loaded:false,storageError:false,save:null,saveNote:'กำลังเปิดหมู่บ้าน…',blocked:false,
 hydrate:()=>{if(!get().loaded)load();},reloadSave:load,
 dispatch:a=>{
  if(!get().loaded||get().blocked)return;
  try{const raw=localStorage.getItem(SAVE_KEY),current=decode(raw);if(raw&&!current||!sameRevision(current,get().save)){set({blocked:true,storageError:true,saveNote:'มีเซฟเปลี่ยนจากอีกแท็บ หรืออ่านข้อมูลไม่ได้ กดโหลดเซฟล่าสุดก่อนเล่นต่อ'});return;}}catch{set({blocked:true,storageError:true,saveNote:'อ่านเซฟไม่ได้ หยุดเขียนเพื่อป้องกันข้อมูลสูญหาย'});return;}
  const v=act(get().v,a);set({v});try{persist(v,get().save);}catch{set({storageError:true,saveNote:'บันทึกไม่สำเร็จ หมู่บ้านล่าสุดยังอยู่ในหน้านี้ อย่าเพิ่งปิดเกม'});}
 },
 restart:()=>{const v=initial();try{persist(v,null,true);set({v,loaded:true});}catch{set({storageError:true,saveNote:'เริ่มใหม่ไม่ได้ เพราะบันทึกไม่สำเร็จ เก็บหมู่บ้านปัจจุบันไว้ก่อน'});}}
 };
});
