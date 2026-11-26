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
    KEEP = {}
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
        # পৃষ্ঠ ভাগের জন্য ১৪ মিমি জুড়ে গড় normal: ছোট উঁচু-নিচুতে পৃষ্ঠ ছেঁড়া-ছেঁড়া হয় না
        vtree = cKDTree(v)
        ns = np.array([vn[ix].mean(0) for ix in vtree.query_ball_point(v, 14)])
        ns /= np.linalg.norm(ns, axis=1)[:, None]
        nmed = vn @ med
        nsm = ns @ med
        isme = nsm > .32
        r[isme] = R_MED
        r[isme & ((dv < 14) | (ns[:, 1] > .55))] = R_VERT
        r[(d['dia'] < 10) & ((ns[:, 2] < -.45) | ((ns[:, 2] < -.12) & (nsm > 0)))] = R_BASE
        r[v[:, 2] > zt - 28] = R_APEX
        # মৌলিক পৃষ্ঠগুলো মসৃণ করা (পাশের বিন্দুর সংখ্যাগরিষ্ঠ মত), যাতে ছোপ ছোপ না দেখায়
        nbrs = mm.vertex_neighbors
        for _ in range(10):
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
        KEEP[key] = dict(v=v, vn=vn, r=r.copy(), nbrs=mm.vertex_neighbors, side=side)
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
    # ---- border আর fissure-এর ট্রেসিং (দুই পৃষ্ঠ যেখানে মেলে সেই রেখা, স্ক্যান থেকে)
    MEDSET = {R_MED, R_VERT, R_HILUM, R_CARD, R_SVC, R_RBCV, R_BCT, R_TRACH, R_ESO, R_IVC, R_ARCH, R_DAO, R_LSCA, R_LBCV, R_PT, R_RSCA}
    def edge_pts(keys, cond):
        P, N = [], []
        for k in keys:
            K = KEEP[k]
            for i, nb_ in enumerate(K['nbrs']):
                if nb_ and cond(K['r'][i], K['r'][nb_]):
                    P.append(K['v'][i]); N.append(K['vn'][i])
        return np.array(P), np.array(N)
    def snap(P, keys, off=2.4):
        allv = np.vstack([KEEP[k]['v'] for k in keys]); alln = np.vstack([KEEP[k]['vn'] for k in keys])
        t = cKDTree(allv); _, ix = t.query(P)
        c = allv.mean(0); out = unit_rows(allv[ix] - c)
        return allv[ix] + (alln[ix] * .5 + out * .5) * off
    def unit_rows(X):
        return X / np.linalg.norm(X, axis=1)[:, None]
    def smooth(P, it=3, closed=False):
        P = P.copy()
        for _ in range(it):
            Q = P.copy()
            if closed:
                P = (np.roll(Q, 1, 0) + 2 * Q + np.roll(Q, -1, 0)) / 4
            else:
                P[1:-1] = (Q[:-2] + 2 * Q[1:-1] + Q[2:]) / 4
        return P
    def by_z(P, step=7):
        if len(P) < 4:
            return None
        zs = np.arange(P[:, 2].min(), P[:, 2].max() + step, step)
        out = [P[(P[:, 2] >= a) & (P[:, 2] < a + step)].mean(0) for a in zs if ((P[:, 2] >= a) & (P[:, 2] < a + step)).sum() >= 2]
        return np.array(out) if len(out) >= 3 else None
    def by_angle(P, c, step=8, closed=True):
        a = np.degrees(np.arctan2(P[:, 1] - c[1], P[:, 0] - c[0]))
        out = []
        for a0 in np.arange(-180, 180, step):
            m = (a >= a0) & (a < a0 + step)
            if m.sum() >= 2:
                out.append(P[m].mean(0))
        return np.array(out)
    def plane_order(P):
        c = P.mean(0); _, _, vt = np.linalg.svd(P - c, full_matrices=False)
        x, y = (P - c) @ vt[0], (P - c) @ vt[1]
        a = np.degrees(np.arctan2(y, x)); o = np.argsort(a); a = a[o]; P = P[o]
        gaps = np.diff(np.r_[a, a[0] + 360]); g = np.argmax(gaps)
        P = np.roll(P, -(g + 1), 0)
        out = [P[i:i + 10].mean(0) for i in range(0, len(P), 10)]
        return np.array(out)
    def tube(key, pts, col, r=1.6, closed=False):
        if pts is None or len(pts) < 3:
            return
        # মসৃণ spline: অল্প কয়েকটা নিয়ন্ত্রণ-বিন্দু (রক্তনালীর মতো সোজা-মসৃণ রেখা), শুধু সেগুলো পৃষ্ঠে বসানো
        from scipy.interpolate import splprep, splev
        P_ = np.asarray(pts, float)
        keep_ = np.r_[True, np.linalg.norm(np.diff(P_, axis=0), axis=1) > 1e-3]
        P_ = P_[keep_]
        nctl = 18 if closed else max(6, min(11, int(np.linalg.norm(np.diff(P_, axis=0), axis=1).sum() / 22)))
        try:
            tck, _ = splprep(P_.T, s=len(P_) * 25.0, per=1 if closed else 0, k=3)
            ctl = np.array(splev(np.linspace(0, 1, nctl, endpoint=not closed), tck)).T
        except Exception:
            ctl = P_[np.linspace(0, len(P_) - 1, nctl).astype(int)]
        ctl = snap(ctl, KEYS_NOW[0], FIS_OFF[0] + .8)
        if closed:
            ctl = np.vstack([ctl, ctl[:1]])
        pts = ctl
        lay['tubes'].append(dict(key=key, layer='border', group='border', col=col, r=r, pts=F.tf(pts).round(2).tolist()))
        lay['anchors'][key] = F.tf(pts[len(pts) // 2]).round(2).tolist()
    KEYS_NOW = [None]
    FIS_OFF = [2.4]
    for side, keys, cx in (('R', ['RU', 'RM', 'RL'], -1), ('L', ['LU', 'LL'], 1)):
        KEYS_NOW[0] = keys
        allv = np.vstack([KEEP[k]['v'] for k in keys]); c = allv.mean(0)
        # border: জ্যামিতি থেকে। প্রতিটা উচ্চতার আড়াআড়ি টুকরায় সবচেয়ে সামনে-মধ্যের (anterior) আর পেছন-মধ্যের (posterior) কিনারা
        md = np.array([1., 0, 0]) if side == 'R' else np.array([-1., 0, 0])
        zlo, zhi = allv[:, 2].min(), allv[:, 2].max()
        def slice_edge(u, z0, z1, step=5):
            out = []
            for z in np.arange(z0, z1, step):
                b = allv[np.abs(allv[:, 2] - z) < 2.5]
                if len(b) < 8:
                    continue
                out.append(b[np.argmax(b @ u)])
            return np.array(out)
        ant = slice_edge(unit(np.array([0, -1., 0]) + .75 * md), zlo + 0.24 * (zhi - zlo), zhi - 12)
        post = slice_edge(unit(np.array([0, 1., 0]) + .55 * md), zlo + 0.12 * (zhi - zlo), zhi - 12)
        tube('bdAnt' + side, snap(smooth(ant, 3), keys), '#ffd43b')
        tube('bdPost' + side, snap(smooth(post, 3), keys), '#ffb703')
        # inferior border: নিচের ধারালো কিনারা; প্রতিটা কোণে নিচের অংশের সবচেয়ে বাইরের বিন্দু
        H = zhi - zlo
        low = allv[allv[:, 2] < zlo + .45 * H]
        cc_ = low.mean(0); a = np.degrees(np.arctan2(low[:, 1] - cc_[1], low[:, 0] - cc_[0])); rr = np.hypot(low[:, 0] - cc_[0], low[:, 1] - cc_[1])
        score = rr - .55 * (low[:, 2] - zlo)
        out, rimA, rimZ = [], [], []
        for a0 in np.arange(-180, 180, 5):
            m_ = (a >= a0) & (a < a0 + 5)
            if m_.sum() >= 3:
                sel = np.where(m_)[0]; q = low[sel[np.argmax(score[sel])]]; out.append(q); rimA.append(a0 + 2.5); rimZ.append(q[2])
        rim = smooth(np.array(out), 5, True)
        tube('bdInf' + side, snap(rim, keys), '#fb8500', closed=True)
        # base-এর আস্তরণ inferior border পর্যন্ত: কিনারার নিচে (আর নিচের দিকে মুখ করা) সব base, উপরে base নয়
        rimA = np.array(rimA); rimZs = smooth(np.array(rimZ)[:, None], 5, True)[:, 0]
        for k in keys:
            K = KEEP[k]; vv = K['v']; aa = np.degrees(np.arctan2(vv[:, 1] - cc_[1], vv[:, 0] - cc_[0]))
            zr = np.interp(aa, np.r_[rimA - 360, rimA, rimA + 360], np.r_[rimZs, rimZs, rimZs])
            below = (vv[:, 2] < zr - 1.5) & (K['vn'][:, 2] < .2)
            rr_ = K['r']
            chg = below & np.isin(rr_, [R_COSTAL, R_MED, R_VERT])
            rr_[chg] = R_BASE
            up = (vv[:, 2] > zr + 4) & (rr_ == R_BASE)
            rr_[up] = R_COSTAL
            lat_ = ((K['vn'] @ md) < -.2) & np.isin(rr_, list(MEDSET)) & ~np.isin(rr_, [R_HILUM])
            rr_[lat_] = R_COSTAL
            K['r'] = rr_
            for e_ in core_meshes:
                if e_['name'] == k:
                    e_['r'] = b64(rr_, np.uint8)
        # fissure রেখা বাইরের পৃষ্ঠে: শুধু উপরের lobe থেকে (দুই দিকে একই রেখা)
        for fk, rid, lobe in (('fisObl', R_OBL, 'RL' if side == 'R' else 'LU'), ('fisHor', R_HOR, 'RU')):
            if side == 'L' and fk == 'fisHor':
                continue
            # fissure vertex যেগুলো অন্য lobe-এর বাইরের (fissure নয় এমন) পৃষ্ঠের কাছে: বাইরে দেখা রেখা
            others = [k for k in keys if k != lobe]
            ov = np.vstack([KEEP[k]['v'][~np.isin(KEEP[k]['r'], [R_OBL, R_HOR])] for k in others])
            fm = KEEP[lobe]['r'] == rid
            fv = KEEP[lobe]['v'][fm]; fn = KEEP[lobe]['vn'][fm]
            if len(fv) < 10:
                continue
            near = cKDTree(ov).query(fv)[0] < 3.0
            # costal পৃষ্ঠে দেখা অংশ: বাইরের দিকে মুখ করা কিনারা (যেখানে দাগ পড়ানো হয়)
            costal = near & (np.vstack([KEEP[k]['v'] for k in keys]).mean(0) is not None)
            cpts = fv[near]
            lat = cpts[((cpts - allv.mean(0)) @ (-md)) > -5]
            if len(lat) < 8:
                continue
            if fk == 'fisObl':
                out = []
                for z0 in np.arange(lat[:, 2].min(), lat[:, 2].max() + 5, 5):
                    mm_ = np.abs(lat[:, 2] - z0) < 3
                    if mm_.sum() >= 2:
                        b_ = lat[mm_]; out.append(b_[np.argmax(b_ @ (-md))])
                q = np.array(out) if len(out) >= 3 else None
            else:
                yy = lat[:, 1]; out = []
                for y0 in np.arange(yy.min(), yy.max() + 6, 6):
                    mm_ = (yy >= y0) & (yy < y0 + 6)
                    if mm_.sum() >= 2:
                        out.append(lat[mm_].mean(0))
                q = np.array(out) if len(out) >= 3 else None
            if q is None:
                continue
            FIS_OFF[0] = 4.0
            tube(fk + side, snap(smooth(q, 9), keys, 4.0), '#ffffff', r=1.2)
            FIS_OFF[0] = 2.4
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
