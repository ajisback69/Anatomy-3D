/* রিবের সব লেখা ও কনফিগারেশন। দুটো স্পেসিমেন: first (1st rib) আর typical (6th rib)।
   পেজের URL-এর #first বা #typical দেখে window.SPEC ঠিক হয় (index.html-এ)।
   REG-এর নম্বরগুলো pipeline/ribs.py-এর muscles/vessels-এর সাথে মেলে। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক (বইয়ের বর্ণনা অনুযায়ী, মাপা ল্যান্ডমার্কে বসানো)';
const ART={c:'#8fd3d6',k:null,t:'Articular surface',b:'জয়েন্টের তল',w:'Head-এর facet, tubercle-এর facet, সামনের প্রান্ত',d:'কশেরুকা আর costal cartilage এখানে জোড়া লাগে। আসল হাড় যেখানে ছোঁয় সেখানে রং করা।'};
const PARTS={
 1:{c:'#f2c96b',t:'Head',b:'হেড (মাথা)',d:'পেছনের-ভেতরের প্রান্ত, কশেরুকার body-র সাথে জোড়া লাগে।'},
 2:{c:'#e7a8c9',t:'Neck',b:'নেক (গলা)',d:'Head আর tubercle-এর মাঝের সরু অংশ।'},
 3:{c:'#8cc0b0',t:'Tubercle',b:'টিউবারকল',d:'Neck আর shaft-এর জোড়ায় পেছনের দিকে উঁচু অংশ, transverse process-এর সাথে জোড়া লাগে।'},
 4:{c:'#f1ece0',t:'Shaft (body)',b:'শ্যাফট',d:'রিবের লম্বা, বাঁকানো মূল অংশ।'},
 5:{c:'#9fb8e8',t:'Anterior (sternal) end',b:'সামনের প্রান্ত',d:'Costal cartilage-এর সাথে জোড়া লাগে।'}
};
const VIEWS_FIRST={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],sup:[0,1,.05],med:[1,0,.0001],obl:[-.6,.6,.5]};
const VIEWS_TYP={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],sup:[0,1,.05],med:[1,0,.0001],obl:[-.45,.45,-.77],medant:[.55,.05,.83]};

/* ======================= 1st rib ======================= */
const FIRST={
 id:'rib-first',PARTS,views:VIEWS_FIRST,target:[0,0,0],dist:260,
 REG:{
  1:{c:'#d1495b',k:'scalAnt',t:'Scalenus anterior',b:'স্ক্যালেনাস অ্যান্টেরিয়র',w:'Inner border-এর scalene tubercle আর তার কাছের superior surface',d:'C3–C6 transverse process থেকে নেমে এখানে লাগে। এর সামনে দিয়ে subclavian vein, পেছন দিয়ে subclavian artery যায়, তাই tubercle-টা দুই groove-এর মাঝে থাকে।'},
  2:{c:'#edae49',k:'scalMed',t:'Scalenus medius',b:'স্ক্যালেনাস মিডিয়াস',w:'Superior surface-এ subclavian artery-র groove-এর পেছনের খসখসে জায়গা (tubercle-এর সামনে)',d:'C1/C2–C7 transverse process থেকে আসে। Brachial plexus এর আর scalenus anterior-এর মাঝ দিয়ে বের হয়।'},
  3:{c:'#5fae7f',k:'serrAnt',t:'Serratus anterior (first digitation)',b:'সেরাটাস অ্যান্টেরিয়র',w:'Outer border-এ, artery-র groove-এর পেছনে',d:'প্রথম digitation 1st ও 2nd রিব থেকে আসে, scapula-র medial border-এ লাগে। Long thoracic nerve।'},
  4:{c:'#1c8fa0',k:'subclavius',t:'Subclavius',b:'সাবক্ল্যাভিয়াস',w:'সামনের প্রান্তে, রিব আর costal cartilage-এর জোড়ার উপরে',d:'Clavicle-এর নিচের তলে subclavian groove-এ লাগে। Clavicle-কে নিচে ও ভেতরে টেনে রাখে।'},
  5:{c:'#f28482',k:'extIC',t:'Intercostal muscles (1st space)',b:'ইন্টারকস্টাল মাসল',w:'Outer border',d:'প্রথম intercostal space-এর external ও internal intercostal outer border থেকে শুরু হয়ে 2nd রিবে যায়।'},
  6:{c:'#8e6cc0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle-এর কাছে, পেছনে',d:'C7-এর transverse process থেকে নেমে 1st রিবের tubercle আর angle-এর মাঝে লাগে।'},
  7:{c:'#3b82d6',k:'iliocost',t:'Iliocostalis thoracis',b:'ইলিওকস্টালিস',w:'Tubercle-এর বাইরে, পেছনের দিকে',d:'Erector spinae-র অংশ, উপরের ছয়টা রিবের angle-এ লাগে।'},
  13:{c:'#c2a35a',k:'scalPost',t:'Scalenus posterior',b:'স্ক্যালেনাস পোস্টেরিয়র',w:'1st রিবে লাগে না, 2nd রিবের outer surface-এ লাগে',d:'ভাইভায় প্রায়ই ধরে: scalenus anterior আর medius 1st রিবে, scalenus posterior 2nd রিবে লাগে। মডেলে মাসলটা দেখানো আছে, কিন্তু 1st রিবে কোনো ছাপ নেই।'},
  11:{c:'#e0443e',lm:1,k:null,t:'Groove for subclavian artery',b:'সাবক্ল্যাভিয়ান আর্টারির খাঁজ',w:'Superior surface, scalene tubercle-এর পেছনে',d:'Subclavian artery আর brachial plexus-এর lower trunk এই খাঁজে থাকে। মডেলে আসল subclavian artery রিবকে যেখানে ছোঁয় সেখানে রং করা।'},
  12:{c:'#4a78e0',lm:1,k:null,t:'Groove for subclavian vein',b:'সাবক্ল্যাভিয়ান ভেইনের খাঁজ',w:'Superior surface, scalene tubercle-এর সামনে',d:'Subclavian vein এই খাঁজে থাকে, scalenus anterior-এর সামনে। আসল ভেইনের ছোঁয়ার জায়গা।'},
  8:ART
 },
 MUS_REG:{scalAnt:1,scalMed:2,serrAnt:3,subclavius:4,extIC:5,lev:6,iliocost:7,scalPost:13},
 STR:{
  rsa:{t:'Subclavian artery',b:'সাবক্ল্যাভিয়ান আর্টারি',d:'1st রিবের superior surface-এ scalene tubercle-এর পেছনের খাঁজে থাকে, scalenus anterior-এর পেছনে। 1st রিবের outer border পার হলে axillary artery নাম হয়।',l:['Scalenus anterior একে তিন ভাগে ভাগ করে','প্রথম ভাগ থেকে internal thoracic artery বের হয়',SCAN]},
  rscv:{t:'Subclavian vein',b:'সাবক্ল্যাভিয়ান ভেইন',d:'Scalene tubercle-এর সামনের খাঁজে থাকে, scalenus anterior-এর সামনে। Internal jugular vein-এর সাথে মিলে brachiocephalic vein হয়।',l:['Central line বসানোর জায়গা: clavicle আর 1st রিবের মাঝে',SCAN]},
  rcca:{t:'Common carotid artery',b:'কমন ক্যারোটিড',d:'1st রিবের ভেতরের দিক দিয়ে গলায় ওঠে।',l:[SCAN]},
  bct:{t:'Brachiocephalic trunk',b:'ব্র্যাকিওসেফালিক ট্রাঙ্ক',d:'Right sternoclavicular joint-এর পেছনে subclavian আর common carotid-এ ভাগ হয়।',l:[SCAN]},
  rbcv:{t:'Brachiocephalic vein',b:'ব্র্যাকিওসেফালিক ভেইন',d:'Subclavian আর internal jugular vein মিলে তৈরি হয়, 1st costal cartilage-এর পেছনে।',l:[SCAN]},
  lung:{t:'Apex of lung ও cervical pleura',b:'ফুসফুসের চূড়া',d:'1st রিবের inner border-এর ভেতর দিয়ে গলায় প্রায় 2.5 cm উঠে থাকে। উপরে suprapleural membrane (Sibson\'s fascia) ঢেকে রাখে, যা inner border-এ লাগে।',l:['Pancoast tumour (apex-এর ক্যান্সার) neck-এর সামনের জিনিস, অর্থাৎ sympathetic trunk ও T1 নার্ভে চাপ দেয়: Horner syndrome, হাতের ছোট মাসল দুর্বল',SCAN]},
  symp:{t:'Sympathetic trunk',b:'সিমপ্যাথেটিক ট্রাঙ্ক',d:'Neck-এর সামনে, সবচেয়ে ভেতরের (medial) জিনিস। এখানে cervicothoracic (stellate) ganglion থাকে।',l:['Neck-এর সামনে ভেতর থেকে বাইরে: sympathetic trunk, 1st posterior intercostal vein, superior intercostal artery, T1 ventral ramus',SCH]},
  piv1:{t:'First posterior intercostal vein',b:'১ম পোস্টেরিয়র ইন্টারকস্টাল ভেইন',d:'Neck-এর সামনে, sympathetic trunk-এর বাইরে।',l:[SCH]},
  sia:{t:'Superior intercostal artery',b:'সুপিরিয়র ইন্টারকস্টাল আর্টারি',d:'Costocervical trunk-এর শাখা। Neck-এর সামনে দিয়ে নেমে 1st আর 2nd intercostal space-কে রক্ত দেয়।',l:[SCH]},
  t1:{t:'Ventral ramus of T1',b:'T1 নার্ভ',d:'Neck-এর সামনে সবচেয়ে বাইরের জিনিস। রিবের উপরে উঠে C8-এর সাথে মিলে brachial plexus-এর lower trunk তৈরি করে।',l:[SCH]},
  lowerTrunk:{t:'Lower trunk of brachial plexus',b:'ব্র্যাকিয়াল প্লেক্সাসের লোয়ার ট্রাঙ্ক',d:'C8 + T1 মিলে তৈরি। Superior surface-এ subclavian artery-র পেছনে খাঁজে থাকে।',l:['Cervical rib থাকলে এটা চাপ খায়: হাতের ভেতরের দিকে ঝিনঝিন, ছোট মাসল দুর্বল (thoracic outlet syndrome)',SCH]},
  vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'1st রিবের head শুধু T1-এর body-র সাথে, আর tubercle T1-এর transverse process-এর সাথে জোড়া লাগে।',l:[SCAN]}
 },
 relLegend:[['rsa','#e0443e'],['rscv','#4a78e0'],['lowerTrunk','#f2c230'],['t1','#f2c230'],['symp','#d9b23a'],['sia','#ff6b5e'],['piv1','#7aa0ff'],['lung','#f0b8b2'],['bct','#e0443e'],['rbcv','#4a78e0']],
 relLabels:[['rsa','Subclavian a.'],['rscv','Subclavian v.'],['lowerTrunk','Lower trunk'],['symp','Sympathetic trunk'],['t1','T1 nerve'],['sia','Sup. intercostal a.'],['lung','Apex of lung']],
 muscleLabels:[['scalAnt','Scalenus anterior'],['scalMed','Scalenus medius'],['scalPost','Scalenus posterior'],['serrAnt','Serratus anterior'],['subclavius','Subclavius']],
 lms:{
  headFacet:{t:'Head (single facet)',b:'হেড, একটাই facet',lab:'Head',show:['lm','joint'],d:'ছোট, গোল, একটাই facet। শুধু T1-এর body-র সাথে জোড়া লাগে, তাই typical রিবের মতো দুই facet বা crest নেই।',l:['জয়েন্ট: synovial plane, একটাই cavity']},
  neck:{t:'Neck',b:'নেক',lab:'Neck',d:'গোল, উপরে-পেছনে-বাইরে মুখ করা।',l:['সামনে (ভেতর থেকে বাইরে): sympathetic trunk, 1st posterior intercostal vein, superior intercostal artery, T1 ventral ramus','উপরে: deep cervical vessels, C8 ventral ramus']},
  tubFacet:{t:'Tubercle',b:'টিউবারকল',lab:'Tubercle',show:['lm','joint'],d:'বড় ও উঁচু। 1st রিবে tubercle আর angle একই জায়গায় থাকে।',l:['T1-এর transverse process-এর সাথে costotransverse joint (synovial)','Lateral costotransverse ligament লাগে']},
  scalTub:{t:'Scalene tubercle',b:'স্ক্যালেন টিউবারকল',lab:'Scalene tubercle',d:'Inner border-এর ছোট উঁচু জায়গা। Scalenus anterior এখানে লাগে, আর এটা দুই groove-এর মাঝে থাকে।',l:['মডেলে আসল scalenus anterior রিবকে যেখানে ছোঁয় সেখানে পিন']},
  grooveA:{t:'Groove for subclavian artery',b:'আর্টারির খাঁজ',lab:'Groove: subclavian a.',d:'Scalene tubercle-এর পেছনে। Subclavian artery আর lower trunk of brachial plexus থাকে।',l:['এর পেছনে scalenus medius-এর জায়গা']},
  grooveV:{t:'Groove for subclavian vein',b:'ভেইনের খাঁজ',lab:'Groove: subclavian v.',d:'Scalene tubercle-এর সামনে। Subclavian vein থাকে।',l:['মনে রাখার কৌশল: VAN সামনে থেকে পেছনে, vein → (scalenus anterior) → artery → nerve']},
  ccl:{t:'Costoclavicular ligament impression',b:'কস্টোক্ল্যাভিকুলার লিগামেন্ট',lab:'Costoclavicular lig.',d:'সামনের প্রান্তের উপরে, যেখানে clavicle সবচেয়ে কাছে আসে। এখান থেকে লিগামেন্ট clavicle-এ যায়।',l:['মডেলে রিবের যে বিন্দু clavicle-এর সবচেয়ে কাছে, সেখানে পিন','এর সামনে subclavius লাগে']},
  antEnd:{t:'Anterior end',b:'সামনের প্রান্ত',lab:'Anterior end',show:['lm','joint'],d:'সবচেয়ে বড় ও মোটা। 1st costal cartilage-এর সাথে জোড়া লাগে।',l:['Costochondral joint: primary cartilaginous','1st cartilage আর manubrium: primary cartilaginous (synchondrosis)']},
  supSurf:{t:'Superior surface',b:'উপরের পৃষ্ঠ',lab:'Sup. surface',surf:1,d:'চওড়া, চ্যাপ্টা। দুটো groove আর scalene tubercle এই পৃষ্ঠে।'},
  infSurf:{t:'Inferior surface',b:'নিচের পৃষ্ঠ',lab:'Inf. surface',surf:1,d:'মসৃণ, কোনো costal groove নেই। Pleura দিয়ে ঢাকা।'},
  outBorder:{t:'Outer border',b:'বাইরের বর্ডার',lab:'Outer border',surf:1,d:'উত্তল; পেছনে মোটা, সামনে পাতলা। Intercostal muscle আর serratus anterior লাগে।'},
  inBorder:{t:'Inner border',b:'ভেতরের বর্ডার',lab:'Inner border',surf:1,d:'অবতল। Scalene tubercle আর suprapleural membrane (Sibson\'s fascia) এখানে।'}
 },
 modes:{
  parts:{layers:{},view:['sup',260],card:{t:'পাঁচটা অংশ',b:'Head · Neck · Tubercle · Shaft · Anterior end',d:'রঙ দিয়ে অংশগুলো আলাদা করা। 1st রিবে tubercle আর angle একই জায়গায়, তাই আলাদা angle নেই।'}},
  lm:{layers:{},view:['sup',260],card:{t:'পিনে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'উপর থেকে দেখলে দুটো groove আর scalene tubercle সবচেয়ে ভালো দেখা যায়। লাল খাঁজে artery, নীল খাঁজে vein: আসল ভেসেল যেখানে ছোঁয় সেখানে রং করা।'}},
  att:{layers:{muscle:1},view:['obl',420],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'মাসলগুলো স্ক্যান থেকে নেওয়া, শুধু রিবের আশপাশের অংশ রাখা হয়েছে। তালিকা থেকে একটা মাসল বেছে নিলে শুধু সেটা গাঢ় হবে।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['obl',330],viewDist:330,card:{t:'1st রিবের চারপাশে কী আছে',b:'থোরাসিক ইনলেট',d:'1st রিব থোরাসিক ইনলেটের পাশের সীমানা। উপরে subclavian vessels আর brachial plexus, নিচে ফুসফুসের apex। লাল আর্টারি, নীল ভেইন, হলুদ নার্ভ।'}},
  joint:{layers:{vert:1,rib:1},view:['obl',380],card:{t:'1st রিব কোথায় কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'পেছনে T1-এর সাথে দুটো জোড়া (head আর tubercle), সামনে costal cartilage।',l:['Head ↔ T1 body: synovial, একটাই facet','Tubercle ↔ T1 transverse process: synovial','Anterior end ↔ 1st costal cartilage: primary cartilaginous']}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>['obl',420],
 sideView:[0,1,.25],sideDist:240,
 sideHint:'উপরে দুটো খাঁজওয়ালা চ্যাপ্টা পৃষ্ঠ আর সামনের মোটা প্রান্ত খুঁজুন।',
 sideRules:['খাঁজওয়ালা চ্যাপ্টা পৃষ্ঠ (superior surface) উপরে রাখুন','বড়, মোটা প্রান্ত (anterior end) সামনে রাখুন','তখন head নিচে-পেছনে-ভেতরে থাকবে, আর উত্তল outer border যেদিকে মুখ করে থাকবে রিবটা সেই পাশের','মিলিয়ে নিন: scalene tubercle থাকে inner border-এ, যা মধ্যরেখার দিকে মুখ করে'],
 holdView:[[0,1,.25],260],
 lmQuizSkipSurf:true
};

/* ======================= typical rib (6th) ======================= */
const TYP={
 id:'rib-typical',PARTS,views:VIEWS_TYP,target:[0,0,0],dist:520,
 REG:{
  1:{c:'#5fae7f',k:'serrAnt',t:'Serratus anterior',b:'সেরাটাস অ্যান্টেরিয়র',w:'Outer surface, সামনের-পাশের অংশে',d:'উপরের ৮–৯টা রিব থেকে আলাদা আলাদা digitation দিয়ে শুরু হয়ে scapula-র medial border-এ যায়। Long thoracic nerve (C5–C7)।'},
  2:{c:'#c2a35a',k:'extObl',t:'External oblique',b:'এক্সটার্নাল অবলিক',w:'Outer surface, সামনের অংশে',d:'নিচের আটটা রিব (5th–12th) থেকে শুরু হয়। উপরের digitation-গুলো serratus anterior-এর digitation-এর সাথে খাঁজে খাঁজে মেলে।'},
  3:{c:'#f28482',k:'extIC',t:'External intercostal',b:'এক্সটার্নাল ইন্টারকস্টাল',w:'নিচের বর্ডার (উপরের space) আর উপরের বর্ডারের বাইরের ঠোঁট',d:'ফাইবার নিচে-সামনে যায় (পকেটে হাত ঢোকানোর দিকে)। Tubercle থেকে costochondral junction পর্যন্ত, সামনে external intercostal membrane।'},
  4:{c:'#d1495b',k:'intIC',t:'Internal intercostal',b:'ইন্টারনাল ইন্টারকস্টাল',w:'Costal groove-এর উপরের ঠোঁট আর উপরের বর্ডারের ভেতরের ঠোঁট',d:'ফাইবার external-এর আড়াআড়ি। সামনে sternum থেকে পেছনে angle পর্যন্ত, তারপর internal intercostal membrane।'},
  5:{c:'#8e6cc0',k:'innIC',t:'Innermost intercostal',b:'ইনারমোস্ট ইন্টারকস্টাল',w:'Inner surface, costal groove-এর ভেতরের দিকে',d:'Intercostal VAN এই মাসল আর internal intercostal-এর মাঝে থাকে। এটাই intercostal space-এর neurovascular plane।'},
  6:{c:'#3b82d6',k:'iliocost',t:'Iliocostalis',b:'ইলিওকস্টালিস',w:'Angle',d:'Erector spinae-র সবচেয়ে বাইরের অংশ। এর টানেই রিবের angle তৈরি হয়। মডেলে angle-এর পিন এই মাসলের ছোঁয়ার জায়গা থেকে মাপা।'},
  7:{c:'#edae49',k:'longThor',t:'Longissimus thoracis',b:'লংগিসিমাস থোরাসিস',w:'Tubercle আর angle-এর মাঝে',d:'Erector spinae-র মাঝের অংশ, নিচের ৯–১০টা রিবের tubercle আর angle-এর মাঝে লাগে।'},
  9:{c:'#1c8fa0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle আর angle-এর মাঝে, বাইরের পৃষ্ঠে',d:'উপরের কশেরুকার transverse process থেকে নেমে রিবে লাগে। রিব উপরে তোলে।'},
  8:ART
 },
 MUS_REG:{serrAnt:1,extObl:2,extIC:3,intIC:4,innIC:5,iliocost:6,longThor:7,lev:9},
 STR:{
  pia:{t:'Posterior intercostal artery',b:'পোস্টেরিয়র ইন্টারকস্টাল আর্টারি',d:'3rd থেকে 11th space-এরটা descending thoracic aorta থেকে আসে। Costal groove-এ vein আর nerve-এর মাঝে থাকে।',l:['Costal groove-এ উপর থেকে নিচে: Vein, Artery, Nerve (VAN)',SCH]},
  piv:{t:'Posterior intercostal vein',b:'পোস্টেরিয়র ইন্টারকস্টাল ভেইন',d:'Costal groove-এ সবচেয়ে উপরে। ডান পাশেরটা azygos vein-এ খোলে।',l:[SCH]},
  azygos:{t:'Azygos vein',b:'অ্যাজাইগস ভেইন',d:'কশেরুকার ডান পাশ দিয়ে ওঠে, sternal angle-এর লেভেলে SVC-তে খোলে। ডান পাশের posterior intercostal vein এতে আসে।',l:[SCH]},
  icn:{t:'Intercostal nerve (T6)',b:'ইন্টারকস্টাল নার্ভ',d:'নিজের নম্বরের রিবের নিচ দিয়ে যায়, তাই 6th রিবের groove-এ T6। Costal groove-এ সবচেয়ে নিচে, তাই বর্ডারের নিচে কিছুটা বেরিয়ে থাকে।',l:['এজন্য needle বা chest tube সবসময় নিচের রিবের উপরের বর্ডার ঘেঁষে ঢোকানো হয়','Herpes zoster এই নার্ভের পথ ধরে বেল্টের মতো ফুসকুড়ি করে',SCH]},
  collat:{t:'Collateral branch',b:'কোল্যাটারাল শাখা',d:'Angle-এর কাছে intercostal nerve থেকে বের হয়ে নিচের রিবের উপরের বর্ডার বরাবর চলে। সাথে আর্টারি-ভেইনের ছোট শাখাও থাকে।',l:['তাই নিচের রিবের উপরের বর্ডারও পুরোপুরি নিরাপদ নয়, তবে সেখানে ঝুঁকি কম',SCH]},
  aoDesc:{t:'Descending thoracic aorta',b:'ডিসেন্ডিং অ্যাওর্টা',d:'কশেরুকার বাম পাশ দিয়ে নামে। 3rd–11th posterior intercostal artery দেয়।',l:[SCAN]},
  lung:{t:'Lung ও costal pleura',b:'ফুসফুস',d:'রিবের inner surface পুরোটা costal pleura দিয়ে ঢাকা, তার ভেতরে ফুসফুস।',l:[SCAN]},
  vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'6th রিবের head-এর নিচের facet T6-এর body-র সাথে, উপরের facet T5-এর body-র সাথে, আর tubercle T6-এর transverse process-এর সাথে জোড়া লাগে।',l:[SCAN]}
 },
 relLegend:[['pia','#e0443e'],['piv','#4a78e0'],['icn','#f2c230'],['collat','#f2c230'],['azygos','#4a78e0'],['aoDesc','#e0443e'],['lung','#f0b8b2']],
 relLabels:[['pia','Post. intercostal a.'],['piv','Post. intercostal v.'],['icn','Intercostal n.'],['azygos','Azygos v.'],['aoDesc','Aorta']],
 muscleLabels:[['serrAnt','Serratus anterior'],['extObl','External oblique'],['iliocost','Iliocostalis'],['longThor','Longissimus'],['innIC','Innermost IC']],
 lms:{
  facetUp:{t:'Upper facet of head',b:'হেডের উপরের facet',lab:'Upper facet',show:['lm','joint'],d:'ছোট। উপরের কশেরুকার (T5) body-র নিচের costal facet-এর সাথে জোড়া লাগে।',l:['মডেলে আসল T5 যেখানে ছোঁয় সেখানে পিন']},
  facetLow:{t:'Lower facet of head',b:'হেডের নিচের facet',lab:'Lower facet',show:['lm','joint'],d:'বড়। নিজের কশেরুকার (T6) body-র উপরের costal facet-এর সাথে জোড়া লাগে।',l:['মডেলে আসল T6 যেখানে ছোঁয় সেখানে পিন']},
  crest:{t:'Crest of head',b:'হেডের ক্রেস্ট',lab:'Crest',show:['lm','joint'],d:'দুই facet-এর মাঝের আড়াআড়ি উঁচু রেখা।',l:['Intra-articular ligament এখান থেকে intervertebral disc-এ যায়, জয়েন্টটাকে দুই cavity-তে ভাগ করে']},
  neck:{t:'Neck',b:'নেক',lab:'Neck',d:'প্রায় 2.5 cm লম্বা। সামনের পৃষ্ঠ মসৃণ (costal pleura), পেছনের পৃষ্ঠ খসখসে।',l:['উপরের ধারালো crest of neck-এ superior costotransverse ligament লাগে','পেছনের পৃষ্ঠে costotransverse ligament']},
  tubFacet:{t:'Tubercle: articular part',b:'টিউবারকলের জোড়ার অংশ',lab:'Tubercle facet',show:['lm','joint'],d:'Tubercle-এর ভেতরের-নিচের ডিম্বাকার facet। নিজের কশেরুকার (T6) transverse process-এর সাথে costotransverse joint তৈরি করে।',l:['মডেলে আসল transverse process যেখানে ছোঁয় সেখানে পিন']},
  tubRough:{t:'Tubercle: non-articular part',b:'টিউবারকলের খসখসে অংশ',lab:'Non-articular',d:'Tubercle-এর বাইরের খসখসে অংশ।',l:['Lateral costotransverse ligament লাগে']},
  angle:{t:'Angle',b:'অ্যাঙ্গেল',lab:'Angle',d:'Tubercle থেকে প্রায় 5–6 cm বাইরে, যেখানে shaft হঠাৎ সামনের দিকে বাঁক নেয় আর একটু মোচড় খায়।',l:['Iliocostalis এখানে লাগে; মডেলে পিনটা আসল iliocostalis-এর ছোঁয়ার জায়গা থেকে মাপা','রিবের সবচেয়ে দুর্বল জায়গা, ফ্র্যাকচার সাধারণত এখানেই হয়','Costal groove এখানে সবচেয়ে গভীর']},
  extSurf:{t:'External surface',b:'বাইরের পৃষ্ঠ',lab:'Ext. surface',surf:1,d:'উত্তল, মসৃণ। Serratus anterior আর external oblique লাগে।'},
  intSurf:{t:'Internal surface',b:'ভেতরের পৃষ্ঠ',lab:'Int. surface',surf:1,d:'অবতল, costal pleura দিয়ে ঢাকা। নিচের দিকে costal groove।'},
  upBorder:{t:'Upper border',b:'উপরের বর্ডার',lab:'Upper border',surf:1,d:'গোল, মোটা। External আর internal intercostal লাগে।',l:['Chest tube/needle এই বর্ডার ঘেঁষে ঢোকানো হয় (উপরের রিবের groove-এর VAN এড়াতে)']},
  lowBorder:{t:'Lower border',b:'নিচের বর্ডার',lab:'Lower border',surf:1,d:'ধারালো, পাতলা। ভেতরের দিকে costal groove।'},
  groove:{t:'Costal groove',b:'কস্টাল গ্রুভ',lab:'Costal groove',d:'Inner surface-এ নিচের বর্ডার ঘেঁষে খাঁজ। Angle-এর কাছে সবচেয়ে গভীর, সামনে মিলিয়ে যায়।',l:['ভেতরে উপর থেকে নিচে: posterior intercostal Vein, Artery, Nerve (VAN)','রিলেশন মোডে VAN দেখা যায়']},
  antEnd:{t:'Anterior end',b:'সামনের প্রান্ত',lab:'Anterior end',show:['lm','joint'],d:'কাপের মতো গর্ত, যেখানে costal cartilage বসে।',l:['Costochondral joint: primary cartilaginous']}
 },
 modes:{
  parts:{layers:{},view:['obl',460],card:{t:'পাঁচটা অংশ',b:'Head · Neck · Tubercle · Shaft · Anterior end',d:'রঙ দিয়ে অংশগুলো আলাদা করা। Angle শ্যাফটের উপর একটা বিন্দু, "ল্যান্ডমার্ক" মোডে দেখুন।'}},
  lm:{layers:{},view:['obl',460],card:{t:'পিনে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'পেছন-পাশ থেকে দেখলে head, neck, tubercle আর angle সবচেয়ে ভালো দেখা যায়। Costal groove দেখতে ভেতর থেকে ("ভেতর থেকে" বোতাম) দেখুন।'}},
  att:{layers:{muscle:1},view:['lat',560],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'মাসলগুলো স্ক্যান থেকে নেওয়া, শুধু রিবের আশপাশের অংশ রাখা। তিন স্তরের intercostal দেখতে তালিকা থেকে একটা একটা করে বেছে নিন।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,vert:1},view:['medant',460],viewDist:460,card:{t:'Costal groove-এ কী থাকে',b:'Intercostal VAN',d:'ভেতর থেকে দেখুন: groove-এ উপর থেকে নিচে নীল vein, লাল artery, হলুদ nerve। Artery aorta থেকে, vein azygos-এ যায়।'}},
  joint:{layers:{vert:1,rib:1},view:['post',360],card:{t:'6th রিব কোথায় কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'পেছনে তিনটা জোড়া: head-এর দুই facet দুই কশেরুকার সাথে, tubercle transverse process-এর সাথে। সামনে costal cartilage।',l:['Head ↔ T5 ও T6 body (costovertebral): synovial plane, intra-articular ligament দিয়ে দুই cavity','Tubercle ↔ T6 transverse process (costotransverse): synovial plane','Anterior end ↔ costal cartilage: primary cartilaginous']}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>[[6,7,9].includes(r)?'post':[5].includes(r)?'med':'lat',560],
 sideView:[0,1,.6],sideDist:440,
 sideHint:'আগে costal groove খুঁজুন, তারপর head কোন দিকে আছে দেখুন।',
 sideRules:['Head আর tubercle পেছনে, কাপের মতো anterior end সামনে রাখুন','Costal groove-ওয়ালা ধারালো নিচের বর্ডার নিচে রাখুন, groove ভেতরের দিকে মুখ করবে','তখন উত্তল external surface যেদিকে মুখ করে থাকবে, রিবটা সেই পাশের','মিলিয়ে নিন: shaft-এর অবতল দিক (internal surface) মধ্যরেখার দিকে থাকে'],
 holdView:[[0,1,.6],520]
};

/* ---------- কমন ---------- */
const ORD={first:FIRST,typical:TYP};
const B=ORD[window.SPEC]||FIRST;
B.lmInfo=id=>{const o=B.lms[id];return {inf:o,lab:o.lab,kind:o.surf?'surf':'lm',quiz:!o.surf,show:o.show}};
B.layersSrc='data/'+(window.SPEC||'first')+'-layers.js';
B.render=(D,$)=>{
 const o=window.SPEC==='typical'?'#tbl-typ':'#tbl-first';
 const t=$(o);if(t)t.innerHTML=Object.values(B.REG).filter(r=>r.k||r.lm).map(r=>`<tr><td><span class="sw" style="display:inline-block;vertical-align:-3px;margin-right:8px;background:${r.c}"></span>${r.t}</td><td>${r.w}</td></tr>`).join('');
 document.querySelectorAll('[data-spec-link]').forEach(a=>a.setAttribute('aria-pressed',a.dataset.specLink===(window.SPEC||'first')));
};
window.BONE=B;
}
