/* রেডিয়াসের লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ১৪–১৬, ১৮–১৯।
   REG নম্বর pipeline/limb.py-র radius() MUS-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে';
const DT=p=>`Datta, পৃ. ${p}`;
const PARTS={
 1:{c:'#f2c96b',t:'Head',b:'হেড',d:`চাকতির মতো; উপরের অবতল পৃষ্ঠ capitulum-এর সাথে (humero-radial), চারপাশের কিনারা (ভেতরে চওড়া) ulna-র radial notch আর annular ligament-এর সাথে (superior radio-ulnar joint)। ${DT('১৪')}`},
 2:{c:'#c9b6e8',t:'Neck',b:'নেক',d:`Head-এর নিচের সরু অংশ; annular ligament-এর নিচের অংশ ঘিরে থাকে। ${DT('১৪')}`},
 3:{c:'#e07a5f',t:'Radial tuberosity',b:'রেডিয়াল টিউবারোসিটি',d:`Neck-এর নিচে ভেতরের দিকে; পেছনের খসখসে অংশে biceps-এর tendon (মোচড় খেয়ে), সামনের মসৃণ অংশে bursa। নিচের মাথায় oblique cord। ${DT('১৪–১৫')}`},
 4:{c:'#e9e1cf',t:'Shaft',b:'শ্যাফট',d:`মাঝের ১/৩-এ কাটলে ত্রিকোণ; তিন বর্ডার (anterior, posterior, interosseous) আর তিন পৃষ্ঠ (anterior, posterior, lateral)। ${DT('১৫')}`},
 5:{c:'#9fb8e8',t:'Lower end',b:'নিচের প্রান্ত',d:`হাড়ের সবচেয়ে চওড়া অংশ; নিচের carpal পৃষ্ঠ scaphoid আর lunate-এর সাথে wrist joint, ভেতরে ulnar notch। ${DT('১৬')}`},
 6:{c:'#81b29a',t:'Styloid process',b:'স্টাইলয়েড প্রসেস',d:`বাইরের পৃষ্ঠ থেকে নিচে নামে; ulna-র styloid-এর চেয়ে প্রায় ২ সেমি নিচে। ডগায় lateral carpal ligament, উপরে brachioradialis। ${DT('১৬, ১৮')}`}
};
const REG={
 1:{c:'#e07a5f',k:'bic',t:'Biceps brachii',b:'বাইসেপস',w:'Radial tuberosity-র পেছনের অংশ (insertion)',d:DT('১৫')},
 2:{c:'#5fae7f',k:'sup',t:'Supinator',b:'সুপিনেটর',w:'Lateral পৃষ্ঠের উপরের অংশ (সামনে-পেছনে ছড়ানো)',d:`দুই স্তরের মাঝ দিয়ে posterior interosseous nerve। ${DT('১৬')}`},
 3:{c:'#f28482',k:'pt',t:'Pronator teres',b:'প্রোনেটর টেরেস',w:'Lateral পৃষ্ঠের মাঝের উঁচু খসখসে ছাপ',d:DT('১৬')},
 4:{c:'#edae49',k:'fds',t:'Flexor digitorum superficialis (radial head)',b:'FDS',w:'Anterior border-এর উপরের তির্যক অংশ',d:DT('১৫')},
 5:{c:'#4c8fd6',k:'fpl',t:'Flexor pollicis longus',b:'FPL',w:'Anterior পৃষ্ঠের উপরের ২/৩',d:DT('১৫')},
 6:{c:'#8e6cc0',k:'pq',t:'Pronator quadratus',b:'প্রোনেটর কোয়াড্রেটাস',w:'Anterior পৃষ্ঠের নিচের ১/৪ আর ভেতরের ত্রিকোণ এলাকা',d:DT('১৫')},
 7:{c:'#c9a227',k:'apl',t:'Abductor pollicis longus',b:'APL',w:'Posterior পৃষ্ঠের উপরের অংশ',d:DT('১৬')},
 9:{c:'#9bc53d',k:'epb',t:'Extensor pollicis brevis',b:'EPB',w:'Posterior পৃষ্ঠের নিচের অংশ',d:DT('১৬')},
 10:{c:'#a87bd1',k:'br',t:'Brachioradialis',b:'ব্র্যাকিওরেডিয়ালিস',w:'Styloid-এর ঠিক উপরে lateral পৃষ্ঠ (insertion)',d:DT('১৬')},
 11:{c:'#7aa6d6',k:'iom',t:'Interosseous membrane',b:'ইন্টারঅসিয়াস মেমব্রেন',w:'Interosseous border',d:`উপরের মুক্ত কিনারা আর oblique cord-এর ফাঁক দিয়ে posterior interosseous vessels (নার্ভ না)। ${DT('১৫')}`},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'Head, ulnar notch, carpal পৃষ্ঠ',d:'Elbow, দুই radio-ulnar আর wrist joint।'}
};
const MUS_REG={bic:1,sup:2,pt:3,fds:4,fpl:5,pq:6,apl:7,epb:9,br:10,iom:11};
const STR={
 pin:{t:'Posterior interosseous nerve',b:'পোস্টেরিয়র ইন্টারঅসিয়াস নার্ভ',d:`Radial nerve-এর deep branch; supinator-এর দুই স্তরের মাঝ দিয়ে হাড়ের পাশ ঘেঁষে পেছনে যায়। নিচে extensor digitorum-এর খাঁজে। ${DT('১৬')}`,l:[SCH]},
 radA:{t:'Radial artery',b:'রেডিয়াল আর্টারি',d:`নিচের প্রান্তের সামনের পৃষ্ঠে, pronator quadratus-এর নিচে এখানে pulse টের পাওয়া যায়। ${DT('১৬')}`,l:[SCH]},
 eplT:{t:'Extensor pollicis longus tendon',b:'EPL টেন্ডন',d:`Dorsal tubercle (Lister)-এর ভেতরের খাঁজ দিয়ে, tubercle-কে কপিকল হিসেবে ব্যবহার করে বুড়ো আঙুলে যায়। ${DT('১৬')}`,l:[SCH]},
 humerus:{t:'Humerus',b:'হিউমেরাস',d:'Capitulum-এর সাথে head।',l:[SCAN]},
 ulna:{t:'Ulna',b:'আলনা',d:'উপরে radial notch, নিচে head of ulna; মাঝে interosseous membrane।',l:[SCAN]},
 scaphoid:{t:'Scaphoid',b:'স্ক্যাফয়েড',d:'Carpal পৃষ্ঠের বাইরের ত্রিকোণ অংশ।',l:[SCAN]},
 lunate:{t:'Lunate',b:'লুনেট',d:'Carpal পৃষ্ঠের ভেতরের চতুর্ভুজ অংশ।',l:[SCAN]}
};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 head:L('Head: উপরের পৃষ্ঠ','হেড',PARTS[1].d,'joint',['lm','joint']),
 headRim:L('Head: কিনারা','হেডের কিনারা',`ভেতরে ulna-র radial notch, বাকিটা annular ligament-এ ঘেরা; সোজা কনুইয়ের পেছনে বাইরের খাঁজে pronation-supination-এ ঘোরা টের পাওয়া যায়। ${DT('১৪')}`,'joint',['lm','joint']),
 neck:L('Neck','নেক',PARTS[2].d,'part'),
 radTub:L('Radial tuberosity','রেডিয়াল টিউবারোসিটি',PARTS[3].d,'elev',['lm','att']),
 ptImp:L('Pronator teres-এর ছাপ','মাঝের উঁচু ছাপ',`Lateral পৃষ্ঠের সবচেয়ে উঁচু জায়গায়, শ্যাফটের মাঝে। ${DT('১৬')}`,'elev',['lm','att']),
 intBorder:L('Interosseous border','ইন্টারঅসিয়াস বর্ডার',`ধারালো, ভেতরের দিকে; ulna-র সাথে interosseous membrane। ${DT('১৫')}`,'surf'),
 antBorder:L('Anterior border','অ্যান্টেরিয়র বর্ডার',`উপরে তির্যক (FDS-এর radial head), নিচের ১/৪-এ খাড়া উঁচু রেখা। ${DT('১৫')}`,'surf'),
 postBorder:L('Posterior border','পোস্টেরিয়র বর্ডার',`মাঝের ১/৩-এ স্পষ্ট। ${DT('১৫')}`,'surf'),
 antSurf:L('Anterior surface','অ্যান্টেরিয়র সারফেস',`হালকা অবতল; উপরের ২/৩-এ FPL, নিচের ১/৪-এ pronator quadratus। ${DT('১৫')}`,'surf'),
 nutrient:L('Nutrient foramen','নিউট্রিয়েন্ট ফোরামেন',`শ্যাফটের মাঝের কাছে, সামনের পৃষ্ঠে; কনুইয়ের দিকে মুখ করা। (অবস্থান আনুমানিক) ${DT('১৫')}`,'groove'),
 styloid:L('Styloid process','স্টাইলয়েড প্রসেস',PARTS[6].d,'elev'),
 ulnarNotch:L('Ulnar notch','আলনার নচ',`নিচের প্রান্তের ভেতরে; ulna-র head-এর সাথে inferior radio-ulnar joint। নিচের কিনারায় articular disc-এর গোড়া; তাই ulna wrist joint-এ যায় না। ${DT('১৬')}`,'joint',['lm','joint']),
 lister:L('Dorsal tubercle (Lister)','লিস্টারের টিউবারকল',`পেছনের পৃষ্ঠে টের পাওয়া যায়; বাইরের খাঁজে ECRL ও ECRB, ভেতরের ঠিক পাশের খাঁজে EPL, আরও ভেতরে extensor digitorum, extensor indicis আর posterior interosseous nerve। ${DT('১৬')}`,'elev',['lm','rel']),
 carpalSurf:L('Carpal articular surface','কার্পাল পৃষ্ঠ',`অবতল; রেখা দিয়ে বাইরের ত্রিকোণ (scaphoid) আর ভেতরের চতুর্ভুজ (lunate) অংশ: wrist joint। ${DT('১৬')}`,'joint',['lm','joint']),
 antLowerRidge:L('নিচের প্রান্তের সামনের উঁচু অংশ','অ্যান্টেরিয়র রিজ',`মোটা উঁচু রেখা, palmar radio-carpal ligament; এর ঠিক উপরে radial pulse। ${DT('১৬')}`,'elev',['lm','rel'])
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],med:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const B={
 id:'radius',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:520,
 modes:{
  parts:{layers:{},view:['ant',520],card:{t:'অংশগুলো',b:'উপরে সরু, নিচে চওড়া',d:`উপরের প্রান্তে head, neck, tuberosity; নিচের প্রান্ত সবচেয়ে চওড়া, styloid-সহ। Tibia-র সমতুল্য, forearm-এর বাইরের হাড়। ${DT('১৪')}`}},
  lm:{layers:{},view:['ant',520],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'সামনে, পেছনে আর পাশ থেকে দেখুন; শুধু দেখা পাশের মার্ক আসবে।'}},
  att:{layers:{},view:['ant',520],card:{t:'কোন মাসল কোথায় লাগে',b:'সামনে flexor, পেছনে বুড়ো আঙুলের extensor',d:`Lateral পৃষ্ঠে supinator আর pronator teres: ঘোরানোর দুই মাসল। ${DT('১৫–১৬')}`,l:[ZN]}},
  rel:{layers:{nerve:1,artery:1,organ:1},view:['lat',520],card:{t:'নার্ভ, নালী, টেন্ডন',b:'PIN · Radial artery · EPL',d:`Supinator-এর মাঝ দিয়ে posterior interosseous nerve; নিচে সামনে radial artery-র pulse; পেছনে Lister-এর পাশে EPL। ${DT('১৬')}`,l:[SCH]}},
  joint:{layers:{vert:1},view:['ant',600],viewDist:600,card:{t:'জোড়াগুলো',b:'Elbow · দুই radio-ulnar · Wrist',d:`শুধু radius (articular disc-এর সাহায্যে) wrist joint-এ যায়; elbow-এ ulna বেশি অংশ নেয়। ${DT('১৪')}`}},
  side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['pin','#f2c230'],['radA','#e0443e'],['eplT','#f4efe2']],
 relAsMarkers:true,
 relLabels:[['pin','Posterior interosseous nerve','rel','node'],['radA','Radial artery','rel','art'],['eplT','EPL tendon','rel','part'],['humerus','Humerus','joint','part'],['ulna','Ulna','joint','part'],['scaphoid','Scaphoid','joint','part'],['lunate','Lunate','joint','part']],
 muscleLabels:[],
 muscleView:r=>[[7,9].includes(r)?'post':[2,3,10].includes(r)?'lat':r===11?'med':'ant',520],
 sideRules:['চাকতির মতো head উপরে','শ্যাফটের হালকা অবতলতা সামনে','Styloid বাইরের দিকে '+`(${DT('১৬')})`],
 sideView:[0,0,1],sideDist:460,sideHint:'Head উপরে রেখে styloid কোন দিকে আর শ্যাফটের অবতলতা কোন দিকে দেখুন।'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
