/* রিবের সব লেখা ও কনফিগারেশন। ছয়টা স্পেসিমেন: first, second, typical (6th), tenth, eleventh, twelfth।
   পেজের URL-এর #<spec> দেখে window.SPEC ঠিক হয় (index.html-এ)।
   লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Part-I (The Thoracic Cage), পৃ. ১৬–২০।
   REG-এর নম্বরগুলো pipeline/ribs.py-এর muscles-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক (বইয়ের বর্ণনা অনুযায়ী, মাপা ল্যান্ডমার্কে বসানো)';
const DT=p=>`Datta I, পৃ. ${p}`;
const ART={c:'#8fd3d6',k:null,t:'Articular surface',b:'জোড়ার তল',w:'Head-এর facet, tubercle-এর facet, সামনের প্রান্ত',d:'কশেরুকা আর costal cartilage এখানে জোড়া লাগে। আসল হাড় যেখানে ছোঁয় সেখানে রং করা।'};
const P5={
 1:{c:'#f2c96b',t:'Head',b:'হেড (মাথা)',d:'পেছনের-ভেতরের প্রান্ত, কশেরুকার body-র সাথে জোড়া লাগে।'},
 2:{c:'#e7a8c9',t:'Neck',b:'নেক (গলা)',d:'Head আর tubercle-এর মাঝের অংশ।'},
 3:{c:'#8cc0b0',t:'Tubercle',b:'টিউবারকল',d:'Neck আর shaft-এর জোড়ায় পেছনের দিকে উঁচু অংশ।'},
 4:{c:'#f1ece0',t:'Shaft',b:'শ্যাফট',d:'রিবের লম্বা, বাঁকানো মূল অংশ।'},
 5:{c:'#9fb8e8',t:'Sternal (anterior) end',b:'সামনের প্রান্ত',d:'Costal cartilage-এর সাথে জোড়া লাগে।'}
};
const P3={1:P5[1],4:P5[4],5:{...P5[5],d:'সরু, চোখা ডগা; ছোট একটা cartilage লাগানো থাকে, পেটের দেয়ালের মাসলের মধ্যে মুক্ত।'}};
const V={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],sup:[0,1,.05],med:[1,0,.0001]};
const VAN_STR=n=>({
 pia:{t:'Posterior intercostal artery',b:'পোস্টেরিয়র ইন্টারকস্টাল আর্টারি',d:'Costal groove-এ vein আর nerve-এর মাঝে, intercostalis intimus আর internus-এর মাঝের neurovascular plane-এ চলে।',l:['Costal groove-এ উপর থেকে নিচে: Vein, Artery, Nerve ('+DT('১৭')+')','Coarctation of aorta-তে এই আর্টারিগুলো বড় হয়ে collateral circulation তৈরি করে, ফলে রিবের নিচের বর্ডার ক্ষয়ে যায় (rib notching) ('+DT('১৭')+')',SCH]},
 piv:{t:'Posterior intercostal vein',b:'পোস্টেরিয়র ইন্টারকস্টাল ভেইন',d:'Costal groove-এ সবচেয়ে উপরে। ডান পাশে azygos vein-এ খোলে।',l:[SCH]},
 azygos:{t:'Azygos vein',b:'অ্যাজাইগস ভেইন',d:'কশেরুকার ডান পাশ দিয়ে উঠে SVC-তে খোলে। ডান পাশের posterior intercostal vein এতে আসে।',l:[SCH]},
 icn:{t:`Intercostal nerve (${n})`,b:'ইন্টারকস্টাল নার্ভ',d:`নিজের নম্বরের রিবের নিচ দিয়ে যায়, তাই এই রিবের groove-এ ${n}। Groove-এ সবচেয়ে নিচে থাকে।`,l:['এজন্য needle বা chest tube নিচের রিবের উপরের বর্ডার ঘেঁষে ঢোকানো হয়',SCH]},
 collat:{t:'Collateral branch',b:'কোল্যাটারাল শাখা',d:'Angle-এর কাছে intercostal nerve থেকে বের হয়ে নিচের রিবের উপরের বর্ডার বরাবর চলে।',l:[SCH]},
 aoDesc:{t:'Descending thoracic aorta',b:'ডিসেন্ডিং অ্যাওর্টা',d:'কশেরুকার বাম পাশ দিয়ে নামে। নিচের ৯টা space-এর posterior intercostal artery দেয়।',l:[SCAN]},
 lung:{t:'Lung ও costal pleura',b:'ফুসফুস',d:'রিবের internal surface costal pleura দিয়ে ঢাকা, মাঝে endothoracic fascia ('+DT('১৭')+')।',l:[SCAN]},
 vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'রিবের head আর tubercle কোন কশেরুকার সাথে জোড়া লাগে তা দেখার জন্য।',l:[SCAN]},
 kidney:{t:'Kidney',b:'কিডনি',d:'ডান কিডনির উপরের অংশ পেছনে 12th রিবের সাথে লেগে থাকে।',l:['Renal angle-এ (12th রিবের নিচের বর্ডার আর erector spinae-র বাইরের বর্ডারের মাঝে) কিডনির নিচের অংশের পেছনের তল থাকে; কিডনির রোগে এখানে চাপ দিলে ব্যথা লাগে ('+DT('২০')+')',SCAN]}
});
const IC={ /* intercostal তিন স্তর: Datta পৃ. ১৭ */
 ext:{c:'#f28482',k:'extIC',t:'Intercostalis externus',b:'এক্সটার্নাল ইন্টারকস্টাল',w:'উপরের বর্ডারের বাইরের ঠোঁট (উপরের space-এর মাসল লাগে); নিচের বর্ডার থেকে নিচের space-এর মাসল শুরু',d:'ফাইবার নিচে-সামনে যায়। '+DT('১৭')},
 int:{c:'#d1495b',k:'intIC',t:'Intercostalis internus',b:'ইন্টারনাল ইন্টারকস্টাল',w:'Costal groove-এর floor থেকে শুরু; উপরের বর্ডারের ভেতরের ঠোঁটে উপরের space-এর মাসল (intimus-এর সাথে একসাথে) লাগে',d:'ফাইবার externus-এর আড়াআড়ি। '+DT('১৭')},
 inn:{c:'#8e6cc0',k:'innIC',t:'Intercostalis intimus',b:'ইন্টারকস্টালিস ইন্টিমাস',w:'Costal groove-এর উপরের ঠোঁট থেকে শুরু; উপরের বর্ডারের ভেতরের ঠোঁটে লাগে',d:'Intimus আর internus-এর মাঝের ফাঁকই neurovascular plane: উপর থেকে নিচে vein, artery, nerve। '+DT('১৭')}
};

/* ======================= 1st rib (Datta পৃ. ১৭–১৮) ======================= */
const FIRST={
 PARTS:P5,views:{...V,obl:[-.6,.6,.5]},target:[0,0,0],dist:260,
 REG:{
  1:{c:'#d1495b',k:'scalAnt',t:'Scalenus anterior',b:'স্ক্যালেনাস অ্যান্টেরিয়র',w:'Scalene tubercle (inner border-এর কাছে)',d:'এর সামনের খাঁজে subclavian vein, পেছনের খাঁজে subclavian artery। '+DT('১৮')},
  2:{c:'#edae49',k:'scalMed',t:'Scalenus medius',b:'স্ক্যালেনাস মিডিয়াস',w:'Superior surface-এ arterial groove আর tubercle-এর মাঝের জায়গা',d:DT('১৮')},
  3:{c:'#5fae7f',k:'serrAnt',t:'Serratus anterior (1st digitation)',b:'সেরাটাস অ্যান্টেরিয়র',w:'Outer border, subclavian artery-র খাঁজের পেছনে (প্রথম digitation-এর উপরের অংশ)',d:DT('১৮')},
  4:{c:'#1c8fa0',k:'subclavius',t:'Subclavius',b:'সাবক্ল্যাভিয়াস',w:'সামনের প্রান্তে, costoclavicular ligament-এর আরও সামনে',d:'Clavicle-এর নিচের তলে লাগে। '+DT('১৮')},
  5:{c:'#f28482',k:'extIC',t:'Intercostalis externus ও internus',b:'ইন্টারকস্টাল মাসল',w:'Lower surface-এ outer border ঘেঁষে',d:'প্রথম রিবে intercostalis intimus থাকে না। '+DT('১৮')},
  6:{c:'#8e6cc0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle-এর কাছে, পেছনে',d:'C7-এর transverse process থেকে নেমে আসে।'},
  7:{c:'#3b82d6',k:'iliocost',t:'Iliocostalis',b:'ইলিওকস্টালিস',w:'Tubercle-এর বাইরে, পেছনে',d:'Erector spinae-র অংশ।'},
  13:{c:'#c2a35a',k:'scalPost',t:'Scalenus posterior',b:'স্ক্যালেনাস পোস্টেরিয়র',w:'1st রিবে লাগে না: outer border-এর উপর দিয়ে গিয়ে 2nd রিবে লাগে',d:'ভাইভার প্রিয় প্রশ্ন। মডেলে মাসলটা দেখানো আছে, কিন্তু 1st রিবে কোনো ছাপ নেই। '+DT('১৮')},
  11:{c:'#e0443e',lm:1,k:null,t:'Groove for subclavian artery',b:'আর্টারির খাঁজ',w:'Superior surface, scalene tubercle-এর পেছনে',d:'Subclavian artery আর তার পেছনে সাধারণত brachial plexus-এর lower trunk থাকে। মডেলে আসল আর্টারি যেখানে ছোঁয় সেখানে রং। '+DT('১৮')},
  12:{c:'#4a78e0',lm:1,k:null,t:'Groove for subclavian vein',b:'ভেইনের খাঁজ',w:'Superior surface, scalene tubercle-এর সামনে',d:'Subclavian vein থাকে। আসল ভেইনের ছোঁয়ার জায়গা। '+DT('১৮')},
  8:ART
 },
 MUS_REG:{scalAnt:1,scalMed:2,serrAnt:3,subclavius:4,extIC:5,lev:6,iliocost:7,scalPost:13},
 STR:{
  rsa:{t:'Subclavian artery',b:'সাবক্ল্যাভিয়ান আর্টারি',d:'Superior surface-এ scalene tubercle-এর পেছনের খাঁজে, পেছনে lower trunk of brachial plexus। '+DT('১৮'),l:[SCAN]},
  rscv:{t:'Subclavian vein',b:'সাবক্ল্যাভিয়ান ভেইন',d:'Scalene tubercle-এর সামনের খাঁজে, scalenus anterior-এর সামনে। '+DT('১৮'),l:[SCAN]},
  rcca:{t:'Common carotid artery',b:'কমন ক্যারোটিড',d:'1st রিবের ভেতরের দিক দিয়ে গলায় ওঠে।',l:[SCAN]},
  bct:{t:'Brachiocephalic trunk',b:'ব্র্যাকিওসেফালিক ট্রাঙ্ক',d:'Subclavian আর common carotid-এ ভাগ হয়।',l:[SCAN]},
  rbcv:{t:'Brachiocephalic vein',b:'ব্র্যাকিওসেফালিক ভেইন',d:'Subclavian আর internal jugular vein মিলে তৈরি।',l:[SCAN]},
  lung:{t:'Apex of lung ও cervical pleura',b:'ফুসফুসের চূড়া',d:'1st রিব সামনে নিচের দিকে হেলে থাকে, sternal end vertebral end-এর প্রায় 3–4 cm নিচে। তাই ফুসফুসের apex আর pleura sternal end-এর উপরে ওঠে, কিন্তু neck-এর উপরে ওঠে না। '+DT('১৮'),l:['Inner border-এ suprapleural membrane (Sibson\'s fascia) লাগে',SCAN]},
  symp:{t:'Sympathetic trunk',b:'সিমপ্যাথেটিক ট্রাঙ্ক',d:'Neck-এর সামনে, pleura-র নিচে, সবচেয়ে ভেতরের জিনিস। '+DT('১৮'),l:['ভেতর থেকে বাইরে: sympathetic trunk, first posterior intercostal vein, superior intercostal artery, first thoracic nerve-এর ventral ramus-এর ascending branch',SCH]},
  piv1:{t:'First posterior intercostal vein',b:'১ম পোস্টেরিয়র ইন্টারকস্টাল ভেইন',d:'Neck-এর সামনে, sympathetic trunk-এর বাইরে। '+DT('১৮'),l:[SCH]},
  sia:{t:'Superior intercostal artery',b:'সুপিরিয়র ইন্টারকস্টাল আর্টারি',d:'Neck-এর সামনে দিয়ে নামে। '+DT('১৮'),l:[SCH]},
  t1:{t:'Ascending branch of ventral ramus of T1',b:'T1 নার্ভের ascending branch',d:'Neck-এর সামনে সবচেয়ে বাইরের জিনিস। উপরে উঠে C8-এর সাথে মিলে lower trunk তৈরি করে। '+DT('১৮'),l:[SCH]},
  lowerTrunk:{t:'Lower trunk of brachial plexus',b:'লোয়ার ট্রাঙ্ক',d:'Arterial groove-এ subclavian artery-র পেছনে। '+DT('১৮'),l:['Cervical rib থাকলে চাপ খায় (thoracic inlet syndrome) '+DT('২০'),SCH]},
  vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'1st রিবের head শুধু T1-এর body-র সাথে, tubercle T1-এর transverse process-এর সাথে জোড়া লাগে।',l:[SCAN]}
 },
 relLegend:[['rsa','#e0443e'],['rscv','#4a78e0'],['lowerTrunk','#f2c230'],['t1','#f2c230'],['symp','#d9b23a'],['sia','#ff6b5e'],['piv1','#7aa0ff'],['lung','#f0b8b2'],['bct','#e0443e'],['rbcv','#4a78e0']],
 relLabels:[['rsa','Subclavian a.'],['rscv','Subclavian v.'],['lowerTrunk','Lower trunk'],['symp','Sympathetic trunk'],['t1','T1 nerve'],['sia','Sup. intercostal a.'],['lung','Apex of lung']],
 muscleLabels:[['scalAnt','Scalenus anterior'],['scalMed','Scalenus medius'],['scalPost','Scalenus posterior'],['serrAnt','Serratus anterior'],['subclavius','Subclavius']],
 lms:{
  headFacet:{type:'joint',t:'Head',b:'হেড, একটাই গোল facet',lab:'Head',show:['lm','joint'],d:'ছোট, একটা গোল articular facet, যা T1-এর body-র সাথে পুরোপুরি জোড়া লাগে। '+DT('১৮')},
  neck:{type:'part',t:'Neck',b:'নেক',lab:'Neck',d:'গোল, উপরের দিকে একটু হেলে পেছনে-বাইরে tubercle পর্যন্ত যায়। '+DT('১৮'),l:['সামনে, pleura-র নিচে, ভেতর থেকে বাইরে: sympathetic trunk, first posterior intercostal vein, superior intercostal artery, T1 ventral ramus-এর ascending branch']},
  tubFacet:{type:'joint',t:'Tubercle',b:'টিউবারকল',lab:'Tubercle',show:['lm','joint'],d:'চওড়া, উঁচু; পেছনে-উপরে-ভেতরে মুখ করা। ভেতরের ডিম্বাকার facet দিয়ে T1-এর transverse process-এর সাথে জোড়া লাগে। '+DT('১৮'),l:['1st রিবের angle tubercle-এর সাথে একই জায়গায়; এখানে রিব বাঁকা, তাই head একটু নিচের দিকে থাকে']},
  scalTub:{type:'elev',t:'Scalene tubercle',b:'স্ক্যালেন টিউবারকল',lab:'Scalene tubercle',d:'দুই খাঁজের মাঝের হালকা ridge-এর উপর inner border-এর কাছে ছোট উঁচু জায়গা। Scalenus anterior লাগে। '+DT('১৮'),l:['মডেলে আসল scalenus anterior যেখানে ছোঁয় সেখানে মার্ক']},
  grooveA:{type:'groove',t:'Groove for subclavian artery',b:'আর্টারির খাঁজ',lab:'Groove: subclavian a.',d:'Scalene tubercle-এর পেছনে। Subclavian artery আর তার পেছনে lower trunk of brachial plexus। '+DT('১৮'),l:['এর পেছনে, tubercle পর্যন্ত, scalenus medius-এর জায়গা']},
  grooveV:{type:'groove',t:'Groove for subclavian vein',b:'ভেইনের খাঁজ',lab:'Groove: subclavian v.',d:'Scalene tubercle-এর সামনে। Subclavian vein থাকে। '+DT('১৮'),l:['সামনে থেকে পেছনে মনে রাখুন: vein, scalenus anterior, artery, scalenus medius']},
  ccl:{type:'groove',t:'Costoclavicular ligament',b:'কস্টোক্ল্যাভিকুলার লিগামেন্ট',lab:'Costoclavicular lig.',d:'Vein-এর খাঁজের সামনের খসখসে জায়গায় লাগে; তার আরও সামনে subclavius। '+DT('১৮'),l:['মডেলে রিবের যে বিন্দু clavicle-এর সবচেয়ে কাছে, সেখানে মার্ক']},
  antEnd:{type:'joint',t:'Sternal end',b:'সামনের প্রান্ত',lab:'Sternal end',show:['lm','joint'],d:'Cartilage দিয়ে manubrium-এর সবচেয়ে চওড়া অংশের সাথে first chondrosternal joint তৈরি করে। '+DT('১৮'),l:['এই জয়েন্ট primary cartilaginous; সাধারণত ২৫ বছরের পর হাড়ে পরিণত হয়, তাই স্বাভাবিক শ্বাসে 1st রিব প্রায় নড়ে না']},
  supSurf:{t:'Upper surface',b:'উপরের পৃষ্ঠ',lab:'Upper surface',surf:1,d:'চ্যাপ্টা; দুটো অগভীর তির্যক খাঁজ আর scalene tubercle এই পৃষ্ঠে। '+DT('১৮')},
  infSurf:{t:'Lower surface',b:'নিচের পৃষ্ঠ',lab:'Lower surface',surf:1,d:'মসৃণ, costal groove নেই। Outer border ঘেঁষে intercostalis externus ও internus; বাকিটা costal pleura আর endothoracic fascia দিয়ে ঢাকা। '+DT('১৮')},
  outBorder:{t:'Outer border',b:'বাইরের বর্ডার',lab:'Outer border',surf:1,d:'উত্তল; পেছনে মোটা। Scalenus posterior এর উপর দিয়ে 2nd রিবে যায়; arterial groove-এর পেছনে serratus anterior। '+DT('১৮')},
  inBorder:{t:'Inner border',b:'ভেতরের বর্ডার',lab:'Inner border',surf:1,d:'অবতল, পাতলা। Suprapleural membrane (Sibson\'s fascia) লাগে। '+DT('১৮')}
 },
 modes:{
  parts:{layers:{},view:['sup',260],card:{t:'অংশগুলো',b:'Head · Neck · Tubercle · Shaft · Sternal end',d:'1st রিবে tubercle আর angle একই জায়গায়, তাই আলাদা angle নেই।'}},
  lm:{layers:{},view:['sup',260],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'উপর থেকে দেখলে দুটো খাঁজ আর scalene tubercle সবচেয়ে ভালো দেখা যায়। লাল খাঁজে artery, নীল খাঁজে vein: আসল ভেসেল যেখানে ছোঁয় সেখানে রং করা।'}},
  att:{layers:{muscle:1},view:['obl',420],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'মাসলগুলো স্ক্যান থেকে নেওয়া, শুধু রিবের আশপাশের অংশ রাখা। তালিকা থেকে একটা বেছে নিলে শুধু সেটা গাঢ় হবে।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['obl',330],viewDist:330,card:{t:'1st রিবের চারপাশে কী আছে',b:'থোরাসিক ইনলেট',d:'উপরে subclavian vessels আর brachial plexus, নিচে ফুসফুসের apex। লাল আর্টারি, নীল ভেইন, হলুদ নার্ভ।'}},
  joint:{layers:{vert:1,rib:1},view:['obl',380],card:{t:'1st রিব কোথায় কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'পেছনে T1-এর সাথে দুটো জোড়া, সামনে costal cartilage।',l:['Head ↔ T1 body: synovial, একটাই facet','Tubercle ↔ T1 transverse process: synovial','Cartilage ↔ manubrium: primary cartilaginous, ২৫ বছরের পর হাড়ে পরিণত হয়']}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>['obl',420],
 sideView:[0,1,.25],sideDist:240,
 sideHint:'খাঁজওয়ালা চ্যাপ্টা পৃষ্ঠ আর মোটা সামনের প্রান্ত খুঁজুন।',
 sideRules:['Datta-র নিয়ম: রিবটা টেবিলে রাখুন। ঠিকভাবে রাখলে head আর sternal end দুটোই টেবিল ছোঁবে; উল্টো রাখলে head উঁচু হয়ে থাকবে ('+DT('১৮')+')','তখন খাঁজওয়ালা পৃষ্ঠ উপরে, sternal end সামনে','উত্তল outer border যেদিকে মুখ করে, রিবটা সেই পাশের','মিলিয়ে নিন: scalene tubercle inner border-এ, যা মধ্যরেখার দিকে থাকে'],
 holdView:[[0,1,.25],260]
};

/* ======================= typical rib, 6th (Datta পৃ. ১৬–১৭) ======================= */
const TYP={
 PARTS:P5,views:{...V,obl:[-.45,.45,-.77],medant:[.55,.05,.83]},target:[0,0,0],dist:520,
 REG:{
  1:{c:'#5fae7f',k:'serrAnt',t:'Serratus anterior',b:'সেরাটাস অ্যান্টেরিয়র',w:'External surface, anterior angle-এর পেছনে (উপরের আটটা রিবে)',d:'Anterior angle হলো sternal end-এর কাছের হালকা তির্যক রেখা; এর সামনে external oblique, পেছনে serratus anterior। '+DT('১৭')},
  2:{c:'#c2a35a',k:'extObl',t:'External oblique',b:'এক্সটার্নাল অবলিক',w:'External surface, anterior angle-এর সামনে',d:DT('১৭')},
  3:IC.ext,4:IC.int,5:IC.inn,
  6:{c:'#3b82d6',k:'iliocost',t:'Iliocostalis thoracis',b:'ইলিওকস্টালিস',w:'Angle-এর ridge (সাথে thoracolumbar fascia-র posterior layer)',d:'মডেলে angle-এর মার্ক এই মাসলের ছোঁয়ার জায়গা থেকে মাপা। '+DT('১৭')},
  7:{c:'#edae49',k:'longThor',t:'Longissimus thoracis',b:'লংগিসিমাস থোরাসিস',w:'Tubercle আর angle-এর মাঝে',d:'Tubercle থেকে angle পর্যন্ত জায়গাটা erector spinae দিয়ে ঢাকা। '+DT('১৭')},
  9:{c:'#1c8fa0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle-এর কাছ থেকে angle পর্যন্ত তির্যক খসখসে রেখা',d:DT('১৭')},
  8:ART
 },
 MUS_REG:{serrAnt:1,extObl:2,extIC:3,intIC:4,innIC:5,iliocost:6,longThor:7,lev:9},
 STR:{...VAN_STR('T6')},
 relLegend:[['pia','#e0443e'],['piv','#4a78e0'],['icn','#f2c230'],['collat','#f2c230'],['azygos','#4a78e0'],['aoDesc','#e0443e'],['lung','#f0b8b2']],
 relLabels:[['pia','Post. intercostal a.'],['piv','Post. intercostal v.'],['icn','Intercostal n.'],['azygos','Azygos v.'],['aoDesc','Aorta']],
 muscleLabels:[['serrAnt','Serratus anterior'],['extObl','External oblique'],['iliocost','Iliocostalis'],['longThor','Longissimus'],['innIC','Intimus']],
 lms:{
  facetUp:{type:'joint',t:'Upper (small) facet of head',b:'হেডের উপরের ছোট facet',lab:'Upper facet',show:['lm','joint'],d:'উপরের কশেরুকার (T5) body-র সাথে জোড়া লাগে। '+DT('১৬'),l:['মডেলে আসল T5 যেখানে ছোঁয় সেখানে মার্ক']},
  facetLow:{type:'joint',t:'Lower (large) facet of head',b:'হেডের নিচের বড় facet',lab:'Lower facet',show:['lm','joint'],d:'একই নম্বরের কশেরুকার (T6) body-র সাথে জোড়া লাগে। '+DT('১৬'),l:['মডেলে আসল T6 যেখানে ছোঁয় সেখানে মার্ক']},
  crest:{type:'elev',t:'Crest of head',b:'হেডের ক্রেস্ট',lab:'Crest of head',show:['lm','joint'],d:'দুই facet-এর মাঝে। Intra-articular ligament দিয়ে intervertebral disc-এর সাথে যুক্ত। '+DT('১৬'),l:['Head-এর কিনারায় capsular ligament, সামনের কিনারায় radiate ligament লাগে','নিচের রিবে head-এর সামনে sympathetic trunk']},
  neck:{type:'part',t:'Neck',b:'নেক',lab:'Neck',d:'চ্যাপ্টা; head থেকে পেছনে-বাইরে tubercle পর্যন্ত, নিজের কশেরুকার transverse process-এর সামনে। '+DT('১৭'),l:['উপরের বর্ডার উঁচু crest (crista colli): superior costotransverse ligament, উপরের কশেরুকার transverse process পর্যন্ত','পেছনের খসখসে পৃষ্ঠ: costotransverse ligament','নিচের বর্ডার গোল, বাইরে costal groove-এর উপরের ঠোঁটে মেশে']},
  tubFacet:{type:'joint',t:'Tubercle: articular part',b:'টিউবারকলের জোড়ার অংশ',lab:'Tubercle facet',show:['lm','joint'],d:'ভেতরের ডিম্বাকার facet; একই কশেরুকার transverse process-এর costal facet-এর সাথে synovial costotransverse joint। '+DT('১৭'),l:['উপরের ছয় রিবে facet উত্তল, তাই ঘোরার (rotatory) নড়াচড়া; 8th–10th-এ চ্যাপ্টা, তাই পিছলানো (gliding) নড়াচড়া']},
  tubRough:{type:'elev',t:'Tubercle: non-articular part',b:'টিউবারকলের খসখসে অংশ',lab:'Non-articular',d:'বাইরের খসখসে অংশ; lateral costotransverse ligament দিয়ে transverse process-এর ডগার সাথে যুক্ত। '+DT('১৭')},
  angle:{type:'elev',t:'Angle (posterior angle)',b:'অ্যাঙ্গেল',lab:'Angle',d:'Tubercle থেকে পেছনে-বাইরে গিয়ে shaft যেখানে হঠাৎ সামনে ঘোরে; এখানে রিব বাঁকা আর মোচড়ানো। '+DT('১৭'),l:['রিবের সবচেয়ে দুর্বল জায়গা','Tubercle থেকে angle-এর দূরত্ব 2nd থেকে 10th রিব পর্যন্ত বাড়ে; 10th-এ প্রায় 5 cm','Iliocostalis thoracis আর thoracolumbar fascia-র posterior layer লাগে']},
  extSurf:{t:'External surface',b:'বাইরের পৃষ্ঠ',lab:'External surface',surf:1,d:'উত্তল। পেছনে levator costae-র রেখা; sternal end-এর কাছে anterior angle। '+DT('১৭')},
  intSurf:{t:'Internal surface',b:'ভেতরের পৃষ্ঠ',lab:'Internal surface',surf:1,d:'অবতল, মসৃণ; costal pleura দিয়ে ঢাকা, মাঝে endothoracic fascia। '+DT('১৭')},
  upBorder:{t:'Upper border',b:'উপরের বর্ডার',lab:'Upper border',surf:1,d:'পেছনে চওড়া ও গোল; বাইরের ঠোঁটে intercostalis externus, ভেতরের ঠোঁটে internus আর intimus। '+DT('১৭')},
  lowBorder:{t:'Lower border',b:'নিচের বর্ডার',lab:'Lower border',surf:1,d:'পাতলা, ধারালো; নিচের space-এর intercostalis externus এখান থেকে শুরু। '+DT('১৭')},
  groove:{type:'groove',t:'Costal groove',b:'কস্টাল গ্রুভ',lab:'Costal groove',d:'ভেতরের পৃষ্ঠে নিচের বর্ডার ঘেঁষে। উপরের ঠোঁট পেছনে neck-এর নিচের বর্ডারের সাথে মেশে, সামনে shaft-এর মাঝের আর সামনের তৃতীয়াংশের জোড়া পর্যন্ত যায়। '+DT('১৭'),l:['উপরের ঠোঁট: intercostalis intimus; floor: intercostalis internus','ভেতরে উপর থেকে নিচে: intercostal vein, artery, nerve']},
  antEnd:{type:'joint',t:'Sternal end',b:'সামনের প্রান্ত',lab:'Sternal end',show:['lm','joint'],d:'Vertebral end-এর চেয়ে নিচে থাকে; নিজের costal cartilage-এর জন্য অবতল গর্ত। '+DT('১৬'),l:['Costochondral joint: primary cartilaginous']}
 },
 modes:{
  parts:{layers:{},view:['obl',460],card:{t:'অংশগুলো',b:'Vertebral end (head, neck, tubercle) · Shaft · Sternal end',d:'Datta অনুযায়ী typical রিবের তিন ভাগ: sternal end, vertebral end আর মাঝের shaft। Angle শ্যাফটের উপর একটা বিন্দু, "ল্যান্ডমার্ক" মোডে দেখুন। '+DT('১৬')}},
  lm:{layers:{},view:['obl',460],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'পেছন থেকে দেখলে head, neck, tubercle আর angle ভালো দেখা যায় (Datta-র Fig. 1.9-ও পেছন থেকে)। Costal groove দেখতে "ভেতর থেকে" চাপুন।'}},
  att:{layers:{muscle:1},view:['lat',560],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'তিন স্তরের intercostal তালিকা থেকে একটা একটা করে বেছে দেখুন।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,vert:1},view:['medant',460],viewDist:460,card:{t:'Costal groove-এ কী থাকে',b:'Neurovascular plane',d:'উপর থেকে নিচে নীল vein, লাল artery, হলুদ nerve। Artery aorta থেকে, vein azygos-এ।'}},
  joint:{layers:{vert:1,rib:1},view:['post',360],card:{t:'6th রিব কোথায় কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'Head দুই কশেরুকার সাথে (নিজের আর উপরেরটা), tubercle নিজের transverse process-এর সাথে। '+DT('১৬–১৭'),l:['কারণ: জন্মের পর vertebral end উপরের দিকে সরে (cephalic migration), যাতে রিব তির্যক থাকে; ২ বছরে শুরু, ৬ বছরে শেষ '+DT('১৭'),'Head ↔ T5 ও T6 body: synovial','Tubercle ↔ T6 transverse process: synovial','Sternal end ↔ costal cartilage: primary cartilaginous']}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>[[6,7,9].includes(r)?'post':r===5?'med':'lat',560],
 sideView:[0,1,.6],sideDist:440,
 sideHint:'আগে costal groove খুঁজুন, তারপর head কোন দিকে দেখুন।',
 sideRules:['Head আর tubercle পেছনে, অবতল sternal end সামনে রাখুন','Costal groove-ওয়ালা ধারালো নিচের বর্ডার নিচে, groove ভেতরের দিকে','উত্তল external surface যেদিকে মুখ করে, রিবটা সেই পাশের'],
 holdView:[[0,1,.6],520]
};

/* ======================= 2nd rib (Datta পৃ. ১৮) ======================= */
const SECOND={
 PARTS:P5,views:{...V,obl:[-.5,.6,-.6],medant:[.55,.05,.83]},target:[0,0,0],dist:330,
 REG:{
  1:{c:'#5fae7f',k:'serrAnt',t:'Serratus anterior',b:'সেরাটাস অ্যান্টেরিয়র',w:'External surface-এর মাঝামাঝি উঁচু tuberosity',d:'প্রথম digitation-এর নিচের অংশ আর পুরো দ্বিতীয় digitation এখানে লাগে। '+DT('১৮')},
  2:{c:'#c2a35a',k:'scalPost',t:'Scalenus posterior',b:'স্ক্যালেনাস পোস্টেরিয়র',w:'Tuberosity থেকে tubercle পর্যন্ত সরু ridge-এর সামনের অংশ',d:'1st রিবের outer border-এর উপর দিয়ে এসে এখানে লাগে। '+DT('১৮')},
  3:{c:'#edae49',k:'sps',t:'Serratus posterior superior',b:'সেরাটাস পোস্টেরিয়র সুপিরিয়র',w:'একই ridge-এর আরও পেছনে',d:DT('১৮')},
  4:IC.ext,5:IC.int,6:IC.inn,
  7:{c:'#3b82d6',k:'iliocost',t:'Iliocostalis',b:'ইলিওকস্টালিস',w:'Angle (tubercle-এর কাছে)',d:'2nd রিবে angle tubercle-এর কাছে। মডেলে angle-এর মার্ক এই মাসলের ছোঁয়া থেকে মাপা।'},
  9:{c:'#1c8fa0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle-এর কাছে',d:'উপরের কশেরুকার transverse process থেকে নেমে আসে।'},
  8:ART
 },
 MUS_REG:{serrAnt:1,scalPost:2,sps:3,extIC:4,intIC:5,innIC:6,iliocost:7,lev:9},
 STR:{...VAN_STR('T2'),
  sia:{t:'Superior intercostal artery',b:'সুপিরিয়র ইন্টারকস্টাল আর্টারি',d:'Costocervical trunk-এর শাখা। 1st আর 2nd space-এর posterior intercostal artery এখান থেকে আসে, aorta থেকে নয়।',l:[SCH]},
  siv:{t:'Right superior intercostal vein',b:'রাইট সুপিরিয়র ইন্টারকস্টাল ভেইন',d:'ডান পাশের 2nd আর 3rd (কখনো 4th) posterior intercostal vein মিলে তৈরি হয়, নিচে নেমে azygos vein-এ খোলে।',l:[SCH]}},
 relLegend:[['sia','#e0443e'],['pia','#e0443e'],['piv','#4a78e0'],['siv','#4a78e0'],['icn','#f2c230'],['collat','#f2c230'],['lung','#f0b8b2']],
 relLabels:[['sia','Sup. intercostal a.'],['pia','Post. intercostal a.'],['piv','Post. intercostal v.'],['icn','Intercostal n. (T2)']],
 muscleLabels:[['serrAnt','Serratus anterior'],['scalPost','Scalenus posterior'],['sps','Serratus post. sup.']],
 lms:{
  facetUp:{type:'joint',t:'Upper facet of head',b:'হেডের উপরের facet',lab:'Upper facet',show:['lm','joint'],d:'T1-এর body-র সাথে। মডেলে আসল T1-এর ছোঁয়া।'},
  facetLow:{type:'joint',t:'Lower facet of head',b:'হেডের নিচের facet',lab:'Lower facet',show:['lm','joint'],d:'T2-এর body-র সাথে। মডেলে আসল T2-এর ছোঁয়া।'},
  crest:{type:'elev',t:'Crest of head',b:'হেডের ক্রেস্ট',lab:'Crest',show:['lm','joint'],d:'Typical রিবের মতো দুই facet-এর মাঝে।'},
  neck:{type:'part',t:'Neck',b:'নেক',lab:'Neck',d:'Typical রিবের মতো।'},
  tubFacet:{type:'joint',t:'Tubercle',b:'টিউবারকল',lab:'Tubercle',show:['lm','joint'],d:'T2-এর transverse process-এর সাথে জোড়া লাগে।'},
  angle:{type:'elev',t:'Angle',b:'অ্যাঙ্গেল',lab:'Angle',d:'Tubercle-এর কাছেই; 1st রিবের মতো রিবটা একটু বাঁকা। '+DT('১৮')},
  tuberosity:{type:'elev',t:'Tuberosity for serratus anterior',b:'সেরাটাস অ্যান্টেরিয়রের টিউবারোসিটি',lab:'Tuberosity',d:'External surface-এর মাঝামাঝি উঁচু খসখসে জায়গা। 2nd রিব চেনার মূল চিহ্ন। '+DT('১৮'),l:['মডেলে আসল serratus anterior যেখানে ছোঁয় তার কেন্দ্রে মার্ক']},
  scalPostImp:{type:'groove',t:'Scalenus posterior impression',b:'স্ক্যালেনাস পোস্টেরিয়রের ছাপ',lab:'Scalenus post.',d:'Tuberosity থেকে tubercle পর্যন্ত সরু ridge-এর উপর। '+DT('১৮')},
  spsImp:{type:'groove',t:'Serratus posterior superior impression',b:'সেরাটাস পোস্টেরিয়র সুপিরিয়রের ছাপ',lab:'Serratus post. sup.',d:'একই ridge-এ, scalenus posterior-এর পেছনে। '+DT('১৮')},
  extSurf:{t:'External surface',b:'বাইরের পৃষ্ঠ',lab:'External surface',surf:1,d:'উত্তল; উপরে-বাইরে মুখ করা। '+DT('১৮')},
  intSurf:{t:'Internal surface',b:'ভেতরের পৃষ্ঠ',lab:'Internal surface',surf:1,d:'Costal groove-এর উপরে অবতল ও মসৃণ; নিচে-ভেতরে মুখ করা। '+DT('১৮')},
  groove:{type:'groove',t:'Costal groove (short)',b:'ছোট কস্টাল গ্রুভ',lab:'Costal groove',d:'Internal surface-এর পেছনের অংশে ছোট খাঁজ। '+DT('১৮')},
  antEnd:{type:'joint',t:'Sternal end',b:'সামনের প্রান্ত',lab:'Sternal end',show:['lm','joint'],d:'2nd costal cartilage-এর সাথে; এই cartilage sternal angle-এ স্টার্নামের সাথে জোড়া লাগে।'}
 },
 modes:{
  parts:{layers:{},view:['sup',330],card:{t:'অংশগুলো',b:'Head · Neck · Tubercle · Shaft · Sternal end',d:'বাঁক 1st রিবের মতো, কিন্তু পাতলা আর দ্বিগুণ লম্বা। '+DT('১৮')}},
  lm:{layers:{},view:['obl',330],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'উপর-বাইরে থেকে দেখলে tuberosity আর ridge ভালো দেখা যায়।'}},
  att:{layers:{muscle:1},view:['obl',420],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'Serratus anterior-এর tuberosity, আর তার পেছনের ridge-এ scalenus posterior ও serratus posterior superior।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['medant',380],viewDist:380,card:{t:'2nd রিবের চারপাশে',b:'Costal groove ও ফুসফুস',d:'2nd space-এর posterior intercostal artery আসে superior intercostal artery থেকে, aorta থেকে নয়।'}},
  joint:{layers:{vert:1,rib:1},view:['post',300],card:{t:'2nd রিব কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'Head T1 আর T2-এর সাথে, tubercle T2-এর transverse process-এর সাথে (স্ক্যানে মাপা)। সামনে 2nd cartilage, যা sternal angle-এ স্টার্নামে লাগে।'}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>['obl',420],
 sideView:[0,1,.3],sideDist:300,
 sideHint:'Tuberosity-ওয়ালা উত্তল পৃষ্ঠ খুঁজুন।',
 sideRules:['Head আর tubercle পেছনে, sternal end সামনে রাখুন','Tuberosity-ওয়ালা উত্তল external surface উপরে-বাইরে মুখ করবে, ছোট costal groove থাকবে ভেতরে-নিচে','External surface যেদিকে বাইরে মুখ করে, রিবটা সেই পাশের'],
 holdView:[[0,1,.3],330]
};

/* ======================= 10th, 11th: নিচের রিবের মাসল ======================= */
const LOW_REG=(ex)=>({
 1:{c:'#edae49',k:'serrPostInf',t:'Serratus posterior inferior',b:'সেরাটাস পোস্টেরিয়র ইনফেরিয়র',w:'External surface, angle-এর বাইরে',d:'নিচের চারটা রিবে লাগে।'},
 2:{c:'#5f7f9e',k:'lat',t:'Latissimus dorsi',b:'ল্যাটিসিমাস ডরসাই',w:'External surface, anterior angle-এর পেছনে',d:'নিচের ৩–৪টা রিবে anterior angle-এর পেছনে লাগে। '+DT('১৭')},
 3:{c:'#c2a35a',k:'extObl',t:'External oblique',b:'এক্সটার্নাল অবলিক',w:'External surface, anterior angle-এর সামনে',d:DT('১৭')},
 4:{c:'#e3a56a',k:'intObl',t:'Internal oblique',b:'ইন্টারনাল অবলিক',w:'নিচের বর্ডারের কাছে',d:'Datta-র এই অধ্যায়ে আলাদা করে বলা নেই; সাধারণভাবে নিচের ৩–৪টা রিবের নিচের বর্ডারে লাগে।'},
 5:{c:'#3fa7a0',k:'transAbd',t:'Transversus abdominis',b:'ট্রান্সভার্সাস অ্যাবডোমিনিস',w:'Internal surface, সামনের দিকে',d:'নিচের ছয়টা costal cartilage-এর ভেতর থেকে শুরু; diaphragm-এর সাথে খাঁজে খাঁজে মেশে।'},
 6:{c:'#3b82d6',k:'dia',t:'Diaphragm (costal part)',b:'ডায়াফ্রাম',w:'Internal surface',d:'নিচের ছয়টা রিব আর cartilage-এর ভেতর থেকে শুরু।'},
 7:{c:'#4b5fd1',k:'iliocost',t:'Iliocostalis',b:'ইলিওকস্টালিস',w:'Angle',d:'মডেলে angle-এর মার্ক এই মাসলের ছোঁয়া থেকে মাপা।'},
 9:{c:'#1c8fa0',k:'lev',t:'Levator costae',b:'লিভেটর কস্টি',w:'Tubercle আর angle-এর মাঝে',d:DT('১৭')},
 10:{c:'#a87bd1',k:'longThor',t:'Longissimus thoracis',b:'লংগিসিমাস থোরাসিস',w:'Tubercle আর angle-এর মাঝে',d:'Erector spinae-র অংশ।'},
 11:IC.ext,12:IC.int,13:IC.inn,8:ART,...ex});
const LOW_MUS={serrPostInf:1,lat:2,extObl:3,intObl:4,transAbd:5,dia:6,iliocost:7,lev:9,longThor:10,extIC:11,intIC:12,innIC:13};

/* ======================= 10th rib (Datta পৃ. ১৯) ======================= */
const TENTH={
 PARTS:P5,views:{...V,obl:[-.45,.45,-.77],medant:[.55,.05,.83]},target:[0,0,0],dist:480,
 REG:LOW_REG({}),MUS_REG:LOW_MUS,
 STR:{...VAN_STR('T10')},
 relLegend:[['pia','#e0443e'],['piv','#4a78e0'],['icn','#f2c230'],['collat','#f2c230'],['azygos','#4a78e0'],['aoDesc','#e0443e'],['lung','#f0b8b2']],
 relLabels:[['pia','Post. intercostal a.'],['piv','Post. intercostal v.'],['icn','Intercostal n. (T10)'],['azygos','Azygos v.'],['aoDesc','Aorta']],
 muscleLabels:[['lat','Latissimus dorsi'],['extObl','External oblique'],['dia','Diaphragm'],['serrPostInf','Serratus post. inf.']],
 lms:{
  headFacet:{type:'joint',t:'Head: single facet',b:'হেডে একটাই facet',lab:'Head facet',show:['lm','joint'],d:'একটাই facet; T10-এর body-র সাথে পুরোপুরি জোড়া লাগে। 10th রিব চেনার মূল চিহ্ন। '+DT('১৯'),l:['এই স্ক্যানে head T9-এর নিচের কিনারার খুব কাছেও আছে। কিছু মানুষে 10th রিবেও উপরের ছোট একটা facet থাকতে পারে, তাই হাতে পাওয়া হাড়ে ভালো করে দেখবেন']},
  neck:{type:'part',t:'Neck',b:'নেক',lab:'Neck',d:'Typical রিবের মতো। '+DT('১৯')},
  tubFacet:{type:'joint',t:'Tubercle: articular part',b:'টিউবারকলের জোড়ার অংশ',lab:'Tubercle facet',show:['lm','joint'],d:'T10-এর transverse process-এর সাথে। 8th–10th রিবে facet চ্যাপ্টা, পিছলানো নড়াচড়া হয়, ফলে উপরের পেটের আড়াআড়ি মাপ বাড়ে। '+DT('১৭')},
  tubRough:{type:'elev',t:'Tubercle: non-articular part',b:'টিউবারকলের খসখসে অংশ',lab:'Non-articular',d:'Lateral costotransverse ligament।'},
  angle:{type:'elev',t:'Angle',b:'অ্যাঙ্গেল',lab:'Angle',d:'Tubercle থেকে angle-এর দূরত্ব 10th রিবে সবচেয়ে বেশি, প্রায় 5 cm। '+DT('১৭')},
  extSurf:{t:'External surface',b:'বাইরের পৃষ্ঠ',lab:'External surface',surf:1,d:'উত্তল।'},
  intSurf:{t:'Internal surface',b:'ভেতরের পৃষ্ঠ',lab:'Internal surface',surf:1,d:'অবতল; pleura আর diaphragm।'},
  upBorder:{t:'Upper border',b:'উপরের বর্ডার',lab:'Upper border',surf:1,d:'Typical রিবের মতো।'},
  lowBorder:{t:'Lower border',b:'নিচের বর্ডার',lab:'Lower border',surf:1,d:'Typical রিবের মতো।'},
  groove:{type:'groove',t:'Costal groove',b:'কস্টাল গ্রুভ',lab:'Costal groove',d:'Typical রিবের মতো; ভেতরে VAN।'},
  antEnd:{type:'joint',t:'Sternal end',b:'সামনের প্রান্ত',lab:'Sternal end',show:['lm','joint'],d:'10th cartilage উপরের (9th) cartilage-এর সাথে জোড়া লাগে, তাই এটা false (vertebrochondral) রিব। 9th আর 10th cartilage-এর মাঝের জোড়া fibrous। '+DT('১৬, ২০')}
 },
 modes:{
  parts:{layers:{},view:['obl',460],card:{t:'অংশগুলো',b:'Typical রিবের মতো',d:'পার্থক্য শুধু head-এ: একটাই facet। '+DT('১৯')}},
  lm:{layers:{},view:['obl',460],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'Head-এর একটা facet খুঁজুন; বাকি সব typical রিবের মতো।'}},
  att:{layers:{muscle:1},view:['lat',560],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'নিচের রিবে পেটের দেয়ালের মাসল (external oblique, latissimus dorsi, diaphragm, transversus abdominis) যোগ হয়।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,vert:1},view:['medant',460],viewDist:460,card:{t:'Costal groove-এ কী থাকে',b:'Neurovascular plane',d:'Typical রিবের মতো; এখানে T10 নার্ভ।'}},
  joint:{layers:{vert:1,rib:1},view:['post',360],card:{t:'10th রিব কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'Head শুধু T10-এর সাথে, tubercle T10-এর transverse process-এর সাথে, সামনে cartilage 9th cartilage-এর সাথে।'}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>[[1,7,9,10].includes(r)?'post':[5,6,13].includes(r)?'med':'lat',560],
 sideView:[0,1,.6],sideDist:420,
 sideHint:'Typical রিবের নিয়মেই চেনা যায়।',
 sideRules:['Head আর tubercle পেছনে, sternal end সামনে','Costal groove-ওয়ালা ধারালো বর্ডার নিচে, groove ভেতরে','উত্তল external surface যেদিকে মুখ করে, রিবটা সেই পাশের'],
 holdView:[[0,1,.6],480]
};

/* ======================= 11th rib (Datta পৃ. ১৯) ======================= */
const ELEVENTH={
 PARTS:P3,views:{...V,obl:[-.45,.45,-.77],medant:[.55,.05,.83]},target:[0,0,0],dist:400,
 REG:LOW_REG({}),MUS_REG:LOW_MUS,
 STR:{...VAN_STR('T11')},
 relLegend:[['pia','#e0443e'],['piv','#4a78e0'],['icn','#f2c230'],['azygos','#4a78e0'],['aoDesc','#e0443e'],['kidney','#c9706a']],
 relLabels:[['pia','Post. intercostal a.'],['icn','Intercostal n. (T11)'],['kidney','Kidney'],['aoDesc','Aorta']],
 muscleLabels:[['lat','Latissimus dorsi'],['extObl','External oblique'],['dia','Diaphragm'],['transAbd','Transversus abd.']],
 lms:{
  headFacet:{type:'joint',t:'Head: single large facet',b:'হেডে একটা বড় facet',lab:'Head facet',show:['lm','joint'],d:'T11-এর body-র সাথে পুরোপুরি জোড়া লাগে। '+DT('১৯')},
  angle:{type:'elev',t:'Slight angle',b:'হালকা অ্যাঙ্গেল',lab:'Angle',d:'Shaft-এ হালকা একটা angle। '+DT('১৯'),l:['মডেলে iliocostalis-এর ছোঁয়া থেকে মাপা']},
  extSurf:{t:'External surface',b:'বাইরের পৃষ্ঠ',lab:'External surface',surf:1,d:'উত্তল।'},
  intSurf:{t:'Internal surface',b:'ভেতরের পৃষ্ঠ',lab:'Internal surface',surf:1,d:'অবতল।'},
  upBorder:{t:'Upper border',b:'উপরের বর্ডার',lab:'Upper border',surf:1,d:'Intercostal মাসল লাগে।'},
  lowBorder:{t:'Lower border',b:'নিচের বর্ডার',lab:'Lower border',surf:1,d:'Intercostal মাসল লাগে।'},
  groove:{type:'groove',t:'Shallow costal groove',b:'অগভীর কস্টাল গ্রুভ',lab:'Costal groove',d:'অগভীর। '+DT('১৯')},
  antEnd:{type:'joint',t:'Pointed anterior end',b:'চোখা সামনের প্রান্ত',lab:'Pointed end',show:['lm','joint'],d:'চোখা ডগায় একটা cartilage লাগানো থাকে; পেটের দেয়ালের মাসলের মধ্যে মুক্ত (floating)। '+DT('১৯')}
 },
 modes:{
  parts:{layers:{},view:['obl',400],card:{t:'অংশগুলো',b:'Head · Shaft · চোখা প্রান্ত',d:'Neck নেই, tubercle নেই। '+DT('১৯')}},
  lm:{layers:{},view:['obl',400],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'চেনার চিহ্ন: neck আর tubercle নেই, হালকা angle আর অগভীর groove আছে।'}},
  att:{layers:{muscle:1},view:['lat',480],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'তালিকা থেকে একটা বেছে নিলে শুধু সেটা গাঢ় হবে।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['medant',420],viewDist:420,card:{t:'11th রিবের চারপাশে',b:'Groove-এ VAN, পাশে কিডনি',d:'অগভীর groove-এ T11-এর vessels আর নার্ভ।'}},
  joint:{layers:{vert:1,rib:1},view:['post',320],card:{t:'11th রিব কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'শুধু head T11-এর body-র সাথে। Tubercle নেই, তাই transverse process-এর সাথে কোনো জোড়া নেই। সামনে মুক্ত।'}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>[[1,7,9,10].includes(r)?'post':[5,6,13].includes(r)?'med':'lat',480],
 sideView:[0,1,.6],sideDist:360,
 sideHint:'Head আর চোখা প্রান্ত খুঁজুন, তারপর অগভীর groove।',
 sideRules:['Head পেছনে-ভেতরে, চোখা প্রান্ত সামনে-বাইরে','অগভীর costal groove-ওয়ালা বর্ডার নিচে, groove ভেতরে','উত্তল external surface যেদিকে মুখ করে, রিবটা সেই পাশের'],
 holdView:[[0,1,.6],400]
};

/* ======================= 12th rib (Datta পৃ. ১৯–২০) ======================= */
const TWELFTH={
 PARTS:P3,views:{...V,obl:[-.45,.45,-.77],medant:[.55,.2,.8]},target:[0,0,0],dist:320,
 REG:{
  1:{c:'#e3a56a',k:'QL',t:'Quadratus lumborum',b:'কোয়াড্রেটাস লাম্বোরাম',w:'Anterior surface-এর নিচের অংশ, ভেতরের অর্ধেক বা দুই-তৃতীয়াংশে',d:'সাথে thoracolumbar fascia-র anterior layer। '+DT('১৯')},
  2:{c:'#3b82d6',k:'dia',t:'Diaphragm',b:'ডায়াফ্রাম',w:'Anterior surface, বাইরের দিকে উপরের অংশ',d:DT('১৯')},
  3:{c:'#3fa7a0',k:'transAbd',t:'Transversus abdominis',b:'ট্রান্সভার্সাস অ্যাবডোমিনিস',w:'Anterior surface, বাইরের দিকে নিচের অংশ',d:DT('১৯')},
  4:{c:'#edae49',k:'serrPostInf',t:'Serratus posterior inferior',b:'সেরাটাস পোস্টেরিয়র ইনফেরিয়র',w:'Posterior surface-এর বাইরের অর্ধেক',d:DT('১৯')},
  5:{c:'#5f7f9e',k:'lat',t:'Latissimus dorsi',b:'ল্যাটিসিমাস ডরসাই',w:'Posterior surface-এর বাইরের অর্ধেক',d:DT('১৯')},
  6:{c:'#c2a35a',k:'extObl',t:'External oblique',b:'এক্সটার্নাল অবলিক',w:'Posterior surface-এর বাইরের অর্ধেক',d:DT('১৯')},
  7:{c:'#4b5fd1',k:'iliocost',t:'Iliocostalis',b:'ইলিওকস্টালিস',w:'Posterior surface-এর ভেতরের অর্ধেক',d:DT('১৯')},
  9:{c:'#1c8fa0',k:'lev',t:'Levator costae (সবচেয়ে নিচেরটা)',b:'লিভেটর কস্টি',w:'Posterior surface-এর ভেতরের অর্ধেক',d:DT('১৯')},
  10:{c:'#a87bd1',k:'longThor',t:'Longissimus thoracis',b:'লংগিসিমাস থোরাসিস',w:'Posterior surface-এর ভেতরের অর্ধেক',d:DT('১৯')},
  11:{...IC.ext,w:'Upper border',d:DT('২০')},12:{...IC.int,w:'Upper border; কিছুটা anterior surface-এও আসে',d:DT('২০')},
  8:ART
 },
 MUS_REG:{QL:1,dia:2,transAbd:3,serrPostInf:4,lat:5,extObl:6,iliocost:7,lev:9,longThor:10,extIC:11,intIC:12},
 STR:{...VAN_STR('T12'),
  subA:{t:'Subcostal artery',b:'সাবকস্টাল আর্টারি',d:'Aorta থেকে আসে; 12th রিবের নিচ দিয়ে চলে (12th রিবে costal groove নেই)।',l:[SCH]},
  subV:{t:'Subcostal vein',b:'সাবকস্টাল ভেইন',d:'ডান পাশে azygos-এ যায়।',l:[SCH]},
  subN:{t:'Subcostal nerve (T12)',b:'সাবকস্টাল নার্ভ',d:'T12-এর ventral ramus; 12th রিবের নিচ দিয়ে quadratus lumborum-এর সামনে দিয়ে চলে।',l:[SCH]}},
 relLegend:[['subA','#e0443e'],['subV','#4a78e0'],['subN','#f2c230'],['kidney','#c9706a'],['aoDesc','#e0443e']],
 relLabels:[['subA','Subcostal a.'],['subN','Subcostal n.'],['kidney','Kidney'],['aoDesc','Aorta']],
 muscleLabels:[['QL','Quadratus lumborum'],['dia','Diaphragm'],['lat','Latissimus dorsi'],['serrPostInf','Serratus post. inf.']],
 lms:{
  headFacet:{type:'joint',t:'Head: single facet',b:'হেডে একটাই facet',lab:'Head facet',show:['lm','joint'],d:'T12-এর body-র সাথে জোড়া লাগে। '+DT('১৯')},
  antSurf:{t:'Anterior surface',b:'সামনের পৃষ্ঠ',lab:'Anterior surface',surf:1,d:'অবতল, মসৃণ, একটু উপরের দিকে মুখ করা; side determination-এ কাজে লাগে। '+DT('১৯'),l:['নিচের অংশে quadratus lumborum; তার উপরে pleura-র costodiaphragmatic recess; বাইরে diaphragm আর transversus abdominis']},
  postSurf:{t:'Posterior surface',b:'পেছনের পৃষ্ঠ',lab:'Posterior surface',surf:1,d:'উত্তল, খসখসে। ভেতরের অর্ধেকে levator costae, longissimus, iliocostalis; বাইরের অর্ধেকে serratus posterior inferior, latissimus dorsi, external oblique। '+DT('১৯')},
  upBorder:{t:'Upper border',b:'উপরের বর্ডার',lab:'Upper border',surf:1,d:'External আর internal intercostal। '+DT('২০')},
  lowBorder:{t:'Lower border',b:'নিচের বর্ডার',lab:'Lower border',surf:1,d:'Thoracolumbar fascia-র middle layer; quadratus lumborum-এর ঠিক বাইরে lateral arcuate ligament আর posterior layer। Head-এর কাছে lumbocostal ligament (L1-এর transverse process থেকে)। '+DT('২০')},
  cvAngle:{type:'part',t:'Costovertebral angle',b:'কস্টোভার্টিব্রাল অ্যাঙ্গেল',lab:'Costovertebral angle',d:'12th রিবের নিচের বর্ডার আর T12-এর body-র মাঝের কোণ; pleura-র costodiaphragmatic recess এখানে ঢুকে আসে। '+DT('২০')},
  renalAngle:{type:'part',t:'Renal angle',b:'রেনাল অ্যাঙ্গেল',lab:'Renal angle',d:'12th রিবের নিচের বর্ডার আর erector spinae-র বাইরের বর্ডারের মাঝের কোণ। কিডনির নিচের অংশের পেছনের তল এর সাথে লেগে থাকে; কিডনির রোগে এখানে চাপ দিলে ব্যথা হয়। Pleura-র নিচের সীমা এই কোণের নিচে নামে না। '+DT('২০'),l:['মডেলে erector spinae (iliocostalis lumborum) রিবের যেখানে শেষ হয় সেখানে মার্ক']},
  antEnd:{type:'joint',t:'Pointed tip',b:'চোখা ডগা',lab:'Pointed tip',show:['lm','joint'],d:'চোখা ডগায় cartilage লাগানো; মুক্ত (floating)। '+DT('১৯')}
 },
 modes:{
  parts:{layers:{},view:['post',320],card:{t:'অংশগুলো',b:'Head · Shaft · চোখা ডগা',d:'Neck নেই, tubercle নেই, angle নেই, costal groove নেই। 11th-এর চেয়ে ছোট। '+DT('১৯')}},
  lm:{layers:{},view:['post',320],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'Datta-র Fig. 1.12 সামনে থেকে আর 1.13 পেছন থেকে আঁকা; মডেল ঘুরিয়ে দুই দিকই দেখুন।'}},
  att:{layers:{muscle:1},view:['post',420],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'সামনে quadratus lumborum, diaphragm, transversus abdominis; পেছনে ভেতরে erector spinae-র অংশ, বাইরে serratus posterior inferior, latissimus dorsi, external oblique।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['post',380],viewDist:380,card:{t:'12th রিবের চারপাশে',b:'কিডনি, subcostal vessels ও নার্ভ',d:'সামনে ডান কিডনির উপরের অংশ লেগে থাকে। Subcostal vessels আর নার্ভ রিবের নিচ দিয়ে চলে।'}},
  joint:{layers:{vert:1,rib:1},view:['post',300],card:{t:'12th রিব কোথায় জোড়া লাগে',b:'আর্টিকুলেশন',d:'শুধু head T12-এর body-র সাথে। Tubercle নেই।'}},
  side:{layers:{}},quiz:{layers:{}}
 },
 muscleView:r=>[[1,2,3].includes(r)?'ant':'post',420],
 sideView:[0,.4,1],sideDist:300,
 sideHint:'মসৃণ অবতল পৃষ্ঠ খুঁজুন।',
 sideRules:['Head ভেতরে, চোখা ডগা বাইরে-সামনে-নিচে রাখুন','মসৃণ অবতল anterior surface সামনে আর একটু উপরে মুখ করবে ('+DT('১৯')+')','তখন খসখসে উত্তল posterior surface পেছনে থাকবে; ডগা যেদিকে বাইরে যায়, রিবটা সেই পাশের'],
 holdView:[[0,.3,1],320]
};

/* ---------- কমন ---------- */
const ALL={first:FIRST,second:SECOND,typical:TYP,tenth:TENTH,eleventh:ELEVENTH,twelfth:TWELFTH};
const B=ALL[window.SPEC]||FIRST;
B.id='rib-'+(window.SPEC||'first');
B.lmInfo=id=>{const o=B.lms[id];return {inf:o,lab:o.lab,kind:o.surf?'surf':'lm',type:o.surf?'surf':o.type,quiz:!o.surf,show:o.show}};
B.layersSrc='data/'+(window.SPEC||'first')+'-layers.js';
B.render=(D,$)=>{
 const t=$('#tbl-att');if(t)t.innerHTML=Object.values(B.REG).filter(r=>r.k||r.lm).map(r=>`<tr><td><span class="sw" style="display:inline-block;vertical-align:-3px;margin-right:8px;background:${r.c}"></span>${r.t}</td><td>${r.w}</td></tr>`).join('');
 document.querySelectorAll('[data-spec-link]').forEach(a=>a.setAttribute('aria-pressed',a.dataset.specLink===(window.SPEC||'first')));
};
window.BONE=B;
}
