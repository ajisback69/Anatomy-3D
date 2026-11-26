"""ফুসফুস (ডান ও বাম) আর pleura: BodyParts3D-এর পাঁচটা lobe থেকে, সব পৃষ্ঠ আর impression মেপে।

ব্যবহার: python pipeline/lungs.py   → bones/lungs/data/core.js, layers.js
লেখা: Datta I, Chapter 2 (The Pleura, The Lungs), বইয়ের পৃ. 28–42 (PDF পৃ. = বই + 14)।

প্রতিটা lobe একটা আলাদা 'bone' মেশ (তাই দুইবার ট্যাপে সরানো যায়, ভেতরের fissure পৃষ্ঠ দেখা যায়):
  p (PARTS) = lobe: 1 Rt upper, 2 Rt middle, 3 Rt lower, 4 Lt upper, 5 Lt lower
  r (REG)   = পৃষ্ঠ ও impression, প্রতিবেশী অঙ্গের সাথে ছোঁয়া মেপে (নিচে REGS)
  t (TERR)  = broncho-pulmonary segment (স্কিম্যাটিক: lobe-এর আকার থেকে, Datta-র নাম ও সংখ্যা অনুযায়ী)
"""
import os, sys, json, base64
import numpy as np
import trimesh
from scipy.spatial import cKDTree
from scipy import ndimage as nd
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, STL

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'lungs', 'data')
LOBES = [('RU', 'FMA7333', 1, 'R', 13000), ('RM', 'FMA7383', 2, 'R', 9000), ('RL', 'FMA7337', 3, 'R', 17000),
         ('LU', 'FMA7370', 4, 'L', 15000), ('LL', 'FMA7371', 5, 'L', 15000)]
NB = dict(heart='FMA7274', aoAsc='FMA3736', aoArch='FMA3768', aoDesc='FMA3784', svc='FMA4720', ivc='FMA10951',
          rbcv='FMA4751', lbcv='FMA4761', bct='FMA3932nsn', rsca='FMA3953', lsca='FMA4694', rcca='FMA3941', lcca='FMA4058',
          rscv='FMA4755', lscv='FMA4763', eso='FMA7131', trachea='FMA7394', bronchus='FMA7409', pa='FMA66326', pv='FMA66643',
          dia='FMA13295')
VERT = [('T%d' % (i + 1), f) for i, f in enumerate(['FMA9165', 'FMA9187', 'FMA9209', 'FMA9248', 'FMA9922', 'FMA9945', 'FMA9968',
                                                    'FMA9991', 'FMA10014', 'FMA10037', 'FMA10059', 'FMA10081'])]
RIB = {'R': ['FMA7857', 'FMA7882', 'FMA7909', 'FMA7957', 'FMA8066', 'FMA8175', 'FMA8229', 'FMA8283', 'FMA8364', 'FMA8445', 'FMA8531', 'FMA8533'],
       'L': ['FMA7987', 'FMA8012', 'FMA8039', 'FMA8148', 'FMA8093', 'FMA8202', 'FMA8256', 'FMA8310', 'FMA8391', 'FMA8472', 'FMA8532', 'FMA8534']}
CC = {'R': ['FMA7875', 'FMA7886', 'FMA7913', 'FMA7976', 'FMA8070', 'FMA8194', 'FMA8248'],
      'L': ['FMA8005', 'FMA8031', 'FMA8058', 'FMA8167', 'FMA8112', 'FMA8221', 'FMA8275']}
CLAV = {'R': 'FMA13322', 'L': 'FMA13323'}
SCAP = {'R': 'FMA13395', 'L': 'FMA13396'}
STERNUM = ['FMA7486', 'FMA7487', 'FMA7488']

# REG id → (নাম-চাবি); content.js-এর REG একই id ব্যবহার করে। 8 ভিউয়ারে articular-এর জন্য সংরক্ষিত, তাই বাদ।
R_COSTAL, R_MED, R_BASE, R_APEX, R_VERT, R_HILUM, R_CARD = 1, 2, 3, 4, 5, 6, 7
R_OBL, R_HOR = 9, 10
R_SVC, R_RBCV, R_BCT, R_TRACH, R_ESO, R_IVC, R_ARCH, R_DAO, R_LSCA, R_LBCV, R_PT, R_RSCA = 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22

# broncho-pulmonary segment (স্কিম্যাটিক): lobe-এর নিজের অক্ষে (u: মধ্য→পাশ, v: পেছন→সামনে, w: নিচ→উপর, ০–১) বীজবিন্দু
SEG = {
    'RU': [(1, (.45, .5, .92)), (2, (.55, .15, .55)), (3, (.55, .85, .5))],
    'RM': [(4, (.85, .45, .5)), (5, (.2, .6, .5))],
    'RL': [(6, (.5, .15, .88)), (7, (.12, .55, .2)), (8, (.5, .9, .25)), (9, (.92, .5, .2)), (10, (.45, .05, .15))],
    'LU': [(11, (.45, .35, .88)), (12, (.5, .85, .62)), (13, (.55, .78, .32)), (14, (.5, .8, .06))],
    'LL': [(15, (.5, .15, .88)), (16, (.35, .85, .22)), (17, (.92, .5, .2)), (18, (.45, .05, .15))],
}


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def b64(a, dt):
    return base64.b64encode(np.asarray(a).astype(dt).tobytes()).decode()


def main():
    raw = {k: load(f) for k, f, *_ in LOBES}
    allv = np.vstack([m.vertices for m in raw.values()])
    C0 = (allv.min(0) + allv.max(0)) / 2
    F = Frame(C0)
    nb = {k: load(f) for k, f in NB.items()}
    nbt = {k: cKDTree(m.vertices) for k, m in nb.items()}
    vert = {k: load(f) for k, f in VERT}
    vt = cKDTree(np.vstack([m.vertices for m in vert.values()]))
    ribs = {s: [load(f) for f in RIB[s]] for s in 'RL'}
    ribt = cKDTree(np.vstack([m.vertices for s in 'RL' for m in ribs[s]]))
    lobe_t = {k: cKDTree(m.vertices) for k, m in raw.items()}

    core_meshes, LM, meas = [], [], {}
    regcount = {}

    def lm(id_, p, n, **kw):
        LM.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=unit(F.tf_dir(n)).round(3).tolist(), **kw))

    for key, fma, pid, side, nf in LOBES:
        m = raw[key]
        v, f = decimate(m, nf)
        mm = trimesh.Trimesh(v, f, process=True)
        mm.remove_unreferenced_vertices()
        v, f, vn = mm.vertices, mm.faces, mm.vertex_normals
        assert len(v) < 65535
        med = np.array([1., 0, 0]) if side == 'R' else np.array([-1., 0, 0])   # মধ্যরেখার দিকে
        d = {k: nbt[k].query(v)[0] for k in nbt}
        dv = vt.query(v)[0]
        dr = ribt.query(v)[0]
        zt = allv[(allv[:, 0] < 0) if side == 'R' else (allv[:, 0] > 0)][:, 2].max()
        r = np.full(len(v), R_COSTAL, np.uint8)
        nmed = vn @ med
        isme = (nmed > .3) & (dr > 6)
        r[isme] = R_MED
        r[isme & (dv < 9)] = R_VERT
        r[(d['dia'] < 4) & (vn[:, 2] < -.15)] = R_BASE
        r[v[:, 2] > zt - 28] = R_APEX
        # মৌলিক পৃষ্ঠগুলো মসৃণ করা (পাশের বিন্দুর সংখ্যাগরিষ্ঠ মত), যাতে ছোপ ছোপ না দেখায়
        nbrs = mm.vertex_neighbors
        for _ in range(4):
            r2 = r.copy()
            for i, nb_ in enumerate(nbrs):
                if r[i] == R_APEX or not nb_:
                    continue
                vals, cnt = np.unique(r[nb_], return_counts=True)
                r2[i] = vals[np.argmax(cnt)] if cnt.max() > len(nb_) / 2 else r[i]
            r = r2
        medz = (r == R_MED) | (r == R_VERT) | (r == R_APEX)
        imp = [('heart', R_CARD, 4)]
        if side == 'R':
            imp += [('svc', R_SVC, 4), ('rbcv', R_RBCV, 4), ('bct', R_BCT, 8), ('trachea', R_TRACH, 5), ('eso', R_ESO, 5), ('ivc', R_IVC, 8),
                    ('rsca', R_RSCA, 5)]
        else:
            imp += [('aoArch', R_ARCH, 4), ('aoDesc', R_DAO, 4), ('lsca', R_LSCA, 5), ('lbcv', R_LBCV, 5), ('eso', R_ESO, 5)]
        for k, rid, th in imp:
            r[medz & (d[k] < th)] = rid
        root = np.minimum(np.minimum(d['bronchus'], d['pa']), d['pv'])
        hil = (root < 3) & (nmed > -.2)
        # শুধু আসল hilum: যেখানে principal bronchus পৃষ্ঠে ঢোকে তার চারপাশে (ভেতরের ছোট শাখা পৃষ্ঠের কাছে এলে বাদ)
        hb = hil & (d['bronchus'] < 3) & (nmed > .2)
        if hb.sum() > 5:
            hc = np.median(v[hb], axis=0)
            hil = hil & (np.linalg.norm(v - hc, axis=1) < 32) & (nmed > 0)
        if side == 'L':
            far_br = d['bronchus'] > 18
            r[hil & far_br & (d['pa'] < 3) & (v[:, 2] > np.median(v[hil, 2]) + 8)] = R_PT
            hil = hil & ~(r == R_PT)
        r[hil] = R_HILUM
        # fissure: অন্য lobe-এর সাথে ছোঁয়া
        for other, ot in lobe_t.items():
            if other == key or other[0] != key[0]:
                continue
            dd = ot.query(v)[0]
            fis = R_HOR if {key, other} == {'RU', 'RM'} else R_OBL
            r[dd < 1.6] = fis
        for rid in np.unique(r):
            regcount.setdefault(int(rid), 0)
            regcount[int(rid)] += int((r == rid).sum())
        # segment (স্কিম্যাটিক)
        lo, hi = v.min(0), v.max(0)
        U = np.c_[(v[:, 0] - lo[0]) / (hi[0] - lo[0]), (v[:, 1] - lo[1]) / (hi[1] - lo[1]), (v[:, 2] - lo[2]) / (hi[2] - lo[2])]
        if side == 'R':
            U[:, 0] = 1 - U[:, 0]          # u: মধ্য(০) → পাশ(১)
        U[:, 1] = 1 - U[:, 1]              # BP3D y = পেছন(+); v: পেছন(০) → সামনে(১)
        seeds = np.array([s for _, s in SEG[key]]); ids = np.array([i for i, _ in SEG[key]])
        W = np.array([1.0, 1.0, 1.25])
        t = ids[np.argmin(((U[:, None, :] - seeds[None]) * W) ** 2 @ np.ones(3), axis=1)].astype(np.uint8)
        e = pack(F, key, 'bone', v, f, regions=r, key=key)
        e['p'] = b64(np.full(len(v), pid), np.uint8)
        e['t'] = b64(t, np.uint8)
        core_meshes.append(e)

        # ---- প্রতিটা REG-এর জন্য বিন্দু (lobe অনুযায়ী): region-এর মাঝখানের সবচেয়ে কাছের পৃষ্ঠবিন্দু
        for rid in np.unique(r):
            sel = np.where(r == rid)[0]
            if len(sel) < 12:
                continue
            c = v[sel].mean(0)
            i = sel[np.argmin(np.linalg.norm(v[sel] - c, axis=1))]
            lm(f'r~{int(rid)}~{key}', v[i], vn[i])
        for sid in np.unique(t):
            sel = np.where(t == sid)[0]
            c = v[sel].mean(0)
            i = sel[np.argmin(np.linalg.norm(v[sel] - c, axis=1) - 3 * (vn[sel] @ unit(c - v.mean(0))))]
            lm(f's~{int(sid)}~{key}', v[i], vn[i], show='seg')

        # ---- বিশেষ ল্যান্ডমার্ক
        if key in ('RU', 'LU'):
            i = np.argmax(v[:, 2]); lm('apex' + side, v[i], [0, 0, 1])
            meas['apexAboveRib1_' + side] = None
        if key == 'LU':
            # cardiac notch: সামনের কিনারার নিচের অর্ধেকে সবচেয়ে পাশে সরে যাওয়া বিন্দু; lingula: সবচেয়ে নিচের সামনের জিভ
            front = v[:, 1] < np.percentile(v[:, 1], 12)
            low = front & (v[:, 2] < np.percentile(v[:, 2], 45))
            cand = np.where(low)[0]
            i = cand[np.argmax(v[cand, 0])]; lm('cardNotch', v[i], [0, -1, 0])
            i = cand[np.argmin(v[cand, 2])]; lm('lingula', v[i], [0, -1, -.3])
        if key in ('RL', 'LL'):
            # inferior border: পাশের নিচের কিনারা; posterior border: পেছনের গোল কিনারা মাঝ-উচ্চতায়
            lat = -med
            b = np.where((r == R_BASE))[0]
            i = b[np.argmax(v[b] @ lat)]; lm('infBorder' + side, v[i], lat + np.array([0, 0, -.5]))
            mid = np.abs(v[:, 2] - np.median(v[:, 2])) < 10
            c = np.where(mid)[0]
            i = c[np.argmax(v[c, 1])]; lm('postBorder' + side, v[i], [0, 1, 0])
        if key in ('RU', 'LU'):
            mid = np.abs(v[:, 2] - (v[:, 2].max() - 60)) < 8
            c = np.where(mid)[0]
            i = c[np.argmin(v[c, 1])]; lm('antBorder' + side, v[i], [0, -1, 0])

    # lung root: bronchus, PA, PV যেখানে hilum-এ ঢোকে (প্রতিটার জন্য আলাদা বিন্দু, দুই পাশে)
    for side, lobes in (('R', ['RU', 'RM', 'RL']), ('L', ['LU', 'LL'])):
        lv = np.vstack([raw[k].vertices for k in lobes]); lt = cKDTree(lv)
        for k in ('bronchus', 'pa', 'pv'):
            mv = nb[k].vertices
            sidev = mv[(mv[:, 0] < -15) if side == 'R' else (mv[:, 0] > 15)]
            dd = lt.query(sidev)[0]
            near = sidev[(dd < 4) & (dd > .5)]
            if len(near) < 5:
                continue
            # hilum-এর বাইরে (মিডিয়াস্টিনামের দিকে) সবচেয়ে কাছের অংশ
            medial_pt = near[np.argsort(np.abs(near[:, 0]))[:max(5, len(near) // 8)]].mean(0)
            q = sidev[np.argmin(np.linalg.norm(sidev - medial_pt, axis=1))]
            lm(f'root_{k}_{side}', q, [(-1 if side == 'R' else 1) * .3, -1, .2], show='root')
        # pulmonary ligament (স্কিম্যাটিক অবস্থান): hilum-এর নিচে, mediastinal পৃষ্ঠে
    # hilum-এর উচ্চতায় কশেরুকা (Datta: T5–T7)
    hz = {}
    for side in 'RL':
        pts = [l for l in LM if l['id'].startswith('r~%d~' % R_HILUM) and l['id'].endswith(('RU', 'RM', 'RL') if side == 'R' else ('LU', 'LL'))]
    # ---- সারফেস মার্কিং (Datta পৃ. 31): ফুসফুসের নিচের কিনারা ৬/৮/১০, pleura-র নিচের সীমা ৮/১০/১২ নম্বর রিব
    clav = {s: load(CLAV[s]) for s in 'RL'}
    scap = {s: load(SCAP[s]) for s in 'RL'}
    cc = {s: [load(x) for x in CC[s]] for s in 'RL'}
    surf = []
    for s in 'RL':
        sg = -1 if s == 'R' else 1
        xm = clav[s].vertices[:, 0].mean()                    # mid-clavicular line
        sv = scap[s].vertices; xs = sv[np.argmin(sv[:, 2]), 0]  # scapular line (inferior angle দিয়ে)
        for line, ribs_, kind in (('MCL', (6, 8), 'mcl'), ('MAL', (8, 10), 'mal'), ('SCL', (10, 12), 'scl')):
            for which, rn in zip(('lung', 'pleura'), ribs_):
                rm = ribs[s][rn - 1].vertices
                if kind == 'mcl':
                    pool = np.vstack([rm] + ([cc[s][rn - 1].vertices] if rn <= 7 else []))
                    c = pool[np.abs(pool[:, 0] - xm) < 6]
                    if len(c) == 0:
                        c = pool[np.argsort(np.abs(pool[:, 0] - xm))[:20]]
                    p = c[np.argmin(c[:, 1])]; n = [0, -1, 0]
                elif kind == 'mal':
                    p = rm[np.argmax(rm[:, 0] * sg)]; n = [sg, 0, 0]
                else:
                    c = rm[np.abs(rm[:, 0] - xs) < 8]
                    if len(c) == 0:
                        c = rm[np.argsort(np.abs(rm[:, 0] - xs))[:20]]
                    p = c[np.argmax(c[:, 1])]; n = [0, 1, 0]
                lm(f'sm_{which}_{line}_{s}', p, n, show='surf')
                surf.append(dict(side=s, line=line, rib=rn, which=which, p=F.tf(p).round(1).tolist()))

    # ---- মাপ: ডান-বাম ফুসফুসের আয়তন (lobe মেশের আয়তন যোগ), উচ্চতা
    vol = {k: abs(raw[k].volume) / 1000 for k in raw}
    meas['vol'] = {k: round(vol[k]) for k in vol}
    meas['volR'] = round(vol['RU'] + vol['RM'] + vol['RL'])
    meas['volL'] = round(vol['LU'] + vol['LL'])
    hR = np.vstack([raw[k].vertices for k in ('RU', 'RM', 'RL')]); hL = np.vstack([raw[k].vertices for k in ('LU', 'LL')])
    meas['hR'] = round((hR[:, 2].max() - hR[:, 2].min()) / 10, 1)
    meas['hL'] = round((hL[:, 2].max() - hL[:, 2].min()) / 10, 1)
    meas['regcount'] = regcount
    # apex কত উপরে: ১ম costal cartilage-এর উপরের কিনারা থেকে, আর clavicle-এর medial প্রান্ত থেকে
    for s, top in (('R', hR[:, 2].max()), ('L', hL[:, 2].max())):
        c1 = cc[s][0].vertices; cl = clav[s].vertices
        med_end = cl[np.argmin(np.abs(cl[:, 0]))]
        meas['apexAboveCC1_' + s] = round((top - c1[:, 2].max()) / 10, 1)
        meas['apexAboveClav_' + s] = round((top - med_end[2]) / 10, 1)
        meas.pop('apexAboveRib1_' + s, None)
    print('মাপ:', json.dumps({k: meas[k] for k in meas if k != 'regcount'}, ensure_ascii=False))
    print('region:', regcount)

    # ================================================= লেয়ার: প্রসঙ্গ
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    def addl(k, m, group, layer, nfaces, key=None):
        vv, ff = decimate(m, nfaces)
        e = pack(F, k, group, vv, ff, key=key or k); e['layer'] = layer
        lay['meshes'].append(e)
    for s in 'RL':
        for i, m in enumerate(ribs[s]):
            addl(f'rib{s}{i+1}', m, 'rib', 'rib', 1500, key='rib%d' % (i + 1))
        for i, m in enumerate(cc[s]):
            addl(f'cc{s}{i+1}', m, 'cart', 'rib', 700, key='cc')
        addl('clav' + s, clav[s], 'clav', 'rib', 1500, key='clavicle')
    for i, x in enumerate(STERNUM):
        addl('sternum%d' % i, load(x), 'clav', 'rib', 2000, key='sternum')
    for k, m in vert.items():
        addl(k, m, 'vert', 'vert', 1500, key=k)
    for k, g, lyr, n in (('heart', 'heart', 'organ', 9000), ('aoAsc', 'artery', 'great', 1200), ('aoArch', 'artery', 'great', 2500),
                         ('aoDesc', 'artery', 'great', 3000), ('svc', 'vein', 'great', 1200), ('ivc', 'vein', 'great', 1200),
                         ('rbcv', 'vein', 'great', 900), ('lbcv', 'vein', 'great', 900), ('bct', 'artery', 'great', 900),
                         ('rsca', 'artery', 'great', 1000), ('lsca', 'artery', 'great', 1000), ('rcca', 'artery', 'great', 700),
                         ('lcca', 'artery', 'great', 700), ('rscv', 'vein', 'great', 700), ('lscv', 'vein', 'great', 700),
                         ('eso', 'eso', 'organ', 3000), ('trachea', 'trachea', 'root', 3000), ('bronchus', 'trachea', 'root', 9000),
                         ('pa', 'pa', 'root', 9000), ('pv', 'pvein', 'root', 9000), ('dia', 'muscle', 'muscle', 9000)):
        addl(k, nb[k], g, lyr, n)
    for i, x in enumerate(('FMA71194', 'FMA71195')):
        if os.path.exists(os.path.join(STL, x + '.stl')):
            addl('thymus%d' % i, load(x), 'thymus', 'organ', 1200, key='thymus')
    # parietal pleura (স্কিম্যাটিক): প্রতিটা পাশের ফুসফুস ৪ মিমি ফুলিয়ে, নিচে costo-diaphragmatic recess বরাবর বাড়ানো
    for s, lobes in (('R', ['RU', 'RM', 'RL']), ('L', ['LU', 'LL'])):
        pv = np.vstack([raw[k].vertices for k in lobes])
        lo = pv.min(0) - 40; P = 2.0
        shape = np.ceil((pv.max(0) + 40 - lo) / P).astype(int)
        G = np.zeros(shape, bool)
        for k in lobes:
            vox = raw[k].voxelized(P).fill()
            idx = np.round((vox.points - lo) / P).astype(int)
            ok = np.all((idx >= 0) & (idx < shape), 1)
            G[tuple(idx[ok].T)] = True
        G = nd.binary_closing(G, iterations=2)
        G2 = nd.binary_dilation(G, iterations=2)
        # recess: ফুসফুসের নিচের কিনারার নিচে পাশ-পেছনে কয়েক সেমি (Datta: মধ্য-axillary line-এ প্রায় ৫ সেমি)
        zz = np.arange(shape[2]) * P + lo[2]
        colmin = np.where(G.any(2), np.argmax(G, 2), shape[2])
        ext = np.zeros_like(G2)
        cx = (pv[:, 0].mean() - lo[0]) / P
        for i in range(shape[0]):
            lateral = abs(i - cx) / (shape[0] / 2)
            for j in range(shape[1]):
                k0 = colmin[i, j]
                if k0 >= shape[2]:
                    continue
                post = j / shape[1]
                depth = int((10 + 40 * min(1, lateral * 1.3) * (.4 + .6 * post)) / P)
                # শুধু পাশের কিনারায় (base-এর গভীর গম্বুজের মাঝখানে নয়)
                if lateral > .55 or post > .7:
                    ext[i, j, max(0, k0 - depth):k0] = True
        G3 = nd.binary_closing(G2 | (nd.binary_dilation(ext, iterations=1) & ~nd.binary_erosion(G2, iterations=0)), iterations=1)
        from skimage import measure
        vv, ff, _, _ = measure.marching_cubes(G3.astype(np.float32), .5)
        vv = vv * P + lo
        pm = trimesh.Trimesh(vv, ff, process=True)
        trimesh.smoothing.filter_taubin(pm, iterations=12)
        addl('pleura' + s, pm, 'pleura', 'pleura', 9000, key='pleura')

    core = dict(scale=0.02, meshes=core_meshes, lm=LM, meas=meas, surf=surf)
    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', lay)
    print('ল্যান্ডমার্ক:', len(LM))


if __name__ == '__main__':
    main()
