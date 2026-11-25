/* হাতের হাড়ের লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ১৯–২৫।
   PARTS নম্বর pipeline/limb.py-র hand() ids-এর সাথে মেলে: ১–৮ carpal, ৯–১৩ metacarpal, ১৪–২৭ phalanx। REG: মাসল; 8 = জোড়ার তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা হাড়ের উপরে';
const DT=p=>`Datta, পৃ. ${p}`;
const CARPAL={
 scaphoid:{c:'#f2c96b',t:'Scaphoid',b:'স্ক্যাফয়েড',d:`নৌকার মতো, লম্বা অক্ষ তির্যক; tubercle বাইরে-নিচে-সামনে মুখ করা, এটা দিয়েই পাশ চেনা যায়; tubercle-এ abductor pollicis brevis আর flexor retinaculum। জোড়া ৫টা হাড়ের সাথে: উপরে radius, নিচে trapezium ও trapezoid, ভেতরে lunate ও capitate-এর head। সরু কোমর ভাঙলে উপরের টুকরোয় রক্ত বন্ধ হয়ে avascular necrosis হতে পারে। Ossification ৫ বছর। ${DT('১৯–২০')}`},
 lunate:{c:'#e07a5f',t:'Lunate',b:'লুনেট',d:`অর্ধচন্দ্র আকার; উপরের উত্তল জোড়ার পৃষ্ঠ, চওড়া অ-জোড়া palmar পৃষ্ঠ, বাইরে অর্ধচন্দ্র জোড়ার পৃষ্ঠ (পাশ চেনার চিহ্ন)। একমাত্র carpal যার palmar পৃষ্ঠ dorsal-এর চেয়ে চওড়া, তাই সামনে স্থানচ্যুত হয়ে median nerve চাপতে পারে। জোড়া ৫টা: radius, capitate-এর head, hamate-এর কিনারা, scaphoid, triquetral। Ossification ৪ বছর। ${DT('১৯–২০')}`},
 triquetral:{c:'#81b29a',t:'Triquetral',b:'ট্রাইকোয়েট্রাল',d:`কীলকের মতো; palmar পৃষ্ঠে pisiform-এর জন্য ডিম্বাকার facet, উপরে-বাইরে চতুর্ভুজ facet (পাশ চেনার চিহ্ন)। জোড়া ৩টা হাড় আর disc: উপরে inferior radio-ulnar joint-এর articular disc, নিচে hamate, উপরে-বাইরে lunate, সামনে pisiform। Ossification ৩ বছর। ${DT('১৯–২১')}`},
 pisiform:{c:'#c9b6e8',t:'Pisiform',b:'পিসিফর্ম',d:`মটরের মতো, সবচেয়ে ছোট; dorsal পৃষ্ঠে triquetral-এর জন্য একটাই facet। FCU-র tendon-এ বসানো sesamoid বলে ধরা হয়: উপরে FCU-র insertion, নিচে abductor digiti minimi-র origin; flexor আর extensor retinaculum। সবার শেষে, ১২ বছরে ossify হয়। ${DT('২০–২১')}`},
 trapezium:{c:'#9fb8e8',t:'Trapezium',b:'ট্র্যাপিজিয়াম',d:`চতুর্ভুজ; নিচে saddle-আকার জোড়ার পৃষ্ঠ (১ম metacarpal: বুড়ো আঙুলের opposition-এর জন্য আলাদা গহ্বর), palmar পৃষ্ঠে খাড়া খাঁজ (FCR-এর tendon) আর তার বাইরের কিনারায় crest (পাশ চেনার চিহ্ন)। জোড়া ৪টা: scaphoid, ১ম metacarpal, trapezoid, ২য় metacarpal। Ossification ৬ বছর। ${DT('১৯–২১')}`},
 trapezoid:{c:'#a87bd1',t:'Trapezoid',b:'ট্র্যাপিজয়েড',d:`বুটের মতো; বড় নিচের জোড়ার পৃষ্ঠ সামনে-পেছনে রেখায় দুই ভাগ; ছোট palmar পৃষ্ঠের নিচে-বাইরে লেজের মতো "গোড়ালি" (পাশ চেনার চিহ্ন)। জোড়া ৪টা: scaphoid, ২য় metacarpal, trapezium, capitate। Ossification ৭ বছর। ${DT('২১')}`},
 capitate:{c:'#5fae7f',t:'Capitate',b:'ক্যাপিটেট',d:`সবচেয়ে বড় carpal আর সবার আগে (১ বছরে) ossify হয়; head উপরে scaphoid আর lunate-এর গর্তে, বাইরের পাশে সরু neck (পাশ চেনার চিহ্ন)। জোড়া ৭টা: scaphoid, lunate, ২য়-৩য়-৪র্থ metacarpal, trapezoid, hamate। ${DT('১৯–২১')}`},
 hamate:{c:'#e3a56a',t:'Hamate',b:'হ্যামেট',d:`কীলকের মতো, কিনারা উপরে; palmar পৃষ্ঠ থেকে hook বেরোয়, অবতল দিক বাইরে; hook-এর ডগার দিক দিয়ে পাশ চেনা। Hook-এ flexor retinaculum, opponens আর flexor digiti minimi; নিচ দিয়ে ulnar nerve ও artery-র deep branch। জোড়া ৫টা: lunate, ৪র্থ-৫ম metacarpal, capitate, triquetral। Ossification ১ বছর। ${DT('২০–২১')}`}
};
const MC={
 mc1:{c:'#f4a261',t:'1st metacarpal',b:'১ম মেটাকার্পাল',d:`ছোট আর মোটা; epiphysis base-এ (phalanx-এর মতো, তাই অনেকে একে পরিবর্তিত phalanx বলেন)। Base-এ saddle পৃষ্ঠ (trapezium), বাইরে APL-এর insertion। Palmar পৃষ্ঠের বড় বাইরের অংশে opponens pollicis। অন্যগুলোর চেয়ে সামনের তলে আর প্রায় ৯০° ভেতরে ঘোরানো। ${DT('২১–২২')}`},
 mc2:{c:'#e9c46a',t:'2nd metacarpal',b:'২য় মেটাকার্পাল',d:`সবচেয়ে লম্বা; base খাঁজকাটা, trapezoid-এর রেখায় বসে, trapezium আর capitate-এর মাঝে আটকানো, তাই প্রায় নড়ে না। Base-এর পেছনে ECRL, সামনে FCR-এর slip। ${DT('২১–২৩')}`},
 mc3:{c:'#e9c46a',t:'3rd metacarpal',b:'৩য় মেটাকার্পাল',d:`Base-এর পেছনে বাইরের দিকে styloid process (পাশ চেনার চিহ্ন); তার কাছে ECRB। Palmar রেখায় adductor pollicis-এর transverse head। ${DT('২৩')}`},
 mc4:{c:'#e9c46a',t:'4th metacarpal',b:'৪র্থ মেটাকার্পাল',d:`Base চতুর্ভুজ; hamate-এর সাথে, তাই ৫ম-এর মতো বেশি নড়ে। ${DT('২১, ২৩')}`},
 mc5:{c:'#e9c46a',t:'5th metacarpal',b:'৫ম মেটাকার্পাল',d:`Base-এর ভেতরে অ-জোড়া tubercle: পেছনে ECU, সামনে piso-metacarpal ligament। ভেতরের-সামনের অংশে opponens digiti minimi। ${DT('২৩–২৪')}`}
};
const PH={p:['Proximal','প্রক্সিমাল',`Base অবতল, metacarpal-এর head-এর সাথে MCP joint; head কপিকলের মতো। সব attachment base-এ। ${DT('২৪')}`],
 m:['Middle','মিডল',`দুই পাশে FDS-এর insertion; base-এর পেছনে dorsal digital expansion-এর slip। ${DT('২৪')}`],
 d:['Distal','ডিস্টাল',`Head-এর palmar পৃষ্ঠে ঘোড়ার খুরের মতো খসখসে tuberosity (আঙুলের ডগার pulp); পেছনে নখ। Base-এর সামনে FDP (বুড়ো আঙুলে FPL), পেছনে extensor (বুড়ো আঙুলে EPL)। ${DT('২৪')}`]};
const FN=['','বুড়ো আঙুল','তর্জনী','মধ্যমা','অনামিকা','কনিষ্ঠা'];
const ORDER=['scaphoid','lunate','triquetral','pisiform','trapezium','trapezoid','capitate','hamate','mc1','mc2','mc3','mc4','mc5','pp1','pp2','pp3','pp4','pp5','mp2','mp3','mp4','mp5','dp1','dp2','dp3','dp4','dp5'];
const PARTS={};
ORDER.forEach((k,i)=>{
 let o=CARPAL[k]||MC[k];
 if(!o){const t=k[0],f=+k[2],x=PH[t];o={c:t==='p'?'#cfd9c4':t==='m'?'#b5c7a6':'#9cb58c',t:`${x[0]} phalanx (${f===1?'thumb':['','','index','middle','ring','little'][f]})`,b:`${FN[f]}: ${x[1]} ফ্যালাংক্স`,d:x[2]}}
 PARTS[i+1]=o;
});
const REG={
 1:{c:'#f2a541',k:'fcu',t:'Flexor carpi ulnaris',b:'FCU',w:'Pisiform-এর সামনে-ভেতরের উপরের অংশ',d:DT('২০')},
 2:{c:'#5f7f9e',k:'ecrl',t:'Extensor carpi radialis longus',b:'ECRL',w:'২য় metacarpal-এর base-এর পেছনে',d:DT('২৩')},
 3:{c:'#3a6ea5',k:'ecrb',t:'Extensor carpi radialis brevis',b:'ECRB',w:'৩য় metacarpal-এর base-এর পেছনে, styloid-এর কাছে',d:DT('২৩')},
 4:{c:'#f28482',k:'fcr',t:'Flexor carpi radialis',b:'FCR',w:'২য় ও ৩য় metacarpal-এর base-এর সামনে (trapezium-এর খাঁজ দিয়ে)',d:DT('২০, ২৩')},
 5:{c:'#c9a227',k:'apl',t:'Abductor pollicis longus',b:'APL',w:'১ম metacarpal-এর base-এর বাইরে',d:DT('২২')},
 6:{c:'#8e6cc0',k:'adm',t:'Abductor digiti minimi',b:'ADM',w:'Pisiform-এর নিচের অংশ (origin); কনিষ্ঠার proximal phalanx-এর ভেতরে',d:DT('২০, ২৪')},
 7:{c:'#d1495b',k:'apb',t:'Abductor pollicis brevis',b:'APB',w:'Scaphoid-এর tubercle আর trapezium-এর crest (origin); বুড়ো আঙুলের proximal phalanx-এর বাইরে',d:DT('২০, ২৪')},
 9:{c:'#e07a5f',k:'op',t:'Opponens pollicis',b:'অপোনেন্স পলিসিস',w:'Trapezium-এর crest (origin); ১ম metacarpal-এর বাইরের-সামনের অংশ',d:DT('২০, ২২')},
 10:{c:'#a87bd1',k:'odm',t:'Opponens digiti minimi',b:'অপোনেন্স ডিজিটাই মিনিমাই',w:'Hamate-এর hook (origin); ৫ম metacarpal-এর ভেতরের-সামনের অংশ',d:DT('২০, ২৪')},
 11:{c:'#c77dce',k:'fdmb',t:'Flexor digiti minimi',b:'FDM',w:'Hamate-এর hook (origin); কনিষ্ঠার proximal phalanx',d:DT('২০, ২৪')},
 12:{c:'#ef8a62',k:'fpb',t:'Flexor pollicis brevis',b:'FPB',w:'Trapezium-এর crest (origin); বুড়ো আঙুলের proximal phalanx',d:DT('২০, ২৪')},
 13:{c:'#2a9d8f',k:'add',t:'Adductor pollicis',b:'অ্যাডাক্টর পলিসিস',w:'Oblique head: capitate, trapezoid, ২য়-৩য় metacarpal-এর base; transverse head: ৩য় metacarpal-এর palmar রেখা',d:DT('২০, ২৩')},
 14:{c:'#9bc53d',k:'dio',t:'Dorsal interossei',b:'ডরসাল ইন্টারঅসিয়াই',w:'পাশাপাশি দুই metacarpal-এর মুখোমুখি পৃষ্ঠ (দুই head)',d:`Insertion: তর্জনীর বাইরে, মধ্যমার দুই পাশে, অনামিকার ভেতরে। ${DT('২৩–২৪')}`},
 15:{c:'#3fa7a0',k:'pio',t:'Palmar interossei',b:'পামার ইন্টারঅসিয়াই',w:'একটা metacarpal-এর palmar পৃষ্ঠের সরু ফালি',d:`মধ্যমার দিক থেকে দূরের পাশে: তর্জনীর ভেতরে, অনামিকা আর কনিষ্ঠার বাইরে। ${DT('২৩–২৪')}`},
 16:{c:'#4c8fd6',k:'fdp',t:'Flexor digitorum profundus',b:'FDP',w:'ভেতরের চার আঙুলের distal phalanx-এর base, সামনে',d:DT('২৪')},
 17:{c:'#edae49',k:'fds',t:'Flexor digitorum superficialis',b:'FDS',w:'ভেতরের চার আঙুলের middle phalanx-এর দুই পাশে',d:DT('২৪')},
 18:{c:'#1c8fa0',k:'fpl',t:'Flexor pollicis longus',b:'FPL',w:'বুড়ো আঙুলের distal phalanx-এর base, সামনে',d:DT('২৪')},
 19:{c:'#7aa6d6',k:'epl',t:'Extensor pollicis longus',b:'EPL',w:'বুড়ো আঙুলের distal phalanx-এর base, পেছনে',d:DT('২৪')},
 20:{c:'#b5c7a6',k:'epb',t:'Extensor pollicis brevis',b:'EPB',w:'বুড়ো আঙুলের proximal phalanx-এর base, পেছনে',d:DT('২৪')},
 21:{c:'#5f6fae',k:'ext',t:'Extensor expansion',b:'ডরসাল ডিজিটাল এক্সপ্যানশন',w:'Middle আর distal phalanx-এর base-এর পেছনে (extensor digitorum, indicis, digiti minimi)',d:`Lumbrical, extensor indicis আর EDM proximal phalanx-এ সরাসরি লাগে না, expansion-এ মেশে। ${DT('২৪–২৫')}`},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'পাশের হাড় যেখানে ছোঁয়',d:'Carpal, CMC, MCP আর IP জোড়া।'}
};
const MUS_REG={fcu:1,ecrl:2,ecrb:3,fcr:4,apl:5,adm:6,apb:7,op:9,odm:10,fdmb:11,fpb:12,add:13,dio:14,pio:15,fdp:16,fds:17,fpl:18,epl:19,epb:20,ext:21};
const STR={
 ret:{t:'Flexor retinaculum',b:'ফ্লেক্সর রেটিনাকুলাম',d:`বাইরের স্তম্ভ (scaphoid-এর tubercle আর trapezium-এর crest) থেকে ভেতরের স্তম্ভ (pisiform আর hamate-এর hook): carpal-এর সামনের অবতলতাকে carpal tunnel বানায়। ভেতর দিয়ে FDS, FDP, FPL আর median nerve; FCR retinaculum-কে দুই স্তরে ভাগ করে trapezium-এর খাঁজে যায়। ${DT('১৯–২০')}`,l:[SCAN]},
 median:{t:'Median nerve',b:'মিডিয়ান নার্ভ',d:`Carpal tunnel-এর ভেতর দিয়ে হাতে ঢোকে; lunate সামনে সরে গেলে চাপ খায়। ${DT('১৯')}`,l:[SCH]},
 ulnarN:{t:'Ulnar nerve',b:'আলনার নার্ভ',d:`Retinaculum-এর উপর দিয়ে pisiform-এর বাইরে; deep branch hamate-এর hook-এর নিচ দিয়ে বাইরে ঘোরে। ${DT('২০')}`,l:[SCH]},
 ulnarA:{t:'Ulnar artery',b:'আলনার আর্টারি',d:`Nerve-এর বাইরে পাশে; deep branch hook-এর নিচ দিয়ে। ${DT('২০')}`,l:[SCH]},
 radius:{t:'Radius',b:'রেডিয়াস',d:'Scaphoid আর lunate-এর সাথে wrist joint।',l:[SCAN]},
 ulna:{t:'Ulna',b:'আলনা',d:'Articular disc দিয়ে carpal থেকে আলাদা।',l:[SCAN]}
};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 scaphTub:L('Tubercle of scaphoid','স্ক্যাফয়েডের টিউবারকল',CARPAL.scaphoid.d,'elev',['lm','tunnel']),
 trapCrest:L('Crest of trapezium','ট্র্যাপিজিয়ামের ক্রেস্ট',`Carpal arch-এর বাইরের স্তম্ভ; উপর থেকে APB, opponens pollicis, FPB-এর origin; retinaculum পুরো রেখায় লাগে। ${DT('২০')}`,'elev',['lm','tunnel']),
 pisiform:L('Pisiform','পিসিফর্ম',CARPAL.pisiform.d,'part',['lm','tunnel']),
 hookHam:L('Hook of hamate','হ্যামেটের হুক',CARPAL.hamate.d,'elev',['lm','tunnel']),
 capHead:L('Head of capitate','ক্যাপিটেটের হেড',CARPAL.capitate.d,'joint',['lm','joint']),
 lunatePalm:L('Lunate (palmar surface)','লুনেট',CARPAL.lunate.d,'part'),
 triq:L('Triquetral','ট্রাইকোয়েট্রাল',CARPAL.triquetral.d,'part'),
 trapezoid:L('Trapezoid','ট্র্যাপিজয়েড',CARPAL.trapezoid.d,'part'),
 mc3Styl:L('Styloid process of 3rd metacarpal','৩য় মেটাকার্পালের স্টাইলয়েড',MC.mc3.d,'elev',['lm','att']),
 mc5Tub:L('Tubercle of 5th metacarpal','৫ম মেটাকার্পালের টিউবারকল',MC.mc5.d,'elev',['lm','att']),
 mc1Base:L('Base of 1st metacarpal','১ম মেটাকার্পালের base',`Saddle পৃষ্ঠ trapezium-এর সাথে: বুড়ো আঙুলের carpo-metacarpal joint, আলাদা গহ্বর, opposition। ${DT('১৯, ২১–২২')}`,'joint',['lm','joint']),
 mc2Base:L('Base of 2nd metacarpal','২য় মেটাকার্পালের base',MC.mc2.d,'joint',['lm','joint']),
 mc4Base:L('Base of 4th metacarpal','৪র্থ মেটাকার্পালের base',MC.mc4.d,'joint',['lm','joint']),
 mc1Head:L('Head of 1st metacarpal','১ম মেটাকার্পালের head',`Palmar পৃষ্ঠে দুটো tubercle, তার উপর sesamoid হাড় সরে; বাইরেরটা বড়। ${DT('২২')}`,'part'),
 mc3Head:L('Head of 3rd metacarpal','মেটাকার্পালের head',`উত্তল, palmar দিকে বেশি ছড়ানো; proximal phalanx-এর সাথে MCP joint; মুঠো করলে knuckle। ${DT('২১')}`,'part'),
 pp3Base:L('Proximal phalanx (base)','প্রক্সিমাল ফ্যালাংক্সের base',PH.p[2],'joint',['lm','joint']),
 mp3:L('Middle phalanx','মিডল ফ্যালাংক্স',PH.m[2],'part'),
 dpTuft:L('Ungual tuberosity','ডিস্টাল ফ্যালাংক্সের ডগা',PH.d[2],'elev'),
 dp1:L('Distal phalanx of thumb','বুড়ো আঙুলের distal phalanx',`বুড়ো আঙুলে মাত্র দুটো phalanx। Base-এর সামনে FPL, পেছনে EPL। ${DT('২৪')}`,'part')
};
const VIEWS={palm:[0,0,1],dors:[0,0,-1],lat:[-1,0,.0001],med:[1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const WHICH_NAMES={scaphoid:'Scaphoid',lunate:'Lunate',triquetral:'Triquetral',pisiform:'Pisiform',trapezium:'Trapezium',trapezoid:'Trapezoid',capitate:'Capitate',hamate:'Hamate'};
const WHICH_RULES={
 scaphoid:['নৌকার মতো, তির্যক','বাইরে-নিচে-সামনে tubercle','৫টা হাড়ের সাথে জোড়া '+`(${DT('২০')})`],
 lunate:['অর্ধচন্দ্র','Palmar পৃষ্ঠ dorsal-এর চেয়ে চওড়া (একমাত্র)','বাইরে অর্ধচন্দ্র facet '+`(${DT('১৯–২০')})`],
 triquetral:['কীলক আকার','Palmar পৃষ্ঠে pisiform-এর ডিম্বাকার facet','উপরে-বাইরে চতুর্ভুজ facet '+`(${DT('২০–২১')})`],
 pisiform:['মটরের মতো, সবচেয়ে ছোট','একটাই facet, dorsal পৃষ্ঠের উপরের অংশে '+`(${DT('২০–২১')})`],
 trapezium:['নিচে saddle-আকার পৃষ্ঠ (১ম metacarpal)','Palmar খাঁজ আর তার বাইরে crest '+`(${DT('২১')})`],
 trapezoid:['বুটের মতো','নিচের পৃষ্ঠ রেখায় দুই ভাগ','Palmar দিকে লেজের মতো গোড়ালি '+`(${DT('২১')})`],
 capitate:['সবচেয়ে বড়','উপরে গোল head, বাইরে সরু neck','৭টা হাড়ের সাথে জোড়া '+`(${DT('২১')})`],
 hamate:['কীলক, কিনারা উপরে','Palmar পৃষ্ঠ থেকে hook, অবতল দিক বাইরে '+`(${DT('২১')})`]
};
const B={
 id:'hand',startMode:'parts',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:400,
 MK:[['part','হাড় বা অংশ'],['elev','উঁচু অংশ: tubercle, crest, hook'],['joint','জোড়ার তল বা base']],
 modes:{
  parts:{layers:{},view:['palm',400],card:{t:'হাতের কঙ্কাল',b:'৮ carpal · ৫ metacarpal · ১৪ phalanx',d:`Carpal দুই সারিতে, বাইরে থেকে ভেতরে: উপরে scaphoid, lunate, triquetral, pisiform; নিচে trapezium, trapezoid, capitate, hamate। হাড়ে ট্যাপ করলে নাম আর বিবরণ আসবে। ${DT('১৯')}`,l:['মনে রাখার ছড়া (ইংরেজি): "She Looks Too Pretty, Try To Catch Her"']}},
  lm:{layers:{},view:['palm',400],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'তালু থেকে carpal arch-এর চার স্তম্ভ; পিঠ থেকে metacarpal-এর base।'}},
  att:{layers:{},view:['palm',400],card:{t:'কোন মাসল কোথায় লাগে',b:'Thenar, hypothenar, interossei, লম্বা tendon',d:`তালু আর পিঠ দুদিক থেকে দেখুন। ${DT('২০–২৪')}`,l:[ZN]}},
  tunnel:{layers:{organ:1,nerve:1,artery:1},view:[window.DATA.meta.tunnelView,190,window.DATA.meta.retC],viewDist:190,card:{t:'Carpal tunnel',b:'Carpal arch + flexor retinaculum',d:STR.ret.d,l:['Retinaculum স্ক্যান থেকে; median ও ulnar nerve আর ulnar artery স্কিম্যাটিক']}},
  joint:{layers:{vert:1},view:['palm',520],viewDist:520,card:{t:'জোড়াগুলো',b:'Wrist · Midcarpal · CMC · MCP · IP',d:`উপরের সারির তিনটা (pisiform বাদে) মিলে wrist joint-এর উত্তল পৃষ্ঠ। দুই সারির মাঝে S আকারের midcarpal joint (flexion-extension)। নিচের সারি পাঁচ metacarpal-এর base-এ। ${DT('১৯')}`}},
  which:{layers:{}},side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['ret','#cfd6dc'],['median','#f2c230'],['ulnarN','#f2c230'],['ulnarA','#e0443e']],
 relAsMarkers:true,
 relLabels:[['ret','Flexor retinaculum','tunnel','part'],['median','Median nerve','tunnel','node'],['ulnarN','Ulnar nerve','tunnel','node'],['ulnarA','Ulnar artery','tunnel','art']],
 muscleLabels:[],
 muscleView:r=>[[2,3,14,19,20,21].includes(r)?'dors':'palm',400],
 whichSrc:'data/which.js',whichNames:WHICH_NAMES,whichRules:WHICH_RULES,whichQ:'এটা কোন carpal হাড়?',whichHint:'আকার, facet-এর সংখ্যা আর tubercle বা hook দেখুন।',whichView:[0,.3,1],whichDist:85,
 sideRules:['Scaphoid: tubercle বাইরে, নিচে আর সামনে মুখ করা; এটা দিয়েই পাশ চেনা '+`(${DT('২০')})`,'বড় অবতল পৃষ্ঠ (capitate-এর জন্য) ভেতরের দিকে'],
 sideView:[0,0,1],sideDist:85,sideHint:'এটা scaphoid। Tubercle কোন দিকে দেখুন।',
 partLabel:'হাড়'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
