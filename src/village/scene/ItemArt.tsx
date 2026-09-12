import type {Building,Decoration,Resource} from '../model';
export type ArtKind=Building|Decoration|Resource|'axe'|'pottery';
export function ItemArt({kind}:{kind:ArtKind}){
 const tree=<><path d="M47 78V43h7v35" fill="#a28059"/><path d="M25 45 37 24 55 17 74 32 79 49 66 61 40 59Z" fill="#9bbb8d"/><path d="m37 24 18-7 19 15-21 8Z" fill="#c4d69e"/><path d="m53 40 26 9-13 12-26-2Z" fill="#82a67f"/></>;
 let art;
 switch(kind){
 case 'shelter':case 'store':art=<><path d="m20 48 32-17 29 18v29L51 94 21 76Z" fill="#ead4ac"/><path d="m51 62 30-13v29L51 94Z" fill="#c5ad83"/><path d="m12 47 39-30 39 31-38 19Z" fill={kind==='store'?'#a1b498':'#ce9d85'}/><path d="m51 17 39 31-38 19Z" fill={kind==='store'?'#789786':'#b57f6a'}/><path d="m29 63 12 6v19l-12-7Z" fill="#aa825c"/><path d="m61 65 11-5v11l-11 6Z" fill="#b4cebd"/><path d="m25 43 27-16 22 16-22-10Z" fill="#e8b59a"/></>;break;
 case 'kiln':art=<><ellipse cx="50" cy="77" rx="32" ry="15" fill="#b2866e"/><path d="M18 73Q17 28 50 27q33 0 32 46Z" fill="#d5ac92"/><path d="M50 27q33 0 32 46L52 87Z" fill="#c5987d"/><path d="M37 79V63q11-18 23-1v17Z" fill="#785c4a"/><path d="m41 76 9-19 9 19Z" fill="#e7aa67"/><path d="M56 30V13l13-3v22Z" fill="#d9b89a"/><path d="m56 13 7-5 13 5-7 3Z" fill="#a6846e"/></>;break;
 case 'fire':art=<><ellipse cx="51" cy="80" rx="32" ry="10" fill="#b9b59f"/><path d="m23 71 49-13 8 10-49 15Z" fill="#98744f"/><path d="m30 56 48 19-7 9-48-18Z" fill="#ad875c"/><path d="M39 72Q23 53 49 17q-1 19 15 24 21 26-8 35Z" fill="#eeb17a"/><path d="M44 75q-6-12 10-32 1 15 9 21 2 14-19 11" fill="#ffdb9e"/></>;break;
 case 'farm':art=<><path d="m9 62 45-24 39 24-44 27Z" fill="#b29a76"/>{[25,45,65].map((x,i)=><g key={i} transform={`translate(${x} ${48+i%2*10})`}><path d="M0 20V-7M0 11-9 3M0 2 10-6" stroke="#8f9b60" strokeWidth="3"/><ellipse cx="-7" cy="1" rx="4" ry="9" transform="rotate(-35 -7 1)" fill="#c2c485"/><ellipse cx="8" cy="-8" rx="4" ry="9" transform="rotate(35 8 -8)" fill="#d9d69a"/></g>)}</>;break;
 case 'lumber':art=<><path d="M22 45v35M78 45v35M49 57v31" stroke="#b19670" strokeWidth="6"/><path d="m11 43 41-22 37 23-40 20Z" fill="#c9b18a"/>{[0,13,26].map(n=><g key={n} transform={`translate(27 ${60+n*.45})`}><path d="m0 0 40-9 7 8-40 10Z" fill="#ad8c64"/><ellipse cx="5" cy="5" rx="7" ry="5" fill="#dec69c"/></g>)}</>;break;
 case 'tree':case 'wood':art=tree;break;
 case 'flowers':art=<>{[25,50,73].map((x,i)=><g key={x}><path d={`M${x} 82v-${30+i%2*15}`} stroke="#8eaa7d" strokeWidth="3"/>{[0,1,2,3,4].map(a=><circle key={a} cx={x+Math.cos(a*1.26)*9} cy={45-i%2*10+Math.sin(a*1.26)*9} r="7" fill={i%2?'#e8c394':'#d9a1aa'}/>)}<circle cx={x} cy={45-i%2*10} r="5" fill="#f7e1af"/></g>)}</>;break;
 case 'bench':art=<><path d="m17 55 49-24 20 11-51 27Z" fill="#c8a77d"/><path d="m17 41 49-24v13L17 54Z" fill="#d8bd95"/><path d="M23 59v17M77 47v19M36 67v18" stroke="#aa8b63" strokeWidth="5"/></>;break;
 case 'path':case 'stone':art=<>{[0,1,2].map(i=><path key={i} transform={`translate(${i*20} ${-i*12})`} d="m17 67 20-10 17 7-3 12-21 8-16-8Z" fill={['#c3c3b1','#d6d1bd','#aeb6a6'][i]}/>)}</>;break;
 case 'water':art=<><path d="M50 14Q8 62 31 80q22 16 39-6 19-20-20-60" fill="#a5cacb"/><path d="M50 14q18 55 2 64-15 8-25-9 0 30 35 15 35-13-12-70" fill="#8fb8bd"/><path d="M35 52q-8 13-2 18" fill="none" stroke="#e0eddf" strokeWidth="5" strokeLinecap="round"/></>;break;
 case 'clay':case 'pottery':case 'lantern':art=<><path d="M32 24h36l-4 18q31 41-14 43-41-1-14-43Z" fill="#cfa990"/><path d="M59 25h9l-4 17q31 41-14 43l-4-6q35-1 10-37Z" fill="#b78d77"/><ellipse cx="50" cy="25" rx="18" ry="6" fill="#a8866d"/>{kind==='lantern'&&<path d="m38 53 25-6v18l-25 5Z" fill="#f4d394"/>}</>;break;
 case 'food':art=<><ellipse cx="50" cy="77" rx="31" ry="12" fill="#c4a77b"/><path d="M22 62q26-20 56 0l-6 18H29Z" fill="#dec299"/>{[35,51,67].map((x,i)=><circle key={x} cx={x} cy={51-i%2*8} r="12" fill={i%2?'#c39b80':'#c6b17d'}/>)}<path d="m52 33 10-12 7 9-16 8Z" fill="#94b383"/></>;break;
 case 'axe':art=<><path d="m33 84 26-64 7 4-24 65Z" fill="#b99569"/><path d="m51 25 25-2 9 14-25 18-14-9Z" fill="#a4b4ad"/><path d="m76 23 9 14-25 18-2-9Z" fill="#849991"/></>;break;
 }
 return <svg className="item-art" viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="86" rx="32" ry="8" fill="#56704c" opacity=".1"/>{art}</svg>;
}
