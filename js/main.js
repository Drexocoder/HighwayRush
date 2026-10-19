(()=>{'use strict';
const $=id=>document.getElementById(id);const introView=$('introView'),menuView=$('menuView'),introScene=$('introScene'),menuScene=$('menuScene');let page='intro',soundOn=false,audio=null,finished=false,loadTimer=null;
if(window.lucide)lucide.createIcons();
const status=$('loadStatus'),percent=$('loadPercent'),fill=$('loadFill');
const stages=[[0,'INITIALIZING EXPERIENCE'],[16,'BUILDING THE NIGHT DRIVE'],[34,'PREPARING VEHICLE SYSTEMS'],[52,'CALIBRATING THE GARAGE'],[72,'TUNING THE LIGHTING'],[90,'FINAL CHECKS'],[100,'READY WHEN YOU ARE']];
function setLoad(v){const n=Math.max(0,Math.min(100,Math.floor(v)));percent.textContent=String(n).padStart(2,'0')+'%';fill.style.width=n+'%';let s=stages[0][1];for(const st of stages)if(n>=st[0])s=st[1];status.textContent=s;}
function showMenu(){if(finished)return;finished=true;clearInterval(loadTimer);setLoad(100);introView.classList.remove('active');menuView.classList.add('active');introScene.classList.remove('ready');menuScene.classList.add('ready');page='menu';document.querySelector('.statusText').textContent='SYSTEM READY';setTimeout(()=>{introScene.style.display='none';},1200);}
function startLoading(){const started=performance.now(),duration=6200;setLoad(0);$('loadHint').textContent='INITIALIZING / 2 VEHICLES';loadTimer=setInterval(()=>{const elapsed=performance.now()-started;setLoad(Math.min(96,(elapsed/duration)*96));$('loadHint').textContent=elapsed<1800?'PREPARING VEHICLE DATA':elapsed<3600?'INITIALIZING GRAPHICS':elapsed<5000?'SETTING UP THE GARAGE':'FINALIZING EXPERIENCE';if(elapsed>=duration){clearInterval(loadTimer);setLoad(100);$('loadHint').textContent='SYSTEMS READY';setTimeout(showMenu,700);}},80);setTimeout(()=>{if(!finished&&page==='intro'){clearInterval(loadTimer);setLoad(100);showMenu();}},9500);}

const copy={drive:['FIRST DRIVE','The highway is still being built.','This build is the cinematic intro and main menu only. The playable driving scene, traffic, steering, speed effects and scoring are the next development phase.'],garage:['THE GARAGE','Opening vehicle showroom.','Choose a car in the interactive showroom.'],settings:['SETTINGS','Your setup, your style.','This preview adapts to your screen size and includes an optional sound toggle. Graphics, controls and gameplay settings will arrive with the driving build.'],about:['THE PROJECT','Built for the open road.','HIGHWAY RUSH is a mobile-first browser car driving game concept. This version focuses on a cinematic intro, responsive main menu and visual effects.']};
function openModal(k){if(k==='garage'){openGarage();return;}playUi('open');const c=copy[k]||copy.about;$('modalLabel').textContent=c[0];$('modalTitle').textContent=c[1];$('modalText').textContent=c[2];$('modalShade').classList.add('open');page='modal';}
function closeModal(){playUi('close');$('modalShade').classList.remove('open');page='menu';}
document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));
$('closeModal').addEventListener('click',closeModal);$('modalOk').addEventListener('click',closeModal);$('modalShade').addEventListener('click',e=>{if(e.target===$('modalShade'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('garageShade').classList.contains('open'))closeGarage();else if(page==='modal')closeModal();}});
function playClick(){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(440,audio.currentTime);o.frequency.exponentialRampToValueAtTime(660,audio.currentTime+.07);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.13);}catch(e){}}

const musicTrack=new Audio('./assets/audio/phonk.mp3');
musicTrack.loop=true;
musicTrack.preload='auto';
musicTrack.volume=0.32;
musicTrack.playbackRate=0.88;
let musicPending=true;
async function startMusic(){
 try{
  musicTrack.volume=0.32;
  musicTrack.playbackRate=0.88;
  await musicTrack.play();
  musicPending=false;soundOn=true;
  $('soundBtn').innerHTML='<i data-lucide="volume-2"></i>';
  if(window.lucide)lucide.createIcons();
 }catch(e){
  musicPending=true;
  // Browsers block unmuted autoplay until a user gesture. Retry on the first real interaction.
 }
}
function stopMusic(){musicTrack.pause();soundOn=false;}
function unlockMusic(){
 if(musicPending&&!musicTrack.paused) return;
 if(musicPending){startMusic();}
}

function playUi(kind){
 if(!soundOn)return;
 try{
  audio=audio||new(window.AudioContext||window.webkitAudioContext)();
  if(audio.state==='suspended')audio.resume();
  const now=audio.currentTime;
  const presets={click:[440,680,.09,'triangle'],select:[620,980,.17,'sine'],open:[260,740,.2,'sawtooth'],close:[620,300,.12,'triangle'],rev:[90,210,.55,'sawtooth']};
  const p=presets[kind]||presets.click,o=audio.createOscillator(),g=audio.createGain();
  o.type=p[3];o.frequency.setValueAtTime(p[0],now);o.frequency.exponentialRampToValueAtTime(p[1],now+p[2]);
  g.gain.setValueAtTime(kind==='rev'?.055:.035,now);g.gain.exponentialRampToValueAtTime(.001,now+p[2]);
  o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+p[2]+.02);
  if(kind==='open'||kind==='rev'){const o2=audio.createOscillator(),g2=audio.createGain();o2.type='sine';o2.frequency.setValueAtTime(kind==='rev'?65:120,now);o2.frequency.exponentialRampToValueAtTime(kind==='rev'?42:45,now+p[2]);g2.gain.setValueAtTime(.025,now);g2.gain.exponentialRampToValueAtTime(.001,now+p[2]);o2.connect(g2);g2.connect(audio.destination);o2.start(now);o2.stop(now+p[2]+.02);}
 }catch(e){}
}
$('soundBtn').addEventListener('click',async()=>{if(!soundOn){await startMusic();}else{stopMusic();}$('soundBtn').innerHTML=soundOn?'<i data-lucide="volume-2"></i>':'<i data-lucide="music-2"></i>';if(window.lucide)lucide.createIcons();});
window.addEventListener('pointerdown',unlockMusic);window.addEventListener('keydown',unlockMusic);window.addEventListener('touchstart',unlockMusic,{passive:true});
document.querySelectorAll('button').forEach(b=>{if(b.id!=='soundBtn')b.addEventListener('click',()=>playUi('click'));});


const carData={
 gtr:{name:'GT-R',tag:'R35',full:'NISSAN GT-R R35',label:'Nissan GT-R R35',blurb:'Japanese performance coupe · interactive 3D model.',speed:'315 km/h',accel:'2.9 sec',power:'565 HP',drive:'AWD',handling:'★★★★☆',model:'51c912a8310c4e00a82ad7673d84228a'},
 mustang:{name:'MUSTANG',tag:'GT',full:'FORD MUSTANG GT / 2024',label:'Ford Mustang GT',blurb:'American V8 muscle · interactive 3D model.',speed:'250 km/h',accel:'4.4 sec',power:'480 HP',drive:'RWD',handling:'★★★☆☆',model:'1592c80ca5cc4027a2a72a6fad784e1b'}
};let selectedCar='gtr';
function setCar(key){selectedCar=key;const d=carData[key];document.querySelectorAll('.carChoice').forEach(b=>b.classList.toggle('active',b.dataset.car===key));$('stageLabel').textContent=d.full;$('specName').innerHTML=d.name+' <span>'+d.tag+'</span>';$('specBlurb').textContent=d.blurb;$('specSpeed').textContent=d.speed;$('specAccel').textContent=d.accel;$('specPower').textContent=d.power;$('specDrive').textContent=d.drive;$('specHandling').textContent=d.handling;$('popupCarName').textContent=d.full;$('popupSpeed').textContent=d.speed;$('popupAccel').textContent=d.accel;$('popupPower').textContent=d.power;$('popupDrive').textContent=d.drive;$('carModelViewer').src='https://sketchfab.com/models/'+d.model+'/embed?autostart=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_inspector=0';$('selectCar').innerHTML='<i data-lucide="check-circle-2"></i> SELECT THIS CAR';if(window.lucide)lucide.createIcons();}
function openGarage(){playUi('open');$('garageShade').classList.add('open');$('garageShade').setAttribute('aria-hidden','false');page='garage';setCar(selectedCar);$('specPopup').classList.remove('show');if(window.lucide)lucide.createIcons();}
function closeGarage(){playUi('close');$('garageShade').classList.remove('open');$('garageShade').setAttribute('aria-hidden','true');page='menu';}
$('garageClose').addEventListener('click',closeGarage);document.querySelectorAll('.carChoice').forEach(b=>b.addEventListener('click',()=>{setCar(b.dataset.car);playUi('rev');}));
$('selectCar').addEventListener('click',()=>{playUi('select');$('garageToast').textContent=carData[selectedCar].label+' selected';setTimeout(()=>{$('garageToast').textContent='';},2200);});
$('detailsToggle').addEventListener('click',()=>{$('specPopup').classList.toggle('show');});
$('specPopupClose').addEventListener('click',()=>{$('specPopup').classList.remove('show');});

async function tryLandscape(){
 try{
  if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});
  if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');
 }catch(e){}
 $('portraitHint').style.display='none';
}
let fullscreenAttempted=false;
function mobileFullscreenOnGesture(){
 if(fullscreenAttempted||!matchMedia('(max-width: 760px)').matches)return;
 fullscreenAttempted=true;
 // Browsers require a user gesture for fullscreen; attempt once on the first tap.
 tryLandscape();
}
window.addEventListener('pointerdown',mobileFullscreenOnGesture,{once:true});
$('rotateBtn').addEventListener('click',tryLandscape);
function portraitCheck(){const mobile=matchMedia('(max-width:760px)').matches;const portrait=innerHeight>innerWidth;if(mobile&&portrait){$('portraitHint').style.display='flex';}else{$('portraitHint').style.display='none';}}
$('introVideo').addEventListener('error',()=>{$('introVideo').style.display='none';});$('introVideo').play().catch(()=>{});
window.addEventListener('resize',portraitCheck);window.addEventListener('orientationchange',()=>setTimeout(portraitCheck,200));portraitCheck();
const canvas=$('fx'),ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,particles=[],last=0;
function resize(){dpr=Math.min(window.devicePixelRatio||1,1.7);w=innerWidth;h=innerHeight;canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(95,Math.floor(w*h/14000))},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*.8+.2,r:Math.random()*1.5+.25,v:Math.random()*18+6,a:Math.random()*.55+.08}));}
function draw(t){const dt=Math.min((t-last)/1000||0,.04);last=t;ctx.clearRect(0,0,w,h);let cx=w*.55,cy=h*.52;for(const p of particles){p.x-=p.v*dt*(page==='intro'?1.7:0.7);p.y+=Math.sin(t*.0004+p.x*.008)*dt*5;if(p.x<-5){p.x=w+5;p.y=Math.random()*h;}ctx.globalAlpha=p.a;ctx.fillStyle='#d7ffb0';ctx.beginPath();ctx.arc(p.x,p.y,p.r*p.z,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
// cinematic moving speed streaks
if(page==='intro'){for(let i=0;i<10;i++){let y=((i*83+t*.07)%h);let x=((i*173+t*.22)%w);let len=25+(i%4)*24;ctx.globalAlpha=.08+(i%3)*.025;ctx.strokeStyle='#d7ff4f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len,y+len*.13);ctx.stroke();}}
// subtle focus flare
let g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.52);g.addColorStop(0,'rgba(215,255,79,.035)');g.addColorStop(1,'rgba(215,255,79,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;requestAnimationFrame(draw);}
window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);startLoading();startMusic();window.__highwayRushBooted=true;
})();