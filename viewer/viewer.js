/* Anatomy 3D ভিউয়ার: সব হাড়ের জন্য একই কোড।
   পেজে যা আগে লোড হতে হবে: window.DATA (data/core.js) আর window.BONE (content.js)।
   ভারী লেয়ার (data/layers.js) পেজ দেখানোর পরে আলাদা লোড হয়।
   এখানে কিছু বদলালে সব হাড়ের পেজে একসাথে বদলাবে। */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const B=window.BONE, D=window.DATA;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const V3=a=>new THREE.Vector3(...a);
B.render?.(D,$);

/* ---------- দৃশ্য ---------- */
const view=$('#view'),pinsEl=$('#pins'),info=$('#info'),legend=$('#legend');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));view.prepend(renderer.domElement);
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(32,1,1,4000);scene.add(cam);
scene.add(new THREE.HemisphereLight(0xfff8ee,0x30403c,1.1));
const keyL=new THREE.DirectionalLight(0xffffff,1.6);keyL.position.set(120,180,300);cam.add(keyL);
const rim=new THREE.DirectionalLight(0x9fd8cc,.6);rim.position.set(-200,-80,-200);scene.add(rim);
const ctl=new OrbitControls(cam,renderer.domElement);ctl.enableDamping=true;ctl.dampingFactor=.12;ctl.minDistance=90;ctl.maxDistance=1300;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

function dec(s,T){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)}
const S=D.scale,bone=[],byLayer={rib:[],clav:[],muscle:[],artery:[],vein:[],nerve:[],lymph:[],organ:[],vert:[]},pickable=[];
const BONE_C=new THREE.Color('#ece4d4');
const STYLE={rib:['#e9e1cf',.45],cart:['#9fd6cf',.7],clav:['#e9e1cf',.8],muscle:[null,.38],artery:['#e0443e',1],vein:['#4a78e0',1],heart:['#c9706a',.45],lung:['#f0b8b2',.16],thymus:['#e7a8c9',.75],trachea:['#cfd6dc',.7],vert:['#d9d0bd',.95],disc:['#9fd6cf',.9]};
const G2L={rib:'rib',cart:'rib',clav:'clav',muscle:'muscle',artery:'artery',vein:'vein',heart:'organ',lung:'organ',thymus:'organ',trachea:'organ',vert:'vert',disc:'vert'};
function geo(m){
 const q=dec(m.v,Int16Array),p=new Float32Array(q.length);for(let i=0;i<q.length;i++)p[i]=q[i]*S;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 g.setIndex(new THREE.BufferAttribute(dec(m.f,Uint16Array),1));g.computeVertexNormals();g.computeBoundingSphere();return g;
}
function addMesh(g,group,key,name,layer){
 const st=STYLE[group]||['#ccc',1];let col=st[0];
 if(group==='muscle')col=B.REG[B.MUS_REG[key]].c;
 const op=st[1],mat=new THREE.MeshStandardMaterial({color:col,roughness:group==='artery'||group==='vein'?.45:.75,transparent:op<1,opacity:op,depthWrite:op>=.6});
 const mesh=new THREE.Mesh(g,mat);mesh.name=name;mesh.userData={group,key,op};mesh.visible=false;
 if(group==='lung')mesh.renderOrder=2;
 scene.add(mesh);byLayer[layer||G2L[group]].push(mesh);if(group!=='rib'&&group!=='cart')pickable.push(mesh);return mesh;
}
for(const m of D.meshes){
 const g=geo(m);
 if(m.group==='bone'){
  g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*3),3));g.userData.r=m.r?dec(m.r,Uint8Array):new Uint8Array(g.attributes.position.count);
  const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.78,metalness:0}));mesh.name=m.name;mesh.userData={group:'bone'};scene.add(mesh);bone.push(mesh);
 } else addMesh(g,m.group,m.key||m.name,m.name,m.layer);
}
$('#load')?.remove();

/* ---------- অবস্থা ---------- */
let mode='lm',sel=null,layersReady=false,dirty=true,occDirty=true,lastMove=0;
const layerOn=Object.fromEntries(Object.keys(byLayer).map(k=>[k,false]));
const boxes=[...document.querySelectorAll('[data-layer]')];
function applyLayers(){
 for(const k in byLayer)for(const m of byLayer[k])m.visible=layerOn[k];
 levelGroup.visible=layerOn.vert&&mode==='level';
 boxes.forEach(b=>b.checked=layerOn[b.dataset.layer]);dirty=occDirty=true;
}
boxes.forEach(b=>b.addEventListener('change',()=>{layerOn[b.dataset.layer]=b.checked;applyLayers();if(b.checked&&!layersReady&&!['rib','clav'].includes(b.dataset.layer))note('লেয়ার লোড হচ্ছে…')}));
function note(t){if(!info.querySelector('.ld'))info.insertAdjacentHTML('beforeend',`<p class="ld" style="margin:8px 0 0;color:#7a4a35">${esc(t)}</p>`)}

function paint(){
 const focus=sel&&sel.reg;
 for(const s of bone){
  const g=s.geometry,c=g.attributes.color,r=g.userData.r,pc=new THREE.Color(B.PARTS[s.name]?.c||'#ece4d4'),tmp=new THREE.Color();
  for(let i=0;i<r.length;i++){
   let col=BONE_C;
   if(mode==='parts')col=pc;
   else if(mode==='att'&&r[i]&&B.REG[r[i]]){col=tmp.set(B.REG[r[i]].c);if(focus&&r[i]!==focus)col.lerp(BONE_C,.78)}
   else if((mode==='lm'||mode==='rel')&&r[i]===8)col=tmp.set(B.REG[8].c);
   c.setXYZ(i,col.r,col.g,col.b);
  }
  c.needsUpdate=true;
 }
 dirty=true;
}
function highlight(key){
 for(const m of pickable){
  const on=key&&(m.userData.key===key||m.name===key);
  m.material.emissive.set(on?0x552211:0x000000);
  if(m.userData.group==='muscle')m.material.opacity=key?(on?.9:.18):m.userData.op;
 }
 dirty=true;
}

/* ---------- পিন ---------- */
const pins=[];
function makePin(o){
 const el=document.createElement('button');el.type='button';el.className='pin '+(o.cls||'');el.textContent=o.lab;el.setAttribute('aria-label',o.inf.t);
 el.addEventListener('click',e=>{e.stopPropagation();if(mode==='quiz')return;o.onclick?o.onclick():selectLm(o)});
 pinsEl.appendChild(el);o.el=el;o.vis=true;pins.push(o);return o;
}
const lms=D.lm.map(o=>{
 const x=B.lmInfo(o.id);
 return makePin({id:o.id,p:V3(o.p),n:V3(o.n).normalize(),inf:x.inf,lab:x.lab,kind:x.kind,quiz:x.quiz,quizName:x.quizName,cls:x.kind==='num'?'num':x.kind==='surf'?'surf':'',show:'lm',occ:true});
});
function card(k,o){
 info.innerHTML=`<div class="k">${esc(k)}</div><h3>${esc(o.t)}</h3><div class="sub">${esc(o.b)}</div><p style="margin:0 0 6px">${esc(o.d)}</p>${o.l?'<ul>'+o.l.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}`;
}
function selectLm(L){sel={lm:L};pins.forEach(x=>x.el.classList.toggle('on',x===L));card('ল্যান্ডমার্ক',L.inf);fly(L.n,320,L.p,true)}

/* ---------- লেভেল তল ---------- */
const levelGroup=new THREE.Group();levelGroup.visible=false;scene.add(levelGroup);
if(B.levels&&D.levels){
 const lp=B.levelPlane||{w:150,d:190,z:-75},z0=lp.z+lp.d/2,z1=lp.z-lp.d/2,hw=lp.w/2;
 for(const [k,lab,inf] of B.levels){
  const y=D.levels[k];
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(lp.w,lp.d),new THREE.MeshBasicMaterial({color:0xe8603c,transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false}));
  pl.rotation.x=-Math.PI/2;pl.position.set(0,y,lp.z);levelGroup.add(pl);
  levelGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([[-hw,z0],[-hw,z1],[hw,z1],[hw,z0],[-hw,z0]].map(([x,z])=>new THREE.Vector3(x,y,z))),new THREE.LineBasicMaterial({color:0xe8603c})));
  makePin({p:new THREE.Vector3(0,y,z0+4),n:new THREE.Vector3(0,0,1),inf,lab,cls:'lev',show:'level',occ:false});
 }
}

/* ---------- ক্যামেরা ---------- */
const TGT=V3(B.target||[0,0,0]),VIEWS=B.views;
let anim=null;
function fly(dir,dist,target,soft){
 const t=(target?(target.isVector3?target:V3(target)):TGT).clone(),d=(Array.isArray(dir)?V3(dir):dir.clone()).normalize();
 if(soft)d.lerp(new THREE.Vector3(0,0,d.z<-.2?-1:1),.35).normalize();
 const p1=t.clone().add(d.multiplyScalar(dist||B.dist||420));
 if(reduce){cam.position.copy(p1);ctl.target.copy(t);ctl.update();dirty=occDirty=true;return}
 anim={p0:cam.position.clone(),t0:ctl.target.clone(),p1,t1:t,s:performance.now()};
}
const flyView=v=>fly(VIEWS[v[0]],v[1],v[2]);
cam.position.copy(TGT.clone().add(new THREE.Vector3(0,0,B.dist||420)));ctl.target.copy(TGT);

/* ---------- মোড ---------- */
function setMode(m){
 const M=B.modes[m]||{};
 mode=m;sel=null;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));
 pins.forEach(x=>x.el.classList.remove('on'));quizMark.visible=false;highlight(null);
 for(const k in layerOn)layerOn[k]=!!(M.layers||{})[k];
 const names={parts:'অংশ',lm:'ল্যান্ডমার্ক',att:'মাসল',rel:'রিলেশন',level:'লেভেল'};
 if(M.card)card(names[m]||'',M.card);
 if(m==='parts')legend.innerHTML='<div class="legend">'+Object.entries(B.PARTS).map(([k,o])=>`<button data-part="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(m==='att')legend.innerHTML='<div class="legend">'+Object.entries(B.REG).map(([k,o])=>`<button data-reg="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(m==='rel')legend.innerHTML='<div class="legend">'+B.relLegend.map(([k,c])=>`<button data-str="${k}"><span class="sw" style="background:${c}"></span>${B.STR[k].t}</button>`).join('')+'</div>';
 else if(m==='quiz')legend.innerHTML='<div class="quiz" id="qz"></div>';
 else legend.innerHTML='';
 if(M.view)flyView(M.view);
 if(m==='quiz')newQ();
 if(['att','rel','level'].includes(m)&&!layersReady)note('লেয়ার লোড হচ্ছে…');
 applyLayers();paint();
}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>fly(VIEWS[b.dataset.view],(B.modes[mode]||{}).viewDist||B.dist||420)));
function showMuscle(r){const o=B.REG[r];sel={reg:r};card('মাসল',{t:o.t,b:o.b,d:o.d,l:['হাড়ে কোথায় লাগে: '+o.w]});paint();highlight(o.k)}
function showStr(k){sel=null;card('রিলেশন',B.STR[k]);highlight(k)}
legend.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.part)card('অংশ',B.PARTS[b.dataset.part]);
 if(b.dataset.reg){const k=+b.dataset.reg;showMuscle(k);if(B.muscleView)flyView(B.muscleView(k))}
 if(b.dataset.str)showStr(b.dataset.str);
 if(b.dataset.opt)answer(b);
 if(b.id==='nextQ')newQ();
});
$('#holdBtn')?.addEventListener('click',()=>{view.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});setTimeout(()=>fly(...B.holdView),reduce?0:350)});

/* ---------- ট্যাপ করে চেনা ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{
 if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;
 const r=renderer.domElement.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
 ray.setFromCamera(ndc,cam);
 const h=ray.intersectObjects(bone.concat(pickable.filter(m=>m.visible&&m.userData.group!=='lung')),false)[0];if(!h)return;
 const ud=h.object.userData,part=B.PARTS[h.object.name];
 if(ud.group==='bone'){
  if(mode!=='att'){if(part)card('অংশ',part);return}
  const reg=h.object.geometry.userData.r[h.face.a];
  if(reg&&B.REG[reg]&&B.REG[reg].k)showMuscle(reg);
  else if(reg&&B.REG[reg]){sel={reg};card('মাসল',B.REG[reg]);paint();highlight(null)}
  else{sel=null;paint();highlight(null);card('মাসল',{t:'এখানে কোনো মাসল লাগে না',b:part?part.t:'',d:'রঙিন জায়গায় ট্যাপ করুন।'})}
  return;
 }
 if(ud.group==='muscle')showMuscle(B.MUS_REG[ud.key]);
 else if(ud.group==='vert'||ud.group==='disc')card('লেভেল',{...B.STR.vert,t:ud.group==='disc'?'Intervertebral disc':'Thoracic vertebra '+ud.key,b:ud.group==='disc'?'ইন্টারভার্টিব্রাল ডিস্ক':'থোরাসিক কশেরুকা '+ud.key});
 else{const k=ud.group==='lung'?'lung':ud.key;if(B.STR[k])showStr(k)}
});

/* ---------- কুইজ ---------- */
const quizMark=new THREE.Mesh(new THREE.SphereGeometry(3.2,24,16),new THREE.MeshBasicMaterial({color:0xe8603c}));quizMark.visible=false;scene.add(quizMark);
const QPOOL=lms.filter(x=>x.quiz);
const nameOf=L=>L.quizName||L.inf.t;
let qCur=null,qs={ok:0,n:0};
function newQ(){
 const pool=QPOOL.filter(x=>x!==qCur);qCur=pool[Math.floor(Math.random()*pool.length)];
 const names=[...new Set(QPOOL.map(nameOf))].filter(n=>n!==nameOf(qCur)).sort(()=>Math.random()-.5).slice(0,3);
 const opts=[nameOf(qCur),...names].sort(()=>Math.random()-.5);
 quizMark.position.copy(qCur.p);quizMark.visible=true;
 info.innerHTML=`<div class="k">কুইজ</div><h3>কমলা বিন্দুটা কী?</h3><p style="margin:6px 0 0">মডেল ঘুরিয়ে দেখে নিন, তারপর সঠিক নামটা বেছে নিন।</p>`;
 $('#qz').innerHTML=`<div class="score">স্কোর: ${qs.ok} / ${qs.n}</div><div class="opts">${opts.map(o=>`<button class="opt" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 fly(qCur.n,470,qCur.p);dirty=true;
}
function answer(b){
 if($('#qz .opt.ok'))return;
 const right=nameOf(qCur),ok=b.dataset.opt===right;qs.n++;if(ok)qs.ok++;
 document.querySelectorAll('#qz .opt').forEach(o=>{if(o.dataset.opt===right)o.classList.add('ok');else if(o===b)o.classList.add('no')});
 card(ok?'সঠিক!':'হলো না, সঠিক উত্তর:',qCur.inf);
 $('#qz .score').textContent=`স্কোর: ${qs.ok} / ${qs.n}`;
 $('#qz').insertAdjacentHTML('beforeend','<div class="bar"><button class="btn" id="nextQ">পরের প্রশ্ন</button></div>');
}

/* ---------- ভারী লেয়ার, পরে লোড ---------- */
function buildLayers(){
 const LY=window.LAYERS;
 for(const m of LY.meshes)addMesh(geo(m),m.group,m.key||m.name,m.name,m.layer);
 for(const t of LY.tubes||[]){
  const c=new THREE.CatmullRomCurve3(t.pts.map(V3));
  const mesh=addMesh(new THREE.TubeGeometry(c,Math.max(24,t.pts.length*10),t.r,8,false),t.group,t.key,t.key,t.layer);mesh.material.color.set(t.col);
 }
 for(const s of LY.spheres||[]){const m=addMesh(new THREE.SphereGeometry(s.r,16,12),'artery',s.key,s.key,s.layer);m.material.color.set(s.col);m.position.set(...s.p)}
 const anchors=LY.anchors||{};
 const center=k=>{const ms=pickable.filter(m=>m.userData.key===k);if(!ms.length)return null;const b=new THREE.Box3();ms.forEach(m=>b.expandByObject(m));const c=b.getCenter(new THREE.Vector3());let best=null,bd=1e9;for(const m of ms){const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=7){const d=(p.getX(i)+m.position.x-c.x)**2+(p.getY(i)+m.position.y-c.y)**2+(p.getZ(i)+m.position.z-c.z)**2;if(d<bd){bd=d;best=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)).add(m.position)}}}return best};
 for(const [k,lab] of B.relLabels||[]){const p=anchors[k]?V3(anchors[k]):center(k);if(p)makePin({p,n:new THREE.Vector3(0,0,1),inf:B.STR[k],lab,cls:'rel',show:'rel',occ:false,onclick:()=>showStr(k)})}
 for(const [k,lab] of B.muscleLabels||[]){const p=center(k);if(p)makePin({p,n:new THREE.Vector3(0,0,1),inf:B.REG[B.MUS_REG[k]],lab,cls:'rel',show:'att',occ:false,onclick:()=>showMuscle(B.MUS_REG[k])})}
 layersReady=true;info.querySelector('.ld')?.remove();applyLayers();
}

/* ---------- রেন্ডার লুপ (ল্যাগ কমাতে: পিন লুকানোর হিসাব শুধু ঘোরানো থামলে) ---------- */
ctl.addEventListener('change',()=>{dirty=true;occDirty=true;lastMove=performance.now()});
const v=new THREE.Vector3(),toCam=new THREE.Vector3(),occ=new THREE.Raycaster();
function place(doOcc){
 const W=view.clientWidth,H=view.clientHeight;
 for(const L of pins){
  const show=L.show===mode&&(L.show!=='att'||layerOn.muscle)&&(L.show!=='rel'||layersReady);
  if(!show){if(L.vis){L.el.classList.add('hid');L.vis=false}continue}
  v.copy(L.p).project(cam);
  L.el.style.transform=`translate(${((v.x+1)/2*W).toFixed(1)}px,${((1-v.y)/2*H).toFixed(1)}px) translate(-50%,-50%)`;
  let vis=L.vis;
  if(!L.occ)vis=v.z<1;
  else if(doOcc){toCam.subVectors(cam.position,L.p).normalize();vis=toCam.dot(L.n)>-0.3;
   if(vis){const dist=cam.position.distanceTo(L.p);occ.set(cam.position,toCam.negate());occ.far=dist-7;vis=occ.intersectObjects(bone,false).length===0}}
  if(vis!==L.vis||doOcc){L.el.classList.toggle('hid',!vis);L.vis=vis}
 }
}
function size(){const W=view.clientWidth,H=view.clientHeight;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();dirty=occDirty=true}
const ro=new ResizeObserver(size);ro.observe(view);
function tick(now){
 if(anim){let k=Math.min(1,(now-anim.s)/700);k=k<.5?2*k*k:1-((-2*k+2)**2)/2;cam.position.lerpVectors(anim.p0,anim.p1,k);ctl.target.lerpVectors(anim.t0,anim.t1,k);if(k>=1)anim=null;dirty=occDirty=true;lastMove=now}
 ctl.update();
 if(quizMark.visible&&!reduce){quizMark.scale.setScalar(1+.25*Math.sin(now/220));dirty=true}
 if(dirty){renderer.render(scene,cam);place(false);dirty=false}
 if(occDirty&&now-lastMove>140){place(true);occDirty=false}
 requestAnimationFrame(tick);
}
setMode('lm');size();requestAnimationFrame(tick);
const sc=document.createElement('script');sc.src=B.layersSrc||'data/layers.js';sc.onload=buildLayers;sc.onerror=()=>note('লেয়ার লোড হয়নি, পেজ রিফ্রেশ করুন।');
setTimeout(()=>document.body.appendChild(sc),300);
