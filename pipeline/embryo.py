"""ভ্রূণের ডেমো পেজ: Azkue (2021) Carnegie stage 18-এর বাইরের আকারের মডেল, হুবহু (কোনো পরিবর্তন ছাড়া)।

লাইসেন্স: CC BY-NC-ND 4.0। তাই মেশ decimate, রং বা কাটছাঁট করা হয় না; শুধু ওয়েবে দেখানোর ফরম্যাটে নেওয়া (CC 4.0-এর
§2(a)(4) অনুযায়ী অনুমোদিত technical পরিবর্তন)। মার্কগুলো মডেলের বাইরে আলাদা স্তরে।
STL ফাইল পাবলিক রিপোতে রাখা হয় না; EMB_SRC ফোল্ডারে রাখুন (ডিফল্ট ../../emb_src)।
ব্যবহার: python pipeline/embryo.py
"""
import os, sys, base64, json
import numpy as np
import trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import write_js, SCALE

SRC = os.environ.get('EMB_SRC', os.path.join(os.path.dirname(__file__), '..', '..', 'emb_src'))
OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'embryo', 'data')
# STL-এর অক্ষ (দেখে নির্ণয়): +x = ventral, +z = মাথার দিক, y = পাশ। ভিউয়ার: X = y, Y = z, Z = x (ঘূর্ণন, প্রতিবিম্ব নয়)
tf = lambda p: np.asarray(p)[..., [1, 2, 0]]

# ল্যান্ডমার্ক: পাশ (-y) থেকে দেখা ছবিতে (x, z) মিলিয়ে বেছে নেওয়া, তারপর সেই রেখায় মডেলের সবচেয়ে কাছের পৃষ্ঠে বসানো
PICK = {  # id: (x, z, দিক) দিক = কোন পাশ থেকে মার্ক দেখা যাবে
    'head': (25, 68, 'up'), 'forehead': (45, 45, 'side'), 'eye': (25, 18, 'side'), 'ear': (-8, 12, 'side'), 'jaw': (12, 4, 'side'),
    'neck': (-28, 20, 'side'), 'hand': (12, -10, 'side'), 'elbow': (-6, -8, 'side'), 'heartLiver': (17, -27, 'side'),
    'foot': (26, -45, 'side'), 'back': (-38, -20, 'back'), 'rump': (-15, -66, 'down'),
}


def build():
    m = trimesh.load(os.path.join(SRC, 'JOA-239-1438-s018.stl'))
    c = (m.bounds[0] + m.bounds[1]) / 2
    v = m.vertices - c
    f = m.faces
    vn = m.vertex_normals
    q = np.round(tf(v) / SCALE).astype(np.int16)
    mesh = dict(name='embryo', group='bone', key='embryo', i32=1,
                v=base64.b64encode(q.tobytes()).decode(), f=base64.b64encode(f.astype(np.uint32).tobytes()).decode())
    lm = []
    xz = cKDTree(v[:, [0, 2]])
    for k, (x, z, side) in PICK.items():
        if side == 'up':
            i = np.argmax(v[:, 2] - 0.02 * np.abs(v[:, 0] - x))
        elif side == 'down':
            i = np.argmin(v[:, 2] + 0.3 * np.abs(v[:, 0] - x))
        elif side == 'back':
            band = np.where(np.abs(v[:, 2] - z) < 2)[0]
            i = band[np.argmin(v[band, 0])]
        else:
            ids = xz.query_ball_point([x, z], 2.5)
            ids = np.array(ids)
            i = ids[np.argmin(v[ids, 1])]          # -y পাশের পৃষ্ঠ
        lm.append(dict(id=k, p=tf(v[i]).round(2).tolist(), n=tf(vn[i]).round(3).tolist()))
    ext = (m.bounds[1] - m.bounds[0])
    meta = dict(faces=int(len(f)), verts=int(len(v)), gl_units=round(float(ext.max()), 1))
    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', dict(scale=SCALE, meshes=[mesh], lm=lm, meta=meta))
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', dict(meshes=[], tubes=[], spheres=[], anchors={}))
    print(meta)


if __name__ == '__main__':
    build()
