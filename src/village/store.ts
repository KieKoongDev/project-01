import {create} from 'zustand';
import {act,initial,restore,type Action,type Village} from './model.ts';
type State={v:Village;loaded:boolean;storageError:boolean;dispatch:(a:Action)=>void;hydrate:()=>void;restart:()=>void};
export const useVillage=create<State>((set,get)=>({v:initial(),loaded:false,storageError:false,
 hydrate:()=>{if(get().loaded)return;try{set({v:restore(JSON.parse(localStorage.getItem('paperbound-village-v1')??'null'))??initial(),loaded:true});}catch{set({loaded:true,storageError:true});}},
 dispatch:a=>{const v=act(get().v,a);set({v});try{localStorage.setItem('paperbound-village-v1',JSON.stringify(v));}catch{set({storageError:true});}},
 restart:()=>{const v=initial();set({v});try{localStorage.setItem('paperbound-village-v1',JSON.stringify(v));}catch{set({storageError:true});}}
}));
