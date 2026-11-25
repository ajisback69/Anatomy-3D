"""Upper/lower limb-এর হাড়ের পেজের কাঠামো (index.html)। লেখা আসে প্রতিটা হাড়ের নিজের স্ক্রিপ্ট থেকে।"""
HEAD = '''<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../viewer/viewer.css">
<style>
.ref{{font-size:13px;color:var(--mute);margin-top:6px}}
table.cmp{{width:100%;border-collapse:collapse;margin:10px 0 4px;font-size:15px}}
table.cmp th,table.cmp td{{text-align:left;padding:8px 10px;border-bottom:1px solid rgba(0,0,0,.1);vertical-align:top}}
table.cmp th{{font-size:13px;color:var(--mute);font-weight:600}}
.spec{{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}}
.spec a{{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid rgba(255,255,255,.3);color:#eef5f2;text-decoration:none;font-weight:600}}
.spec a[aria-pressed=true]{{background:var(--acc);border-color:var(--acc);color:#fff}}
</style>
{loader}
<script type="importmap">{{"imports":{{"three":"https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"}}}}</script>
</head>
<body>
<section class="band stage">
 <div class="wrap">
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
  {specnav}
  <div class="grid">
   <div>
    <div class="view" id="view"><div class="load" id="load">মডেল লোড হচ্ছে…</div><div id="pins"></div><div class="hint">এক আঙুলে ঘোরান · দুই আঙুলে জুম/সরান</div></div>
    <div class="bar" role="group" aria-label="মোড">
{modes}
    </div>
    <div class="bar" role="group" aria-label="দৃশ্য">
{views}
    </div>
    <div class="layers" role="group" aria-label="লেয়ার"><span class="lt">লেয়ার:</span>
{layers}
    </div>
   </div>
   <div class="side">
    <div class="info" id="info" aria-live="polite"></div>
    <div id="legend"></div>
   </div>
  </div>
 </div>
</section>
<nav class="nav" aria-label="বিভাগ"><div class="scroll">
{nav}
</div></nav>
{sections}
{tail}
<script src="content.js"></script>
<script type="module" src="../../viewer/viewer.js"></script>
</body>
</html>
'''
MODE_NAMES = {'parts': 'অংশ', 'lm': 'ল্যান্ডমার্ক', 'att': 'মাসল', 'rel': 'নার্ভ ও নালী', 'joint': 'জয়েন্ট', 'side': 'ডান না বাম', 'which': 'কোনটা?', 'quiz': 'কুইজ', 'tunnel': 'কার্পাল টানেল'}
VIEW_NAMES = {'ant': 'সামনে', 'post': 'পেছনে', 'lat': 'বাইরে থেকে', 'med': 'ভেতর থেকে', 'sup': 'উপর থেকে', 'inf': 'নিচ থেকে', 'palm': 'হাতের তালু', 'dors': 'হাতের পিঠ'}
LAYER_ROWS = {'muscle': ('#d1495b', 'মাসল'), 'vert': ('#d9d0bd', 'পাশের হাড়'), 'nerve': ('#f2c230', 'নার্ভ (স্কিম্যাটিক)'),
              'artery': ('#e0443e', 'ধমনী'), 'vein': ('#4a78e0', 'শিরা'), 'organ': ('#cfd6dc', 'লিগামেন্ট ও অন্যান্য')}


def page(path, title, h1, lead, modes, views, layers, nav, sections, start='lm', loader='<script src="data/core.js"></script>', specnav='', credit=''):
    m = '\n'.join(f'     <button class="btn" data-mode="{k}" aria-pressed="{str(k == start).lower()}">{MODE_NAMES[k]}</button>' for k in modes)
    vw = '\n'.join(f'     <button class="btn" data-view="{k}">{VIEW_NAMES[k]}</button>' for k in views)
    ly = '\n'.join(f'     <label class="tog"><input type="checkbox" data-layer="{k}"><i class="dot" style="background:{LAYER_ROWS[k][0]}"></i>{LAYER_ROWS[k][1]}</label>' for k in layers)
    nv = ''.join(f'<a href="#{a}">{b}</a>' for a, b in nav)
    tail = '<script>document.querySelectorAll(\'[data-only]\').forEach(function(e){if(e.dataset.only.split(\' \').indexOf(window.SPEC)<0)e.remove()})</script>' if 'SPEC' in loader else ''
    html = HEAD.format(title=title, h1=h1, lead=lead, modes=m, views=vw, layers=ly, nav=nv, sections=sections + credit, loader=loader, specnav=specnav, tail=tail)
    open(path, 'w').write(html)


def sec(id_, left, right=None):
    if right is None:
        return f'<section class="band sec" id="{id_}"><div class="wrap">\n{left}\n</div></section>\n'
    return f'<section class="band sec" id="{id_}"><div class="wrap two">\n <div>\n{left}\n </div>\n <div>\n{right}\n </div>\n</div></section>\n'


def viva(qs):
    return '\n'.join(f' <details><summary>{q}</summary><p>{a}</p></details>' for q, a in qs)


def credit(ref, extra):
    return f'''<section class="band" id="s-credit"><div class="wrap">
 <h2>সূত্র ও লাইসেন্স</h2>
 <p><b>লেখার রেফারেন্স:</b> {ref}</p>
 <p><b>3D মেশ:</b> BodyParts3D, © The Database Center for Life Science, licensed under <a href="https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en">CC BY-SA 2.1 Japan</a>। একজন প্রাপ্তবয়স্ক পুরুষের MRI থেকে তৈরি। {extra}</p>
 <p class="note">এটি একটি খসড়া। ছাত্রদের দেওয়ার আগে অ্যানাটমি বিভাগের একজন শিক্ষককে দিয়ে রিভিউ করিয়ে নিন।</p>
</div></section>
'''
