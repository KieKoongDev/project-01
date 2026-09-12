import {restore,type Village} from './model.ts';
export const SAVE_KEY='paperbound-village-v2';
export const BACKUP_KEY='paperbound-village-backup';
export const LEGACY_KEY='paperbound-village-v1';
// Guest-local identity and revision only. Never an authentication/authorization token.
export type SaveEnvelope={format:2;villageId:string;revision:number;updatedAt:string;state:Village};
export const envelope=(state:Village,previous?:SaveEnvelope|null):SaveEnvelope=>({format:2,villageId:previous?.villageId??crypto.randomUUID(),revision:(previous?.revision??0)+1,updatedAt:new Date().toISOString(),state});
export function decode(text:string|null):SaveEnvelope|null{
 if(!text)return null;try{const d=JSON.parse(text);if(d?.format!==2||typeof d.villageId!=='string'||!/^[\w-]{1,64}$/.test(d.villageId)||!Number.isSafeInteger(d.revision)||d.revision<1||typeof d.updatedAt!=='string'||!Number.isFinite(Date.parse(d.updatedAt)))return null;const state=restore(d.state);return state?{format:2,villageId:d.villageId,revision:d.revision,updatedAt:d.updatedAt,state}:null;}catch{return null;}
}
export const sameRevision=(a:SaveEnvelope|null,b:SaveEnvelope|null)=>a===null&&b===null||!!a&&!!b&&a.villageId===b.villageId&&a.revision===b.revision;
