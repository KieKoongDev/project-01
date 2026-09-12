export const tilePosition=(tile:number):[number,number,number]=>[(tile%4-1.5)*2,0,(Math.floor(tile/4)-1)*2];
export function groundTile(x:number,z:number):number|null{
 if(!Number.isFinite(x)||!Number.isFinite(z)||x< -4||x>=4||z< -3||z>=3)return null;
 return Math.floor((z+3)/2)*4+Math.floor((x+4)/2);
}
export type ScreenPoint={x:number;y:number};
export type SceneHandle={tileAt:(point:ScreenPoint)=>number|null};
