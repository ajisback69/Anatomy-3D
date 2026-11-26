"""Embryology সপ্তাহ ১ পেজ (index.html)। ব্যবহার: python tools/page_embryo_w1.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import limbpage
from limbpage import page, sec, viva
limbpage.MODE_NAMES.update({'lm': 'দেখুন', 'cut': 'কেটে দেখা', 'quiz': 'কুইজ'})
limbpage.VIEW_NAMES.update({'lat': 'পাশ থেকে'})
ST = ['দিন ০: নিষেক', 'pronucleus', '২-কোষ', '৪-কোষ', '৮-কোষ', 'morula', 'blastocyst', 'hatching', 'implantation', 'যাত্রাপথ']
nav = ('<div style="margin-top:14px"><div style="display:flex;align-items:center;gap:12px;color:#eef5f2;font-weight:600">'
       '<span>ধাপ:</span><input type="range" id="stageSl" min="0" max="9" step="1" value="0" style="flex:1;accent-color:var(--acc);min-height:32px">'
       '<span id="stageLbl" style="min-width:9em"></span></div>'
       '<nav class="spec" aria-label="ধাপ">' + ''.join(f'<a href="javascript:void 0" role="button" data-stage="{i}" aria-pressed="{str(i == 0).lower()}">{t}</a>' for i, t in enumerate(ST)) + '</nav></div>')
s = sec('s-sum', '''  <h2>প্রথম সপ্তাহ এক নজরে</h2>
  <table class="cmp"><thead><tr><th>সময়</th><th>কী ঘটে</th><th>কোথায়</th></tr></thead><tbody>
   <tr><td>দিন ০</td><td>নিষেক: corona → zona (acrosome reaction) → পর্দা মিলন; zona reaction</td><td>Ampulla</td></tr>
   <tr><td>দিন ০–১</td><td>২য় meiosis শেষ, ২য় polar body; দুই pronucleus</td><td>Ampulla</td></tr>
   <tr><td>~৩০ ঘণ্টা</td><td>২-কোষ</td><td>Uterine tube</td></tr>
   <tr><td>~৪০ ঘণ্টা</td><td>৪-কোষ</td><td>Uterine tube</td></tr>
   <tr><td>দিন ৩</td><td>৮-কোষ, compaction; তারপর ১৬-কোষ morula</td><td>Isthmus</td></tr>
   <tr><td>দিন ৪–৫</td><td>Blastocyst: গহ্বর, embryoblast, trophoblast</td><td>জরায়ুর গহ্বর</td></tr>
   <tr><td>দিন ৫</td><td>Hatching: zona থেকে বের হওয়া</td><td>জরায়ুর গহ্বর</td></tr>
   <tr><td>দিন ৬–৭</td><td>Implantation শুরু; cyto- আর syncytiotrophoblast; hypoblast</td><td>Endometrium (সাধারণত body-র পেছনের বা সামনের দেয়াল)</td></tr>
  </tbody></table>''', '''  <h2>কীভাবে ব্যবহার করবেন</h2>
  <ol>
   <li>উপরের স্লাইডার বা বোতাম দিয়ে ধাপ বদলান।</li>
   <li>আঙুলে ঘোরান; বিন্দু বা গঠনে ট্যাপ করলে নাম আর বিবরণ আসবে।</li>
   <li>"কেটে দেখা" চাপুন: মাঝ বরাবর, পাশ বা উপর থেকে কাটুন; স্লাইডারে গভীরতা বদলান। কাটা মুখ গাঢ় রঙে।</li>
   <li>"যাত্রাপথ" ধাপে দেখুন কোন দিন ভ্রূণ কোথায় থাকে।</li>
  </ol>
  <p class="note">রং: গোলাপি-বাদামি কোষ, বেগুনি নিউক্লিয়াস, নীল পুরুষ pronucleus, লাল-গোলাপি স্ত্রী pronucleus, সবুজ embryoblast, কমলা trophoblast, গাঢ় লাল syncytiotrophoblast, নীল epiblast, হলুদ hypoblast, হালকা নীল স্বচ্ছ zona আর গহ্বর।</p>''')
s += sec('s-fert', '''  <h2>নিষেক (fertilization)</h2>
  <ul>
   <li><b>কোথায়, কখন:</b> uterine tube-এর ampulla-য়; ovulation-এর পর oocyte প্রায় ২৪ ঘণ্টা বাঁচে।</li>
   <li><b>প্রস্তুতি:</b> শুক্রাণুর capacitation (মেয়েদের প্রজননতন্ত্রে কয়েক ঘণ্টা) আর acrosome reaction।</li>
   <li><b>ধাপ ১:</b> corona radiata পার হওয়া।</li>
   <li><b>ধাপ ২:</b> zona pellucida-য় বাঁধা, acrosome-এর enzyme দিয়ে ফুঁড়ে যাওয়া। ঢোকার পর zona reaction: আর কেউ ঢুকতে পারে না।</li>
   <li><b>ধাপ ৩:</b> শুক্রাণু আর oocyte-এর পর্দা মিলে যাওয়া; oocyte cortical reaction দেখায় আর ২য় meiosis শেষ করে।</li>
   <li><b>ফলাফল:</b> diploid সংখ্যা ফেরা, লিঙ্গ নির্ধারণ, ক্লিভেজ শুরু।</li>
  </ul>''', '''  <h2>ক্লিভেজ থেকে blastocyst</h2>
  <ul>
   <li><b>ক্লিভেজ:</b> একের পর এক mitosis; কোষ ছোট হয়, মোট আকার বাড়ে না।</li>
   <li><b>Compaction:</b> ৮-কোষের পর; tight junction, ভেতর-বাইরের আলাদা হওয়া।</li>
   <li><b>Morula:</b> প্রায় ৩ দিনে ১৬-কোষ; inner cell mass → ভ্রূণ, outer cell mass → trophoblast।</li>
   <li><b>Blastocyst:</b> জরায়ুতে ঢোকার পর তরল জমে গহ্বর; embryoblast এক মেরুতে।</li>
   <li><b>Hatching:</b> zona সরে যায়, তারপর implantation।</li>
   <li><b>Implantation:</b> প্রায় ৬ষ্ঠ দিনে শুরু; trophoblast → cytotrophoblast + syncytiotrophoblast; সপ্তাহ ১-এর শেষে hypoblast।</li>
  </ul>''')
s += sec('s-clin', '''  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li><b>Ectopic pregnancy:</b> জরায়ুর বাইরে implantation, বেশিরভাগ uterine tube-এ (বিশেষ করে ampulla); নল ফেটে মারাত্মক রক্তক্ষরণ হতে পারে।</li>
   <li><b>Placenta previa:</b> জরায়ুর নিচের দিকে, internal os-এর কাছে implantation।</li>
   <li><b>Polyspermy</b> আটকানো zona reaction-এর কাজ; ব্যর্থ হলে triploid ভ্রূণ, টেকে না।</li>
   <li><b>IVF:</b> নিষেক আর প্রথম কয়েক দিনের ক্লিভেজ ল্যাবে; সাধারণত ৮-কোষ বা blastocyst অবস্থায় জরায়ুতে দেওয়া হয়।</li>
   <li><b>Twins:</b> monozygotic যমজ হতে পারে ক্লিভেজের শুরুতে আলাদা হলে, বা পরে inner cell mass ভাগ হলে।</li>
  </ul>''', '''  <h2>ভাইভা</h2>
''' + viva([
    ('নিষেক কোথায় হয়?', 'Uterine tube-এর ampulla-য়।'),
    ('Polyspermy কীভাবে আটকায়?', 'Cortical reaction আর তার ফলে zona reaction।'),
    ('Morula কী, কখন?', 'প্রায় ৩ দিনে ১৬-কোষের অবস্থা, তুঁতফলের মতো দেখতে।'),
    ('Blastocyst-এর দুই কোষগোষ্ঠী কী হয়?', 'Embryoblast থেকে ভ্রূণ; trophoblast থেকে placenta-র ভ্রূণের অংশ।'),
    ('Implantation সাধারণত কোথায় হয়?', 'জরায়ুর body-র পেছনের বা সামনের দেয়ালে।'),
    ('Hatching কেন দরকার?', 'Zona সরে না গেলে trophoblast endometrium-এ লাগতে পারে না।'),
]))
credit = '''<section class="band" id="s-credit"><div class="wrap">
 <h2>সূত্র ও মডেল</h2>
 <p><b>মডেল:</b> আমাদের নিজের স্কিম্যাটিক 3D, বইয়ের চিত্র আর প্রকাশিত মাপ (oocyte প্রায় ১১০ µm, zona প্রায় ১৫ µm, blastocyst প্রায় ১৫০–২০০ µm) অনুযায়ী। আসল স্ক্যান নয়; কোষের সংখ্যা আর আকার শেখানোর জন্য সরল করা।</p>
 <p><b>লেখা:</b> মানক embryology বইয়ের সাধারণ তথ্য (Langman's Medical Embryology, Moore's The Developing Human)। আপনার বই ঠিক হলে সেই বই অনুযায়ী পৃষ্ঠা নম্বরসহ মেলানো হবে।</p>
 <p class="note">এটি একটি খসড়া। ছাত্রদের দেওয়ার আগে শিক্ষককে দিয়ে রিভিউ করিয়ে নিন।</p>
</div></section>'''
page(os.path.join(os.path.dirname(__file__), '..', 'bones', 'embryo-w1', 'index.html'), 'Embryology 3D: সপ্তাহ ১', 'Embryology 3D <span style="font-weight:500;opacity:.8">· সপ্তাহ ১: নিষেক থেকে implantation</span>',
     'দিন ধরে ধাপে ধাপে: নিষেক, pronucleus, ক্লিভেজ, morula, blastocyst, hatching, implantation, আর কোন দিন ভ্রূণ কোথায়। প্রতিটা মডেল ঘোরানো আর কাটা যায়।',
     ['lm', 'cut', 'quiz'], ['ant', 'post', 'lat', 'sup'], [], [('s-sum', 'এক নজরে'), ('s-fert', 'নিষেক ও ক্লিভেজ'), ('s-clin', 'ক্লিনিক্যাল ও ভাইভা'), ('s-credit', 'সূত্র')], s,
     specnav=nav, credit=credit)
