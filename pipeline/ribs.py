"""রিবের ডেটা বানায়: bones/ribs/data/{first,typical}-{core,layers}.js

দুটো স্পেসিমেন: 1st rib (ডান) আর typical rib (ডান 6th)। সাথে বাম পাশেরটাও থাকে,
যাতে "ডান না বাম" ট্রেনারে আসল বাম রিব দেখানো যায়।

চালানো: python pipeline/ribs.py   (আগে: bash pipeline/fetch_meshes.sh pipeline/ids_ribs.txt)

যা মাপা হয়:
  - রিবের মধ্যরেখা (centerline): হাড়কে বৃত্তের মতো ধরে কোণ দিয়ে মাথা থেকে সামনের প্রান্ত পর্যন্ত
  - head facet: কশেরুকার body যেখানে ছোঁয়; tubercle facet: transverse process যেখানে ছোঁয়
  - anterior end: costal cartilage যেখানে ছোঁয়
  - angle (typical): iliocostalis যেখানে লাগে
  - 1st rib: scalene tubercle = scalenus anterior-এর ছোঁয়া; subclavian artery/vein-এর groove = ভেসেলের ছোঁয়া
  - মাসল অ্যাটাচমেন্ট: আসল মাসল হাড়ের ২.৫ মিমি-র মধ্যে
"""
import os, sys
import numpy as np
import trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, SCALE

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'ribs', 'data')

SPECS = {
 'first': dict(kind='first',
    R='FMA7857', L='FMA7987', faces=9000, cart='FMA7875',
    head_v=['FMA9165'], tp_v='FMA9165',
    # রিজিয়ন নম্বর -> মাসল (content.js-এর REG-এর সাথে মেলে)
    muscles={1: ['FMA13392'], 2: ['FMA13390'], 3: ['FMA13398'], 4: ['FMA13412'], 5: ['FMA9756'],
             6: ['FMA74075', 'FMA74077'], 7: ['FMA22742']},
    vessels={11: 'FMA3953', 12: 'FMA4755'},   # 11 = subclavian artery-র groove, 12 = vein-এর groove
    context=[('rib2', 'rib', 'FMA7882', 1500), ('cc1', 'cart', 'FMA7875', 800), ('cc2', 'cart', 'FMA7886', 600),
             ('manubrium', 'rib', 'FMA7486', 2500), ('clav', 'clav', 'FMA13322', 2200)],
    vert=[('T1', 'FMA9165'), ('T2', 'FMA9187')], disc=[],
    layer_meshes=[('scalAnt', 'muscle', ['FMA13392'], 2500), ('scalMed', 'muscle', ['FMA13390'], 2500), ('scalPost', 'muscle', ['FMA13388'], 2000),
                  ('serrAnt', 'muscle', ['FMA13398'], 3500), ('subclavius', 'muscle', ['FMA13412'], 1500), ('extIC', 'muscle', ['FMA9756'], 3500),
                  ('lev', 'muscle', ['FMA74075', 'FMA74077'], 2000), ('iliocost', 'muscle', ['FMA22742'], 2500),
                  ('rsa', 'artery', ['FMA3953'], 1500), ('rscv', 'vein', ['FMA4755'], 1200), ('rcca', 'artery', ['FMA3941'], 1000),
                  ('bct', 'artery', ['FMA3932nsn'], 1000), ('rbcv', 'vein', ['FMA4751'], 1000),
                  ('lung', 'lung', ['FMA7333'], 5000)],
    crop=30),
 'typical': dict(kind='typical',
    R='FMA8175', L='FMA8202', faces=12000, cart='FMA8194',
    head_v=['FMA9922', 'FMA9945'], tp_v='FMA9945',
    muscles={1: ['FMA13398'], 2: ['FMA13336'], 3: ['FMA9756'], 4: ['FMA9757'], 5: ['FMA9758'],
             6: ['FMA22742', 'FMA22744'], 7: ['FMA22751'], 9: ['FMA74075', 'FMA74077']},
    vessels={},
    context=[('rib5', 'rib', 'FMA8066', 1800), ('rib7', 'rib', 'FMA8229', 1800), ('cc6', 'cart', 'FMA8194', 900),
             ('cc5', 'cart', 'FMA8070', 700), ('manubrium', 'rib', 'FMA7486', 1500), ('body', 'rib', 'FMA7487', 2500), ('xiphoid', 'rib', 'FMA7488', 500)],
    vert=[('T5', 'FMA9922'), ('T6', 'FMA9945'), ('T7', 'FMA9968')], disc=[('D5', 'FMA13502'), ('D6', 'FMA13503')],
    layer_meshes=[('serrAnt', 'muscle', ['FMA13398'], 4000), ('extObl', 'muscle', ['FMA13336'], 3500), ('extIC', 'muscle', ['FMA9756'], 4000),
                  ('intIC', 'muscle', ['FMA9757'], 4000), ('innIC', 'muscle', ['FMA9758'], 3500),
                  ('iliocost', 'muscle', ['FMA22742', 'FMA22744'], 3000), ('longThor', 'muscle', ['FMA22751'], 2500), ('lev', 'muscle', ['FMA74075', 'FMA74077'], 2000),
                  ('aoDesc', 'artery', ['FMA3784'], 2000), ('lung', 'lung', ['FMA7383', 'FMA7337'], 6000)],
    crop=22),
 'second': dict(kind='second',
    R='FMA7882', L='FMA8012', faces=10000, cart='FMA7886',
    head_v=['FMA9165', 'FMA9187'], tp_v='FMA9187',
    muscles={1: ['FMA13398'], 2: ['FMA13388'], 3: ['FMA13403'], 4: ['FMA9756'], 5: ['FMA9757'], 6: ['FMA9758'],
             7: ['FMA22742', 'FMA22744'], 9: ['FMA74075', 'FMA74077']},
    vessels={},
    context=[('rib1', 'rib', 'FMA7857', 1500), ('rib3', 'rib', 'FMA7909', 1500), ('cc2', 'cart', 'FMA7886', 600), ('cc1', 'cart', 'FMA7875', 500),
             ('manubrium', 'rib', 'FMA7486', 2000), ('body', 'rib', 'FMA7487', 2000)],
    vert=[('T1', 'FMA9165'), ('T2', 'FMA9187'), ('T3', 'FMA9209')], disc=[('D1', 'FMA10458'), ('D2', 'FMA13495')],
    layer_meshes=[('serrAnt', 'muscle', ['FMA13398'], 3500), ('scalPost', 'muscle', ['FMA13388'], 2000), ('sps', 'muscle', ['FMA13403'], 2000),
                  ('extIC', 'muscle', ['FMA9756'], 3000), ('intIC', 'muscle', ['FMA9757'], 3000), ('innIC', 'muscle', ['FMA9758'], 2500),
                  ('iliocost', 'muscle', ['FMA22742', 'FMA22744'], 2000), ('lev', 'muscle', ['FMA74075', 'FMA74077'], 1500),
                  ('lung', 'lung', ['FMA7333'], 5000)],
    crop=25),
 'tenth': dict(kind='tenth',
    R='FMA8445', L='FMA8472', faces=11000, cart='BP28',
    head_v=['FMA10037'], tp_v='FMA10037',
    muscles={1: ['FMA13405'], 2: ['FMA13358'], 3: ['FMA13336'], 4: ['FMA13892'], 5: ['FMA22344'], 6: ['FMA13295'],
             7: ['FMA22742', 'FMA22740'], 9: ['FMA74075', 'FMA74077'], 10: ['FMA22751'], 11: ['FMA9756'], 12: ['FMA9757'], 13: ['FMA9758']},
    vessels={},
    context=[('rib9', 'rib', 'FMA8364', 1800), ('rib11', 'rib', 'FMA8531', 1500), ('cc', 'cart', 'BP28', 3000)],
    vert=[('T9', 'FMA10014'), ('T10', 'FMA10037'), ('T11', 'FMA10059')], disc=[('D9', 'FMA13506'), ('D10', 'FMA13507')],
    layer_meshes=[('serrPostInf', 'muscle', ['FMA13405'], 2000), ('lat', 'muscle', ['FMA13358'], 3000), ('extObl', 'muscle', ['FMA13336'], 3500),
                  ('intObl', 'muscle', ['FMA13892'], 2500), ('transAbd', 'muscle', ['FMA22344'], 2500), ('dia', 'muscle', ['FMA13295'], 4000),
                  ('iliocost', 'muscle', ['FMA22742', 'FMA22740'], 2500), ('lev', 'muscle', ['FMA74075', 'FMA74077'], 1500), ('longThor', 'muscle', ['FMA22751'], 2000),
                  ('extIC', 'muscle', ['FMA9756'], 3000), ('intIC', 'muscle', ['FMA9757'], 3000), ('innIC', 'muscle', ['FMA9758'], 2500),
                  ('aoDesc', 'artery', ['FMA3784'], 2000), ('lung', 'lung', ['FMA7337'], 5000)],
    crop=22),
 'eleventh': dict(kind='eleventh', tub=False,
    R='FMA8531', L='FMA8532', faces=9000, cart=None,
    head_v=['FMA10059'], tp_v='FMA10059',
    muscles={1: ['FMA13405'], 2: ['FMA13358'], 3: ['FMA13336'], 4: ['FMA13892'], 5: ['FMA22344'], 6: ['FMA13295'],
             7: ['FMA22742', 'FMA22740'], 9: ['FMA74075', 'FMA74077'], 10: ['FMA22751'], 11: ['FMA9756'], 12: ['FMA9757'], 13: ['FMA9758']},
    vessels={},
    context=[('rib10', 'rib', 'FMA8445', 1800), ('rib12', 'rib', 'FMA8533', 1200)],
    vert=[('T10', 'FMA10037'), ('T11', 'FMA10059'), ('T12', 'FMA10081')], disc=[('D10', 'FMA13507'), ('D11', 'FMA13508')],
    layer_meshes=[('serrPostInf', 'muscle', ['FMA13405'], 2000), ('lat', 'muscle', ['FMA13358'], 3000), ('extObl', 'muscle', ['FMA13336'], 3000),
                  ('intObl', 'muscle', ['FMA13892'], 2500), ('transAbd', 'muscle', ['FMA22344'], 2500), ('dia', 'muscle', ['FMA13295'], 4000),
                  ('iliocost', 'muscle', ['FMA22742', 'FMA22740'], 2500), ('lev', 'muscle', ['FMA74075', 'FMA74077'], 1500), ('longThor', 'muscle', ['FMA22751'], 2000),
                  ('extIC', 'muscle', ['FMA9756'], 2500), ('intIC', 'muscle', ['FMA9757'], 2500), ('innIC', 'muscle', ['FMA9758'], 2000),
                  ('aoDesc', 'artery', ['FMA3784'], 2000), ('kidney', 'heart', ['FMA7204'], 4000)],
    crop=22),
 'twelfth': dict(kind='twelfth', tub=False,
    R='FMA8533', L='FMA8534', faces=8000, cart=None,
    head_v=['FMA10081'], tp_v='FMA10081',
    muscles={1: ['FMA22348'], 2: ['FMA13295'], 3: ['FMA22344'], 4: ['FMA13405'], 5: ['FMA13358'], 6: ['FMA13336'],
             7: ['FMA22742', 'FMA22740'], 9: ['FMA74075', 'FMA74077'], 10: ['FMA22751'], 11: ['FMA9756'], 12: ['FMA9757']},
    vessels={},
    context=[('rib11', 'rib', 'FMA8531', 1500), ('rib10', 'rib', 'FMA8445', 1500)],
    vert=[('T11', 'FMA10059'), ('T12', 'FMA10081'), ('L1', 'FMA13072')], disc=[('D11', 'FMA13508'), ('D12', 'FMA13509')],
    layer_meshes=[('QL', 'muscle', ['FMA22348'], 2500), ('dia', 'muscle', ['FMA13295'], 4000), ('transAbd', 'muscle', ['FMA22344'], 2500),
                  ('serrPostInf', 'muscle', ['FMA13405'], 2000), ('lat', 'muscle', ['FMA13358'], 2500), ('extObl', 'muscle', ['FMA13336'], 2500),
                  ('iliocost', 'muscle', ['FMA22742', 'FMA22740'], 2500), ('lev', 'muscle', ['FMA74075', 'FMA74077'], 1500), ('longThor', 'muscle', ['FMA22751'], 2000),
                  ('extIC', 'muscle', ['FMA9756'], 2000), ('intIC', 'muscle', ['FMA9757'], 2000),
                  ('aoDesc', 'artery', ['FMA3784'], 2000), ('kidney', 'heart', ['FMA7204'], 4000)],
    crop=25),
}
ARTICULAR = 8


def crop(mesh, tree, maxd):
    """বড় মাসলের (যেমন পুরো বুকের intercostal) শুধু রিবের maxd মিমি-র মধ্যের অংশ রাখে।"""
    v = mesh.vertices; inside = tree.query(v)[0] < maxd
    keep = inside[mesh.faces].all(1)
    if keep.sum() < 20: return None
    m = trimesh.Trimesh(v, mesh.faces[keep], process=False); m.remove_unreferenced_vertices(); return m


def centerline(v, head_p, ant_p, nb=72):
    """রিবকে একটা সমতলে ফেলে বৃত্ত ফিট করে, মাথা (t=0) থেকে সামনের প্রান্ত (t=1) পর্যন্ত t বের করে।"""
    c0 = v.mean(0); U, S, Vt = np.linalg.svd(v - c0, full_matrices=False)
    e1, e2, n = Vt[0], Vt[1], Vt[2]
    if n[2] < 0: n = -n
    P = np.stack([(v - c0) @ e1, (v - c0) @ e2], 1)
    A = np.c_[2 * P, np.ones(len(P))]; b = (P ** 2).sum(1); cx, cy, _ = np.linalg.lstsq(A, b, rcond=None)[0]
    ang = lambda p: np.arctan2(p[..., 1] - cy, p[..., 0] - cx)
    th = ang(P); hp = ang(np.array([(head_p - c0) @ e1, (head_p - c0) @ e2])); ap = ang(np.array([(ant_p - c0) @ e1, (ant_p - c0) @ e2]))
    # মাথা থেকে সামনের প্রান্তে কোন দিকে ঘুরলে হাড়ের বেশিরভাগ অংশ পড়ে, সেই দিক বেছে নেয়
    best = None
    for sgn in (1, -1):
        sp = ((ap - hp) * sgn) % (2 * np.pi)
        tt = (((th - hp) * sgn) % (2 * np.pi)) / sp
        tt = np.where(tt > 1 + (2 * np.pi / sp - 1) / 2, tt - 2 * np.pi / sp, tt)  # মাথার পেছনের সামান্য অংশ
        score = ((tt > -0.05) & (tt < 1.05)).mean() - 0.3 * (sp > 1.9 * np.pi)
        if best is None or score > best[0]: best = (score, tt)
    t = np.clip(best[1], 0, 1)
    edges = np.linspace(0, 1, nb + 1); C = []
    for i in range(nb):
        s = (t >= edges[i]) & (t <= edges[i + 1]); C.append(v[s].mean(0) if s.any() else np.full(3, np.nan))
    C = np.array(C); ok = ~np.isnan(C[:, 0]); tc = (edges[:-1] + edges[1:]) / 2
    C = np.stack([np.interp(tc, tc[ok], C[ok, k]) for k in range(3)], 1)
    centre3 = c0 + cx * e1 + cy * e2
    return t, C, tc, n, centre3


def cluster2(P):
    """যোগাযোগের বিন্দুগুলোকে দুই দলে ভাগ করে (যেমন head বনাম tubercle)।"""
    a, b = P[np.argmin(P[:, 0] ** 2)], P[np.argmax(((P - P[np.argmin(P[:, 0] ** 2)]) ** 2).sum(1))]
    for _ in range(20):
        lab = ((P - a) ** 2).sum(1) > ((P - b) ** 2).sum(1); a, b = P[~lab].mean(0), P[lab].mean(0)
    return P[~lab], P[lab]


def build(name, S):
    rib = load(S['R']); ribL = load(S['L'])
    rv, rn = rib.vertices, rib.vertex_normals
    F = Frame(rv.mean(0)); T = cKDTree(rv)
    def contact(fma_or_mesh, thr=2.0):
        m = load(fma_or_mesh) if isinstance(fma_or_mesh, str) else fma_or_mesh
        d, _ = cKDTree(m.vertices).query(rv); return rv[d < thr], d
    # ---- joints ----
    head_pts = np.vstack([contact(f)[0] for f in S['head_v'][:-1]] + [np.empty((0, 3))]) if len(S['head_v']) > 1 else np.empty((0, 3))
    kind = S.get('kind', name); has_tub = S.get('tub', True)
    own, _ = contact(S['tp_v'])
    if has_tub:
        g1, g2 = cluster2(own)
        # head cluster = যেটা মধ্যরেখার কাছে (|x| ছোট)
        if np.abs(g1[:, 0]).mean() > np.abs(g2[:, 0]).mean(): g1, g2 = g2, g1
        head_own, tub = g1, g2
    else:  # 11th, 12th: neck আর tubercle নেই, কশেরুকার সাথে শুধু head-এর জোড়া
        med = own[np.argmin(np.abs(own[:, 0]))]          # সবচেয়ে ভেতরের ছোঁয়া = head
        head_own, tub = own[np.linalg.norm(own - med, axis=1) < 15], None
    head_all = np.vstack([head_own, head_pts]) if len(head_pts) else head_own
    hc = head_all.mean(0); dfar = np.linalg.norm(rv - hc, axis=1)
    if S['cart']:
        ant, _ = contact(S['cart'])
        ant = ant[np.linalg.norm(ant - hc, axis=1) > 0.75 * dfar.max()]  # শুধু সামনের প্রান্তের ছোঁয়া
    else:   # cartilage মেশ নেই: সবচেয়ে দূরের সরু ডগাই সামনের প্রান্ত
        ant = rv[dfar > np.percentile(dfar, 98.5)]
    t, C, tc, N, centre = centerline(rv, hc, ant.mean(0))
    tOf = lambda P: t[T.query(P)[1]]
    th1 = tOf(head_all).max(); ta0 = np.percentile(tOf(ant), 5)
    tt0, tt1 = np.percentile(tOf(tub), [0, 100]) if has_tub else (th1, th1)
    # local frame per vertex
    ci = np.clip(np.searchsorted(tc, t), 0, len(tc) - 1)
    tang = np.gradient(C, axis=0); tang /= np.linalg.norm(tang, axis=1)[:, None]
    Rad = np.cross(tang, N); Rad /= np.linalg.norm(Rad, axis=1)[:, None]
    # outward = দূরে বৃত্তের কেন্দ্র থেকে
    flip = np.einsum('ij,ij->i', Rad, C - centre) < 0; Rad[flip] *= -1
    off = rv - C[ci]; a = np.einsum('ij,ij->i', off, Rad[ci]); b = off @ N
    nR = np.einsum('ij,ij->i', rn, Rad[ci]); nN = rn @ N
    # ---- parts (প্রতি vertex) ----
    part = np.full(len(rv), 4, np.uint8)            # 4 = shaft
    if has_tub:
        dht = np.linalg.norm(tub.mean(0) - hc)
        is_head = np.linalg.norm(rv - hc, axis=1) < 0.42 * dht
        part[t < tt0] = 2                            # neck
        part[is_head] = 1                            # head (head facet থেকে head-tubercle দূরত্বের ৪২%-এর মধ্যে)
        part[(t >= tt0) & (t <= tt1)] = 3            # tubercle
    else:
        part[np.linalg.norm(rv - hc, axis=1) < 11] = 1   # head (neck নেই)
    part[t >= ta0 - 0.01] = 5                        # anterior end
    # ---- regions (মাসল + জয়েন্ট + ভেসেল groove) ----
    lo, hi = rv.min(0) - S['crop'], rv.max(0) + S['crop']
    vb, fb = decimate(rib, S['faces']); Tb = cKDTree(rv)
    _, near = Tb.query(vb)
    reg = np.zeros(len(vb), np.uint8); dist = np.full(len(vb), 99.)
    for r, fl in S['muscles'].items():
        d, _ = cKDTree(np.vstack([load(f).vertices for f in fl])).query(vb); u = (d < 2.5) & (d < dist); reg[u] = r; dist[u] = d[u]
    for r, f in S['vessels'].items():
        d, _ = cKDTree(load(f).vertices).query(vb); u = (d < 2.5) & (d < dist + 1); reg[u] = r; dist[u] = d[u]
    jt = cKDTree(np.vstack([load(f).vertices for f in S['head_v']] + ([load(S['cart']).vertices] if S['cart'] else [])))
    d, _ = jt.query(vb); reg[d < 1.0] = ARTICULAR
    core = dict(scale=SCALE, meshes=[pack(F, 'rib', 'bone', vb, fb, reg)])
    core['meshes'][0]['p'] = __import__('base64').b64encode(part[near].astype(np.uint8).tobytes()).decode()
    for key, g, f, n in S['context']:
        m = load(f); v, ff = decimate(m, n); core['meshes'].append(pack(F, key, g, v, ff))
    # বাম পাশের রিব (ডান না বাম ট্রেনারের জন্য), নিজের কেন্দ্রে
    FL = Frame(ribL.vertices.mean(0)); FR = Frame(rv.mean(0))
    vL, fL = decimate(ribL, 3500); vR, fR = decimate(rib, 3500)
    core['side'] = dict(R=pack(FR, 'sideR', 'side', vR, fR), L=pack(FL, 'sideL', 'side', vL, fL))
    # ---- ল্যান্ডমার্ক ----
    lm = []
    def snap(p): i = T.query(p)[1]; return rv[i], rn[i]
    def add(id_, p, nrm=None):
        pp, nn = snap(p); nn = nn if nrm is None else nrm
        lm.append(dict(id=id_, p=F.tf(pp).round(2).tolist(), n=F.tf_dir(nn).round(4).tolist()))
    def at(tq, sa=0, sb=0, sel=None):
        """t-তে মধ্যরেখা থেকে sa (বাইরে+) আর sb (উপরে+) দিকে সবচেয়ে দূরের পৃষ্ঠবিন্দু"""
        if sel is None:
            for w in (0.012, 0.03, 0.06, 0.12):
                m = np.abs(t - tq) < w
                if m.any(): break
        else: m = sel
        score = a[m] * sa + b[m] * sb; idx = np.where(m)[0][np.argmax(score)]; return rv[idx]
    if len(head_pts): add('facetUp', head_pts.mean(0)); add('facetLow', head_own.mean(0))
    else: add('headFacet', head_own.mean(0))
    tn = (th1 + tt0) / 2
    if has_tub: add('tubFacet', tub.mean(0)); add('neck', at(tn, 0, 1))
    add('antEnd', ant.mean(0))
    meta = dict(th1=float(th1), tt0=float(tt0), tt1=float(tt1), ta0=float(ta0))
    def angle_from(fmas):
        il = np.vstack([contact(f, 2.5)[0] for f in fmas]); return float(np.median(tOf(il)))
    if kind == 'second':
        tA = angle_from(['FMA22742', 'FMA22744']); meta['tAngle'] = tA
        add('angle', at(tA, 1, 0)); add('crest', (head_pts.mean(0) + head_own.mean(0)) / 2)
        sa_, _ = contact('FMA13398', 2.5); add('tuberosity', sa_.mean(0))
        sp_, _ = contact('FMA13388', 2.5); add('scalPostImp', sp_.mean(0))
        ss_, _ = contact('FMA13403', 2.5); add('spsImp', ss_.mean(0))
        add('extSurf', at(0.62, 1, 0)); add('intSurf', at(0.62, -1, 0))
        add('groove', at((tt1 + 0.32) / 2, -1, -0.8))
    elif kind in ('tenth', 'eleventh'):
        tA = angle_from(['FMA22742', 'FMA22740']); meta['tAngle'] = tA
        add('angle', at(tA, 1, 0))
        if has_tub: add('tubRough', at((tt0 + tt1) / 2 + 0.01, 1, 1))
        tm = 0.55; add('extSurf', at(tm, 1, 0)); add('intSurf', at(tm, -1, 0)); add('upBorder', at(tm, 0, 1)); add('lowBorder', at(tm, 0, -1))
        add('groove', at((tA + 0.5) / 2, -1, -0.8))
    elif kind == 'twelfth':
        tm = 0.5; add('antSurf', at(tm, -1, 0)); add('postSurf', at(tm, 1, 0)); add('upBorder', at(tm, 0, 1)); add('lowBorder', at(tm, 0, -1))
        add('cvAngle', at(th1 + 0.06, 0, -1))
        il, _ = contact('FMA22740', 2.5); te = float(np.percentile(tOf(il), 90)); meta['tErector'] = te
        add('renalAngle', at(te, 0, -1))
    elif kind == 'typical':
        il, _ = contact('FMA22742', 2.5); tA = float(np.median(tOf(il))); meta['tAngle'] = tA
        add('angle', at(tA, 1, 0)); add('crest', (head_pts.mean(0) + head_own.mean(0)) / 2)
        add('tubRough', at((tt0 + tt1) / 2 + 0.01, 1, 1))
        tm = 0.55; add('extSurf', at(tm, 1, 0)); add('intSurf', at(tm, -1, 0)); add('upBorder', at(tm, 0, 1)); add('lowBorder', at(tm, 0, -1))
        add('groove', at((tA + 0.5) / 2, -1, -0.8))
    elif kind == 'first':
        sa_, _ = contact('FMA13392', 2.5); add('scalTub', sa_.mean(0))
        ga, _ = contact('FMA3953', 2.5); add('grooveA', ga.mean(0))
        gv, _ = contact('FMA4755', 2.5); add('grooveV', gv.mean(0))
        cl, dcl = contact('FMA13322', 99); add('ccl', rv[np.argmin(dcl)])
        add('supSurf', at(0.42, 0, 1)); add('infSurf', at(0.5, 0, -1)); add('outBorder', at(0.32, 1, 0)); add('inBorder', at(0.42, -1, 0))  # groove এলাকা (0.6–0.8) এড়িয়ে
        meta['tGrooveA'] = float(np.median(tOf(ga))); meta['tGrooveV'] = float(np.median(tOf(gv)))
    core['lm'] = lm; core['meta'] = meta
    print('  t histogram', np.histogram(t, bins=10, range=(0, 1))[0])
    print(name, 'parts t: head≤%.3f tubercle %.3f–%.3f anterior≥%.3f' % (th1, tt0, tt1, ta0), {k: round(v, 3) for k, v in meta.items()})
    print('  regions', np.bincount(reg, minlength=13))
    # ---- লেয়ার ----
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    for key, g, fl, n in S['layer_meshes']:
        for i, f in enumerate(fl):
            m = load(f)
            if g == 'muscle': m = crop(m, T, S['crop'])
            elif g == 'lung': m = crop(m, T, 70)
            if m is None: continue
            v, ff = decimate(m, n // len(fl)); lay['meshes'].append(pack(F, f'{key}{i}', g, v, ff, key=key))
    for key, f in S['vert']:
        v, ff = decimate(load(f), 1500); lay['meshes'].append(pack(F, key, 'vert', v, ff, key=key))
    for key, f in S['disc']:
        v, ff = decimate(load(f), 300); lay['meshes'].append(pack(F, key, 'disc', v, ff, key=key))
    def tube(key, layer, group, col, r, pts, anchor=None):
        P = F.tf(np.array(pts)).round(2).tolist(); lay['tubes'].append(dict(key=key, layer=layer, group=group, col=col, r=r, pts=P))
        if anchor is not None: lay['anchors'][key] = P[anchor]
    ant_dir = np.array([0, -1, 0.])  # সামনের দিক (BodyParts3D-তে y কমে)
    if kind in ('typical', 'second', 'tenth', 'eleventh'):
        # costal groove বরাবর VAN (উপর থেকে নিচে: vein, artery, nerve) — স্কিম্যাটিক
        tA = meta['tAngle']; ts = np.linspace(tt1 + 0.02, {'second': 0.4, 'eleventh': 0.7}.get(kind, 0.78), 14)
        def gpt(tq, depth):
            m = np.abs(t - tq) < 0.012; amin = a[m].min(); bmin = b[m].min()
            k = np.clip(np.searchsorted(tc, tq), 0, len(tc) - 1)
            return C[k] + Rad[k] * (amin + 1.2) + N * (bmin * depth)
        neck_c = C[np.clip(np.searchsorted(tc, tn), 0, len(tc) - 1)]
        if kind == 'second':   # 1st ও 2nd space-এর posterior intercostal artery আসে superior intercostal artery থেকে
            sia_top = neck_c + ant_dir * 6 + np.array([3, 0, 40]); aop = neck_c + ant_dir * 6 + np.array([3, 0, -2])
            tube('sia', 'artery', 'artery', '#ff5a4d', 1.1, [sia_top, aop], 0)
        else:
            ao = load('FMA3784').vertices; aop = ao[cKDTree(ao).query(neck_c + np.array([25, -10, -12]))[1]]
        tube('pia', 'artery', 'artery', '#ff5a4d', 1.0, [aop, neck_c + N * -12 + ant_dir * 6] + [gpt(x, 0.55) for x in ts], 5)
        azy_x = rv[np.argmin(np.abs(rv[:, 0]))][0] + 4
        if kind == 'second':   # 2nd–3rd posterior intercostal vein মিলে right superior intercostal vein, নিচে নেমে azygos-এ
            tube('siv', 'vein', 'vein', '#5d86f0', 1.6, [[azy_x, neck_c[1] - 8, neck_c[2] + 4], [azy_x, neck_c[1] - 10, neck_c[2] - 55]], 1)
        else:
            tube('azygos', 'vein', 'vein', '#5d86f0', 2.2, [[azy_x, neck_c[1] - 8, neck_c[2] + 45], [azy_x, neck_c[1] - 10, neck_c[2] - 45]])
        tube('piv', 'vein', 'vein', '#5d86f0', 1.1, [[azy_x, neck_c[1] - 9, neck_c[2] - 6], neck_c + N * -9 + ant_dir * 4] + [gpt(x, 0.3) for x in ts], 5)
        tube('icn', 'nerve', 'artery', '#f2c230', .8, [neck_c + N * -16 + np.array([8, 12, 0]), neck_c + N * -14 + ant_dir * 3] + [gpt(x, 0.85) for x in ts], 6)
        tube('collat', 'nerve', 'artery', '#f2c230', .5, [gpt(tA, 0.9) + N * -3, gpt(tA + 0.1, 1) + N * -18, gpt(0.7, 1) + N * -20])
    elif kind == 'twelfth':
        # subcostal artery, vein, nerve: costal groove নেই, নিচের বর্ডার বরাবর (স্কিম্যাটিক)
        ts = np.linspace(th1 + 0.04, 0.8, 12)
        def lpt(tq, dz):
            m = np.abs(t - tq) < 0.015; i = np.where(m)[0][np.argmin(b[m])]
            return rv[i] + N * (-dz) + Rad[np.clip(np.searchsorted(tc, tq), 0, len(tc) - 1)] * -2
        h0 = C[1]
        ao = load('FMA3784').vertices; aop = ao[cKDTree(ao).query(h0 + np.array([25, -10, -14]))[1]]
        tube('subA', 'artery', 'artery', '#ff5a4d', 1.0, [aop, h0 + N * -12 + ant_dir * 6] + [lpt(x, 5) for x in ts], 5)
        azy_x = rv[np.argmin(np.abs(rv[:, 0]))][0] + 4
        tube('subV', 'vein', 'vein', '#5d86f0', 1.1, [[azy_x, h0[1] - 9, h0[2] - 4], h0 + N * -9 + ant_dir * 4] + [lpt(x, 2.5) for x in ts], 5)
        tube('subN', 'nerve', 'artery', '#f2c230', .9, [h0 + N * -18 + np.array([8, 12, 0]), h0 + N * -16 + ant_dir * 3] + [lpt(x, 8) for x in ts], 6)
    else:
        # neck-এর সামনে (মধ্য থেকে বাইরে): sympathetic trunk, 1st post. intercostal vein, superior intercostal artery, T1 ventral ramus
        tq = np.linspace(th1, tt0, 6)[1:5]
        def neckfront(tq_, dz):
            m = np.abs(t - tq_) < 0.02; p = rv[m][np.argmin(rv[m][:, 1])]
            return p + ant_dir * 3 + np.array([0, 0, dz])
        for (key, layer, grp, col, r), tq_ in zip([('symp', 'nerve', 'artery', '#d9b23a', 1.0), ('piv1', 'vein', 'vein', '#5d86f0', 1.0),
                                                     ('sia', 'artery', 'artery', '#ff5a4d', 0.9), ('t1', 'nerve', 'artery', '#f2c230', 1.2)], tq):
            if key == 't1': pts = [neckfront(tq_, -16), neckfront(tq_, 0), neckfront(tq_, 12) + np.array([-6, 4, 0])]
            else: pts = [neckfront(tq_, 18), neckfront(tq_, 0), neckfront(tq_, -20)]
            tube(key, layer, grp, col, r, pts, 1)
        # lower trunk of brachial plexus: subclavian artery-র পেছনে groove-এ
        rsa = load('FMA3953').vertices; ga, _ = contact('FMA3953', 2.5); gc = ga.mean(0)
        loc = rsa[np.linalg.norm(rsa - gc, axis=1) < 22]; _, _, Vt = np.linalg.svd(loc - loc.mean(0)); dirA = Vt[0]
        if dirA[0] > 0: dirA = -dirA
        post = np.array([0, 1, 0.]); post -= dirA * (post @ dirA); post /= np.linalg.norm(post)
        base = gc + post * 6 + np.array([0, 0, 3])
        tube('lowerTrunk', 'nerve', 'artery', '#f2c230', 1.6, [base - dirA * 30 + np.array([0, 0, 8]), base - dirA * 8, base + dirA * 12, base + dirA * 32 - np.array([0, 0, 4])], 1)
    write_js(os.path.join(OUT, f'{name}-core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, f'{name}-layers.js'), 'window.LAYERS', lay)


if __name__ == '__main__':
    only = sys.argv[1:]
    for k, s in SPECS.items():
        if not only or k in only: build(k, s)
