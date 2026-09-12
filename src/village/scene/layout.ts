import {landOffset} from '../land.ts';
export const tilePosition=(tile:number):[number,number,number]=>[(tile%4-1.5)*2+landOffset(Math.floor(tile/12)),0,(Math.floor(tile%12/4)-1)*2];
export function groundTile(x:number,z:number,tiles=12):number|null{
 if(!Number.isFinite(x)||!Number.isFinite(z)||x< (tiles>=24?-12:-4)||x>=(tiles>=36?12:4)||z< -3||z>=3)return null;
 const chunk=x< -4?1:x>=4?2:0;return chunk*12+Math.floor((z+3)/2)*4+Math.floor((x-landOffset(chunk)+4)/2);
}
export type ScreenPoint={x:number;y:number};
export type SceneHandle={tileAt:(point:ScreenPoint)=>number|null};
