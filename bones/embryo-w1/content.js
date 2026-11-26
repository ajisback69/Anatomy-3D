/* Embryology সপ্তাহ ১: নিষেক থেকে implantation। মডেল আমাদের নিজের স্কিম্যাটিক (স্ক্যান নয়), একক µm।
   লেখা: মানক embryology বইয়ের সাধারণ তথ্য (Langman's Medical Embryology, Moore's The Developing Human)। ইউজারের বই ঠিক হলে পৃষ্ঠা নম্বরসহ মেলাতে হবে। */
{
const SCH='স্কিম্যাটিক 3D: বইয়ের চিত্র আর প্রকাশিত মাপ অনুযায়ী বানানো, আসল স্ক্যান নয়';
const STYLE={zona:['#cfe3f5',.32],cell:['#f2c9b8',.62],nuc:['#8e6cc0',1],pnM:['#4a78e0',1],pnF:['#e0607e',1],pb:['#c9b6e8',1],chrom:['#6c3aa0',1],
 corona:['#e9d08a',1],sperm:['#2f5fa0',1],icm:['#5fae7f',.92],troph0:['#f0b48a',.8],troph:['#e3a56a',1],cavity:['#bfe3f0',.12],syncytio:['#c8455a',1],
 epiblast:['#3d6fd6',1],hypoblast:['#f2c230',1],epith:['#f4b6b6',1],stroma:['#f6ddd5',.55],gland:['#e58fb0',1],cap:['#e0443e',1],
 uterus:['#e9a1a1',.55],tube:['#e9a1a1',1],ovary:['#f2d0b0',1],follicle:['#f7e7b0',1]};
const STR={
 zona:{t:'Zona pellucida',b:'জোনা পেলুসিডা',d:'Oocyte-কে ঘিরে glycoprotein-এর স্বচ্ছ খোলস (ZP1–ZP3), প্রায় ১৫ µm পুরু। শুক্রাণু এখানে বাঁধে, acrosome reaction হয়; নিষেকের পর zona reaction একাধিক শুক্রাণু ঢোকা (polyspermy) আটকায়। ক্লিভেজের সময় কোষগুলোকে একসাথে রাখে আর জরায়ুর নলে আগেভাগে লেগে যাওয়া ঠেকায়। প্রায় ৫ম দিনে blastocyst এখান থেকে বেরিয়ে আসে (hatching)।',l:[SCH]},
 oocyte:{t:'Secondary oocyte',b:'সেকেন্ডারি ঊসাইট',d:'Ovulation-এর সময় ২য় meiosis-এর metaphase-এ থেমে থাকে; শুক্রাণু ঢুকলেই ২য় meiosis শেষ করে। ব্যাস প্রায় ১০০–১২০ µm, মানব শরীরের সবচেয়ে বড় কোষগুলোর একটা।',l:[SCH]},
 spindle:{t:'Metaphase II spindle',b:'মেটাফেজ II স্পিন্ডল',d:'২য় meiosis-এর মাঝপথে থেমে থাকা ক্রোমোজোম; নিষেকের পর বিভাজন শেষ হয়ে ২য় polar body বের হয়।',l:[SCH]},
 pb:{t:'Polar body',b:'পোলার বডি',d:'Meiosis-এর অসম বিভাজনে প্রায় সব cytoplasm oocyte-এ থাকে, ক্রোমোজোমের অর্ধেক ছোট polar body-তে চলে যায়। ১ম polar body ovulation-এর আগে, ২য়টা নিষেকের পর। Perivitelline space-এ থাকে, পরে নষ্ট হয়ে যায়।',l:[SCH]},
 corona:{t:'Corona radiata',b:'করোনা রেডিয়েটা',d:'Zona-র চারপাশে follicular কোষের স্তর। নিষেকের প্রথম ধাপে শুক্রাণু এর ফাঁক দিয়ে ঢোকে; নিষেকের পরে ধীরে ধীরে ঝরে যায়।',l:[SCH]},
 sperm:{t:'Spermatozoon',b:'শুক্রাণু',d:'Capacitation হওয়া শুক্রাণু corona পার হয়ে zona-তে বাঁধে, acrosome-এর enzyme দিয়ে zona ফুঁড়ে oocyte-এর পর্দার সাথে মিশে যায়। মাথা প্রায় ৫ µm, লেজ প্রায় ৫০ µm (এখানে আকার আনুমানিক)।',l:[SCH]},
 pnM:{t:'Male pronucleus',b:'পুরুষ প্রোনিউক্লিয়াস',d:'শুক্রাণুর মাথার নিউক্লিয়াস ফুলে তৈরি হয়। দুই pronucleus-ই DNA দ্বিগুণ করে, তারপর পর্দা ভেঙে ক্রোমোজোম এক spindle-এ সাজে: প্রথম mitosis।',l:[SCH]},
 pnF:{t:'Female pronucleus',b:'স্ত্রী প্রোনিউক্লিয়াস',d:'২য় meiosis শেষ হওয়ার পর oocyte-এর নিজের ২৩টা ক্রোমোজোম থেকে তৈরি।',l:[SCH]},
 blast:{t:'Blastomere',b:'ব্লাস্টোমিয়ার',d:'ক্লিভেজের কোষ। মোট আকার বাড়ে না, প্রতি বিভাজনে কোষ ছোট হয়। ৮-কোষের পর compaction: কোষগুলো চ্যাপ্টা হয়ে পরস্পরকে জড়িয়ে ধরে (tight junction), ভেতর আর বাইরের কোষ আলাদা হতে শুরু করে।',l:[SCH]},
 nuc:{t:'Nucleus',b:'নিউক্লিয়াস',d:'প্রতিটা blastomere-এর নিউক্লিয়াস।',l:[SCH]},
 m_inner:{t:'Inner cell mass (ভেতরের কোষ)',b:'ইনার সেল মাস',d:'Morula-র ভেতরের কোষ; পরে embryoblast হয়ে ভ্রূণ তৈরি করে।',l:[SCH]},
 m_outer:{t:'Outer cell mass (বাইরের কোষ)',b:'আউটার সেল মাস',d:'Morula-র বাইরের কোষ; পরে trophoblast হয়ে placenta-র অংশ তৈরি করে।',l:[SCH]},
 icm:{t:'Embryoblast (inner cell mass)',b:'এমব্রায়োব্লাস্ট',d:'Blastocyst-এর এক মেরুতে (embryonic pole) ভেতরের দেয়ালে লেগে থাকা কোষের গুচ্ছ; এখান থেকে ভ্রূণ তৈরি হয়।',l:[SCH]},
 troph:{t:'Trophoblast',b:'ট্রোফোব্লাস্ট',d:'Blastocyst-এর বাইরের চ্যাপ্টা কোষের স্তর; পরে placenta-র ভ্রূণের অংশ। Implantation-এর সময় cytotrophoblast আর syncytiotrophoblast-এ ভাগ হয়।',l:[SCH]},
 cyto:{t:'Cytotrophoblast',b:'সাইটোট্রোফোব্লাস্ট',d:'Trophoblast-এর ভেতরের স্তর, আলাদা কোষ, বিভাজন করে; নতুন কোষ বাইরের syncytiotrophoblast-এ যোগ হয়।',l:[SCH]},
 syncytio:{t:'Syncytiotrophoblast',b:'সিনসিশিওট্রোফোব্লাস্ট',d:'কোষের সীমানা ছাড়া বহু-নিউক্লিয়াসের ভর; endometrium ফুঁড়ে ঢোকে, পরে hCG তৈরি করে (গর্ভধারণ পরীক্ষার ভিত্তি)।',l:[SCH]},
 cavity:{t:'Blastocyst cavity (blastocoele)',b:'ব্লাস্টোসিস্ট গহ্বর',d:'Morula-র কোষের ফাঁকে তরল জমে একটা গহ্বর হয়; তখন ভ্রূণকে blastocyst বলে।',l:[SCH]},
 epiblast:{t:'Epiblast',b:'এপিব্লাস্ট',d:'Embryoblast-এর trophoblast-মুখী লম্বা (columnar) কোষের স্তর। পরে gastrulation-এ তিন germ layer-ই এখান থেকে।',l:[SCH]},
 hypoblast:{t:'Hypoblast',b:'হাইপোব্লাস্ট',d:'Embryoblast-এর cavity-মুখী ছোট (cuboidal) কোষের স্তর; প্রথম সপ্তাহের শেষে দেখা দেয়। Epiblast আর hypoblast মিলে bilaminar disc (সপ্তাহ ২)।',l:[SCH]},
 epith:{t:'Uterine epithelium',b:'জরায়ুর এপিথেলিয়াম',d:'Endometrium-এর উপরের স্তর; blastocyst এখানে লেগে যায় (attachment), তারপর syncytiotrophoblast ফুঁড়ে ঢোকে।',l:[SCH]},
 stroma:{t:'Endometrial stroma',b:'এন্ডোমেট্রিয়াল স্ট্রোমা',d:'Secretory phase-এ ফোলা, রক্তনালী আর গ্রন্থিতে ভরা; implantation-এর জন্য তৈরি।',l:[SCH]},
 gland:{t:'Uterine gland',b:'জরায়ুর গ্রন্থি',d:'Secretory phase-এ পেঁচানো, glycogen আর mucus-পূর্ণ রস দেয়।',l:[SCH]},
 cap:{t:'Capillary',b:'কৈশিক নালী',d:'Stroma-র রক্তনালী; সপ্তাহ ২-এ syncytiotrophoblast এগুলোতে ঢুকে lacuna-য় মায়ের রক্ত আনে।',l:[SCH]},
 uterus:{t:'Uterus',b:'জরায়ু',d:'সাধারণত body-র সামনের বা পেছনের দেয়ালে implantation হয়।',l:[SCH]},
 utcav:{t:'Uterine cavity',b:'জরায়ুর গহ্বর',d:'Morula প্রায় ৩–৪ দিনে এখানে পৌঁছায়।',l:[SCH]},
 tube:{t:'Uterine tube',b:'জরায়ুর নল',d:'Infundibulum (fimbriae), ampulla (নিষেক এখানে), isthmus, intramural অংশ। নলের পেশির সংকোচন আর cilia ভ্রূণকে জরায়ুর দিকে নেয়।',l:[SCH]},
 ovary:{t:'Ovary',b:'ডিম্বাশয়',d:'Ovulation-এ পরিণত follicle ফেটে secondary oocyte বের হয়; fimbriae তুলে নলে নেয়।',l:[SCH]},
 follicle:{t:'Mature (Graafian) follicle',b:'পরিণত ফলিকল',d:'Ovulation-এর ঠিক আগের follicle।',l:[SCH]}
};
for(const k of ['pnM','pnF'])STR[k].k=k;
const L=(t,b,d,type)=>({t,b,d,type,show:'lm',l:[SCH]});
const S=k=>STR[k].d;
const LMS={
 f_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),f_oocyte:L('Secondary oocyte','ঊসাইট',S('oocyte'),'part'),f_pb1:L('১ম polar body','পোলার বডি',S('pb'),'part'),
 f_corona:L('Corona radiata','করোনা',S('corona'),'part'),f_sperm:L('শুক্রাণু zona ফুঁড়ছে','Sperm',S('sperm'),'node'),
 f_pvs:L('Perivitelline space','পেরিভাইটেলাইন স্পেস','Oocyte আর zona-র মাঝের ফাঁক; polar body এখানে থাকে।','groove'),
 p_male:L('Male pronucleus','পুরুষ প্রোনিউক্লিয়াস',S('pnM'),'part'),p_female:L('Female pronucleus','স্ত্রী প্রোনিউক্লিয়াস',S('pnF'),'part'),
 p_pb2:L('২য় polar body','পোলার বডি ২','২য় meiosis শেষে বের হয়; এর উপস্থিতি নিষেক হওয়ার চিহ্ন।','part'),p_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),
 c2_blast:L('Blastomere (২-কোষ)','ব্লাস্টোমিয়ার',S('blast'),'part'),c2_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),c2_pb:L('Polar body','পোলার বডি',S('pb'),'part'),
 c4_blast:L('Blastomere (৪-কোষ)','ব্লাস্টোমিয়ার',S('blast'),'part'),c4_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),c4_pb:L('Polar body','পোলার বডি',S('pb'),'part'),
 c8_blast:L('Blastomere (৮-কোষ, compaction)','ব্লাস্টোমিয়ার',S('blast'),'part'),c8_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),c8_pb:L('Polar body','পোলার বডি',S('pb'),'part'),
 mo_outer:L('Outer cell mass','আউটার সেল মাস',S('m_outer'),'part'),mo_inner:L('Inner cell mass','ইনার সেল মাস',S('m_inner'),'part'),mo_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),
 b_troph:L('Trophoblast','ট্রোফোব্লাস্ট',S('troph'),'surf'),b_icm:L('Embryoblast','এমব্রায়োব্লাস্ট',S('icm'),'part'),b_cav:L('Blastocyst cavity','গহ্বর',S('cavity'),'open'),
 b_zona:L('Zona pellucida','জোনা',S('zona'),'surf'),b_pole:L('Embryonic pole','এমব্রায়োনিক পোল','Embryoblast যে দিকে; এই মেরু দিয়েই সাধারণত endometrium-এ লেগে যায়। উল্টো দিক abembryonic pole।','part'),
 h_troph:L('Trophoblast','ট্রোফোব্লাস্ট',S('troph'),'surf'),h_icm:L('Embryoblast','এমব্রায়োব্লাস্ট',S('icm'),'part'),h_cav:L('Blastocyst cavity','গহ্বর',S('cavity'),'open'),
 h_bulge:L('Zona থেকে বেরিয়ে আসা অংশ','Hatching','Blastocyst ফুলে আর enzyme দিয়ে zona-য় ফাটল ধরিয়ে বেরিয়ে আসে; zona না সরলে implantation হয় না।','elev'),h_zona:L('ফাটা zona pellucida','জোনা',S('zona'),'surf'),
 i_syn:L('Syncytiotrophoblast','সিনসিশিও',S('syncytio'),'part'),i_cyto:L('Cytotrophoblast','সাইটো',S('cyto'),'surf'),i_epi:L('Epiblast','এপিব্লাস্ট',S('epiblast'),'part'),
 i_hypo:L('Hypoblast','হাইপোব্লাস্ট',S('hypoblast'),'part'),i_cav:L('Blastocyst cavity','গহ্বর',S('cavity'),'open'),i_epith:L('জরায়ুর epithelium','এপিথেলিয়াম',S('epith'),'surf'),
 i_gland:L('Uterine gland-এর মুখ','গ্রন্থি',S('gland'),'open'),i_stroma:L('Endometrial stroma','স্ট্রোমা',S('stroma'),'surf'),
 j_ov:L('Ovulation','ডিম্বস্ফোটন','পরিণত follicle থেকে secondary oocyte বের হয়; fimbriae তুলে নেয়।','node'),
 j_fert:L('দিন ০: নিষেক (ampulla)','নিষেক','Ampulla-য়, সাধারণত ovulation-এর ২৪ ঘণ্টার মধ্যে।','node'),
 j_2c:L('দিন ১–২: ২-কোষ','ক্লিভেজ','প্রায় ৩০ ঘণ্টায় প্রথম বিভাজন।','node'),j_4c:L('দিন ২: ৪-কোষ','ক্লিভেজ','প্রায় ৪০ ঘণ্টায়।','node'),
 j_mor:L('দিন ৩: morula (isthmus-এর কাছে)','মরুলা','প্রায় ৩ দিনে ১৬-কোষ; ৩–৪ দিনে জরায়ুতে ঢোকে।','node'),
 j_bl:L('দিন ৪–৫: blastocyst (জরায়ুর গহ্বরে)','ব্লাস্টোসিস্ট','জরায়ুতে ঢোকার পর গহ্বর তৈরি; প্রায় ৫ম দিনে hatching।','node'),
 j_imp:L('দিন ৬–৭: implantation','ইমপ্লান্টেশন','সাধারণত body-র পেছনের বা সামনের দেয়ালে, উপরের দিকে।','node')
};
const ST=(t,k,d,l,view)=>({t,k,card:{t,b:k,d,l:[...(l||[]),SCH]},view});
const STAGES=[
 ST('দিন ০: নিষেক','Fertilization (ampulla)','শুক্রাণু তিন ধাপে ঢোকে: (১) corona radiata পার হওয়া, (২) zona pellucida-য় বাঁধা আর acrosome reaction-এ ফুঁড়ে যাওয়া, (৩) oocyte-এর পর্দার সাথে মিলে যাওয়া। ঢোকার সাথে সাথে cortical reaction আর zona reaction: আর কোনো শুক্রাণু ঢুকতে পারে না। Oocyte ২য় meiosis শেষ করে।',['ফলাফল: diploid সংখ্যা ফেরে, লিঙ্গ নির্ধারণ (X বা Y শুক্রাণু), ক্লিভেজ শুরু'],[[.35,.3,1],330]),
 ST('দিন ০–১: pronucleus','Zygote, pronuclei','২য় polar body বের হয়েছে। পুরুষ আর স্ত্রী pronucleus পাশাপাশি আসে, দুটোই DNA দ্বিগুণ করে; পর্দা মিলিয়ে গিয়ে ক্রোমোজোম এক spindle-এ সাজে। এটাই zygote-এর প্রথম mitosis-এর প্রস্তুতি।',[],[[.2,.2,1],300]),
 ST('প্রায় ৩০ ঘণ্টা: ২-কোষ','Cleavage','Zygote mitosis-এ ভাগ হতে থাকে; কোষ (blastomere) ছোট হয়, মোট আকার একই থাকে, কারণ সবকিছু zona-র ভেতরে।',['এই ছবিতে কোষের আয়তন: zygote-এর অর্ধেক করে'],[[.2,.3,1],300]),
 ST('প্রায় ৪০ ঘণ্টা: ৪-কোষ','Cleavage','বিভাজন ঘুরে ঘুরে, কোষগুলো সমান না-ও হতে পারে।',[],[[.3,.35,1],300]),
 ST('দিন ৩: ৮-কোষ, compaction','Compaction','তৃতীয় বিভাজনের পর কোষগুলো চ্যাপ্টা হয়ে একে অপরকে জড়িয়ে ধরে (tight junction): ভেতরের কোষ আর বাইরের কোষ আলাদা হওয়ার শুরু।',[],[[.3,.35,1],300]),
 ST('দিন ৩–৪: morula','Morula (১৬-কোষ)','প্রায় ৩ দিনে ১৬-কোষের morula (তুঁতফলের মতো দেখতে)। ভেতরের কোষ → inner cell mass (ভ্রূণ), বাইরের কোষ → outer cell mass (trophoblast)। এই সময় জরায়ুতে পৌঁছায়।',['সবুজ: inner cell mass; কমলা: outer cell mass। কেটে দেখুন।'],[[.3,.3,1],300]),
 ST('দিন ৪–৫: blastocyst','Blastocyst','জরায়ুতে ঢোকার পর zona দিয়ে তরল ঢুকে কোষের ফাঁকে জমে একটা গহ্বর হয়: blastocyst। একদিকে embryoblast (embryonic pole), চারদিকে চ্যাপ্টা trophoblast।',['কেটে দেখুন: ভেতরে গহ্বর আর embryoblast'],[[.3,.25,1],320]),
 ST('দিন ৫: hatching','Hatching','Blastocyst zona pellucida-র ফাটল দিয়ে বেরিয়ে আসে। Zona সরলেই trophoblast জরায়ুর দেয়ালে লাগতে পারে।',[],[[.7,.2,.7],360]),
 ST('দিন ৬–৭: implantation শুরু','Implantation','Embryonic pole দিয়ে blastocyst endometrium-এর epithelium-এ লাগে। ওই জায়গায় trophoblast দুই স্তরে ভাগ হয়: ভেতরে cytotrophoblast, বাইরে syncytiotrophoblast, যা epithelium ফুঁড়ে stroma-য় ঢোকে। Embryoblast-এর cavity-মুখী দিকে hypoblast দেখা দেয়।',['Endometrium তখন secretory phase-এ: ফোলা, পেঁচানো গ্রন্থি আর রক্তনালী','সপ্তাহ ২-এ: amniotic cavity, bilaminar disc, lacuna'],[[.45,.35,1],560,[0,-30,0]]),
 ST('যাত্রাপথ: ডিম্বাশয় থেকে জরায়ু','সপ্তাহ ১ কোথায় কোথায়','প্রতিটা বিন্দু একটা দিন। নিষেক ampulla-য়, ক্লিভেজ নলের ভেতর দিয়ে যেতে যেতে, morula ৩–৪ দিনে জরায়ুতে, implantation ৬–৭ দিনে।',['এই দৃশ্যের মাপ আলাদা: জরায়ু আর নল আসল আকারের অনুপাতে নয়','অস্বাভাবিক জায়গায় implantation = ectopic pregnancy (বেশিরভাগ uterine tube-এ)'],[[0,.1,1],900,[110,0,0]])
];
const VIEWS={ant:[0,0,1],post:[0,0,-1],lat:[1,0,.0001],sup:[0,1,.05]};
const B={
 id:'embryo-w1',PARTS:{},REG:{},STR,STYLE,views:VIEWS,target:[0,0,0],dist:320,stages:STAGES,startStage:0,capAll:true,
 MK:[['part','কোষ বা গঠন'],['surf','স্তর বা পৃষ্ঠ'],['open','গহ্বর বা মুখ'],['groove','ফাঁক'],['elev','বেরিয়ে আসা অংশ'],['node','ঘটনা বা বিশেষ বিন্দু']],
 mkNote:'বিন্দুতে ট্যাপ করুন; কোনো গঠনে সরাসরি ট্যাপ করলেও নাম আসবে। ভেতরের জিনিস দেখতে "কেটে দেখা" চাপুন।',
 cuts:{
  mid:{t:'মাঝ বরাবর',n:[0,0,-1],o:0,card:{t:'মাঝ বরাবর কাটা',b:'স্লাইডার দিয়ে গভীরতা বদলান',d:'সামনের অর্ধেক সরানো; প্রতিটা অংশের কাটা মুখ গাঢ় রঙে।'}},
  side:{t:'পাশ থেকে',n:[-1,0,0],o:0,card:{t:'পাশ বরাবর কাটা',b:'স্লাইডার দিয়ে গভীরতা বদলান',d:'এক পাশ সরানো।'}},
  top:{t:'উপর থেকে',n:[0,-1,0],o:0,card:{t:'আড়াআড়ি কাটা',b:'স্লাইডার দিয়ে উচ্চতা বদলান',d:'উপরের অংশ সরানো।'}}
 },
 modes:{
  lm:{layers:{organ:1}},
  cut:{layers:{organ:1},clipLayers:['organ'],cuts:['mid','side','top'],markers:true,view:null},
  quiz:{layers:{organ:1}}
 },
 relLegend:[],relLabels:[],muscleLabels:[],mkLift:1.5
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
