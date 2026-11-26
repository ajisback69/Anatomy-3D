/* Lungs আর pleura: সব লেখা ও কনফিগারেশন।
   লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Part-I (Thorax), Chapter 2: The Pleura ও The Lungs, বইয়ের পৃ. 28–42।
   PARTS = lobe (1–5), REG = surface ও impression (pipeline/lungs.py মেপে বের করে), TERR = broncho-pulmonary segment (স্কিম্যাটিক)।
   নিয়ম: medical term সবসময় English। */
{
const D=window.DATA,M=D.meas;
const SCAN='স্ক্যান থেকে মাপা (প্রতিবেশী অঙ্গের সাথে ছোঁয়া)',SCH='স্কিম্যাটিক: স্ক্যানে আলাদা করে নেই, বইয়ের বর্ণনা অনুযায়ী বসানো';
const DT=p=>`Datta I, পৃ. ${p}`;

const PARTS={
 1:{c:'#e7a29b',t:'Upper lobe of right lung',b:'',d:`Horizontal fissure-এর উপরে আর oblique fissure-এর সামনে-উপরে। ৩টা segment: apical, posterior, anterior। ${DT('35, 39')}`,l:[`এই স্ক্যানে আয়তন প্রায় ${M.vol.RU} ml`]},
 2:{c:'#9fc9a6',t:'Middle lobe of right lung',b:'',d:`শুধু right lung-এ: horizontal fissure (উপরে) আর oblique fissure (নিচে-পেছনে)-এর মাঝে, সামনে কীলকের মতো। ২টা segment: lateral, medial। Left lung-এর lingula এর সমতুল্য। ${DT('35–36, 39')}`,l:[`এই স্ক্যানে আয়তন প্রায় ${M.vol.RM} ml`]},
 3:{c:'#8fb0dd',t:'Lower lobe of right lung',b:'',d:`Oblique fissure-এর নিচে-পেছনে; base-এর বেশিরভাগ আর posterior border। ৫টা segment: apical (superior), medial basal (cardiac), anterior basal, lateral basal, posterior basal। ${DT('35, 39')}`,l:[`এই স্ক্যানে আয়তন প্রায় ${M.vol.RL} ml`]},
 4:{c:'#e9b384',t:'Upper lobe of left lung',b:'',d:`Oblique fissure-এর সামনে-উপরে; সামনের কিনারায় cardiac notch আর তার নিচে lingula। ৪টা segment: apico-posterior, anterior, superior lingular, inferior lingular। ${DT('35, 39')}`,l:[`এই স্ক্যানে আয়তন প্রায় ${M.vol.LU} ml`]},
 5:{c:'#a8a3d9',t:'Lower lobe of left lung',b:'',d:`Oblique fissure-এর নিচে-পেছনে। ৪টা segment: apical, anterior basal, lateral basal, posterior basal (medial basal সাধারণত থাকে না)। ${DT('39')}`,l:[`এই স্ক্যানে আয়তন প্রায় ${M.vol.LL} ml`]}
};
const REG={
 1:{c:'#f6a98e',t:'Costal surface',b:'',d:`উত্তল, মসৃণ; costal pleura আর endothoracic fascia দিয়ে আলাদা হয়ে thoracic wall-এর সাথে। Rib আর costal cartilage-এর ছাপ পড়ে। Mid-clavicular line-এ উপরের ৬টা, mid-axillary-তে ৮টা, scapular line-এ ১০টা rib-এর সম্পর্ক। ${DT('34')}`},
 2:{c:'#c98bd6',t:'Mediastinal part of medial surface',b:'',d:`Medial surface-এর সামনের অংশ; এখানে hilum আর নানা impression ও groove, দুই পাশে আলাদা। ${DT('34–35')}`},
 3:{c:'#8fb3f2',t:'Base (diaphragmatic surface)',b:'',d:`অবতল, অর্ধচন্দ্রাকার; diaphragm-এর গম্বুজের উপর বসে। Right lung-এর base বেশি অবতল, নিচে liver থাকায়। Diaphragm-এর নিচে: ডানে right lobe of liver; বাঁয়ে left lobe of liver, fundus of stomach আর spleen। ${DT('34')}`},
 4:{c:'#ffd76a',t:'Apex',b:'',d:`বিন্দু নয়, ১ম rib-এর ছাপের উপরের এলাকা; root of neck-এ উঠে থাকে। চূড়া ১ম costal cartilage থেকে ৩–৪ সেমি আর clavicle-এর medial প্রান্ত থেকে ২.৫ সেমি উপরে, কিন্তু ১ম rib-এর neck-এর উপরে যায় না। Cervical pleura আর suprapleural membrane (Sibson's fascia) দিয়ে ঢাকা। ${DT('32–33')}`,l:[`এই স্ক্যানে: ১ম costal cartilage থেকে ডানে ${M.apexAboveCC1_R} সেমি, বাঁয়ে ${M.apexAboveCC1_L} সেমি উপরে (বই: ৩–৪ সেমি)`,`Clavicle-এর medial প্রান্ত থেকে ${M.apexAboveClav_R} / ${M.apexAboveClav_L} সেমি উপরে (বই: ২.৫ সেমি)`]},
 5:{c:'#d8b77a',t:'Vertebral part of medial surface',b:'',d:`Medial surface-এর পেছনের অংশ; উপরের ১০টা thoracic vertebra-র body আর disc, posterior intercostal vessels, নিচের দিকে greater আর lesser splanchnic nerve-এর সাথে সম্পর্ক। ${DT('34')}`},
 6:{c:'#7a3e8f',t:'Hilum',b:'',d:`ত্রিভুজাকার, pleura-ছাড়া জায়গা: এখান দিয়ে lung root-এর structure ঢোকে-বেরোয়। নিচে pulmonary ligament-এ মেশে। ডানে উপর থেকে নিচে: upper lobe (eparterial) bronchus, pulmonary artery, right principal (hyparterial) bronchus, lower pulmonary vein। বাঁয়ে: pulmonary artery, left principal bronchus, lower pulmonary vein। দুই পাশে সামনে থেকে পেছনে: upper pulmonary vein, pulmonary artery, bronchus। ${DT('29, 34–35')}`,l:['এখানে স্ক্যানের bronchus, pulmonary artery আর pulmonary vein ফুসফুসে ঢোকে; "Root" মোডে দেখুন']},
 7:{c:'#d0534a',t:'Cardiac impression',b:'',d:`Hilum আর pulmonary ligament-এর সামনে অবতল ছাপ; fibrous pericardium-এ ঢাকা heart এখানে বসে। ডানে অগভীর: right auricle, right atrium, right ventricle-এর অংশ। বাঁয়ে গভীর (heart বাঁয়ে বেশি ফোলা): left ventricle আর left auricle, right ventricle-এর অংশ। Phrenic nerve আর pericardiacophrenic vessels pericardium আর pleura-র মাঝ দিয়ে নামে। ${DT('34–35')}`},
 9:{c:'#ffffff',t:'Oblique fissure (lobe-এর ছোঁয়ার পৃষ্ঠ)',b:'',d:`দুই lung-এই। Hilum-এর উপরে-পেছনে mediastinal surface থেকে শুরু, T4–T5 spine থেকে প্রায় ২.৫ সেমি পাশে posterior border কাটে, তারপর costal surface বরাবর নেমে mid-axillary line-এ ৫ম intercostal space, ৬ষ্ঠ costochondral junction-এ (মধ্যরেখা থেকে ~৭.৫ সেমি) inferior border কাটে। বাঁয়েরটা বেশি খাড়া। গুরুত্ব: শ্বাস নেওয়ার সময় উপরের অংশ সামনে-পাশে আর নিচের অংশ নিচে-পেছনে সরতে পারে। ${DT('35–36')}`,l:['সাদা পৃষ্ঠ = দুই lobe যেখানে ছোঁয় (স্ক্যান থেকে)। দুইবার ট্যাপে একটা lobe সরিয়ে দেখুন']},
 10:{c:'#fff3b0',t:'Horizontal fissure',b:'',d:`শুধু right lung-এ: mid-axillary line-এ oblique fissure থেকে সোজা সামনে ৪র্থ costal cartilage পর্যন্ত; upper আর middle lobe আলাদা করে। ${DT('36')}`},
 11:{c:'#4a78e0',t:'Groove for superior vena cava',b:'',d:`Cardiac impression-এর উপরের অংশ থেকে খাড়া উপরে ওঠা groove; নিচে SVC, উপরে right brachiocephalic vein। Right phrenic nerve এদের ডান পাশ দিয়ে চলে। ${DT('35')}`},
 12:{c:'#7d9fef',t:'Groove for right brachiocephalic vein',b:'',d:`SVC-এর groove-এর উপরের অংশ, apex-এর দিকে। ${DT('33, 35')}`},
 13:{c:'#e86a5c',t:'Area for brachiocephalic trunk',b:'',d:`Arch of azygos-এর groove-এর উপরে, right brachiocephalic vein-এর পেছনে; trunk ভাগ হওয়ার আগে এখানে ছোঁয়। ${DT('35')}`},
 14:{c:'#b9c4cc',t:'Groove for trachea',b:'',d:`Brachiocephalic trunk-এর পেছনে অগভীর খাড়া groove; trachea-র ডান পাশ, সাথে right vagus nerve। ${DT('35')}`},
 15:{c:'#d79a8e',t:'Groove/impression for oesophagus',b:'',d:`ডানে: hilum আর pulmonary ligament-এর পেছনে খাড়া groove, oesophagus-এর ডান কিনারার জন্য; উপরে-নিচে বাড়ে না কারণ oesophagus দুইবার বাঁয়ে সরে। বাঁয়ে: দুই জায়গায় oesophagus-এর বাম কিনারা ছোঁয়: aortic arch-এর উপরে, আর নিচে descending aorta ও pulmonary ligament-এর মাঝে। ${DT('35')}`},
 16:{c:'#5a6fd1',t:'Groove for inferior vena cava',b:'',d:`Cardiac impression-এর পেছন-নিচের কোণে, right pulmonary ligament-এর সামনে অগভীর groove; IVC-এর শেষ অংশ, সাথে right phrenic nerve। ${DT('34')}`},
 17:{c:'#c0392b',t:'Groove for arch of aorta',b:'',d:`Hilum-এর উপর দিয়ে পেছনে বাঁকা স্পষ্ট groove। Arch আর lung-এর মাঝে: left phrenic nerve, left vagus nerve, cardiac branch, left superior intercostal vein। ${DT('35')}`},
 18:{c:'#e0443e',t:'Groove for descending thoracic aorta',b:'',d:`Hilum আর pulmonary ligament-এর পেছনে খাড়া groove, arch-এর groove-এর ধারাবাহিকতা। ${DT('35')}`},
 19:{c:'#f08a7a',t:'Groove for left subclavian artery',b:'',d:`Arch-এর groove থেকে apex-এর দিকে খাড়া groove। ${DT('35')}`},
 20:{c:'#6f8fe8',t:'Area for left brachiocephalic vein',b:'',d:`Left subclavian artery-র সামনে-উপরে, apex-এর কাছে। ${DT('33')}`},
 21:{c:'#6c63d9',t:'Groove for pulmonary trunk',b:'',d:`Cardiac impression-এর উপরের অংশ থেকে hilum-এর সামনে দিয়ে উপরে ওঠা groove। ${DT('35')}`},
 22:{c:'#f26b5b',t:'Groove for right subclavian artery',b:'',d:`Apex-এর সামনে subclavian artery উপরে-পাশে বাঁকা হয়ে groove তৈরি করে; তার নিচে-সামনে subclavian vein। ${DT('33')}`}
};
const TERR={
 1:{c:'#e63946',t:'Apical segment (right upper lobe)'},2:{c:'#f4a261',t:'Posterior segment (right upper lobe)'},3:{c:'#ffd166',t:'Anterior segment (right upper lobe)'},
 4:{c:'#06d6a0',t:'Lateral segment (right middle lobe)'},5:{c:'#2a9d8f',t:'Medial segment (right middle lobe)'},
 6:{c:'#118ab2',t:'Apical (superior) segment (right lower lobe)'},7:{c:'#8ecae6',t:'Medial basal (cardiac) segment'},8:{c:'#3a86ff',t:'Anterior basal segment (right)'},9:{c:'#8338ec',t:'Lateral basal segment (right)'},10:{c:'#023e8a',t:'Posterior basal segment (right)'},
 11:{c:'#ff006e',t:'Apico-posterior segment (left upper lobe)'},12:{c:'#fb8500',t:'Anterior segment (left upper lobe)'},13:{c:'#ffbe0b',t:'Superior lingular segment'},14:{c:'#80b918',t:'Inferior lingular segment'},
 15:{c:'#00b4d8',t:'Apical segment (left lower lobe)'},16:{c:'#90e0ef',t:'Anterior basal segment (left)'},17:{c:'#7209b7',t:'Lateral basal segment (left)'},18:{c:'#3c096c',t:'Posterior basal segment (left)'}
};
for(const k in TERR){const o=TERR[k];o.b='';o.d=`Broncho-pulmonary segment: একটা tertiary (segmental) bronchus যতটুকু lung-এ বাতাস দেয়। কীলকাকার, base পৃষ্ঠের দিকে; পাশের segment থেকে intersegmental septum দিয়ে আলাদা, যেখানে pulmonary vein-এর intersegmental শাখা চলে। Pulmonary artery-র শাখা segmental (bronchus-এর সাথে)। ${DT('39')}`;o.l=['সীমানা স্কিম্যাটিক: lobe-এর আকার থেকে আনুমানিক, স্ক্যানে segment নেই']}
const STR={
 heart:{t:'Heart (fibrous pericardium-এ ঢাকা)',b:'',d:`Cardiac impression তৈরি করে। ${DT('34–35')}`},
 aoAsc:{t:'Ascending aorta',b:'',d:''},aoArch:{t:'Arch of aorta',b:'',d:`Left lung-এ hilum-এর উপর দিয়ে groove। ${DT('35')}`},aoDesc:{t:'Descending thoracic aorta',b:'',d:`Left lung-এ hilum-এর পেছনে খাড়া groove। ${DT('35')}`},
 svc:{t:'Superior vena cava',b:'',d:`Right lung-এ groove। ${DT('35')}`},ivc:{t:'Inferior vena cava',b:'',d:`Right lung-এ cardiac impression-এর পেছন-নিচে groove। ${DT('34')}`},
 rbcv:{t:'Right brachiocephalic vein',b:'',d:''},lbcv:{t:'Left brachiocephalic vein',b:'',d:''},bct:{t:'Brachiocephalic trunk',b:'',d:''},
 rsca:{t:'Right subclavian artery',b:'',d:`Apex-এর সামনে উপরে-পাশে বাঁকা হয়ে groove। ${DT('33')}`},lsca:{t:'Left subclavian artery',b:'',d:''},rcca:{t:'Right common carotid artery',b:'',d:''},lcca:{t:'Left common carotid artery',b:'',d:''},
 rscv:{t:'Right subclavian vein',b:'',d:''},lscv:{t:'Left subclavian vein',b:'',d:''},
 eso:{t:'Oesophagus',b:'',d:`ডান lung-এ একবার, বাম lung-এ দুইবার সম্পর্ক। ${DT('35')}`},
 trachea:{t:'Trachea',b:'',d:`T4–T5-এর কাছে দুই principal bronchus-এ ভাগ হয়। ${DT('46')}`},
 bronchus:{t:'Principal bronchus ও তার শাখা',b:'',d:`Principal → lobar (secondary) → segmental (tertiary) → … → bronchiole। ডান lung-এ upper lobe bronchus pulmonary artery-র উপরে (eparterial), বাকিটা নিচে (hyparterial)। ${DT('29, 36–37, 39')}`},
 pa:{t:'Pulmonary artery',b:'',d:`প্রতিটা lung-এ একটা; deoxygenated রক্ত আনে। ভেতরে bronchus-এর শাখা ধরে segmental। Respiratory part (lung unit)-এ পুষ্টিও দেয় (vasa privata)। ${DT('39–40')}`},
 pv:{t:'Pulmonary vein',b:'',d:`প্রতিটা lung-এ দুটো (upper, lower), সরাসরি left atrium-এ। ভেতরে intersegmental। Right upper vein upper আর middle lobe থেকে, left upper vein upper lobe থেকে। ${DT('40')}`},
 dia:{t:'Diaphragm',b:'',d:`Base এর উপর বসে।`},thymus:{t:'Thymus',b:'',d:''},
 rib1:{t:'1st rib',b:'',d:''},rib2:{t:'2nd rib',b:'',d:''},rib3:{t:'3rd rib',b:'',d:''},rib4:{t:'4th rib',b:'',d:''},rib5:{t:'5th rib',b:'',d:''},rib6:{t:'6th rib',b:'',d:''},
 rib7:{t:'7th rib',b:'',d:''},rib8:{t:'8th rib',b:'',d:''},rib9:{t:'9th rib',b:'',d:''},rib10:{t:'10th rib',b:'',d:''},rib11:{t:'11th rib',b:'',d:''},rib12:{t:'12th rib',b:'',d:''},
 cc:{t:'Costal cartilage',b:'',d:''},clavicle:{t:'Clavicle',b:'',d:''},sternum:{t:'Sternum',b:'',d:''},
 pleura:{t:'Parietal pleura (স্কিম্যাটিক)',b:'',d:`Pleura একটা বন্ধ serous থলি; lung ভেতর দিক থেকে এতে ঢুকে আছে। Visceral layer lung-এর গায়ে লেগে থাকে (hilum আর pulmonary ligament ছাড়া), parietal layer-এর চার অংশ: costal, diaphragmatic, cervical, mediastinal। দুই layer-এর মাঝে সামান্য fluid, চাপ প্রায় −১০ mm Hg। নিচে pleura lung-এর চেয়ে দুই rib নিচে নামে: costodiaphragmatic recess। ${DT('28–31')}`,l:[SCH,'এখানে lung থেকে কয়েক মিমি ফুলিয়ে আর নিচে-পাশে recess বাড়িয়ে আঁকা']}
};
const BD={bdAntR:'antBorderR',bdAntL:'antBorderL',bdPostR:'postBorderR',bdPostL:'postBorderL',bdInfR:'infBorderR',bdInfL:'infBorderL'};
for(const k in BD)STR[k]={get t(){return SPC[BD[k]].t},b:'',get d(){return SPC[BD[k]].d},l:['রেখাটা স্ক্যানে মাপা: যেখানে দুই surface মেলে']};
STR.fisOblR={t:'Oblique fissure (right lung)',b:'',get d(){return REG[9].d},l:['স্ক্যানে মাপা: upper/middle আর lower lobe যেখানে মেলে']};
STR.fisOblL={t:'Oblique fissure (left lung)',b:'',get d(){return REG[9].d},l:['স্ক্যানে মাপা']};
STR.fisHorR={t:'Horizontal fissure',b:'',get d(){return REG[10].d},l:['স্ক্যানে মাপা: upper আর middle lobe যেখানে মেলে']};
for(let i=1;i<=12;i++)STR['T'+i]={t:`T${i} vertebra`,b:'',d:''};
const MK=[['part','Border, apex বা structure'],['surf','Surface বা impression'],['groove','Groove'],['open','Hilum বা opening'],['node','Surface marking বা root structure']];
const SURFTY={1:'surf',2:'surf',3:'surf',4:'part',5:'surf',6:'open',7:'surf',9:'groove',10:'groove'};
const LOBE={RU:'right upper lobe',RM:'right middle lobe',RL:'right lower lobe',LU:'left upper lobe',LL:'left lower lobe'};
const SPC={
 apexR:{t:'Apex of right lung',d:REG[4].d,ty:'part'},apexL:{t:'Apex of left lung',d:REG[4].d,ty:'part'},
 cardNotch:{t:'Cardiac notch',d:`Left lung-এর anterior border ৪র্থ costal cartilage পর্যন্ত pleura-র reflexion মেনে চলে, তারপর ৩.৫ সেমি পাশে সরে আবার নিচে-মধ্যে এসে ৬ষ্ঠ costal cartilage-এ (মধ্যরেখা থেকে ~৪ সেমি) পৌঁছায়: এই খাঁজই cardiac notch। ${DT('35')}`,ty:'part'},
 lingula:{t:'Lingula',d:`Cardiac notch-এর নিচে left upper lobe-এর জিভের মতো অংশ; right middle lobe-এর সমতুল্য। ${DT('36')}`,ty:'part'},
 antBorderR:{t:'Anterior border of right lung',d:`পাতলা, কারণ thoracic wall আর pericardium-এর মাঝে costomediastinal recess-এ থাকে। Right lung-এর anterior border costomediastinal reflexion মেনে চলে। ${DT('35')}`,ty:'part'},
 antBorderL:{t:'Anterior border of left lung',d:`পাতলা; ৪র্থ costal cartilage-এর নিচে cardiac notch। ${DT('35')}`,ty:'part'},
 postBorderR:{t:'Posterior border of right lung',d:`পুরু ও গোল, কারণ paravertebral gutter-এ থাকে; উপরের ১০টা rib-এর head, sympathetic trunk আর splanchnic nerve-এর শুরুর সাথে সম্পর্ক। ${DT('35')}`,ty:'part'},
 postBorderL:{t:'Posterior border of left lung',d:`পুরু ও গোল, paravertebral gutter-এ। ${DT('35')}`,ty:'part'},
 infBorderR:{t:'Inferior border of right lung',d:`Base-কে costal আর medial surface থেকে আলাদা করে; পাশে-পেছনে পাতলা কারণ costodiaphragmatic recess-এ ঢোকে। ${DT('35')}`,ty:'part'},
 infBorderL:{t:'Inferior border of left lung',d:`Base-এর চারপাশের কিনারা; পাশে-পেছনে পাতলা। ${DT('35')}`,ty:'part'}
};
const ROOTN={bronchus:'Principal bronchus',pa:'Pulmonary artery',pv:'Pulmonary vein'};
const LINE={MCL:'mid-clavicular line',MAL:'mid-axillary line',SCL:'scapular line'};
function lmInfo(id){
 const sp=id.split('~');
 if(sp[0]==='r'){const o=REG[sp[1]];if(!o)return null;const inf={...o,t:o.t+' ('+LOBE[sp[2]]+')',l:[...(o.l||[]),SCAN]};return {inf,lab:inf.t,kind:'lm',type:SURFTY[sp[1]]||'groove',quiz:true,quizName:inf.t,show:sp[2][0]==='R'?'faceR':'faceL'}}
 if(sp[0]==='s'){const o=TERR[sp[1]];return {inf:o,lab:o.t,kind:'lm',type:'surf',quiz:false,show:'seg'}}
 if(SPC[id]){const o=SPC[id];const inf={t:o.t,b:'',d:o.d,l:[SCAN]};return {inf,lab:o.t,kind:'lm',type:o.ty,quiz:true,quizName:o.t,show:'lm'}}
 let m=id.match(/^root_(\w+)_([RL])$/);
 if(m){const s=STR[m[1]];const t=ROOTN[m[1]]+(m[2]==='R'?' (right root)':' (left root)');return {inf:{t,b:'',d:s.d,l:['স্ক্যানের মেশ যেখানে hilum-এ ঢোকে']},lab:t,kind:'lm',type:'node',quiz:true,quizName:t,show:'root'}}
 m=id.match(/^sm_(lung|pleura)_(MCL|MAL|SCL)_([RL])$/);
 if(m){const sv=(D.surf||[]).find(x=>x.side===m[3]&&x.line===m[2]&&x.which===m[1]);const rn=sv?sv.rib:'';
  const t=(m[1]==='lung'?'Lower border of lung':'Lower limit of pleura')+` · ${rn}th rib · ${LINE[m[2]]} (${m[3]==='R'?'right':'left'})`;
  return {inf:{t,b:'',d:`Datta: lung-এর নিচের কিনারা mid-clavicular, mid-axillary আর scapular line-এ যথাক্রমে ৬, ৮ আর ১০ নম্বর rib; pleura-র নিচের সীমা ৮, ১০ আর ১২ নম্বর rib। দুইয়ের মাঝের ফাঁক costodiaphragmatic recess, mid-axillary line-এ সবচেয়ে চওড়া (~৫ সেমি)। ${DT('31')}`,l:['বিন্দুগুলো এই মানুষের নিজের rib আর clavicle/scapula মেপে বসানো']},lab:t,kind:'lm',type:'node',quiz:true,quizName:t,show:'surf'}}
 return null;
}
const STYLE={border:['#ffd43b',1],heart:['#c97a6d',1],eso:['#d79a8e',1],trachea:['#cfd6dc',1],pa:['#6c63d9',1],pvein:['#e8738a',1],pleura:['#9fd0e8',.16],thymus:['#e7a8c9',.8]};
const VIEWS={ant:[0,0,1],post:[0,0,-1],rlat:[-1,0,.0001],llat:[1,0,.0001],rmed:[1,0,.0001],lmed:[-1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const CUTS={
 cor:{t:'Coronal (hilum দিয়ে)',n:[0,0,-1],o:-10,view:[[0,.1,1],560],card:{t:'Coronal কাটা',b:'সামনের অংশ সরানো',d:'Hilum-এর লেভেলে সামনে থেকে পেছনে; ভেতরে lobe-এর সীমানা (fissure) আর lung root দেখুন। স্লাইডারে গভীরতা বদলান।'}},
 tr:{t:'Transverse (hilum-এর লেভেলে)',n:[0,-1,0],o:-10,view:[[0,1,.2],560],card:{t:'Transverse কাটা',b:'উপরের অংশ সরানো',d:'উপর থেকে নিচে তাকিয়ে: দুই lung, মাঝে mediastinum, heart আর great vessel-এর সাথে সম্পর্ক (Datta Fig. 2.7–2.9-এর মতো)।'}},
 sagR:{t:'Sagittal (right lung)',n:[1,0,0],o:-60,view:[[-1,.1,.02],520],card:{t:'Right lung-এর sagittal কাটা',b:'বাইরের অংশ সরানো',d:'তিন lobe আর দুই fissure ভেতর থেকে।'}},
 sagL:{t:'Sagittal (left lung)',n:[-1,0,0],o:-60,view:[[1,.1,.02],520],card:{t:'Left lung-এর sagittal কাটা',b:'বাইরের অংশ সরানো',d:'দুই lobe আর oblique fissure ভেতর থেকে।'}}
};
const B={
 id:'lungs',startMode:'parts',PARTS,REG,TERR,STR,STYLE,views:VIEWS,target:[0,0,0],dist:560,MK,cuts:CUTS,maxDist:1300,minDist:60,
 baseColor:'#d9a6a1',innerColor:'#c98d88',boneRough:.62,cutCap:'#b9716c',
 boneLook:{f:.45,b:.35,m:.22,tr:.25,cc:.35,sh:.35},peelBone:true,
 partLabel:'Lobe',regLabel:'Surface',terrLabel:'Segment',
 mkNote:'Border আর fissure রেখার উপরে ট্যাপ করলেও নাম আসে। প্রতিটা surface, groove আর border-এ বিন্দু আছে; বিন্দুতে বা lung-এর গায়ে ট্যাপ করলে নাম আসে। দুইবার ট্যাপ বা চেপে ধরলে সেই lobe সরে যায়।',
 modes:{
  parts:{paint:'parts',view:['ant',560],card:{t:'Lobes ও fissures',b:'ডানে ৩টা lobe, বাঁয়ে ২টা',d:`Right lung: upper, middle, lower; oblique আর horizontal fissure। Left lung: upper আর lower; শুধু oblique fissure। Left lung-এর upper lobe-এ cardiac notch আর lingula। দুইবার ট্যাপ করে একটা lobe সরিয়ে ভেতরের fissure পৃষ্ঠ দেখুন। ${DT('35–36')}`,l:[`এই স্ক্যানে আয়তন: right ${M.volR} ml, left ${M.volL} ml (right বড়: বই অনুযায়ী right lung ছোট-চওড়া কিন্তু বেশি ধারণক্ষম)`,`উচ্চতা: right ${M.hR} সেমি, left ${M.hL} সেমি (বই: right ২.৫ সেমি ছোট)`]}},
  lm:{paint:'parts',layers:{border:1},view:['ant',560],card:{t:'Apex, borders, fissures, cardiac notch',b:'হলুদ-কমলা রেখা: border · সাদা রেখা: fissure',d:`প্রতিটা lung অর্ধ-শঙ্কু: একটা apex, একটা base, দুটো surface (costal, medial) আর তিনটা border (anterior, posterior, inferior)। ${DT('32')}`,l:['Side চেনা: apex উপরে, ধারালো পাতলা border সামনে, উত্তল costal surface বাইরে রাখলে যে পাশে থাকে']}},
  surfs:{paint:'reg',layers:{border:1},regMap:{6:2,7:2,11:2,12:2,13:2,14:2,15:2,16:2,17:2,18:2,19:2,20:2,21:2,22:2,9:0,10:0},view:['rlat',560],card:{t:'Surfaces (পুরো আস্তরণ)',b:'প্রতিটা surface এক রঙে',d:`প্রতিটা lung-এর apex (হলুদ), costal surface (কমলা-গোলাপি), medial surface: mediastinal অংশ (বেগুনি) আর vertebral অংশ (বালি রং), আর base (নীল)। সীমানার রেখাগুলো border। Impression আলাদা করে দেখতে "Right/Left medial surface" mode। ${DT('32–35')}`,l:[SCAN,'পৃষ্ঠ ভাগ: ১৪ মিমি জুড়ে গড় দিক আর diaphragm/vertebra-র সাথে ছোঁয়া থেকে']}},
  faceR:{paint:'reg',hideBone:['LU','LL'],view:['rmed',460],card:{t:'Right lung: medial surface',b:'Impressions ও grooves (ভেতর থেকে)',d:`রঙগুলো স্ক্যানে মাপা: যেখানে heart, SVC, right brachiocephalic vein, brachiocephalic trunk, trachea, oesophagus, IVC lung-কে ছোঁয়। Hilum-এর সামনে cardiac impression, উপরে SVC-এর groove, পেছনে oesophagus-এর groove। Costal surface দেখতে "ডান পাশ" চাপুন। ${DT('34–35')}`,l:[SCAN,'Arch of azygos vein স্ক্যানে নেই, তাই hilum-এর উপরের তার groove রঙে নেই: Datta অনুযায়ী এটা hilum-এর উপর দিয়ে সামনে বাঁকা হয়ে SVC-এর groove-এ মেশে']}},
  faceL:{paint:'reg',hideBone:['RU','RM','RL'],view:['lmed',460],card:{t:'Left lung: medial surface',b:'Impressions ও grooves (ভেতর থেকে)',d:`গভীর cardiac impression, hilum-এর উপর দিয়ে arch of aorta-র groove, পেছনে descending aorta-র groove, উপরে left subclavian artery-র groove, সামনে pulmonary trunk। Oesophagus দুই জায়গায়। Costal surface দেখতে "বাঁ পাশ" চাপুন। ${DT('35')}`,l:[SCAN,'Thoracic duct আর left superior intercostal vein স্ক্যানে নেই']}},
  seg:{paint:'terr',view:['ant',560],card:{t:'Broncho-pulmonary segments',b:'ডানে ১০, বাঁয়ে ৮–৯',d:`Right: upper lobe-এ apical, posterior, anterior; middle lobe-এ lateral, medial; lower lobe-এ apical, medial basal (cardiac), anterior basal, lateral basal, posterior basal। Left: upper lobe-এ apico-posterior, anterior, superior lingular, inferior lingular; lower lobe-এ apical, anterior basal, lateral basal, posterior basal। ${DT('39')}`,l:[SCH,'গুরুত্ব: postural drainage; সংক্রমণ segment-এ সীমাবদ্ধ থাকে; segmental resection','Supine অবস্থায় lower lobe-এর apical আর upper lobe-এর posterior segment সবচেয়ে নিচে: aspiration-এ abscess এখানে']}},
  root:{layers:{root:1},boneOp:.32,view:['ant',420],card:{t:'Root of the lung',b:'Hilum দিয়ে যা ঢোকে-বেরোয়',d:`Mediastinal pleura-র নলের মতো খাপ, ভেতরে principal bronchus, pulmonary artery, দুটো pulmonary vein, bronchial vessels, lymphatics আর nerve; T5–T7-এর সামনে। ডানে উপর থেকে: eparterial bronchus, pulmonary artery, hyparterial bronchus, lower pulmonary vein। বাঁয়ে: pulmonary artery, bronchus, lower pulmonary vein। সামনে থেকে পেছনে দুই পাশে: upper pulmonary vein, pulmonary artery, bronchus। Root-এর নিচে pulmonary ligament (dead space, lower vein ফুললে জায়গা দেয়)। ${DT('29, 34, 36')}`,l:['Lung স্বচ্ছ করা হয়েছে; bronchus, pulmonary artery, pulmonary vein স্ক্যানের']}},
  rel:{layers:{organ:1,great:1,root:1,muscle:1,vert:1},view:['ant',620],card:{t:'চারপাশের সম্পর্ক',b:'Mediastinum, diaphragm, vertebra',d:`দুই pleural sac-এর মাঝখানে mediastinum। Lung-এর medial surface-এ heart, great vessel, trachea, oesophagus-এর ছাপ। Base diaphragm-এর উপর। যেকোনো structure দুইবার ট্যাপে সরিয়ে পেছনেরটা দেখুন। ${DT('29–31, 34–35')}`}},
  surf:{layers:{rib:1,pleura:1},boneOp:.75,view:['ant',700],card:{t:'Surface marking ও pleura',b:'কমলা বিন্দু: lung-এর নিচের কিনারা ও pleura-র নিচের সীমা',d:`Lung: ৬ (MCL), ৮ (MAL), ১০ (scapular line) নম্বর rib। Pleura: ৮, ১০, ১২ নম্বর rib। পেছনে costovertebral reflexion C7 spine-এর ২.৫ সেমি পাশ থেকে T12 spine-এর ২.৫ সেমি পাশ। দুইয়ের মাঝে costodiaphragmatic recess: fluid এখানে আগে জমে। Pleural tap mid-axillary line-এর পেছনে, ৯ম intercostal space-এর নিচে নয় (diaphragm, liver বা spleen ফোঁড়ার ভয়)। ${DT('29–32')}`,l:['নীল স্বচ্ছ খোলস: parietal pleura (স্কিম্যাটিক)','পাশ আর পেছন থেকেও দেখুন']}},
  cut:{layers:{organ:1,great:1,root:1},clipLayers:['organ','great','root'],cuts:['cor','tr','sagR','sagL'],markers:true,view:null},
  quiz:{paint:'parts'}
 },
 relLegend:[],relLabels:[],muscleLabels:[],mkLift:2.5
};
B.lmInfo=id=>lmInfo(id)||{inf:{t:id,b:'',d:''},lab:id,kind:'lm',type:'part',quiz:false,show:'none'};
window.BONE=B;
}
