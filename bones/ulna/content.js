/* আলনার লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ১৬–১৯।
   REG নম্বর pipeline/limb.py-র ulna() MUS-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে';
const DT=p=>`Datta, পৃ. ${p}`;
const PARTS={
 1:{c:'#f2c96b',t:'Olecranon process',b:'ওলেক্রানন',d:`উপরে ওঠা ঠোঁটের মতো; সোজা কনুইয়ে olecranon fossa-য় বসে। উপরের পৃষ্ঠে সামনে থেকে পেছনে: elbow-এর capsule, তারপর triceps (মাঝে bursa)। পেছনের ত্রিকোণ পৃষ্ঠ চামড়ার নিচে। ${DT('১৬–১৭')}`},
 2:{c:'#81b29a',t:'Coronoid process',b:'করোনয়েড',d:`Trochlear notch-এর নিচে সামনে বেরোনো তাক; উপরের পৃষ্ঠ notch-এর নিচের অংশ, সামনের ত্রিকোণ পৃষ্ঠে brachialis আর ulnar tuberosity। ${DT('১৭')}`},
 3:{c:'#8fd3d6',t:'Trochlear notch',b:'ট্রোকলিয়ার নচ',d:`Olecranon-এর সামনের আর coronoid-এর উপরের পৃষ্ঠ মিলে; humerus-এর trochlea-র সাথে humero-ulnar joint। মাঝে সরু অ-জোড়া ফালি। ${DT('১৭')}`},
 4:{c:'#e9e1cf',t:'Shaft',b:'শ্যাফট',d:`উপর থেকে নিচে সরু; পেছনে উত্তল। উপরের ৩/৪ কাটলে ত্রিকোণ, নিচের ১/৪ গোল। তিন বর্ডার (anterior, posterior, interosseous), তিন পৃষ্ঠ (anterior, medial, posterior)। ${DT('১৭')}`},
 5:{c:'#9fb8e8',t:'Head',b:'হেড',d:`গোল, জোড়ার পৃষ্ঠ; বাইরে radius-এর ulnar notch-এর সাথে inferior radio-ulnar joint, নিচে articular disc। ${DT('১৮')}`},
 6:{c:'#e07a5f',t:'Styloid process',b:'স্টাইলয়েড',d:`Head-এর পেছনে-ভেতর থেকে নামে; ulnar collateral ligament of wrist। Radius-এর styloid এর চেয়ে প্রায় ২ সেমি নিচে। ${DT('১৮')}`},
 7:{c:'#c9b6e8',t:'Radial notch',b:'রেডিয়াল নচ',d:`Coronoid-এর বাইরের পৃষ্ঠে; radius-এর head-এর সাথে superior radio-ulnar joint; দুই মাথায় annular ligament। ${DT('১৭')}`}
};
const REG={
 1:{c:'#3fa7a0',k:'tri',t:'Triceps brachii',b:'ট্রাইসেপস',w:'Olecranon-এর উপরের পৃষ্ঠ (insertion)',d:DT('১৬–১৭')},
 2:{c:'#e3a56a',k:'brach',t:'Brachialis',b:'ব্র্যাকিয়ালিস',w:'Coronoid-এর সামনের পৃষ্ঠ ও ulnar tuberosity (insertion)',d:DT('১৭')},
 3:{c:'#2a9d8f',k:'anc',t:'Anconeus',b:'অ্যাঙ্কোনিয়াস',w:'Olecranon-এর বাইরের পৃষ্ঠ ও পেছনের পৃষ্ঠের উপরের অংশ',d:DT('১৭–১৮')},
 4:{c:'#5fae7f',k:'sup',t:'Supinator (deep part)',b:'সুপিনেটর',w:'Supinator crest ও তার সামনের গর্ত',d:`গর্তটা supination-pronation-এ radial tuberosity-কে জায়গা দেয়। ${DT('১৭')}`},
 5:{c:'#4c8fd6',k:'fdp',t:'Flexor digitorum profundus',b:'FDP',w:'Anterior ও medial পৃষ্ঠের উপরের ৩/৪ (olecranon আর coronoid-এর ভেতরের দিকসহ)',d:`Posterior border থেকেও (aponeurosis দিয়ে) উপরের ৩/৪-এ। ${DT('১৭–১৮')}`},
 6:{c:'#8e6cc0',k:'pq',t:'Pronator quadratus',b:'প্রোনেটর কোয়াড্রেটাস',w:'Anterior পৃষ্ঠের নিচের ১/৪',d:DT('১৮')},
 7:{c:'#c9a227',k:'apl',t:'Abductor pollicis longus',b:'APL',w:'পেছনের পৃষ্ঠের বাইরের সরু অংশ (সবচেয়ে উপরে)',d:DT('১৮')},
 9:{c:'#9bc53d',k:'epl',t:'Extensor pollicis longus',b:'EPL',w:'পেছনের পৃষ্ঠের বাইরের অংশ (মাঝে)',d:DT('১৮')},
 10:{c:'#a87bd1',k:'ei',t:'Extensor indicis',b:'এক্সটেনসর ইন্ডিসিস',w:'পেছনের পৃষ্ঠের বাইরের অংশ (নিচে)',d:DT('১৮')},
 11:{c:'#f2a541',k:'fcu',t:'Flexor carpi ulnaris',b:'FCU',w:'Olecranon-এর ভেতরের পৃষ্ঠের slip আর posterior border-এর উপরের অর্ধেক',d:`Ulnar nerve এর দুই head-এর মাঝ দিয়ে forearm-এ ঢোকে। ${DT('১৩, ১৭–১৮')}`},
 12:{c:'#f28482',k:'fdsPt',t:'FDS ও pronator teres (ulnar head)',b:'FDS, PT',w:'Coronoid-এর ধারালো ভেতরের কিনারা',d:`উপর থেকে: FDS-এর অংশ, PT-এর ulnar head, কখনো FPL। ${DT('১৭')}`},
 13:{c:'#7aa6d6',k:'iom',t:'Interosseous membrane',b:'ইন্টারঅসিয়াস মেমব্রেন',w:'Interosseous border',d:DT('১৮')},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'Trochlear notch, radial notch, head',d:'Elbow আর দুই radio-ulnar joint।'}
};
const MUS_REG={tri:1,brach:2,anc:3,sup:4,fdp:5,pq:6,apl:7,epl:9,ei:10,fcu:11,fdsPt:12,iom:13};
const STR={
 ulnN:{t:'Ulnar nerve',b:'আলনার নার্ভ',d:`Medial epicondyle-এর পেছন থেকে FCU-র দুই head-এর মাঝ দিয়ে forearm-এ, ulna-র ভেতরের দিক ঘেঁষে নামে। ${DT('১৩')}`,l:[SCH]},
 ulnA:{t:'Ulnar artery',b:'আলনার আর্টারি',d:'Forearm-এর নিচের অংশে ulnar nerve-এর বাইরে পাশে পাশে।',l:[SCH,'Datta-র এই অধ্যায়ে নেই, সাধারণ বই থেকে']},
 humerus:{t:'Humerus',b:'হিউমেরাস',d:'Trochlea trochlear notch-এ।',l:[SCAN]},
 radius:{t:'Radius',b:'রেডিয়াস',d:'উপরে radial notch-এ radius-এর head, নিচে ulna-র head radius-এর ulnar notch-এ।',l:[SCAN]}
};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 olecranon:L('Olecranon: উপরের পৃষ্ঠ','ওলেক্রানন',PARTS[1].d,'elev',['lm','att']),
 olecPost:L('Olecranon: পেছনের পৃষ্ঠ','কনুইয়ের ডগা',`মসৃণ ত্রিকোণ, চামড়ার নিচে। সোজা কনুইয়ে olecranon আর দুই epicondyle এক সরলরেখায়, ভাঁজে সমদ্বিবাহু ত্রিভুজ; এই সম্পর্ক বদলালে কনুই স্থানচ্যুত। ${DT('১৭, ১৯')}`,'surf'),
 trochNotch:L('Trochlear notch','ট্রোকলিয়ার নচ',PARTS[3].d,'joint',['lm','joint']),
 coronoid:L('Coronoid process','করোনয়েড প্রসেস',PARTS[2].d+' ধারালো সামনের কিনারা ভাঁজ করা কনুইয়ে coronoid fossa ছোঁয়।','elev',['lm','joint']),
 ulnTub:L('Ulnar tuberosity','আলনার টিউবারোসিটি',`Coronoid-এর সামনের পৃষ্ঠের নিচে; brachialis। নিচের মাথা থেকে oblique cord radial tuberosity-তে (FPL-এর অবশেষ)। ${DT('১৭')}`,'elev',['lm','att']),
 radNotch:L('Radial notch','রেডিয়াল নচ',PARTS[7].d,'joint',['lm','joint']),
 supCrest:L('Supinator crest','সুপিনেটর ক্রেস্ট',REG[4].w+'; interosseous border-এর সাথে মেশে। '+DT('১৭'),'elev',['lm','att']),
 sublime:L('Sublime tubercle','সাবলাইম টিউবারকল',`Coronoid-এর ভেতরের কিনারার উপরে; elbow-এর ulnar collateral ligament। ${DT('১৭')}`,'elev'),
 intBorder:L('Interosseous border','ইন্টারঅসিয়াস বর্ডার',`বাইরের দিকে উঁচু রেখা; interosseous membrane। ${DT('১৮')}`,'surf'),
 postBorder:L('Posterior border','পোস্টেরিয়র বর্ডার',`পুরোটা চামড়ার নিচে, ঢেউখেলানো; deep fascia দিয়ে FDP (উপরের ৩/৪), FCU (উপরের অর্ধেক), ECU (মাঝের ১/৩)। ${DT('১৮')}`,'surf'),
 antSurf:L('Anterior surface','অ্যান্টেরিয়র সারফেস',`উপরের ৩/৪-এ FDP, নিচের ১/৪-এ pronator quadratus। ${DT('১৮')}`,'surf'),
 medSurf:L('Medial surface','মিডিয়াল সারফেস',`FDP। ${DT('১৮')}`,'surf'),
 head:L('Head of ulna','আলনার হেড',PARTS[5].d,'joint',['lm','joint']),
 styloid:L('Styloid process','স্টাইলয়েড প্রসেস',PARTS[6].d,'elev'),
 ecuGroove:L('ECU-র খাঁজ','ECU গ্রুভ',`Styloid আর head-এর পেছনের মাঝে; extensor carpi ulnaris-এর tendon। ${DT('১৮')}`,'groove')
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],med:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const B={
 id:'ulna',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:560,
 modes:{
  parts:{layers:{},view:['lat',560],card:{t:'অংশগুলো',b:'উপরে বড়, নিচে সরু',d:`উপরের প্রান্ত বাঁকানো আঁকশির মতো (olecranon, coronoid, দুই notch); নিচে head আর styloid। Fibula-র সমতুল্য, forearm-এর ভেতরের (post-axial) হাড়। ${DT('১৪, ১৬')}`}},
  lm:{layers:{},view:['lat',560],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'পাশ থেকে trochlear notch আর radial notch সবচেয়ে ভালো দেখা যায়।'}},
  att:{layers:{},view:['ant',560],card:{t:'কোন মাসল কোথায় লাগে',b:'সামনে-ভেতরে FDP, পেছনে বুড়ো আঙুলের extensor',d:`পেছনের পৃষ্ঠের বাইরের সরু অংশে উপর থেকে APL, EPL, extensor indicis। ${DT('১৮')}`,l:[ZN]}},
  rel:{layers:{nerve:1,artery:1},view:['med',560],card:{t:'Ulnar nerve',b:'কনুইয়ের পেছন থেকে forearm-এ',d:`FCU-র দুই head-এর মাঝ দিয়ে ঢোকে, ulna-র ভেতরের দিকে থাকে। ${DT('১৩')}`,l:[SCH]}},
  joint:{layers:{vert:1},view:['lat',620],viewDist:620,card:{t:'জোড়াগুলো',b:'Elbow · দুই radio-ulnar',d:`Ulna elbow-এ বেশি অংশ নেয়, কিন্তু articular disc-এর জন্য wrist joint-এ যায় না। ${DT('১৪, ১৮')}`}},
  side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['ulnN','#f2c230'],['ulnA','#e0443e']],
 relAsMarkers:true,
 relLabels:[['ulnN','Ulnar nerve','rel','node'],['ulnA','Ulnar artery','rel','art'],['humerus','Humerus','joint','part'],['radius','Radius','joint','part']],
 muscleLabels:[],
 muscleView:r=>[[3,7,9,10].includes(r)?'post':[4,13].includes(r)?'lat':[11].includes(r)?'med':'ant',560],
 sideRules:['Olecranon উপরে','Trochlear notch সামনে','ধারালো interosseous border বাইরের দিকে '+`(${DT('১৮')})`],
 sideView:[0,0,1],sideDist:480,sideHint:'Olecranon উপরে আর notch সামনে রেখে ধারালো border কোন দিকে দেখুন।'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
