/* স্টার্নামের সব লেখা ও কনফিগারেশন।
   নতুন হাড় বানাতে এই ফাইলটা কপি করে লেখা বদলান; ভিউয়ারের কোড (viewer/viewer.js) একই থাকবে।
   REG-এর নম্বরগুলো pipeline/sternum.py-এর MUSCLE_REGIONS-এর সাথে মেলে। */
{
const REG={
 1:{c:'#d1495b',k:'pm',t:'Pectoralis major',b:'পেক্টোরালিস মেজর',w:'Manubrium ও body-র anterior surface-এর দুপাশ, 6th costal cartilage পর্যন্ত',d:'Sternocostal head এখান থেকে শুরু হয়ে humerus-এর bicipital groove-এর lateral lip-এ গিয়ে লাগে। Humerus-কে ভেতরের দিকে টানে (adduction) ও ঘোরায় (medial rotation)।'},
 2:{c:'#edae49',k:'scm',t:'Sternocleidomastoid (sternal head)',b:'স্টার্নোক্লিডোমাস্টয়েড',w:'Manubrium-এর anterior surface-এর উপরের অংশ',d:'গোল দড়ির মতো tendon দিয়ে শুরু হয়ে mastoid process-এ গিয়ে লাগে। মাথা উল্টো দিকে ঘোরায়, দুপাশেরটা একসাথে ঘাড় সামনে বাঁকায়।'},
 3:{c:'#5fae7f',k:'sh',t:'Sternohyoid',b:'স্টার্নোহায়য়েড',w:'Manubrium-এর posterior surface-এর উপরের-পাশের অংশ',d:'Infrahyoid (strap) muscle, hyoid হাড়ের body-তে গিয়ে লাগে। ঢোঁক গেলার পর hyoid-কে নিচে নামায়।'},
 4:{c:'#1c8fa0',k:'sth',t:'Sternothyroid',b:'স্টার্নোথাইরয়েড',w:'Manubrium-এর posterior surface-এর নিচের অংশ, sternohyoid-এর নিচে ও ভেতরে, 1st costal cartilage পর্যন্ত',d:'Thyroid cartilage-এর oblique line-এ গিয়ে লাগে, larynx-কে নিচে নামায়।'},
 5:{c:'#8e6cc0',k:'tt',t:'Transversus thoracis (sternocostalis)',b:'ট্রান্সভার্সাস থোরাসিস',w:'Body-র posterior surface-এর নিচের অংশ ও xiphoid-এর পেছন',d:'উপরে-বাইরের দিকে গিয়ে 2nd থেকে 6th costal cartilage-এ লাগে। Internal thoracic vessel এর সামনে দিয়ে নামে।'},
 6:{c:'#3b82d6',k:'dia',t:'Diaphragm (sternal part)',b:'ডায়াফ্রাম',w:'Xiphoid process-এর posterior surface',d:'দুটি ছোট slip দিয়ে শুরু হয়। এদের পাশের ফাঁক (Larrey\'s space) দিয়ে superior epigastric vessels নামে।'},
 7:{c:'#f28482',k:'ra',t:'Rectus abdominis',b:'রেক্টাস অ্যাবডোমিনিস',w:'Xiphoid-এর anterior surface (সাথে 5th–7th costal cartilage)',d:'Pubic crest ও symphysis থেকে উঠে এখানে লাগে। পেট সামনে বাঁকায়।'},
 9:{c:'#e9e3d0',k:'la',t:'Linea alba',b:'লিনিয়া আলবা',w:'Xiphoid process-এর নিচের প্রান্ত',d:'দুপাশের পেটের মাসলের aponeurosis মাঝখানে মিলে তৈরি সাদা ফাইব্রাস দাগ, xiphoid থেকে pubic symphysis পর্যন্ত।'},
 10:{c:'#c2a35a',k:'eo',t:'External oblique aponeurosis',b:'এক্সটার্নাল অবলিক',w:'Xiphoid-এর anterior surface ও পাশ',d:'এর aponeurosis rectus sheath-এর সামনের দেয়াল তৈরি করে আর linea alba-তে মেশে।'},
 8:{c:'#8fd3d6',k:null,t:'Articular surface',b:'জয়েন্টের তল',w:'Clavicular notch ও costal notch-গুলো',d:'Clavicle আর costal cartilage এখানে জোড়া লাগে। আসল কার্টিলেজ যেখানে ছোঁয় সেখানে রং করা।'}
};
const KEY2REG={};for(const r in REG)if(REG[r].k)KEY2REG[REG[r].k]=+r;
const ATT_ROWS=[['Manubrium','Anterior surface','Pectoralis major (দুপাশে), sternocleidomastoid-এর sternal head (উপরে)'],['Manubrium','Posterior surface','Sternohyoid (উপরে), sternothyroid (নিচে)'],['Manubrium','Jugular notch','Interclavicular ligament, deep cervical fascia-র investing layer'],['Manubrium','Clavicular notch','Sternoclavicular joint-এর capsule ও articular disc'],['Body','Anterior surface','Pectoralis major (দুপাশে)'],['Body','Posterior surface (নিচে)','Transversus thoracis; উপরে-নিচে sternopericardial ligament'],['Xiphoid','Anterior surface','Rectus abdominis-এর medial fibres, external oblique aponeurosis'],['Xiphoid','Posterior surface','Diaphragm, transversus thoracis'],['Xiphoid','Lateral border','Internal oblique ও transversus abdominis-এর aponeurosis'],['Xiphoid','নিচের প্রান্ত','Linea alba']];
const PARTS={
 manubrium:{c:'#f2c96b',t:'Manubrium sterni',b:'ম্যানুব্রিয়াম',d:'সবচেয়ে চওড়া, মোটা, চতুর্ভুজাকার উপরের অংশ। এখানেই jugular notch, clavicular notch আর 1st costal notch থাকে।',l:['T3–T4 কশেরুকার সামনে','নিচে body-র সাথে manubriosternal joint (symphysis)']},
 body:{c:'#f1ece0',t:'Body of sternum',b:'স্টার্নামের বডি',d:'সবচেয়ে লম্বা অংশ, চারটি sternebra জুড়ে তৈরি। সামনে তিনটি transverse ridge দেখা যায়।',l:['T5–T9 কশেরুকার সামনে','পাশের বর্ডারে 2nd (নিচের অর্ধেক) থেকে 7th costal notch']},
 xiphoid:{c:'#8cc0b0',t:'Xiphoid process',b:'জিফয়েড প্রসেস',d:'সবচেয়ে ছোট, পাতলা নিচের অংশ। অল্প বয়সে কার্টিলেজ থাকে।',l:['T10 লেভেলে (epigastrium)','পেছনে diaphragm, সামনে rectus abdominis লাগে']}
};
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক (বইয়ের বর্ণনা অনুযায়ী বসানো)';
const STR={
 aoAsc:{t:'Ascending aorta',b:'অ্যাসেন্ডিং অ্যাওর্টা',d:'Left ventricle থেকে বের হয়ে উপরে উঠে sternal angle-এর লেভেলে arch-এ পরিণত হয়।',l:['শরীরে body-র উপরের অংশ আর manubrium-এর নিচের অংশের পেছনে থাকে',SCAN]},
 aoArch:{t:'Arch of aorta',b:'অ্যাওর্টিক আর্চ',d:'Manubrium-এর নিচের অর্ধেকের পেছনে থাকে। Sternal angle-এর লেভেলে শুরু হয়ে, সামনে থেকে পেছনে ও ডান থেকে বামে বেঁকে, আবার এই লেভেলেই শেষ হয়।',l:['উপর থেকে তিনটি শাখা বের হয়: brachiocephalic trunk, left common carotid, left subclavian','Sternal puncture-এ সুই বেশি গভীরে গেলে বিপদ',SCAN]},
 aoDesc:{t:'Descending thoracic aorta',b:'ডিসেন্ডিং অ্যাওর্টা',d:'T4–T5 লেভেলে arch শেষ হয়ে কশেরুকার বাম পাশ দিয়ে নামে।',l:[SCAN]},
 bct:{t:'Brachiocephalic trunk',b:'ব্র্যাকিওসেফালিক ট্রাঙ্ক',d:'Arch-এর প্রথম ও সবচেয়ে বড় শাখা। Manubrium-এর পেছনে উপরে-ডানে উঠে right sternoclavicular joint-এর পেছনে right subclavian আর right common carotid-এ ভাগ হয়।',l:[SCAN]},
 lcca:{t:'Left common carotid artery',b:'বাম কমন ক্যারোটিড',d:'Arch থেকে সরাসরি বের হয়ে manubrium-এর পেছন দিয়ে গলায় ওঠে।',l:[SCAN]},
 lsa:{t:'Left subclavian artery',b:'বাম সাবক্ল্যাভিয়ান',d:'Arch-এর শেষ শাখা। এর প্রথম অংশ থেকে বাম internal thoracic artery বের হয়।',l:[SCAN]},
 rcca:{t:'Right common carotid artery',b:'ডান কমন ক্যারোটিড',d:'Brachiocephalic trunk থেকে right sternoclavicular joint-এর পেছনে শুরু হয়।',l:[SCAN]},
 rsa:{t:'Right subclavian artery',b:'ডান সাবক্ল্যাভিয়ান',d:'Brachiocephalic trunk থেকে শুরু হয়। এর প্রথম অংশ থেকে ডান internal thoracic artery বের হয়।',l:[SCAN]},
 svc:{t:'Superior vena cava',b:'সুপিরিয়র ভেনা কাভা',d:'দুই brachiocephalic vein মিলে ডান 1st costal cartilage-এর পেছনে তৈরি হয়, 3rd cartilage-এর লেভেলে right atrium-এ খোলে।',l:['Sternal angle-এর লেভেলে azygos vein এসে এতে মেশে',SCAN]},
 lbcv:{t:'Left brachiocephalic vein',b:'বাম ব্র্যাকিওসেফালিক ভেইন',d:'Manubrium-এর উপরের অংশের ঠিক পেছন দিয়ে আড়াআড়ি নিচে-ডানে যায়। Manubrium-এর সবচেয়ে কাছের posterior relation।',l:['বাম internal thoracic vein এতে খোলে',SCAN]},
 rbcv:{t:'Right brachiocephalic vein',b:'ডান ব্র্যাকিওসেফালিক ভেইন',d:'প্রায় খাড়া নামে, বাম brachiocephalic vein-এর সাথে মিলে SVC তৈরি করে।',l:['ডান internal thoracic vein এতে খোলে',SCAN]},
 rscv:{t:'Right subclavian vein',b:'ডান সাবক্ল্যাভিয়ান ভেইন',d:'Internal jugular vein-এর সাথে মিলে brachiocephalic vein তৈরি করে।',l:[SCAN]},
 lscv:{t:'Left subclavian vein',b:'বাম সাবক্ল্যাভিয়ান ভেইন',d:'Internal jugular vein-এর সাথে মিলে brachiocephalic vein তৈরি করে। Thoracic duct এই জোড়ায় খোলে।',l:[SCAN]},
 heart:{t:'Heart (in pericardium)',b:'হৃৎপিণ্ড',d:'Body-র পেছনে মূলত right ventricle থাকে (sternocostal surface)। Pericardium sternopericardial ligament দিয়ে স্টার্নামে আটকে থাকে।',l:['এজন্য sternal puncture-এর সুই বেশি গভীরে গেলে হৃৎপিণ্ডে লাগতে পারে','CPR-এ স্টার্নামের নিচের অর্ধেকে চাপ দিলে হৃৎপিণ্ড চাপ খায়',SCAN]},
 lung:{t:'Lung ও pleura',b:'ফুসফুস',d:'দুপাশের ফুসফুসের anterior margin স্টার্নামের পেছনে মাঝখানের দিকে চলে আসে। বাম ফুসফুসে 4th cartilage-এর নিচে cardiac notch থাকে, তাই সেখানে হৃৎপিণ্ড pericardium-সহ বুকের দেয়ালের কাছে আসে।',l:[SCAN]},
 thymus:{t:'Thymus',b:'থাইমাস',d:'Manubrium-এর পেছনে superior mediastinum-এর সামনের অংশে থাকে। শিশুদের বড়, puberty-র পর ধীরে ধীরে চর্বিতে পরিণত হয়।',l:['Internal thoracic artery থেকে thymic শাখা পায়',SCAN]},
 trachea:{t:'Trachea',b:'ট্র্যাকিয়া',d:'Jugular notch-এর ঠিক পেছনে থাকে। Sternal angle-এর লেভেলে (T4–T5) দুই principal bronchus-এ ভাগ হয়।',l:['Jugular notch-এ আঙুল রেখে trachea মাঝখানে আছে কি না দেখা হয়',SCAN]},
 eso:{t:'Esophagus',b:'ইসোফেগাস',d:'Trachea-র পেছনে, কশেরুকার সামনে থাকে।',l:[SCAN]},
 ita:{t:'Internal thoracic artery',b:'ইন্টারনাল থোরাসিক আর্টারি',d:'Subclavian artery-র প্রথম অংশ থেকে বের হয়। Sternal margin থেকে প্রায় 1.25 cm বাইরে দিয়ে উপরের ছয়টা costal cartilage-এর পেছনে নামে, 6th intercostal space-এ ভাগ হয়ে যায়।',l:['শাখা: pericardiacophrenic, anterior intercostal (উপরের ৬টা space), perforating (2nd–4th বড়, স্তনে যায়), sternal, thymic, mediastinal','শেষ শাখা: superior epigastric ও musculophrenic','CABG-তে বাম ITA (LIMA) গ্রাফট হিসেবে ব্যবহার হয়',SCH]},
 sea:{t:'Superior epigastric artery',b:'সুপিরিয়র এপিগ্যাস্ট্রিক',d:'Internal thoracic artery-র শেষ শাখা। Diaphragm-এর sternal আর costal অংশের ফাঁক দিয়ে rectus sheath-এ ঢোকে, inferior epigastric-এর সাথে মেশে।',l:[SCH]},
 mph:{t:'Musculophrenic artery',b:'মাস্কুলোফ্রেনিক',d:'Internal thoracic artery-র অন্য শেষ শাখা। Costal margin বরাবর নিচে-বাইরে যায়, 7th–9th intercostal space আর diaphragm-কে রক্ত দেয়।',l:[SCH]},
 itv:{t:'Internal thoracic vein',b:'ইন্টারনাল থোরাসিক ভেইন',d:'নিচে দুটো venae comitantes হিসেবে থাকে, উপরে মিলে একটা ভেইন হয়। আর্টারির ভেতরের (medial) পাশে থাকে, brachiocephalic vein-এ খোলে।',l:[SCH]},
 nodes:{t:'Parasternal (internal thoracic) lymph nodes',b:'প্যারাস্টার্নাল লিম্ফ নোড',d:'Internal thoracic vessel বরাবর intercostal space-গুলোতে থাকে, প্রতি পাশে ৪–৫টি।',l:['যেখান থেকে লিম্ফ আসে: স্তনের medial অংশ, সামনের বুক ও উপরের পেটের দেয়াল, diaphragm-এর উপরের তল, লিভারের উপরের অংশ','যেখানে যায়: bronchomediastinal trunk','স্তন ক্যান্সার এই পথে mediastinum-এ ছড়াতে পারে',SCH]},
 nerve:{t:'Intercostal nerve → anterior cutaneous branch',b:'ইন্টারকস্টাল নার্ভ',d:'T2–T6 intercostal nerve intercostal space ধরে সামনে আসে। Internal thoracic vessel-এর সামনে দিয়ে গিয়ে sternal border-এর কাছে internal intercostal, external intercostal membrane আর pectoralis major ভেদ করে চামড়ায় বের হয়।',l:['স্টার্নামের উপরের চামড়া আর periosteum-এ সাড় দেয়','সাথে internal thoracic artery-র perforating branch থাকে',SCH]},
 vert:{t:'Thoracic vertebra',b:'থোরাসিক কশেরুকা',d:'স্টার্নামের ল্যান্ডমার্কগুলো কোন কশেরুকার লেভেলে আছে, সেটা দেখার জন্য।',l:[SCAN]}
};
const MUS_REG={pm:1,scm:2,sh:3,sth:4,tt:5,dia:6,ra:7,la:9,eo:10};
const LM={
 jugular:{t:'Jugular notch',b:'জাগুলার (সুপ্রাস্টার্নাল) নচ',lab:'Jugular notch',d:'Manubrium-এর superior border-এর মাঝখানের খাঁজ। গলার নিচে আঙুলে সহজে অনুভব করা যায়।',l:['T2–T3 কশেরুকার মাঝের ডিস্কের লেভেলে (T2-এর নিচের বর্ডার)','Interclavicular ligament আর deep cervical fascia-র investing layer লাগে (suprasternal space of Burns তৈরি হয়)','ঠিক পেছনে trachea, তাই trachea সরে গেছে কি না এখানে দেখা হয়']},
 clav:{t:'Clavicular notch',b:'ক্ল্যাভিকুলার নচ',lab:'Clavicular notch',d:'Jugular notch-এর দুপাশের ডিম্বাকার খাঁজ। উপর-পেছন-পাশের দিকে মুখ করে থাকে।',l:['Clavicle-এর medial প্রান্তের সাথে sternoclavicular joint তৈরি করে','Synovial, saddle type জয়েন্ট, ভেতরে articular disc আছে','উপরের অঙ্গ (upper limb) আর axial skeleton-এর মধ্যে এটাই একমাত্র হাড়ের জোড়']},
 angle:{t:'Sternal angle (Angle of Louis)',b:'স্টার্নাল অ্যাঙ্গেল',lab:'Sternal angle',d:'Manubrium আর body যেখানে প্রায় 163° কোণে মিলেছে। এখানে manubriosternal joint (secondary cartilaginous)।',l:['T4–T5 কশেরুকার মাঝের ডিস্কের লেভেল','দুপাশে 2nd costal cartilage, রিব গোনা এখান থেকে শুরু হয়','Arch of aorta শুরু ও শেষ, trachea-র bifurcation, superior আর inferior mediastinum-এর ভাগ']},
 xsj:{t:'Xiphisternal joint',b:'জিফিস্টার্নাল জয়েন্ট',lab:'Xiphisternal jt.',d:'Body আর xiphoid-এর জোড়া। Primary cartilaginous, বয়সে হাড়ে জুড়ে যায়।',l:['T9 কশেরুকার লেভেলে','দুপাশে 7th costal cartilage','Diaphragm-এর central tendon আর হৃৎপিণ্ডের নিচের বর্ডার প্রায় এই লেভেলে']},
 ridge:{t:'Transverse ridge',b:'ট্রান্সভার্স রিজ',lab:'Ridge',d:'Body-র anterior surface-এর আড়াআড়ি দাগ। চারটি sternebra জোড়া লাগার চিহ্ন।',l:['তিনটি ridge থাকে, 3য়, 4র্থ ও 5ম costal notch বরাবর','স্ক্যান মডেলে খুব হালকা দেখা যায়, আসল হাড়েও অনেক সময় অস্পষ্ট থাকে']},
 xtip:{t:'Lower end of xiphoid',b:'জিফয়েডের নিচের প্রান্ত',lab:'Xiphoid tip',d:'Xiphoid process-এর মুক্ত নিচের প্রান্ত।',l:['Linea alba এখানে লাগে','আকার ভিন্ন হতে পারে: bifid, ছিদ্রযুক্ত বা সামনে-পেছনে বাঁকানো']},
 antman:{t:'Anterior surface of manubrium',b:'ম্যানুব্রিয়ামের সামনের পৃষ্ঠ',lab:'Ant. surface',surf:1,d:'উত্তল, খসখসে পৃষ্ঠ।',l:['দুপাশে pectoralis major','উপরে sternocleidomastoid-এর sternal head']},
 postman:{t:'Posterior surface of manubrium',b:'ম্যানুব্রিয়ামের পেছনের পৃষ্ঠ',lab:'Post. surface',surf:1,d:'অবতল, মসৃণ পৃষ্ঠ। পেছনে অনেক গুরুত্বপূর্ণ জিনিস আছে, "রিলেশন" মোডে দেখুন।',l:['Sternohyoid (উপরে) ও sternothyroid (নিচে)','সম্পর্ক: left brachiocephalic vein, arch of aorta, brachiocephalic trunk, left common carotid ও left subclavian artery, thymus']},
 antbody:{t:'Anterior surface of body',b:'বডির সামনের পৃষ্ঠ',lab:'Ant. surface',surf:1,d:'চ্যাপ্টা, তিনটি transverse ridge আছে।',l:['দুপাশে pectoralis major','সামনে শুধু চামড়া ও ফ্যাসিয়া, তাই sternal puncture এখানে সহজ']},
 postbody:{t:'Posterior surface of body',b:'বডির পেছনের পৃষ্ঠ',lab:'Post. surface',surf:1,d:'হালকা অবতল।',l:['নিচের অংশে transversus thoracis','সম্পর্ক: দুপাশের pleura-র anterior margin, pericardium (sternopericardial ligament), হৃৎপিণ্ড']},
 latman:{t:'Lateral border of manubrium',b:'ম্যানুব্রিয়ামের পাশের বর্ডার',lab:'Lat. border',surf:1,d:'উপরে 1st costal notch, নিচে 2nd costal notch-এর উপরের অর্ধেক।',l:['দুই notch-এর মাঝের অংশ সরু ও মুক্ত']}
};
const ORD=['১','২','৩','৪','৫','৬','৭'];
function cnInfo(side,n){
 const sd=side==='R'?'ডান':'বাম';
 const where={1:'Manubrium-এর lateral border-এর উপরের অংশ',2:'অর্ধেক manubrium-এ, অর্ধেক body-তে (demifacet), sternal angle-এর ঠিক পাশে',7:'Body আর xiphoid-এর জোড়ায়, দুটোতে ভাগ হয়ে'}[n]||'Body-র lateral border-এ';
 const jt=n===1?'Primary cartilaginous (synchondrosis), প্রায় নড়ে না':n===2?'Synovial, intra-articular ligament দিয়ে দুটো cavity':'Synovial, plane type';
 return {t:`Costal notch ${n} (${side==='R'?'right':'left'})`,b:`${sd} পাশের ${ORD[n-1]} নম্বর কস্টাল নচ`,d:`${n} নম্বর costal cartilage এখানে জোড়া লাগে।`,l:['অবস্থান: '+where,'জয়েন্ট: '+jt].concat(n===2?['জীবিত মানুষে রিব গোনা এখান থেকে শুরু হয়']:[])};
}
const VIVA=[
 ['স্টার্নাম কী ধরনের হাড়?','Flat, unpaired (জোড়াহীন) হাড়, বুকের সামনের দেয়ালের মাঝখানে থাকে। প্রাপ্তবয়স্কেও এতে red marrow থাকে।'],
 ['স্টার্নাম কীভাবে ধরবেন?','চওড়া-মোটা অংশ (manubrium) উপরে, উত্তল খসখসে পৃষ্ঠ সামনে। এটা unpaired, তাই side determination হয় না।'],
 ['Sternal angle কী, কোন লেভেলে থাকে?','Manubriosternal joint-এর কোণ, প্রায় 163°। T4–T5 কশেরুকার মাঝের ডিস্কের লেভেলে, দুপাশে 2nd costal cartilage।'],
 ['Manubrium-এর posterior relation কী কী?','Left brachiocephalic vein, arch of aorta ও তার তিন শাখা (brachiocephalic trunk, left common carotid, left subclavian), thymus, দুপাশে pleura ও lung।'],
 ['Internal thoracic artery কোথা থেকে আসে, কোথায় শেষ হয়?','Subclavian artery-র প্রথম অংশ থেকে। Sternal margin থেকে প্রায় 1.25 cm বাইরে দিয়ে নেমে 6th intercostal space-এ superior epigastric আর musculophrenic-এ ভাগ হয়।'],
 ['Parasternal lymph node-এর ক্লিনিক্যাল গুরুত্ব কী?','স্তনের medial অংশের লিম্ফ এখানে আসে, তাই স্তন ক্যান্সার এই পথে mediastinum-এ ছড়াতে পারে।'],
 ['Manubriosternal joint কী ধরনের?','Secondary cartilaginous joint (symphysis)।'],
 ['প্রথম sternocostal joint অন্যগুলো থেকে আলাদা কেন?','এটা primary cartilaginous (synchondrosis), বাকিগুলো (2nd থেকে 7th) synovial।'],
 ['Sternal puncture কোথায় করা হয়, বিপদ কী?','Manubrium বা body-র উপরের অংশে। পেছনে aorta আর right ventricle থাকে, তাই guard লাগানো সুই দিয়ে শুধু সামনের cortex পার করতে হয়।'],
 ['Hyrtl\'s law কী?','পুরুষে body-র দৈর্ঘ্য manubrium-এর দ্বিগুণের বেশি, নারীতে কম। লিঙ্গ নির্ণয়ে কাজে লাগে।'],
 ['স্টার্নাম কয়টি center থেকে ossify হয়?','ছয়টি: manubrium-এ ১টি, body-তে ৪টি (প্রতি sternebra-য় ১টি), xiphoid-এ ১টি।'],
 ['Xiphoid-এ কী কী লাগে?','পেছনে diaphragm, সামনে rectus abdominis ও external oblique aponeurosis, নিচের প্রান্তে linea alba।']
];


/* ---------- ভিউয়ারের কনফিগারেশন ---------- */
const LM_TYPE={jugular:'groove',angle:'joint',xsj:'joint',xtip:'elev'};
const lmInfo=id=>{
 const cn=/^cn([RL])(\d)$/.exec(id);
 if(cn)return {inf:cnInfo(cn[1],+cn[2]),lab:ORD[+cn[2]-1],kind:'num',type:'num',quizName:'Costal notch '+cn[2],quiz:cn[1]==='R'};
 if(/^clav/.test(id))return {inf:LM.clav,lab:LM.clav.lab,kind:'lm',type:'joint',quiz:true};
 if(/^ridge/.test(id))return {inf:LM.ridge,lab:LM.ridge.lab,kind:'lm',type:'elev',quiz:true};
 const o=LM[id];return {inf:o,lab:o.lab,kind:o.surf?'surf':'lm',type:o.surf?'surf':LM_TYPE[id],quiz:!o.surf};
};
const TGT=[0,-5,0];
window.BONE={
 id:'sternum',
 PARTS,REG,STR,MUS_REG,lmInfo,
 views:{ant:[0,0,1],post:[0,0,-1],lat:[-1,0,.0001],sup:[0,1,.35],obl:[-.7,.25,.8],pobl:[-.55,.2,-.8],rel:[-.42,.3,-.86]},
 target:TGT,
 dist:420,
 modes:{
  parts:{layers:{},view:['ant',420],card:{t:'তিনটি অংশ',b:'Manubrium · Body · Xiphoid',d:'রঙ দিয়ে তিনটি অংশ আলাদা করা আছে। যেকোনো অংশে ট্যাপ করলে তার বিবরণ আসবে।'}},
  lm:{layers:{},view:['ant',420],card:{t:'মার্কে ট্যাপ করুন',b:'অ্যানাটমিক্যাল পয়েন্ট',d:'প্রতিটা মার্ক একটা ল্যান্ডমার্ক, আকার দেখে ধরন বোঝা যায় (নিচের তালিকা)। মার্কে ট্যাপ করলে নাম আর বিবরণ আসবে। হালকা নীল রঙের জায়গাগুলোতে জয়েন্ট আছে।'}},
  att:{layers:{muscle:1},view:['obl',640,[0,-20,0]],card:{t:'কোন মাসল কোথায় লাগে',b:'আসল মাসল + হাড়ে তার ছাপ',d:'স্বচ্ছ মাসলগুলো স্ক্যান থেকে নেওয়া। হাড়ের রঙিন জায়গায় মাসলটা আসলে হাড়কে ছুঁয়ে আছে। একটা মাসল বেছে নিলে শুধু সেটা গাঢ় হবে। পেছনের মাসল দেখতে "পেছনে" চাপুন, অথবা "মাসল" লেয়ার বন্ধ করে শুধু ছাপ দেখুন।'}},
  rel:{layers:{artery:1,vein:1,nerve:1,lymph:1,organ:1},view:['rel',560,[0,15,-35]],viewDist:600,card:{t:'স্টার্নামের চারপাশে কী আছে',b:'আর্টারি · ভেইন · নার্ভ · লিম্ফ নোড',d:'লাল আর্টারি, নীল ভেইন, হলুদ নার্ভ, সবুজ লিম্ফ নোড। যেকোনো কিছুতে ট্যাপ করুন বা নিচের তালিকা থেকে বেছে নিন। পেছন থেকে দেখলে manubrium-এর পেছনের জিনিসগুলো পরিষ্কার দেখা যায়।'}},
  level:{layers:{vert:1},view:['lat',640,[0,-5,-60]],card:{t:'কোন ল্যান্ডমার্ক কোন কশেরুকার লেভেলে',b:'স্ক্যানে মেপে দেখা',d:'কমলা তলগুলো তিনটি ল্যান্ডমার্ক থেকে সোজা পেছনে কশেরুকা পর্যন্ত গেছে। পাশ থেকে দেখলে সবচেয়ে ভালো বোঝা যায়।',l:['Jugular notch → T2–T3 ডিস্ক','Sternal angle → T4–T5 ডিস্ক','Xiphisternal joint → T9']}},
  quiz:{layers:{}}
 },
 relLegend:[['aoArch','#e0443e'],['bct','#e0443e'],['lcca','#e0443e'],['lsa','#e0443e'],['ita','#ff6b5e'],['svc','#4a78e0'],['lbcv','#4a78e0'],['itv','#7aa0ff'],['nerve','#f2c230'],['nodes','#5cc27a'],['heart','#c9706a'],['lung','#f0b8b2'],['thymus','#e7a8c9'],['trachea','#cfd6dc']],
 relLabels:[['aoArch','Arch of aorta'],['lbcv','Lt. brachiocephalic v.'],['svc','SVC'],['heart','Heart (RV)'],['thymus','Thymus'],['trachea','Trachea'],['ita','Internal thoracic a.'],['nodes','Parasternal nodes'],['nerve','Ant. cutaneous n.']],
 muscleLabels:[['pm','Pectoralis major'],['scm','SCM'],['sh','Sternohyoid'],['sth','Sternothyroid'],['tt','Transversus thoracis'],['ra','Rectus abdominis'],['dia','Diaphragm']],
 muscleView:r=>[[5,6,9].includes(r)?'pobl':[3,4].includes(r)?'post':'obl',520,[6,7,9,10].includes(r)?[0,-70,0]:TGT],
 levels:[['jug','Jugular notch → T2/T3 ডিস্ক',LM.jugular],['ang','Sternal angle → T4/T5 ডিস্ক',LM.angle],['xsj','Xiphisternal joint → T9',LM.xsj]],
 levelPlane:{w:150,d:190,z:-75},
 holdView:[[-.55,.05,.85],440],
 render(D,$){
  $('#attTable').innerHTML=ATT_ROWS.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
  $('#vivaList').innerHTML=VIVA.map(q=>`<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('');
  const dm=D.dims,ratio=dm.body/dm.man;
  $('#dims').innerHTML=[['মোট দৈর্ঘ্য',dm.total],['Manubrium',dm.man],['Body',dm.body],['Xiphoid',dm.xip]].map(x=>`<div><b class="big">${Math.round(x[1])}</b><span>${x[0]}</span></div>`).join('');
  $('#hyrtl').textContent=`এই মডেলে body ÷ manubrium = ${ratio.toFixed(2)}, অর্থাৎ ২-এর বেশি। এটা পুরুষের প্যাটার্ন, আর স্ক্যানটাও একজন পুরুষের। (মাপগুলো স্ক্যান থেকে নেওয়া, সব মানুষের হাড়ে কিছুটা ভিন্নতা থাকে।)`;
  $('#levelNote').textContent='একই স্ক্যানের কশেরুকা মেপে দেখা গেছে: jugular notch আছে T2–T3 ডিস্কের লেভেলে, sternal angle আছে T4–T5 ডিস্কের লেভেলে, আর xiphisternal joint আছে T9-এর লেভেলে। তিনটাই বইয়ের সাথে মেলে। উপরের "লেভেল" মোডে নিজে ঘুরিয়ে দেখুন। জীবিত মানুষে শ্বাস নেওয়া আর ভঙ্গির সাথে এক কশেরুকার মতো ওঠানামা করতে পারে।';
 }
};
}
