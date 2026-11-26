/* ভ্রূণ ডেমো: Carnegie stage 18। মডেল: Azkue JJ (2021), J Anat 239:1438, CC BY-NC-ND 4.0, হুবহু।
   লেখা: সাধারণ embryology তথ্য (Carnegie staging)। বই ঠিক হলে সেই বই অনুযায়ী মেলাতে হবে। */
{
const M=window.DATA.meta;
const GEN='সাধারণ embryology তথ্য; আপনার বই ঠিক হলে মিলিয়ে নেওয়া হবে',APX='অবস্থান আনুমানিক: মডেলের আকার দেখে বেছে নেওয়া';
const L=(t,b,d,type,l)=>({t,b,d,type,show:'lm',l:[...(l||[]),APX]});
const LMS={
 head:L('মাথা (মধ্যমস্তিষ্কের অঞ্চল)','Head',`এই সময়ে মাথা শরীরের প্রায় অর্ধেক; ভেতরে দ্রুত বাড়তে থাকা মস্তিষ্ক। সামনের দিকে বাঁকা (cephalic flexure)।`,'part'),
 forehead:L('সামনের মাথা (forebrain)','Forebrain region','মস্তিষ্কের সামনের অংশ (prosencephalon) থেকে cerebral hemisphere বড় হচ্ছে।','surf'),
 eye:L('চোখ','Eye',`চোখের জায়গা মাথার পাশে; এই stage-এ চোখের পাতার ভাঁজ (eyelid fold) তৈরি শুরু হয়।`,'part',[GEN]),
 ear:L('বাইরের কান (auricular hillocks)','External ear',`১ম আর ২য় pharyngeal arch-এর ছয়টা ছোট উঁচু ঢিবি জুড়ে কানের লতি (auricle) তৈরি হয়; শুরুতে ঘাড়ের নিচে, পরে উপরে ওঠে।`,'elev',[GEN]),
 jaw:L('চোয়াল (pharyngeal arch ১)','Mandible region',`১ম pharyngeal arch থেকে maxillary আর mandibular process; নিচের চোয়াল তৈরি হয়।`,'part',[GEN]),
 neck:L('ঘাড়ের বাঁক (cervical flexure)','Cervical flexure',`মাথা আর শরীরের সংযোগে বাঁক; পরে ধীরে সোজা হয়।`,'surf',[GEN]),
 hand:L('হাতের পাতা (hand plate) ও আঙুলের রশ্মি','Hand plate, digital rays',`এই stage-এ হাতের পাতায় আঙুলের রশ্মি (digital rays) স্পষ্ট; আঙুলের মাঝের খাঁজ তৈরি হচ্ছে। পরে apoptosis-এ মাঝের টিস্যু সরে আলাদা আঙুল হয়।`,'part',[GEN]),
 elbow:L('কনুই অঞ্চল','Elbow region',`Stage 18-এ উপরের অঙ্গে কনুইয়ের জায়গা প্রথম বোঝা যায়; অঙ্গ সামনে-ভেতরে বাঁকা।`,'elev',[GEN]),
 heartLiver:L('হার্ট ও লিভারের উঁচু অংশ','Cardiac and hepatic prominences',`বুক-পেটের সামনে বড় উঁচু অংশ: ভেতরে হার্ট (উপরে) আর লিভার (নিচে)। লিভার এই সময় শরীরের অনেক বড় অংশ।`,'part',[GEN,'এই মডেলে শুধু বাইরের আকার; ভেতরের অঙ্গ নেই']),
 foot:L('পায়ের পাতা (foot plate)','Foot plate',`নিচের অঙ্গ উপরেরটার চেয়ে কয়েক দিন পিছিয়ে বাড়ে; এই সময় পায়ের পাতায় আঙুলের রশ্মি শুরু হয়।`,'part',[GEN]),
 back:L('পিঠ','Back',`পিঠের দিকে মেরুদণ্ড আর মাংসপেশি তৈরি হচ্ছে (somite থেকে)।`,'surf',[GEN]),
 rump:L('নিতম্ব (rump)','Rump',`মাথা থেকে নিতম্ব পর্যন্ত দৈর্ঘ্য (crown-rump length) দিয়ে বয়স মাপা হয়।`,'surf',[GEN])
};
const VIEWS={ant:[0,0,1],post:[0,0,-1],left:[1,0,.0001],right:[-1,0,.0001],sup:[0,1,.05],inf:[0,-1,.05]};
const B={
 id:'embryo',PARTS:{},REG:{},STR:{},views:VIEWS,target:[0,0,0],dist:420,baseColor:'#eccbb6',cutCap:'#8a4b3c',boneRough:.65,
 MK:[['part','অংশ'],['elev','উঁচু অংশ'],['surf','পৃষ্ঠ বা অঞ্চল']],
 cuts:{
  sag:{t:'মাঝ বরাবর (sagittal)',n:[1,0,0],o:0,view:[[-1,0,.0001],400,[0,0,0]],card:{t:'Sagittal কাটা',b:'স্লাইডার দিয়ে গভীরতা বদলান',d:'এই মডেল শুধু ত্বকের বাইরের পৃষ্ঠ, তাই কাটলে ভেতরটা ফাঁপা দেখায় (গাঢ় রং = ত্বকের ভেতরের দিক)। ভেতরের অঙ্গের মডেল (Amsterdam atlas বা আমার স্কিম্যাটিক) যোগ করলে এখানে হার্ট, লিভার, মস্তিষ্ক দেখা যাবে।'}},
  tra:{t:'আড়াআড়ি (transverse)',n:[0,-1,0],o:0,view:[[0,1,.35],400,[0,0,0]],card:{t:'Transverse কাটা',b:'স্লাইডার দিয়ে উচ্চতা বদলান',d:'উপর থেকে কাটা দেখায়। এখনো শুধু বাইরের পৃষ্ঠ।'}},
  cor:{t:'সামনে-পেছনে (coronal)',n:[0,0,-1],o:0,view:[[0,0,1],400,[0,0,0]],card:{t:'Coronal কাটা',b:'স্লাইডার দিয়ে গভীরতা বদলান',d:'সামনের অংশ সরিয়ে দেখায়।'}}
 },
 modes:{
  lm:{layers:{},view:['right',420],card:{t:'Carnegie stage 18',b:'প্রায় ৪৪ দিন (৬ সপ্তাহ+)',d:'মার্কে ট্যাপ করুন। শুধু যে পাশ দেখছেন সেই পাশের মার্ক দেখাবে। আঙুল দিয়ে ঘুরিয়ে দেখুন।',l:[`মডেলের সবচেয়ে বড় দৈর্ঘ্য ${M.gl_units} একক; একক সম্ভবত ০.১ মিমি, মানে প্রায় ${(M.gl_units/10).toFixed(1)} মিমি (stage 18-এর greatest length ১৩–১৭ মিমি)`,GEN]}},
  cut:{layers:{},cuts:['sag','tra','cor'],markers:true,view:null},
  quiz:{layers:{}}
 },
 relLegend:[],relLabels:[],muscleLabels:[]
};
B.lmInfo=id=>{const o=LMS[id];return {inf:o,lab:o.t,kind:'lm',type:o.type,quiz:true,quizName:o.t,show:o.show}};
window.BONE=B;
}
