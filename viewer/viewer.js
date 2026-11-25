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
{const t=$('#tbl-att');if(t&&!t.innerHTML.trim()&&B.REG)t.innerHTML=Object.values(B.REG).filter(r=>r.k&&r.w).map(r=>`<tr><td><span class="sw" style="display:inline-block;vertical-align:-3px;margin-right:8px;background:${r.c}"></span>${r.t}</td><td>${r.w}</td></tr>`).join('')}

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
const S=D.scale,bone=[],byLayer={rib:[],clav:[],muscle:[],artery:[],vein:[],nerve:[],lymph:[],organ:[],vert:[],valve:[],cond:[],great:[],ctx:[],mark:[]},pickable=[];
const BONE_C=new THREE.Color(B.baseColor||'#ece4d4'),INNER_C=new THREE.Color(B.innerColor||B.baseColor||'#ece4d4');
renderer.localClippingEnabled=true;
const clipPlane=new THREE.Plane(new THREE.Vector3(0,0,-1),0);let curCut=null,clipOn=false,boneOp=1;
const STYLE={rib:['#e9e1cf',.45],cart:['#9fd6cf',.7],clav:['#e9e1cf',.8],muscle:[null,.38],artery:['#e0443e',1],vein:['#4a78e0',1],heart:['#c9706a',.45],lung:['#f0b8b2',.16],thymus:['#e7a8c9',.75],trachea:['#cfd6dc',.7],vert:['#d9d0bd',.95],disc:['#9fd6cf',.9],valve:['#f3e3b0',1],pap:['#c96b62',1],cond:['#ffd43b',1],pa:['#6c63d9',1],pvein:['#e8738a',1],mark:['#ff8a3d',1]};
const G2L={rib:'rib',cart:'rib',clav:'clav',muscle:'muscle',artery:'artery',vein:'vein',heart:'organ',lung:'organ',thymus:'organ',trachea:'organ',vert:'vert',disc:'vert',valve:'valve',pap:'valve',cond:'cond',pa:'great',pvein:'great',mark:'mark'};
function geo(m){
 const q=dec(m.v,Int16Array),p=new Float32Array(q.length);for(let i=0;i<q.length;i++)p[i]=q[i]*S;
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 g.setIndex(new THREE.BufferAttribute(dec(m.f,Uint16Array),1));g.computeVertexNormals();g.computeBoundingSphere();return g;
}
function addMesh(g,group,key,name,layer){
 const st=STYLE[group]||['#ccc',1];let col=st[0];
 if(group==='muscle')col=B.MUS_REG&&B.MUS_REG[key]!=null?B.REG[B.MUS_REG[key]].c:'#5b86c9';
 const op=st[1],mat=new THREE.MeshStandardMaterial({color:col,roughness:group==='artery'||group==='vein'?.45:.75,transparent:op<1,opacity:op,depthWrite:op>=.6});
 const mesh=new THREE.Mesh(g,mat);mesh.name=name;mesh.userData={group,key,op};mesh.visible=false;
 if(group==='lung')mesh.renderOrder=2;
 if(group==='mark'){mesh.renderOrder=3;mat.depthTest=false;mat.transparent=true}
 scene.add(mesh);byLayer[layer||G2L[group]].push(mesh);if(group!=='rib'&&group!=='cart')pickable.push(mesh);return mesh;
}
for(const m of D.meshes){
 const g=geo(m);
 if(m.group==='bone'){
  g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*3),3));g.userData.r=m.r?dec(m.r,Uint8Array):new Uint8Array(g.attributes.position.count);g.userData.p=m.p?dec(m.p,Uint8Array):null;g.userData.t=m.t?dec(m.t,Uint8Array):null;
  const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:B.boneRough||.78,metalness:0}));mesh.name=m.name;mesh.userData={group:'bone'};scene.add(mesh);bone.push(mesh);
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

const paintKind=()=>(B.modes[mode]||{}).paint||(mode==='parts'?'parts':mode==='att'?'reg':null);
function paint(){
 const focus=sel&&sel.reg,pk=paintKind();
 for(const s of bone){
  const g=s.geometry,c=g.attributes.color,r=g.userData.r,pa=g.userData.p,tt=g.userData.t,pc=new THREE.Color(B.PARTS[s.name]?.c||'#ece4d4'),tmp=new THREE.Color();
  for(let i=0;i<r.length;i++){
   const inner=pa&&pa[i]>=10;let col=inner?INNER_C:BONE_C;
   if(pk==='parts')col=pa?tmp.set(B.PARTS[pa[i]]?.c||'#ccc'):pc;
   else if(pk==='terr'&&tt&&B.TERR[tt[i]]){col=tmp.set(B.TERR[tt[i]].c);if(inner)col.lerp(INNER_C,.5);if(focus&&tt[i]!==focus)col.lerp(BONE_C,.75)}
   else if(pk==='reg'&&r[i]&&B.REG[r[i]]){col=tmp.set(B.REG[r[i]].c);if(focus&&r[i]!==focus)col.lerp(BONE_C,.78)}
   else if(pk!=='reg'&&pk!=='parts'&&r[i]&&(r[i]===8||B.REG[r[i]]?.lm))col=tmp.set(B.REG[r[i]].c);
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

/* ---------- পিন ও মার্ক ---------- */
const MK=B.MK||[['elev','উঁচু অংশ: tubercle, crest, angle, head'],['joint','জোড়ার তল: facet, notch যেখানে হাড় জোড়া লাগে'],['groove','খাঁজ বা ছাপ: groove, notch, impression'],['part','অংশ: neck ইত্যাদি'],['surf','পৃষ্ঠ বা বর্ডার'],['num','নম্বর: costal notch']];
const pins=[];
/* মার্ক এখন 3D দৃশ্যের ভেতরে sprite: মডেলের সাথে একই ফ্রেমে ঘোরে, পেছনের মার্ক মডেলই ঢেকে দেয় (depth test)। HTML শুধু নামের লেবেল। */
const MKCOL={elev:['#e8603c','#fff','c'],joint:['rgba(143,211,214,.25)','#8fd3d6','r'],groove:['#4a78e0','#fff','d'],part:['#c77dce','#fff','s'],surf:['#2f8f7d','#fff','c',.8],num:['#e8603c','#fff','c',1.25],
 open:['#1b2522','#f7c873','r'],node:['#ffd43b','#7a5200','d'],inner:['#f2b8b0','#7a2e2a','c'],art:['#e0443e','#fff','c'],ven:['#4a78e0','#fff','c'],aus:['#f06595','#fff','c',1.1]};
const texCache={},sprites=new THREE.Group();sprites.renderOrder=10;scene.add(sprites);
function mkTex(type,num){
 const k=type+'|'+(num||'');if(texCache[k])return texCache[k];
 const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');const [f,s,sh,sc]=MKCOL[type]||MKCOL.part;const R=30*(sc||1)*(sc>1?0.8:1);
 g.translate(48,48);g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=8;g.lineWidth=sh==='r'?11:6;g.fillStyle=f;g.strokeStyle=s;g.beginPath();
 if(sh==='d'){g.rotate(Math.PI/4);g.rect(-R*.78,-R*.78,R*1.56,R*1.56)}else if(sh==='s'){const a=R*.82;g.roundRect?g.roundRect(-a,-a,2*a,2*a,10):g.rect(-a,-a,2*a,2*a)}else g.arc(0,0,R-(sh==='r'?4:0),0,Math.PI*2);
 g.fill();g.shadowBlur=0;g.stroke();
 if(num){g.setTransform(1,0,0,1,48,48);g.fillStyle='#fff';g.font='700 34px "Hind Siliguri",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(num,0,2)}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return texCache[k]=t;
}
let mkScale=.02;
function makePin(o){
 if(o.mk){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:mkTex(o.cls.split('mk-')[1],o.num),sizeAttenuation:false,depthTest:true,depthWrite:false,transparent:true}));
  o.base=o.p.clone().addScaledVector(o.n,o.offs??2);sp.position.copy(o.base);sp.userData.pin=o;sp.visible=false;sp.renderOrder=10;sprites.add(sp);o.spr=sp}
 const el=document.createElement('button');el.type='button';el.className='pin '+(o.cls||'');el.setAttribute('aria-label',o.inf.t);
 if(o.mk){el.classList.add('mk3d');el.innerHTML=`<span class="nm">${esc(o.lab)}</span>`}else el.textContent=o.lab;
 el.addEventListener('click',e=>{e.stopPropagation();if(mode==='quiz')return;o.onclick?o.onclick():selectLm(o)});
 pinsEl.appendChild(el);o.el=el;o.vis=true;pins.push(o);return o;
}
const lms=D.lm.map(o=>{
 const x=B.lmInfo(o.id);
 const type=x.type||(x.kind==='num'?'num':x.kind==='surf'?'surf':'elev');
 return makePin({id:o.id,p:V3(o.p),n:V3(o.n).normalize(),inf:x.inf,lab:x.kind==='num'?(x.inf.t):x.lab,num:x.kind==='num'?x.lab:null,kind:x.kind,quiz:x.quiz,quizName:x.quizName,cls:'mk mk-'+type,mk:true,show:x.show||'lm',occ:true,cut:x.cut||o.cut||null});
});
function card(k,o){
 info.innerHTML=`<div class="k">${esc(k)}</div><h3>${esc(o.t)}</h3><div class="sub">${esc(o.b)}</div><p style="margin:0 0 6px">${esc(o.d)}</p>${o.l?'<ul>'+o.l.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}`;
}
function selectLm(L){sel={lm:L};if(L.cut&&L.cut!==true&&(B.modes[mode]||{}).cuts&&!cutHas(L,curCut)){const c=[].concat(L.cut).find(k=>(B.modes[mode].cuts||[]).includes(k));if(c)setCut(c,false)}pins.forEach(x=>x.el.classList.toggle('on',x===L));card('ল্যান্ডমার্ক',L.inf);dirty=true}  // শুধু নাম দেখায়, ক্যামেরা ঘোরায় না

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

/* ---------- কাটা (clipping): ভেতরটা দেখার জন্য ---------- */
const cutHas=(L,c)=>!!c&&[].concat(L.cut).includes(c);
function clipTargets(){const M=B.modes[mode]||{};const L=M.clipLayers||[];return bone.concat(...L.map(k=>byLayer[k]||[]))}
function applyClip(){
 const all=bone.concat(...Object.values(byLayer));
 for(const m of all){m.material.clippingPlanes=null;m.material.needsUpdate=true}
 if(clipOn)for(const m of clipTargets()){m.material.clippingPlanes=[clipPlane];m.material.side=THREE.DoubleSide;m.material.needsUpdate=true}
 for(const b of bone){b.material.side=clipOn?THREE.DoubleSide:THREE.FrontSide}
 dirty=occDirty=true;
}
function setCut(k,doFly=true){
 const C=k&&B.cuts?B.cuts[k]:null;curCut=k||null;clipOn=!!(C&&C.n);
 if(C&&C.n){clipPlane.normal.copy(V3(C.n).normalize());clipPlane.constant=-(C.o||0);const sl=$('#cutSl');if(sl){sl.value=0;}}
 document.querySelectorAll('[data-cut]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.cut===k));
 if(C&&C.card&&mode!=='quiz')card(C.t||'',C.card);
 if(C&&C.view&&doFly)flyView(C.view);
 applyClip();
}
function setBoneOp(op){boneOp=op;for(const b of bone){b.material.transparent=op<1;b.material.opacity=op;b.material.depthWrite=op>=1;b.material.needsUpdate=true}dirty=occDirty=true}

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
const flyView=v=>fly(Array.isArray(v[0])?v[0]:VIEWS[v[0]],v[1],v[2]);
cam.position.copy(TGT.clone().add(new THREE.Vector3(0,0,B.dist||420)));ctl.target.copy(TGT);

/* ---------- মোড ---------- */
function setMode(m){
 const M=B.modes[m]||{};
 mode=m;sel=null;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));
 pins.forEach(x=>x.el.classList.remove('on'));quizMark.visible=false;highlight(null);
 for(const k in layerOn)layerOn[k]=!!(M.layers||{})[k];
 curCut=M.cut||(M.cuts&&M.cuts[0])||null;
 const names={parts:'অংশ',lm:'ল্যান্ডমার্ক',att:'মাসল',rel:'রিলেশন',level:'লেভেল',joint:'জয়েন্ট',side:'ডান না বাম',which:'কোন নম্বর?'};
 bone.forEach(b=>b.visible=m!=='side'&&m!=='which'&&!M.hideBone);sideGroup.visible=m==='side';whichGroup.visible=m==='which';
 setBoneOp(M.boneOp??1);
 if(M.card)card(names[m]||'',M.card);
 if(m==='parts')legend.innerHTML='<div class="legend">'+Object.entries(B.PARTS).map(([k,o])=>`<button data-part="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(m==='att')legend.innerHTML='<div class="legend">'+Object.entries(B.REG).map(([k,o])=>`<button data-reg="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(M.legend)legend.innerHTML=(M.cuts?cutBar(M):'')+(M.paint==='terr'?'<div class="legend" style="margin-bottom:8px">'+Object.entries(B.TERR).map(([k,o])=>`<button data-terr="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>':'')+'<div class="legend">'+M.legend.map(([k,c])=>`<button data-str="${k}"><span class="sw" style="background:${c}"></span>${B.STR[k].t}</button>`).join('')+'</div>';
 else if(M.paint==='reg')legend.innerHTML='<div class="legend">'+Object.entries(B.REG).map(([k,o])=>`<button data-reg="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(M.paint==='terr')legend.innerHTML='<div class="legend">'+Object.entries(B.TERR).map(([k,o])=>`<button data-terr="${k}"><span class="sw" style="background:${o.c}"></span>${o.t}</button>`).join('')+'</div>';
 else if(m==='rel')legend.innerHTML='<div class="legend">'+B.relLegend.map(([k,c])=>`<button data-str="${k}"><span class="sw" style="background:${c}"></span>${B.STR[k].t}</button>`).join('')+'</div>';
 else if(m==='quiz'||m==='side'||m==='which')legend.innerHTML='<div class="quiz" id="qz"></div>';
 else if(m==='lm'||m==='joint'||M.markers){const used=new Set(lms.filter(x=>[].concat(x.show).includes(m)).map(x=>x.cls.split('mk-')[1]));legend.innerHTML=(M.cuts?cutBar(M):'')+'<div class="legend mkleg">'+MK.filter(t=>used.has(t[0])).map(([k,t])=>`<div><span class="pin mk mk-${k} demo"><i class="sh"></i>${k==='num'?'<b class="no">২</b>':''}</span>${t}</div>`).join('')+'<div class="note" style="color:#b9d3cb">'+esc(B.mkNote||'মার্কে ট্যাপ করলে নাম দেখাবে। শুধু যে পাশ দেখছেন সেই পাশের মার্ক দেখায়; ঘোরালে অন্য পাশের মার্ক আসবে।')+'</div></div>'}
 else legend.innerHTML='';
 if(M.view)flyView(M.view);
 setCut(M.cut||(M.cuts&&M.cuts[0])||null,!M.view);
 if(m==='quiz')newQ();
 if(m==='side')newSide();
 if(m==='which')loadWhich(newWhich);
 if(['att','rel','level'].includes(m)&&!layersReady)note('লেয়ার লোড হচ্ছে…');
 applyLayers();paint();
}
function cutBar(M){return '<div class="legend cutbar">'+M.cuts.map(k=>`<button data-cut="${k}" aria-pressed="${k===curCut}">${esc(B.cuts[k].t)}</button>`).join('')+'</div>'+(M.slider!==false?'<label class="cutsl">কাটার গভীরতা <input type="range" id="cutSl" min="-25" max="25" step="1" value="0"></label>':'')}
legend.addEventListener('input',e=>{if(e.target.id==='cutSl'&&curCut&&B.cuts[curCut].n){clipPlane.constant=-(B.cuts[curCut].o||0)-(+e.target.value);dirty=occDirty=true}});
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>fly(VIEWS[b.dataset.view],(B.modes[mode]||{}).viewDist||B.dist||420)));
function showMuscle(r){const o=B.REG[r];sel={reg:r};card('মাসল',{t:o.t,b:o.b,d:o.d,l:['হাড়ে কোথায় লাগে: '+o.w]});paint();highlight(o.k)}
function showStr(k){sel=null;card('রিলেশন',B.STR[k]);highlight(k)}
legend.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.part)card('অংশ',B.PARTS[b.dataset.part]);
 if(b.dataset.reg){const k=+b.dataset.reg;if(B.REG[k].k||mode==='att'){showMuscle(k);if(B.muscleView)flyView(B.muscleView(k))}else{sel={reg:k};card(B.regLabel||'অংশ',B.REG[k]);paint();if(B.REG[k].view)flyView(B.REG[k].view)}}
 if(b.dataset.terr){const k=+b.dataset.terr;sel={reg:k};card(B.terrLabel||'রক্ত সরবরাহ',B.TERR[k]);paint();highlight(B.TERR[k].k)}
 if(b.dataset.cut)setCut(b.dataset.cut);
 if(b.dataset.str)showStr(b.dataset.str);
 if(b.dataset.opt)answer(b);
 if(b.id==='nextQ')newQ();
 if(b.dataset.side)answerSide(b.dataset.side);
 if(b.id==='nextSide')newSide();
 if(b.dataset.which)answerWhich(b.dataset.which);
 if(b.id==='nextWhich')newWhich();
});
$('#holdBtn')?.addEventListener('click',()=>{view.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});setTimeout(()=>fly(...B.holdView),reduce?0:350)});

/* ---------- ট্যাপ করে চেনা ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();let down=null;
renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
renderer.domElement.addEventListener('pointerup',e=>{
 if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>6)return;
 const r=renderer.domElement.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
 ray.setFromCamera(ndc,cam);
 {const vs=sprites.children.filter(s=>s.visible);const sh=ray.intersectObjects(vs,false)[0];
  if(sh){const bh=ray.intersectObjects(bone.filter(b=>b.visible),false).filter(x=>!clipOn||clipPlane.distanceToPoint(x.point)>=-.5)[0];
   if(!bh||boneOp<1||sh.distance<bh.distance+3){const L=sh.object.userData.pin;if(mode!=='quiz'){L.onclick?L.onclick():selectLm(L)}dirty=true;return}}}
 const h=ray.intersectObjects(bone.filter(b=>b.visible).concat(pickable.filter(m=>m.visible&&m.userData.group!=='lung'&&m.userData.group!=='mark')),false).filter(x=>!clipOn||!x.object.material.clippingPlanes||clipPlane.distanceToPoint(x.point)>=-.5)[0];if(!h)return;
 const ud=h.object.userData,pa=h.object.geometry.userData.p,part=pa?B.PARTS[pa[h.face.a]]:B.PARTS[h.object.name];
 if(ud.group==='bone'){
  const pk=paintKind();
  if(pk==='reg'&&mode!=='att'){const reg=h.object.geometry.userData.r[h.face.a];if(reg&&B.REG[reg]){sel={reg};card(B.regLabel||'অংশ',B.REG[reg]);paint()}else if(part)card('অংশ',part);return}
  if(pk==='terr'){const t=h.object.geometry.userData.t[h.face.a];if(B.TERR[t]){sel={reg:t};card(B.terrLabel||'রক্ত সরবরাহ',B.TERR[t]);paint();highlight(B.TERR[t].k)}return}
  if(mode!=='att'){if(part)card(B.partLabel||'অংশ',part);return}
  const reg=h.object.geometry.userData.r[h.face.a];
  if(reg&&B.REG[reg]&&B.REG[reg].k)showMuscle(reg);
  else if(reg&&B.REG[reg]){sel={reg};card('মাসল',B.REG[reg]);paint();highlight(null)}
  else{sel=null;paint();highlight(null);card('মাসল',{t:'এখানে কোনো মাসল লাগে না',b:part?part.t:'',d:'রঙিন জায়গায় ট্যাপ করুন।'})}
  return;
 }
 if(ud.group==='muscle'&&B.MUS_REG&&B.MUS_REG[ud.key]!=null)showMuscle(B.MUS_REG[ud.key]);
 else if((ud.group==='vert'||ud.group==='disc')&&B.STR[ud.key])showStr(ud.key);
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
 if(B.cuts){const c=qCur.cut?[].concat(qCur.cut).find(k=>B.cuts[k]&&B.cuts[k].n):null;setCut(c||null,false);setBoneOp(c&&B.cuts[c].op?B.cuts[c].op:1)}
 info.innerHTML=`<div class="k">কুইজ</div><h3>কমলা বিন্দুটা কী?</h3><p style="margin:6px 0 0">মডেল ঘুরিয়ে দেখে নিন, তারপর সঠিক নামটা বেছে নিন।</p>`;
 $('#qz').innerHTML=`<div class="score">স্কোর: ${qs.ok} / ${qs.n}</div><div class="opts">${opts.map(o=>`<button class="opt" data-opt="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 {const C=B.cuts&&qCur.cut?[].concat(qCur.cut).map(k=>B.cuts[k]).find(c=>c&&c.n):null;if(C)fly(C.view[0],C.view[1]*.9,qCur.p);else fly(qCur.n,B.quizDist||470,qCur.p)}dirty=true;
}
function answer(b){
 if($('#qz .opt.ok'))return;
 const right=nameOf(qCur),ok=b.dataset.opt===right;qs.n++;if(ok)qs.ok++;
 document.querySelectorAll('#qz .opt').forEach(o=>{if(o.dataset.opt===right)o.classList.add('ok');else if(o===b)o.classList.add('no')});
 card(ok?'সঠিক!':'হলো না, সঠিক উত্তর:',qCur.inf);
 $('#qz .score').textContent=`স্কোর: ${qs.ok} / ${qs.n}`;
 $('#qz').insertAdjacentHTML('beforeend','<div class="bar"><button class="btn" id="nextQ">পরের প্রশ্ন</button></div>');
}

/* ---------- ডান না বাম (জোড়া হাড়ের side determination) ---------- */
const sideGroup=new THREE.Group();sideGroup.visible=false;scene.add(sideGroup);
const sideMesh={};
if(D.side)for(const s of ['R','L']){const m=new THREE.Mesh(geo(D.side[s]),new THREE.MeshStandardMaterial({color:'#ece4d4',roughness:.78}));sideGroup.add(m);sideMesh[s]=m}
let sideCur=null,sideStats={ok:0,n:0},rotAnim=null;
const ZERO=new THREE.Vector3(0,0,0);
function newSide(){
 if(!D.side)return;
 sideCur=Math.random()<.5?'R':'L';for(const s in sideMesh)sideMesh[s].visible=s===sideCur;
 rotAnim=null;sideGroup.quaternion.setFromEuler(new THREE.Euler(Math.random()*6.28,Math.random()*6.28,Math.random()*6.28));
 info.innerHTML=`<div class="k">ডান না বাম</div><h3>এই রিবটা কোন পাশের?</h3><p style="margin:6px 0 0">${esc(B.sideHint||'আঙুল দিয়ে ঘুরিয়ে দেখুন, তারপর বলুন।')}</p>`;
 $('#qz').innerHTML=`<div class="score">স্কোর: ${sideStats.ok} / ${sideStats.n}</div><div class="opts"><button class="opt" data-side="R">ডান (Right)</button><button class="opt" data-side="L">বাম (Left)</button></div>`;
 fly(B.sideView||[0,0,1],B.sideDist||300,ZERO);dirty=true;
}
function answerSide(c){
 if($('#qz .opt.ok'))return;
 const ok=c===sideCur;sideStats.n++;if(ok)sideStats.ok++;
 document.querySelectorAll('#qz .opt').forEach(o=>{if(o.dataset.side===sideCur)o.classList.add('ok');else if(o.dataset.side===c)o.classList.add('no')});
 card(ok?'সঠিক!':'হলো না',{t:sideCur==='R'?'এটা ডান পাশের':'এটা বাম পাশের',b:'মডেল এখন শরীরে যেভাবে থাকে সেভাবে ঘুরে যাচ্ছে',d:'যেভাবে চিনবেন:',l:B.sideRules||[]});
 $('#qz .score').textContent=`স্কোর: ${sideStats.ok} / ${sideStats.n}`;
 $('#qz').insertAdjacentHTML('beforeend','<div class="bar"><button class="btn" id="nextSide">পরেরটা</button></div>');
 rotAnim={g:sideGroup,q0:sideGroup.quaternion.clone(),q1:new THREE.Quaternion(),s:performance.now()};
 fly(B.sideView||[0,0,1],B.sideDist||300,ZERO);
}

/* ---------- কোন নম্বর? (একই ধরনের কয়েকটা হাড়ের মধ্যে চেনা, যেমন কশেরুকা) ---------- */
const whichGroup=new THREE.Group();whichGroup.visible=false;scene.add(whichGroup);
const whichMesh={};let whichCur=null,whichStats={ok:0,n:0},whichLoaded=false;
function loadWhich(cb){
 if(whichLoaded)return cb();
 const sc=document.createElement('script');sc.src=B.whichSrc;
 sc.onload=()=>{for(const m of window.WHICH.items){const mesh=new THREE.Mesh(geo(m),new THREE.MeshStandardMaterial({color:'#ece4d4',roughness:.78}));mesh.visible=false;whichGroup.add(mesh);whichMesh[m.k]=mesh}whichLoaded=true;if(mode==='which')cb()};
 sc.onerror=()=>note('ট্রেনারের ডেটা লোড হয়নি, পেজ রিফ্রেশ করুন।');
 document.body.appendChild(sc);
}
function newWhich(){
 const keys=Object.keys(whichMesh);if(!keys.length)return;
 const pool=keys.filter(k=>k!==whichCur);whichCur=pool[Math.floor(Math.random()*pool.length)];
 for(const k in whichMesh)whichMesh[k].visible=k===whichCur;
 rotAnim=null;whichGroup.quaternion.setFromEuler(new THREE.Euler(Math.random()*6.28,Math.random()*6.28,Math.random()*6.28));
 info.innerHTML=`<div class="k">কোন নম্বর?</div><h3>${esc(B.whichQ||'এটা কোনটা?')}</h3><p style="margin:6px 0 0">${esc(B.whichHint||'')}</p>`;
 $('#qz').innerHTML=`<div class="score">স্কোর: ${whichStats.ok} / ${whichStats.n}</div><div class="opts">${keys.map(k=>`<button class="opt" data-which="${esc(k)}">${esc(B.whichNames[k])}</button>`).join('')}</div>`;
 fly(B.whichView||[0,.4,1],B.whichDist||200,ZERO);dirty=true;
}
function answerWhich(k){
 if($('#qz .opt.ok'))return;
 const ok=k===whichCur;whichStats.n++;if(ok)whichStats.ok++;
 document.querySelectorAll('#qz .opt').forEach(o=>{if(o.dataset.which===whichCur)o.classList.add('ok');else if(o.dataset.which===k)o.classList.add('no')});
 card(ok?'সঠিক!':'হলো না',{t:'এটা '+B.whichNames[whichCur],b:'মডেল এখন শরীরে যেভাবে থাকে সেভাবে ঘুরে যাচ্ছে',d:'যেভাবে চিনবেন:',l:(B.whichRules||{})[whichCur]||[]});
 $('#qz .score').textContent=`স্কোর: ${whichStats.ok} / ${whichStats.n}`;
 $('#qz').insertAdjacentHTML('beforeend','<div class="bar"><button class="btn" id="nextWhich">পরেরটা</button></div>');
 rotAnim={g:whichGroup,q0:whichGroup.quaternion.clone(),q1:new THREE.Quaternion(),s:performance.now()};
 fly(B.whichView||[0,.4,1],B.whichDist||200,ZERO);
}

/* ---------- ভারী লেয়ার, পরে লোড ---------- */
function buildLayers(){
 const LY=window.LAYERS;
 for(const m of LY.meshes)addMesh(geo(m),m.group,m.key||m.name,m.name,m.layer);
 for(const t of LY.tubes||[]){
  const c=new THREE.CatmullRomCurve3(t.pts.map(V3));
  const mesh=addMesh(new THREE.TubeGeometry(c,Math.max(24,t.pts.length*10),t.r,8,false),t.group,t.key,t.key,t.layer);mesh.material.color.set(t.col);
 }
 for(const s of LY.spheres||[]){const m=addMesh(new THREE.SphereGeometry(s.r,16,12),s.layer==='mark'?'mark':(s.group||'artery'),s.key,s.key,s.layer);m.material.color.set(s.col);m.position.set(...s.p)}
 const anchors=LY.anchors||{};
 const center=k=>{const ms=pickable.filter(m=>m.userData.key===k);if(!ms.length)return null;const b=new THREE.Box3();ms.forEach(m=>b.expandByObject(m));const c=b.getCenter(new THREE.Vector3());let best=null,bd=1e9;for(const m of ms){const p=m.geometry.attributes.position;for(let i=0;i<p.count;i+=7){const d=(p.getX(i)+m.position.x-c.x)**2+(p.getY(i)+m.position.y-c.y)**2+(p.getZ(i)+m.position.z-c.z)**2;if(d<bd){bd=d;best=new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)).add(m.position)}}}return best};
 for(const [k,lab,md,ty] of B.relLabels||[]){const p=anchors[k]?V3(anchors[k]):center(k);if(!p)continue;
  if(B.relAsMarkers){ // লেখার বদলে বিন্দু: ট্যাপ করলে নাম, শুধু দেখা পাশেরগুলো
   const n=(md==='surf'?new THREE.Vector3(0,0,1):p.clone().sub(TGT).normalize());
   const L=makePin({p,n,inf:B.STR[k],lab,cls:'mk mk-'+(ty||'part'),mk:true,show:md||'rel',occ:true,onclick:()=>{pins.forEach(x=>x.el.classList.toggle('on',x===L));showStr(k)}});
  } else makePin({p,n:new THREE.Vector3(0,0,1),inf:B.STR[k],lab,cls:'rel',show:md||'rel',occ:false,onclick:()=>showStr(k)})}
 for(const [k,lab] of B.muscleLabels||[]){const p=center(k);if(p)makePin({p,n:new THREE.Vector3(0,0,1),inf:B.REG[B.MUS_REG[k]],lab,cls:'rel',show:'att',occ:false,onclick:()=>showMuscle(B.MUS_REG[k])})}
 layersReady=true;info.querySelector('.ld')?.remove();applyLayers();applyClip();
}

/* ---------- রেন্ডার লুপ (ল্যাগ কমাতে: পিন লুকানোর হিসাব শুধু ঘোরানো থামলে) ---------- */
ctl.addEventListener('change',()=>{dirty=true;occDirty=true;lastMove=performance.now()});
const v=new THREE.Vector3(),toCam=new THREE.Vector3(),occ=new THREE.Raycaster();
function showIn(L,m){
 if(!(Array.isArray(L.show)?L.show.includes(m):L.show===m))return false;
 const M=B.modes[m]||{};
 if(L.cut&&(M.cuts||M.cut))return cutHas(L,curCut);
 if((M.cuts||M.cut)&&L.mk&&M.cutOnly)return false;
 return true;
}
function place(doOcc){
 const W=view.clientWidth,H=view.clientHeight;
 for(const L of pins){
  const show=showIn(L,mode)&&(L.show!=='att'||layerOn.muscle)&&(!['rel','cor','surf','cond','valve'].some(k=>[].concat(L.show).includes(k))||layersReady||L.mk);
  if(L.mk){L.spr.visible=show;if(show){toCam.subVectors(cam.position,L.base).normalize();L.spr.position.copy(L.base).addScaledVector(toCam,B.mkLift??3)}L.spr.scale.setScalar(mkScale*(L.el.classList.contains('on')?1.4:1));
   const on=show&&L.el.classList.contains('on');L.el.classList.toggle('hid',!on);if(!on)continue;
   v.copy(L.spr.position).project(cam);L.el.style.transform=`translate(${((v.x+1)/2*W).toFixed(1)}px,${((1-v.y)/2*H).toFixed(1)}px) translate(-50%,-50%)`;continue}
  if(!show){if(L.vis){L.el.classList.add('hid');L.vis=false}continue}
  v.copy(L.p).project(cam);
  L.el.style.transform=`translate(${((v.x+1)/2*W).toFixed(1)}px,${((1-v.y)/2*H).toFixed(1)}px) translate(-50%,-50%)`;
  let vis=L.vis;
  if(!L.occ)vis=v.z<1;
  else if(doOcc){toCam.subVectors(cam.position,L.p).normalize();vis=toCam.dot(L.n)>-0.3;
   if(vis&&boneOp>=1){const dist=cam.position.distanceTo(L.p);occ.set(cam.position,toCam.negate());occ.far=dist-7;vis=occ.intersectObjects(bone,false).filter(x=>!clipOn||clipPlane.distanceToPoint(x.point)>=-.5).length===0}}
  if(vis!==L.vis||doOcc){L.el.classList.toggle('hid',!vis);L.vis=vis}
 }
}
function size(){const W=view.clientWidth,H=view.clientHeight;renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();mkScale=2*(B.mkPx||26)/(cam.projectionMatrix.elements[5]*H);dirty=occDirty=true}
const ro=new ResizeObserver(size);ro.observe(view);
function tick(now){
 if(anim){let k=Math.min(1,(now-anim.s)/700);k=k<.5?2*k*k:1-((-2*k+2)**2)/2;cam.position.lerpVectors(anim.p0,anim.p1,k);ctl.target.lerpVectors(anim.t0,anim.t1,k);if(k>=1)anim=null;dirty=occDirty=true;lastMove=now}
 ctl.update();
 if(rotAnim){let k=reduce?1:Math.min(1,(now-rotAnim.s)/900);rotAnim.g.quaternion.slerpQuaternions(rotAnim.q0,rotAnim.q1,k<.5?2*k*k:1-((-2*k+2)**2)/2);dirty=true;if(k>=1)rotAnim=null}
 if(quizMark.visible&&!reduce){quizMark.scale.setScalar(1+.25*Math.sin(now/220));dirty=true}
 if(dirty){place(false);renderer.render(scene,cam);dirty=false}
 if(occDirty&&now-lastMove>140){place(true);occDirty=false}
 requestAnimationFrame(tick);
}
setMode(B.startMode||'lm');size();requestAnimationFrame(tick);
const sc=document.createElement('script');sc.src=B.layersSrc||'data/layers.js';sc.onload=buildLayers;sc.onerror=()=>note('লেয়ার লোড হয়নি, পেজ রিফ্রেশ করুন।');
setTimeout(()=>document.body.appendChild(sc),300);
