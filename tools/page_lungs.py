"""Lungs ও pleura পেজ (index.html)। ব্যবহার: python tools/page_lungs.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import limbpage
from limbpage import page, sec, viva, credit
limbpage.MODE_NAMES.update({'parts': 'Lobes', 'lm': 'Borders', 'faceR': 'Right medial surface', 'faceL': 'Left medial surface', 'seg': 'Segments',
                            'root': 'Root', 'rel': 'Relations', 'surf': 'Surface marking', 'cut': 'Cut section', 'quiz': 'Quiz'})
limbpage.VIEW_NAMES.update({'ant': 'সামনে', 'post': 'পেছনে', 'rlat': 'ডান পাশ', 'llat': 'বাঁ পাশ', 'sup': 'উপর থেকে', 'inf': 'নিচ থেকে'})
limbpage.LAYER_ROWS.update({'rib': ('#e9e1cf', 'Ribs ও sternum'), 'organ': ('#c97a6d', 'Heart, oesophagus'), 'great': ('#e0443e', 'Great vessels'),
                            'root': ('#6c63d9', 'Root: bronchus, pulmonary vessels'), 'muscle': ('#8e2a23', 'Diaphragm'), 'vert': ('#d9d0bd', 'Vertebrae'),
                            'pleura': ('#9fd0e8', 'Pleura (স্কিম্যাটিক)')})
D = 'Datta I, পৃ. '
s = sec('s-sum', '''  <h2>এক নজরে: right বনাম left lung</h2>
  <table class="cmp"><thead><tr><th></th><th>Right lung</th><th>Left lung</th></tr></thead><tbody>
   <tr><td>আকার</td><td>ছোট (২.৫ সেমি), চওড়া, বেশি ধারণক্ষম</td><td>লম্বা, সরু, কম ধারণক্ষম</td></tr>
   <tr><td>ওজন</td><td>প্রায় ৬২৫ গ্রাম</td><td>প্রায় ৫৬৫ গ্রাম</td></tr>
   <tr><td>Lobe / fissure</td><td>৩ lobe, ২ fissure (oblique, horizontal)</td><td>২ lobe, ১ fissure (oblique)</td></tr>
   <tr><td>Base</td><td>বেশি অবতল (নিচে liver)</td><td>অগভীর</td></tr>
   <tr><td>Cardiac notch, lingula</td><td>নেই</td><td>আছে</td></tr>
   <tr><td>Cardiac impression</td><td>অগভীর</td><td>গভীর</td></tr>
   <tr><td>Hilum-এ উপর থেকে নিচে</td><td>Bronchus (eparterial), artery, bronchus, vein</td><td>Artery, bronchus, vein</td></tr>
   <tr><td>Bronchial artery</td><td>সাধারণত ১টা</td><td>২টা</td></tr>
   <tr><td>Broncho-pulmonary segment</td><td>১০ (৩ + ২ + ৫)</td><td>৮–৯ (৪ + ৪)</td></tr>
  </tbody></table>
  <p class="ref">''' + D + '''36 (Table of differences)</p>''', '''  <h2>কীভাবে ব্যবহার করবেন</h2>
  <ol>
   <li>উপরের বোতামে mode বদলান: Lobes, Borders, দুই lung-এর medial surface, Segments, Root, Relations, Surface marking, Cut section।</li>
   <li>Lung-এর গায়ে বা বিন্দুতে ট্যাপ করুন: সেখানেই নাম ভাসবে, নিচে বিবরণ।</li>
   <li><b>দুইবার ট্যাপ বা চেপে ধরলে</b> সেই lobe বা structure সরে যায়; ভেতরের fissure পৃষ্ঠ বা পেছনের অঙ্গ দেখুন। "↶ ফেরত" দিয়ে ফেরান।</li>
   <li>"Cut section"-এ coronal, transverse আর sagittal কাটা; স্লাইডারে গভীরতা।</li>
  </ol>
  <p class="note">Lung-এর রং: adult lung-এ carbon জমে ধূসর ছোপ পড়ে, newborn-এ গোলাপি (''' + D + '''32)।</p>''')
s += sec('s-pleura', '''  <h2>Pleura</h2>
  <ul>
   <li><b>গঠন:</b> বন্ধ serous থলি; lung medial দিক থেকে ঢুকে আছে। Visceral আর parietal layer, lung root আর pulmonary ligament ঘিরে একটানা। (পৃ. 28)</li>
   <li><b>Parietal pleura-র চার অংশ:</b> costal, diaphragmatic, cervical, mediastinal। Cervical pleura-র উপরে suprapleural membrane (Sibson's fascia): C7 transverse process থেকে ১ম rib-এর ভেতরের কিনারা। (পৃ. 28–29)</li>
   <li><b>Reflexion line:</b> costomediastinal (sternum-এর পেছনে; ডানে xiphisternal joint পর্যন্ত, বাঁয়ে ৪র্থ cartilage থেকে পাশে সরে ৬ষ্ঠ পর্যন্ত), costovertebral, costodiaphragmatic। (পৃ. 28–29)</li>
   <li><b>Costodiaphragmatic recess:</b> lung-এর নিচের কিনারা আর pleura-র নিচের সীমার মাঝে; mid-axillary line-এ ~৫ সেমি। Fluid আগে এখানে জমে। (পৃ. 31)</li>
   <li><b>Nerve supply:</b> costal আর peripheral diaphragmatic pleura: intercostal nerve (ব্যথা পেটে যেতে পারে); mediastinal আর central diaphragmatic: phrenic nerve (C3, C4; ব্যথা কাঁধে)। Visceral pleura ব্যথা বোঝে না। (পৃ. 31–32)</li>
   <li><b>চাপ:</b> intrapleural fluid pressure প্রায় −১০ mm Hg। (পৃ. 31)</li>
  </ul>''', '''  <h2>Applied: pleura</h2>
  <ul>
   <li><b>Pleurisy:</b> dry (friction rub, ব্যথা) বা effusion-সহ। (পৃ. 32)</li>
   <li><b>Pleural effusion:</b> hydro-, pyo-, haemo-, chylothorax (thoracic duct ছিঁড়লে)। Mediastinum উল্টো দিকে সরে; percussion-এ stony dull। (পৃ. 32)</li>
   <li><b>Pleural tap:</b> বসা অবস্থায় mid-axillary line-এর পেছনে, fluid level-এর নিচে, কিন্তু ৯ম intercostal space-এর নিচে নয়। (পৃ. 32)</li>
   <li><b>Pneumothorax:</b> open (sucking wound, mediastinal flutter), tension (valve-এর মতো)। চিকিৎসা: ২য় intercostal space দিয়ে chest tube। (পৃ. 32)</li>
  </ul>''')
s += sec('s-lung', '''  <h2>Lung: গুরুত্বপূর্ণ তথ্য</h2>
  <ul>
   <li><b>Apex-এর সম্পর্ক:</b> সামনে subclavian artery ও vein, scalenus anterior; পেছনে ১ম rib-এর neck-এর সামনে sympathetic trunk, ১ম posterior intercostal vein, superior intercostal artery, T1-এর ventral ramus; পাশে scalenus medius। (পৃ. 33)</li>
   <li><b>Pancoast/thoracic inlet syndrome:</b> upper lobe-এর tumour: মুখ আর হাত ফোলা, কব্জিতে নাড়ি কম, hemidiaphragm paralysis (phrenic), স্বর ভাঙা (recurrent laryngeal)। (পৃ. 33)</li>
   <li><b>Lobe of azygos vein:</b> প্রায় ১%-এ right lung-এর apex arch of azygos দিয়ে দুই ভাগ। (পৃ. 36)</li>
   <li><b>Nutrition:</b> conducting part: bronchial artery (vasa publica); respiratory part: pulmonary artery (vasa privata)। (পৃ. 40)</li>
   <li><b>Lymph:</b> superficial আর deep plexus → bronchopulmonary (hilar) → tracheobronchial → paratracheal → bronchomediastinal trunk। Left lower lobe-এর কিছু lymph right paratracheal-এ। Alveolus-এর চারপাশে lymphatic নেই। (পৃ. 40–41)</li>
   <li><b>Nerve:</b> pulmonary plexus: vagus (bronchoconstrictor, secretomotor) আর T2–T5 sympathetic (bronchodilator)। (পৃ. 41)</li>
   <li><b>Development:</b> lung bud, laryngotracheal tube থেকে; glandular (৩ মাস পর্যন্ত), canalicular (৪–৬ মাস), alveolar (৭ মাস থেকে; viable age)। (পৃ. 41)</li>
   <li><b>Lung volume:</b> tidal ৫০০ ml, vital capacity ৪০০০ ml, total lung capacity ৫০০০ ml, dead space ১৫০ ml। (পৃ. 41–42)</li>
  </ul>''', '''  <h2>Viva</h2>
''' + viva([
    ('Lung-এর apex কোথায়?', '১ম costal cartilage থেকে ৩–৪ সেমি আর clavicle-এর medial প্রান্ত থেকে ২.৫ সেমি উপরে; ১ম rib-এর neck-এর উপরে নয়।'),
    ('Oblique fissure কোথায় posterior border কাটে?', 'T4–T5 spine-এর ২.৫ সেমি পাশে; সামনে ৬ষ্ঠ costochondral junction-এ inferior border কাটে।'),
    ('Horizontal fissure-এর surface marking?', 'Mid-axillary line-এ oblique fissure থেকে ৪র্থ costal cartilage পর্যন্ত।'),
    ('Right hilum-এ উপর থেকে নিচে কী?', 'Upper lobe (eparterial) bronchus, pulmonary artery, principal (hyparterial) bronchus, lower pulmonary vein।'),
    ('Left lung-এর medial surface-এ oesophagus কতবার?', 'দুইবার: aortic arch-এর উপরে, আর নিচে descending aorta ও pulmonary ligament-এর মাঝে।'),
    ('Broncho-pulmonary segment কী, গুরুত্ব কী?', 'একটা tertiary bronchus যতটুকু lung-এ বাতাস দেয়; postural drainage, সংক্রমণ সীমাবদ্ধ থাকা, segmental resection।'),
    ('Aspiration-এ কোন segment বেশি আক্রান্ত?', 'Lower lobe-এর apical segment (Mendelson\'s syndrome); supine-এ upper lobe-এর posterior segment-ও।'),
    ('Costodiaphragmatic recess কোথায় সবচেয়ে চওড়া?', 'Mid-axillary line-এ, প্রায় ৫ সেমি।'),
]))
page(os.path.join(os.path.dirname(__file__), '..', 'bones', 'lungs', 'index.html'), 'Lungs ও Pleura 3D অ্যাটলাস',
     'Lungs ও Pleura <span style="font-weight:500;opacity:.8">· 3D অ্যাটলাস</span>',
     'দুই lung-এর lobe, fissure, surface, impression, hilum, segment, root আর pleura-র surface marking; সব স্ক্যান থেকে মাপা। Lobe সরিয়ে ভেতর দেখুন, কেটে দেখুন।',
     ['parts', 'lm', 'faceR', 'faceL', 'seg', 'root', 'rel', 'surf', 'cut', 'quiz'], ['ant', 'post', 'rlat', 'llat', 'sup', 'inf'],
     ['rib', 'organ', 'great', 'root', 'muscle', 'vert', 'pleura'],
     [('s-sum', 'এক নজরে'), ('s-pleura', 'Pleura'), ('s-lung', 'Lung ও viva'), ('s-credit', 'সূত্র')], s, start='parts',
     credit=credit('A.K. Datta, <i>Essentials of Human Anatomy</i>, Part I (Thorax &amp; Abdomen), Chapter 2: The Pleura ও The Lungs, পৃ. 28–42। নিজের ভাষায় লেখা।',
                   'Lobe, heart, vessel, trachea, bronchus আর rib স্ক্যানের। Broncho-pulmonary segment আর parietal pleura স্কিম্যাটিক।'))
