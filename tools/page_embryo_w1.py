"""Embryology সপ্তাহ ১ পেজ (index.html)। ব্যবহার: python tools/page_embryo_w1.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import limbpage
from limbpage import page, sec, viva
limbpage.MODE_NAMES.update({'lm': 'দেখুন', 'cut': 'কেটে দেখা', 'quiz': 'কুইজ'})
limbpage.VIEW_NAMES.update({'lat': 'পাশ থেকে'})
ST = ['Mature follicle', 'Ovulation', 'Corpus luteum', 'Fertilization', 'Pronuclei', '2-cell', '4-cell', '8-cell', 'Compaction', 'Morula',
      'Blastocyst', 'Hatching', 'Epiblast/hypoblast', 'Implantation', 'Pathway']
nav = ('<div style="margin-top:14px"><div style="display:flex;align-items:center;gap:12px;color:#eef5f2;font-weight:600">'
       '<span>ধাপ:</span><input type="range" id="stageSl" min="0" max="14" step="1" value="0" style="flex:1;accent-color:var(--acc);min-height:32px">'
       '<span id="stageLbl" style="min-width:9em"></span></div>'
       '<nav class="spec" aria-label="ধাপ">' + ''.join(f'<a href="javascript:void 0" role="button" data-stage="{i}" aria-pressed="{str(i == 0).lower()}">{t}</a>' for i, t in enumerate(ST)) + '</nav></div>')
s = sec('s-sum', '''  <h2>প্রথম সপ্তাহ এক নজরে</h2>
  <table class="cmp"><thead><tr><th>সময়</th><th>কী ঘটে</th><th>কোথায়</th></tr></thead><tbody>
   <tr><td>ovulation-এর আগে</td><td>LH surge: ১ম meiosis শেষ, ২য় meiosis-এর metaphase-এ থামা (ovulation-এর ~৩ ঘণ্টা আগে); follicle ~২৫ মিমি, stigma</td><td>ovary (পৃ. 34)</td></tr>
   <tr><td>ovulation</td><td>Collagenase আর prostaglandin; oocyte cumulus cell-সহ বের হয়, fimbriae তুলে নেয়; corpus luteum তৈরি</td><td>ovary → uterine tube (পৃ. 34–36)</td></tr>
   <tr><td>দিন ০ (ovulation-এর ১২–২৪ ঘণ্টা পর)</td><td>fertilization: corona → zona (ZP3, acrosome reaction) → membrane মিলন; cortical ও zona reaction</td><td>Ampulla (পৃ. 38–40)</td></tr>
   <tr><td>দিন ০–১</td><td>২য় meiosis শেষ, ২য় polar body; দুই pronucleus</td><td>Ampulla</td></tr>
   <tr><td>~৩০ ঘণ্টা</td><td>২-cell</td><td>Uterine tube</td></tr>
   <tr><td>~৪০ ঘণ্টা</td><td>৪-cell</td><td>Uterine tube</td></tr>
   <tr><td>দিন ৩</td><td>৮-cell-এর পর compaction (tight junction); তারপর ১৬-cell morula</td><td>uterine tube (পৃ. 42)</td></tr>
   <tr><td>~৪ দিন</td><td>Advanced morula uterus-এর cavity-এ; zona মিলিয়ে যায়</td><td>uterus (পৃ. 43, 46)</td></tr>
   <tr><td>~৪.৫ দিন</td><td>Blastocyst: blastocele, embryoblast, trophoblast</td><td>uterus-এর cavity (পৃ. 43–44)</td></tr>
   <tr><td>দিন ৫.৫–৬</td><td>Epiblast (dorsal) আর hypoblast (ventral) আলাদা layer; AVE → cranial প্রান্ত</td><td>(পৃ. 44–45)</td></tr>
   <tr><td>~৬ দিন</td><td>Implantation শুরু: L-selectin, integrin; embryonic pole-এর trophoblast epithelium-এ ঢোকে</td><td>Body-র সামনের বা পেছনের wall, gland-এর মুখের মাঝে (পৃ. 43–48)</td></tr>
  </tbody></table>''', '''  <h2>কীভাবে ব্যবহার করবেন</h2>
  <ol>
   <li>উপরের স্লাইডার বা বোতাম দিয়ে ধাপ বদলান।</li>
   <li>আঙুলে ঘোরান; বিন্দু বা গঠনে ট্যাপ করলে নাম আর বিবরণ আসবে।</li>
   <li><b>স্তর সরানো:</b> কোনো structure-এ দুইবার ট্যাপ করুন (বা আঙুল চেপে ধরে রাখুন): সেই layer সরে যাবে, ভেতরেরটা দেখা যাবে। একের পর এক সরাতে থাকুন। উপরের "↶ ফেরত" চাপলে শেষেরটা ফিরবে, "সব ফেরত" চাপলে সব।</li>
   <li>"কেটে দেখা" চাপুন: মাঝ বরাবর, পাশ বা উপর থেকে কাটুন; স্লাইডারে গভীরতা বদলান। কাটা মুখ গাঢ় রঙে।</li>
   <li>"যাত্রাপথ" ধাপে দেখুন কোন দিন embryo কোথায় থাকে।</li>
  </ol>
  <p class="note">রং Langman-এর চিত্রের মতো: নীল embryoblast, সবুজ trophoblast, নীল epiblast, হলুদ hypoblast, গোলাপি AVE। এছাড়া গোলাপি-বাদামি cell, বেগুনি nucleus, নীল পুরুষ ও লাল-গোলাপি স্ত্রী pronucleus, ম্যাজেন্টা cortical granule, কমলা mitochondria, সবুজ acrosome, গাঢ় লাল syncytiotrophoblast, হালকা নীল স্বচ্ছ zona আর cavity, হলুদ granulosa ও lutein cell।</p>
  <p class="note">প্রতিটা ধাপের মডেল দরকার হলে তবেই লোড হয়, তাই প্রথমবার ধাপ বদলালে এক মুহূর্ত লাগতে পারে।</p>''')
s += sec('s-fert', '''  <h2>fertilization (fertilization)</h2>
  <ul>
   <li><b>কোথায়:</b> uterine tube-এর ampulla, uterine tube-এর সবচেয়ে চওড়া অংশ, ovary-এর কাছে। fertilization না হলে oocyte ovulation-এর প্রায় ২৪ ঘণ্টা পরে নষ্ট হয়। (পৃ. 38, 41)</li>
   <li><b>sperm-এর যাত্রা:</b> vagina-এ ২০–৩০ কোটি, cervix-এ ঢোকে মাত্র ১%; uterine tube-এ পৌঁছাতে ৩০ মিনিট থেকে ৬ দিন, মূলত uterus ও uterine tube-এর muscle-এর সংকোচনে। Isthmus-এ থেমে থাকে, ovulation-এ আবার সচল হয় (cumulus-এর chemoattractant)। fertilization-এর জায়গায় পৌঁছায় ৩০০–৫০০টা। (পৃ. 38–39)</li>
   <li><b>Capacitation:</b> প্রায় ৭ ঘণ্টা, মূলত uterine tube-এ; acrosome-এর উপরের membrane থেকে glycoprotein আবরণ আর seminal plasma protein সরে যায়। তাই আগে পৌঁছানো লাভ নয়। (পৃ. 39)</li>
   <li><b>ধাপ ১:</b> corona radiata পার হওয়া (capacitated sperm অবাধে যায়)।</li>
   <li><b>ধাপ ২:</b> zona-য় ZP3-এর মাধ্যমে বাঁধা আর acrosome reaction; acrosin ও trypsin-এর মতো enzyme zona-য় পথ কাটে। (পৃ. 39–40)</li>
   <li><b>ধাপ ৩:</b> integrin (oocyte) – disintegrin (sperm) দিয়ে লেগে membrane মিলন, head-এর পেছনের অংশের membrane দিয়ে; head ও tail দুটোই ঢোকে, membrane বাইরে থাকে। (পৃ. 40)</li>
   <li><b>Oocyte-এর তিন সাড়া:</b> cortical ও zona reaction (polyspermy বন্ধ); ২য় meiosis শেষ (২য় polar body, female pronucleus ২২ + X); metabolic activation। (পৃ. 40)</li>
   <li><b>ফলাফল:</b> diploid সংখ্যা ফেরা, ক্রোমোজোমগত লিঙ্গ নির্ধারণ, cleavage শুরু। (পৃ. 41)</li>
  </ul>''', '''  <h2>cleavage থেকে blastocyst</h2>
  <ul>
   <li><b>cleavage:</b> একের পর এক mitosis; blastomere প্রতিবার ছোট হয়। ২-cell ~৩০ ঘণ্টা, ৪-cell ~৪০ ঘণ্টা। (পৃ. 42–43)</li>
   <li><b>Compaction:</b> তৃতীয় division-এর পর; সর্বোচ্চ ছোঁয়া, tight junction; ভেতরের cell gap junction-এ যোগাযোগ করে। (পৃ. 42)</li>
   <li><b>Morula:</b> প্রায় ৩ দিনে ১৬-cell; inner cell mass → embryo, outer cell mass → trophoblast (placenta-য় অংশ)। (পৃ. 42)</li>
   <li><b>Blastocyst:</b> morula uterus-এ ঢোকার সময় fluid জমে blastocele; embryoblast এক pole-এ, trophoblast চ্যাপ্টা wall। Zona চতুর্থ দিনের শেষে মিলিয়ে যায়। (পৃ. 43)</li>
   <li><b>Epiblast/hypoblast:</b> FGF-এ নির্দিষ্ট হয়; implantation-এর কাছে epiblast dorsal, hypoblast ventral। AVE cranial প্রান্তে গিয়ে cerberus ও lefty1 ছাড়ে; caudal-এ nodal → primitive streak। axis ঠিক হয় দিন ৫.৫–৬। (পৃ. 44–45)</li>
   <li><b>Implantation:</b> প্রায় ৬ষ্ঠ দিনে; L-selectin → integrin, laminin (লেগে থাকা), fibronectin (ঢোকা)। Endometrium secretory phase-এ: compact, spongy, basal layer। (পৃ. 43–48)</li>
  </ul>''')
s += sec('s-clin', '''  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li><b>Ectopic pregnancy:</b> uterus-এর বাইরে implantation, বেশিরভাগ uterine tube-এ (বিশেষ করে ampulla); uterine tube ফেটে মারাত্মক রক্তক্ষরণ হতে পারে।</li>
   <li><b>Placenta previa:</b> uterus-এর নিচের দিকে, internal os-এর কাছে implantation।</li>
   <li><b>Polyspermy</b> আটকানো zona reaction-এর কাজ; ব্যর্থ হলে triploid embryo, টেকে না।</li>
   <li><b>IVF:</b> gonadotropin দিয়ে follicle বাড়িয়ে ovulation-এর ঠিক আগে laparoscopy-তে oocyte তোলা, কালচার মিডিয়ামে sperm দেওয়া; ৮-cell পর্যন্ত দেখে uterus-এ। সাফল্য মায়ের বয়সের উপর নির্ভর করে। ICSI: একটা sperm সরাসরি cytoplasm-এ (তীব্র পুরুষ infertility-এ)। (পৃ. 42)</li>
   <li><b>Infertility:</b> ১৪–১৫% দম্পতি। নারীদের সবচেয়ে সাধারণ কারণ বন্ধ uterine tube (বেশিরভাগ pelvic inflammatory disease থেকে)। Clomiphene citrate FSH বাড়িয়ে ovulation ঘটায়; ovulation-এর ওষুধে একাধিক ovulation, তাই twins-এর সম্ভাবনা বেশি। (পৃ. 36, 41–42)</li>
   <li><b>Abnormal zygote:</b> প্রায় ৫০% pregnancy স্বতঃস্ফূর্ত abortion-এ শেষ হয় বলে অনুমান, তার অর্ধেক chromosome-এর ত্রুটিতে। (পৃ. 46)</li>
   <li><b>Corpus luteum of pregnancy:</b> ৪র্থ মাসের আগে সরালে সাধারণত abortion। (পৃ. 37)</li>
   <li><b>Twins:</b> monozygotic twins হতে পারে cleavage-এর শুরুতে আলাদা হলে, বা পরে inner cell mass ভাগ হলে।</li>
  </ul>''', '''  <h2>ভাইভা</h2>
''' + viva([
    ('fertilization কোথায় হয়?', 'Uterine tube-এর ampulla-য় (সবচেয়ে চওড়া অংশ)।'),
    ('Capacitation কী, কতক্ষণ?', 'নারীর প্রজননতন্ত্রে (মূলত uterine tube-এ) প্রায় ৭ ঘণ্টার প্রস্তুতি; acrosome-এর উপরের membrane থেকে glycoprotein আবরণ আর seminal plasma protein সরে যায়।'),
    ('Acrosome reaction কী ঘটায়?', 'Zona-য় বাঁধার পর ZP3 এটা ঘটায়; acrosin আর trypsin-এর মতো enzyme বেরিয়ে zona ফোঁড়ে।'),
    ('Ovulation-এ LH surge-এর কাজ?', 'MPF বাড়িয়ে ১ম meiosis শেষ ও ২য় meiosis শুরু, luteinization (progesterone), আর follicle ফাটানো (collagenase, prostaglandin)।'),
    ('Corpus luteum-কে pregnancy-এ কে বাঁচায়?', 'Syncytiotrophoblast-এর hCG।'),
    ('AVE কী করে?', 'Hypoblast-এর এই cell cranial প্রান্তে গিয়ে cerberus ও lefty1 (nodal-বিরোধী) ছাড়ে; cranial–caudal axis ঠিক করে।'),
    ('Polyspermy কীভাবে আটকায়?', 'Cortical reaction আর তার ফলে zona reaction।'),
    ('Morula কী, কখন?', 'প্রায় ৩ দিনে ১৬-cell-এর অবস্থা, তুঁতফলের মতো দেখতে।'),
    ('Compaction কী?', 'তৃতীয় division-এর পর blastomere-গুলো tight junction দিয়ে ঘন বল হয়; ভেতর আর বাইরের cell আলাদা হয়।'),
    ('Blastocyst-এর দুই কোষগোষ্ঠী কী হয়?', 'Embryoblast থেকে embryo; trophoblast থেকে placenta-র embryo-এর অংশ।'),
    ('Implantation সাধারণত কোথায় হয়?', 'uterus-এর body-র সামনের বা পেছনের wall-এ, gland-এর মুখগুলোর মাঝখানে।'),
    ('Implantation-এর সময় endometrium কোন phase-এ, কয় layer?', 'Secretory phase; compact, spongy আর basal layer।'),
    ('Hatching কেন দরকার?', 'Zona সরে না গেলে trophoblast endometrium-এ লাগতে পারে না।'),
]))
credit = '''<section class="band" id="s-credit"><div class="wrap">
 <h2>সূত্র ও মডেল</h2>
 <p><b>মডেল:</b> আমাদের নিজের স্কিম্যাটিক 3D, Langman-এর চিত্র (Fig. 3.2–3.13) আর প্রকাশিত মাপ (oocyte প্রায় ১১০ µm, zona প্রায় ১৫ µm, blastocyst প্রায় ১৫০ µm) অনুযায়ী। আসল স্ক্যান নয়; cell-এর সংখ্যা শেখানোর জন্য কমানো। Follicle আর corpus luteum ধাপে follicle আসল মাপের প্রায় ৪০ ভাগের এক ভাগ।</p>
 <p><b>লেখা:</b> T.W. Sadler, <i>Langman's Medical Embryology</i>, 14th ed., Chapter 3, পৃ. 34–49 (implantation-এর trophoblast layer: Chapter 4, পৃ. 50)। পৃষ্ঠা নম্বর বইয়ের। নিজের ভাষায় লেখা।</p>
 <p class="note">এটি একটি খসড়া। ছাত্রদের দেওয়ার আগে শিক্ষককে দিয়ে রিভিউ করিয়ে নিন।</p>
</div></section>'''
page(os.path.join(os.path.dirname(__file__), '..', 'bones', 'embryo-w1', 'index.html'), 'Embryology 3D: সপ্তাহ ১', 'Embryology 3D <span style="font-weight:500;opacity:.8">· সপ্তাহ ১: fertilization থেকে implantation</span>',
     'দিন ধরে ধাপে ধাপে: fertilization, pronucleus, cleavage, morula, blastocyst, hatching, implantation, আর কোন দিন embryo কোথায়। প্রতিটা মডেল ঘোরানো আর কাটা যায়।',
     ['lm', 'cut', 'quiz'], ['ant', 'post', 'lat', 'sup'], [], [('s-sum', 'এক নজরে'), ('s-fert', 'fertilization ও cleavage'), ('s-clin', 'ক্লিনিক্যাল ও ভাইভা'), ('s-credit', 'সূত্র')], s,
     specnav=nav, credit=credit)
