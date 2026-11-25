/* হিউমেরাসের লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ৯–১৩।
   REG নম্বর pipeline/limb.py-র humerus() MUS-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const D=window.DATA;
const SCAN='স্ক্যান থেকে মাপা',SCH='স্কিম্যাটিক: স্ক্যানে নার্ভ নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে';
const DT=p=>`Datta, পৃ. ${p}`;
const PARTS={
 1:{c:'#f2c96b',t:'Head',b:'হেড',d:`গোলকের প্রায় ১/৩, ভেতরে-পেছনে-উপরে মুখ করা; scapula-র glenoid cavity-র সাথে shoulder joint। Glenoid অনেক ছোট ও অগভীর, তাই নড়াচড়া বেশি। ${DT('৯')}`},
 2:{c:'#e07a5f',t:'Greater tubercle',b:'বড় টিউবারকল',d:`উপরের প্রান্তের সবচেয়ে বাইরের অংশ; acromion ছাড়িয়ে কাঁধের গোল আকার দেয়। উপরে-পেছনে তিনটা ছাপ: supraspinatus, infraspinatus, teres minor। ${DT('১০')}`},
 3:{c:'#81b29a',t:'Lesser tubercle',b:'ছোট টিউবারকল',d:`সামনে, head-এর ঠিক পরে; subscapularis-এর insertion। ${DT('১০')}`},
 4:{c:'#e9e1cf',t:'Shaft',b:'শ্যাফট',d:`উপরের অর্ধেক গোলাকার, নিচের অর্ধেক কাটলে ত্রিকোণ। তিনটা বর্ডার (anterior, medial, lateral) আর তিনটা পৃষ্ঠ (antero-medial, antero-lateral, posterior)। ${DT('১১')}`},
 5:{c:'#c9b6e8',t:'Neck অঞ্চল',b:'নেক',d:`Anatomical neck head-এর ঠিক পরে; surgical neck উপরের প্রান্ত আর শ্যাফটের জোড়ায়। ${DT('১০')}`},
 6:{c:'#8cc0b0',t:'Capitulum',b:'ক্যাপিচুলাম',d:`গোলকের অর্ধেকের কম, সামনে-নিচে articular; radius-এর head-এর সাথে। ${DT('১২')}`},
 7:{c:'#9fb8e8',t:'Trochlea',b:'ট্রোকলিয়া',d:`অসম কপিকল; ulna-র trochlear notch-এর সাথে। ভেতরের কিনারা বাইরেরটার চেয়ে প্রায় ৬ মিমি নিচে, তাই carrying angle। ${DT('১২')}`},
 8:{c:'#d8c3a5',t:'নিচের প্রান্তের অ-জোড়া অংশ',b:'এপিকন্ডাইল ও ফসা',d:`Medial ও lateral epicondyle আর radial, coronoid, olecranon fossa। ${DT('১২–১৩')}`}
};
const REG={
 1:{c:'#e07a5f',k:'supra',t:'Supraspinatus',b:'সুপ্রাস্পাইনেটাস',w:'Greater tubercle-এর উপরের ছাপ',d:`Rotator cuff-এর অংশ। ${DT('১০')}`},
 2:{c:'#f2a541',k:'infra',t:'Infraspinatus',b:'ইনফ্রাস্পাইনেটাস',w:'Greater tubercle-এর মাঝের ছাপ',d:`Rotator cuff। ${DT('১০')}`},
 3:{c:'#c9a227',k:'tmin',t:'Teres minor',b:'টেরেস মাইনর',w:'Greater tubercle-এর পেছনের ছাপ (শ্যাফটের একটু সহ)',d:`Rotator cuff। ${DT('১০')}`},
 4:{c:'#5fae7f',k:'subsc',t:'Subscapularis',b:'সাবস্ক্যাপুলারিস',w:'Lesser tubercle',d:`Rotator cuff; tendon শ্যাফটে একটু নামে। ${DT('১০')}`},
 5:{c:'#4c8fd6',k:'pm',t:'Pectoralis major',b:'পেক্টোরালিস মেজর',w:'Intertubercular sulcus-এর lateral lip (দুই স্তরে)',d:`তিনটার মধ্যে সবচেয়ে লম্বা অ্যাটাচমেন্ট। ${DT('১১')}`},
 6:{c:'#3a6ea5',k:'lat',t:'Latissimus dorsi',b:'ল্যাটিসিমাস ডরসাই',w:'Sulcus-এর floor',d:`তিনটার মধ্যে সবচেয়ে ছোট। Lateral lip-এ PM, floor-এ LD, medial lip-এ TM: "lady between two majors"। ${DT('১১')}`},
 7:{c:'#7aa6d6',k:'tmaj',t:'Teres major',b:'টেরেস মেজর',w:'Sulcus-এর medial lip',d:DT('১১')},
 9:{c:'#d1495b',k:'delt',t:'Deltoid',b:'ডেলটয়েড',w:'Deltoid tuberosity (V আকার)',d:`শ্যাফটের মাঝামাঝি, antero-lateral পৃষ্ঠে। ${DT('১২')}`},
 10:{c:'#8e6cc0',k:'cb',t:'Coracobrachialis',b:'কোরাকোব্র্যাকিয়ালিস',w:'Medial border-এর মাঝের খসখসে অংশ',d:`এর কাছে nutrient foramen, নিচের দিকে মুখ করা। ${DT('১১')}`},
 11:{c:'#e3a56a',k:'brach',t:'Brachialis',b:'ব্র্যাকিয়ালিস',w:'নিচের অর্ধেকের antero-medial ও antero-lateral পৃষ্ঠ',d:`Deltoid-এর V জড়িয়ে ধরে উপরে ওঠে। ${DT('১১–১২')}`},
 12:{c:'#9bc53d',k:'triLat',t:'Triceps: lateral head',b:'ট্রাইসেপস (lateral head)',w:'Spiral groove-এর উপরের তির্যক রেখা',d:`উপরের অর্ধেকে একমাত্র origin। ${DT('১২–১৩')}`},
 13:{c:'#1c8fa0',k:'triMed',t:'Triceps: medial head',b:'ট্রাইসেপস (medial head)',w:'Spiral groove-এর নিচের বড় পেছনের পৃষ্ঠ',d:DT('১২')},
 14:{c:'#a87bd1',k:'br',t:'Brachioradialis',b:'ব্র্যাকিওরেডিয়ালিস',w:'Lateral supracondylar ridge-এর উপরের ২/৩',d:DT('১২')},
 15:{c:'#c77dce',k:'ecrl',t:'Extensor carpi radialis longus',b:'ECRL',w:'Lateral supracondylar ridge-এর নিচের ১/৩',d:DT('১২')},
 16:{c:'#f28482',k:'pt',t:'Pronator teres (humeral head)',b:'প্রোনেটর টেরেস',w:'Medial supracondylar ridge-এর নিচের অংশ',d:DT('১২')},
 17:{c:'#edae49',k:'cfo',t:'Common flexor origin',b:'কমন ফ্লেক্সর অরিজিন',w:'Medial epicondyle-এর সামনে-নিচে',d:`Forearm-এর superficial flexor-গুলো (স্ক্যানে: FCR, palmaris longus, FDS, FCU)। ${DT('১৩')}`},
 18:{c:'#5f7f9e',k:'ceo',t:'Common extensor origin',b:'কমন এক্সটেনসর অরিজিন',w:'Lateral epicondyle-এর সামনে-বাইরে',d:`Superficial extensor-গুলো (স্ক্যানে: ECRB, extensor digitorum, EDM)। ECU স্ক্যানে নেই। ${DT('১৩')}`},
 19:{c:'#2a9d8f',k:'anc',t:'Anconeus',b:'অ্যাঙ্কোনিয়াস',w:'Lateral epicondyle-এর পেছনে',d:DT('১৩')},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'Head, capitulum, trochlea',d:'Shoulder আর elbow joint।'}
};
const MUS_REG={supra:1,infra:2,tmin:3,subsc:4,pm:5,lat:6,tmaj:7,delt:9,cb:10,brach:11,triLat:12,triMed:13,br:14,ecrl:15,pt:16,cfo:17,ceo:18,anc:19};
const STR={
 axN:{t:'Axillary nerve',b:'অ্যাক্সিলারি নার্ভ',d:`Surgical neck-কে পেছন থেকে জড়িয়ে যায়, সাথে posterior circumflex humeral vessels। Surgical neck ভাঙলে deltoid অবশ হতে পারে। ${DT('১০, ১৩')}`,l:[SCH]},
 pcha:{t:'Posterior circumflex humeral artery',b:'পোস্টেরিয়র সারকামফ্লেক্স হিউমেরাল',d:`Axillary nerve-এর সাথে surgical neck-এর পেছনে। ${DT('১০, ১২')}`,l:[SCH]},
 radN:{t:'Radial nerve',b:'রেডিয়াল নার্ভ',d:`পেছনের পৃষ্ঠের মাঝের ১/৩ জুড়ে spiral groove-এ নিচে-বাইরে নামে, তারপর lateral intermuscular septum ফুঁড়ে সামনে। শ্যাফটের মাঝখান ভাঙলে আঘাত পায়। ${DT('১২–১৩')}`,l:[SCH]},
 pfb:{t:'Profunda brachii artery',b:'প্রোফান্ডা ব্র্যাকিয়াই',d:`Radial nerve-এর সাথে spiral groove-এ। ${DT('১২')}`,l:[SCH]},
 ulnN:{t:'Ulnar nerve',b:'আলনার নার্ভ',d:`Medial epicondyle-এর গোড়ার পেছনের খাঁজে; এখানে আঙুল দিয়ে গড়ালে ঝিনঝিন লাগে ("funny bone")। মাঝামাঝি medial intermuscular septum ফোঁড়ে। ${DT('১২–১৩')}`,l:[SCH]},
 scapula:{t:'Scapula',b:'স্ক্যাপুলা',d:'Glenoid cavity-র সাথে shoulder joint।',l:[SCAN]},
 radius:{t:'Radius',b:'রেডিয়াস',d:'Head capitulum-এর সাথে (humero-radial)।',l:[SCAN]},
 ulna:{t:'Ulna',b:'আলনা',d:'Trochlear notch trochlea-র সাথে (humero-ulnar)।',l:[SCAN]},
 clavicle:{t:'Clavicle',b:'ক্ল্যাভিকল',d:'কাঁধের উপরে।',l:[SCAN]}
};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 head:L('Head','হেড',PARTS[1].d,'joint'),
 gtub:L('Greater tubercle','বড় টিউবারকল',PARTS[2].d,'elev'),
 ltub:L('Lesser tubercle','ছোট টিউবারকল',PARTS[3].d,'elev'),
 sulcus:L('Intertubercular sulcus','বাইসিপিটাল গ্রুভ',`দুই tubercle-এর মাঝের খাঁজ; ভেতরে biceps-এর long head (synovial sheath-সহ) আর anterior circumflex humeral artery-র শাখা। উপরে transverse humeral ligament। ${DT('১০–১১')}`,'groove'),
 anatNeck:L('Anatomical neck','অ্যানাটমিক্যাল নেক',`Head-এর ঠিক পরের সরু অংশ; shoulder joint-এর capsule এখানে লাগে (নিচে ভেতরের দিকে প্রায় ১ সেমি নামে)। ${DT('১০–১১')}`,'part'),
 surgNeck:L('Surgical neck','সার্জিক্যাল নেক',`উপরের প্রান্ত আর শ্যাফটের জোড়ার সরু অংশ; পেছনে axillary nerve আর posterior circumflex humeral vessels। ${DT('১০')}`,'part',['lm','rel']),
 deltTub:L('Deltoid tuberosity','ডেলটয়েড টিউবারোসিটি',REG[9].d+' '+REG[9].w,'elev',['lm','att']),
 cbImp:L('Coracobrachialis-এর ছাপ','মাঝের খসখসে অংশ',REG[10].d,'elev',['lm','att']),
 spiral:L('Spiral (radial) groove','স্পাইরাল গ্রুভ',`পেছনের পৃষ্ঠের মাঝের ১/৩ জুড়ে নিচে-বাইরে নামে; radial nerve আর profunda brachii vessels। উপরে lateral head-এর রেখা, নিচের অংশের মেঝেতে brachialis। ${DT('১২')}`,'groove',['lm','rel']),
 medEpi:L('Medial epicondyle','মিডিয়াল এপিকন্ডাইল',`ভেতরে-একটু পেছনে মুখ করা ভোঁতা উঁচু অংশ; ডগায় ulnar collateral ligament, সামনে-নিচে common flexor origin, গোড়ার পেছনে ulnar nerve-এর খাঁজ। ${DT('১৩')}`,'elev',['lm','joint']),
 latEpi:L('Lateral epicondyle','ল্যাটারাল এপিকন্ডাইল',`কম উঁচু, বাইরে-একটু সামনে মুখ করা; ডগায় radial collateral ligament, সামনে-বাইরে common extensor origin, পেছনে anconeus। ${DT('১৩')}`,'elev',['lm','joint']),
 capitulum:L('Capitulum','ক্যাপিচুলাম',PARTS[6].d,'joint',['lm','joint']),
 trochlea:L('Trochlea','ট্রোকলিয়া',PARTS[7].d,'joint',['lm','joint']),
 olecFossa:L('Olecranon fossa','ওলেক্রানন ফসা',`পেছনে, trochlea-র উপরে গভীর গর্ত; হাত সোজা করলে olecranon-এর ডগা এখানে বসে। কখনো মেঝে ফুটো থাকে। ${DT('১৩')}`,'groove',['lm','joint']),
 coronFossa:L('Coronoid fossa','করোনয়েড ফসা',`সামনে trochlea-র উপরে; ভাঁজ করলে ulna-র coronoid process। ${DT('১৩')}`,'groove',['lm','joint']),
 radFossa:L('Radial fossa','রেডিয়াল ফসা',`সামনে capitulum-এর উপরে; পুরো ভাঁজে radius-এর head-এর কিনারা। তিনটা fossa-ই elbow joint-এর capsule-এর ভেতরে। ${DT('১২–১৩')}`,'groove',['lm','joint']),
 ulnarGroove:L('Ulnar nerve-এর খাঁজ','মিডিয়াল এপিকন্ডাইলের পেছনে',STR.ulnN.d,'groove',['lm','rel']),
 medSupra:L('Medial supracondylar ridge','মিডিয়াল সুপ্রাকন্ডাইলার রিজ',`Medial border-এর নিচের ধারালো অংশ; medial intermuscular septum, সামনে pronator teres-এর humeral head। কখনো epicondyle-এর ৫ সেমি উপরে supracondylar process (ligament of Struthers)। ${DT('১১–১২')}`,'surf'),
 latSupra:L('Lateral supracondylar ridge','ল্যাটারাল সুপ্রাকন্ডাইলার রিজ',`Lateral intermuscular septum; সামনের সরু ফালির উপরের ২/৩-এ brachioradialis, নিচের ১/৩-এ ECRL। ${DT('১২')}`,'surf')
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],med:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const B={
 id:'humerus',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:640,
 modes:{
  parts:{layers:{},view:['ant',640],card:{t:'অংশগুলো',b:'উপরের প্রান্ত · শ্যাফট · নিচের প্রান্ত',d:`উপরের প্রান্তে head, দুই tubercle, sulcus আর neck; নিচের প্রান্তে condyle: জোড়ার অংশ (capitulum, trochlea) আর অ-জোড়া অংশ (তিন fossa, দুই epicondyle)। ${DT('৯, ১২')}`}},
  lm:{layers:{},view:['ant',640],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'সামনে, পেছনে আর দুই পাশ থেকে ঘুরিয়ে দেখুন; শুধু যে পাশ দেখছেন সেই পাশের মার্ক আসবে।'}},
  att:{layers:{},view:['ant',640],card:{t:'কোন মাসল কোথায় লাগে',b:'উপরের অর্ধেকে insertion, নিচের অর্ধেকে origin',d:`Scapulo-humeral মাসল head ঘিরে, thoraco-humeral মাসল sulcus বরাবর। উপরের অর্ধেকে শুধু insertion (triceps-এর lateral head বাদে), নিচের অর্ধেকে শুধু origin। ${DT('১৩')}`,l:[ZN]}},
  rel:{layers:{nerve:1,artery:1},view:['post',640],card:{t:'হাড় ছোঁয়া তিন নার্ভ',b:'Axillary · Radial · Ulnar',d:`Surgical neck ঘিরে axillary, spiral groove-এ radial, medial epicondyle-এর পেছনে ulnar। তিনটাই diaphysis-এর উপর, তাই হাড় ভাঙলে আঘাত পেতে পারে। ${DT('১৩')}`,l:[SCH]}},
  joint:{layers:{vert:1},view:['ant',700],viewDist:700,card:{t:'জোড়াগুলো',b:'Shoulder ও elbow',d:`উপরে glenoid cavity-র সাথে ball-and-socket shoulder joint; নিচে capitulum-radius আর trochlea-ulna মিলে elbow joint। ${DT('৯, ১২')}`}},
  side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['axN','#f2c230'],['radN','#f2c230'],['ulnN','#f2c230'],['pcha','#e0443e'],['pfb','#e0443e']],
 relAsMarkers:true,
 relLabels:[['axN','Axillary nerve','rel','node'],['radN','Radial nerve','rel','node'],['ulnN','Ulnar nerve','rel','node'],['pcha','Post. circumflex humeral a.','rel','art'],['pfb','Profunda brachii a.','rel','art'],
  ['scapula','Scapula','joint','part'],['radius','Radius','joint','part'],['ulna','Ulna','joint','part']],
 muscleLabels:[],
 muscleView:r=>[[12,13,19,2,3].includes(r)?'post':[14,15,18].includes(r)?'lat':'ant',640],
 sideRules:['Head উপরে আর ভেতরের দিকে (shaft-এর medial পাশে)','Intertubercular sulcus আর lesser tubercle সামনে','Olecranon fossa পেছনে, নিচের প্রান্তে','Medial epicondyle বেশি উঁচু, ভেতরের দিকে '+`(${DT('৯, ১৩')})`],
 sideView:[0,0,1],sideDist:560,sideHint:'Head, lesser tubercle আর olecranon fossa কোন দিকে দেখুন।'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
