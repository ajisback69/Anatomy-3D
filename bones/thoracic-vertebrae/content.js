/* থোরাসিক কশেরুকার সব লেখা ও কনফিগারেশন। ছয়টা স্পেসিমেন: typical (T6), first, ninth, tenth, eleventh, twelfth।
   লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Part-I, The Thoracic Cage, পৃ. ১২–১৪।
   REG-এর নম্বরগুলো pipeline/vertebrae.py-এর MUSCLES-এর সাথে মেলে; 8 = জোড়ার তল, 14 = ডিস্কের তল। */
{
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক (বইয়ের বর্ণনা অনুযায়ী, মাপা ল্যান্ডমার্কে বসানো)',GEN='সাধারণ বই থেকে; Datta-র এই অধ্যায়ে নেই';
const DT=p=>`Datta I, পৃ. ${p}`;
const PARTS={
 1:{c:'#f2c96b',t:'Body',b:'বডি',d:'সামনের ভারবাহী অংশ; উপরে-নিচে intervertebral disc। মডেলে ডিস্ক যে জায়গা ঢাকে সেটাই body।'},
 2:{c:'#e7a8c9',t:'Pedicle',b:'পেডিকল',d:'Body থেকে পেছনে যাওয়া ছোট মোটা দণ্ড। উপরে-নিচে vertebral notch।'},
 3:{c:'#c9b6e8',t:'Lamina',b:'ল্যামিনা',d:'Pedicle থেকে মাঝে এসে vertebral foramen-এর পেছনের দেয়াল তৈরি করে।'},
 4:{c:'#8cc0b0',t:'Transverse process',b:'ট্রান্সভার্স প্রসেস',d:'Pedicle আর lamina-র জোড়া থেকে বাইরে-পেছনে।'},
 5:{c:'#9fb8e8',t:'Spinous process',b:'স্পাইনাস প্রসেস',d:'দুই lamina-র মিলনস্থল থেকে পেছনে-নিচে।'},
 6:{c:'#f0a868',t:'Articular processes',b:'আর্টিকুলার প্রসেস',d:'উপরে-নিচে পাশের কশেরুকার সাথে facet joint (zygapophyseal)। মডেলে আসল পাশের কশেরুকা যেখানে ছোঁয় তার আশপাশ।'}
};
const REG={
 1:{c:'#7aa6d6',k:'trap',t:'Trapezius',b:'ট্র্যাপিজিয়াস',w:'Spinous process',d:DT('১৩')},
 2:{c:'#d1495b',k:'rhomb',t:'Rhomboid major ও minor',b:'রমবয়েড',w:'Spinous process',d:DT('১৩')},
 3:{c:'#5f7f9e',k:'lat',t:'Latissimus dorsi',b:'ল্যাটিসিমাস ডরসাই',w:'নিচের কশেরুকার spinous process',d:DT('১৩')},
 4:{c:'#edae49',k:'sps',t:'Serratus posterior superior',b:'সেরাটাস পোস্টেরিয়র সুপিরিয়র',w:'উপরের কশেরুকার spinous process',d:DT('১৩')},
 5:{c:'#e3a56a',k:'spi',t:'Serratus posterior inferior',b:'সেরাটাস পোস্টেরিয়র ইনফেরিয়র',w:'নিচের কশেরুকার spinous process',d:DT('১৩')},
 6:{c:'#5fae7f',k:'spinalis',t:'Spinalis thoracis',b:'স্পাইনালিস',w:'Spinous process (erector spinae-র medial group)',d:DT('১৩')},
 7:{c:'#3fa7a0',k:'semisp',t:'Semispinalis thoracis',b:'সেমিস্পাইনালিস',w:'Transverse process থেকে উপরের spinous process',d:'Transverse process-এর পেছনের পৃষ্ঠে deep extensor মাসল লাগে '+DT('১৩')+'। নাম আর ভাগ '+GEN+'।'},
 9:{c:'#8e6cc0',k:'multif',t:'Multifidus',b:'মাল্টিফিডাস',w:'Transverse process ও spinous process',d:'Deep extensor; '+GEN+'।'},
 10:{c:'#c77dce',k:'rot',t:'Rotatores',b:'রোটেটরস',w:'Transverse process থেকে উপরের lamina',d:'Deep extensor; '+GEN+'।'},
 11:{c:'#f28482',k:'intersp',t:'Interspinales',b:'ইন্টারস্পাইনালেস',w:'পাশাপাশি spinous process-এর মাঝে',d:'সাথে interspinous আর supraspinous ligament '+DT('১৩')+'।'},
 12:{c:'#1c8fa0',k:'lev',t:'Levatores costarum',b:'লিভেটরস কস্টারাম',w:'Transverse process-এর ডগা',d:'নিচের রিবে নেমে যায়।'},
 13:{c:'#a87bd1',k:'longis',t:'Longissimus thoracis',b:'লংগিসিমাস থোরাসিস',w:'Transverse process',d:'Erector spinae।'},
 15:{c:'#e0a03c',k:'psoas',t:'Psoas major',b:'সোয়াস মেজর',w:'T12-এর body-র পাশ আর নিচের ডিস্ক',d:GEN+'।'},
 16:{c:'#c2a35a',k:'longcolli',t:'Longus colli',b:'লংগাস কলি',w:'উপরের থোরাসিক কশেরুকার body-র সামনে',d:GEN+'।'},
 17:{c:'#3b82d6',k:'dia',t:'Diaphragm (crus)',b:'ডায়াফ্রাম',w:'নিচের থোরাসিক কশেরুকার সামনে',d:'Crus আর median arcuate ligament এই লেভেলে। '+GEN+'।'},
 14:{c:'#bfe3ee',lm:1,k:null,t:'Intervertebral disc-এর তল',b:'ডিস্কের তল',w:'Body-র উপরের ও নিচের পৃষ্ঠ',d:'আসল ডিস্ক যেখানে ছোঁয় সেখানে রং।'},
 8:{c:'#8fd3d6',k:null,t:'Articular surface',b:'জোড়ার তল',w:'Costal facet আর articular facet',d:'আসল রিবের head/tubercle আর পাশের কশেরুকা যেখানে ছোঁয় সেখানে রং।'}
};
const MUS_REG={trap:1,rhomb:2,lat:3,sps:4,spi:5,spinalis:6,semisp:7,multif:9,rot:10,intersp:11,lev:12,longis:13,psoas:15,longcolli:16,dia:17};
const STR={
 aoDesc:{t:'Descending thoracic aorta',b:'ডিসেন্ডিং অ্যাওর্টা',d:'কশেরুকার বাম পাশ দিয়ে নামে। এর চাপে T5–T8-এর body-র বাম পাশ চ্যাপ্টা থাকে। '+DT('১২'),l:['মডেলে T6-এর বাম পাশে aorta-র ছোঁয়া মাপা গেছে',SCAN]},
 eso:{t:'Oesophagus',b:'ইসোফেগাস',d:'Body-র সামনে।',l:[SCAN]},
 cord:{t:'Spinal cord',b:'স্পাইনাল কর্ড',d:'Vertebral foramen-এর ভেতরে। এই অঞ্চলে কর্ডে বড় কোনো স্ফীতি নেই, তাই typical থোরাসিক কশেরুকার foramen ছোট আর গোল। T1-এর foramen বড় ও ত্রিভুজাকার, কারণ cervical enlargement-এর নিচের অংশ থাকে। '+DT('১২–১৩'),l:[SCH]},
 spn:{t:'Spinal nerve',b:'স্পাইনাল নার্ভ',d:'Inferior vertebral notch দিয়ে বের হয়; এই notch সব থোরাসিক কশেরুকায় স্পষ্ট আর একই নম্বরের spinal nerve বহন করে। '+DT('১২–১৩'),l:[SCH]},
 symp:{t:'Sympathetic trunk',b:'সিমপ্যাথেটিক ট্রাঙ্ক',d:'রিবের head-এর সামনে দিয়ে নামে। '+DT('১৬'),l:[SCH]},
 azygos:{t:'Azygos vein',b:'অ্যাজাইগস ভেইন',d:'Body-র ডান পাশ দিয়ে ওঠে।',l:[GEN,SCH]},
 vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'পাশের কশেরুকা।',l:[SCAN]}
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05],obl:[-.6,.45,.65]};
const COMMON_MODES=(o)=>({
 parts:{layers:{},view:['obl',230],card:{t:'অংশগুলো',b:'Body · Pedicle · Lamina · Transverse · Spinous · Articular',d:'অংশের সীমানা জ্যামিতি দিয়ে আনুমানিক; body ঠিক করা হয়েছে আসল ডিস্কের ছাপ দিয়ে।'}},
 lm:{layers:{},view:['lat',230],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'পাশ থেকে দেখলে costal facet আর notch, উপর থেকে দেখলে body-র আকার আর vertebral foramen ভালো বোঝা যায়। জোড়া জিনিসের মার্ক শুধু ডান পাশে।'}},
 att:{layers:{muscle:1},view:['post',300],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'Spinous process-এ লাগে trapezius, rhomboid, latissimus dorsi, serratus posterior superior ও inferior আর erector spinae-র medial অংশ; transverse process-এর পেছনে deep extensor। '+DT('১৩')}},
 rel:{layers:{artery:1,vein:1,nerve:1,organ:1},view:['obl',300],viewDist:300,card:{t:'কশেরুকার চারপাশে',b:'Spinal cord, nerve, aorta',d:'হলুদ নল: foramen-এর ভেতরে spinal cord আর notch দিয়ে বের হওয়া spinal nerve (স্কিম্যাটিক)। Aorta আর oesophagus স্ক্যান থেকে।'}},
 joint:{layers:{vert:1,rib:1},view:['lat',320],card:{t:'জোড়াগুলো',b:'রিব আর পাশের কশেরুকার সাথে',d:o}},
 which:{layers:{}},quiz:{layers:{}}
});
const WHICH_NAMES={typical:'Typical (T2–T8)',first:'T1',ninth:'T9',tenth:'T10',eleventh:'T11',twelfth:'T12'};
const WHICH_RULES={
 typical:['Body হৃৎপিণ্ডের মতো, আড়াআড়ি আর সামনে-পেছনের মাপ প্রায় সমান','প্রতি পাশে দুটো demifacet (উপরে বড়, নিচে ছোট)','Transverse process-এ costal facet','Spine লম্বা, নিচে হেলানো '+'('+DT('১২–১৩')+')'],
 first:['উপরে পূর্ণ গোল costal facet (1st রিব), নিচে demifacet (2nd রিব)','Body ছোট, cervical ধরনের: আড়াআড়ি মাপ বেশি','Superior notch স্পষ্ট; foramen বড়, ত্রিভুজাকার','Spine লম্বা, প্রায় আড়াআড়ি '+'('+DT('১৩')+')'],
 ninth:['শুধু উপরে demifacet (9th রিব); নিচের demifacet সাধারণত থাকে না','বাকি সব typical-এর মতো '+'('+DT('১৩')+')'],
 tenth:['প্রতি পাশে একটাই পূর্ণ costal facet, উপরের বর্ডারের কাছে','Transverse process-এ costal facet আছে','Body বড়, lumbar ধরনের '+'('+DT('১৩')+')'],
 eleventh:['একটাই গোল costal facet, উপরের বর্ডার থেকে একটু নিচে সরে','Transverse process-এ costal facet নেই '+'('+DT('১৩')+')'],
 twelfth:['Body বড়, lumbar ধরনের; costal facet body-র প্রায় মাঝখানে, pedicle-এ ঢুকে গেছে','Transverse process ছোট, তিনটা tubercle, costal facet নেই','নিচের articular facet উত্তল, lumbar-এর মতো সামনে-বাইরে মোচড়ানো '+'('+DT('১৪')+')']
};
const lmBase={
 bodyAnt:{type:'part',t:'Body',b:'বডি',lab:'Body',d:''},
 cfUp:{type:'joint',t:'Upper costal demifacet',b:'উপরের কস্টাল ডেমিফ্যাসেট',lab:'Upper costal facet',show:['lm','joint'],d:''},
 cfLow:{type:'joint',t:'Lower costal demifacet',b:'নিচের কস্টাল ডেমিফ্যাসেট',lab:'Lower costal facet',show:['lm','joint'],d:''},
 tpFacet:{type:'joint',t:'Costal facet on transverse process',b:'ট্রান্সভার্স প্রসেসের কস্টাল ফ্যাসেট',lab:'TP costal facet',show:['lm','joint'],d:'ডগার কাছে সামনের পৃষ্ঠে ডিম্বাকার facet; একই নম্বরের রিবের tubercle-এর সাথে synovial costotransverse joint। '+DT('১৩'),l:['উপরের ছয়টা কশেরুকায় facet অবতল, সামনে-বাইরে মুখ করা; পরের চারটায় (T10 পর্যন্ত) চ্যাপ্টা, উপরে-সামনে-বাইরে মুখ করা','Facet-এর ভেতরে costotransverse ligament রিবের neck-এর সাথে; ডগায় lateral costotransverse ligament tubercle-এর non-articular অংশের সাথে','নিচের বর্ডার থেকে superior costotransverse ligament নিচের রিবের neck-এ']},
 tpTip:{type:'elev',t:'Transverse process',b:'ট্রান্সভার্স প্রসেস',lab:'Transverse process',d:'বড়, মুগুরের মতো; pedicle আর lamina-র জোড়া থেকে বাইরে-পেছনে। পেছনের পৃষ্ঠে deep extensor মাসল। '+DT('১৩')},
 spine:{type:'elev',t:'Spinous process',b:'স্পাইনাস প্রসেস',lab:'Spinous process',d:'লম্বা, নিচে হেলানো। T5–T8-এর spine সবচেয়ে লম্বা আর সবচেয়ে বেশি হেলানো, একটার উপর আরেকটা পড়ে থাকে। '+DT('১৩'),l:['Interspinous ও supraspinous ligament, trapezius, rhomboid major ও minor, latissimus dorsi, serratus posterior superior ও inferior, erector spinae-র medial অংশ']},
 supArt:{type:'joint',t:'Superior articular facet',b:'সুপিরিয়র আর্টিকুলার ফ্যাসেট',lab:'Superior articular facet',show:['lm','joint'],d:'চ্যাপ্টা, পেছনে-বাইরে মুখ করা; দুপাশের facet একটা বৃত্তের চাপের উপর থাকে। তাই থোরাসিক অঞ্চলে ঘোরানো (rotation) অন্য অঞ্চলের চেয়ে মুক্ত। '+DT('১৩'),l:['মডেলে উপরের আসল কশেরুকা যেখানে ছোঁয় সেখানে মার্ক']},
 infArt:{type:'joint',t:'Inferior articular facet',b:'ইনফেরিয়র আর্টিকুলার ফ্যাসেট',lab:'Inferior articular facet',show:['lm','joint'],d:'Superior facet-এর উল্টো দিকে মুখ করা। '+DT('১৩'),l:['মডেলে নিচের আসল কশেরুকা যেখানে ছোঁয় সেখানে মার্ক']},
 foramen:{type:'groove',t:'Vertebral foramen',b:'ভার্টিব্রাল ফোরামেন',lab:'Vertebral foramen',d:'ছোট, গোল; spinal cord-এ এই অঞ্চলে বড় স্ফীতি নেই। '+DT('১২'),l:['মডেলে মধ্যরেখায় body-র পেছনের সবচেয়ে বড় ফাঁকা জায়গার কেন্দ্রে মার্ক']},
 pedicle:{type:'part',t:'Pedicle',b:'পেডিকল',lab:'Pedicle',d:'ছোট; নিচের দিকে ক্রমশ মোটা হয়। '+DT('১২')},
 infNotch:{type:'groove',t:'Inferior vertebral notch',b:'ইনফেরিয়র ভার্টিব্রাল নচ',lab:'Inferior notch',d:'সব থোরাসিক কশেরুকায় স্পষ্ট; একই নম্বরের spinal nerve বহন করে। Superior notch অস্পষ্ট (T1 ছাড়া)। '+DT('১২–১৩')},
 lamina:{type:'part',t:'Lamina',b:'ল্যামিনা',lab:'Lamina',d:'ছোট, মোটা, চওড়া; উপর থেকে নিচে একটার উপর আরেকটা পড়ে। পাশাপাশি lamina ligamenta flava দিয়ে যুক্ত। '+DT('১৩')}
};
const mk=(over)=>{const o={};for(const k in lmBase)o[k]={...lmBase[k],...(over[k]||{})};return o};

const SPECS={
 typical:{dist:230,T:'T6',
  lms:mk({
   bodyAnt:{d:'হৃৎপিণ্ডের মতো আকার, কারণ আড়াআড়ি আর সামনে-পেছনের ব্যাস প্রায় সমান। T3-এর body সবচেয়ে ছোট। T5–T8-এর body একটু অসমান: বাম পাশ descending aorta-র চাপে চ্যাপ্টা। '+DT('১২'),l:['মডেলে T6-এর বাম পাশে aorta-র ছোঁয়া মাপা গেছে']},
   cfUp:{d:'বড়, pedicle-এর সামনে; একই নম্বরের রিবের (6th) head-এর সাথে। '+DT('১২'),l:['মডেলে আসল 6th রিবের head যেখানে ছোঁয় সেখানে মার্ক']},
   cfLow:{d:'ছোট, inferior vertebral notch-এর সামনে; ঠিক পরের রিবের (7th) head-এর সাথে। '+DT('১২'),l:['মডেলে আসল 7th রিবের head যেখানে ছোঁয় সেখানে মার্ক']}}),
  joint:'প্রতি পাশে: উপরের demifacet 6th রিবের head-এর সাথে, নিচের demifacet 7th রিবের head-এর সাথে, transverse process-এর facet 6th রিবের tubercle-এর সাথে। উপরে-নিচে পাশের কশেরুকার সাথে facet joint আর ডিস্ক।'},
 first:{dist:220,T:'T1',
  lms:mk({
   bodyAnt:{d:'ছোট, cervical ধরনের: আড়াআড়ি ব্যাস সামনে-পেছনের চেয়ে বেশি। '+DT('১৩')},
   cfUp:{t:'Full costal facet',b:'পূর্ণ কস্টাল ফ্যাসেট',lab:'Full costal facet',d:'Body-র পাশের উপরের অংশে পূর্ণ গোল facet; 1st রিবের head-এর সাথে পুরোপুরি জোড়া। '+DT('১৩')},
   cfLow:{d:'নিচের অংশে demifacet; 2nd রিবের head-এর একটা অংশের সাথে। '+DT('১৩')},
   foramen:{d:'বড়, ত্রিভুজাকার; spinal cord-এর cervical enlargement-এর নিচের অংশ থাকে। '+DT('১৩')},
   spine:{d:'লম্বা, প্রায় আড়াআড়ি। '+DT('১৩')},
   infNotch:{d:'Inferior notch দিয়ে T1 নার্ভ বের হয়। Superior notch এখানে স্পষ্ট (body-র উপরের পৃষ্ঠের পেছনে-বাইরে উঁচু কিনারার জন্য), তা দিয়ে C8 নার্ভ যায়। '+DT('১৩')}}),
  joint:'প্রতি পাশে: পূর্ণ facet 1st রিবের head-এর সাথে, নিচের demifacet 2nd রিবের head-এর সাথে, transverse process 1st রিবের tubercle-এর সাথে।'},
 ninth:{dist:250,T:'T9',
  lms:mk({
   cfUp:{d:'9th রিবের head-এর জন্য উপরের demifacet। '+DT('১৩')},
   cfLow:{t:'Lower demifacet (এই স্ক্যানে)',d:'Datta: সাধারণত নিচের demifacet থাকে না, কারণ 10th রিবের head শুধু T10-এর সাথে জোড়া লাগে। '+DT('১৩'),l:['এই স্ক্যানে ডান 10th রিবের head T9-কেও ছুঁয়েছে, অর্থাৎ ছোট একটা নিচের demifacet আছে। এরকম ভিন্নতা হয়; পরীক্ষায় Datta-র বর্ণনা লিখবেন']}}),
  joint:'প্রতি পাশে: উপরের demifacet 9th রিবের head-এর সাথে, transverse process 9th রিবের tubercle-এর সাথে। নিচের demifacet সাধারণত নেই।'},
 tenth:{dist:260,T:'T10',
  lms:mk({
   bodyAnt:{d:'বড়, lumbar ধরনের। '+DT('১৩')},
   cfUp:{t:'Single full costal facet',b:'একটাই পূর্ণ কস্টাল ফ্যাসেট',lab:'Costal facet',d:'প্রতি পাশে উপরের বর্ডারের কাছে একটাই পূর্ণ facet; 10th রিবের head-এর সাথে। '+DT('১৩')}}),
  joint:'প্রতি পাশে: একটা পূর্ণ facet 10th রিবের head-এর সাথে, transverse process-এর facet 10th রিবের tubercle-এর সাথে।'},
 eleventh:{dist:250,T:'T11',
  lms:mk({
   cfUp:{t:'Single circular costal facet',b:'একটাই গোল কস্টাল ফ্যাসেট',lab:'Costal facet',d:'উপরের বর্ডার থেকে একটু নিচে সরে; 11th রিবের head-এর সাথে পুরোপুরি জোড়া। '+DT('১৩')},
   tpTip:{d:'Costal facet নেই, কারণ 11th রিব floating। '+DT('১৩')},
   infArt:{d:'Typical-এর মতো চ্যাপ্টা, সামনে-ভেতরে মুখ করা। '+DT('১৩')}}),
  joint:'প্রতি পাশে শুধু একটা জোড়া: গোল facet 11th রিবের head-এর সাথে। Transverse process-এ কোনো রিবের জোড়া নেই।'},
 twelfth:{dist:250,T:'T12',
  lms:mk({
   bodyAnt:{d:'বড়, lumbar ধরনের। '+DT('১৪')},
   cfUp:{t:'Costal facet',b:'কস্টাল ফ্যাসেট',lab:'Costal facet',d:'প্রতি পাশে একটা facet; body-র উপর-নিচের প্রায় মাঝখানে, pedicle-এ ঢুকে গেছে। 12th রিবের head-এর সাথে। '+DT('১৪')},
   tpTip:{d:'ছোট, costal facet নেই। তিনটা tubercle: superior, lateral আর inferior। Superior আর inferior lumbar কশেরুকার mamillary আর accessory tubercle-এর সমান; lateral-টাই আসল transverse process। '+DT('১৪'),l:['মডেলে tubercle তিনটা আলাদা করে মার্ক করা নেই; transverse process-টা ঘুরিয়ে দেখুন']},
   infArt:{d:'উত্তল, lumbar কশেরুকার মতো সামনে-বাইরে মোচড়ানো। '+DT('১৪')}}),
  joint:'প্রতি পাশে শুধু একটা জোড়া: body-র মাঝের facet 12th রিবের head-এর সাথে। Transverse process-এ কোনো রিবের জোড়া নেই।'}
};
// typical-এর বিবরণ অন্যদের ফাঁকা জায়গায়
for(const k in SPECS){const L=SPECS[k].lms;for(const id in L)if(!L[id].d)L[id].d=SPECS.typical.lms[id].d||''}
SPECS.typical.lms.bodyAnt.d=SPECS.typical.lms.bodyAnt.d;

const S=SPECS[window.SPEC]||SPECS.typical;
const B={
 id:'tv-'+(window.SPEC||'typical'),PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:S.dist,
 lms:S.lms,modes:COMMON_MODES(S.joint),
 relLegend:[['cord','#f2e2a0'],['spn','#f2c230'],['symp','#d9b23a'],['azygos','#4a78e0'],['aoDesc','#e0443e'],['eso','#cfd6dc']],
 relLabels:[['cord','Spinal cord'],['spn','Spinal nerve'],['aoDesc','Aorta'],['azygos','Azygos v.'],['symp','Sympathetic trunk']],
 muscleLabels:[['trap','Trapezius'],['rhomb','Rhomboid'],['lat','Latissimus'],['semisp','Semispinalis'],['psoas','Psoas'],['longcolli','Longus colli'],['dia','Diaphragm']],
 muscleView:r=>[[15,16,17].includes(r)?'ant':'post',300],
 whichSrc:'data/which.js',whichNames:WHICH_NAMES,whichRules:WHICH_RULES,whichQ:'এটা কোন থোরাসিক কশেরুকা?',whichHint:'Costal facet কয়টা, কোথায়, আর transverse process-এ facet আছে কি না দেখুন।',whichView:[-.7,.35,.6],whichDist:200,
 holdView:[[0,.9,.4],230]
};
B.lmInfo=id=>{const o=B.lms[id];return {inf:o,lab:o.lab,kind:'lm',type:o.type,quiz:true,show:o.show}};
B.layersSrc='data/'+(window.SPEC||'typical')+'-layers.js';
B.render=(D,$)=>{
 const t=$('#tbl-att');if(t)t.innerHTML=Object.values(B.REG).filter(r=>r.k).map(r=>`<tr><td><span class="sw" style="display:inline-block;vertical-align:-3px;margin-right:8px;background:${r.c}"></span>${r.t}</td><td>${r.w}</td></tr>`).join('');
 document.querySelectorAll('[data-spec-link]').forEach(a=>a.setAttribute('aria-pressed',a.dataset.specLink===(window.SPEC||'typical')));
 const d=D.dims,el=$('#dims');
 if(el&&d){const r=d.tw/d.ap;el.innerHTML=[['আড়াআড়ি',d.tw],['সামনে-পেছনে',d.ap],['উচ্চতা',d.h]].map(x=>`<div><b class="big">${Math.round(x[1])}</b><span>${x[0]}</span></div>`).join('');
  $('#dimNote').textContent=`এই স্ক্যানের ${S.T}-এর body: আড়াআড়ি ÷ সামনে-পেছনে = ${r.toFixed(2)}। `+(r<1.15?'প্রায় সমান, অর্থাৎ হৃৎপিণ্ডের মতো (typical থোরাসিক)।':r<1.4?'আড়াআড়ি একটু বেশি।':'আড়াআড়ি অনেক বেশি, cervical বা lumbar ধরনের দিকে।')+' (মাপ ডিস্কের ছাপ থেকে নেওয়া, আনুমানিক)';}
};
window.BONE=B;
}
