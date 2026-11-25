/* হার্টের সব লেখা ও কনফিগারেশন।
   লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Part-I (Thorax), Chapter 6: The Heart, পৃ. ৫৮–৮৬;
   সারফেস অ্যানাটমি পৃ. ৩৪২–৩৪৩।
   PARTS: 1 RA, 2 RV, 3 LA, 4 LV, 5 right auricle, 6 left auricle; +10 = সেই প্রকোষ্ঠের ভেতরের দেয়াল।
   REG: বাইরের পৃষ্ঠ (1 sternocostal, 2 diaphragmatic, 3 left, 4 base)। TERR: কোন ধমনীর এলাকা (নিকটতম শাখা, আনুমানিক)। */
{
const D=window.DATA,M=D.meas;
const SCAN='স্ক্যান থেকে মাপা',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',APX='অবস্থান আনুমানিক (দেয়ালের আকার থেকে)';
const DT=p=>`Datta I, পৃ. ${p}`;
const pc=x=>Math.round(x*100)+'%';
const F=M.frac;

const PARTS={
 1:{c:'#6f9be8',t:'Right atrium',b:'ডান অলিন্দ',d:`হার্টের ডান সীমানা পুরোটা, sternocostal পৃষ্ঠের একটা অংশ আর base-এর ১/৩ তৈরি করে। ${DT('৬১')}`,l:[`এই স্ক্যানে গহ্বরের আয়তন প্রায় ${M.vol.RA} ml, দেয়াল প্রায় ${M.wall_RA} মিমি`]},
 2:{c:'#3d6fd6',t:'Right ventricle',b:'ডান নিলয়',d:`Sternocostal পৃষ্ঠের ২/৩, inferior border-এর বেশিরভাগ আর diaphragmatic পৃষ্ঠের ১/৩। দেয়াল ৩–৫ মিমি। ${DT('৬৩')}`,l:[`স্ক্যানে দেয়াল প্রায় ${M.wall_RV} মিমি, আয়তন প্রায় ${M.vol.RV} ml`]},
 3:{c:'#f08a7a',t:'Left atrium',b:'বাম অলিন্দ',d:`Base-এর ২/৩। দেয়াল প্রায় ৩ মিমি, ডান অলিন্দের চেয়ে একটু মোটা। ${DT('৬৫')}`,l:[`স্ক্যানে দেয়াল প্রায় ${M.wall_LA} মিমি, আয়তন প্রায় ${M.vol.LA} ml`]},
 4:{c:'#d9473b',t:'Left ventricle',b:'বাম নিলয়',d:`Apex, sternocostal পৃষ্ঠের ১/৩, left surface-এর বেশিরভাগ আর diaphragmatic পৃষ্ঠের ২/৩। দেয়াল ৮–১২ মিমি, ডান নিলয়ের তিন গুণ। ${DT('৬৬')}`,l:[`স্ক্যানে দেয়াল প্রায় ${M.wall_LV} মিমি, আয়তন প্রায় ${M.vol.LV} ml`]},
 5:{c:'#a9c4f5',t:'Right auricle',b:'ডান অরিকল',d:`ডান অলিন্দের সামনে-উপরের ফাঁপা শঙ্কু, ascending aorta-র দিকে উঠে যায়। রক্ত জমাট (thrombus) বাঁধার সম্ভাব্য জায়গা। ${DT('৬১, ৬৩')}`},
 6:{c:'#f7b9ad',t:'Left auricle',b:'বাম অরিকল',d:`বাম অলিন্দের সামনে-উপরের শঙ্কু, pulmonary trunk-এর গোড়ার দিকে। ভেতরে musculi pectinati। Thrombus হলে মস্তিষ্ক, কিডনি ইত্যাদিতে embolism হতে পারে। ${DT('৬৫')}`}
};
for(const k of [1,2,3,4,5,6]){const o=PARTS[k];PARTS[k+10]={...o,c:o.c,t:o.t+' (ভেতরের দেয়াল)',b:o.b+'-এর ভেতর'}}

const REG={
 1:{c:'#f4a261',t:'Sterno-costal surface',b:'সামনের পৃষ্ঠ',d:`সামনে আর উপরের দিকে মুখ করা। RA আর তার auricle, left auricle-এর একটু, RV (২/৩) আর LV (১/৩)। ${DT('৬০')}`,l:[`এই স্ক্যানে সামনে থেকে দেখলে: RV ${pc(F.sternocostal.RV)}, RA ${pc(F.sternocostal.RA)}, LV ${pc(F.sternocostal.LV)}`+(F.sternocostal.LA?`, LA ${pc(F.sternocostal.LA)}`:''),'এখানে LV বইয়ের চেয়ে কম দেখা যায়: এই মানুষের হার্ট একটু বেশি বাঁয়ে ঘোরানো'],view:['ant',330]},
 2:{c:'#2a9d8f',t:'Diaphragmatic (inferior) surface',b:'নিচের পৃষ্ঠ',d:`চ্যাপ্টা, নিচে-পেছনে মুখ করা। শুধু দুই নিলয়: LV ২/৩, RV ১/৩। ডায়াফ্রামের central tendon-এর উপর বসে। ${DT('৬০–৬১')}`,l:[`স্ক্যানে নিচ থেকে দেখলে: LV ${pc(F.diaphragmatic.LV)}, RV ${pc(F.diaphragmatic.RV)}`],view:['inf',330]},
 3:{c:'#e9c46a',t:'Left surface',b:'বাম পৃষ্ঠ',d:`উপরে, পেছনে আর বাঁয়ে মুখ করা। মূলত LV, সাথে LA আর left auricle। বাম ফুসফুসের cardiac impression-এর সাথে লাগে। ${DT('৬১')}`,l:[`স্ক্যানে বাঁ থেকে দেখলে: LV ${pc(F.left.LV)}, LA ${pc(F.left.LA)}`],view:['left',330]},
 4:{c:'#8d99ae',t:'Base (posterior surface)',b:'বেস',d:`হার্টের সবচেয়ে স্থির অংশ, প্রায় চতুর্ভুজ, পেছনে আর ডানে মুখ করা। শুধু দুই অলিন্দ: LA ২/৩, RA ১/৩। এখানে চারটা pulmonary vein আর দুই vena cava ঢোকে। ${DT('৫৯')}`,l:[`স্ক্যানে পেছন থেকে: LA ${pc(F.base.LA)}, RA ${pc(F.base.RA)} (বইয়ের সাথে মেলে)`],view:['post',330]}
};

const TERR={
 1:{c:'#f5b041',k:'rcaTrunk',t:'Right coronary artery',b:'ডান করোনারি ধমনী',d:`পুরো RA, RV-র বেশিরভাগ (anterior IV groove বরাবর একটা ফালি বাদে), septum-এর পেছন-নিচের ১/৩, আর বেশিরভাগ মানুষে SA node ও AV node। ${DT('৭৬')}`,l:['রং করা হয়েছে প্রতিটা বিন্দুর সবচেয়ে কাছের ধমনী দেখে, তাই এটা আনুমানিক এলাকা']},
 2:{c:'#e0443e',k:'lad',t:'Anterior interventricular (LAD)',b:'LCA-র anterior IV শাখা',d:`দুই নিলয়ের সামনের অংশ আর septum-এর সামনে-উপরের ২/৩। Diagonal শাখা LV-র মোটা সামনের দেয়ালে যায়। ব্লক সবচেয়ে বেশি হয় এখানে (৪০–৫০%)। ${DT('৭৬, ৭৯')}`,l:['আনুমানিক এলাকা']},
 3:{c:'#9b5de5',k:'lcx',t:'Circumflex branch',b:'LCA-র circumflex শাখা',d:`LA আর LV-র বাম ও পেছনের অংশ। Left marginal artery এর বড় শাখা। ${DT('৭৬')}`,l:['আনুমানিক এলাকা']}
};

const STR={
 heart:{t:'Heart',b:'হৃৎপিণ্ড',d:`Middle mediastinum-এ, pericardium-এ ঢাকা ফাঁপা শঙ্কু আকারের পেশি। প্রায় নিজের মুঠির সমান। ${DT('৫৮')}`},
 tri:{t:'Tricuspid valve',b:'ট্রাইকাসপিড ভাল্‌ভ',d:`ডান AV orifice-এর ভাল্‌ভ। তিনটা leaflet: anterior (সবচেয়ে বড়), posterior, septal (সবচেয়ে ছোট)। Orifice-এর পরিধি ১০–১২ সেমি, তিন আঙুল ঢোকে। ${DT('৬৩–৬৪')}`,l:[`স্ক্যানে annulus-এর পরিধি প্রায় ${M.circ_tri} সেমি`,SCAN]},
 mit:{t:'Mitral (bicuspid) valve',b:'মাইট্রাল ভাল্‌ভ',d:`বাম AV orifice-এর ভাল্‌ভ। দুটো leaflet: anterior (aortic cusp) আর posterior। পরিধি ৭–৯ সেমি। দুই AV orifice প্রায় একই তলে, মাইট্রাল একটু পেছনে-উপরে। ${DT('৬৬–৬৭')}`,l:[`স্ক্যানে annulus-এর পরিধি প্রায় ${M.circ_mit} সেমি`,SCAN]},
 pul:{t:'Pulmonary valve',b:'পালমোনারি ভাল্‌ভ',d:`Infundibulum-এর চূড়ায়, তিনটা semilunar cusp: দুটো সামনে, একটা পেছনে। প্রতিটার কিনারার মাঝে nodule, দুপাশে lunula; উপরে pulmonary sinus। ${DT('৬৫')}`,l:[SCAN]},
 aorValve:{t:'Aortic valve',b:'অ্যাওর্টিক ভাল্‌ভ',d:`Aortic vestibule-এর চূড়ায় তিনটা semilunar cusp: একটা সামনে, দুটো পেছনে; pulmonary cusp-এর চেয়ে মোটা। উপরে aortic sinus (Valsalva): anterior sinus থেকে RCA, left posterior sinus থেকে LCA; right posterior sinus non-coronary। ${DT('৬৭')}`,l:[SCH]},
 chordae:{t:'Chordae tendineae',b:'কর্ডি টেন্ডিনি',d:`Papillary muscle-এর মাথা থেকে leaflet-এর কিনারা আর নিচের পৃষ্ঠে যাওয়া কোলাজেনের সুতা। Systole-এ leaflet উল্টে অলিন্দে যেতে দেয় না। ${DT('৬৪–৬৫')}`,l:[SCH]},
 modBand:{t:'Septomarginal trabecula (moderator band)',b:'মডারেটর ব্যান্ড',d:`RV-র septum থেকে anterior papillary muscle-এর গোড়ায় যাওয়া পেশির সেতু। AV bundle-এর right branch বহন করে, RV বেশি ফুলে যাওয়া ঠেকায়। ${DT('৬৫, ৬৯')}`,l:[SCH]},
 rvAnt:{t:'Anterior papillary muscle (RV)',b:'RV-র anterior প্যাপিলারি',d:`গোড়া sternocostal দেয়ালে, septum-এর কাছে (moderator band এখানে আসে)। Chordae যায় anterior আর posterior leaflet-এ। ${DT('৬৫')}`,l:[SCAN]},
 rvPost:{t:'Posterior papillary muscle (RV)',b:'RV-র posterior প্যাপিলারি',d:`নিচের দেয়াল থেকে ওঠে। Chordae যায় posterior আর septal leaflet-এ। ${DT('৬৫')}`,l:[SCAN]},
 rvSept:{t:'Septal papillary muscle (RV)',b:'RV-র septal প্যাপিলারি',d:`ছোট, সবসময় থাকে না। থাকলে chordae যায় anterior আর septal leaflet-এ। ${DT('৬৫')}`,l:[SCAN]},
 lvAnt:{t:'Anterior papillary muscle (LV)',b:'LV-র anterior প্যাপিলারি',d:`Sternocostal দেয়াল থেকে। Chordae দুই leaflet-এই যায়। ${DT('৬৭')}`,l:[SCAN]},
 lvPost:{t:'Posterior papillary muscle (LV)',b:'LV-র posterior প্যাপিলারি',d:`Diaphragmatic দেয়াল থেকে। Chordae দুই leaflet-এই যায়। ${DT('৬৭')}`,l:[SCAN]},
 rcaTrunk:{t:'Right coronary artery',b:'ডান করোনারি ধমনী',d:`Aorta-র anterior aortic sinus থেকে ওঠে। Pulmonary trunk আর right auricle-এর মাঝ দিয়ে সামনে, তারপর ডান AV groove-এ নামে, inferior border ঘুরে পেছনের AV groove-এ crux পর্যন্ত যায়। ${DT('৭৪–৭৫')}`,l:['শাখা: right conus, right marginal, atrial (SA nodal artery ৬৫%-এ), posterior interventricular, AV nodal (৮০–৯০%-এ)',SCAN]},
 rcaMarg:{t:'Right marginal artery',b:'রাইট মার্জিনাল',d:`RCA-র সবচেয়ে লম্বা ventricular শাখা, inferior border ধরে apex-এর দিকে যায়। ${DT('৭৫')}`,l:[SCAN]},
 pda:{t:'Posterior interventricular branch',b:'পোস্টেরিয়র ইন্টারভেন্ট্রিকুলার',d:`৭০%-এ RCA থেকে crux-এর কাছে একটাই শাখা। Posterior IV groove ধরে apex-এর কাছে LAD-এর সাথে মেলে। Septal শাখা septum-এর পেছন-নিচের ১/৩-এ; প্রথম septal শাখা AV node-এ। যার থেকে আসে, সেই দিক "dominant": বেশিরভাগ মানুষ right dominant। ${DT('৭৫–৭৬')}`,l:[SCAN]},
 rcaPL:{t:'Right posterolateral branch',b:'RCA-র পেছনের শাখা',d:`Crux পেরিয়ে LV-র diaphragmatic পৃষ্ঠে যাওয়া শাখা (right posterior ventricular rami)। ${DT('৭৫')}`,l:[SCAN]},
 rcaSept:{t:'Septal branches of RCA',b:'RCA-র septal শাখা',d:`PDA থেকে septum-এর পেছন-নিচের ১/৩-এ। ${DT('৭৫')}`,l:[SCAN]},
 lcaStem:{t:'Left coronary artery (trunk)',b:'বাম করোনারি ধমনী',d:`Left posterior aortic sinus থেকে। Pulmonary trunk-এর পেছন দিয়ে এসে pulmonary trunk আর left auricle-এর মাঝে LAD আর circumflex-এ ভাগ হয়। ট্রাঙ্ক নিজে বড় শাখা দেয় না। ${DT('৭৬')}`,l:[SCAN]},
 lad:{t:'Anterior interventricular branch (LAD)',b:'LAD',d:`Anterior IV groove ধরে apex-এ নামে, incisura apicis cordis ঘুরে নিচের পৃষ্ঠে PDA-র সাথে মেলে। শাখা: diagonal, left conus, septal (septum-এর সামনে-উপরের ২/৩)। ${DT('৭৬')}`,l:['ব্লকের হার সবচেয়ে বেশি: ৪০–৫০% '+DT('৭৯'),SCAN]},
 lcx:{t:'Circumflex branch',b:'সারকামফ্লেক্স',d:`বাম AV groove ধরে বাম বর্ডার ঘুরে পেছনের AV groove-এ, crux-এর বাঁয়ে RCA-র সাথে মেলে। Mitral annulus-এর খুব কাছে, ভাল্‌ভ বদলের সময় আঘাত পেতে পারে। শাখা: left marginal (bypass graft-এর পছন্দের জায়গা), ৩৫%-এ SA nodal artery। ${DT('৭৬')}`,l:[SCAN]},
 ladSept:{t:'Septal branches of LAD',b:'LAD-এর septal শাখা',d:`Septum-এর সামনে-উপরের ২/৩ সরবরাহ করে। ${DT('৭৬')}`,l:[SCAN]},
 cs:{t:'Coronary sinus',b:'করোনারি সাইনাস',d:`২–৩ সেমি লম্বা চওড়া শিরা, পেছনের AV groove-এ। হার্টের শিরার রক্তের প্রায় ৬০% নেয়; মুখ RA-তে, IVC-র মুখ আর tricuspid orifice-এর মাঝে, Thebesian valve দিয়ে ঢাকা। ${DT('৭৯')}`,l:[SCAN]},
 gcv:{t:'Great cardiac vein',b:'গ্রেট কার্ডিয়াক ভেইন',d:`Apex থেকে anterior IV groove ধরে উঠে বাম বর্ডার ঘুরে coronary sinus-এ। ${DT('৮০')}`,l:[SCAN]},
 mcv:{t:'Middle cardiac vein',b:'মিডল কার্ডিয়াক ভেইন',d:`Apex থেকে posterior IV groove ধরে coronary sinus-এর ডান মাথার কাছে। ${DT('৮০')}`,l:[SCAN]},
 scv:{t:'Small cardiac vein',b:'স্মল কার্ডিয়াক ভেইন',d:`ডান AV groove-এ RA আর RV-র মাঝে, coronary sinus-এর ডান মাথায় খোলে; right marginal vein নেয়। ${DT('৮০')}`,l:[SCH]},
 acv:{t:'Anterior cardiac veins',b:'অ্যান্টেরিয়র কার্ডিয়াক ভেইন',d:`৩–৪টা, infundibulum থেকে রক্ত নিয়ে সরাসরি RA-তে খোলে (coronary sinus-এ না)। ${DT('৭৯')}`,l:[SCAN]},
 plv:{t:'Posterior vein of left ventricle',b:'LV-র পোস্টেরিয়র ভেইন',d:`LV-র নিচের পৃষ্ঠ থেকে, middle cardiac vein-এর বাঁয়ে coronary sinus-এ। ${DT('৮০')}`,l:[SCAN]},
 aoAsc:{t:'Ascending aorta',b:'অ্যাসেন্ডিং অ্যাওর্টা',d:`LV-র aortic vestibule থেকে ওঠে। গোড়ায় তিনটা aortic sinus; এখান থেকে দুই করোনারি ধমনী। ${DT('৬৭, ৭৪')}`,l:[SCAN]},
 aoArch:{t:'Arch of aorta',b:'অ্যাওর্টিক আর্চ',d:`Manubrium-এর নিচের অর্ধেকের পেছনে। ${DT('৩৪৪')}`,l:[SCAN]},
 svc:{t:'Superior vena cava',b:'সুপিরিয়র ভেনা কাভা',d:`RA-র উপর-পেছনে খোলে, মুখে কোনো ভাল্‌ভ নেই। ${DT('৬২')}`,l:[SCAN]},
 ivc:{t:'Inferior vena cava',b:'ইনফেরিয়র ভেনা কাভা',d:`RA-র নিচে-পেছনে, septum-এর কাছে খোলে; মুখে অসম্পূর্ণ Eustachian valve। ${DT('৬২')}`,l:[SCAN]},
 pt:{t:'Pulmonary trunk ও pulmonary arteries',b:'পালমোনারি ট্রাঙ্ক',d:`RV-র infundibulum থেকে উঠে ডান আর বাম pulmonary artery-তে ভাগ হয়। এখানে অক্সিজেনবিহীন রক্ত, তাই বেগুনি-নীল রং। ${DT('৫৮, ৬৫')}`,l:[SCAN]},
 pv:{t:'Pulmonary veins',b:'পালমোনারি ভেইন',d:`প্রতি পাশে দুটো, মোট চারটা, LA-র পেছনের দেয়ালে খোলে। অক্সিজেনযুক্ত রক্ত। ছয়টা শিরা (২ vena cava + ৪ pulmonary) serous pericardium-এর একটা উল্টো 'J' টিউবে ঢাকা; তার মাঝে oblique sinus। ${DT('৫৯')}`,l:[SCAN]},
 saNode:{t:'Sinu-atrial (SA) node',b:'SA নোড: পেসমেকার',d:`SVC-র ডান পাশ আর right auricle-এর মাঝের খাঁজ থেকে crista terminalis-এর উপরের অংশ পর্যন্ত; ১০–২০ মিমি লম্বা। মাঝ দিয়ে nodal artery যায় (বেশিরভাগে RCA থেকে)। ১৯০৭-এ Keith ও Flack। ${DT('৭৩')}`,l:[SCH]},
 avNode:{t:'Atrio-ventricular (AV) node',b:'AV নোড',d:`ডান পাশের atrial septum-এ, coronary sinus-এর মুখের ঠিক উপরে, triangle of Koch-এর ভেতরে। এখানে transitional cell বেশি বলে impulse একটু দেরি করে। ৮০–৯০%-এ RCA থেকে রক্ত। ১৯০৬-এ Tawara। ${DT('৭৩')}`,l:[SCH]},
 hisBundle:{t:'AV bundle (of His)',b:'বান্ডল অব হিজ',d:`AV node থেকে right fibrous trigone-এর সুড়ঙ্গ দিয়ে membranous septum-এর পেছনের কিনারা ধরে muscular septum-এর চূড়ায় গিয়ে ডান ও বাম শাখায় ভাগ। Atrium আর ventricle-এর মধ্যে এটাই একমাত্র পেশির সংযোগ। ${DT('৭৩–৭৪')}`,l:[SCH]},
 rbb:{t:'Right bundle branch',b:'ডান শাখা',d:`Septum বরাবর, তারপর moderator band দিয়ে anterior papillary muscle-এর গোড়ায়; সেখান থেকে Purkinje জাল। ${DT('৭৪')}`,l:[SCH]},
 lbb:{t:'Left bundle branch',b:'বাম শাখা',d:`Membranous septum ফুঁড়ে বাম পাশে, ২–৩ সেমি পরে anterior আর posterior দুই ভাগে দুই papillary muscle-এর গোড়ায়। ${DT('৭৪')}`,l:[SCH]},
 intTract:{t:'Internodal tracts',b:'ইন্টারনোডাল ট্র্যাক্ট',d:`James-এর মতে SA থেকে AV node-এ তিনটা পথ: anterior (Bachmann, SVC-র সামনে দিয়ে), middle (Wenckebach, SVC-র পেছন ঘুরে), posterior (Thorel, crista terminalis আর IVC-র ভাল্‌ভ ধরে)। ${DT('৭৩–৭৪')}`,l:[SCH]},
 cc:{t:'Costal cartilage',b:'কস্টাল কার্টিলেজ',d:`হার্টের সামনে sternum-এর বডি আর দুপাশের ৩য়–৬ষ্ঠ costal cartilage। হার্টের ২/৩ মধ্যরেখার বাঁয়ে। ${DT('৬০–৬১')}`,l:[`স্ক্যানে হার্টের ${pc(M.leftOfMid)} মধ্যরেখার বাঁয়ে`]},
 rib:{t:'Ribs',b:'রিব',d:'বুকের খাঁচা (সামনের অংশ)।',l:[SCAN]},
 sternum:{t:'Sternum',b:'স্টার্নাম',d:`বডির পেছনে হার্ট। ৪র্থ costal cartilage-এর নিচে বাম ফুসফুসের cardiac notch-এর জন্য pericardium সরাসরি স্টার্নামের বাম অর্ধেকের নিচের দুই খণ্ড ছোঁয়: এটাই cardiac dullness-এর জায়গা। ${DT('৬০')}`,l:[SCAN]},
 lung:{t:'Lungs ও pleura',b:'ফুসফুস',d:`দুই ফুসফুসের সামনের কিনারা হার্ট আর বুকের দেয়ালের মাঝে ঢুকে থাকে। ডানে-বাঁয়ে mediastinal pleura, phrenic nerve আর pericardiacophrenic vessel হার্টকে ফুসফুস থেকে আলাদা করে। ${DT('৬০–৬১')}`,l:[SCAN]},
 dia:{t:'Diaphragm',b:'ডায়াফ্রাম',d:`Diaphragmatic পৃষ্ঠ এর central tendon আর বাম অংশের উপর; নিচে liver আর stomach-এর fundus। Fibrous pericardium এর সাথে জোড়া। ${DT('৬১')}`,l:[SCAN]},
 eso:{t:'Oesophagus',b:'অন্ননালি',d:`Base-এর পেছনে। Mitral stenosis-এ ফুলে ওঠা LA একে চেপে গিলতে কষ্ট দিতে পারে। ${DT('৬০')}`,l:[SCAN]},
 aoDesc:{t:'Descending thoracic aorta',b:'ডিসেন্ডিং অ্যাওর্টা',d:`Base আর কশেরুকার মাঝে থাকা জিনিসগুলোর একটা। ${DT('৬০')}`,l:[SCAN]},
 trachea:{t:'Trachea ও bronchi',b:'শ্বাসনালি',d:`ডান আর বাম bronchus base আর কশেরুকার মাঝে। Pulmonary trunk-এর ভাগের উপরে-পেছনে tracheal bifurcation; তার সামনে deep cardiac plexus। ${DT('৬০, ৮১')}`,l:[SCAN]},
 thymus:{t:'Thymus',b:'থাইমাস',d:'উপরের দিকে, বড় রক্তনালীর সামনে।',l:[SCAN]},
 vert:{t:'Thoracic vertebrae',b:'থোরাসিক কশেরুকা',d:`শোয়া অবস্থায় base থাকে T5–T8-এর সামনে। ${DT('৫৯')}`,l:[SCAN]},
 mkRight:{t:'ডান বর্ডার (সারফেস মার্কিং)',b:'Datta-র তিন বিন্দু',d:`ডান ৩য় costal cartilage-এর উপরের কিনারায় স্টার্নাম থেকে ১.২ সেমি → ডান ৪র্থ intercostal space-এ মধ্যরেখা থেকে ৩.৭ সেমি → ডান ৬ষ্ঠ costal cartilage স্টার্নামের কাছে। ডানে সামান্য উত্তল, সবচেয়ে বেশি ৪র্থ space-এ। ${DT('৩৪২')}`,l:['এই মানুষের বুকের খাঁচায় মেপে বসানো']},
 mkInf:{t:'নিচের বর্ডার (সারফেস মার্কিং)',b:'Datta',d:`ডান ৬ষ্ঠ costal cartilage → xiphisternal joint → apex beat (বাম ৫ম intercostal space, মধ্যরেখা থেকে ৯ সেমি)। ${DT('৩৪২')}`,l:['এই মানুষের বুকের খাঁচায় মেপে বসানো']},
 mkLeft:{t:'বাম বর্ডার (সারফেস মার্কিং)',b:'Datta',d:`বাম ২য় costal cartilage-এর নিচের কিনারায় স্টার্নামের কিনারা থেকে ১.২ সেমি → apex beat; উপরে-বাঁয়ে সামান্য উত্তল। ${DT('৩৪৩')}`,l:['এই মানুষের বুকের খাঁচায় মেপে বসানো']},
 mkUpper:{t:'উপরের বর্ডার (সারফেস মার্কিং)',b:'Datta',d:`ডান আর বাম বর্ডারের উপরের মাথা দুটো যোগ করা লাইন। ${DT('৩৪৩')}`},
 scanOutline:{t:'স্ক্যানের আসল হার্ট',b:'সামনে থেকে দেখা ছায়া',d:'সবুজ লাইন: এই মানুষের আসল হার্টের সীমানা, সামনের দেয়ালে প্রজেক্ট করা। কমলা লাইন (বইয়ের নিয়ম) এর সাথে মিলিয়ে দেখুন।',l:[`স্ক্যানে apex মধ্যরেখা থেকে ${M.apexScan.dx} সেমি বাঁয়ে, ${M.apexScan.space==='rib5'?'বাম ৫ম রিবের পেছনে (৫ম space-এর ঠিক উপরে)':M.apexScan.space} — MRI শোয়া অবস্থায় করা`,SCAN]},
 orPul:{t:'Pulmonary orifice',b:'সারফেস মার্কিং',d:`বাম ৩য় costal cartilage-এর উপরের কিনারায় ২.৫ সেমি আড়াআড়ি লাইন, কিছুটা স্টার্নামের পেছনে। ${DT('৩৪৩')}`,l:['সবুজ বিন্দু: স্ক্যানের আসল ভাল্‌ভ']},
 orAor:{t:'Aortic orifice',b:'সারফেস মার্কিং',d:`বাম ৩য় intercostal space-এর ভেতরের মাথা থেকে নিচে-ডানে ২.৫ সেমি, pulmonary-র একটু নিচে-ডানে, স্টার্নামের বাম অর্ধেকে। ${DT('৩৪৩')}`,l:['সবুজ বিন্দু: স্ক্যানের aortic root']},
 orTri:{t:'Tricuspid orifice',b:'সারফেস মার্কিং',d:`মধ্যরেখায় ৪র্থ costal cartilage-এর লেভেল থেকে নিচে, সামান্য ডানে ৪ সেমি; স্টার্নামের ডান অর্ধেকের পেছনে। ${DT('৩৪৩')}`,l:['সবুজ বিন্দু: স্ক্যানের আসল ভাল্‌ভ']},
 orMit:{t:'Mitral orifice',b:'সারফেস মার্কিং',d:`বাম ৪র্থ costal cartilage-এর লেভেলে স্টার্নামের বাম অর্ধেকের পেছনে, নিচে-ডানে ৩ সেমি। ${DT('৩৪৩')}`,l:['সবুজ বিন্দু: স্ক্যানের আসল ভাল্‌ভ']},
 ausAor:{t:'Aortic area',b:'শোনার জায়গা',d:`ডান ২য় intercostal space, স্টার্নামের পাশে। রক্তের প্রবাহের দিকে শব্দ যায়, তাই ভাল্‌ভের ঠিক উপরে না শুনে এখানে শোনা হয়। ${DT('৮৬')}`},
 ausPul:{t:'Pulmonary area',b:'শোনার জায়গা',d:`বাম ২য় intercostal space, স্টার্নামের পাশে। ${DT('৮৬')}`},
 ausTri:{t:'Tricuspid area',b:'শোনার জায়গা',d:`বাম ৫ম intercostal space, স্টার্নামের পাশে। ${DT('৮৬')}`},
 ausMit:{t:'Mitral area',b:'শোনার জায়গা',d:`বাম ৫ম intercostal space, apex beat-এর কাছে। ${DT('৮৬')}`}
};
for(const k of ['T4','T5','T6','T7','T8'])STR[k]={...STR.vert,t:'Thoracic vertebra '+k};

/* ল্যান্ডমার্ক: type = মার্কের আকার; show = কোন মোডে; সব পয়েন্ট pipeline/heart.py-তে মাপা */
const I=(t,b,d,type,show,l)=>({t,b,d,type,show,l});
const EXT=['lm','quiz'],FACE=['lm','face','quiz'],INT=['int','quiz'],VAL=['int','valve','quiz'];
const LMS={
 apex:I('Apex','অ্যাপেক্স',`শুধু LV দিয়ে তৈরি শঙ্কু; নিচে, সামনে আর বাঁয়ে মুখ। বাম ৫ম intercostal space-এ মধ্যরেখা থেকে প্রায় ৯ সেমি, nipple-এর একটু নিচে-ভেতরে। সামনে বাম ফুসফুস আর pleura। Apex beat: systole-এ বাম ৫ম space-এ mid-clavicular line-এর ঠিক ভেতরে অনুভূত ধাক্কা; নবজাতকে ৪র্থ space-এ। ${DT('৫৯')}`,'part',FACE,[`স্ক্যানে: মধ্যরেখা থেকে ${M.apexScan.dx} সেমি বাঁয়ে`]),
 base:I('Base (posterior surface)','বেস',REG[4].d,'surf',FACE,REG[4].l),
 sternocostal:I('Sterno-costal surface','সামনের পৃষ্ঠ',REG[1].d,'surf',FACE,REG[1].l),
 diaphragmatic:I('Diaphragmatic surface','নিচের পৃষ্ঠ',REG[2].d,'surf',FACE,REG[2].l),
 leftSurf:I('Left surface','বাম পৃষ্ঠ',REG[3].d,'surf',FACE,REG[3].l),
 rightBorder:I('Right border','ডান বর্ডার',`গোল, উত্তল; শুধু RA। SVC-র মুখের ডান পাশ থেকে IVC-র মুখ পর্যন্ত। Base আর sternocostal পৃষ্ঠকে আলাদা করে। ${DT('৬০')}`,'surf',FACE),
 infBorder:I('Inferior border (margo acutus)','নিচের ধারালো বর্ডার',`ধারালো; IVC-র মুখ থেকে apex পর্যন্ত, মূলত RV। সাথে right marginal artery। Apex-এর কাছে incisura apicis cordis। ${DT('৬০')}`,'surf',FACE),
 leftBorder:I('Left border (margo obtusus)','বাম বর্ডার',`অস্পষ্ট, উত্তল; left auricle থেকে apex পর্যন্ত, মূলত LV। সাথে left marginal artery। ${DT('৬০')}`,'surf',FACE),
 antIVgroove:I('Anterior interventricular groove','সামনের IV খাঁজ',`বাম বর্ডারের সমান্তরালে নেমে incisura-তে inferior border-এ মেশে। ভেতরে LAD আর great cardiac vein। Septum-এর সামনের জোড়া এখানে। ${DT('৬০')}`,'groove',EXT),
 postIVgroove:I('Posterior interventricular groove','পেছনের IV খাঁজ',`নিচের পৃষ্ঠে; ভেতরে posterior IV artery, middle cardiac vein। Septum-এর পেছনের জোড়া। ${DT('৬০–৬১')}`,'groove',EXT),
 avGrooveR:I('Atrio-ventricular groove: ডান অংশ','AV খাঁজ (ডান)',`RA আর RV-র মাঝে নিচে-ডানে নামে; ভেতরে RCA-র ট্রাঙ্ক, উপর দিয়ে anterior cardiac vein পার হয়। পুরো খাঁজ C আকারের, সামনে pulmonary trunk-এর গোড়ার জন্য অসম্পূর্ণ। ${DT('৬০–৬১')}`,'groove',EXT),
 avGrooveL:I('Atrio-ventricular groove: বাম অংশ','AV খাঁজ (বাম)',`Left auricle আর LV-র মাঝে; ভেতরে LCA-র ট্রাঙ্ক ও circumflex, great cardiac vein-এর শেষ আর coronary sinus-এর শুরু। ${DT('৬১')}`,'groove',EXT),
 avGrooveP:I('Atrio-ventricular groove: পেছনের অংশ','AV খাঁজ (পেছন)',`Base আর diaphragmatic পৃষ্ঠের মাঝে; ভেতরে coronary sinus আর দুই করোনারির মিলন। ${DT('৬১')}`,'groove',EXT),
 crux:I('Crux of the heart','ক্রাক্স',`Interatrial groove, posterior IV groove আর পেছনের AV groove যেখানে মেশে। RCA এখানে পৌঁছে PDA দেয়। ${DT('৬১, ৭৫')}`,'groove',EXT),
 incisura:I('Incisura apicis cordis','অ্যাপেক্সের খাঁজ',`Apex-এর কাছে inferior border-এর খাঁজ; LAD এখান দিয়ে নিচের পৃষ্ঠে যায়। ${DT('৬০')}`,'groove',EXT),
 sulcusTerm:I('Sulcus terminalis','সালকাস টার্মিনালিস',`ডান বর্ডার ধরে SVC থেকে IVC-র মুখ পর্যন্ত অগভীর খাঁজ; ভেতরে crista terminalis-এর সাথে মেলে। ${DT('৬১')}`,'groove',EXT),
 iaGroove:I('Interatrial groove','ইন্টারঅ্যাট্রিয়াল খাঁজ',`Base-এ দুই অলিন্দের মাঝে খাড়া অগভীর খাঁজ; atrial septum-এর পেছনের জোড়া। ${DT('৫৯')}`,'groove',EXT),
 rAuricle:I('Right auricle','ডান অরিকল',PARTS[5].d,'part',EXT),
 lAuricle:I('Left auricle','বাম অরিকল',PARTS[6].d,'part',EXT),
 aortaRoot:I('Ascending aorta','অ্যাসেন্ডিং অ্যাওর্টা',STR.aoAsc.d,'open',['lm']),
 ptRoot:I('Pulmonary trunk','পালমোনারি ট্রাঙ্ক',STR.pt.d,'open',['lm']),
 svcEnd:I('Superior vena cava','SVC',STR.svc.d,'open',['lm']),
 ivcEnd:I('Inferior vena cava','IVC',STR.ivc.d,'open',['lm']),
 // ডান অলিন্দের ভেতর
 svcOpen:I('Opening of SVC','SVC-র মুখ',`উপর-পেছনে, নিচে-সামনে মুখ করা; কোনো ভাল্‌ভ নেই। Sinus venarum (মসৃণ অংশ)-এ। ${DT('৬২')}`,'open',INT),
 ivcOpen:I('Opening of IVC','IVC-র মুখ',`নিচে-পেছনে, septum-এর কাছে। সামনের কিনারায় অসম্পূর্ণ Eustachian valve; ভ্রূণে এটা IVC-র রক্ত foramen ovale-এর দিকে পাঠাত। ${DT('৬২')}`,'open',INT),
 csOpen:I('Opening of coronary sinus','করোনারি সাইনাসের মুখ',`IVC-র মুখ আর tricuspid orifice-এর মাঝে, septum-এর নিচের অংশে। নিচের কিনারায় Thebesian valve। ঠিক উপরে AV node। ${DT('৬২')}`,'open',INT),
 triOrifice:I('Right atrio-ventricular (tricuspid) orifice','ট্রাইকাসপিড ছিদ্র',`ডিম্বাকার, প্রায় খাড়া; sagittal তলের সাথে প্রায় ৪৫°, নিচে-সামনে-বাঁয়ে apex-এর দিকে মুখ। তাই রক্ত RA থেকে RV-তে প্রায় আড়াআড়ি যায়। এর চারপাশ RA-র vestibule। ${DT('৬৩–৬৪')}`,'open',VAL,STR.tri.l),
 fossaOvalis:I('Fossa ovalis','ফসা ওভালিস',`IVC-র মুখের উপরে-বাঁয়ে septum-এ ডিম্বাকার গর্ত; মেঝে পাতলা, septum primum দিয়ে তৈরি। ${DT('৬৩')}`,'groove',INT,[`স্ক্যানে এখানে septum সবচেয়ে পাতলা: প্রায় ${M.septum_fossa} মিমি`,APX]),
 limbus:I('Limbus fossa ovalis','লিম্বাস',`Fossa-র উপর, সামনে আর পেছন ঘিরে কাস্তের মতো ধারালো কিনারা; septum secundum-এর নিচের কিনারা। সামনের বাহু IVC ভাল্‌ভের বাম শিং-এর সাথে মেশে। ${DT('৬৩')}`,'elev',INT,[APX]),
 cristaTerm:I('Crista terminalis','ক্রিস্টা টার্মিনালিস',`মসৃণ পেশির উঁচু রেখা: septum-এর উপর থেকে SVC-র মুখের সামনে দিয়ে ডান দেয়াল ধরে IVC-র ভাল্‌ভ পর্যন্ত। পেছনের মসৃণ sinus venarum আর সামনের খসখসে atrium proper-কে আলাদা করে। বাইরে sulcus terminalis। ${DT('৬২')}`,'elev',INT,[APX]),
 musPect:I('Musculi pectinati','মাসকুলি পেকটিনাটি',`Crista থেকে সামনে tricuspid orifice-এর দিকে যাওয়া সমান্তরাল পেশির রেখা; auricle-এর ভেতরে জালের মতো। ${DT('৬৩')}`,'elev',INT),
 avNode:I('AV node (triangle of Koch)','AV নোড',`${STR.avNode.d} Triangle of Koch: সামনে tricuspid-এর septal leaflet-এর গোড়া, পেছনে coronary sinus-এর মুখ, উপরে tendon of Todaro। ${DT('৬৩')}`,'node',['int','cond','quiz'],[SCH]),
 torus:I('Torus aorticus','টোরাস অ্যাওর্টিকাস',`Septum-এর সামনে-উপরে উঁচু জায়গা: aorta-র non-coronary sinus এখানে ঠেলে থাকে। ${DT('৬৩')}`,'elev',INT,[APX]),
 saNode:I('SA node','SA নোড',STR.saNode.d,'node',['cond','quiz'],[SCH]),
 // ডান নিলয়
 pulOrifice:I('Pulmonary orifice','পালমোনারি ছিদ্র',`Infundibulum-এর চূড়ায়, গোল; তিনটা semilunar cusp। ${DT('৬৫')}`,'open',VAL),
 infund:I('Infundibulum (conus arteriosus)','ইনফান্ডিবুলাম',`RV-র মসৃণ বের হওয়ার অংশ, উপরে-পেছনে-বাঁয়ে; inflow-এর সাথে স্থূলকোণ করে। মসৃণ দেয়াল বের হওয়ার সময় রক্তের গতি বাড়ায়। ${DT('৬৪–৬৫')}`,'part',INT),
 svCrest:I('Supraventricular crest','সুপ্রাভেন্ট্রিকুলার ক্রেস্ট',`Inflow আর outflow অংশের মাঝে পেছনের দেয়ালে পেশির উঁচু রেখা; bulbo-ventricular ridge-এর অবশেষ। ${DT('৬৪–৬৫')}`,'elev',INT,[APX]),
 rvSeptum:I('Interventricular septum (RV দিক)','সেপ্টাম (ডান দিক)',`Septum RV-র দিকে উত্তল, তাই কাটলে RV অর্ধচন্দ্র আর LV গোল দেখায়। ${DT('৬৩, ৬৮')}`,'surf',INT),
 papRvAnt:I('Anterior papillary muscle','RV: anterior প্যাপিলারি',STR.rvAnt.d,'elev',VAL),
 papRvPost:I('Posterior papillary muscle','RV: posterior প্যাপিলারি',STR.rvPost.d,'elev',VAL),
 papRvSept:I('Septal papillary muscle','RV: septal প্যাপিলারি',STR.rvSept.d,'elev',VAL),
 // বাম অলিন্দ
 mitOrifice:I('Left atrio-ventricular (mitral) orifice','মাইট্রাল ছিদ্র',`ডান ছিদ্রের চেয়ে ছোট, পরিধি ৭–৯ সেমি; ডানটার সাথে প্রায় একই তলে, একটু পেছনে-উপরে। ${DT('৬৬')}`,'open',VAL,STR.mit.l),
 pvRSup:I('Right superior pulmonary vein','ডান উপরের পালমোনারি ভেইন',`LA-র পেছনের দেয়ালে চারটা pulmonary vein-এর মুখ। ${DT('৬৫')}`,'open',INT),
 pvRInf:I('Right inferior pulmonary vein','ডান নিচের পালমোনারি ভেইন',`${DT('৬৫')}`,'open',INT),
 pvLSup:I('Left superior pulmonary vein','বাম উপরের পালমোনারি ভেইন',`${DT('৬৫')}`,'open',INT),
 pvLInf:I('Left inferior pulmonary vein','বাম নিচের পালমোনারি ভেইন',`${DT('৬৫')}`,'open',INT),
 laAuricleIn:I('Left auricle (ভেতর)','বাম অরিকলের ভেতর',`LA-র দেয়াল প্রায় সবটা মসৃণ; শুধু auricle-এর ভেতরে musculi pectinati-র জাল। ${DT('৬৫')}`,'part',INT),
 laSeptum:I('Septum (LA দিক)','সেপ্টাম (বাম দিক)',`ওপরে অবতল একটা semilunar fold (septum primum-এর উপরের কিনারা), তার উপরে lunate impression (septum secundum)। ${DT('৬৫, ৬৮')}`,'surf',INT,[APX]),
 // বাম নিলয়
 aorOrifice:I('Aortic orifice','অ্যাওর্টিক ছিদ্র',STR.aorValve.d,'open',VAL,[SCH]),
 aorVest:I('Aortic vestibule','অ্যাওর্টিক ভেস্টিবিউল',`LV-র মসৃণ বের হওয়ার অংশ, mitral orifice-এর উপরে-সামনে-ডানে; বেশিরভাগ fibrous। পেছনের দেয়াল subaortic curtain আর mitral-এর anterior leaflet। ${DT('৬৭')}`,'part',INT),
 ivsMusc:I('Muscular part of IV septum','সেপ্টামের পেশির অংশ',`Septum-এর বড় অংশ, সামনে-নিচে। ${DT('৬৯')}`,'surf',INT),
 ivsMemb:I('Membranous part of IV septum','সেপ্টামের পর্দা অংশ',`পেছন-উপরে ছোট ডিম্বাকার এলাকা, aorta-র গোড়ার নিচে। VSD সবচেয়ে বেশি এখানে। ${DT('৬৯–৭০')}`,'surf',INT,[APX]),
 lvApexIn:I('LV-র ভেতর, apex','নিলয়ের ভেতর',`Trabeculae carneae RV-র চেয়ে বেশি আর স্পষ্ট। Apex-এ পেশি পাতলা। ${DT('৬৬–৬৭')}`,'part',INT),
 papLvAnt:I('Anterior papillary muscle (LV)','LV: anterior প্যাপিলারি',STR.lvAnt.d,'elev',VAL),
 papLvPost:I('Posterior papillary muscle (LV)','LV: posterior প্যাপিলারি',STR.lvPost.d,'elev',VAL),
 triValve:I('Tricuspid valve','ট্রাইকাসপিড ভাল্‌ভ',STR.tri.d,'part',['valve','quiz'],STR.tri.l),
 mitValve:I('Mitral valve','মাইট্রাল ভাল্‌ভ',STR.mit.d,'part',['valve','quiz'],STR.mit.l),
 pulValve:I('Pulmonary valve','পালমোনারি ভাল্‌ভ',STR.pul.d,'part',['valve','quiz'])
};

const MK=[['part','অংশ: apex, auricle, infundibulum, ভাল্‌ভ'],['surf','পৃষ্ঠ, বর্ডার বা দেয়াল'],['groove','খাঁজ বা গর্ত: sulcus, groove, fossa'],['open','ছিদ্র বা মুখ: orifice, opening'],['elev','উঁচু রেখা বা পেশি: crista, limbus, papillary'],['node','Conducting system: node']];

const VIEWS={ant:[0,0,1],post:[0,0,-1],left:[1,0,.0001],right:[-1,0,.0001],sup:[0,1,.05],inf:[0,-1,.25],obl:[.55,.35,.75]};
const CUTS={
 ra:{t:'ডান অলিন্দ',card:{t:'ডান অলিন্দের ভেতর',b:'সামনে-ডানের দেয়াল সরানো',d:`পেছনের মসৃণ sinus venarum (SVC, IVC, coronary sinus খোলে) আর সামনের খসখসে atrium proper (musculi pectinati, auricle); মাঝে crista terminalis। বাঁ দিকের দেয়াল interatrial septum। ${DT('৬২–৬৩')}`,l:['স্লাইডার দিয়ে কাটার গভীরতা বদলান']}},
 rv:{t:'ডান নিলয়',card:{t:'ডান নিলয়ের ভেতর',b:'সামনের দেয়াল সরানো',d:`খসখসে inflow অংশ (tricuspid, papillary, trabeculae) আর মসৃণ outflow অংশ (infundibulum → pulmonary orifice); মাঝে supraventricular crest। ${DT('৬৪–৬৫')}`}},
 la:{t:'বাম অলিন্দ',card:{t:'বাম অলিন্দের ভেতর',b:'পেছন থেকে খোলা',d:`দেয়াল মসৃণ; পেছনে চারটা pulmonary vein, সামনে mitral orifice, auricle-এ musculi pectinati। ${DT('৬৫')}`}},
 lv:{t:'বাম নিলয়',card:{t:'বাম নিলয়ের ভেতর',b:'বাম পাশের দেয়াল সরানো',d:`Inflow (mitral, দুটো papillary, trabeculae) আর outflow (aortic vestibule → aortic orifice) খুব কাছাকাছি, তীক্ষ্ণ কোণে। দেয়াল RV-র তিন গুণ মোটা। ${DT('৬৬–৬৭')}`,l:[`স্ক্যানে LV ${M.wall_LV} মিমি বনাম RV ${M.wall_RV} মিমি`]}},
 four:{t:'চার প্রকোষ্ঠ',card:{t:'চার প্রকোষ্ঠের কাটা',b:'চার গহ্বরের কেন্দ্র দিয়ে যাওয়া তল',d:`উপর থেকে দেখা: দুই অলিন্দ, দুই নিলয়, septum আর দুই AV orifice একসাথে। Septum RV-র দিকে উত্তল। ${DT('৬৮–৬৯')}`}},
 valve:{t:'ভাল্‌ভ',op:1},cond:{t:'Conducting system'}
};
for(const k in CUTS)if(D.cuts[k])Object.assign(CUTS[k],D.cuts[k]);

const B={
 id:'heart',startMode:'cor',PARTS,REG,TERR,STR,views:VIEWS,target:[0,0,0],dist:340,MK,cuts:CUTS,
 baseColor:'#c97a6d',innerColor:'#ecb8ad',boneRough:.6,
 partLabel:'প্রকোষ্ঠ',regLabel:'পৃষ্ঠ',terrLabel:'কোন ধমনীর এলাকা',
 mkNote:'মার্কে ট্যাপ করলে নাম দেখাবে। শুধু যে পাশ দেখছেন সেই পাশের মার্ক দেখায়; ঘোরালে অন্য পাশের মার্ক আসবে।',
 modes:{
  parts:{layers:{great:1},paint:'parts',view:['ant',340],card:{t:'চারটা প্রকোষ্ঠ',b:'নীল: ডান হার্ট · লাল: বাম হার্ট',d:`ডান অলিন্দ (RA), ডান নিলয় (RV), বাম অলিন্দ (LA), বাম নিলয় (LV); হালকা রং auricle। ঘুরিয়ে দেখুন: সামনে থেকে বেশিরভাগ RV, পেছনে দুই অলিন্দ। ${DT('৫৮')}`,l:['সীমানা স্ক্যান থেকে মাপা: দেয়ালের প্রতিটা বিন্দু যে গহ্বরের সবচেয়ে কাছে সেই প্রকোষ্ঠের']}},
  lm:{layers:{great:1},view:['ant',340],card:{t:'বাইরের গঠন',b:'Apex, base, পৃষ্ঠ, বর্ডার, খাঁজ',d:`মার্কে ট্যাপ করুন। হার্টে আছে একটা apex, একটা base, তিনটা পৃষ্ঠ আর তিনটা বর্ডার। পেছন আর নিচ থেকেও ঘুরিয়ে দেখুন। ${DT('৫৯')}`}},
  face:{layers:{great:1},paint:'reg',view:['ant',340],card:{t:'পৃষ্ঠগুলো কোন প্রকোষ্ঠ দিয়ে তৈরি',b:'বইয়ের ২/৩–১/৩ নিয়ম বনাম স্ক্যান',d:'রঙে ট্যাপ করুন বা নিচের তালিকা থেকে বেছে নিন: সেই দিকে ঘুরে যাবে আর মাপা ভাগ দেখাবে।',l:['শুধু LV: apex','শুধু অলিন্দ: base','শুধু RA: ডান বর্ডার','শুধু নিলয়: diaphragmatic পৃষ্ঠ']}},
  int:{layers:{valve:1,great:1},clipLayers:['great'],cuts:['ra','rv','la','lv','four'],markers:true,view:null},
  valve:{layers:{valve:1},cut:'valve',clipLayers:['great'],markers:true,view:null,card:{t:'ভাল্‌ভ, প্যাপিলারি আর chordae',b:'উপর থেকে চার প্রকোষ্ঠের কাটা',d:`AV ভাল্‌ভ: tricuspid (ডান) আর mitral (বাম)। প্রতিটা ভাল্‌ভ complex = orifice + annulus + leaflet + chordae tendineae + papillary muscle। Systole-এ papillary আগে সংকুচিত হয়ে leaflet টেনে বন্ধ রাখে। Semilunar: pulmonary আর aortic। ${DT('৬৪–৬৭, ৮৬')}`,l:['Valve, papillary আর tricuspid/mitral/pulmonary স্ক্যান থেকে; aortic valve আর chordae স্কিম্যাটিক']}},
  cor:{layers:{artery:1,vein:1,great:1},paint:'terr',view:['ant',340],legend:[['rcaTrunk','#e0443e'],['rcaMarg','#e0443e'],['pda','#e0443e'],['lcaStem','#e0443e'],['lad','#e0443e'],['lcx','#e0443e'],['cs','#4a78e0'],['gcv','#4a78e0'],['mcv','#4a78e0'],['scv','#4a78e0'],['acv','#4a78e0']],card:{t:'রক্ত সরবরাহ',b:'করোনারি ধমনী আর কার্ডিয়াক ভেইন',d:`দুটো করোনারি ধমনী, দুটোই ascending aorta-র sinus থেকে। গঠনে end-artery না (একে অপরের সাথে মেলে), কিন্তু কাজে প্রায় end-artery-র মতো। হার্টের শিরার রক্তের ৬০% coronary sinus দিয়ে, বাকি anterior cardiac vein আর venae cordis minimi দিয়ে সরাসরি প্রকোষ্ঠে। ${DT('৭৪, ৭৯')}`,l:['দেয়ালের রং: কোন ধমনীর এলাকা (আনুমানিক)','নিচের পৃষ্ঠ দেখতে "নিচ থেকে" চাপুন']}},
  cond:{layers:{cond:1,great:1},boneOp:.28,cut:'cond',markers:true,view:[[-.6,.2,.78],320],card:{t:'Conducting system',b:'SA node → AV node → His → দুই শাখা → Purkinje',d:`Impulse শুরু SA node-এ, internodal tract দিয়ে AV node-এ, তারপর AV bundle আর দুই শাখা দিয়ে নিলয়ে। Fibrous skeleton অলিন্দ আর নিলয়ের পেশিকে আলাদা রাখে, তাই এই পথটাই একমাত্র সংযোগ। Atria আর conducting system-এ sympathetic ও parasympathetic দুটোই, ventricle-এর পেশিতে শুধু sympathetic। ${DT('৭১, ৭৩–৭৪, ৮০')}`,l:[SCH,'দেয়াল স্বচ্ছ করা হয়েছে']}},
  rel:{layers:{ctx:1,organ:1,muscle:1,vert:1,great:1},view:['obl',470],viewDist:470,legend:[['sternum','#e9e1cf'],['lung','#f0b8b2'],['dia','#3b82d6'],['eso','#cfd6dc'],['trachea','#cfd6dc'],['aoDesc','#e0443e'],['thymus','#e7a8c9'],['vert','#d9d0bd']],card:{t:'চারপাশের সম্পর্ক',b:'Pericardium-এর বাইরে কী আছে',d:`সামনে: sternum আর ৩য়–৬ষ্ঠ costal cartilage, মাঝে ফুসফুসের সামনের কিনারা। নিচে: diaphragm। পেছনে base আর কশেরুকার মাঝে: oblique sinus, bronchi, oesophagus, descending aorta, azygos ইত্যাদি। দুই পাশে: phrenic nerve, pleura আর ফুসফুস। ${DT('৬০–৬১')}`,l:['স্ক্যানে pericardium আর phrenic nerve নেই']}},
  surf:{layers:{ctx:1,mark:1},boneOp:.55,view:['ant',560],viewDist:560,card:{t:'সারফেস মার্কিং',b:'কমলা: বইয়ের নিয়ম · সবুজ: স্ক্যানের আসল হার্ট',d:`বইয়ের বিন্দুগুলো এই মানুষের নিজের costal cartilage আর intercostal space মেপে বসানো। গোলাপি বিন্দু: চার ভাল্‌ভ শোনার জায়গা (A, P, T, M)। হলুদ লাইন: চার orifice। ${DT('৩৪২–৩৪৩, ৮৬')}`,l:[`স্ক্যানে apex মধ্যরেখা থেকে ${M.apexScan.dx} সেমি; বই বলে ৯ সেমি`,`হার্টের ${pc(M.leftOfMid)} মধ্যরেখার বাঁয়ে; বই বলে ২/৩`]}},
  quiz:{layers:{great:1},clipLayers:['great']}
 },
 relLegend:[],
 relLabels:[
  ['rcaTrunk','RCA','cor'],['lad','LAD','cor'],['lcx','Circumflex','cor'],['pda','Post. IV a.','cor'],['rcaMarg','Right marginal','cor'],['cs','Coronary sinus','cor'],['gcv','Great cardiac v.','cor'],['mcv','Middle cardiac v.','cor'],['scv','Small cardiac v.','cor'],
  ['hisBundle','AV bundle (His)','cond'],['rbb','Right branch','cond'],['lbb','Left branch','cond'],['intTract','Internodal tract','cond'],['modBand','Moderator band','cond'],
  ['modBand','Moderator band','valve'],['aorValve','Aortic valve','valve'],['chordae','Chordae','valve'],
  ['lung','Lung','rel'],['dia','Diaphragm','rel'],['eso','Oesophagus','rel'],['aoDesc','Desc. aorta','rel'],['trachea','Trachea','rel'],['sternum','Sternum','rel'],
  ['mkRight','ডান বর্ডার','surf'],['mkLeft','বাম বর্ডার','surf'],['mkInf','নিচের বর্ডার','surf'],['mkUpper','উপরের বর্ডার','surf'],['scanOutline','আসল হার্ট','surf'],
  ['ausAor','A','surf'],['ausPul','P','surf'],['ausTri','T','surf'],['ausMit','M','surf'],
  ['orPul','Pulmonary','surf'],['orAor','Aortic','surf'],['orTri','Tricuspid','surf'],['orMit','Mitral','surf']
 ],
 holdView:[[0,0,1],340]
};
B.lmInfo=id=>{const o=LMS[id]||{t:id,b:'',d:'',type:'part',show:['lm']};return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:o.show.includes('quiz'),quizName:o.t,show:o.show.filter(x=>x!=='quiz')}};
B.render=(D,$)=>{
 const t=$('#tbl-frac');if(t){const rows=[['sternocostal','Sterno-costal','RV ২/৩, LV ১/৩ (সাথে RA ও left auricle)'],['diaphragmatic','Diaphragmatic','LV ২/৩, RV ১/৩'],['base','Base','LA ২/৩, RA ১/৩'],['left','Left surface','মূলত LV, কিছু LA']];
  t.innerHTML=rows.map(([k,n,b])=>`<tr><td>${n}</td><td>${b}</td><td>${Object.entries(D.meas.frac[k]).sort((a,b)=>b[1]-a[1]).map(([c,x])=>c+' '+pc(x)).join(', ')}</td></tr>`).join('')}
 const m=$('#tbl-meas');if(m){const x=D.meas;m.innerHTML=[
  ['Apex থেকে base','১২ সেমি',x.apexBase+' সেমি'],['সবচেয়ে চওড়া (আড়াআড়ি)','৮–৯ সেমি (রেডিওগ্রাফে)',x.transverse+' সেমি (auricle সহ পুরো হার্ট)'],['সামনে-পেছনে','৬ সেমি',x.ap+' সেমি (বড় রক্তনালীর গোড়া সহ)'],
  ['RV-র দেয়াল','৩–৫ মিমি',x.wall_RV+' মিমি'],['LV-র দেয়াল','৮–১২ মিমি',x.wall_LV+' মিমি'],['LA-র দেয়াল','প্রায় ৩ মিমি',x.wall_LA+' মিমি'],
  ['Tricuspid orifice-এর পরিধি','১০–১২ সেমি',x.circ_tri+' সেমি'],['Mitral orifice-এর পরিধি','৭–৯ সেমি',x.circ_mit+' সেমি'],
  ['মধ্যরেখার বাঁয়ে হার্ট','২/৩',pc(x.leftOfMid)],['Apex মধ্যরেখা থেকে','৯ সেমি, বাম ৫ম space',x.apexScan.dx+' সেমি'+(x.apexScan.space==='rib5'?', বাম ৫ম রিবের পেছনে':'')]
 ].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><b>${r[2]}</b></td></tr>`).join('')}
};
window.BONE=B;
}
