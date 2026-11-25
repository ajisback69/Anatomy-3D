"""Upper limb-এর হাড়ের পেজ (index.html) তৈরি। ব্যবহার: python tools/pages_upper.py [bone ...]
লেখা: A.K. Datta, Essentials of Human Anatomy, Superior & Inferior Extremities, পৃ. ৩–২৫ (নিজের ভাষায়, পৃষ্ঠা নম্বরসহ)।"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from limbpage import page, sec, viva, credit

ROOT = os.path.join(os.path.dirname(__file__), '..', 'bones')
REF = 'A.K. Datta, <i>Essentials of Human Anatomy</i> (Superior &amp; Inferior Extremities), Bones of the Upper Limb'
MESHNOTE = 'অংশ, ল্যান্ডমার্ক আর জোড়ার তল মেশ থেকে মাপা। মাসলের অ্যাটাচমেন্ট: স্ক্যানের মাসল যেখানে হাড় ছোঁয়, বইয়ে বলা এলাকার ভেতরে। নার্ভ আর ছোট রক্তনালী স্ক্যানে নেই, সেগুলো স্কিম্যাটিক।'
ATT_TABLE = '<table class="cmp"><thead><tr><th>মাসল</th><th>কোথায়</th></tr></thead><tbody id="tbl-att"></tbody></table>'


def humerus():
    s = sec('s-gen', '''  <h2>হিউমেরাস: সাধারণ কথা</h2>
  <ul>
   <li>বাহুর হাড়; upper limb-এর সবচেয়ে লম্বা long bone।</li>
   <li>উপরের প্রান্ত, শ্যাফট আর নিচের প্রান্ত।</li>
   <li><b>Angle of humeral torsion:</b> head-এর অক্ষ আর নিচের প্রান্তের অক্ষের মধ্যে প্রায় ১৬৪° (প্রাপ্তবয়স্কে)।</li>
   <li><b>তিন রকম neck:</b> anatomical (head-এর ঠিক পরে), surgical (উপরের প্রান্ত আর শ্যাফটের জোড়ায়), morphological (কিশোর বয়সে epiphyseal line, surgical neck-এর প্রায় ০.৫ সেমি উপরে)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৯–১০</p>''', '''  <h2>শরীরে যেভাবে রাখবেন (ডান না বাম)</h2>
  <ul>
   <li>Head উপরে, ভেতরের দিকে মুখ করা।</li>
   <li>Lesser tubercle আর intertubercular sulcus সামনে।</li>
   <li>নিচের প্রান্তে olecranon fossa পেছনে; medial epicondyle বেশি উঁচু।</li>
  </ul>
  <p class="note">"ডান না বাম" মোডে আসল ডান আর বাম হাড় এলোমেলো ঘুরিয়ে দেখায়।</p>''')
    s += sec('s-feat', '''  <h2>উপরের প্রান্ত</h2>
  <ul>
   <li><b>Head:</b> গোলকের ১/৩; ভেতরে-পেছনে-উপরে; hyaline cartilage মাঝে মোটা, কিনারায় পাতলা।</li>
   <li><b>Greater tubercle:</b> সবচেয়ে বাইরে; উপরে-পেছনে তিন ছাপ: supraspinatus, infraspinatus, teres minor। চার scapulo-humeral মাসলের tendon capsule-এর সাথে মিশে <b>rotator cuff</b>।</li>
   <li><b>Lesser tubercle:</b> সামনে; subscapularis।</li>
   <li><b>Intertubercular sulcus:</b> biceps-এর long head; lateral lip-এ pectoralis major, floor-এ latissimus dorsi, medial lip-এ teres major।</li>
   <li><b>Capsule:</b> anatomical neck বরাবর; দুই জায়গায় ব্যতিক্রম: sulcus-এর মাথায় ফাঁক (biceps tendon যায়), আর নিচে ভেতরের দিকে ১ সেমি নেমে surgical neck ছোঁয়।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৯–১১</p>
  <h2>শ্যাফট</h2>
  <ul>
   <li><b>Anterior border:</b> greater tubercle-এর সামনে থেকে coronoid আর radial fossa-র মাঝ পর্যন্ত; উপরের ১/৩ sulcus-এর lateral lip।</li>
   <li><b>Medial border:</b> নিচে medial supracondylar ridge; মাঝে coracobrachialis-এর খসখসে অংশ আর nutrient foramen (নিচের দিকে মুখ)।</li>
   <li><b>Lateral border:</b> নিচে lateral supracondylar ridge; মাঝে spiral groove-এ হারিয়ে যায়।</li>
   <li><b>Antero-lateral পৃষ্ঠ:</b> মাঝামাঝি V আকারের deltoid tuberosity।</li>
   <li><b>Posterior পৃষ্ঠ:</b> spiral groove (radial nerve, profunda brachii); উপরে lateral head, নিচে medial head of triceps।</li>
   <li>কখনো <b>supracondylar process</b> আর <b>ligament of Struthers</b>: median nerve বা brachial artery চেপে যেতে পারে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১১–১২</p>''', '''  <h2>নিচের প্রান্ত</h2>
  <ul>
   <li><b>Capitulum:</b> radius-এর head; সোজা হাতে নিচের দিকে, ভাঁজে সামনের দিকে ছোঁয়।</li>
   <li><b>Trochlea:</b> অসম কপিকল; ভেতরের কিনারা ৬ মিমি নিচে নামে, তাই <b>carrying angle</b> প্রায় ১৬৩° (বাইরের দিকে স্থূলকোণ)। মেয়েদের বেশি বলে ধরা হয়; ভাঁজ আর pronation-এ হারিয়ে যায়।</li>
   <li><b>তিন fossa:</b> radial (capitulum-এর উপরে), coronoid (trochlea-র উপরে, সামনে), olecranon (পেছনে, গভীর)। তিনটাই elbow-এর capsule-এর ভেতরে।</li>
   <li><b>Medial epicondyle:</b> ulnar collateral ligament, common flexor origin, পেছনে ulnar nerve।</li>
   <li><b>Lateral epicondyle:</b> radial collateral ligament, common extensor origin, পেছনে anconeus।</li>
   <li>Elbow-এর capsule: দুই epicondyle বাদ, তিন fossa ভেতরে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১২–১৩</p>''')
    s += sec('s-att', '''  <h2>মাসলের অ্যাটাচমেন্ট</h2>
  ''' + ATT_TABLE + '''
  <p class="note">"মাসল" মোডে রঙিন জায়গায় ট্যাপ করুন। ECU আর triceps-এর long head স্ক্যানে হিউমেরাস ছোঁয় না (long head লাগে scapula-য়)।</p>''', '''  <h2>বিশেষ কথা</h2>
  <ol>
   <li>Scapulo-humeral মাসল head ঘিরে উপরের প্রান্তে।</li>
   <li>Thoraco-humeral মাসল sulcus বরাবর।</li>
   <li>উপরের অর্ধেকে শুধু insertion, triceps-এর lateral head বাদে।</li>
   <li>নিচের অর্ধেকে শুধু origin।</li>
   <li>হাড় ছোঁয়া নার্ভ: axillary (surgical neck), radial (spiral groove), ulnar (medial epicondyle-এর পেছনে)।</li>
  </ol>
  <p class="ref">Datta, পৃ. ১৩</p>''')
    s += sec('s-oss', '''  <h2>অসিফিকেশন</h2>
  <ul>
   <li><b>Primary:</b> শ্যাফটের মাঝে, গর্ভের ৮ম সপ্তাহে।</li>
   <li><b>উপরের প্রান্ত (৩টা):</b> head ১ বছর, greater tubercle ৩ বছর, lesser tubercle ৫ বছর; ৬ বছরে জুড়ে একটা epiphysis, শ্যাফটের সাথে মেশে প্রায় ২০ বছরে।</li>
   <li><b>নিচের প্রান্ত (৪টা):</b> capitulum ও trochlea-র বাইরের অংশ ২ বছর, medial epicondyle ৫ বছর, trochlea-র ভেতরের অংশ ১০ বছর, lateral epicondyle ১২ বছর। Medial epicondyle আলাদা মেশে ১৬–১৭ বছরে, বাকি তিনটা একসাথে প্রায় ১৮ বছরে।</li>
   <li><b>Growing end:</b> উপরের প্রান্ত (দেরিতে মেশে)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৩</p>''', '''  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li>ভাঙার সাধারণ জায়গা: surgical neck, শ্যাফটের মাঝখান, supracondylar অঞ্চল।</li>
   <li>উপরের আর মাঝের ১/৩-এর জোড়ায় রক্ত সরবরাহ কম: ভাঙলে দেরিতে জোড়া লাগে বা লাগে না।</li>
   <li>Surgical neck ভাঙলে axillary nerve → deltoid অবশ; শ্যাফট ভাঙলে radial nerve।</li>
   <li>ছোটদের বাহু কাটলে নরম টিস্যু যথেষ্ট রাখতে হয়, নইলে উপরের প্রান্ত বাড়তে থাকায় conical stump।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১০, ১৩</p>''')
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Humerus-এর কয়টা neck, কোনটা ক্লিনিক্যালি জরুরি?', 'তিনটা: anatomical, surgical, morphological। Surgical neck: পেছনে axillary nerve আর posterior circumflex humeral vessels। (পৃ. ১০)'),
        ('Rotator cuff কী কী দিয়ে?', 'Subscapularis, supraspinatus, infraspinatus, teres minor-এর tendon, capsule-এর সাথে মেশা। (পৃ. ১০)'),
        ('Intertubercular sulcus-এ কী কী লাগে?', 'Lateral lip pectoralis major, floor latissimus dorsi, medial lip teres major; ভেতরে biceps-এর long head। (পৃ. ১১)'),
        ('Carrying angle কেন হয়?', 'Trochlea-র ভেতরের কিনারা বাইরেরটার চেয়ে প্রায় ৬ মিমি নিচে নামে; কোণ প্রায় ১৬৩°। (পৃ. ১২)'),
        ('কোন নার্ভ কোথায় হাড় ছোঁয়?', 'Axillary: surgical neck; radial: spiral groove; ulnar: medial epicondyle-এর পেছনে। (পৃ. ১৩)'),
        ('Humerus-এর growing end কোনটা?', 'উপরের প্রান্ত। (পৃ. ১৩)'),
        ('Ligament of Struthers কী?', 'Supracondylar process থেকে medial epicondyle পর্যন্ত fibrous band; coracobrachialis-এর তৃতীয় head-এর অবশেষ; median nerve/brachial artery চাপতে পারে। (পৃ. ১২)'),
    ]))
    page(os.path.join(ROOT, 'humerus', 'index.html'), 'হিউমেরাস 3D অ্যাটলাস', 'হিউমেরাস <span style="font-weight:500;opacity:.8">· Humerus</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান হিউমেরাস, সাথে আসল কাঁধ আর কনুইয়ের হাড় আর মাসল। ঘুরিয়ে দেখুন, মার্কে ট্যাপ করুন। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'rel', 'joint', 'side', 'quiz'], ['ant', 'post', 'lat', 'med', 'sup', 'inf'], ['muscle', 'nerve', 'artery', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-feat', 'ফিচার'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-oss', 'অসিফিকেশন'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         credit=credit(REF + ', পৃ. ৯–১৩।', MESHNOTE))


def clavicle():
    s = sec('s-gen', """  <h2>ক্ল্যাভিকল: সাধারণ কথা</h2>
  <ul>
   <li>Shoulder girdle-এর হাড়; pelvic girdle-এ এর কোনো জোড়া নেই।</li>
   <li><b>কাজ:</b> (১) strut-এর মতো scapula-কে বাইরে রাখে, তাই হাত শরীরের পাশ থেকে মুক্তভাবে দোলে; (২) coraco-clavicular ligament আর ভেতরের ২/৩ দিয়ে হাতের বল axial skeleton-এ পাঠায়; (৩) পেছনের অবতল ভেতরের ২/৩ গলার গোড়ার নার্ভ-রক্তনালী রক্ষা করে; (৪) হাত মাথার উপরে তোলার সময় নিজের অক্ষে ঘোরে।</li>
   <li><b>বিশেষত্ব:</b> modified long bone: medullary cavity নেই, বেশিরভাগ membrane-এ ossify হয়, কখনো supraclavicular nerve ফোঁড়ে।</li>
   <li>সবার আগে ossification শুরু (৫–৬ সপ্তাহ), সবার শেষে শেষ (২১ বছরের পরে)।</li>
   <li>আড়াআড়ি, চামড়া আর platysma-র ঠিক নিচে; তাই ভাঙলে সাধারণত চামড়া ফুটো করে না।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৩</p>""", """  <h2>শরীরে যেভাবে রাখবেন (ডান না বাম)</h2>
  <ul>
   <li>বড় sternal প্রান্ত ভেতরে, একটু সামনে-নিচে।</li>
   <li>খসখসে দাগ আর subclavius-এর খাঁজ নিচে।</li>
   <li>সামনের পৃষ্ঠের বাঁক ভেতর থেকে বাইরে: আগে উত্তল, পরে অবতল।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৫</p>""")
    s += sec('s-feat', """  <h2>প্রান্ত দুটো</h2>
  <ul>
   <li><b>Sternal end:</b> উপর-নিচে উত্তল, সামনে-পেছনে একটু অবতল; fibrocartilage-এ ঢাকা। চারপাশে capsule, উপরে interclavicular ligament, উপরে-পেছনে articular disc। কাছেই নিচে costo-clavicular ligament-এর গর্ত।</li>
   <li><b>Acromial end:</b> চ্যাপ্টা, ডিম্বাকার facet বাইরে-নিচে; acromion-এর সাথে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৩–৪</p>""", """  <h2>শ্যাফট</h2>
  <ul>
   <li><b>বাইরের ১/৩:</b> চ্যাপ্টা; সামনের অবতল আর পেছনের উত্তল বর্ডার, উপরের পৃষ্ঠ চামড়ার নিচে; নিচে conoid tubercle আর trapezoid ridge।</li>
   <li><b>ভেতরের ২/৩:</b> চার পৃষ্ঠ, বর্ডার নেই। নিচে মাঝের ১/৩-এ subclavius-এর খাঁজ; সামনে ভেতরের অর্ধেকে pectoralis major; উপরে ভেতরের ১/৩-এ SCM; পেছনে sternohyoid।</li>
   <li><b>পেছনের সম্পর্ক:</b> ভেতরে IJV, subclavian ও brachiocephalic vein; বাইরে subclavian artery আর brachial plexus; ফুসফুসের apex (cervical pleura ও suprapleural membrane-সহ); suprascapular vessels।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৪–৫</p>""")
    s += sec('s-att', """  <h2>মাসল ও লিগামেন্টের অ্যাটাচমেন্ট</h2>
  """ + ATT_TABLE + """
  <p class="note">লিগামেন্ট: conoid tubercle আর trapezoid ridge-এ coraco-clavicular; স্টার্নাল প্রান্তের নিচে costo-clavicular।</p>""", """  <h2>অসিফিকেশন ও ক্লিনিক্যাল</h2>
  <ul>
   <li><b>Primary:</b> দুটো (ভেতরের ও বাইরের), membrane-এ, গর্ভের ৫ম–৬ষ্ঠ সপ্তাহে; পরে জুড়ে একটা। সবার আগে ossify হওয়া হাড়।</li>
   <li><b>Secondary:</b> sternal প্রান্তে, cartilage-এ, প্রায় ১৮ বছরে; জোড়া শুরু ২১ বছরে, শেষ ৩১ বছর পর্যন্ত। তাই সবার শেষে ossification শেষ করা হাড়। কখনো acromial প্রান্তেও।</li>
   <li><b>Growing end:</b> sternal প্রান্ত; nutrient vessel বাইরের দিকে।</li>
   <li><b>ভাঙা:</b> প্রসারিত হাতে পড়লে পরোক্ষ বলে সবচেয়ে বেশি ভাঙা হাড়গুলোর একটা; সাধারণত দুই বাঁকের জোড়ায়।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৩, ৫</p>""")
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Clavicle কেন modified long bone?', 'Medullary cavity নেই, বেশিরভাগ membrane-এ ossify, কখনো নার্ভ ফোঁড়ে; তবু ভেতরের ২/৩ long bone-এর মতো বল বহন করে। (পৃ. ৩)'),
        ('কোন হাড় সবার আগে ossify হয়?', 'Clavicle, গর্ভের ৫ম–৬ষ্ঠ সপ্তাহে; আবার সবার শেষে (৩১ বছর পর্যন্ত) শেষ হয়। (পৃ. ৩, ৫)'),
        ('Conoid tubercle কোথায়?', 'নিচের পৃষ্ঠে, পেছনের কিনারার কাছে, ভেতরের ২/৩ আর বাইরের ১/৩-এর জোড়ায়। (পৃ. ৪)'),
        ('Clavicle সাধারণত কোথায় ভাঙে, কেন?', 'দুই বাঁকের জোড়ায়, প্রসারিত হাতে পড়লে পরোক্ষ বলে। (পৃ. ৫)'),
        ('ভাঙলে সাধারণত compound হয় না কেন?', 'হাড় platysma-র নিচে, চামড়া এর উপর দিয়ে মুক্তভাবে সরে। (পৃ. ৩)'),
        ('ডান না বাম কীভাবে বুঝবেন?', 'বড় প্রান্ত ভেতরে, খাঁজ নিচে, ভেতরের অংশ সামনে উত্তল। (পৃ. ৫)'),
    ]))
    page(os.path.join(ROOT, 'clavicle', 'index.html'), 'ক্ল্যাভিকল 3D অ্যাটলাস', 'ক্ল্যাভিকল <span style="font-weight:500;opacity:.8">· Clavicle</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান ক্ল্যাভিকল, সাথে আসল স্টার্নাম, ১ম রিব, স্ক্যাপুলা আর মাসল। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'rel', 'joint', 'side', 'quiz'], ['ant', 'post', 'sup', 'inf', 'lat', 'med'], ['muscle', 'nerve', 'artery', 'vein', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-feat', 'ফিচার'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         credit=credit(REF + ', পৃ. ৩–৫।', MESHNOTE + ' Subclavian artery আর vein স্ক্যান থেকে।'))


def scapula():
    s = sec('s-gen', """  <h2>স্ক্যাপুলা: সাধারণ কথা</h2>
  <ul>
   <li>Shoulder girdle-এর চ্যাপ্টা, ত্রিভুজ আকারের হাড়; বুকের পেছনে-বাইরে ২য়–৭ম রিবের উপর।</li>
   <li><b>দুই পৃষ্ঠ:</b> costal (সামনে) আর dorsal (পেছনে)।</li>
   <li><b>তিন বর্ডার:</b> lateral, medial, superior। <b>তিন অ্যাঙ্গেল:</b> lateral, inferior, superior। <b>তিন প্রসেস:</b> spine, acromion, coracoid।</li>
   <li><b>Neck:</b> anatomical (glenoid-এর পরের সরু অংশ) আর surgical (suprascapular notch থেকে infraglenoid tubercle; পেছনে spinoglenoid notch দিয়ে)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৫–৬</p>""", """  <h2>শরীরে যেভাবে রাখবেন (ডান না বাম)</h2>
  <ul>
   <li>যে পাশের scapula, সেই হাতে ধরুন।</li>
   <li>Costal পৃষ্ঠ সামনে-ভেতরে, glenoid বাইরে একটু সামনে-উপরে।</li>
   <li>Coracoid-এর ডগা প্রায় সোজা সামনে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৯</p>""")
    s += sec('s-feat', """  <h2>পৃষ্ঠ ও বর্ডার</h2>
  <ul>
   <li><b>Costal পৃষ্ঠ:</b> অগভীর subscapular fossa; medial কিনারায় serratus anterior-এর ফালি (উপরে-নিচে ত্রিকোণ এলাকা); বাকিটায় subscapularis; oblique ridge-এ এর tendon; lateral border-এর কাছে লম্বা ridge।</li>
   <li><b>Dorsal পৃষ্ঠ:</b> spine দিয়ে ছোট supraspinous আর বড় infraspinous fossa; spinoglenoid notch দিয়ে দুটো যুক্ত।</li>
   <li><b>Lateral border:</b> শুধু origin (subscapularis, teres minor, teres major); infraglenoid tubercle-এ triceps-এর long head।</li>
   <li><b>Medial border:</b> শুধু insertion (serratus anterior, levator scapulae, rhomboid minor ও major); পাশে dorsal scapular nerve ও transverse cervical artery-র শাখা।</li>
   <li><b>Superior border:</b> suprascapular notch; omohyoid-এর inferior belly; transverse scapular ligament।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৬–৮</p>""", """  <h2>প্রসেস ও অ্যাঙ্গেল</h2>
  <ul>
   <li><b>Lateral angle:</b> glenoid cavity; labrum কিনারা গভীর করে; সামনের কিনারায় subscapularis tendon-এর খাঁজ।</li>
   <li><b>Spine:</b> apex T3-এর লেভেলে; crest-এর উপরের ঠোঁটে trapezius, নিচের ঠোঁটে deltoid; deltoid tubercle-এ trapezius-এর নিচের তন্তু।</li>
   <li><b>Acromion:</b> lateral border-এ deltoid (৪টা tubercle, multipennate); ডগায় coraco-acromial ligament; medial border-এ clavicular facet; নিচে subacromial bursa আর supraspinatus tendon।</li>
   <li><b>Coraco-acromial arch:</b> acromion + coraco-acromial ligament + coracoid: shoulder-এর ছাউনি।</li>
   <li><b>Coracoid:</b> উপরে pectoralis minor; ডগায় coracobrachialis ও biceps short head; ligament: conoid, trapezoid, coraco-acromial, coraco-humeral।</li>
   <li><b>Inferior angle:</b> ৭ম রিবের উপর; হাত তুললে সরে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৭–৯</p>""")
    s += sec('s-att', """  <h2>মাসলের অ্যাটাচমেন্ট</h2>
  """ + ATT_TABLE, """  <h2>Morphology ও বিশেষ কথা</h2>
  <ul>
   <li>Scapula যৌগিক হাড়: dorsal element (body) + ventral element (coracoid ও precoracoid)। Body = ilium, coracoid (glenoid-এর উপরের ১/৩-সহ) = ischium, precoracoid = pubis।</li>
   <li>Ventral element-এর মাসল brachial plexus-এর ventral division থেকে, body-র মাসল dorsal division থেকে নার্ভ পায়; ব্যতিক্রম trapezius, levator scapulae, omohyoid (ধড় থেকে সরে আসা মাসল)।</li>
   <li><b>Scapular anastomosis:</b> suprascapular, circumflex scapular আর transverse cervical-এর শাখা: subclavian-এর ১ম অংশ আর axillary-র ৩য় অংশের মধ্যে বিকল্প পথ।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৭, ৯</p>""")
    s += sec('s-oss', """  <h2>অসিফিকেশন</h2>
  <ul>
   <li>মোট ৮টা কেন্দ্র: ১টা primary, ৭টা secondary।</li>
   <li><b>Primary:</b> body (glenoid-এর নিচের ২/৩-সহ), cartilage-এ, গর্ভের ৮ম সপ্তাহে।</li>
   <li><b>Coracoid:</b> ১ম বছরে; subcoracoid (glenoid-এর উপরের ১/৩-সহ) puberty-তে; দুটো ১৫ বছরে body-র সাথে মেশে।</li>
   <li><b>Puberty-তে:</b> acromion-এ ২টা, medial border-এ ১টা, inferior angle-এ ১টা, glenoid-এর নিচের কিনারায় ১টা; প্রায় ২০ বছরে মেশে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৯</p>""", """  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li>Blade ভাঙলে রক্ত infraspinatus fascia-র নিচে আটকে হাড়ের কিনারা পর্যন্ত ফোলা তৈরি করে।</li>
   <li>Acromion স্থানচ্যুত হলে ক্ল্যাভিকলের নিচে চলে যায়।</li>
  </ul>
  <p class="ref">Datta, পৃ. ৪, ৭</p>""")
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Scapula-র কয়টা ossification centre?', '৮টা: ১ primary, ৭ secondary। (পৃ. ৯)'),
        ('Suprascapular notch দিয়ে কী যায়?', 'Transverse scapular ligament-এর নিচ দিয়ে suprascapular nerve; vessels উপর দিয়ে। (পৃ. ৭)'),
        ('Spinoglenoid notch-এর গুরুত্ব?', 'দুই fossa যুক্ত করে; suprascapular nerve ও vessels যায়। (পৃ. ৭)'),
        ('কোন border-এ শুধু origin, কোনটায় শুধু insertion?', 'Lateral border origin-এ, medial border insertion-এ ভরা। (পৃ. ৭)'),
        ('Coraco-acromial arch কী দিয়ে তৈরি?', 'Acromion-এর নিচের পৃষ্ঠ, coraco-acromial ligament, coracoid-এর আড়াআড়ি অংশ। (পৃ. ৮)'),
        ('Spine-এর apex কোন লেভেলে?', 'T3-এর spine। (পৃ. ৮)'),
        ('Scapula-র কোন অংশ ilium, ischium, pubis-এর সমতুল্য?', 'Body = ilium, coracoid = ischium, precoracoid = pubis। (পৃ. ৯)'),
    ]))
    page(os.path.join(ROOT, 'scapula', 'index.html'), 'স্ক্যাপুলা 3D অ্যাটলাস', 'স্ক্যাপুলা <span style="font-weight:500;opacity:.8">· Scapula</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান স্ক্যাপুলা, সাথে আসল হিউমেরাস, ক্ল্যাভিকল, রিব আর ১৭টা মাসল। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'rel', 'joint', 'side', 'quiz'], ['post', 'ant', 'lat', 'med', 'sup', 'inf'], ['muscle', 'nerve', 'artery', 'organ', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-feat', 'ফিচার'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-oss', 'অসিফিকেশন'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         credit=credit(REF + ', পৃ. ৫–৯।', MESHNOTE))


FOREARM_GEN = """  <h2>Forearm-এর দুই হাড়</h2>
  <ul>
   <li>Radius বাইরে, ulna ভেতরে; শক্ত interosseous membrane দিয়ে জোড়া।</li>
   <li>Ulna উপরে বড়, নিচে সরু; radius উপরে সরু, নিচে চওড়া।</li>
   <li>Elbow-এ ulna বেশি অংশ নেয়; wrist-এ শুধু radius (articular disc-এর সাহায্যে)।</li>
   <li>Radius = tibia, ulna = fibula (post-axial)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৪, ১৬</p>"""
FOREARM_OSS = """  <h2>অসিফিকেশন</h2>
  <ul>
   <li><b>Radius:</b> শ্যাফট গর্ভের ৮ম সপ্তাহে; নিচের প্রান্ত ১ বছরে (মেশে ২০ বছরে); head ৫ বছরে (মেশে ১৮ বছরে)। Growing end: নিচের প্রান্ত।</li>
   <li><b>Ulna:</b> শ্যাফট গর্ভের ৮ম সপ্তাহে; নিচের প্রান্ত ৫ বছরে (মেশে ১৮ বছরে); olecranon-এর উপরের আঁশের মতো traction epiphysis ১০ বছরে (মেশে ১৫–১৬ বছরে)। Growing end: নিচের প্রান্ত।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৮</p>"""
FOREARM_CLIN = """  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li><b>Colles' fracture:</b> প্রসারিত হাতে পড়লে radius-এর নিচের প্রান্তের প্রায় ২ সেমি উপরে; নিচের টুকরো উপরে-পেছনে-বাইরে সরে "dinner fork" বিকৃতি।</li>
   <li><b>Pulled elbow:</b> ছোট বাচ্চার (৬ বছরের নিচে) semi-prone হাতে হঠাৎ টানলে radius-এর head annular ligament থেকে আংশিক বেরিয়ে যায় (head আর neck প্রায় সমান মাপের); জোরে supination করলে ঠিক হয়।</li>
   <li>দুই হাড়ই ভাঙলে খেয়াল: দুই হাড় যেন জোড়া না লাগে, নইলে pronation-supination যায়।</li>
   <li>Olecranon আর দুই epicondyle-এর স্বাভাবিক সম্পর্ক বদলালে কনুই স্থানচ্যুত।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৯</p>"""


def radius():
    s = sec('s-gen', FOREARM_GEN, """  <h2>শরীরে যেভাবে রাখবেন (ডান না বাম)</h2>
  <ul>
   <li>চাকতির মতো head উপরে।</li>
   <li>শ্যাফটের হালকা অবতলতা সামনে।</li>
   <li>Styloid process বাইরের দিকে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৬</p>""")
    s += sec('s-feat', """  <h2>উপরের প্রান্ত ও শ্যাফট</h2>
  <ul>
   <li><b>Head:</b> উপরের অবতল পৃষ্ঠ capitulum-এ (সোজায় নিচে, ভাঁজে সামনে ছোঁয়); কিনারা radial notch আর annular ligament-এ।</li>
   <li><b>Neck:</b> annular ligament-এর নিচের অংশে ঘেরা; quadrate ligament।</li>
   <li><b>Radial tuberosity:</b> পেছনে biceps, সামনে bursa।</li>
   <li><b>Borders:</b> anterior (উপরে তির্যক: FDS; নিচে উঁচু রেখা: extensor retinaculum), posterior, interosseous (membrane)।</li>
   <li><b>Surfaces:</b> anterior (FPL, PQ, nutrient foramen কনুইয়ের দিকে), posterior (APL, EPB), lateral (supinator, PT; নিচে ECRL ও ECRB-এর tendon)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৪–১৬</p>""", """  <h2>নিচের প্রান্ত</h2>
  <ul>
   <li><b>Lateral:</b> styloid; উপরে brachioradialis; APL আর EPB-এর tendon তির্যকভাবে পার হয়।</li>
   <li><b>Medial:</b> ulnar notch (inferior radio-ulnar); নিচের কিনারায় articular disc-এর গোড়া।</li>
   <li><b>Anterior:</b> মোটা উঁচু রেখা; palmar radio-carpal ligament; radial pulse।</li>
   <li><b>Posterior:</b> Lister-এর tubercle আর তিন খাঁজ: বাইরে ECRL/ECRB, ঠিক ভেতরে EPL, আরও ভেতরে ED, EI ও posterior interosseous nerve; সব extensor retinaculum-এর নিচে।</li>
   <li><b>Inferior:</b> scaphoid (বাইরের ত্রিকোণ) আর lunate (ভেতরের চতুর্ভুজ): wrist joint।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৬</p>""")
    s += sec('s-att', '  <h2>মাসলের অ্যাটাচমেন্ট</h2>\n  ' + ATT_TABLE, FOREARM_OSS)
    s += sec('s-clin', FOREARM_CLIN)
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Radius কোন কোন জোড়ায় অংশ নেয়?', 'Elbow (humero-radial), superior ও inferior radio-ulnar, wrist। (পৃ. ১৪–১৬)'),
        ('Lister-এর tubercle-এর গুরুত্ব?', 'EPL এটাকে কপিকল হিসেবে ব্যবহার করে বুড়ো আঙুলে যায়। (পৃ. ১৬)'),
        ('Colles\' fracture কী?', 'নিচের প্রান্তের ২ সেমি উপরে; নিচের টুকরো উপরে-পেছনে-বাইরে: dinner fork। (পৃ. ১৯)'),
        ('Posterior interosseous nerve কোথায় হাড় ছোঁয়?', 'Supinator-এর দুই স্তরের মাঝে, radius-এর উপরের অংশে। (পৃ. ১৬)'),
        ('Radius-এর growing end কোনটা?', 'নিচের প্রান্ত। (পৃ. ১৮)'),
        ('Pulled elbow কেন ছোটদের হয়?', '৬ বছরের নিচে head আর neck প্রায় সমান মাপের। (পৃ. ১৯)'),
    ]))
    page(os.path.join(ROOT, 'radius', 'index.html'), 'রেডিয়াস 3D অ্যাটলাস', 'রেডিয়াস <span style="font-weight:500;opacity:.8">· Radius</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান রেডিয়াস, সাথে আসল আলনা, হিউমেরাস, কার্পাল হাড় আর মাসল। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'rel', 'joint', 'side', 'quiz'], ['ant', 'post', 'lat', 'med', 'sup', 'inf'], ['muscle', 'nerve', 'artery', 'organ', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-feat', 'ফিচার'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-clin', 'ক্লিনিক্যাল'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         credit=credit(REF + ', পৃ. ১৪–১৬, ১৮–১৯।', MESHNOTE))


def ulna():
    s = sec('s-gen', FOREARM_GEN, """  <h2>শরীরে যেভাবে রাখবেন (ডান না বাম)</h2>
  <ul>
   <li>Olecranon উপরে।</li>
   <li>Trochlear notch সামনে।</li>
   <li>ধারালো interosseous border বাইরের দিকে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৮</p>""")
    s += sec('s-feat', """  <h2>উপরের প্রান্ত</h2>
  <ul>
   <li><b>Olecranon:</b> উপরের পৃষ্ঠে capsule আর triceps; ভেতরে capsule, ulnar collateral ligament-এর পেছন ও তির্যক অংশ, FCU-র slip, FDP-র সবচেয়ে উপরের origin; বাইরে capsule, radial collateral ligament, anconeus।</li>
   <li><b>Coronoid:</b> সামনে brachialis আর ulnar tuberosity; ভেতরের কিনারায় sublime tubercle, FDS, PT-এর ulnar head; বাইরে radial notch আর supinator crest।</li>
   <li><b>Trochlear notch:</b> খাড়া রেখায় তিন ভাগ; মাঝে সরু অ-জোড়া ফালি।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৬–১৭</p>""", """  <h2>শ্যাফট ও নিচের প্রান্ত</h2>
  <ul>
   <li>দুই বাঁক: পুরোটা পেছনে উত্তল; পাশ থেকে উপরে ভেতরে অবতল, নিচে বাইরে অবতল।</li>
   <li><b>Posterior border:</b> চামড়ার নিচে; deep fascia দিয়ে FDP, FCU, ECU।</li>
   <li><b>Interosseous border:</b> উপরে supinator crest-এ মেশে; membrane।</li>
   <li><b>Posterior পৃষ্ঠ:</b> তির্যক রেখার উপরে anconeus; নিচে বাইরের সরু অংশে APL, EPL, EI; ভেতরের চওড়া অংশ ECU ঢাকে।</li>
   <li><b>Head:</b> radius-এর ulnar notch আর articular disc; disc-এর ডগা head আর styloid-এর মাঝের গর্তে।</li>
   <li><b>Styloid:</b> wrist-এর ulnar collateral ligament; পেছনের খাঁজে ECU।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৭–১৮</p>""")
    s += sec('s-att', '  <h2>মাসলের অ্যাটাচমেন্ট</h2>\n  ' + ATT_TABLE, FOREARM_OSS)
    s += sec('s-clin', FOREARM_CLIN)
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Ulna wrist joint-এ যায় না কেন?', 'Articular disc ulna-র head-কে carpal হাড় থেকে আলাদা রাখে। (পৃ. ১৬, ১৮)'),
        ('Olecranon-এর epiphysis কেমন?', 'আঁশের মতো traction epiphysis; ১০ বছরে আসে, ১৫–১৬ বছরে মেশে। (পৃ. ১৮)'),
        ('Supinator crest কোথায়?', 'Radial notch-এর নিচের গর্তের পেছনের উঁচু কিনারা; supinator-এর deep অংশ। (পৃ. ১৭)'),
        ('Oblique cord কী?', 'Ulnar tuberosity থেকে radial tuberosity; FPL-এর অবশেষ। (পৃ. ১৭)'),
        ('কনুইয়ের তিন হাড়ের বিন্দু কীভাবে মেলে?', 'সোজা হাতে olecranon আর দুই epicondyle এক রেখায়; ভাঁজে সমদ্বিবাহু ত্রিভুজ। (পৃ. ১৭)'),
    ]))
    page(os.path.join(ROOT, 'ulna', 'index.html'), 'আলনা 3D অ্যাটলাস', 'আলনা <span style="font-weight:500;opacity:.8">· Ulna</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান আলনা, সাথে আসল রেডিয়াস, হিউমেরাস আর মাসল। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'rel', 'joint', 'side', 'quiz'], ['ant', 'post', 'lat', 'med', 'sup', 'inf'], ['muscle', 'nerve', 'artery', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-feat', 'ফিচার'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-clin', 'ক্লিনিক্যাল'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         credit=credit(REF + ', পৃ. ১৪, ১৬–১৯।', MESHNOTE))


def hand():
    s = sec('s-gen', """  <h2>হাতের কঙ্কাল</h2>
  <ul>
   <li><b>Carpal:</b> ৮টা ছোট হাড়, দুই সারিতে চারটা করে। উপরের সারি (বাইরে থেকে): scaphoid, lunate, triquetral, pisiform; নিচের সারি: trapezium, trapezoid, capitate, hamate।</li>
   <li><b>Metacarpal:</b> ৫টা ছোট long bone, বাইরে থেকে নম্বর; head, shaft, base।</li>
   <li><b>Phalanx:</b> ১৪টা; বুড়ো আঙুলে ২টা, বাকিগুলোতে ৩টা (proximal, middle, distal)।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৯, ২১, ২৪</p>""", """  <h2>Carpal-এর বিশেষত্ব</h2>
  <ul>
   <li>প্রতিটা প্রায় ঘনক, ছয় পৃষ্ঠ; palmar আর dorsal খসখসে, বাকিগুলো জোড়ার (triquetral আর pisiform বাদে)।</li>
   <li>Dorsal পৃষ্ঠ palmar-এর চেয়ে চওড়া, শুধু lunate-এ উল্টো।</li>
   <li>প্রান্তের হাড়ের বাইরের পৃষ্ঠ অ-জোড়া।</li>
   <li>Palmar দিকে অবতল: বাইরের স্তম্ভ scaphoid-এর tubercle আর trapezium-এর crest, ভেতরের স্তম্ভ pisiform আর hamate-এর hook; মাঝে retinaculum দিয়ে carpal tunnel।</li>
   <li>Scaphoid, lunate, triquetral মিলে wrist joint-এর উত্তল পৃষ্ঠ; দুই সারির মাঝে S-আকার midcarpal joint।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৯</p>""")
    s += sec('s-carp', """  <h2>একেকটা carpal</h2>
  <ul>
   <li><b>Scaphoid:</b> নৌকা; tubercle দিয়ে পাশ চেনা; ৫টা জোড়া।</li>
   <li><b>Lunate:</b> অর্ধচন্দ্র; চওড়া palmar পৃষ্ঠ; ৫টা জোড়া।</li>
   <li><b>Triquetral:</b> কীলক; pisiform-এর facet; ৩টা হাড় + disc।</li>
   <li><b>Pisiform:</b> মটর; একটাই facet; FCU-র sesamoid।</li>
   <li><b>Trapezium:</b> saddle পৃষ্ঠ, FCR-এর খাঁজ, crest; ৪টা জোড়া।</li>
   <li><b>Trapezoid:</b> বুট; ৪টা জোড়া।</li>
   <li><b>Capitate:</b> সবচেয়ে বড়; head আর neck; ৭টা জোড়া।</li>
   <li><b>Hamate:</b> hook; ৫টা জোড়া।</li>
  </ul>
  <p class="note">"কোনটা?" মোডে আসল carpal হাড় এলোমেলো ঘুরিয়ে দেখায়; চিনে বলুন।</p>
  <p class="ref">Datta, পৃ. ২০–২১</p>""", """  <h2>Ossification (carpal)</h2>
  <p>সব জন্মের পরে, ঘুরে ঘুরে (spiral):</p>
  <table class="cmp"><thead><tr><th>হাড়</th><th>বয়স</th></tr></thead><tbody>
   <tr><td>Capitate, hamate</td><td>১ বছর</td></tr><tr><td>Triquetral</td><td>৩ বছর</td></tr><tr><td>Lunate</td><td>৪ বছর</td></tr>
   <tr><td>Scaphoid</td><td>৫ বছর</td></tr><tr><td>Trapezium</td><td>৬ বছর</td></tr><tr><td>Trapezoid</td><td>৭ বছর</td></tr><tr><td>Pisiform</td><td>১২ বছর</td></tr>
  </tbody></table>
  <p class="ref">Datta, পৃ. ২০</p>""")
    s += sec('s-mc', """  <h2>Metacarpal</h2>
  <ul>
   <li>প্রত্যেকটার একটাই epiphysis, head-এ; শুধু ১ম-এর base-এ (phalanx-এর মতো)।</li>
   <li>Head knuckle তৈরি করে; shaft-এর পেছনে ত্রিকোণ চ্যাপ্টা জায়গা (১ম-এ নেই)।</li>
   <li><b>১ম:</b> ছোট, মোটা; trapezium-এর সাথে saddle জোড়া; সামনের তলে, ৯০° ঘোরানো।</li>
   <li><b>২য়:</b> সবচেয়ে লম্বা; খাঁজকাটা base, প্রায় নড়ে না।</li>
   <li><b>৩য়:</b> base-এ styloid process।</li>
   <li><b>৪র্থ:</b> চতুর্ভুজ base। <b>৫ম:</b> base-এ ভেতরে tubercle। ৪র্থ-৫ম hamate-এ, তাই বেশি নড়ে।</li>
   <li><b>Ossification:</b> shaft গর্ভের ৯ম সপ্তাহে; epiphysis প্রায় ২ বছরে; মেশে ১৬–১৮ বছরে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ২১–২৪</p>""", """  <h2>Phalanx</h2>
  <ul>
   <li>ছোট long bone; একটাই epiphysis, base-এ।</li>
   <li>Proximal phalanx-এর base অবতল (MCP joint); middle আর distal-এর base-এ রেখা দিয়ে দুই facet (IP joint)।</li>
   <li>Proximal আর middle-এর head কপিকল; distal-এর head-এ palmar দিকে ঘোড়ার খুর আকারের tuberosity।</li>
   <li>Proximal, middle, distal চেনা সহজ, কিন্তু ডান-বাম চেনা যায় না।</li>
  </ul>
  <p class="ref">Datta, পৃ. ২৪</p>""")
    s += sec('s-att', '  <h2>মাসলের অ্যাটাচমেন্ট</h2>\n  ' + ATT_TABLE, """  <h2>ক্লিনিক্যাল</h2>
  <ul>
   <li><b>Scaphoid fracture:</b> প্রসারিত হাতে পড়লে সরু কোমর ভাঙে; রক্ত আসে নিচের দিক থেকে, তাই উপরের টুকরো avascular necrosis।</li>
   <li><b>Lunate dislocation:</b> palmar দিকে সরে median nerve চাপে।</li>
  </ul>
  <p class="ref">Datta, পৃ. ১৯–২০</p>""")
    s += sec('s-viva', '<h2>ভাইভায় যা জিজ্ঞেস করে</h2>\n' + viva([
        ('Carpal tunnel দিয়ে কী যায়?', 'FDS, FDP, FPL-এর tendon আর median nerve; FCR retinaculum-এর স্তরের মাঝে। (পৃ. ১৯)'),
        ('কোন carpal সবার আগে আর কোনটা সবার শেষে ossify হয়?', 'Capitate আগে (১ বছর), pisiform শেষে (১২ বছর)। (পৃ. ২০)'),
        ('Capitate কয়টা হাড়ের সাথে জোড়া?', '৭টা। (পৃ. ২১)'),
        ('Scaphoid-এর পাশ কীভাবে চিনবেন?', 'Tubercle বাইরে-নিচে-সামনে। (পৃ. ২০)'),
        ('১ম metacarpal কেন পরিবর্তিত phalanx বলা হয়?', 'Epiphysis base-এ, phalanx-এর মতো। (পৃ. ২১)'),
        ('২য় metacarpal কেন নড়ে না?', 'খাঁজকাটা base trapezoid-এর রেখায় বসে, trapezium আর capitate-এর মাঝে আটকানো। (পৃ. ২১)'),
        ('Pisiform-কে sesamoid কেন বলা হয়?', 'FCU-র tendon-এর ভেতরে ossify হয়। (পৃ. ২০)'),
    ]))
    page(os.path.join(ROOT, 'hand', 'index.html'), 'হাতের হাড় 3D অ্যাটলাস', 'হাতের হাড় <span style="font-weight:500;opacity:.8">· Bones of the Hand</span>',
         'আসল মানুষের স্ক্যান থেকে নেওয়া ডান হাতের ২৭টা হাড়, সাথে আসল মাসল আর flexor retinaculum। Carpal চেনার প্র্যাকটিস "কোনটা?" মোডে। লেখা A.K. Datta অনুযায়ী।',
         ['parts', 'lm', 'att', 'tunnel', 'joint', 'which', 'side', 'quiz'], ['palm', 'dors', 'lat', 'med', 'sup', 'inf'], ['muscle', 'nerve', 'artery', 'organ', 'vert'],
         [('s-gen', 'সাধারণ'), ('s-carp', 'Carpal'), ('s-mc', 'Metacarpal ও phalanx'), ('s-att', 'অ্যাটাচমেন্ট'), ('s-viva', 'ভাইভা'), ('s-credit', 'সূত্র')], s,
         start='parts',
         credit=credit(REF + ', পৃ. ১৯–২৫।', MESHNOTE + ' Flexor retinaculum স্ক্যান থেকে।'))


if __name__ == '__main__':
    for n in sys.argv[1:] or ['humerus']:
        globals()[n]()
