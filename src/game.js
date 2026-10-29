'use strict';
// Dexter's Suspicious Stuff — Long Way Home.
// The first Classic Sniff Test is retained unmodified in a sandboxed optional mode.
// All platformer movement, collision, scoring and level progression are original deterministic code.
const W=384,H=216,STEP=1/60,GRAVITY=845,MAX_SPEED=116;
const $=id=>document.getElementById(id);
const canvas=$('game'),g=canvas.getContext('2d',{alpha:false});g.imageSmoothingEnabled=false;
const sprite=new Image(),logo=new Image(),portrait=new Image(),classicPark=new Image();
sprite.src='__SPRITE_URL__'; logo.src='__LOGO_URL__';portrait.src='__PORTRAIT_URL__';classicPark.src='__PARK_URL__';
const FONT='bold 9px ui-monospace,monospace';
const COLOR={ink:'#17273c',night:'#0a1d2d',cream:'#fff0cc',yellow:'#ffcd77',green:'#9bdd6f',blue:'#7bd7f4',red:'#f68b70'};
const L=(name,subtitle,width,sky,grounds,platforms,bridges,checkpoints,enemyX,pawXY,evidence,biome)=>({name,subtitle,width,sky,grounds,platforms,bridges,checkpoints,enemyX,pawXY,evidence,biome});
const LEVELS=[
 L('LAKESIDE LAP','The usual walk. Suspiciously vertical.',1600,'day',[[0,338,182],[395,780,180],[851,1213,183],[1290,1600,182]],
  [[284,149,54],[347,158,59],[738,151,63],[811,148,45],[1170,151,60],[1241,159,68]],[],[510,1030],
  [575,995,1425],[[100,152],[160,145],[274,124],[360,134],[450,153],[605,153],[715,144],[810,125],[905,152],[1085,154],[1218,126],[1355,151],[1460,150]],
  {id:'leaves',name:'LEAF PILE',x:1490,grade:2},'lakeside'),
 L('BRAMBLE BOARDWALK','Trust your nose. Not the air.',1760,'gold',[[0,380,183],[445,810,184],[941,1282,184],[1359,1760,183]],
  [[325,151,83],[610,147,56],[775,146,65],[960,153,75],[1165,129,62,'moving'],[1260,157,64],[1343,149,52]],
  [[812,169,135,784]],[545,1100],
  [240,686,1040,1465],[[120,153],[250,154],[350,127],[478,154],[620,124],[760,122],[840,148],[895,146],[997,128],[1115,147],[1200,102],[1310,130],[1450,154],[1560,152],[1675,148]],
  {id:'paper',name:'MYSTERY PAPER',x:1638,grade:1},'boardwalk'),
 L('PAWPRINT PASSAGE','The end of the path. For now.',1870,'late',[[0,430,184],[502,851,183],[985,1347,181],[1423,1870,184]],
  [[380,150,56],[460,152,54],[690,140,59],[818,148,60],[1000,140,64],[1278,151,76],[1400,152,66],[1560,130,74,'moving']],
  [[852,168,135,818]],[575,1220],
  [275,750,1190,1530,1745],[[110,155],[278,155],[396,127],[480,128],[615,151],[735,113],[833,124],[900,143],[951,143],[1045,116],[1170,151],[1320,129],[1470,154],[1580,103],[1700,153],[1795,148]],
  {id:'stick',name:'SUSPICIOUS STICK',x:1777,grade:3},'passage')
];
// The existing three Nose Stamps now unlock one optional, distinct challenge.
// The original three campaign levels and their ranking remain untouched.
const BONUS_LEVEL=L('GOLDEN SOCK TRAIL','No ordinary dog would go this far. Naturally.',1410,'gold',
 [[0,292,182],[360,710,180],[807,1092,183],[1172,1410,181]],
 [[236,149,66],[315,153,59],[625,145,65],[693,139,60,'moving'],[846,152,66],[1015,146,58],[1133,148,62],[1260,142,64,'moving']],
 [[712,167,96,670],[1094,169,78,1050]],[480,917],
 [206,580,943,1240],[[120,150],[249,121],[379,149],[515,151],[637,117],[738,140],[860,124],[965,148],[1050,118],[1118,142],[1212,150],[1328,122]],
 {id:'sock',name:'THE GOLDEN SOCK',x:1342,grade:5},'socktrail');
const SECRET_SPOTS=[{x:368,y:136},{x:643,y:123},{x:1590,y:107}];
const state={mode:'title',stage:0,hearts:3,livesUsed:0,paws:0,stagePaws:0,found:[],rank:[],time:72,won:false,cam:0,simTime:0,
     player:null,ground:[],platforms:[],bridges:[],checkpoints:[],enemies:[],tokens:[],evidence:null,level:null,
     msg:'',msgTimer:0,particles:[],shake:0,quality:'full',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
     sound:true,audio:null,elapsed:0,stageScore:[],lastFrame:0,slowFrames:0,lowAuto:false,scentPulse:null,stageDiscoveries:[],landedCount:0,gamepadActive:false,gamepadSelection:0,bonusCompleted:false,bonusTime:0,bonusPaws:0,
     echoTrace:null,trace:[],traceClock:0,echoEnd:null,echoOn:true,music:true,musicStep:0,musicNext:0,musicStage:-1,
     bestRuns:[null,null,null],trialMedals:[null,null,null],currentRun:[],trialMode:false,trialReturn:null,trialResult:null,trialGhost:null,trialFalls:0,trialSelection:0,trialSavedMode:'results',visitorRuns:[null,null,null],visitorMedals:[null,null,null],ghostChoice:'own',trialGhostKind:'own',replayImportIntent:'rival'};
const input={left:false,right:false,jump:false,gamepadHeld:false};const heldBy={keyboard:{left:false,right:false,jump:false},touch:{left:false,right:false,jump:false},gamepad:{left:false,right:false,jump:false}};const controllerPrev={sniff:false,bark:false,start:false,confirm:false,left:false,right:false};
const pressedKeys=new Set();
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rand=x=>{let n=Math.sin(x*12.9898+5.631)*43758.5453;return n-Math.floor(n)};
const pix=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const txt=(t,x,y,size=9,color=COLOR.cream,align='left')=>{g.font=`bold ${size}px ui-monospace,monospace`;g.textAlign=align;g.textBaseline='top';g.fillStyle='#0a1b29';g.fillText(t,x+1,y+1);g.fillStyle=color;g.fillText(t,x,y)};
const rect=(x,y,w,h,border='#302f32',inside='#af7048')=>{pix(x+2,y+3,w,h,'#0c182799');pix(x,y,w,h,border);pix(x+2,y+2,w-4,h-4,inside);pix(x+3,y+3,w-6,2,'#ffe5a04d')};
const image=(img,x,y,w,h)=>{if(img.complete&&img.naturalWidth)g.drawImage(img,Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function setMessage(msg,secs=3,detail){state.msg=msg;state.msgTimer=secs;$('message').textContent=msg;if(detail!==undefined)$('detail').textContent=detail;}
// Stage-specific original arpeggios, synthesized on demand; no media downloads or timers.
const SCORE={
 day:[72,76,79,76,74,79,81,79,76,79,83,79,74,76,79,72,71,74,79,74,69,74,76,74,72,76,79,76,74,71,69,null],
 gold:[69,72,76,72,67,72,74,72,69,72,79,76,72,69,67,null,65,69,74,69,64,69,72,69,67,71,74,71,69,67,64,null],
 late:[67,null,70,74,72,null,70,67,65,null,69,72,74,null,72,69,67,70,74,77,75,null,72,70,69,null,65,69,67,null,62,null],
 socktrail:[76,79,83,79,74,76,79,null,72,76,79,83,79,76,72,null,74,78,81,78,73,76,78,null,71,74,78,81,78,74,71,null]
};
const BASS={day:[48,50,52,47],gold:[45,43,41,40],late:[43,41,38,40],socktrail:[48,45,47,43]};
function playTone(midi,when,dur,volume,type='triangle'){
 const ctx=state.audio;if(!ctx||ctx.state!=='running'||midi===null)return;
 const o=ctx.createOscillator(),v=ctx.createGain();o.type=type;
 o.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),when);
 v.gain.setValueAtTime(.0001,when);v.gain.linearRampToValueAtTime(volume,when+.012);
 v.gain.exponentialRampToValueAtTime(.0001,when+dur);o.connect(v);v.connect(ctx.destination);
 o.onended=()=>{o.disconnect();v.disconnect()};o.start(when);o.stop(when+dur+.02);
}
function musicTick(){
 const ctx=state.audio;
 if(!state.music||!state.sound||state.mode!=='play'||!ctx||ctx.state!=='running'){
  state.musicNext=0;return;
 }
 const sky=state.level.sky,track=state.stage===3?'socktrail':sky;
 if(state.musicStage!==state.stage||!state.musicNext){
  state.musicStage=state.stage;state.musicStep=0;state.musicNext=ctx.currentTime+.055;
 }
 // A bounded lookahead scheduler: no setInterval, no unbounded audio-node queue.
 for(let n=0;n<2&&state.musicNext<ctx.currentTime+.13;n++){
  const k=state.musicStep++,notes=SCORE[track],tempo=track==='late'?.258:.223;
  const note=notes[k%notes.length];if(note!==null)playTone(note,state.musicNext,tempo*.79,.0105,'square');
  if(k%4===0)playTone(BASS[track][Math.floor(k/8)%4],state.musicNext,tempo*1.45,.013,'triangle');
  if(state.time<12&&k%4===2)playTone(88,state.musicNext,tempo*.19,.004,'sine');
  state.musicNext+=tempo;
 }
}
function beep(freq=380,dur=.07,type='square',gain=.037){if(!state.sound)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;if(!state.audio)state.audio=new C();if(state.audio.state==='suspended')state.audio.resume().catch(()=>{});const now=state.audio.currentTime,o=state.audio.createOscillator(),v=state.audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);o.frequency.exponentialRampToValueAtTime(Math.max(38,freq*.67),now+dur);v.gain.setValueAtTime(gain,now);v.gain.exponentialRampToValueAtTime(.0005,now+dur+.025);o.connect(v);v.connect(state.audio.destination);o.onended=()=>{o.disconnect();v.disconnect()};o.start(now);o.stop(now+dur+.03)}catch(_){/* optional sound */}}
function fanfare(){for(let i=0;i<4;i++)setTimeout(()=>beep([392,494,587,784][i],.11,'triangle',.038),i*100)}
function burst(x,y,color,n=9){if(state.quality==='low'||state.reduced)n=Math.min(n,4);for(let i=0;i<n;i++){const a=i*Math.PI*2/n;state.particles.push({x,y,vx:Math.cos(a)*(18+rand(i+x)*32),vy:Math.sin(a)*(13+rand(i+y)*27)-16,life:.4+rand(i*3+y)*.3,c:color});}if(state.particles.length>70)state.particles.splice(0,state.particles.length-70)}
function messageForStage(){const l=state.level;setMessage(l.name+': '+l.subtitle,4,
 state.stage===3?'Follow the scented crossings. Find the Golden Sock before time expires.':'Find paw tokens, sniff the evidence, and reach the wooden gate.');}
function bonusUnlocked(){return state.won&&state.stageDiscoveries.length===3;}
function syncBonusControl(){const btn=$('bonusBtn');btn.hidden=!((state.mode==='results'||state.mode==='bonusclear')&&bonusUnlocked());btn.textContent=state.mode==='bonusclear'?'REPLAY SECRET TRAIL':'SECRET SOCK TRAIL';
 const trials=$('trialsBtn');trials.hidden=!(['results','trials','trialclear'].includes(state.mode)||(state.trialMode&&['play','pause','gameover'].includes(state.mode)));
 trials.textContent=state.trialMode&&['play','pause','gameover'].includes(state.mode)?'EXIT TRIAL':state.mode==='results'?'RANGER TRIALS':state.mode==='trials'?'BACK TO CASE':'VIEW TRIALS';syncReplayControls();}
function startBonus(){if(!['results','bonusclear'].includes(state.mode)||!bonusUnlocked())return false;
 state.bonusCompleted=false;startLevel(3);setMessage('SECRET TRAIL UNLOCKED. The last missing sock is out there.',5,
 'Use SNIFF to expose two fading crossings. Reach the sock, then file your report.');beep(780,.2,'triangle');return true;}

function startAdventure(){state.trialMode=false;state.trialReturn=null;state.trialGhost=null;state.hearts=3;state.paws=0;state.found=[];state.rank=[];state.stageScore=[];state.stageDiscoveries=[];state.livesUsed=0;state.won=false;state.bonusCompleted=false;startLevel(0);fanfare()}
function startLevel(index){const l=index===3?BONUS_LEVEL:LEVELS[index];state.stage=index;state.level=l;state.ground=l.grounds.map(([x,end,y])=>({x,w:end-x,y,id:'ground'}));
 state.platforms=l.platforms.map(([x,y,w,m],i)=>({x,y,w,startX:x,moving:m==='moving',id:'platform-'+i,oldX:x}));
 state.bridges=l.bridges.map(([x,y,w,anchor],i)=>({x,y,w,anchor,active:0,id:'bridge-'+i}));
 state.checkpoints=l.checkpoints.map(x=>({x,active:false}));
 state.enemies=l.enemyX.map((x,i)=>({x,min:x-28,max:x+28,base:x,v:((i%2)?-1:1)*33,stun:0,y:enemyGroundY(x)-16,h:16,w:15,alive:true,type:index===1?'gnome':'acorn'}));
 state.tokens=l.pawXY.map(([x,y],i)=>({x,y,got:false,i}));state.evidence={...l.evidence,found:false};state.secret=index===3?{x:-999,y:-999,got:true,reveal:0}:{...SECRET_SPOTS[index],got:state.trialMode,reveal:0};
 state.time=72;state.elapsed=0;state.stagePaws=0;state.cam=0;state.simTime=0;state.currentRun=[];state.trialFalls=0;state.particles=[];state.shake=0;state.scentPulse=null;state.slowFrames=0;state.trace=[];state.traceClock=0;state.echoTrace=null;state.echoEnd=null;
 state.player={x:36,y:state.ground[0].y-25,w:19,h:25,vx:0,vy:0,dir:1,onGround:true,onPlat:null,coyote:.11,jumpBuf:0,sniff:0,sniffCool:0,bark:0,barkCool:0,sulk:0,inv:0,respawn:36,prevBottom:0,land:0,stepTimer:0};
 state.mode='play';releaseAllInputs();$('startBtn').textContent='RESTART ADVENTURE';$('pauseBtn').disabled=false;
 $('cabinetStage').textContent=index===3?'SECRET TRAIL':`STAGE 0${index+1}/03`;messageForStage();syncBonusControl();canvas.focus();}
function enemyGroundY(x){for(const gr of state.ground)if(x>=gr.x&&x<=gr.x+gr.w)return gr.y;return 182;}
function togglePause(){if(state.mode==='play'){state.mode='pause';$('pauseBtn').textContent='RESUME';setMessage('An official intermission. Dexter approves.',1000)}else if(state.mode==='pause'){state.mode='play';$('pauseBtn').textContent='PAUSE';setMessage('Back to unacceptable amounts of exercise.',2)}}
// Trail Echo is an optional, session-only record of the *actual* previous attempt.
// Samples stay bounded; leaving a level discards them. It never changes collision/physics.
function rememberTrail(reason){
 const s=state,p=s.player;if(!p)return;
 if(s.trace.length>5){s.echoTrace=s.trace.slice();s.echoTrace.push({x:Math.round(p.x+9),y:Math.round(p.y+p.h)});
  s.echoEnd={x:Math.round(p.x+9),y:Math.round(p.y+p.h),reason};}
 s.trace=[];s.traceClock=0;
}
function toggleEcho(){state.echoOn=!state.echoOn;const b=$('echoBtn');b.textContent=state.echoOn?'TRAIL ECHO: ON':'TRAIL ECHO: OFF';b.setAttribute('aria-pressed',String(state.echoOn));
 setMessage(state.echoOn?'Previous footsteps revealed after a fall.':'Previous footsteps hidden.',2.3);}
function respawn(hurtReason){rememberTrail(hurtReason);const p=state.player;state.hearts--;state.livesUsed++;state.trialFalls++;state.shake=.32;beep(135,.3,'sawtooth',.06);burst(p.x+10,Math.min(p.y+12,198),'#ffa887',12);
 if(state.hearts<=0){state.mode='gameover';$('pauseBtn').disabled=true;syncBonusControl();setMessage('Dexter has filed a formal complaint. Retry the stage.',20);return;}
 p.x=p.respawn;p.y=enemyGroundY(p.x)-p.h;p.vx=0;p.vy=0;p.onGround=true;p.coyote=.11;p.inv=1.6;p.onPlat=null;p.sulk=.1;
 setMessage(hurtReason==='pit'?'Wet paws. An outrage. Back to the checkpoint.':'That garden pest has been reported. Back to the checkpoint.',2.6);}
function restartStage(){const i=state.stage;
 if(state.trialMode){const echo=state.echoTrace,end=state.echoEnd;startLevel(i);state.echoTrace=echo;state.echoEnd=end;state.hearts=3;return;}
 const earlier=new Set(LEVELS.slice(0,Math.min(i,3)).map(l=>l.evidence.id));const foundBefore=state.found.filter(id=>earlier.has(id));const pawsBefore=state.paws-state.stagePaws;const discoveries=state.stageDiscoveries.filter(stage=>stage<i);const oldEcho=state.echoTrace,oldEnd=state.echoEnd;startLevel(i);state.echoTrace=oldEcho;state.echoEnd=oldEnd;state.found=foundBefore;state.paws=pawsBefore;state.stageDiscoveries=discoveries;state.hearts=3;}
function nextLevel(){if(state.mode!=='level')return;if(state.stage<2){startLevel(state.stage+1);beep(490,.12,'triangle')}else beginRank()}
function stageComplete(){if(state.mode!=='play')return;
 const elapsed=Math.round(state.elapsed*10)/10;
 const previous=state.stage<3?state.bestRuns[state.stage]:null;
 const newBest=state.stage<3&&(!previous||elapsed<previous.time-.05);
 if(newBest)state.bestRuns[state.stage]={time:elapsed,falls:state.trialFalls,paws:state.stagePaws,path:state.currentRun.slice()};
 if(state.trialMode){
  const total=state.tokens.length,clean=state.trialFalls===0;
  const medal=clean&&state.stagePaws>=Math.ceil(total*.6)&&elapsed<=[17,20,21][state.stage]?'GOLD':clean&&state.stagePaws>=Math.ceil(total*.35)?'SILVER':'BRONZE';
  const weights={BRONZE:1,SILVER:2,GOLD:3};
  const newMedal=weights[medal]>(weights[state.trialMedals[state.stage]]||0);
  if(newMedal)state.trialMedals[state.stage]=medal;
  state.trialResult={stage:state.stage,elapsed,falls:state.trialFalls,paws:state.stagePaws,total,medal,newMedal,newBest,previous:previous?.time??null};
  state.mode='trialclear';$('pauseBtn').disabled=true;syncBonusControl();fanfare();
  setMessage(`${medal} RANGER TRIAL. ${newBest?'NEW PERSONAL BEST.':'Case study complete.'}`,25,
   'The record exists in this session only. Retry, choose another trail, or return to your solved case.');return;
 }
 if(state.stage===3){state.bonusCompleted=true;state.bonusTime=Math.ceil(state.time);state.bonusPaws=state.stagePaws;
  state.mode='bonusclear';$('pauseBtn').disabled=true;syncBonusControl();fanfare();
  burst(state.player.x+12,state.player.y,'#ffe39b',25);
  setMessage('GOLDEN SOCK RECOVERED. Dexter was right to be suspicious.',30,'Secret trail completed. The original case stays solved.');return;}
 state.mode='level';state.stageScore.push({time:Math.ceil(state.time),paws:state.stagePaws,hearts:state.hearts,stamp:state.secret.got});
 $('pauseBtn').disabled=true;setMessage('STAGE CLEAR — Evidence filed. Proceed when ready.',20);fanfare();burst(state.player.x+12,state.player.y,'#ffe39b',20);}
function beginRank(){state.mode='rank';state.rank=[];state.gamepadSelection=0;setMessage('Three suspects. Rank them from most to least suspicious.',30,'Press 1–3 or tap the large evidence cards.');beep(435,.18,'triangle');$('pauseBtn').disabled=true}
const RANK_ITEMS=[{id:'leaves',name:'LEAF PILE',grade:2},{id:'paper',name:'MYSTERY PAPER',grade:1},{id:'stick',name:'SUSPICIOUS STICK',grade:3}];
function rank(id){if(state.mode!=='rank'||state.rank.includes(id))return;state.rank.push(id);beep(290+state.rank.length*80,.075,'triangle');burst(75+state.rank.length*83,112,'#fff5a5',8);
 if(state.rank.length===3){const result=['stick','leaves','paper'];state.won=state.rank.every((v,i)=>v===result[i]);state.mode='results';syncBonusControl();fanfare();setMessage(state.won?'Correct. Dexter will permit one (1) celebration.':'Verdict disputed. The dog remains unconvinced.',30,'Three complete stages. All original suspects judged.');}
 else setMessage(`Verdict #${state.rank.length} filed. ${3-state.rank.length} accusation(s) left.`,20);}
// Ranger Trials are an optional replay system. They never write campaign evidence, ranks,
// stamps or secret eligibility and retain no data outside this page/session.
function showTrials(){
 if(!['results','trialclear','trials'].includes(state.mode))return false;
 if(state.mode==='results'){
  state.trialReturn={paws:state.paws,found:state.found.slice(),rank:state.rank.slice(),hearts:state.hearts,
   livesUsed:state.livesUsed,stageScore:state.stageScore.map(v=>({...v})),stageDiscoveries:state.stageDiscoveries.slice(),
   won:state.won,bonusCompleted:state.bonusCompleted,bonusTime:state.bonusTime,bonusPaws:state.bonusPaws};
 }
 state.trialMode=false;state.trialGhost=null;state.mode='trials';state.trialSelection=0;
 $('pauseBtn').disabled=true;syncBonusControl();setMessage('RANGER TRIALS — choose a trail to race your earlier footsteps.',25,
  'Personal bests and ghost paths are kept only for this session. No online score or saved data.');return true;
}
function startTrial(index){
 if(state.mode!=='trials'||index<0||index>2||!state.trialReturn)return false;
 state.trialMode=true;state.trialResult=null;const visitor=state.visitorRuns[index];
 state.trialGhost=state.ghostChoice==='visitor'&&visitor?visitor:state.bestRuns[index];
 state.trialGhostKind=state.ghostChoice==='visitor'&&visitor?'visitor':'own';
 state.hearts=3;state.livesUsed=0;state.paws=0;state.found=[];
 startLevel(index);state.secret.got=true; // Prevent trial play from duplicating canonical Nose Stamps.
 $('cabinetStage').textContent='RANGER TRIAL 0'+(index+1);
 setMessage(state.trialGhost?(state.trialGhostKind==='visitor'?'VISITOR CARTRIDGE LOADED. Chase the other Dexter!':'RACE THE PREVIOUS WALK. Dexter demands improvement.'):'FIRST RECORDED TRIAL. Set a course record.',4,
  'Collect paw tokens, sniff the evidence, and reach the gate. The trial does not alter your solved case.');return true;
}
function returnFromTrials(){
 if(!(['trials','trialclear'].includes(state.mode)||(state.trialMode&&['play','pause','gameover'].includes(state.mode)))||!state.trialReturn)return false;
 const save=state.trialReturn;
 for(const k of ['paws','hearts','livesUsed','won','bonusCompleted','bonusTime','bonusPaws'])state[k]=save[k];
 for(const k of ['found','rank','stageScore','stageDiscoveries'])state[k]=save[k];
 state.trialMode=false;state.trialGhost=null;state.trialResult=null;state.trialReturn=null;
 state.mode='results';$('cabinetStage').textContent='CASE FILED';$('pauseBtn').disabled=true;syncBonusControl();
 setMessage('Your original case is intact. The Ranger Trials remain on record for this session.',10);return true;
}
function trialMenuButton(){if(state.trialMode&&['play','pause','gameover'].includes(state.mode))returnFromTrials();else if(state.mode==='results'||state.mode==='trialclear')showTrials();else if(state.mode==='trials')returnFromTrials();}
function resetToTitle(){state.trialMode=false;state.trialReturn=null;state.trialGhost=null;state.mode='title';syncBonusControl();releaseAllInputs();$('pauseBtn').disabled=true;$('startBtn').textContent='START ADVENTURE';$('cabinetStage').textContent='INSERT CARTRIDGE';setMessage('A dog. A park. Three objects under suspicion.',99,'Run, jump, sniff, and judge.');}
function jump(){const p=state.player;if(state.mode==='title'){startAdventure();return;}if(state.mode==='level'){nextLevel();return;}if(state.mode==='results'||state.mode==='gameover'||state.mode==='bonusclear'){state.mode==='gameover'?restartStage():startAdventure();return;}
 if(state.mode!=='play')return;p.jumpBuf=.14;}
function jumpRelease(){const p=state.player;if(p&&p.vy<-125){p.vy=-125;} }
function sniff(){if(state.mode==='title'){startAdventure();return;}if(state.mode==='level'){nextLevel();return;}if((state.mode==='results'||state.mode==='bonusclear')&&bonusUnlocked()){startBonus();return;}if(state.mode!=='play')return;const p=state.player;
 if(p.sniffCool>.07){p.sulk=.7;p.sniffCool=.35;p.vx*=.3;setMessage('STOP. THIS NOSE IS A PRECISION INSTRUMENT.',1.6);beep(105,.21,'sawtooth');return;}
 p.sniff=.43;p.sniffCool=.98;const cx=p.x+p.w/2;let foundSomething=false;
 const bridgeAhead=state.bridges.find(b=>b.active<=0&&b.anchor>=cx-26&&b.anchor<cx+275);
 const stampNearby=!state.secret.got&&Math.abs(cx-state.secret.x)<165;const target=bridgeAhead?bridgeAhead.anchor:stampNearby?state.secret.x:state.evidence.x;
 state.scentPulse={x:cx,y:p.y+13,target,age:0,stage:state.stage};
 if(!state.evidence.found&&Math.abs(cx-state.evidence.x)<37){state.evidence.found=true;state.found.push(state.evidence.id);foundSomething=true;burst(state.evidence.x,145,'#fff2a3',20);beep(570,.20,'triangle');setMessage(`${state.evidence.name} — GRADE ${state.evidence.grade} SUSPICION. Gate unlocked.`,4.4);}
 if(!state.secret.got&&Math.abs(cx-state.secret.x)<110&&Math.abs(p.y+13-state.secret.y)<85){
  state.secret.reveal=5.2;foundSomething=true;
  burst(state.secret.x,state.secret.y,'#d5f2bc',10);beep(690,.15,'triangle');
  setMessage('HIDDEN NOSE STAMP REVEALED! Reach the glowing print.',3.5);
 }
 for(const b of state.bridges){if(Math.abs(cx-b.anchor)<106){b.active=5.5;foundSomething=true;burst(b.anchor,158,'#7deaff',16);beep(620,.12,'sine');setMessage('SCENT BRIDGE REVEALED! Move before the trail fades.',3.2);}}
 if(!foundSomething){burst(cx+p.dir*15,p.y+13,'#f8e3b5',6);beep(210,.08);setMessage('Dust, grass, and suspicion. Keep investigating.',1.6);}
}
function bark(){if(state.mode==='title'){startAdventure();return;}if(state.mode!=='play')return;const p=state.player;if(p.barkCool>0)return;p.bark=.28;p.barkCool=.90;beep(164,.13,'square',.06);beep(92,.095,'sawtooth',.045);
 let hits=0;for(const e of state.enemies){if(!e.alive)continue;const dx=e.x-(p.x+10);if(dx*p.dir>-12&&dx*p.dir<82&&Math.abs(e.y-p.y)<40){e.stun=2.2;hits++;burst(e.x+7,e.y,'#ffd58d',8)}}if(hits)setMessage('Barked the problem into temporary submission.',1.7);}
function syncControls(){for(const [id,on] of [['left',input.left],['right',input.right],['jump',input.jump]])$(id).setAttribute('aria-pressed',String(!!on));}
function setHold(k,v,source='touch'){
 const was=input[k];heldBy[source][k]=v;input[k]=heldBy.keyboard[k]||heldBy.touch[k]||heldBy.gamepad[k];
 $(k).setAttribute('aria-pressed',String(input[k]));
 if(k==='jump'){if(input[k]&&!was)jump();else if(!input[k]&&was)jumpRelease();}
}
function releaseAllInputs(){pressedKeys.clear();for(const source of ['keyboard','touch','gamepad'])for(const k of ['left','right','jump'])heldBy[source][k]=false;for(const k of ['left','right','jump'])input[k]=false;syncControls();}
const BIND={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump'};
document.addEventListener('keydown',e=>{if($('classicPanel').classList.contains('visible'))return;
 if(e.target instanceof Element&&e.target.closest('#replayDesk')&&!(state.mode==='trials'&&['Digit1','Digit2','Digit3'].includes(e.code)))return;
 if(state.mode==='trials'||state.mode==='trialclear'){
  if(e.repeat)return;
  if(['Digit1','Digit2','Digit3'].includes(e.code)&&state.mode==='trials'){e.preventDefault();startTrial(Number(e.code.slice(-1))-1);return;}
  if(e.code==='Escape'){e.preventDefault();if(state.mode==='trialclear')showTrials();else returnFromTrials();return;}
  if(state.mode==='trials'&&['ArrowLeft','KeyA','ArrowRight','KeyD'].includes(e.code)){
   e.preventDefault();state.trialSelection=(state.trialSelection+(['ArrowLeft','KeyA'].includes(e.code)?2:1))%3;return;}
  if(e.code==='Enter'||e.code==='Space'){e.preventDefault();if(state.mode==='trials')startTrial(state.trialSelection);else showTrials();return;}
  if(e.code==='KeyR'&&state.mode==='trialclear'){e.preventDefault();state.mode='trials';startTrial(state.trialResult.stage);return;}
  return;
 }
 if(Object.hasOwn(BIND,e.code)){e.preventDefault();const k=BIND[e.code];pressedKeys.add(e.code);if(!heldBy.keyboard[k])setHold(k,true,'keyboard');}
 if(e.repeat)return;
 if(['KeyX','KeyK'].includes(e.code)){e.preventDefault();sniff()}if(['KeyZ','KeyJ'].includes(e.code)){e.preventDefault();bark()}
 if(['KeyP','Escape'].includes(e.code)){e.preventDefault();togglePause()}
 if(e.code==='KeyB'&&['results','bonusclear'].includes(state.mode)&&bonusUnlocked()){e.preventDefault();startBonus()}
 if(e.code==='KeyE'){e.preventDefault();toggleEcho()}if(e.code==='KeyM'){e.preventDefault();toggleMusic()}
 if(e.code==='Enter'){e.preventDefault();if(state.mode==='title'||state.mode==='results'||state.mode==='bonusclear')startAdventure();else if(state.mode==='level')nextLevel();else if(state.mode==='gameover')restartStage();else if(state.mode==='pause')togglePause();}
 if(state.mode==='rank'&&['Digit1','Digit2','Digit3'].includes(e.code)){e.preventDefault();rank(RANK_ITEMS[Number(e.code.slice(-1))-1].id)} });
document.addEventListener('keyup',e=>{if(Object.hasOwn(BIND,e.code)){e.preventDefault();pressedKeys.delete(e.code);const action=BIND[e.code];setHold(action,[...pressedKeys].some(code=>BIND[code]===action),'keyboard')}});
window.addEventListener('blur',()=>{releaseAllInputs();if(state.mode==='play')togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.mode==='play')togglePause()});
function pointerHold(id,handler){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){};handler(true)});for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,e=>{e.preventDefault();handler(false)});}
pointerHold('left',v=>setHold('left',v));pointerHold('right',v=>setHold('right',v));pointerHold('jump',v=>setHold('jump',v));
for(const [id,fn] of [['sniff',sniff],['bark',bark]])$(id).addEventListener('pointerdown',e=>{e.preventDefault();fn()});
$('echoBtn').addEventListener('click',toggleEcho);$('musicBtn').addEventListener('click',toggleMusic);
$('startBtn').addEventListener('click',startAdventure);$('pauseBtn').addEventListener('click',togglePause);$('bonusBtn').addEventListener('click',startBonus);$('trialsBtn').addEventListener('click',trialMenuButton);

// OMNI V Ranger Replay Cartridge: bounded, manual, offline transfer of real course records.
// No cookies, storage APIs, network fetch, external code, campaign unlocks, or executable input.
const REPLAY_KIND='dexter-ranger-replay',REPLAY_VERSION=1,REPLAY_LIMIT=130000;
const MEDAL_WEIGHT={BRONZE:1,SILVER:2,GOLD:3};
function replayModeSafe(){return ['title','level','rank','results','trials','trialclear','bonusclear'].includes(state.mode);}
function syncReplayControls(){
 const safe=replayModeSafe(),any=state.bestRuns.some(Boolean),visitor=state.visitorRuns.some(Boolean);
 $('exportReplayBtn').disabled=!safe||!any;
 $('importReplayBtn').disabled=!safe;$('restoreReplayBtn').disabled=!safe;
 $('ghostChoiceBtn').hidden=!visitor;$('ghostChoiceBtn').disabled=!safe;
 $('ghostChoiceBtn').textContent='GHOST: '+(state.ghostChoice==='visitor'?'VISITOR':'MY PB');
 $('ghostChoiceBtn').setAttribute('aria-pressed',String(state.ghostChoice==='visitor'));
 const note=$('replaySummary');
 if(note)note.textContent=visitor?'RIVAL CARTRIDGE READY':any?'MY ROUTES READY TO EXPORT':'MANUAL SAVE / INVITE A RIVAL';
}
function toReplayRecord(v,i){if(!v)return null;
 return {time:v.time,falls:v.falls,paws:v.paws,path:v.path.map(q=>[q.x,q.y])};}
function createReplayPack(){return {kind:REPLAY_KIND,version:REPLAY_VERSION,
 stages:state.bestRuns.map((v,i)=>toReplayRecord(v,i)),medals:state.trialMedals.slice()};}
function numeric(value,lo,hi){return typeof value==='number'&&Number.isFinite(value)&&value>=lo&&value<=hi;}
function validateReplayPack(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload)||payload.kind!==REPLAY_KIND||payload.version!==REPLAY_VERSION||!Array.isArray(payload.stages)||payload.stages.length!==3||!Array.isArray(payload.medals)||payload.medals.length!==3)throw Error('Unknown or damaged Ranger cartridge.');
 const runs=payload.stages.map((raw,i)=>{
  if(raw===null)return null;
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||!numeric(raw.time,5,72)||!numeric(raw.falls,0,100)||!Number.isInteger(raw.falls)||!Number.isInteger(raw.paws)||!numeric(raw.paws,0,LEVELS[i].pawXY.length)||!Array.isArray(raw.path)||raw.path.length<18||raw.path.length>470)throw Error('Corrupt stage record.');
  if(raw.path.length*.155>raw.time+1)throw Error('Inconsistent record timing.');
  let last=null,resets=0;const path=raw.path.map(pair=>{
   if(!Array.isArray(pair)||pair.length!==2||!Number.isInteger(pair[0])||!Number.isInteger(pair[1])||!numeric(pair[0],0,LEVELS[i].width+25)||!numeric(pair[1],-80,320))throw Error('Invalid route coordinates.');
   const point={x:pair[0],y:pair[1]};
   if(last&&(Math.abs(point.x-last.x)>44||Math.abs(point.y-last.y)>105)){
    const landing=LEVELS[i].grounds.find(g=>point.x>=g[0]&&point.x<=g[1]);
    const resetPoint=[36,...LEVELS[i].checkpoints].some(cp=>Math.abs(point.x-cp)<36);
    const respawned=resetPoint&&point.x<last.x-44&&landing&&Math.abs(point.y-landing[2])<32;
    if(!respawned||++resets>raw.falls)throw Error('Impossible route segment.');
   }
   last=point;return point;
  });
  if(path[0].x>160||path[path.length-1].x<LEVELS[i].width-150)throw Error('Incomplete stage route.');
  return {time:Math.round(raw.time*10)/10,falls:raw.falls,paws:raw.paws,path};
 });
 if(!runs.some(Boolean))throw Error('Cartridge contains no completed routes.');
 const medals=payload.medals.map((v,i)=>{if(v===null)return null;if(!runs[i]||!Object.hasOwn(MEDAL_WEIGHT,v))throw Error('Invalid medal claim.');return v;});
 return {runs,medals};
}
function replayNotice(msg,ok=true){$('replayNote').textContent=msg;$('replayNote').dataset.status=ok?'good':'error';}
function exportReplayCartridge(){
 if(!replayModeSafe()||!state.bestRuns.some(Boolean)){replayNotice('Complete a park stage before exporting.',false);return false;}
 try{
  const json=JSON.stringify(createReplayPack());const file=new Blob([json],{type:'application/json'});
  if(file.size>REPLAY_LIMIT)throw Error('Recorded route exceeds cartridge budget.');
  const url=URL.createObjectURL(file),link=document.createElement('a');
  link.href=url;link.download='Dexter_Ranger_Replay.json';link.hidden=true;document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  replayNotice('Exported Ranger Replay. Save the JSON file; this game does not store it.');return true;
 }catch(e){replayNotice('Export blocked: '+e.message,false);return false;}
}
async function importReplayCartridge(file,intent){
 if(!replayModeSafe()){replayNotice('Finish or pause your run before loading a cartridge.',false);return false;}
 if(!file||file.size>REPLAY_LIMIT){replayNotice('Replay file missing or larger than 130 KB.',false);return false;}
 try{
  const raw=await file.text();if(raw.length>REPLAY_LIMIT)throw Error('Cartridge exceeds size limit.');
  const clean=validateReplayPack(JSON.parse(raw));
  // Atomic commit after all three stages have been validated.
  if(intent==='restore'){
   for(let i=0;i<3;i++){
    const fresh=clean.runs[i],old=state.bestRuns[i];
    if(fresh&&(!old||fresh.time<old.time))state.bestRuns[i]=fresh;
    if(clean.medals[i]&&MEDAL_WEIGHT[clean.medals[i]]>(MEDAL_WEIGHT[state.trialMedals[i]]||0))state.trialMedals[i]=clean.medals[i];
   }
   replayNotice('Personal bests restored. Campaign progress and secret locks are unchanged.');
  }else{
   state.visitorRuns=clean.runs;state.visitorMedals=clean.medals;state.ghostChoice='visitor';
   replayNotice('Visiting Ranger loaded. Finish the case, then race their route in Ranger Trials.');
  }
  syncReplayControls();beep(660,.13,'triangle');return true;
 }catch(e){replayNotice('Cartridge rejected: '+(e instanceof SyntaxError?'Invalid JSON.':e.message),false);return false;}
}
function askReplayFile(intent){if(!replayModeSafe())return;
 state.replayImportIntent=intent;const input=$('replayInput');input.value='';input.click();}
$('exportReplayBtn').addEventListener('click',exportReplayCartridge);
$('importReplayBtn').addEventListener('click',()=>askReplayFile('rival'));
$('restoreReplayBtn').addEventListener('click',()=>askReplayFile('restore'));
$('ghostChoiceBtn').addEventListener('click',()=>{
 if(!state.visitorRuns.some(Boolean))return;state.ghostChoice=state.ghostChoice==='visitor'?'own':'visitor';
 syncReplayControls();replayNotice(state.ghostChoice==='visitor'?'Visitor ghost selected.':'Personal best ghost selected.');
});
$('replayInput').addEventListener('change',async e=>{
 const f=e.target.files?.[0];const intent=state.replayImportIntent;
 try{if(f)await importReplayCartridge(f,intent);}finally{e.target.value='';}
});
syncReplayControls();

$('soundBtn').addEventListener('click',()=>{state.sound=!state.sound;$('soundBtn').textContent=state.sound?'♪ SOUND ON':'♪ SOUND OFF';$('soundBtn').setAttribute('aria-pressed',String(!state.sound));if(state.sound)beep(460,.12)});
function toggleMusic(){state.music=!state.music;state.musicNext=0;const b=$('musicBtn');b.textContent=state.music?'MUSIC: ON':'MUSIC: OFF';b.setAttribute('aria-pressed',String(state.music));
 if(state.music&&state.sound)beep(640,.07,'triangle',.018);}
$('effectsBtn').addEventListener('click',()=>{state.quality=state.quality==='full'?'low':'full';state.lowAuto=false;$('effectsBtn').textContent='FX: '+state.quality.toUpperCase();$('effectsBtn').setAttribute('aria-pressed',String(state.quality==='low'))});
function enterClassic(){if(state.mode==='play')togglePause();$('mainArea').classList.add('off');$('classicPanel').classList.add('visible');const frame=$('classicFrame');if(!frame.srcdoc){frame.srcdoc=$('classicSource').innerHTML;}window.scrollTo(0,0)}
function leaveClassic(){$('classicPanel').classList.remove('visible');$('mainArea').classList.remove('off');$('classicFrame').removeAttribute('srcdoc');$('classicFrame').src='about:blank';window.scrollTo(0,0);canvas.focus();}
$('classicBtn').addEventListener('click',enterClassic);$('backBtn').addEventListener('click',leaveClassic);
// Standard Gamepad Mapping: left stick/d-pad; A jump/confirm, B bark, X sniff, Start pause.
// Polling is read-only and short-circuits on browsers without a connected controller.
function pollGamepad(){
 if($('classicPanel').classList.contains('visible')){
  for(const k of ['left','right','jump'])if(heldBy.gamepad[k])setHold(k,false,'gamepad');
  for(const k of Object.keys(controllerPrev))controllerPrev[k]=false;
  state.gamepadActive=false;return;
 }
 const pads=typeof navigator.getGamepads==='function'?navigator.getGamepads():[];
 const pad=pads&&Array.from(pads).find(v=>v&&v.connected!==false);
 const pressed=i=>!!(pad&&pad.buttons&&pad.buttons[i]&&pad.buttons[i].pressed);
 const axis=pad&&pad.axes?Number(pad.axes[0])||0:0;
 const left=!!pad&&(axis<-.32||pressed(14)),right=!!pad&&(axis>.32||pressed(15));
 state.gamepadActive=!!pad;
 if(state.mode==='trials'&&pad){
  if(left&&!controllerPrev.left)state.trialSelection=(state.trialSelection+2)%3;
  if(right&&!controllerPrev.right)state.trialSelection=(state.trialSelection+1)%3;
 }
 if(state.mode==='rank'&&pad){
  if(left&&!controllerPrev.left)state.gamepadSelection=(state.gamepadSelection+2)%3;
  if(right&&!controllerPrev.right)state.gamepadSelection=(state.gamepadSelection+1)%3;
 }
 for(const [k,v] of [['left',left],['right',right],['jump',pressed(0)&&state.mode==='play']]){
  if(heldBy.gamepad[k]!==v)setHold(k,v,'gamepad');
 }
 const sn=pressed(2),bk=pressed(1),st=pressed(9),cf=pressed(0);
 if(sn&&!controllerPrev.sniff)sniff();
 if(bk&&!controllerPrev.bark)bark();
 if(st&&!controllerPrev.start){
  if(state.mode==='title'||state.mode==='results'||state.mode==='bonusclear')startAdventure();
  else if(state.mode==='play'||state.mode==='pause')togglePause();
  else if(state.mode==='level')nextLevel();else if(state.mode==='gameover')restartStage();else if(state.mode==='trials')returnFromTrials();else if(state.mode==='trialclear')showTrials();
 }
 if(cf&&!controllerPrev.confirm){
  if(state.mode==='rank')rank(RANK_ITEMS[state.gamepadSelection].id);
  else if(state.mode==='trials')startTrial(state.trialSelection);else if(state.mode==='trialclear')showTrials();
  else if(state.mode==='level')nextLevel();
 }
 controllerPrev.sniff=sn;controllerPrev.bark=bk;controllerPrev.start=st;controllerPrev.confirm=cf;
 controllerPrev.left=left;controllerPrev.right=right;
}
function canvasCoords(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.focus();const p=canvasCoords(e);
 if(state.mode==='trials'){if(p.y>=174){returnFromTrials();return;}
  if(p.y>=70&&p.y<160){const i=Math.floor((p.x-15)/118);if(i>=0&&i<3)startTrial(i);}return;}
 if(state.mode==='trialclear'){if(p.y>158){if(p.x<190){state.mode='trials';startTrial(state.trialResult.stage);}else showTrials();}return;}
 if(state.mode==='title'){if(p.y>166&&p.x<240){enterClassic()}else startAdventure();return;}
 if(state.mode==='level'){nextLevel();return;}
 if(state.mode==='gameover'){restartStage();return;}
 if(state.mode==='bonusclear'){if(p.x>=126&&p.x<=235&&p.y>=164&&p.y<=201){startBonus();}else startAdventure();return;}
 if(state.mode==='results'){if(bonusUnlocked()&&p.y>=186&&p.x>=128&&p.x<=234){startBonus();}else startAdventure();return;}
 if(state.mode==='pause'){togglePause();return;}
 if(state.mode==='rank'){if(p.y>=87&&p.y<=151){for(let i=0;i<3;i++){const x=24+i*115;if(p.x>=x&&p.x<=x+105){rank(RANK_ITEMS[i].id);break}}}}
});
const activeBridges=()=>state.bridges.filter(b=>b.active>0);
function overlaps(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function currentPlatforms(){return [...state.ground,...state.platforms,...activeBridges()];}
function update(dt){if(state.mode!=='play')return;const s=state,p=s.player,lv=s.level;s.simTime+=dt;s.elapsed+=dt;s.time=Math.max(0,s.time-dt);
 if(s.time<=0){rememberTrail('timeout');s.mode='gameover';$('pauseBtn').disabled=true;setMessage('TIME OUT. Dexter will not be taking questions.',30);beep(140,.3,'sawtooth');return;}
 s.traceClock+=dt;
 if(s.traceClock>=.155){s.traceClock-=.155;const point={x:Math.round(p.x+9),y:Math.round(p.y+p.h)};s.trace.push(point);
  if(s.trace.length>470)s.trace.shift();s.currentRun.push(point);
  if(s.currentRun.length>470)s.currentRun.shift();}
 s.msgTimer=Math.max(0,s.msgTimer-dt);s.shake=Math.max(0,s.shake-dt);p.inv=Math.max(0,p.inv-dt);p.sniff=Math.max(0,p.sniff-dt);p.sniffCool=Math.max(0,p.sniffCool-dt);p.bark=Math.max(0,p.bark-dt);p.barkCool=Math.max(0,p.barkCool-dt);p.sulk=Math.max(0,p.sulk-dt);p.land=Math.max(0,p.land-dt);p.stepTimer=Math.max(0,p.stepTimer-dt);p.jumpBuf=Math.max(0,p.jumpBuf-dt);p.coyote=Math.max(0,p.coyote-dt);
 if(s.scentPulse){s.scentPulse.age+=dt;if(s.scentPulse.age>.92)s.scentPulse=null;}
 s.secret.reveal=Math.max(0,s.secret.reveal-dt);
 for(const b of s.bridges)b.active=Math.max(0,b.active-dt);
 for(const platform of s.platforms){platform.oldX=platform.x;if(platform.moving)platform.x=platform.startX+Math.sin(s.simTime*1.5)*29;}
 if(p.onPlat){const platform=s.platforms.find(q=>q.id===p.onPlat);if(platform)p.x+=platform.x-platform.oldX;}
 let direction=Number(input.right)-Number(input.left);if(p.sulk>0)direction=0;
 const goal=direction*MAX_SPEED;const accel=direction?860:1160;p.vx+=clamp(goal-p.vx,-accel*dt,accel*dt);
 if(direction)p.dir=direction;
 if(p.onGround&&Math.abs(p.vx)>58&&p.stepTimer<=0){p.stepTimer=.115;if(s.quality==='full'&&!s.reduced){s.particles.push({x:p.x+8,y:p.y+p.h,vx:-p.dir*13,vy:-8,life:.23,c:'#f5d6a2'});if(s.particles.length>70)s.particles.shift();}}
 if(p.jumpBuf>0&&p.coyote>0&&p.sulk<=0){p.vy=-315;p.jumpBuf=0;p.coyote=0;p.onGround=false;p.onPlat=null;beep(345,.12,'triangle');burst(p.x+8,p.y+23,'#fff0bf',6);}
 p.x=clamp(p.x+p.vx*dt,0,lv.width-p.w);
 p.prevBottom=p.y+p.h;p.vy=Math.min(510,p.vy+GRAVITY*dt);p.y+=p.vy*dt;
 let landed=null;
 if(p.vy>=0){for(let layer=0;layer<3;layer++){
  const group=layer===0?s.ground:layer===1?s.platforms:s.bridges;
  for(const platform of group){if(layer===2&&platform.active<=0)continue;
   if(p.prevBottom>platform.y+6||p.y+p.h<platform.y||p.x+p.w-3<=platform.x||p.x+3>=platform.x+platform.w)continue;
   if(landed===null||platform.y<landed.y)landed=platform;
  }
 }}
 if(landed){const firstContact=!p.onGround;p.y=landed.y-p.h;p.vy=0;p.onGround=true;p.coyote=.115;p.onPlat=landed.id?.startsWith('platform')?landed.id:null;if(firstContact){p.land=.16;s.landedCount++;if(Math.abs(p.vx)>60)burst(p.x+9,p.y+p.h,'#d6be85',4)}}
 else {p.onGround=false;p.onPlat=null;}
 if(p.y>H+35){respawn('pit');return;}
 for(const e of s.enemies){if(!e.alive)continue;if(e.stun>0)e.stun=Math.max(0,e.stun-dt);else{e.x+=e.v*dt;if(e.x>e.max){e.x=e.max;e.v=-Math.abs(e.v)}if(e.x<e.min){e.x=e.min;e.v=Math.abs(e.v)}}
  if(p.inv<=0&&overlaps(p,{x:e.x-5,y:e.y,w:e.w,h:e.h})){
   if(p.vy>=30&&p.prevBottom<e.y+7){e.alive=false;p.vy=-215;burst(e.x,e.y,'#e9c48e',15);beep(510,.09,'square');setMessage('Patrol neutralized. A disturbing level of competence.',2)}
   else if(e.stun===0){respawn('enemy');return;}
  }
 }
 for(const token of s.tokens){if(token.got)continue;const v={x:token.x-5,y:token.y-5,w:11,h:11};if(overlaps(p,v)){token.got=true;s.paws++;s.stagePaws++;beep(610+Math.min(200,s.stagePaws*12),.06,'triangle',.028);burst(token.x,token.y,'#ffe2a0',7);if(s.stagePaws%5===0)setMessage(`${s.stagePaws} paw tokens recovered. Dexter accepts payment in admiration.`,1.9);}}
 if(!s.secret.got&&s.secret.reveal>0&&overlaps(p,{x:s.secret.x-8,y:s.secret.y-7,w:16,h:15})){
  s.secret.got=true;s.secret.reveal=0;s.stageDiscoveries.push(s.stage);
  beep(785,.11,'triangle');burst(s.secret.x,s.secret.y,'#f0d996',14);
  setMessage(`NOSE STAMP 0${s.stage+1} / 03 RECOVERED. Entirely justified smugness.`,3.6);
 }
 for(const cp of s.checkpoints){if(p.x>=cp.x&&!cp.active){cp.active=true;p.respawn=cp.x;beep(675,.14,'triangle');burst(cp.x,137,'#b6f2bb',14);setMessage('CHECKPOINT! Progress secured against humiliation.',2.1);}}
 if(p.x>=lv.width-67&&s.evidence.found){stageComplete();return;}
 if(p.x>=lv.width-100&&!s.evidence.found&&s.msgTimer<=0)setMessage('The gate demands evidence. SNIFF the marked suspect.',1.8);
 const cameraTarget=clamp(p.x+8-118,0,lv.width-W);s.cam+=(cameraTarget-s.cam)*Math.min(1,dt*7.4);
 let particleCount=0;for(let i=0;i<s.particles.length;i++){
  const particle=s.particles[i];particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;particle.vy+=65*dt;particle.life-=dt;
  if(particle.life>0)s.particles[particleCount++]=particle;
 }s.particles.length=particleCount;
}
function triangle(c,x,y,w,h,dark,light){c.fillStyle=dark;c.beginPath();c.moveTo(x,y+h);c.lineTo(x+w*.48,y);c.lineTo(x+w,y+h);c.closePath();c.fill();c.fillStyle=light;c.beginPath();c.moveTo(x+w*.48,y);c.lineTo(x+w*.59,y+h*.31);c.lineTo(x+w*.51,y+h*.22);c.lineTo(x+w*.44,y+h*.34);c.lineTo(x+w*.34,y+h*.29);c.closePath();c.fill();}
function cloud(c,x,y){c.fillStyle='#ffffff99';c.fillRect(x+9,y,31,3);c.fillRect(x,y+3,58,7);c.fillRect(x+5,y+10,53,3);c.fillStyle='#f8ffffba';c.fillRect(x+8,y+3,44,4);}
function backCache(){let far={},near={};for(const key of ['day','gold','late']){
  const c=document.createElement('canvas');c.width=640;c.height=190;const a=c.getContext('2d');
  const col=key==='day'?['#5baded','#a3d9f6','#68bfd4']:key==='gold'?['#70b2dc','#f5c5a1','#79bcb9']:['#375a8d','#8a87b7','#7099ad'];
  const grad=a.createLinearGradient(0,0,0,168);grad.addColorStop(0,col[0]);grad.addColorStop(.62,col[1]);grad.addColorStop(1,col[2]);a.fillStyle=grad;a.fillRect(0,0,640,190);
  for(let i=0;i<6;i++)cloud(a,28+i*119+Math.round(rand(i+3)*30),44+(i%3)*11);
  for(let i=-1;i<7;i++)triangle(a,i*135-42,70+(i%3)*14,160,65,key==='late'?'#4b668d':'#679fb6','#d7eff0');
  a.fillStyle=key==='gold'?'#539e9e':'#419bcc';a.fillRect(0,122,640,32);
  for(let i=0;i<104;i++){const x=(i*53)%638,y=124+i%5*5;a.fillStyle=i%3===0?'#d1e9d0':'#83c4d8';a.fillRect(x,y,4+i%4*2,1)}
  for(let i=0;i<90;i++){const x=(i*19+Math.floor(rand(i+2)*21))%645;const h=11+Math.floor(rand(i*4+11)*20);
   a.fillStyle=key==='late'?'#385575':'#387c79';a.beginPath();a.moveTo(x,150-h);a.lineTo(x-7,150);a.lineTo(x+8,150);a.fill();}
  far[key]=c;
  const b=document.createElement('canvas');b.width=640;b.height=190;const v=b.getContext('2d');
  for(let i=0;i<22;i++){const x=i*32+Math.round(rand(i+85)*20)-8,yy=148+Math.floor(rand(i+11)*15),h=27+Math.round(rand(i+27)*24),r=18+Math.floor(rand(i+3)*8);
   v.fillStyle='#71543a';v.fillRect(x+2,yy-h+20,7,h);
   v.fillStyle=key==='late'?'#2d5968':key==='gold'?'#866e4b':'#276949';v.fillRect(x-r+1,yy-h+3,r*2+4,25);
   v.fillStyle=key==='gold'?'#b68a4e':key==='late'?'#446c71':'#428e4f';v.fillRect(x-r+5,yy-h,r*2-8,20);
   v.fillStyle=key==='gold'?'#f0bf78':key==='late'?'#8d9fa1':'#77b762';v.fillRect(x-r+7,yy-h+3,10,4);
  }
  near[key]=b;
 }return{far,near};}
const BG=backCache();
function parallaxLayer(img,shift,y=0){if(!img)return;const len=img.width,xx=-((Math.floor(shift)%len)+len)%len;for(let x=xx-len;x<W+len;x+=len)g.drawImage(img,x,y);}
function drawBackground(l,cam,time){const key=l.sky;parallaxLayer(BG.far[key],cam*.12,0);parallaxLayer(BG.near[key],cam*.33,0);
 if(key==='late'){for(let i=0;i<16;i++){const x=(i*59+12)%W,y=34+(i*11)%41;pix(x,y,i%4===0?2:1,1,'#d5d4ea99');}}
 if(state.quality==='full'&&!state.reduced){for(let i=0;i<13;i++){const xx=(i*71+Math.floor(time*(12+i%3*2)))%(W+20)-10;const yy=124+i%4*6;pix(xx,yy,i%3===0?4:2,1,i%3===0?'#d9f9ef':'#e3edba')}}
 const dark=key==='late'?'#163e53':'#4d9971';pix(0,166,W,50,dark);
 // Farther grass line visible only behind openings between the navigable solid platforms.
 for(let i=0;i<34;i++){const x=(i*37-Math.round(cam*.49))%W;pix(x,165+(i%3)*3,3,1,'#b4da85')}
}
function drawDirt(gr,theme){const x=Math.round(gr.x),w=Math.round(gr.w),y=Math.round(gr.y);const main=theme==='passage'?'#866342':theme==='boardwalk'||theme==='socktrail'?'#956b46':'#9b784c';
 pix(x,y,w,H-y,'#422f2c');pix(x+2,y+4,Math.max(1,w-4),H-y-4,main);pix(x,y,w,4,'#2c6c3b');pix(x+1,y+1,w-2,3,'#92c75a');pix(x+4,y+4,w-8,2,'#bbd779');
 for(let i=Math.max(0,Math.floor(x/15));i<(x+w)/15;i++){const px=i*15+4;if(px>x+w-5)break;const yy=y+9+(i*7)%18;pix(px,yy,6,2,i%2===0?'#c58f59':'#7f563d');pix(px+3,yy+7,2,2,'#5b4337');}
 pix(x+3,y+7,2,H-y-8,'#b18559');pix(x+w-3,y+7,2,H-y-8,'#5a4533');
 for(let i=8;i<w-5;i+=14){if(rand(i+x)>.3){pix(x+i,y-3,2,4,'#36793e');pix(x+i+1,y-6,1,4,'#8fc563');}}
}
function pitWater(level,cam,t){const l=level;for(let z=0;z<l.grounds.length-1;z++){const x=l.grounds[z][1],w=l.grounds[z+1][0]-x;if(x+w<cam-15||x>cam+W+15)continue;pix(x,179,w,37,l.sky==='late'?'#274e72':'#336f9c');pix(x,184,w,3,'#77cfe7');for(let i=5;i<w;i+=19){const wave=(state.quality==='full'&&!state.reduced)?Math.round(Math.sin(t*3+i*.4)*2):0;pix(x+i,188+wave,7,2,'#b7e8e2');pix(x+i+8,201-wave,9,1,'#68b8d2');}pix(x,210,w,6,'#214565');}
}
function drawWoodPlatform(p,t){const x=p.x,y=p.y,w=p.w;pix(x+2,y+5,w,8,'#382f29');pix(x,y,w,9,'#533e2e');pix(x+2,y+1,w-4,6,'#be8750');pix(x+3,y+1,w-6,2,'#ebc078');pix(x+5,y+5,w-10,1,'#8b593b');for(let i=10;i<w;i+=25){pix(x+i,y+2,2,2,'#604436');pix(x+i+1,y+2,1,1,'#f5cf93')}pix(x+5,y+9,4,6,'#71503a');pix(x+w-9,y+9,4,6,'#71503a');if(p.moving){pix(x+w/2-7,y-4,14,3,'#d5e9ab');}}
function drawScentBridge(b){const active=b.active>0;if(active){pix(b.x,b.y,b.w,8,'#175b78');pix(b.x+2,b.y+1,b.w-4,4,'#84e6eb');for(let i=0;i<b.w;i+=12)pix(b.x+i+3,b.y,5,2,'#fffbd9');pix(b.x+4,b.y+6,b.w-8,2,'#398899');}
 else {for(let i=0;i<b.w;i+=13){pix(b.x+i,b.y+1,7,2,'#85e6f099');pix(b.x+i+2,b.y+5,3,1,'#81d7e877')}}
 // Sniff post is always visible; it is spatial guidance, not a fake platform.
 const x=b.anchor;pix(x-2,145,5,31,'#714a36');pix(x-5,137,12,10,'#17364b');pix(x-4,138,10,8,'#7bcae4');txt('?',x+1,138,9,'#fff1bd','center');
}
function tree(x,groundY,variant=0,biome='lakeside'){
 const y=groundY,gold=biome==='boardwalk'||biome==='socktrail',dusk=biome==='passage';
 const shadow=gold?'#654c38':dusk?'#294859':'#24583e';
 const dark=gold?'#93633c':dusk?'#3c6875':'#317b47';
 const mid=gold?'#c88c4d':dusk?'#5b8490':'#4c9b55';
 const light=gold?'#f0bb74':dusk?'#9fb2b4':'#9fd06a';
 pix(x-3,y-36,10,36,'#614532');pix(x-1,y-33,3,28,'#a7794a');
 pix(x-8,y-4,10,3,'#614532');pix(x+4,y-5,9,4,'#614532');
 pix(x-24,y-55,48,16,shadow);pix(x-19,y-65,40,14,shadow);pix(x-11,y-70,25,9,shadow);
 pix(x-26,y-49,12,15,shadow);pix(x+17,y-53,13,18,shadow);
 pix(x-19,y-62,38,23,dark);pix(x-14,y-68,29,9,mid);
 pix(x-27,y-47,15,9,dark);pix(x+14,y-51,14,10,dark);
 pix(x-10,y-65,13,5,light);pix(x+7,y-61,7,3,light);
 pix(x-20,y-49,5,3,mid);pix(x+13,y-45,5,3,mid);
 if(variant%3===0){pix(x-12,y-43,4,3,light);pix(x+5,y-39,2,3,light)}
 if(gold){pix(x-20,y-37,4,3,'#e6ad62');pix(x+19,y-42,3,3,'#f2c47d')}
}

function bench(x,y){pix(x,y-24,34,5,'#69452e');pix(x+2,y-22,30,2,'#dba269');pix(x,y-17,34,4,'#75472b');pix(x+1,y-16,31,2,'#e2ae70');pix(x+5,y-13,4,13,'#513a30');pix(x+27,y-13,4,13,'#513a30')}
function lantern(x,y){pix(x-2,y-35,4,34,'#1e4150');pix(x-6,y-48,12,13,'#152f40');pix(x-4,y-46,8,10,'#f8d58a');pix(x-3,y-45,6,8,'#ffefa8');pix(x-8,y-49,16,2,'#132a37');pix(x-3,y-33,6,2,'#294655')}
function arrowSign(x,y,s){pix(x-2,y-27,4,27,'#533c2e');pix(x-10,y-29,20,12,'#60452d');pix(x-9,y-28,18,10,'#d79e58');txt(s,x,y-26,7,'#26332e','center')}
function flower(x,y,i){pix(x,y-5,1,5,'#367c3c');pix(x-2,y-7,5,3,i%2?'#ffa1a5':'#ffe189');pix(x,y-7,1,1,'#faf5dc');}
function drawDecor(l,cam,t){const left=cam-80,right=cam+W+85;for(let x=90;x<l.width;x+=185){if(x<left||x>right)continue;
 const gy=enemyGroundY(x);if(rand(x)>.26){tree(x,gy-3,Math.floor(x/185),l.biome);}else{bench(x-14,gy-3);lantern(x+42,gy-3);}}
 for(let x=20;x<l.width;x+=36){if(x<left||x>right)continue;const gy=enemyGroundY(x);if(gy===182&&!l.grounds.some(([a,b])=>x>=a&&x<b))continue;const q=Math.floor(rand(x*3)*3);if(q===0)flower(x,gy-5,Math.floor(x/36));else if(q===1){pix(x,gy-9,7,5,'#d78250');pix(x+1,gy-10,5,2,'#f3c573');pix(x+3,gy-5,1,3,'#f4f1d3')}}
 if(l.biome==='boardwalk'){for(let x=14;x<l.width;x+=44){if(x<left||x>right)continue;const gy=enemyGroundY(x);if(!l.grounds.some(([a,b])=>x>=a&&x<b))continue;pix(x,gy-5,23,2,'#88633f');pix(x+2,gy-6,2,3,'#dbad6e');pix(x+18,gy-6,2,3,'#dbad6e');}}
 if(l.biome==='passage'){for(let x=42;x<l.width;x+=130){if(x<left||x>right)continue;const gy=enemyGroundY(x);if(!l.grounds.some(([a,b])=>x>=a&&x<b))continue;lantern(x,gy-2);pix(x-13,gy-4,6,3,'#80999c');pix(x+17,gy-7,7,3,'#4d6879');}}
 for(const cp of state.checkpoints){const gy=enemyGroundY(cp.x),x=cp.x;pix(x,gy-54,3,54,'#48342b');pix(x+3,gy-51,17,17,cp.active?'#a3dc6d':'#d0ac70');pix(x+5,gy-47,12,1,cp.active?'#2c713e':'#6f5b35');txt(cp.active?'✓':'C',x+12,gy-47,10,'#1d3542','center');}
}
// Authored environmental landmarks reinforce the original bright park, with state-specific navigation cues.
function drawParkLandmarks(l,cam,t){
 const lo=cam-90,hi=cam+W+90;
 const sign=(x,label,gy=enemyGroundY(x))=>{
  if(x<lo||x>hi)return;
  pix(x-1,gy-43,4,42,'#523e31');pix(x,gy-43,2,37,'#d2a36a');
  pix(x-30,gy-52,61,16,'#3c533e');pix(x-28,gy-50,57,12,'#e0b575');pix(x-27,gy-49,55,2,'#f4de9d');
  txt(label,x,gy-47,7,'#314937','center');
 };
 const windmill=x=>{if(x<lo||x>hi)return;const gy=enemyGroundY(x);
  pix(x-17,gy-48,34,48,'#5d5947');pix(x-14,gy-44,28,44,'#ebd09b');
  pix(x-15,gy-48,30,5,'#735747');pix(x-9,gy-24,7,15,'#6398a4');pix(x+4,gy-24,7,15,'#6398a4');
  pix(x-19,gy-50,38,3,'#d8aa70');pix(x-2,gy-61,4,22,'#6b4f3c');pix(x-14,gy-52,29,4,'#ab865c');
  if(state.quality==='full'&&!state.reduced){const a=t*.25;const xx=Math.cos(a)*6,yy=Math.sin(a)*6;pix(x+xx-2,gy-52+yy-2,5,5,'#efe1ad');}
 };
 const trailArch=x=>{if(x<lo||x>hi)return;const gy=enemyGroundY(x);
  pix(x-23,gy-59,7,58,'#6b4931');pix(x+17,gy-59,7,58,'#6b4931');
  pix(x-27,gy-66,54,12,'#4e3627');pix(x-25,gy-64,50,8,'#dc9d5c');
  pix(x-21,gy-60,42,2,'#ffe0a2');txt('PAW TRAIL',x,gy-63,7,'#284837','center');
  pix(x-25,gy-4,6,4,'#f0b568');pix(x+19,gy-4,6,4,'#f0b568');
 };
 if(l.biome==='lakeside'){trailArch(176);sign(980,'LAKE WALK');windmill(1145);}
 if(l.biome==='boardwalk'){sign(480,'BRAMBLE RUN');trailArch(1510);}
 if(l.biome==='passage'){sign(285,'KEEP SNIFFING');trailArch(1700);}
 if(l.biome==='socktrail'){trailArch(135);sign(606,'NO RETURNS');sign(1162,'SOCKS ONLY');}
}
// The optional trail has authored evidence of a very particular laundry theft.
// All objects are decorative, finite and culled to the visible camera range.
function drawLaundryLine(l,cam,t){
 if(l.biome!=='socktrail')return;
 for(const anchor of [178,515,927,1230]){
  if(anchor<cam-160||anchor>cam+W+160)continue;
  const y=100;
  pix(anchor-54,y,4,75,'#6c5136');pix(anchor+80,y,4,75,'#6c5136');
  pix(anchor-52,y+5,132,2,'#e6c9a0');pix(anchor-52,y+8,132,1,'#76593e');
  for(let j=0;j<4;j++){
   const xx=anchor-43+j*29,bob=state.reduced||state.quality==='low'?0:Math.round(Math.sin(t*2+j+anchor)*1);
   pix(xx,y+7,3,4,'#584b3b');pix(xx-5,y+11+bob,13,18,j%2?'#c99b6d':'#f1e1b4');
   pix(xx-4,y+22+bob,9,10,j%2?'#d6ad81':'#d3c59d');pix(xx+4,y+25+bob,7,6,'#9e754c');
   pix(xx-3,y+13+bob,5,2,'#fff1d4');
  }
 }
}
function drawHazardCues(l,cam,t){
 const lo=cam-28,hi=cam+W+28;
 for(let i=0;i<l.grounds.length-1;i++){
  const [a,end,y]=l.grounds[i],next=l.grounds[i+1][0];
  for(const x of [end-16,next+15]){
   if(x<lo||x>hi)continue;
   pix(x-2,y-13,3,13,'#6b4a35');pix(x-5,y-19,11,8,'#a8503d');
   pix(x-4,y-18,9,2,'#f5bb72');pix(x-2,y-16,4,3,'#ffe7a0');
   if(state.quality==='full'&&!state.reduced){const yy=Math.round(Math.sin(t*2+x)*1);pix(x+7,y-13+yy,2,4,'#b3efdf');}
  }
 }
}
// A sniff is an actual spatial reading, not merely a cooldown flash.
function drawScentPulse(t){
 const s=state.scentPulse;if(!s||s.stage!==state.stage)return;
 const fade=clamp(1-s.age/.92,0,1),radius=8+s.age*123;
 if(state.quality==='full'&&!state.reduced){
  g.save();g.lineWidth=2;g.strokeStyle=`rgba(155,240,219,${(fade*.68).toFixed(3)})`;
  g.beginPath();g.arc(Math.round(s.x),Math.round(s.y),radius,0,Math.PI*2);g.stroke();
  g.lineWidth=1;g.strokeStyle=`rgba(255,240,178,${(fade*.45).toFixed(3)})`;
  g.beginPath();g.arc(Math.round(s.x),Math.round(s.y),Math.max(1,radius-9),0,Math.PI*2);g.stroke();g.restore();
 }
 const toward=Math.sign(s.target-s.x)||1,span=Math.min(152,Math.abs(s.target-s.x));
 for(let i=1;i<=5;i++){
  const xx=Math.round(s.x+toward*span*i/6),yy=Math.round(s.y-11-Math.sin(i*.8)*5);
  if(Math.abs(xx-s.x)>radius+16)continue;
  const alpha=Math.max(.24,fade*(1-i*.08));
  g.fillStyle=`rgba(255,239,173,${alpha.toFixed(3)})`;
  g.fillRect(xx-1,yy,5,3);g.fillRect(xx-3,yy+3,9,3);
  g.fillRect(xx-4,yy-3,2,2);g.fillRect(xx,yy-5,2,2);g.fillRect(xx+4,yy-3,2,2);
 }
}
function drawSecretStamp(t){
 const s=state.secret;if(!s||s.got)return;
 // In its hidden state, a tiny engraved mark exists in the scenery. Sniffing makes it tangible.
 const x=Math.round(s.x),y=Math.round(s.y);
 if(s.reveal<=0){pix(x-3,y+3,7,2,'#69806b');pix(x,y+1,2,2,'#c5d5a2');return;}
 const bob=state.reduced?0:Math.round(Math.sin(t*4)*2);
 pix(x-9,y-10+bob,18,17,'#355d48');pix(x-7,y-9+bob,14,13,'#ebd18a');
 pix(x-4,y-1+bob,8,5,'#45684b');pix(x-6,y-6+bob,3,3,'#45684b');
 pix(x-1,y-8+bob,3,3,'#45684b');pix(x+4,y-6+bob,3,3,'#45684b');
 if(state.quality==='full'&&!state.reduced){
  const r=10+Math.sin(t*5)*2;g.strokeStyle='#f9edb3a0';g.lineWidth=1;g.strokeRect(x-r,y-r+bob,r*2,r*2);
 }
}
function drawTrailEcho(cam){
 const s=state,points=s.echoTrace;if(!s.echoOn||!points||!points.length)return;
 const sparse=s.quality==='low'||s.reduced?10:6;
 for(let i=0;i<points.length;i+=sparse){const q=points[i];if(q.x<cam-10||q.x>cam+W+10)continue;
  const x=q.x,y=q.y;pix(x-3,y-2,6,2,'#c8f2e5a3');pix(x-2,y-5,2,2,'#ecfbe5a3');
  pix(x+1,y-5,2,2,'#ecfbe5a3');pix(x-5,y-4,2,2,'#c8f2e5a3');}
 const e=s.echoEnd;
 if(e&&e.x>cam-12&&e.x<cam+W+12){pix(e.x-8,e.y-14,16,3,'#2c5768');pix(e.x-6,e.y-18,12,4,'#cdeed5');
  txt('!',e.x,e.y-19,11,'#275b61','center');}
}
function drawToken(token,t){if(token.got)return;const bob=state.reduced?0:Math.round(Math.sin(t*3+token.i*2)*2),x=token.x,y=token.y+bob;
 pix(x-7,y-6,14,13,'#3d69464d');pix(x-5,y-6,10,11,'#835e35');pix(x-4,y-7,8,10,'#ffdf87');pix(x-2,y-2,4,3,'#9a663d');pix(x-5,y-5,2,2,'#fff2c4');pix(x+2,y-5,2,2,'#fff2c4');pix(x-1,y-7,2,2,'#fff2c4');}
function drawAcorn(e,t){const x=e.x,y=e.y;if(!e.alive)return;const wiggle=e.stun>0?0:Math.round(Math.sin(t*7+e.x)*1);
 pix(x-2,y+12,19,3,'#4b4b34');pix(x+1,y+3,13,11,e.type==='gnome'?'#b14d3c':'#7c4c2f');pix(x+2,y+4,11,7,e.type==='gnome'?'#eaa173':'#bb8050');
 if(e.type==='gnome'){pix(x+2,y-8,12,8,'#b54b49');pix(x+5,y-12,5,5,'#da7772');pix(x+2,y,12,4,'#f3c0a0')}else{pix(x,y,16,5,'#593e30');pix(x+2,y-3,12,5,'#9b6739');pix(x+6,y-6,4,4,'#6c513b')}
 pix(x+4,y+6,2,2,'#1c2b35');pix(x+10,y+6,2,2,'#1c2b35');pix(x+7,y+9,3,1,'#563026');pix(x+2,y+13+wiggle,3,2,'#503f31');pix(x+11,y+13-wiggle,3,2,'#503f31');
 if(e.stun>0){txt('z',x+7,y-13,10,'#fff1a6','center');}}
function drawEvidence(l,e,t){const gy=enemyGroundY(e.x),x=e.x,y=gy-6;if(e.id==='leaves'){
 pix(x-15,y-5,32,9,'#6a4727');for(const [dx,dy,c] of [[-12,-8,'#d47730'],[-5,-14,'#eb9e3c'],[5,-10,'#b65b2a'],[10,-6,'#f0b04b'],[-1,-5,'#f2bd64']]){pix(x+dx-4,y+dy,9,6,c);pix(x+dx-2,y+dy+1,5,2,'#ffe39c')}
 }else if(e.id==='sock'){pix(x-12,y-17,18,20,'#ffe6a3');pix(x-9,y-15,12,14,'#f6c673');pix(x+2,y-4,15,9,'#d48d53');pix(x+5,y-2,10,4,'#ffe3a0');pix(x-5,y-11,4,4,'#b97854');}
 else if(e.id==='paper'){pix(x-13,y-12,25,14,'#4f6257');pix(x-11,y-15,24,17,'#fff3db');pix(x-7,y-11,16,1,'#9bada5');pix(x-9,y-5,17,1,'#b9b5a6');pix(x+7,y-15,5,4,'#e2dcc7')}
 else{pix(x-15,y-5,30,5,'#563b29');pix(x-13,y-4,25,2,'#a86e3e');pix(x-3,y-12,4,9,'#6e462c');pix(x-2,y-11,1,8,'#d39963');pix(x+9,y-9,3,5,'#6e462c')}
 const bob=state.reduced?0:Math.round(Math.sin(t*3)*2);
 pix(x-10,gy-52+bob,20,17,e.found?'#2a693d':'#1d5770');pix(x-8,gy-50+bob,16,13,e.found?'#aed879':'#65cfff');txt(e.found?'✓':'?',x,gy-49+bob,12,'#142a3a','center');
 if(Math.abs(state.player.x+10-x)<65){txt(e.found?'FILED':'X  SNIFF',x,gy-64,8,'#fff2be','center');}}
function drawGate(x,y,unlocked,t){pix(x-4,y-60,6,60,'#543b2e');pix(x+27,y-60,6,60,'#543b2e');pix(x-4,y-62,37,8,'#9a673e');pix(x-1,y-60,32,4,'#ebbf7d');pix(x+2,y-50,24,11,unlocked?'#98d477':'#c38b60');pix(x+4,y-48,20,6,unlocked?'#346446':'#684a36');txt(unlocked?'EXIT':'LOCK',x+14,y-47,8,unlocked?'#f6f3bb':'#f6d7b0','center');if(unlocked){const v=Math.round(Math.sin(t*5)*3);pix(x+14,y-33+v,3,8,'#f9ed9c')}}
function drawPlayer(t){const p=state.player;if(p.inv>0&&Math.floor(t*17)%2===0)return;
 const x=p.x-6,y=p.y-7;pix(p.x+3,p.y+p.h-2,p.w-4,3,'#1b2a336a');let stateName='idle',index=0;
 if(p.sulk>0){stateName='unimpressed';index=Math.floor(t*5)%4}
 else if(p.sniff>0){stateName='sniff';index=Math.floor(t*9)%4}
 else if(p.bark>0){stateName='bark';index=Math.floor(t*11)%4}
 else if(!p.onGround){stateName='walk';index=p.vy<0?1:4}
 else if(Math.abs(p.vx)>14){stateName='walk';index=Math.floor(t*10)%6}
 else{index=Math.floor(t*2.6)%4;}
 const row={idle:0,walk:1,sniff:2,bark:3,unimpressed:4}[stateName];
 if(sprite.complete&&sprite.naturalWidth){
  const sq=(p.land>0&&!state.reduced)?Math.sin(Math.PI*p.land/.16)*2:0;
  const sw=32+Math.round(sq),sh=32-Math.round(sq),sx=Math.round(x)-Math.floor(sq/2),sy=Math.round(y)+Math.round(sq);
  g.save();if(p.dir<0){g.translate(sx+sw,0);g.scale(-1,1);g.drawImage(sprite,index*32,row*32,32,32,0,sy,sw,sh)}
  else g.drawImage(sprite,index*32,row*32,32,32,sx,sy,sw,sh);g.restore()
 }
 else{pix(x+6,y+8,20,22,'#1e2426');pix(x+8,y+12,16,9,'#f3e1b9');pix(x+12,y+10,2,3,'#c28b54');pix(x+20,y+10,2,3,'#c28b54');}
 if(p.bark>0){txt('!',p.x+18,p.y-16,12,'#f3e59b');}
 if(p.sniff>0){for(let i=0;i<4;i++){const xx=p.x+10+p.dir*(20+i*9);pix(xx,p.y+7+Math.round(Math.sin(t*8+i)*3),3,2,i%2?'#fff4b5':'#89e9f2')}}
 if(p.sulk>0){txt('...',p.x+9,p.y-18,9,'#ffe39a','center');}
}
// The translucent ghost comes from real run coordinates. Cache the 16-bit silhouette
// tint once per source atlas; the glow follows the actual dog, not a UI rectangle.
const GHOST_TINT={own:null,visitor:null};
function tintedGhostAtlas(kind){
 if(GHOST_TINT[kind])return GHOST_TINT[kind];
 if(!sprite.complete||sprite.naturalWidth!==192)return null;
 const tint=document.createElement('canvas');tint.width=sprite.naturalWidth;tint.height=sprite.naturalHeight;
 const c=tint.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(sprite,0,0);
 c.globalCompositeOperation='source-in';c.fillStyle=kind==='visitor'?'#ffe09a':'#9bfcf4';c.fillRect(0,0,tint.width,tint.height);
 GHOST_TINT[kind]=tint;return tint;
}
function drawRangerGhost(t){
 const replay=state.trialMode?state.trialGhost:null;
 if(!replay?.path?.length||!sprite.complete||!sprite.naturalWidth)return;
 const index=Math.min(replay.path.length-1,Math.floor(state.elapsed/.155));
 const point=replay.path[index];if(!point||point.x<state.cam-35||point.x>state.cam+W+35)return;
 const kind=state.trialGhostKind==='visitor'?'visitor':'own';
 const atlasIndex=(Math.floor(state.elapsed*10)%6)*32,px=Math.round(point.x-10),py=Math.round(point.y-28);
 const tint=tintedGhostAtlas(kind),simple=state.quality==='low'||state.reduced;
 g.save();
 if(tint){g.globalAlpha=simple?.28:.48;
  g.drawImage(tint,atlasIndex,32,32,32,px-1,py,30,30);
  if(!simple){g.drawImage(tint,atlasIndex,32,32,32,px+1,py,30,30);g.drawImage(tint,atlasIndex,32,32,32,px,py-1,30,30);g.drawImage(tint,atlasIndex,32,32,32,px,py+1,30,30);}
 }
 g.globalAlpha=simple?.42:.68;
 g.drawImage(sprite,atlasIndex,32,32,32,px,py,30,30);
 g.globalAlpha=.95;txt(kind==='visitor'?'RIVAL':'PB',Math.round(point.x),Math.round(point.y-38),7,kind==='visitor'?'#ffe09a':'#c2fbef','center');g.restore();
}
function drawWorld(l,t){const cam=Math.round(state.cam);drawBackground(l,cam,t);
 g.save();if(state.shake>0&&!state.reduced&&state.quality==='full'){g.translate(Math.round(Math.sin(t*42)*2),Math.round(Math.cos(t*33)))}g.translate(-cam,0);
 pitWater(l,cam,t);drawDecor(l,cam,t);
 for(const gr of state.ground)if(gr.x+gr.w>cam-12&&gr.x<cam+W+12)drawDirt(gr,l.biome);
 drawParkLandmarks(l,cam,t);drawLaundryLine(l,cam,t);drawHazardCues(l,cam,t);
 for(const p of state.platforms)if(p.x+p.w>cam-20&&p.x<cam+W+20)drawWoodPlatform(p,t);
 for(const b of state.bridges)if(b.x+b.w>cam-20&&b.x<cam+W+20)drawScentBridge(b);
 drawTrailEcho(cam);
 for(const token of state.tokens)if(token.x>cam-20&&token.x<cam+W+20)drawToken(token,t);
 if(state.secret.x>cam-25&&state.secret.x<cam+W+25)drawSecretStamp(t);
 for(const enemy of state.enemies)if(enemy.x>cam-30&&enemy.x<cam+W+30)drawAcorn(enemy,t);
 drawEvidence(l,state.evidence,t);drawGate(l.width-51,enemyGroundY(l.width-51),state.evidence.found,t);
 for(const p of state.particles){pix(p.x,p.y,p.life>.3?3:2,p.life>.3?3:2,p.c)}
 drawScentPulse(t);drawRangerGhost(t);drawPlayer(t);g.restore();
 if(state.quality==='full'&&!state.reduced){for(let i=0;i<6;i++){let x=(W+i*57-Math.floor(t*(4+i%2)))%(W+30);pix(x,31+i%4*8,3,1,'#ffffff69')}}
}
function drawHeart(x,y,lit){const c=lit?'#fb9271':'#5b7177';pix(x+2,y,5,4,c);pix(x+9,y,5,4,c);pix(x,y+3,16,5,c);pix(x+2,y+8,12,3,c);pix(x+5,y+11,6,3,c);if(lit){pix(x+2,y+3,3,2,'#ffd8ae')}}
function drawHud(){pix(0,0,W,26,'#142c3ddb');pix(0,25,W,2,'#f0d494');txt(state.trialMode?`TRIAL 0${state.stage+1}/03  ${state.level.name}`:state.stage===3?'BONUS  GOLDEN SOCK TRAIL':`0${state.stage+1}/03  ${state.level.name}`,10,7,9,'#f4e9c7');
 for(let i=0;i<3;i++)drawHeart(202+i*20,7,i<state.hearts);
 txt('PAW '+String(state.paws).padStart(2,'0'),272,7,9,'#ffe8aa');const secs=String(Math.ceil(state.time)).padStart(2,'0');txt(secs+'s',W-10,7,10,state.time<15?'#ff8b73':'#d3f3e5','right');
 const ratio=clamp((state.player.x+10)/state.level.width,0,1);pix(0,26,W,2,'#172637');pix(0,26,W*ratio,2,'#ffe3a7');
 if(state.trialMode){pix(251,31,123,25,'#122b39df');const best=state.trialGhost;
  txt(best?`${state.trialGhostKind==='visitor'?'RIVAL':'GHOST'} ${best.time.toFixed(1)}s`:'NO PREVIOUS GHOST',370,33,8,state.trialGhostKind==='visitor'?'#ffe09a':'#b6f5e5','right');
  if(best?.path?.length){const ghost=best.path[Math.min(best.path.length-1,Math.floor(state.elapsed/.155))];
   const delta=Math.round(state.player.x+9-ghost.x);
   txt(Math.abs(delta)<5?'NECK AND NECK':delta>=0?`AHEAD +${delta}px`:`BEHIND ${Math.abs(delta)}px`,370,44,8,delta>=0?'#c9f1a3':'#ffe0ad','right');}
 }}

function bottomNote(){if(state.msgTimer<=0)return;const msg=state.msg||'';const short=msg.length>63?msg.slice(0,60)+'...':msg;
 pix(9,194,W-18,17,'#162d3ce9');pix(12,197,3,11,'#f2b66b');txt(short,20,198,9,'#fff0c9');}
function sceneForTitle(t){const l=LEVELS[0];drawBackground(l,0,t);if(classicPark.complete&&classicPark.naturalWidth){g.globalAlpha=.24;g.drawImage(classicPark,0,0,256,170,0,20,384,185);g.globalAlpha=1;}}
function drawTitle(t){sceneForTitle(t);pix(0,0,W,H,'#19314b77');rect(13,15,244,187,'#422e27','#855632');pix(18,20,234,175,'#422d23');pix(21,23,228,169,'#ad7547');pix(24,26,222,8,'#d99d60');pix(24,187,222,3,'#63442e');
 if(logo.complete&&logo.naturalWidth)image(logo,25,37,205,47);else {txt('DEXTER',25,41,23,'#f7db8f');txt('SUSPICIOUS STUFF',25,68,13,'#ffe7a2');}
 txt('THE LONG WAY HOME',36,93,15,'#fff2c8');txt('3 STAGES  •  ONE GRUMPY HERO',36,115,9,'#2d342b');
 rect(35,140,183,27,'#3d3427','#eabf72');txt('▶ START ADVENTURE',126,147,12,'#26342e','center');
 rect(35,175,183,18,'#46382a','#a57a4e');txt('ORIGINAL SNIFF TEST',126,179,9,'#fef0ce','center');
 // Art extracted from the actual first mockup, never regenerated as a generic dog.
 image(portrait,243,36,140,172);txt('EST. IN MISGIVINGS',W-12,201,7,'#ebcf99','right');}
function woodWindow(x,y,w,h){pix(x+4,y+5,w,h,'#0b203299');pix(x,y,w,h,'#543823');pix(x+3,y+3,w-6,h-6,'#b4804c');pix(x+6,y+6,w-12,h-12,'#253e45');pix(x+8,y+8,w-16,3,'#5d7a71');for(let i=14;i<h;i+=23){pix(x+3,y+i,3,3,'#efbc72');pix(x+w-6,y+i,3,3,'#efbc72')}}
function drawTrials(t){sceneForTitle(t);overlay();woodWindow(9,9,366,199);
 txt('RANGER TRIALS',192,22,20,'#ffe3aa','center');
 txt(state.ghostChoice==='visitor'?'VISITING RANGER REPLAY / OFFLINE RIVAL':'RACE YOUR PREVIOUS WALK / SESSION RECORDS',192,49,9,'#bbdfcb','center');
 for(let i=0;i<3;i++){const x=18+i*117,top=76,selected=state.trialSelection===i;
  pix(x,top,110,84,selected?'#f6cf83':'#739080');pix(x+3,top+3,104,78,'#243f43');
  txt('0'+(i+1),x+9,top+9,14,selected?'#ffe7b0':'#c0d7bc');
  txt(['LAKESIDE','BRAMBLE','PAWPRINT'][i],x+55,top+29,10,'#fff0cf','center');
  const rec=state.bestRuns[i],vis=state.visitorRuns[i];
  txt(rec?`MY PB ${rec.time.toFixed(1)}s`:'MY PB --',x+55,top+44,9,rec?'#a9e8c5':'#e6ca9a','center');
  if(vis)txt(`RIVAL ${vis.time.toFixed(1)}s`,x+55,top+56,8,'#ffe09a','center');
  txt(state.trialMedals[i]?`${state.trialMedals[i]} / RACE`:(rec?'RACE AGAIN':'SET RECORD'),x+55,top+69,8,'#f3d99c','center');}
 rect(105,174,174,25,'#755a35','#e7b974');txt('◀ RETURN TO CASE',192,180,11,'#223b32','center');
}
function drawTrialClear(t){sceneForTitle(t);overlay();woodWindow(16,12,352,196);
 const r=state.trialResult;if(!r)return;
 txt('RANGER TRIAL COMPLETE',192,24,16,'#ffe1aa','center');
 const color=r.medal==='GOLD'?'#ffe09b':r.medal==='SILVER'?'#d7e4e7':'#d9a47c';
 txt(r.medal,192,53,26,color,'center');
 txt(LEVELS[r.stage].name,192,91,10,'#cbe8d1','center');
 txt(`${r.elapsed.toFixed(1)}s   •   ${r.paws}/${r.total} PAWS   •   ${r.falls} FALLS`,192,110,10,'#ffe9c4','center');
 txt(r.newBest?'NEW PERSONAL BEST!':r.newMedal?'NEW MEDAL EARNED!':r.previous?`BEST TO BEAT: ${r.previous.toFixed(1)}s`:'YOUR FIRST RECORDED WALK',192,135,10,r.newBest||r.newMedal?'#b7efa2':'#bddcda','center');
 rect(24,166,164,30,'#715431','#eac180');txt('▶ RETRY THIS STAGE',106,173,10,'#20362f','center');
 rect(196,166,164,30,'#405e4f','#c5d9a4');txt('▶ ALL TRIALS',278,173,11,'#20362f','center');
}
function overlay(){pix(0,0,W,H,'#0a1e2ac9')}
function drawLevelClear(t){drawWorld(state.level,t);overlay();woodWindow(49,28,286,163);txt('STAGE CLEAR',192,44,22,'#ffe0a0','center');txt(state.level.name,192,74,12,'#cdeec7','center');pix(65,92,254,1,'#90b7aa');
 txt(`PAWS FOUND  ${state.stagePaws} / ${state.tokens.length}`,73,104,11,'#f0dfbb');txt(`TIME LEFT   ${Math.ceil(state.time)}s`,73,121,11,'#f0dfbb');txt(state.secret.got?'NOSE STAMP     RECOVERED':'NOSE STAMP     STILL MISSING',73,139,9,state.secret.got?'#b8e5a4':'#f4d093');rect(82,159,220,24,'#805f35','#e6b46f');txt(state.stage<2?'▶ NEXT STAGE':'▶ FILE FINAL VERDICTS',192,165,12,'#22362d','center');}
function drawGameOver(t){if(state.level)drawWorld(state.level,t);overlay();woodWindow(45,29,294,159);txt('CASE INTERRUPTED',192,49,19,'#ffd19b','center');txt('Dexter has concerns about your methods.',192,87,10,'#f3dfbf','center');txt(state.trialMode?'RETRY OR EXIT TRIAL BELOW':'No evidence was lost. Retry this stage.',192,105,10,'#b7d7cc','center');rect(72,148,240,29,'#845434','#e0ad6e');txt('▶ RETRY STAGE',192,155,14,'#25352f','center');}
function drawPause(t){drawWorld(state.level,t);drawHud();overlay();woodWindow(27,23,330,174);
 txt('RANGER TRAIL MAP',192,36,18,'#ffe2a5','center');txt('TIME PAUSED — DEXTER HAS CONCERNS',192,57,8,'#c5e3d2','center');
 const l=state.level,mx=48,my=81,mw=286;pix(mx-2,my-8,mw+4,74,'#a67c4b');pix(mx,my-6,mw,70,'#f1d9a0');
 pix(mx+6,my+28,mw-12,3,'#c18d59');const scale=(mw-16)/l.width;
 for(const [a,b] of l.grounds){pix(mx+8+Math.round(a*scale),my+28,Math.max(2,Math.round((b-a)*scale)),10,'#568b50')}
 for(const cp of state.checkpoints){const x=mx+8+Math.round(cp.x*scale);pix(x-1,my+22,3,17,cp.active?'#267f57':'#996b46');pix(x-3,my+18,7,6,cp.active?'#caeb83':'#f0ad77')}
 for(const bridge of state.bridges){const x=mx+8+Math.round(bridge.x*scale);pix(x,my+28,Math.max(2,bridge.w*scale),4,bridge.active>0?'#36a9bd':'#91aeb0')}
 if(state.echoOn&&state.echoTrace?.length){
  const skip=Math.max(2,Math.floor(state.echoTrace.length/85));
  for(let i=0;i<state.echoTrace.length;i+=skip){const q=state.echoTrace[i];
   const x=mx+8+Math.round(q.x*scale);pix(x,my+23,2,3,'#338c98');}
  if(state.echoEnd){const x=mx+8+Math.round(state.echoEnd.x*scale);
   pix(x-2,my+17,5,6,'#aa4f45');pix(x-1,my+18,3,2,'#ffdec1');}
 }
 const ex=mx+8+Math.round(l.evidence.x*scale);pix(ex-3,my+14,7,9,'#704e3e');pix(ex-2,my+13,5,6,l.evidence.found?'#7ddc82':'#f4bb6f');
 if(state.secret?.got&&state.stage<3){const sx=mx+8+Math.round(state.secret.x*scale);pix(sx-2,my+12,5,5,'#ebcb67')}
 const px=mx+8+Math.round(state.player.x*scale);pix(px-3,my+19,7,6,'#172e38');pix(px-1,my+18,4,4,'#f8ecc9');
 txt('START',mx+8,my+3,8,'#655039');txt('GATE',mx+mw-12,my+3,8,'#655039','right');
 txt(state.echoOn&&state.echoTrace?.length?'CYAN = PREVIOUS TRACK  /  RED = LAST FALL':'YOU = CREAM  •  FLAGS = CHECKPOINTS',192,151,8,'#d6e9ca','center');
 rect(96,169,192,22,'#6e5335','#d6a36b');txt('▶ RESUME  /  P',192,174,11,'#20382e','center');}

function rankIcon(id,cx,y){
 if(id==='leaves'){
  pix(cx-19,y+12,38,4,'#463a29');
  for(const [dx,dy,c] of [[-18,4,'#af6630'],[-10,-2,'#d7823c'],[1,-7,'#e4a14a'],[9,0,'#af5935'],[-2,6,'#f4c36a']]){
   pix(cx+dx,y+dy+7,14,6,'#553e2b');pix(cx+dx+2,y+dy+6,10,5,c);pix(cx+dx+3,y+dy+7,4,1,'#ffe4a2');
  }
 } else if(id==='paper'){
  pix(cx-17,y-5,32,28,'#415b61');pix(cx-15,y-8,30,28,'#fff3d5');pix(cx+7,y-8,8,8,'#b4c5c1');
  for(let i=0;i<3;i++)pix(cx-9,y+2+i*6,16-i*2,2,'#a5b1a5');
 } else {
  pix(cx-19,y+11,39,6,'#3f3329');pix(cx-17,y+12,35,3,'#ad7542');pix(cx-5,y+1,5,16,'#62422d');pix(cx-3,y+2,2,14,'#e2a660');
  pix(cx+11,y+3,4,10,'#6b442c');pix(cx+12,y+4,1,9,'#d39c5e');
 }
}
function drawRank(t){sceneForTitle(t);overlay();woodWindow(8,9,368,198);txt('THE OFFICIAL VERDICT',192,18,16,'#ffe2a8','center');txt(state.gamepadActive?'LEFT/RIGHT SELECT  ·  A FILES VERDICT':'Choose MOST suspicious first — 1 / 2 / 3',192,41,9,'#a7d5be','center');
 for(let i=0;i<3;i++){const o=RANK_ITEMS[i],x=24+i*115,done=state.rank.includes(o.id);pix(x+2,89,105,65,'#101d26');pix(x,85,105,65,done?'#4b5146':state.gamepadActive&&state.gamepadSelection===i?'#c6e8ae':'#ae8b57');pix(x+3,88,99,59,done?'#304b48':'#233f47');
 txt('0'+(i+1),x+8,93,12,done?'#738f86':'#ffe2a7');rankIcon(o.id,x+53,105);
 txt(o.name,x+52,129,9,done?'#9ab7a9':'#f5ebcf','center');if(done)txt('FILED',x+52,140,8,'#9bd894','center');}
 txt('ORDER SO FAR',22,165,10,'#c3dcc7');txt(state.rank.map((id,i)=>(i+1)+'.'+id.toUpperCase()).join('  /  ')||'NO VERDICTS FILED',22,181,9,'#ffe19c');}
function drawResults(t){sceneForTitle(t);overlay();woodWindow(16,8,352,201);image(portrait,240,53,128,147);
 txt(state.won?'PERFECT CASE':'CASE CLOSED',28,25,20,state.won?'#f4e7a5':'#e6bc92');txt('THE LONG WAY HOME',28,50,10,'#b7dbc0');pix(29,68,203,1,'#839d88');
 txt('STAGE LEDGER',30,76,10,'#f5d8a0');
 for(let i=0;i<3;i++){const v=state.stageScore[i];
  txt(`0${i+1}  ${v?String(v.time).padStart(2,'0')+'s':'--'}   ${v?String(v.paws).padStart(2,'0')+' PAWS':'NO DATA'}`,30,90+i*14,9,i===2?'#f9e1ac':'#d4ead4');}
 txt(`PAWS ${state.paws} / STAMPS ${state.stageDiscoveries.length}/3 / FALLS ${state.livesUsed}`,30,133,8,'#efd9bb');
 txt(state.won?'SUSPICION: 100%':'SUSPICION: DISPUTED',30,150,10,state.won?'#a9ed87':'#f6b18b');txt('STICK > LEAVES > PAPER',30,164,9,'#c1dac7');
 if(bonusUnlocked()){
 txt('3 NOSE STAMPS: SECRET TRAIL OPEN',29,175,7,'#ffdf8b');
 rect(27,188,96,16,'#885d35','#e1ad68');txt('▶ REPLAY',75,190,9,'#1c3630','center');
 rect(132,188,96,16,'#346657','#d9de93');txt('B  SECRET',180,190,9,'#1c3630','center');
 }else{rect(27,178,201,23,'#885d35','#e1ad68');txt('▶ PLAY AGAIN',128,185,12,'#1c3630','center');}}
function drawBonusClear(t){drawWorld(state.level,t);overlay();woodWindow(15,14,354,188);
 image(portrait,240,55,119,143);txt('SOCK RECOVERED',27,30,19,'#f8e7a2');
 txt('THE SECRET TRAIL',28,59,11,'#d3eac7');pix(28,77,202,2,'#8db39c');
 txt('GOLDEN SOCK   FOUND',28,91,10,'#fff0be');
 txt(`TIME REMAINING   ${state.bonusTime}s`,28,111,9,'#dbebd1');
 txt(`BONUS PAWS       ${state.bonusPaws}`,28,128,9,'#dbebd1');
 txt('SUPREME STINKWEASEL',28,146,10,'#ffcd82');
 rect(27,168,96,26,'#885d35','#e1ad68');txt('NEW WALK',75,175,10,'#1c3630','center');
 rect(130,168,101,26,'#326553','#d2dea0');txt('RETRY SOCK',181,175,10,'#1c3630','center');}

function render(now){g.imageSmoothingEnabled=false;pix(0,0,W,H,'#4da8d6');const t=now/1000;switch(state.mode){case'title':drawTitle(t);break;case'play':drawWorld(state.level,t);drawHud();bottomNote();break;case'pause':drawPause(t);break;case'level':drawLevelClear(t);break;case'rank':drawRank(t);break;case'results':drawResults(t);break;case'bonusclear':drawBonusClear(t);break;case'trials':drawTrials(t);break;case'trialclear':drawTrialClear(t);break;case'gameover':drawGameOver(t);break;}}
let prior=0,accumulator=0;
function mainLoop(now){requestAnimationFrame(mainLoop);pollGamepad();if(!prior){prior=now;render(now);return;}const dt=clamp((now-prior)/1000,0,.1);prior=now;
 if(state.mode==='play'){accumulator=Math.min(.11,accumulator+dt);let steps=0;while(accumulator>=STEP&&steps<6){update(STEP);accumulator-=STEP;steps++;}if(steps===6)accumulator=0;
 if(dt>.039)state.slowFrames++;else state.slowFrames=Math.max(0,state.slowFrames-1);
 if(state.slowFrames>100&&state.quality==='full'){state.quality='low';state.lowAuto=true;$('effectsBtn').textContent='FX: LOW';$('effectsBtn').setAttribute('aria-pressed','true');state.slowFrames=0;}}
 else accumulator=0;
 musicTick();render(now);
}
requestAnimationFrame(mainLoop);
// Inspectable read-only testing surface; gameplay inputs still travel through the public controls.
Object.defineProperty(window,'__dexStatus',{get(){return{mode:state.mode,stage:state.stage,hearts:state.hearts,paws:state.paws,found:[...state.found],rank:[...state.rank],time:state.time,
  player:state.player?{x:state.player.x,y:state.player.y,vx:state.player.vx,vy:state.player.vy,grounded:state.player.onGround}:null,world:state.level?.width??0,checkpoint:state.player?.respawn??0,
  evidence:state.evidence?{id:state.evidence.id,x:state.evidence.x,found:state.evidence.found}:null,bridge:state.bridges.map(b=>({x:b.x,active:b.active})),secret:state.secret?{got:state.secret.got,reveal:state.secret.reveal}:null,stamps:state.stageDiscoveries.length,bonusAvailable:bonusUnlocked()&&state.mode==='results',bonusCompleted:state.bonusCompleted,echoPoints:state.echoTrace?.length||0,echoOn:state.echoOn,music:state.music,trialMode:state.trialMode,bestTimes:state.bestRuns.map(v=>v?.time??null),medals:[...state.trialMedals],visitorTimes:state.visitorRuns.map(v=>v?.time??null),ghostChoice:state.ghostChoice,trialGhostKind:state.trialGhostKind,trialResult:state.trialResult?{...state.trialResult}:null}}});
