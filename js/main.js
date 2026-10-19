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
 gtr:{name:'GT-R',tag:'R35',full:'NISSAN GT-R R35',label:'Nissan GT-R R35',blurb:'Japanese performance coupe · custom real-time 3D showroom.',speed:'315 km/h',accel:'2.9 sec',power:'565 HP',drive:'AWD',handling:'★★★★☆',paint:0x8d101b,style:'gtr'},
 mustang:{name:'MUSTANG',tag:'GT',full:'FORD MUSTANG GT / 2024',label:'Ford Mustang GT',blurb:'American V8 muscle · custom real-time 3D showroom.',speed:'250 km/h',accel:'4.4 sec',power:'480 HP',drive:'RWD',handling:'★★★☆☆',paint:0x163e83,style:'mustang'}
};let selectedCar='gtr',showroom=null,carMeshes={};
async function bootShowroom(){
 const mount=$('carModelViewer');if(!mount||showroom)return;
 try{
  const THREE=await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  const scene=new THREE.Scene();scene.background=null;scene.fog=new THREE.Fog(0x101416,10,24);
  const camera=new THREE.PerspectiveCamera(33,1,.1,100);camera.position.set(5.8,3.1,7.6);camera.lookAt(0,.65,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText='display:block;width:100%;height:100%;outline:none;';mount.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xcfe4ff,0x151719,2.1));
  const key=new THREE.DirectionalLight(0xffffff,3.4);key.position.set(4,8,5);key.castShadow=true;scene.add(key);
  const rim=new THREE.DirectionalLight(0xd7ff4f,2.5);rim.position.set(-5,4,-3);scene.add(rim);
  const fillLight=new THREE.PointLight(0x7fa7ff,22,12);fillLight.position.set(0,3,4);scene.add(fillLight);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,96),new THREE.MeshStandardMaterial({color:0x171d1e,metalness:.68,roughness:.38}));floor.rotation.x=-Math.PI/2;floor.position.y=-.035;floor.receiveShadow=true;scene.add(floor);
  const ringMat=new THREE.MeshBasicMaterial({color:0xd7ff4f,transparent:true,opacity:.68});
  for(const [radius,tube] of [[3.75,.018],[3.25,.009],[2.8,.006]]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,128),ringMat);ring.rotation.x=Math.PI/2;ring.position.y=.005+(3.8-radius)*.002;scene.add(ring);}
  const platform=new THREE.Mesh(new THREE.CylinderGeometry(2.95,3.02,.12,96),new THREE.MeshStandardMaterial({color:0x242b2d,metalness:.72,roughness:.32}));platform.position.y=.02;platform.receiveShadow=true;platform.castShadow=true;scene.add(platform);
  const turnGroup=new THREE.Group();turnGroup.position.y=.1;scene.add(turnGroup);
  function mat(color,metalness=.2,roughness=.34){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
  function box(parent,w,h,d,material,x,y,z,bevel=0){let geo;if(bevel){geo=new THREE.BoxGeometry(w,h,d,2,1,2);}else geo=new THREE.BoxGeometry(w,h,d);const mesh=new THREE.Mesh(geo,material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function createCar(data){
   const root=new THREE.Group();const bodyMat=mat(data.paint,.58,.24),dark=mat(0x101417,.35,.3),glass= new THREE.MeshPhysicalMaterial({color:0x14212b,metalness:.35,roughness:.13,clearcoat:1,clearcoatRoughness:.08}),rubber=mat(0x090a0b,0,.78),rimMat=mat(0xaeb8bc,.85,.22),lamp=new THREE.MeshStandardMaterial({color:0xe9f6ff,emissive:0xbadfff,emissiveIntensity:2.2}),redLamp=new THREE.MeshStandardMaterial({color:0xff152b,emissive:0xff001b,emissiveIntensity:1.6});
   // Low, wide body shell and sculpted front/rear sections.
   box(root,1.9,.34,4.05,bodyMat,0,.53,0);
   box(root,1.84,.22,1.05,bodyMat,0,.47,1.48);
   box(root,1.82,.2,.86,bodyMat,0,.47,-1.56);
   // Cabin, windshield and rear glass are separate angled-looking forms.
   const cabin=box(root,1.48,.48,1.72,glass,0,.91,-.12);cabin.rotation.x=-.035;
   box(root,1.55,.12,1.77,bodyMat,0,.72,-.12);
   box(root,1.45,.06,.92,dark,0,1.17,-.2);
   // Hood vents, front splitter, grille and rear diffuser.
   box(root,1.45,.045,.5,bodyMat,0,.72,1.12);
   box(root,.78,.14,.07,dark,0,.47,2.04);
   box(root,1.98,.07,.22,dark,0,.31,2.03);
   box(root,1.9,.1,.24,dark,0,.31,-2.02);
   for(let i=0;i<3;i++)box(root,.035,.025,.3,dark,-.28+i*.28,.75,1.1);
   // Headlamps and signature tail lamps.
   for(const side of [-1,1]){const h=box(root,.34,.085,.16,lamp,side*.68,.61,1.88);h.rotation.y=side*.08;box(root,.45,.075,.1,redLamp,side*.57,.61,-1.91);box(root,.055,.035,.36,bodyMat,side*.94,.48,0);}
   // Wheels with sidewalls, machined rims, hubs and five spokes.
   const wheels=[];
   for(const x of [-.99,.99])for(const z of [-1.28,1.32]){
    const wheel=new THREE.Group();wheel.position.set(x,.39,z);wheel.rotation.z=Math.PI/2;root.add(wheel);
    const tire=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.22,32),rubber);tire.castShadow=true;wheel.add(tire);
    const rim=new THREE.Mesh(new THREE.CylinderGeometry(.255,.255,.235,32),rimMat);wheel.add(rim);
    const hub=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.245,20),dark);wheel.add(hub);
    for(let s=0;s<5;s++){const spoke=box(wheel,.035,.035,.34,rimMat,0,0,0);spoke.rotation.z=s*Math.PI*2/5;spoke.position.set(Math.cos(spoke.rotation.z)*.12,Math.sin(spoke.rotation.z)*.12,0);}
    wheels.push(wheel);
   }
   if(data.style==='mustang'){
    // Long-hood muscle-car cues, twin hood stripes and tall rear haunches.
    for(const x of [-.34,.34])box(root,.09,.018,1.12,mat(0xe7e9e9,.15,.35),x,.744,1.05);
    box(root,1.45,.12,.08,dark,0,.49,2.09);
    for(const x of [-.65,-.22,.22,.65])box(root,.2,.045,.09,redLamp,x,.61,-1.98);
    box(root,1.68,.07,.12,bodyMat,0,1.17,-.8);
   }else{
    // GT-R signature wide rear wing and circular rear lamps.
    box(root,1.55,.09,.12,dark,0,1.16,-1.73);
    box(root,.08,.26,.1,bodyMat,-.64,1.02,-1.73);box(root,.08,.26,.1,bodyMat,.64,1.02,-1.73);
    for(const x of [-.65,.65]){const ring=new THREE.Mesh(new THREE.TorusGeometry(.09,.025,8,24),redLamp);ring.position.set(x,.64,-2.02);root.add(ring);}
   }
   root.scale.setScalar(1.0);root.userData.wheels=wheels;return root;
  }
  carMeshes.gtr=createCar(carData.gtr);carMeshes.mustang=createCar(carData.mustang);
  Object.entries(carMeshes).forEach(([key,car])=>{car.visible=key===selectedCar;turnGroup.add(car);});
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.65,48),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.55}));shadow.rotation.x=-Math.PI/2;shadow.scale.set(1.05,.58,1);shadow.position.y=.012;turnGroup.add(shadow);
  const resize=()=>{const r=mount.getBoundingClientRect();if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);};new ResizeObserver(resize).observe(mount);resize();
  let last=0;const render=(t)=>{const dt=Math.min((t-last)/1000||0,.04);last=t;turnGroup.rotation.y+=dt*.32;const car=carMeshes[selectedCar];if(car){car.position.y=.04+Math.sin(t*.0013)*.012;car.rotation.y=0;}renderer.render(scene,camera);requestAnimationFrame(render);};requestAnimationFrame(render);
  showroom={THREE,scene,camera,renderer,turnGroup};
 }catch(err){mount.innerHTML='<div class="modelFallback"><div class="fallbackCar">HR</div><b>SHOWROOM MODEL</b><span>3D renderer could not load. Check your connection and refresh.</span></div>';console.error('Showroom renderer failed',err);}
}
function setCar(key){selectedCar=key;const d=carData[key];document.querySelectorAll('.carChoice').forEach(b=>b.classList.toggle('active',b.dataset.car===key));$('stageLabel').textContent=d.full;$('specName').innerHTML=d.name+' <span>'+d.tag+'</span>';$('specBlurb').textContent=d.blurb;$('specSpeed').textContent=d.speed;$('specAccel').textContent=d.accel;$('specPower').textContent=d.power;$('specDrive').textContent=d.drive;$('specHandling').textContent=d.handling;$('popupCarName').textContent=d.full;$('popupSpeed').textContent=d.speed;$('popupAccel').textContent=d.accel;$('popupPower').textContent=d.power;$('popupDrive').textContent=d.drive;Object.entries(carMeshes).forEach(([k,car])=>car.visible=k===key);$('selectCar').innerHTML='<i data-lucide="check-circle-2"></i> SELECT THIS CAR';if(window.lucide)lucide.createIcons();}
function openGarage(){playUi('open');$('garageShade').classList.add('open');$('garageShade').setAttribute('aria-hidden','false');page='garage';bootShowroom();setCar(selectedCar);$('specPopup').classList.remove('show');if(window.lucide)lucide.createIcons();}
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