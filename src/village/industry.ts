export type Industry={charcoal:number;brick:number;claimed:number;task:{kind:'charcoal'|'brick';finishAt:number}|null};
export const emptyIndustry=():Industry=>({charcoal:0,brick:0,claimed:0,task:null});
export function validIndustry(value:unknown):value is Industry{
 if(!value||typeof value!=='object')return false;const v=value as Industry;
 return [v.charcoal,v.brick,v.claimed].every(n=>Number.isSafeInteger(n)&&n>=0)&&v.charcoal<=40&&v.brick<=40&&v.claimed<=3&&(v.task===null||!!v.task&&['charcoal','brick'].includes(v.task.kind)&&Number.isSafeInteger(v.task.finishAt)&&v.task.finishAt>=0);
}
