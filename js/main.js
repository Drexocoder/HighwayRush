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
musicTrack.playbackRate=0.72;
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
 gtr:{name:'GT-R',tag:'R35',full:'NISSAN GT-R R35',label:'Nissan GT-R R35',brand:'NISSAN',paintName:'CRIMSON RED',blurb:'Precision-built Japanese performance coupe.',speed:'315 km/h',accel:'2.9 sec',power:'565 HP',drive:'AWD',handling:'★★★★☆',paint:0x9f1727,style:'gtr'},
 mustang:{name:'MUSTANG',tag:'GT',full:'FORD MUSTANG GT',label:'Ford Mustang GT',brand:'FORD',paintName:'DEEP RACING BLUE',blurb:'Raw American V8 muscle with rear-wheel drive.',speed:'250 km/h',accel:'4.4 sec',power:'480 HP',drive:'RWD',handling:'★★★☆☆',paint:0x174c94,style:'mustang'}
};let selectedCar='gtr',showroom=null,carMeshes={},garageDetailOpen=false;
async function bootShowroom(){
 const mount=$('carModelViewer');if(!mount||showroom)return;
 try{
  const THREE=await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x111012,12,26);
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(5.5,3.0,7.1);camera.lookAt(0,.58,0);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.domElement.style.cssText='display:block;width:100%;height:100%;outline:none;touch-action:pan-y';mount.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xdde8ff,0x181316,2.2));const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(4,8,5);key.castShadow=true;scene.add(key);const rim=new THREE.DirectionalLight(0xff5269,2.3);rim.position.set(-5,4,-3);scene.add(rim);const fill=new THREE.PointLight(0x8abaff,17,14);fill.position.set(0,3,4);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,96),new THREE.MeshStandardMaterial({color:0x222022,metalness:.62,roughness:.4}));floor.rotation.x=-Math.PI/2;floor.position.y=-.035;floor.receiveShadow=true;scene.add(floor);
  const ringMat=new THREE.MeshBasicMaterial({color:0xff3150,transparent:true,opacity:.6});for(const radius of [3.7,3.22,2.8]){const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.012,8,128),ringMat);ring.rotation.x=Math.PI/2;ring.position.y=.008;scene.add(ring);}
  const platform=new THREE.Mesh(new THREE.CylinderGeometry(2.9,3,.12,96),new THREE.MeshStandardMaterial({color:0x303033,metalness:.7,roughness:.3}));platform.position.y=.02;platform.receiveShadow=true;scene.add(platform);
  const turnGroup=new THREE.Group();turnGroup.position.y=.1;scene.add(turnGroup);
  const mat=(color,metalness=.3,roughness=.3)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
  function box(parent,w,h,d,material,x,y,z){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  // Replace blocky placeholder bodies with a smoother sculpted concept mesh.
  function buildCar(data){
   const root=new THREE.Group(),bodyMat=new THREE.MeshPhysicalMaterial({color:data.paint,metalness:.62,roughness:.22,clearcoat:1,clearcoatRoughness:.12}),glass=new THREE.MeshPhysicalMaterial({color:0x111b23,metalness:.28,roughness:.12,clearcoat:1,transparent:true,opacity:.94}),rubber=new THREE.MeshStandardMaterial({color:0x08090b,roughness:.84}),alloy=new THREE.MeshStandardMaterial({color:0xaeb8bf,metalness:.9,roughness:.22}),dark=new THREE.MeshStandardMaterial({color:0x080a0c,metalness:.3,roughness:.32}),lamp=new THREE.MeshStandardMaterial({color:0xe6f4ff,emissive:0x9fcfff,emissiveIntensity:2}),tail=new THREE.MeshStandardMaterial({color:0xff1b36,emissive:0xff001b,emissiveIntensity:2});
   function custom(points,depth,material){const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)shape.lineTo(points[i][0],points[i][1]);shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:8});geo.translate(0,0,-depth/2);const mesh=new THREE.Mesh(geo,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh;}
   // Longitudinal body profile extruded across the car width: hood, roofline, rear haunches.
   custom([[-2.05,.34],[-1.9,.56],[-1.35,.7],[-.88,.78],[-.53,1.08],[.18,1.13],[.65,.88],[1.45,.72],[1.95,.58],[2.02,.35]],1.7,bodyMat);
   // Sculpted upper cabin, windshield, rear glass, roof and side window silhouettes.
   custom([[-.95,.77],[-.5,1.14],[.25,1.16],[.77,.82]],1.27,glass);
   custom([[-.56,1.12],[-.44,1.17],[.2,1.19],[.32,1.15]],1.2,bodyMat);
   for(const side of [-1,1]){
    custom([[-.86,.79],[-.45,1.09],[-.04,1.09],[-.04,.86]],.025,glass).position.x=side*.66;
    custom([[.04,.86],[.04,1.09],[.22,1.09],[.65,.81]],.025,glass).position.x=side*.66;
    const skirt=new THREE.Mesh(new THREE.BoxGeometry(1.28,.075,.12),dark);skirt.position.set(side*.83,.37,0);root.add(skirt);
    const mirror=new THREE.Mesh(new THREE.SphereGeometry(.095,12,8),bodyMat);mirror.scale.set(1,.55,1.4);mirror.position.set(side*.92,.78,.42);root.add(mirror);
   }
   // Front splitter, grille, rear diffuser, hood vents and badge.
   const part=(w,h,d,material,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;root.add(m);return m;};
   part(1.8,.065,.24,dark,0,.31,1.94);part(1.25,.15,.055,dark,0,.43,1.91);part(1.95,.07,.24,dark,0,.29,-1.91);
   for(const x of [-.38,-.25,-.12,.12,.25,.38])part(.035,.018,.28,dark,x,.72,1.25);
   part(.32,.035,.03,alloy,0,.57,1.97);
   for(const side of [-1,1]){
    const head=new THREE.Mesh(new THREE.ShapeGeometry((()=>{const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(.34,.035);s.lineTo(.25,.105);s.lineTo(.03,.09);s.closePath();return s;})()),lamp);head.position.set(side*.48,.58,1.88);head.rotation.y=side*.12;root.add(head);
    part(.32,.07,.035,tail,side*.55,.58,-1.88);
    const fog=part(.11,.04,.025,lamp,side*.72,.42,1.94);
   }
   // Wheel arches, tires, rotors and five-spoke alloys.
   for(const x of [-.88,.88])for(const z of [-1.22,1.28]){
    const arch=new THREE.Mesh(new THREE.TorusGeometry(.39,.055,8,36,Math.PI),dark);arch.rotation.z=Math.PI;arch.position.set(x,.39,z);root.add(arch);
    const wheel=new THREE.Group();wheel.position.set(x,.39,z);wheel.rotation.z=Math.PI/2;root.add(wheel);
    wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.2,40),rubber));
    wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.215,40),alloy));
    wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.22,32),dark));
    wheel.add(new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.23,24),alloy));
    for(let i=0;i<5;i++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(.045,.29,.025),alloy);spoke.position.set(Math.cos(i*Math.PI*2/5)*.105,Math.sin(i*Math.PI*2/5)*.105,0);spoke.rotation.z=i*Math.PI*2/5;wheel.add(spoke);}
    const rotor=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.02,32),matRotor());rotor.position.z=.105;wheel.add(rotor);
   }
   function matRotor(){return new THREE.MeshStandardMaterial({color:0x596168,metalness:.85,roughness:.3});}
   if(data.style==='mustang'){for(const x of [-.32,.32])part(.085,.018,.82,alloy,x,.747,1.03);part(1.6,.09,.1,bodyMat,0,1.08,-.8);for(const x of [-.68,-.45,-.22,.22,.45,.68])part(.1,.045,.035,tail,x,.59,-1.92);}
   else{part(1.48,.07,.1,dark,0,1.14,-1.65);for(const x of [-.61,.61]){const r=new THREE.Mesh(new THREE.TorusGeometry(.085,.024,8,28),tail);r.position.set(x,.58,-1.94);root.add(r);}}
   // Interior glimpse through glass: dashboard, seats, steering wheel and center console.
   const cabinDark=new THREE.MeshStandardMaterial({color:0x151719,roughness:.75});
   part(.98,.09,.48,cabinDark,0,.86,-.08);
   for(const x of [-.34,.34]){const seat=new THREE.Mesh(new THREE.BoxGeometry(.28,.24,.3),cabinDark);seat.position.set(x,.88,-.38);seat.rotation.x=-.12;root.add(seat);const back=new THREE.Mesh(new THREE.BoxGeometry(.26,.31,.09),cabinDark);back.position.set(x,1.02,-.52);back.rotation.x=-.12;root.add(back);}
   const steering=new THREE.Mesh(new THREE.TorusGeometry(.09,.014,8,24),alloy);steering.position.set(-.35,.91,.25);steering.rotation.y=.3;root.add(steering);
   root.scale.setScalar(.95);root.userData.wheels=root.children.filter(o=>o.type==='Group');return root;
  }
  carMeshes.gtr=buildCar(carData.gtr);carMeshes.mustang=buildCar(carData.mustang);Object.entries(carMeshes).forEach(([key,car])=>{car.visible=key===selectedCar;turnGroup.add(car);});
  const galleryShots=['FRONT THREE-QUARTER','SIDE PROFILE','REAR DETAIL','COCKPIT'];let galleryIndex=0;
  const resize=()=>{const r=mount.getBoundingClientRect();if(!r.width||!r.height)return;camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);};new ResizeObserver(resize).observe(mount);resize();
  let last=0;const render=t=>{const dt=Math.min((t-last)/1000||0,.04);last=t;turnGroup.rotation.y+=dt*($('carStage')?.classList.contains('galleryMode')?.08:.24);const car=carMeshes[selectedCar];if(car){car.position.y=.035+Math.sin(t*.0013)*.012;for(const wheel of car.userData.wheels||[])wheel.rotation.x+=dt*.3;}renderer.render(scene,camera);requestAnimationFrame(render);};requestAnimationFrame(render);showroom={scene,camera,renderer,turnGroup};
 }catch(e){mount.innerHTML='<div class="modelFallback"><b>SHOWROOM UNAVAILABLE</b><span>Refresh to reload the 3D renderer.</span></div>';console.error(e);}
}
function setCar(key){selectedCar=key;const d=carData[key];document.querySelectorAll('[data-car]').forEach(b=>b.classList.toggle('active',b.dataset.car===key));$('stageLabel').textContent=d.full;$('detailBrand').textContent=d.brand;$('specName').innerHTML=d.name+' <span>'+d.tag+'</span>';$('specBlurb').textContent=d.blurb;$('specSpeed').textContent=d.speed;$('specAccel').textContent=d.accel;$('specPower').textContent=d.power;$('specDrive').textContent=d.drive;$('specHandling').textContent=d.handling;$('paintName').textContent=d.paintName;$('popupCarName').textContent=d.full;$('popupSpeed').textContent=d.speed;$('popupAccel').textContent=d.accel;$('popupPower').textContent=d.power;$('popupDrive').textContent=d.drive;const dot=document.querySelector('.paintDot');if(dot)dot.style.background='#'+d.paint.toString(16).padStart(6,'0');Object.entries(carMeshes).forEach(([k,car])=>car.visible=k===key);document.querySelectorAll('.collectionCard').forEach(c=>c.classList.toggle('active',c.dataset.car===key));$('detailVehicleIndex').textContent=(key==='gtr'?'01':'02')+' / 02';$('selectCar').innerHTML='<i data-lucide="check-circle-2"></i> SELECT THIS CAR';if(window.lucide)lucide.createIcons();}
function openCarDetail(key){setCar(key);garageDetailOpen=true;$('carCollection').hidden=true;$('garageDetail').hidden=false;$('garageHeading').innerHTML='VEHICLE <span>OVERVIEW.</span>';bootShowroom();$('specPopup').classList.remove('show');if(window.lucide)lucide.createIcons();}
function showCollection(){$('garageDetail').hidden=true;$('carCollection').hidden=false;$('garageHeading').innerHTML='CHOOSE YOUR <span>RIDE.</span>';garageDetailOpen=false;}
function openGarage(){playUi('open');$('garageShade').classList.add('open');$('garageShade').setAttribute('aria-hidden','false');page='garage';showCollection();setCar(selectedCar);if(window.lucide)lucide.createIcons();}
function closeGarage(){playUi('close');$('garageShade').classList.remove('open');$('garageShade').setAttribute('aria-hidden','true');page='menu';}
$('garageClose').addEventListener('click',closeGarage);document.querySelectorAll('.collectionCard').forEach(b=>b.addEventListener('click',()=>{playUi('select');openCarDetail(b.dataset.car);}));$('backToCollection').addEventListener('click',()=>{playUi('close');showCollection();});
$('selectCar').addEventListener('click',()=>{playUi('select');$('garageToast').textContent=carData[selectedCar].label+' selected';setTimeout(()=>{$('garageToast').textContent='';},2200);});$('galleryBtn').addEventListener('click',()=>{playUi('select');$('garageToast').textContent='GALLERY MODE';$('carStage').classList.toggle('galleryMode');$('stageHint').textContent=$('carStage').classList.contains('galleryMode')?'GALLERY · DRAG TO ORBIT':'AUTO ROTATION · DRAG TO ORBIT';});$('carSettingsBtn').addEventListener('click',()=>{playUi('click');$('garageToast').textContent='PAINT / WHEELS / CAMERA SETTINGS COMING NEXT';});$('testDriveBtn').addEventListener('click',()=>{playUi('click');$('garageToast').textContent='TEST DRIVE IS NEXT ON THE ROADMAP';});
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