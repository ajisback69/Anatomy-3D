/* Trachea ও bronchi: সব লেখা ও কনফিগারেশন।
   লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Part-I, Chapter 4: The Trachea; Right and Left Bronchi, বইয়ের পৃ. 46–51।
   PARTS = ভাগ (trachea, principal, lobar, segmental), TERR = কোন broncho-pulmonary segment-এ (স্কিম্যাটিক, lungs পেজের মতো)।
   নিয়ম: medical term সবসময় English। */
{
const D=window.DATA,M=D.meas;
const SCAN='স্ক্যান থেকে মাপা',SCH='স্কিম্যাটিক: স্ক্যানে আলাদা করে নেই, বইয়ের বর্ণনা অনুযায়ী বসানো';
const DT=p=>`Datta I, পৃ. ${p}`;
const PARTS={
 1:{c:'#dfe9ee',t:'Trachea',b:'',d:`Membrano-cartilaginous নল, larynx-এর ধারাবাহিকতা। Cricoid cartilage-এর নিচের কিনারা (C6) থেকে শুরু, neck আর superior mediastinum দিয়ে নেমে sternal angle-এর লেভেলে দুই principal bronchus-এ ভাগ হয়। Bifurcation: cadaver-এ T4-এর নিচের কিনারা, জীবিত দাঁড়ানো অবস্থায় T6, newborn-এ T3। মধ্যরেখায় থাকে, শুধু শেষ অংশ arch of aorta-র চাপে একটু ডানে সরে। Adult-এ ভেতরের ব্যাস প্রায় ১২ মিমি। ${DT('46')}`,l:[`এই স্ক্যানে: দৈর্ঘ্য ${M.trachLen} সেমি, বাইরের চওড়া ${M.trachW} সেমি, সামনে-পেছনে ${M.trachD} সেমি`,`উপরের মাথা ${M.topLevel}-এর লেভেলে; bifurcation (carina) ${M.carinaLevel}-এর লেভেলে, sternal angle থেকে ${M.carinaVsSternalAngle} সেমি উপরে`]},
 2:{c:'#7fb3e8',t:'Right principal bronchus',b:'',d:`Left-এর চেয়ে চওড়া, ছোট আর বেশি খাড়া: median plane থেকে প্রায় ২৫°। Extrapulmonary অংশ প্রায় ২.৫ সেমি। Arch of azygos-এর নিচ দিয়ে root of lung-এ ঢোকে, hilum-এ T5-এর লেভেলে। Root-এ right pulmonary artery সামনে দিয়ে আড়াআড়ি যায়; তার আগেই upper lobe-এর eparterial শাখা বের হয়, বাকিটা hyparterial। তাই foreign body সাধারণত right lung-এ যায়। ${DT('48–49, 51')}`,l:[`এই স্ক্যানে carina থেকে প্রথম শাখা পর্যন্ত ${M.lenR} সেমি`]},
 3:{c:'#f2a65a',t:'Left principal bronchus',b:'',d:`Right-এর চেয়ে লম্বা, সরু আর বেশি তির্যক: median plane থেকে প্রায় ৪৫°। Extrapulmonary অংশ প্রায় ৫ সেমি। Arch of aorta-র নিচ দিয়ে, descending aorta-র সামনে দিয়ে hilum-এ T6-এর লেভেলে; কোনো eparterial শাখা নেই, পুরোটা pulmonary artery-র নিচে (hyparterial)। ${DT('49')}`,l:[`এই স্ক্যানে carina থেকে প্রথম শাখা পর্যন্ত ${M.lenL} সেমি`]},
 4:{c:'#e76f7a',t:'Right upper lobe (eparterial) bronchus',b:'',d:`Main bronchus-এর উপরে-পাশ থেকে, bifurcation থেকে প্রায় ২.৫ সেমি দূরে, lung-এ ঢোকার আগেই; ১ সেমি উপরে-পাশে গিয়ে তিনটা tertiary bronchus: apical, posterior, anterior। ${DT('49')}`},
 5:{c:'#58c48b',t:'Right middle lobe bronchus',b:'',d:`Upper lobe bronchus-এর প্রায় ২ সেমি নিচে সামনে থেকে; lateral আর medial দুই tertiary bronchus। লম্বা, চারপাশে hilar lymph node; node বড় হলে চেপে পুরো middle lobe collapse করতে পারে (middle lobe syndrome)। ${DT('49')}`},
 6:{c:'#4c7bd1',t:'Right lower lobe bronchus',b:'',d:`পাঁচটা tertiary: apical (middle lobe bronchus-এর ঠিক বিপরীতে বা একটু নিচে, পেছনে), তারপর medial basal (cardiac) আর anterior basal, শেষে lateral basal আর posterior basal। ${DT('49')}`},
 7:{c:'#f4c95d',t:'Left upper lobe bronchus',b:'',d:`Bifurcation থেকে প্রায় ৫ সেমি দূরে; ascending শাখা (apico-posterior, anterior) আর descending শাখা (superior ও inferior lingular)। Lingular bronchus lateral/medial না হয়ে upper/lower, কারণ heart ফুলে থাকায় জায়গা নেই। ${DT('49–50')}`},
 8:{c:'#a77fd6',t:'Left lower lobe bronchus',b:'',d:`নিচে-পাশে-পেছনে গিয়ে সাধারণত চারটা tertiary: apical, anterior basal, lateral basal, posterior basal (medial basal প্রায়ই থাকে না)। ${DT('50')}`},
 9:{c:'#c9d6de',t:'Segmental (tertiary) ও ছোট bronchi',b:'',d:`Lobar bronchus ভাগ হয়ে tertiary (segmental) bronchus; প্রতিটা একটা broncho-pulmonary segment-এ বাতাস দেয়। একটা segmental bronchus ৬–১৮ বার ভাগ হয়ে ৫০–৭০টা respiratory bronchiole। "Segments" mode-এ রঙে দেখুন। ${DT('48–49')}`}
};
const SEGN={1:'Apical (Rt upper)',2:'Posterior (Rt upper)',3:'Anterior (Rt upper)',4:'Lateral (Rt middle)',5:'Medial (Rt middle)',6:'Apical (Rt lower)',7:'Medial basal (cardiac)',8:'Anterior basal (Rt)',9:'Lateral basal (Rt)',10:'Posterior basal (Rt)',
 11:'Apico-posterior (Lt upper)',12:'Anterior (Lt upper)',13:'Superior lingular',14:'Inferior lingular',15:'Apical (Lt lower)',16:'Anterior basal (Lt)',17:'Lateral basal (Lt)',18:'Posterior basal (Lt)'};
const SEGC={1:'#e63946',2:'#f4a261',3:'#ffd166',4:'#06d6a0',5:'#2a9d8f',6:'#118ab2',7:'#8ecae6',8:'#3a86ff',9:'#8338ec',10:'#023e8a',11:'#ff006e',12:'#fb8500',13:'#ffbe0b',14:'#80b918',15:'#00b4d8',16:'#90e0ef',17:'#7209b7',18:'#3c096c'};
const TERR={};for(const k in SEGN)TERR[k]={c:SEGC[k],t:SEGN[k]+' segmental bronchus',b:'',d:`এই segment-এর tertiary bronchus আর তার শাখা। ${DT('48–50')}`,l:['কোন segment-এ: স্কিম্যাটিক (lobe-এর আকার থেকে), Lungs পেজের মতো একই ভাগ']};
const REG={};
const STR={
 ring:{t:'Tracheal cartilage rings',b:'',d:`১৬–২০টা C-আকৃতির hyaline cartilage, পেছনে ফাঁকা; ফাঁকটা fibro-elastic membrane আর trachealis muscle দিয়ে বন্ধ, যাতে গেলার সময় পেছনের oesophagus ফুলতে পারে। শ্বাস নেওয়ার সময় ভেতরের চাপ কম, তাই শক্ত ring নলকে খোলা রাখে। ১ম ring সবচেয়ে চওড়া; শেষ ring-এর ত্রিভুজাকার প্রক্রিয়া (carina) নিচে-পেছনে বাঁকা। ${DT('47')}`,l:[SCH,'রিংগুলো trachea-র নিজের মাপে বসানো']},
 eso:{t:'Oesophagus',b:'',d:`Trachea-র পেছনে, vertebral column থেকে আলাদা করে; দুইয়ের মাঝের tracheo-oesophageal groove-এ recurrent laryngeal nerve। ${DT('46')}`},
 aoArch:{t:'Arch of aorta',b:'',d:`Bifurcation-এর কাছে trachea-র সামনে-বাঁয়ে; এর চাপে trachea-র শেষ অংশ একটু ডানে সরে। Left principal bronchus-এর উপর দিয়ে বাঁকে। ${DT('46, 49')}`},
 aoAsc:{t:'Ascending aorta',b:'',d:''},aoDesc:{t:'Descending thoracic aorta',b:'',d:`Left principal bronchus-এর পেছনে।`},
 bct:{t:'Brachiocephalic trunk',b:'',d:`প্রথমে trachea-র সামনে, উপরে উঠে ডান পাশে চলে আসে। ${DT('46')}`},lcca:{t:'Left common carotid artery',b:'',d:`প্রথমে trachea-র সামনে, উপরে উঠে বাঁ পাশে। ${DT('46')}`},rcca:{t:'Right common carotid artery',b:'',d:''},
 lsca:{t:'Left subclavian artery',b:'',d:`Trachea-র বাঁ পাশে। ${DT('46')}`},rsca:{t:'Right subclavian artery',b:'',d:''},
 lbcv:{t:'Left brachiocephalic vein',b:'',d:`Trachea-র উপরের অর্ধেকের সামনে দিয়ে আড়াআড়ি যায়; শিশুদের suprasternal notch-এর উপরে উঠতে পারে, তাই low tracheostomy শিশুদের বিপজ্জনক। ${DT('46–47')}`},
 rbcv:{t:'Right brachiocephalic vein',b:'',d:''},svc:{t:'Superior vena cava',b:'',d:`Trachea-র ডান পাশে। ${DT('46')}`},
 pa:{t:'Pulmonary artery',b:'',d:`Right root-এ principal bronchus-এর সামনে দিয়ে আড়াআড়ি; left-এ bronchus-এর উপরে। ${DT('48–49')}`},pv:{t:'Pulmonary vein',b:'',d:''},heart:{t:'Heart',b:'',d:''},
 thyroidCart:{t:'Thyroid cartilage (larynx)',b:'',d:`Trachea larynx-এর ধারাবাহিকতা; cricoid cartilage এর ঠিক নিচে (স্ক্যানে cricoid আলাদা নেই)। ${DT('46')}`},
 rSternothy:{t:'Sternothyroid (right)',b:'',d:`Trachea-র সামনে sternohyoid আর sternothyroid ঢেকে রাখে। ${DT('46')}`},lSternothy:{t:'Sternothyroid (left)',b:'',d:`${DT('46')}`},
 sternum:{t:'Sternum (manubrium ও body)',b:'',d:`Manubrium আর body-র জোড়া = sternal angle; এই লেভেলে trachea ভাগ হয়। ${DT('46')}`},lung:{t:'Lung',b:'',d:''}
};
for(const k of ['C5','C6','C7','T1','T2','T3','T4','T5','T6','T7'])STR[k]={t:k+' vertebra',b:'',d:''};
const SPC={
 carina:{t:'Carina',d:`শেষ ring-এর ত্রিভুজাকার প্রক্রিয়া, ভেতরে bifurcation-এ একটা উঁচু ridge। Bronchoscopy-তে গাইড। এখানকার mucous membrane সবচেয়ে সংবেদনশীল: cough reflex, aspirated foreign body (যেমন চিনাবাদাম) বের করার শেষ প্রতিরক্ষা। Sub-carinal angle ৯০°-এর বেশি হলে sub-carinal node বড় হওয়ার সন্দেহ। ${DT('47, 51')}`,ty:'part',l:[`এই স্ক্যানে carina ${M.carinaLevel}-এর লেভেলে`]},
 trachTop:{t:'Beginning of trachea (cricoid-এর নিচে)',d:`Cricoid cartilage-এর নিচের কিনারা, C6-এর লেভেলে। ${DT('46')}`,ty:'part',l:[`এই স্ক্যানে উপরের মাথা ${M.topLevel}-এর লেভেলে`]},
 trachAnt:{t:'Anterior surface of trachea',d:`সামনে: চামড়া, fascia, jugular venous arch, sternohyoid ও sternothyroid; ২য়–৪র্থ ring-এর উপর thyroid-এর isthmus; isthmus-এর নিচে pretracheal fascia, inferior thyroid veins, কখনো thyroidea ima artery আর thymus-এর অবশেষ; thorax-এ manubrium, left brachiocephalic vein, brachiocephalic trunk আর left common carotid, bifurcation-এ deep cardiac plexus ও arch of aorta। ${DT('46')}`,ty:'surf'},
 trachPost:{t:'Posterior surface (trachealis)',d:`পেছনে ring নেই: fibro-elastic membrane আর trachealis muscle; পেছনে oesophagus। ${DT('46–47')}`,ty:'surf'},
 trachealis:{t:'Trachealis muscle',d:`Ring-এর পেছনের ফাঁক বন্ধ করা অনৈচ্ছিক পেশি; vagus আর recurrent laryngeal nerve থেকে motor সরবরাহ। ${DT('47')}`,ty:'part',l:[SCH]},
 sternalAngle:{t:'Sternal angle (bifurcation-এর লেভেল)',d:`Manubrium আর body-র জোড়া; এর লেভেলে trachea ভাগ হয়। ${DT('46')}`,ty:'node',l:[`এই স্ক্যানে carina sternal angle থেকে ${M.carinaVsSternalAngle} সেমি উপরে`]},
 principalR:{t:'Right principal bronchus',get d(){return PARTS[2].d},ty:'part'},principalL:{t:'Left principal bronchus',get d(){return PARTS[3].d},ty:'part'},
 lobar_RU:{t:'Right upper lobe (eparterial) bronchus',get d(){return PARTS[4].d},ty:'part'},lobar_RM:{t:'Right middle lobe bronchus',get d(){return PARTS[5].d},ty:'part'},lobar_RL:{t:'Right lower lobe bronchus',get d(){return PARTS[6].d},ty:'part'},
 lobar_LU:{t:'Left upper lobe bronchus',get d(){return PARTS[7].d},ty:'part'},lobar_LL:{t:'Left lower lobe bronchus',get d(){return PARTS[8].d},ty:'part'}
};
function lmInfo(id){
 if(SPC[id]){const o=SPC[id];const inf={t:o.t,b:'',d:o.d,l:o.l||[SCAN]};return {inf,lab:o.t,kind:'lm',type:o.ty,quiz:true,quizName:o.t,show:'lm'}}
 const m=id.match(/^s~(\d+)$/);if(m){const o=TERR[m[1]];return {inf:o,lab:o.t,kind:'lm',type:'part',quiz:false,show:'seg'}}
 return {inf:{t:id,b:'',d:''},lab:id,kind:'lm',type:'part',quiz:false,show:'none'};
}
const STYLE={ring:['#e8f1f4',1],eso:['#d79a8e',1],heart:['#c97a6d',1],pa:['#6c63d9',1],pvein:['#e8738a',1],lung:['#f0b8b2',.14]};
const VIEWS={ant:[0,0,1],post:[0,0,-1],rlat:[-1,0,.0001],llat:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const CUTS={
 tr:{t:'Transverse (bifurcation-এর উপরে)',n:[0,-1,0],o:-40,view:[[0,1,.25],380],card:{t:'Transverse কাটা',b:'উপর থেকে',d:'Trachea-র চারপাশের সম্পর্ক: সামনে great vessel, পেছনে oesophagus, দুই পাশে lung।'}},
 cor:{t:'Coronal',n:[0,0,-1],o:-6,view:[[0,.1,1],420],card:{t:'Coronal কাটা',b:'সামনের অংশ সরানো',d:'Trachea আর দুই bronchus-এর ভেতরের lumen; carina-র ridge।'}}
};
const B={
 id:'trachea',startMode:'parts',PARTS,REG,TERR,STR,STYLE,views:VIEWS,target:[0,0,0],dist:420,cuts:CUTS,minDist:50,maxDist:1100,
 baseColor:'#dfe9ee',boneRough:.5,cutCap:'#c9a6a0',boneLook:{f:.35,b:.25,m:.1,tr:.25,cc:.45,sh:.25},peelBone:true,
 partLabel:'Part',terrLabel:'Segment',
 MK:[['part','Structure'],['surf','Surface'],['node','Level ও সম্পর্ক']],
 mkNote:'বিন্দুতে বা নলের গায়ে ট্যাপ করলে নাম আসে। দুইবার ট্যাপ বা চেপে ধরলে সরে যায়।',
 modes:{
  parts:{paint:'parts',layers:{ring:1},view:['ant',420],card:{t:'Trachea আর bronchial tree',b:'রঙে ভাগ',d:`Trachea → দুই principal bronchus → lobar (secondary) → segmental (tertiary) → … → bronchiole। ডানে ৩টা lobar (upper/eparterial, middle, lower), বাঁয়ে ২টা। Right bronchus ছোট-চওড়া-খাড়া, left লম্বা-সরু-তির্যক। ${DT('46–50')}`,l:['সাদা C-রিং স্কিম্যাটিক; বাকি সব স্ক্যানের']}},
  lm:{paint:'parts',layers:{ring:1,vert:1},view:['rlat',460],card:{t:'Level ও landmark',b:'Vertebra আর sternal angle-এর সাথে',d:`শুরু C6, bifurcation sternal angle-এ (T4–T5 disc)। Carina, trachealis, eparterial bronchus। ${DT('46–47')}`,l:[`স্ক্যান: শুরু ${M.topLevel}, carina ${M.carinaLevel}`]}},
  seg:{paint:'terr',view:['ant',460],card:{t:'Segmental bronchi',b:'কোন শাখা কোন segment-এ',d:`ডানে ১০টা, বাঁয়ে ৮–৯টা tertiary bronchus। Postural drainage-এ এই দিকগুলো জানা দরকার। ${DT('48–50')}`,l:[SCH]}},
  rel:{paint:'parts',layers:{ring:1,organ:1,great:1,muscle:1,vert:1},view:['ant',520],card:{t:'চারপাশের সম্পর্ক',b:'Neck ও thorax',d:`সামনে great vessel আর left brachiocephalic vein, পেছনে oesophagus, পাশে lung, pleura, vagus; bifurcation-এ arch of aorta। যেকোনো কিছু দুইবার ট্যাপে সরান। ${DT('46')}`,l:['স্ক্যানে thyroid gland, cricoid, recurrent laryngeal nerve নেই']}},
  lungs:{paint:'parts',layers:{lung:1,great:1},view:['ant',600],card:{t:'Lung-এর ভেতরে bronchial tree',b:'স্বচ্ছ lung',d:`প্রতিটা lobar bronchus তার lobe-এ, segmental bronchus তার segment-এ।`}},
  cut:{layers:{ring:1,organ:1,great:1},clipLayers:['organ','great','ring'],cuts:['tr','cor'],markers:true,view:null},
  quiz:{paint:'parts'}
 },
 relLegend:[],relLabels:[],muscleLabels:[],mkLift:2
};
B.lmInfo=lmInfo;
window.BONE=B;
}
