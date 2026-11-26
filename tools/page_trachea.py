"""Trachea ও bronchi পেজ। ব্যবহার: python tools/page_trachea.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import limbpage
from limbpage import page, sec, viva, credit
limbpage.MODE_NAMES.update({'parts': 'Parts', 'lm': 'Levels', 'seg': 'Segmental bronchi', 'rel': 'Relations', 'lungs': 'In the lungs', 'cut': 'Cut section', 'quiz': 'Quiz'})
limbpage.VIEW_NAMES.update({'ant': 'সামনে', 'post': 'পেছনে', 'rlat': 'ডান পাশ', 'llat': 'বাঁ পাশ', 'sup': 'উপর থেকে', 'inf': 'নিচ থেকে'})
limbpage.LAYER_ROWS.update({'ring': ('#e8f1f4', 'Cartilage rings (স্কিম্যাটিক)'), 'organ': ('#d79a8e', 'Oesophagus, heart, larynx'), 'great': ('#e0443e', 'Great vessels'),
                            'muscle': ('#8e2a23', 'Sternothyroid'), 'vert': ('#d9d0bd', 'Vertebrae ও sternum'), 'lung': ('#f0b8b2', 'Lungs')})
s = sec('s-sum', '''  <h2>এক নজরে: right বনাম left principal bronchus</h2>
  <table class="cmp"><thead><tr><th></th><th>Right</th><th>Left</th></tr></thead><tbody>
   <tr><td>আকার</td><td>চওড়া, ছোট (~২.৫ সেমি), বেশি খাড়া (২৫°)</td><td>সরু, লম্বা (~৫ সেমি), বেশি তির্যক (৪৫°)</td></tr>
   <tr><td>উপরে বাঁকে</td><td>Arch of azygos vein</td><td>Arch of aorta</td></tr>
   <tr><td>Hilum-এর লেভেল</td><td>T5</td><td>T6</td></tr>
   <tr><td>Eparterial শাখা</td><td>আছে (upper lobe bronchus)</td><td>নেই</td></tr>
   <tr><td>Lobar bronchus</td><td>৩টা</td><td>২টা</td></tr>
   <tr><td>Foreign body</td><td>বেশি যায়</td><td>কম</td></tr>
  </tbody></table>
  <p class="ref">Datta I, পৃ. 48–49, 51</p>''', '''  <h2>Trachea: মূল তথ্য</h2>
  <ul>
   <li><b>বিস্তার:</b> cricoid-এর নিচের কিনারা (C6) থেকে sternal angle পর্যন্ত; bifurcation cadaver-এ T4-এর নিচের কিনারা, জীবিত দাঁড়ানো অবস্থায় T6, newborn-এ T3। (পৃ. 46)</li>
   <li><b>ভেতরের ব্যাস:</b> adult-এ ১২ মিমি; newborn-এ ৩ মিমি, ৩ বছর পর্যন্ত একই, তারপর ১২ বছর পর্যন্ত প্রতি বছর ১ মিমি বাড়ে। Intubation-এর tube বাছাইয়ে দরকার। (পৃ. 46)</li>
   <li><b>Cartilage:</b> ১৬–২০টা C-আকৃতির hyaline ring, পেছনে trachealis। (পৃ. 47)</li>
   <li><b>Lining:</b> ciliated pseudostratified columnar, goblet cell-সহ; mucociliary escalator। (পৃ. 47)</li>
   <li><b>রক্ত:</b> প্রধানত inferior thyroid artery; bifurcation-এ bronchial artery। শিরা inferior thyroid vein-এ। Lymph: pretracheal ও paratracheal node। (পৃ. 47–48)</li>
   <li><b>Nerve:</b> vagus ও recurrent laryngeal (motor, secretomotor, sensory); sympathetic T1–T5। (পৃ. 48)</li>
   <li><b>Development:</b> laryngotracheal tube, foregut-এর ventral diverticulum। (পৃ. 48)</li>
  </ul>''')
s += sec('s-app', '''  <h2>Applied</h2>
  <ul>
   <li><b>Low tracheostomy শিশুদের ঝুঁকিপূর্ণ:</b> trachea গভীরে আর নড়াচড়া বেশি, left brachiocephalic vein আর arch of aorta suprasternal notch-এর উপরে উঠতে পারে। (পৃ. 46–47)</li>
   <li><b>Foreign body:</b> right bronchus খাড়া ও চওড়া বলে right lung-এ যায়। (পৃ. 51)</li>
   <li><b>Sub-carinal angle ৯০°-এর বেশি:</b> sub-carinal node বড়, metastasis সন্দেহ। (পৃ. 51)</li>
   <li><b>Middle lobe syndrome:</b> middle lobe bronchus-এর চারপাশের node বড় হলে collapse। (পৃ. 49)</li>
   <li><b>Aspiration:</b> lower lobe-এর apical (segment 6) আর upper lobe-এর posterior (segment 2) segment; prone অবস্থায় drainage। (পৃ. 51)</li>
   <li><b>Posterior segment of right upper lobe:</b> tuberculosis-এর জায়গা; anterior segment-এ cancer বেশি। (পৃ. 51)</li>
  </ul>''', '''  <h2>Viva</h2>
''' + viva([
    ('Trachea কোথা থেকে কোথা পর্যন্ত?', 'Cricoid-এর নিচের কিনারা (C6) থেকে sternal angle-এ bifurcation পর্যন্ত।'),
    ('Bifurcation-এর লেভেল কেন বদলায়?', 'Cadaver/supine-এ T4-এর নিচের কিনারা, জীবিত দাঁড়ানো অবস্থায় শ্বাসের সাথে T6 পর্যন্ত নামে।'),
    ('Ring পেছনে অসম্পূর্ণ কেন?', 'গেলার সময় oesophagus যাতে ফুলতে পারে; পেছনে trachealis।'),
    ('Eparterial bronchus কী?', 'Right upper lobe bronchus, pulmonary artery-র উপরে থাকে; left-এ নেই।'),
    ('Carina-র গুরুত্ব?', 'Bronchoscopy-র গাইড, সবচেয়ে সংবেদনশীল mucosa (cough reflex); চওড়া হলে sub-carinal node বড়।'),
]))
page(os.path.join(os.path.dirname(__file__), '..', 'bones', 'trachea', 'index.html'), 'Trachea ও Bronchi 3D অ্যাটলাস',
     'Trachea ও Bronchi <span style="font-weight:500;opacity:.8">· 3D অ্যাটলাস</span>',
     'Trachea থেকে segmental bronchus পর্যন্ত পুরো bronchial tree, vertebra-র লেভেল, চারপাশের great vessel; স্ক্যান থেকে মাপা।',
     ['parts', 'lm', 'seg', 'rel', 'lungs', 'cut', 'quiz'], ['ant', 'post', 'rlat', 'llat', 'sup', 'inf'],
     ['ring', 'organ', 'great', 'muscle', 'vert', 'lung'],
     [('s-sum', 'এক নজরে'), ('s-app', 'Applied ও viva'), ('s-credit', 'সূত্র')], s, start='parts',
     credit=credit('A.K. Datta, <i>Essentials of Human Anatomy</i>, Part I, Chapter 4: The Trachea; Right and Left Bronchi, পৃ. 46–51। নিজের ভাষায় লেখা।',
                   'Trachea, bronchial tree, vessel, oesophagus স্ক্যানের। Cartilage ring আর segment-ভাগ স্কিম্যাটিক।'))
