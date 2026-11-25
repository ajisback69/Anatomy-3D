/* স্ক্যাপুলার লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ৫–৯।
   REG নম্বর pipeline/limb.py-র scapula() MUS-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে';
const DT=p=>`Datta, পৃ. ${p}`;
const PARTS={
 1:{c:'#e9e1cf',t:'Body',b:'বডি',d:`চ্যাপ্টা ত্রিভুজ; সামনে costal (subscapular fossa), পেছনে dorsal পৃষ্ঠ। বুকের পেছনে-বাইরে ২য় থেকে ৭ম রিবের উপর। ${DT('৫–৬')}`},
 2:{c:'#9fb8e8',t:'Spine',b:'স্পাইন',d:`Dorsal পৃষ্ঠ থেকে উঠে আসা ত্রিকোণ তাক; supraspinous আর infraspinous fossa-কে আলাদা করে। Apex medial border-এ, T3-এর spine-এর লেভেলে; crest পুরোটা চামড়ার নিচে। ${DT('৮')}`},
 3:{c:'#e07a5f',t:'Acromion',b:'অ্যাক্রোমিয়ন',d:`Spine-এর বাইরের মাথা থেকে সামনে বেরোনো চ্যাপ্টা পাত, glenoid-এর উপর ঝুলে থাকে। ${DT('৮')}`},
 4:{c:'#81b29a',t:'Coracoid process',b:'কোরাকয়েড প্রসেস',d:`বাঁকানো আঙুলের মতো; superior border-এর বাইরের অংশ থেকে, glenoid-এর ঠিক উপরে। খাড়া আর আড়াআড়ি অংশ; ডগা ক্ল্যাভিকলের ভেতরের ৩/৪ আর বাইরের ১/৪-এর জোড়ার ২.৫ সেমি নিচে টের পাওয়া যায়। ${DT('৮–৯')}`},
 5:{c:'#c9b6e8',t:'Neck ও lateral angle',b:'নেক',d:`Lateral angle কাটা মাথার মতো; glenoid-এর ঠিক পরের সরু অংশ anatomical neck। Surgical neck: suprascapular notch থেকে infraglenoid tubercle পর্যন্ত রেখা। ${DT('৬')}`},
 6:{c:'#8fd3d6',t:'Glenoid cavity',b:'গ্লেনয়েড ক্যাভিটি',d:`নাশপাতি আকারের অগভীর গর্ত, উপরে সরু; humerus-এর head-এর সাথে shoulder joint। কিনারায় glenoidal labrum গভীর করে। ${DT('৭')}`}
};
const REG={
 1:{c:'#5fae7f',k:'subsc',t:'Subscapularis',b:'সাবস্ক্যাপুলারিস',w:'Costal পৃষ্ঠের বেশিরভাগ (medial কিনারার ফালি বাদে)',d:`Oblique ridge-গুলোতে এর ভেতরের tendon লাগে। ${DT('৬')}`},
 2:{c:'#f2a541',k:'serr',t:'Serratus anterior',b:'সেরাটাস অ্যান্টেরিয়র',w:'Costal পৃষ্ঠের medial কিনারার ফালি',d:`১ম digitation উপরের ত্রিকোণ এলাকায়, ২য়-৩য় সরু ফালিতে, শেষ পাঁচটা inferior angle-এর ত্রিকোণে। ${DT('৬, ৮')}`},
 3:{c:'#e07a5f',k:'supra',t:'Supraspinatus',b:'সুপ্রাস্পাইনেটাস',w:'Supraspinous fossa-র ভেতরের ২/৩',d:DT('৭')},
 4:{c:'#c9a227',k:'infra',t:'Infraspinatus',b:'ইনফ্রাস্পাইনেটাস',w:'Infraspinous fossa-র বেশিরভাগ ও spine-এর নিচের পৃষ্ঠ',d:DT('৭')},
 5:{c:'#9bc53d',k:'tmin',t:'Teres minor',b:'টেরেস মাইনর',w:'Lateral border-এর পেছনের ফালির উপরের ২/৩',d:`মাঝে circumflex scapular vessels-এর খাঁজ। ${DT('৭')}`},
 6:{c:'#7aa6d6',k:'tmaj',t:'Teres major',b:'টেরেস মেজর',w:'Inferior angle-এর কাছে পেছনের ডিম্বাকার এলাকা',d:DT('৭–৮')},
 7:{c:'#3a6ea5',k:'lat',t:'Latissimus dorsi',b:'ল্যাটিসিমাস ডরসাই',w:'Inferior angle-এর পেছনে কয়েকটা slip',d:DT('৮')},
 9:{c:'#d1495b',k:'delt',t:'Deltoid',b:'ডেলটয়েড',w:'Spine-এর crest-এর নিচের ঠোঁট আর acromion-এর lateral border',d:`Lateral border-এ চারটা tubercle থেকে septum; তাই মাঝের অংশ multipennate। ${DT('৮')}`},
 10:{c:'#a3c4f3',k:'trap',t:'Trapezius',b:'ট্র্যাপিজিয়াস',w:'Crest-এর উপরের ঠোঁট আর acromion-এর medial border; নিচের তন্তু deltoid tubercle-এ',d:DT('৮')},
 11:{c:'#8e6cc0',k:'lev',t:'Levator scapulae',b:'লিভেটর স্ক্যাপুলি',w:'Medial border-এর পেছনে: superior angle থেকে spine-এর apex',d:DT('৭')},
 12:{c:'#c77dce',k:'rhMin',t:'Rhomboid minor',b:'রমবয়েড মাইনর',w:'Medial border, spine-এর apex-এর সামনাসামনি',d:DT('৭')},
 13:{c:'#e3a56a',k:'rhMaj',t:'Rhomboid major',b:'রমবয়েড মেজর',w:'Medial border, apex-এর নিচ থেকে inferior angle',d:DT('৭')},
 14:{c:'#4c8fd6',k:'pmin',t:'Pectoralis minor',b:'পেক্টোরালিস মাইনর',w:'Coracoid-এর উপরের পৃষ্ঠ ও antero-medial border',d:DT('৯')},
 15:{c:'#f28482',k:'cbb',t:'Coracobrachialis ও biceps (short head)',b:'কোরাকোব্র্যাকিয়ালিস, বাইসেপস',w:'Coracoid-এর ডগা: ভেতরে CB, বাইরে short head',d:DT('৯')},
 16:{c:'#1c8fa0',k:'bicLong',t:'Biceps (long head)',b:'বাইসেপস লং হেড',w:'Supraglenoid tubercle (capsule-এর ভেতরে)',d:DT('৭, ৯')},
 17:{c:'#2a9d8f',k:'triLong',t:'Triceps (long head)',b:'ট্রাইসেপস লং হেড',w:'Infraglenoid tubercle',d:DT('৭')},
 18:{c:'#edae49',k:'omo',t:'Omohyoid (inferior belly)',b:'ওমোহায়য়েড',w:'Suprascapular notch-এর ভেতরের দিক',d:DT('৭')},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'Glenoid cavity, acromion-এর clavicular facet',d:'Shoulder আর acromio-clavicular joint।'}
};
const MUS_REG={subsc:1,serr:2,supra:3,infra:4,tmin:5,tmaj:6,lat:7,delt:9,trap:10,lev:11,rhMin:12,rhMaj:13,pmin:14,cbb:15,bicLong:16,triLong:17,omo:18};
const STR={
 supscN:{t:'Suprascapular nerve',b:'সুপ্রাস্ক্যাপুলার নার্ভ',d:`Transverse scapular ligament-এর নিচ দিয়ে (suprascapular foramen) supraspinous fossa-য়, তারপর spinoglenoid notch দিয়ে infraspinous fossa-য়। ${DT('৭')}`,l:[SCH]},
 supscA:{t:'Suprascapular artery',b:'সুপ্রাস্ক্যাপুলার আর্টারি',d:`Ligament-এর উপর দিয়ে যায় (নার্ভ নিচ দিয়ে)। ${DT('৭')}`,l:[SCH]},
 tsl:{t:'Transverse scapular ligament',b:'ট্রান্সভার্স স্ক্যাপুলার লিগামেন্ট',d:`Notch-এর উপর সেতু, coracoid-এর গোড়ায় লাগে; notch-কে foramen বানায়। ${DT('৭, ৯')}`,l:[SCH]},
 circScap:{t:'Circumflex scapular artery',b:'সারকামফ্লেক্স স্ক্যাপুলার',d:`Lateral border পার হয়ে dorsal পৃষ্ঠে, teres minor-এর origin-এ খাঁজ কাটে। Scapular anastomosis: subclavian-এর ১ম অংশ আর axillary-র ৩য় অংশের মধ্যে। ${DT('৭')}`,l:[SCH]},
 dsn:{t:'Dorsal scapular nerve',b:'ডরসাল স্ক্যাপুলার নার্ভ',d:`Medial border বরাবর। ${DT('৭')}`,l:[SCH]},
 dtca:{t:'Descending branch of transverse cervical artery',b:'ট্রান্সভার্স সার্ভাইকাল আর্টারির শাখা',d:`Medial border বরাবর, anastomosis-এ অংশ নেয়। ${DT('৭')}`,l:[SCH]},
 accN:{t:'Spinal accessory nerve',b:'অ্যাক্সেসরি নার্ভ',d:`Trapezius-এর নিচে superior angle পার হয়। ${DT('৮')}`,l:[SCH]},
 humerus:{t:'Humerus',b:'হিউমেরাস',d:'Head glenoid-এর সাথে shoulder joint।',l:[SCAN]},
 clavicle:{t:'Clavicle',b:'ক্ল্যাভিকল',d:'Acromion-এর সাথে acromio-clavicular joint; coracoid-এর সাথে ligament।',l:[SCAN]}
};
for(let i=2;i<=7;i++)STR['rib'+i]={t:'Rib '+i,b:i+' নম্বর রিব',d:'Scapula ২য় থেকে ৭ম রিবের উপর বসে।',l:[SCAN]};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 glenoid:L('Glenoid cavity','গ্লেনয়েড ক্যাভিটি',PARTS[6].d+' Capsule labrum-এর বাইরে লাগে: supraglenoid tubercle ভেতরে, infraglenoid বাইরে।','joint',['lm','joint']),
 supraGT:L('Supraglenoid tubercle','সুপ্রাগ্লেনয়েড টিউবারকল',`Glenoid-এর ঠিক উপরে, coracoid-এর গোড়ায়; biceps-এর long head (capsule-এর ভেতরে)। ${DT('৭, ৯')}`,'elev'),
 infraGT:L('Infraglenoid tubercle','ইনফ্রাগ্লেনয়েড টিউবারকল',`Lateral border-এর উপরে, glenoid-এর ঠিক নিচে; triceps-এর long head। ${DT('৭')}`,'elev'),
 coracoidTip:L('Coracoid process: ডগা','কোরাকয়েডের ডগা',PARTS[4].d+' ডগায় coracobrachialis (ভেতরে) আর biceps-এর short head (বাইরে)।','elev'),
 acromionTip:L('Acromion: ডগা','অ্যাক্রোমিয়নের ডগা',`Deltoid-এর নিচে; coraco-acromial ligament লাগে। Acromion-এর নিচের পৃষ্ঠ, এই ligament আর coracoid মিলে coraco-acromial arch: shoulder joint-এর ছাউনি। ${DT('৮')}`,'elev'),
 acromialAngle:L('Acromial angle','অ্যাক্রোমিয়াল অ্যাঙ্গেল',`Crest-এর নিচের ঠোঁট acromion-এর lateral border-এ মেশে; চামড়ার নিচে সারফেস অ্যানাটমির ল্যান্ডমার্ক। ${DT('৮')}`,'elev'),
 clavFacet:L('Clavicular facet','ক্ল্যাভিকুলার ফ্যাসেট',`Acromion-এর medial border-এর সামনে ডিম্বাকার facet; ক্ল্যাভিকলের সাথে plane synovial acromio-clavicular joint। ${DT('৮')}`,'joint',['lm','joint']),
 crest:L('Crest of spine','স্পাইনের ক্রেস্ট',`পুরোটা চামড়ার নিচে; উপরের ঠোঁটে trapezius-এর মাঝের তন্তু, নিচের ঠোঁটে deltoid-এর পেছনের তন্তু। ${DT('৮')}`,'surf'),
 spineRoot:L('Spine-এর apex','স্পাইনের অ্যাপেক্স',`Medial border-এ, T3-এর spine-এর লেভেলে; মসৃণ ত্রিকোণ এলাকায় trapezius-এর নিচের তন্তু bursa-র উপর দিয়ে সরে। ${DT('৮')}`,'part'),
 deltTubSc:L('Deltoid tubercle (spine)','স্পাইনের ডেলটয়েড টিউবারকল',`Crest-এর নিচের ঠোঁটে; trapezius-এর সবচেয়ে নিচের তন্তু এখানে লাগে। ${DT('৮')}`,'elev'),
 spinoglenoid:L('Spinoglenoid notch','স্পাইনোগ্লেনয়েড নচ',`Spine-এর বাইরের কিনারা আর neck-এর পেছনের পৃষ্ঠের মাঝে; দুই fossa যোগ করে; suprascapular nerve ও vessels যায়। ${DT('৭')}`,'groove',['lm','rel']),
 suprascNotch:L('Suprascapular notch','সুপ্রাস্ক্যাপুলার নচ',`Superior border-এ, coracoid-এর গোড়ার ঠিক ভেতরে; transverse scapular ligament একে foramen বানায়: নিচ দিয়ে নার্ভ, উপর দিয়ে নালী। ${DT('৭')}`,'groove',['lm','rel']),
 supAngle:L('Superior angle','সুপিরিয়র অ্যাঙ্গেল',`Medial আর superior border-এর মিলন; trapezius-এ ঢাকা, পেছন দিয়ে accessory nerve পার হয়। ${DT('৮')}`,'part'),
 infAngle:L('Inferior angle','ইনফেরিয়র অ্যাঙ্গেল',`৭ম রিব বা intercostal space-এর উপর; latissimus dorsi-র উপরের কিনারার নিচে টের পাওয়া যায়, হাত তুললে বুকের চারপাশে সরে। Costal পৃষ্ঠে serratus anterior-এর শেষ ৪–৫ digitation, পেছনে teres major ও latissimus-এর slip। ${DT('৭–৮')}`,'part'),
 medBorder:L('Medial (vertebral) border','মিডিয়াল বর্ডার',`Superior থেকে inferior angle; spine-এর apex-এর জন্য একটু বাঁকা। পুরো border-এ শুধু মাসলের insertion: সামনে serratus anterior, পেছনে levator scapulae ও দুই rhomboid। ${DT('৭')}`,'surf'),
 latBorder:L('Lateral (axillary) border','ল্যাটারাল বর্ডার',`Glenoid-এর নিচ থেকে inferior angle; মাসলের origin-এ ভরা (subscapularis, teres minor, teres major); circumflex scapular vessels পার হয়। ${DT('৭')}`,'surf'),
 supBorder:L('Superior border','সুপিরিয়র বর্ডার',`পাতলা আর ছোট; superior angle থেকে coracoid-এর গোড়া। ${DT('৭')}`,'surf'),
 subscFossa:L('Subscapular fossa (costal surface)','সাবস্ক্যাপুলার ফসা',`অগভীর অবতল, সামনে-ভেতরে মুখ করা; subscapularis। Oblique ridge-গুলো abduction-এ এর শক্তি বাড়ায়; lateral border-এর কাছের লম্বা ridge serratus anterior-এর lever। ${DT('৬')}`,'surf'),
 supraFossa:L('Supraspinous fossa','সুপ্রাস্পাইনাস ফসা',REG[3].w+'। '+DT('৭'),'surf'),
 infraFossa:L('Infraspinous fossa','ইনফ্রাস্পাইনাস ফসা',`Infraspinatus; শক্ত infraspinatus fascia ঢাকে। Blade ভাঙলে রক্ত এই fascia-র নিচে আটকে থাকে। ${DT('৭')}`,'surf')
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],med:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const B={
 id:'scapula',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:420,
 modes:{
  parts:{layers:{},view:['post',420],card:{t:'অংশগুলো',b:'২ পৃষ্ঠ · ৩ বর্ডার · ৩ অ্যাঙ্গেল · ৩ প্রসেস',d:`দুই পৃষ্ঠ (costal, dorsal), তিন বর্ডার (lateral, medial, superior), তিন অ্যাঙ্গেল (lateral, inferior, superior), তিন প্রসেস (spine, acromion, coracoid)। ${DT('৬')}`,l:['অংশের সীমানা জ্যামিতি দিয়ে আনুমানিক; glenoid আসল humerus-এর ছোঁয়া থেকে']}},
  lm:{layers:{},view:['post',420],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'পেছন থেকে spine, acromion আর দুই fossa; সামনে থেকে subscapular fossa আর coracoid; বাইরে থেকে glenoid দেখুন।'}},
  att:{layers:{},view:['post',420],card:{t:'কোন মাসল কোথায় লাগে',b:'১৭টা মাসল',d:`Medial border-এ শুধু insertion, lateral border-এ শুধু origin। সামনে-পেছনে ঘুরিয়ে দেখুন। ${DT('৭')}`,l:[ZN]}},
  rel:{layers:{nerve:1,artery:1,organ:1},view:['post',420],card:{t:'নার্ভ ও নালী',b:'Suprascapular · Circumflex scapular · Medial border',d:`Suprascapular nerve ligament-এর নিচ দিয়ে, artery উপর দিয়ে। এই নালীগুলো আর transverse cervical-এর শাখা scapula-র চারপাশে anastomosis তৈরি করে। ${DT('৭')}`,l:[SCH]}},
  joint:{layers:{vert:1},view:['ant',520],viewDist:520,card:{t:'জোড়া ও অবস্থান',b:'Shoulder · Acromio-clavicular',d:`Glenoid-এ humerus, acromion-এ ক্ল্যাভিকল; ২য়–৭ম রিবের উপর বসে। ${DT('৫, ৮')}`}},
  side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['supscN','#f2c230'],['supscA','#e0443e'],['tsl','#d8d2c0'],['circScap','#e0443e'],['dsn','#f2c230'],['dtca','#e0443e'],['accN','#f2c230']],
 relAsMarkers:true,
 relLabels:[['supscN','Suprascapular nerve','rel','node'],['supscA','Suprascapular artery','rel','art'],['tsl','Transverse scapular lig.','rel','part'],['circScap','Circumflex scapular a.','rel','art'],['dsn','Dorsal scapular nerve','rel','node'],['dtca','Transverse cervical a. (desc.)','rel','art'],['accN','Accessory nerve','rel','node'],
  ['humerus','Humerus','joint','part'],['clavicle','Clavicle','joint','part']],
 muscleLabels:[],
 muscleView:r=>[[1,2,14,15].includes(r)?'ant':[16,17].includes(r)?'lat':'post',420],
 sideRules:['যে হাতের scapula, সেই হাতে ধরুন: costal পৃষ্ঠ সামনে-ভেতরে','Glenoid বাইরের দিকে, একটু সামনে-উপরে','Coracoid-এর ডগা প্রায় সোজা সামনে; spine পেছনে '+`(${DT('৯')})`],
 sideView:[0,0,-1],sideDist:380,sideHint:'Glenoid কোন দিকে, spine কোন পৃষ্ঠে আর coracoid কোন দিকে মুখ করা দেখুন।'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
