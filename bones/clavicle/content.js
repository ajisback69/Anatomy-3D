/* ক্ল্যাভিকলের লেখা ও কনফিগারেশন। লেখার রেফারেন্স: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ৩–৫।
   REG নম্বর pipeline/limb.py-র clavicle() MUS-এর সাথে মেলে; 8 = জোড়ার তল। */
{
const D=window.DATA;
const SCAN='স্ক্যান থেকে নেওয়া',SCH='স্কিম্যাটিক: স্ক্যানে নেই, বইয়ের বর্ণনা অনুযায়ী মাপা জায়গায় বসানো',ZN='মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে';
const DT=p=>`Datta, পৃ. ${p}`;
const PARTS={
 1:{c:'#f2c96b',t:'Sternal end',b:'স্টার্নাল প্রান্ত',d:`বড়, ভেতরে আর একটু সামনে-নিচে মুখ করা; manubrium-এর clavicular notch আর ১ম costal cartilage-এর সাথে sterno-clavicular joint। Articular disc জোড়াকে দুই ভাগ করে। ${DT('৩')}`},
 2:{c:'#e9e1cf',t:'Medial ২/৩ (শ্যাফট)',b:'ভেতরের দুই-তৃতীয়াংশ',d:`গোলাকার বা প্রিজমের মতো, সামনে উত্তল; চারটা পৃষ্ঠ, কোনো আলাদা বর্ডার নেই। উপরের অঙ্গের বল এই অংশ দিয়ে axial skeleton-এ যায়; এটা long bone-এর মতো কাজ করে। ${DT('৪')}`},
 3:{c:'#9fb8e8',t:'Lateral ১/৩ (শ্যাফট)',b:'বাইরের এক-তৃতীয়াংশ',d:`চ্যাপ্টা, সামনে অবতল; coraco-clavicular ligament দিয়ে scapula-কে ঝুলিয়ে রাখে। নিচে conoid tubercle আর trapezoid ridge। ${DT('৪')}`},
 4:{c:'#e07a5f',t:'Acromial end',b:'অ্যাক্রোমিয়াল প্রান্ত',d:`চ্যাপ্টা; ডিম্বাকার facet বাইরে-নিচে মুখ করা, acromion-এর সাথে acromio-clavicular joint। ${DT('৪')}`}
};
const REG={
 1:{c:'#d1495b',k:'delt',t:'Deltoid (anterior part)',b:'ডেলটয়েড',w:'Lateral ১/৩-এর anterior border ও উপরের পৃষ্ঠ (origin)',d:DT('৪')},
 2:{c:'#7aa6d6',k:'trap',t:'Trapezius (anterior fibres)',b:'ট্র্যাপিজিয়াস',w:'Lateral ১/৩-এর posterior border ও উপরের পৃষ্ঠ (insertion)',d:DT('৪')},
 3:{c:'#f4a261',k:'pm',t:'Pectoralis major (clavicular head)',b:'পেক্টোরালিস মেজর',w:'সামনের পৃষ্ঠের ভেতরের অর্ধেক (origin)',d:`Pectoralis major আর deltoid-এর মাঝে clavicle deltopectoral triangle-এর base। ${DT('৪')}`},
 4:{c:'#5fae7f',k:'scm',t:'Sternocleidomastoid (clavicular head)',b:'স্টার্নোক্লাইডোমাস্টয়েড',w:'উপরের পৃষ্ঠের ভেতরের ১/৩ (origin)',d:`Trapezius আর SCM-এর মাঝের ফাঁক posterior triangle-এর base। ${DT('৪')}`},
 5:{c:'#edae49',k:'subcl',t:'Subclavius',b:'সাবক্ল্যাভিয়াস',w:'নিচের পৃষ্ঠের মাঝের ১/৩-এর খাঁজ (insertion)',d:`খাঁজের দুই কিনারায় clavipectoral fascia। ${DT('৪')}`},
 6:{c:'#c77dce',k:'sth',t:'Sternohyoid',b:'স্টার্নোহায়য়েড',w:'পেছনের পৃষ্ঠ, স্টার্নাল প্রান্তের কাছে (origin)',d:DT('৪')},
 8:{c:'#8fd3d6',lm:1,t:'জোড়ার তল',b:'Articular surface',w:'দুই প্রান্ত',d:'Sterno-clavicular আর acromio-clavicular joint।'}
};
const MUS_REG={delt:1,trap:2,pm:3,scm:4,subcl:5,sth:6};
const STR={
 sa:{t:'Subclavian artery',b:'সাবক্ল্যাভিয়ান আর্টারি',d:`পেছনের পৃষ্ঠের বাইরের অংশের পেছনে, brachial plexus-এর trunk-এর সাথে। ${DT('৫')}`,l:[SCAN]},
 sv:{t:'Subclavian vein',b:'সাবক্ল্যাভিয়ান ভেইন',d:`পেছনের পৃষ্ঠের ভেতরের অংশের পেছনে: internal jugular, subclavian আর brachiocephalic vein-এর শুরু। ${DT('৫')}`,l:[SCAN]},
 plexus:{t:'Brachial plexus (trunks)',b:'ব্র্যাকিয়াল প্লেক্সাস',d:`পেছনের পৃষ্ঠের বাইরের অংশের পেছনে। Clavicle-এর পেছনের অবতল ভেতরের ২/৩ গলার গোড়ার নার্ভ-রক্তনালী রক্ষা করে। ${DT('৩, ৫')}`,l:[SCH]},
 supscV:{t:'Suprascapular vessels',b:'সুপ্রাস্ক্যাপুলার নালী',d:`পেছনের পৃষ্ঠের উপরের অংশ ধরে বাইরে যায়। ${DT('৫')}`,l:[SCH]},
 manubrium:{t:'Manubrium',b:'ম্যানুব্রিয়াম',d:'Sterno-clavicular joint।',l:[SCAN]},
 rib1:{t:'First rib',b:'প্রথম রিব',d:'Costo-clavicular ligament দিয়ে clavicle-এর নিচের পৃষ্ঠের সাথে।',l:[SCAN]},
 cc1:{t:'First costal cartilage',b:'১ম কস্টাল কার্টিলেজ',d:'Sterno-clavicular joint-এর অংশ।',l:[SCAN]},
 scapula:{t:'Scapula (acromion, coracoid)',b:'স্ক্যাপুলা',d:'Acromio-clavicular joint; coracoid থেকে coraco-clavicular ligament।',l:[SCAN]}
};
const L=(t,b,d,type,show,l)=>({t,b,d,type,show:show||'lm',l});
const LMS={
 sternalEnd:L('Sternal end','স্টার্নাল প্রান্ত',PARTS[1].d,'joint',['lm','joint']),
 acromialEnd:L('Acromial end','অ্যাক্রোমিয়াল প্রান্ত',PARTS[4].d+' Acromion স্থানচ্যুত হলে clavicle-এর নিচে চলে যায়।','joint',['lm','joint']),
 conoid:L('Conoid tubercle','কোনয়েড টিউবারকল',`নিচের পৃষ্ঠে, পেছনের কিনারার কাছে, ভেতরের ২/৩ আর বাইরের ১/৩-এর জোড়ায়; coraco-clavicular ligament-এর conoid অংশ। ${DT('৪')}`,'elev'),
 trapezoid:L('Trapezoid ridge','ট্র্যাপিজয়েড রিজ',`Conoid tubercle থেকে সামনে-বাইরে; ligament-এর trapezoid অংশ। ${DT('৪')}`,'elev'),
 subclGroove:L('Subclavian groove','সাবক্ল্যাভিয়াস-এর খাঁজ',REG[5].w+'। '+REG[5].d,'groove',['lm','att']),
 costoclav:L('Costo-clavicular ligament-এর ছাপ','কস্টোক্ল্যাভিকুলার ছাপ',`নিচের পৃষ্ঠে স্টার্নাল প্রান্তের কাছে গর্ত; ligament দিয়ে ১ম রিব আর তার cartilage-এর সাথে। ${DT('৩–৪')}`,'groove',['lm','joint']),
 curveJn:L('দুই বাঁকের জোড়া','ভাঙার জায়গা',`ভেতরের সামনে-উত্তল আর বাইরের সামনে-অবতল বাঁকের মিলন; প্রসারিত হাতে পড়ে গেলে সাধারণত এখানেই ভাঙে। ${DT('৫')}`,'part'),
 medConvex:L('ভেতরের ২/৩: সামনে উত্তল','মিডিয়াল বাঁক',PARTS[2].d,'surf'),
 latConcave:L('বাইরের ১/৩: সামনে অবতল','ল্যাটারাল বাঁক',PARTS[3].d,'surf'),
 nutrient:L('পেছনের পৃষ্ঠ','পোস্টেরিয়র সারফেস',`মসৃণ, অবতল; পেছনে ভেতর থেকে বাইরে: বড় শিরা, subclavian artery আর brachial plexus, ফুসফুসের apex। ${DT('৪–৫')}`,'surf',['lm','rel']),
 upperSurf:L('উপরের পৃষ্ঠ','সুপিরিয়র সারফেস',`চামড়ার ঠিক নিচে (platysma-র নিচে), পুরোটা হাতে টের পাওয়া যায়; উপর দিয়ে supraclavicular nerve-এর তিন শাখা (C3, C4), মাঝেরটা কখনো হাড় ফোঁড়ে। ${DT('৩–৪')}`,'surf')
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],sup:[0,1,.05],inf:[0,-1,.05],lat:[-1,0,.0001],med:[1,0,.0001]};
const B={
 id:'clavicle',PARTS,REG,MUS_REG,STR,views:VIEWS,target:[0,0,0],dist:330,
 modes:{
  parts:{layers:{},view:['sup',330],card:{t:'অংশগুলো',b:'দুই প্রান্ত · দুই ভাগের শ্যাফট',d:`শ্যাফট ভেতরের ২/৩-এ সামনে উত্তল, বাইরের ১/৩-এ সামনে অবতল। ${DT('৩–৪')}`}},
  lm:{layers:{},view:['inf',330],card:{t:'মার্কে ট্যাপ করুন',b:'নিচের পৃষ্ঠে বেশি ছাপ',d:'নিচ থেকে conoid, trapezoid, subclavius-এর খাঁজ আর costo-clavicular ছাপ দেখা যায়; উপর থেকে বাঁক দুটো।'}},
  att:{layers:{},view:['sup',330],card:{t:'কোন মাসল কোথায় লাগে',b:'চার মাসলের মাঝে উপরের পৃষ্ঠ খোলা',d:`Deltoid, trapezius, pectoralis major আর SCM-এর মাঝের উপরের-সামনের পৃষ্ঠ পুরোটা চামড়ার নিচে টের পাওয়া যায়। নিচ থেকে subclavius দেখুন। ${DT('৪')}`,l:[ZN]}},
  rel:{layers:{nerve:1,artery:1,vein:1},view:['post',360],card:{t:'পেছনের পৃষ্ঠের সম্পর্ক',b:'শিরা, artery, plexus, ফুসফুস',d:`ভেতরে বড় শিরাগুলো, বাইরে subclavian artery আর brachial plexus-এর trunk; উপর দিয়ে suprascapular vessels। ${DT('৪–৫')}`,l:['Subclavian artery আর vein স্ক্যান থেকে; plexus আর suprascapular স্কিম্যাটিক']}},
  joint:{layers:{vert:1},view:['ant',420],viewDist:420,card:{t:'জোড়াগুলো',b:'Sterno-clavicular · Acromio-clavicular',d:`ভেতরে manubrium আর ১ম costal cartilage; বাইরে acromion; নিচে ligament দিয়ে ১ম রিব আর coracoid। ${DT('৩–৪')}`}},
  side:{layers:{}},quiz:{layers:{}}
 },
 relLegend:[['sa','#e0443e'],['sv','#4a78e0'],['plexus','#f2c230'],['supscV','#e0443e']],
 relAsMarkers:true,
 relLabels:[['sa','Subclavian artery','rel','art'],['sv','Subclavian vein','rel','ven'],['plexus','Brachial plexus','rel','node'],['supscV','Suprascapular vessels','rel','art'],
  ['manubrium','Manubrium','joint','part'],['rib1','First rib','joint','part'],['scapula','Scapula','joint','part']],
 muscleLabels:[],
 muscleView:r=>[r===5?'inf':r===6?'post':'sup',330],
 sideRules:['বড়, গোল প্রান্ত ভেতরে (sternal); চ্যাপ্টা প্রান্ত বাইরে','ভেতরের ২/৩ সামনে উত্তল','Subclavius-এর খাঁজ আর conoid tubercle নিচে, conoid পেছনের কিনারার কাছে '+`(${DT('৫')})`],
 sideView:[0,1,.2],sideDist:300,sideHint:'কোন প্রান্ত চ্যাপ্টা, বাঁক কোন দিকে আর খাঁজ কোন পৃষ্ঠে দেখুন।'
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
