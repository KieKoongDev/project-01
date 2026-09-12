// Original procedural pentatonic ambience; no downloaded music or autoplay.
export type Cue='pick'|'success'|'fail'|'points'|'level';
let ctx:AudioContext|null=null,master:GainNode|null=null,musicBus:GainNode|null=null,timer:ReturnType<typeof setInterval>|null=null;
let enabled=false,music=true,step=0,volume=.35;
function tone(frequency:number,at:number,duration:number,gain:number,bus:GainNode,type:OscillatorType='sine'){
 if(!ctx)return;const osc=ctx.createOscillator(),amp=ctx.createGain();osc.type=type;osc.frequency.value=frequency;osc.connect(amp);amp.connect(bus);amp.gain.setValueAtTime(0,at);amp.gain.linearRampToValueAtTime(gain,at+.025);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.start(at);osc.stop(at+duration+.02);osc.onended=()=>{osc.disconnect();amp.disconnect();};
}
function stopMusic(){if(timer)clearInterval(timer);timer=null;}
function beginMusic(){stopMusic();if(!ctx||!enabled||!music||document.hidden)return;const beat=()=>{if(!ctx||!musicBus||ctx.state!=='running')return;const melody=[0,4,7,9,7,4,2,4,0,7,9,12,9,7,4,2];const n=melody[step++%melody.length];tone(220*2**(n/12),ctx.currentTime,.8,.09,musicBus);if(step%4===1)tone(110,ctx.currentTime,2.6,.05,musicBus);};beat();timer=setInterval(beat,620);}
export async function setSound(on:boolean){enabled=on;if(!on){stopMusic();await ctx?.suspend();return false;}try{ctx??=new AudioContext();if(!master){master=ctx.createGain();master.gain.value=volume;master.connect(ctx.destination);musicBus=ctx.createGain();musicBus.connect(master);}await ctx.resume();beginMusic();return ctx.state==='running';}catch{enabled=false;return false;}}
export function setMusic(on:boolean){music=on;beginMusic();if(musicBus&&ctx)musicBus.gain.setTargetAtTime(on?1:0,ctx.currentTime,.08);}
export function setVolume(v:number){volume=v;if(ctx&&master)master.gain.setTargetAtTime(v,ctx.currentTime,.03);}
export function playCue(cue:Cue){if(!ctx||!master||!enabled||ctx.state!=='running'||document.hidden)return;const notes:Record<Cue,number[]>={pick:[660],success:[523,659,784],fail:[220,196],points:[880,1175],level:[523,659,784,1047]};notes[cue].forEach((f,i)=>tone(f,ctx!.currentTime+i*.085,cue==='level'?.5:.22,.15,master!,'triangle'));}
export function attachVisibility(){const listener=()=>{if(document.hidden){stopMusic();void ctx?.suspend();}else if(enabled){void ctx?.resume().then(beginMusic).catch(()=>{});}};document.addEventListener('visibilitychange',listener);return()=>{document.removeEventListener('visibilitychange',listener);stopMusic();void ctx?.suspend();};}
