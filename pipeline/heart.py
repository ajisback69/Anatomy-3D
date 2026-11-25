"""হার্টের 3D ডেটা তৈরি: BodyParts3D-এর হার্ট থেকে প্রকোষ্ঠ ভাগ, পৃষ্ঠ, ল্যান্ডমার্ক, রক্তনালী, স্কিম্যাটিক অংশ আর সারফেস মার্কিং।

ব্যবহার: python pipeline/heart.py
আউটপুট: bones/heart/data/core.js, layers.js

পদ্ধতি (সব মেশ থেকে মাপা):
1. হার্টের দেয়াল (FMA7274) একটা ভরাট সলিড। ১ মিমি ভক্সেলে ভরাট করা হয়, বড় রক্তনালীগুলোও ভরাট করে মুখ বন্ধ করা হয়।
   তখন ভেতরের ফাঁকা জায়গা দুটো আলাদা গহ্বর হয়: ডান হার্ট আর বাম হার্ট।
2. প্রতিটা গহ্বরকে AV ভাল্‌ভের annulus-এর তল দিয়ে কাটা হয়: উপরের অংশ atrium, নিচের অংশ ventricle।
3. দেয়ালের প্রতিটা বিন্দু যে গহ্বরের সবচেয়ে কাছে, সেই প্রকোষ্ঠের অংশ। ভেতরের দিকের (endocardial) পৃষ্ঠ আলাদা চিহ্নিত।
4. বাইরের পৃষ্ঠ (sternocostal, diaphragmatic, left, base) ঠিক হয় পৃষ্ঠের দিক আর প্রকোষ্ঠ দেখে।
স্ক্যানে যা নেই (aortic valve, chordae, conducting system, moderator band, small cardiac vein) সেগুলো স্কিম্যাটিক।
"""
import os, sys, json
import numpy as np
import trimesh
import scipy.ndimage as nd
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, STL

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'heart', 'data')
CACHE = os.path.join(os.path.dirname(__file__), '..', '.cache')
P = 1.0  # ভক্সেল, মিমি

WALL = 'FMA7274'
TRI, MIT, PUL = 'FMA7234', 'FMA7235', 'FMA7246'
PAP = {'rvAnt': 'FMA7260', 'rvPost': 'FMA7261', 'rvSept': 'FMA7262', 'lvPost': 'FMA7266', 'lvAnt': 'FMA9352nsn'}
ART = {'rcaTrunk': 'FMA3802', 'rcaMarg': 'FMA3818', 'pda': 'FMA3840nsn', 'rcaPL': 'FMA76994', 'rcaSept': 'FMA71669',
       'lcaStem': 'FMA4685', 'lad': 'FMA3862nsn', 'lcx': 'FMA3895', 'ladSept': 'FMA71670'}
VEN = {'cs': 'FMA4706', 'gcv': 'FMA4707', 'mcv': 'FMA4713', 'acv': 'FMA71567', 'plv': 'FMA76751'}
GREAT = {'aoAsc': 'FMA3736', 'aoArch': 'FMA3768', 'svc': 'FMA4720', 'ivc': 'FMA10951', 'pt': 'FMA66326', 'pv': 'FMA66643'}
CC = {'R': ['FMA7875', 'FMA7886', 'FMA7913', 'FMA7976', 'FMA8070', 'FMA8194', 'FMA8248'],
      'L': ['FMA8005', 'FMA8031', 'FMA8058', 'FMA8167', 'FMA8112', 'FMA8221', 'FMA8275']}
RIB = {'R': ['FMA7857', 'FMA7882', 'FMA7909', 'FMA7957', 'FMA8066', 'FMA8175', 'FMA8229'],
       'L': ['FMA7987', 'FMA8012', 'FMA8039', 'FMA8148', 'FMA8093', 'FMA8202', 'FMA8256']}
STERNUM = ['FMA7486', 'FMA7487', 'FMA7488']
CH = {1: 'RA', 2: 'RV', 3: 'LA', 4: 'LV', 5: 'RAu', 6: 'LAu'}


def main_body(m):
    return max(m.split(only_watertight=False), key=lambda b: len(b.faces))


def unit(v):
    v = np.asarray(v, float)
    return v / (np.linalg.norm(v, axis=-1, keepdims=True) + 1e-12)


# ---------------------------------------------------------------- ভক্সেল ভাগ
def segment(W):
    os.makedirs(CACHE, exist_ok=True)
    cf = os.path.join(CACHE, 'heart_seg.npz')
    if os.path.exists(cf):
        z = np.load(cf)
        return z['lab'], z['lo'], z['pouch'], z['outside']
    lo = W.bounds[0] - 6
    shape = np.ceil((W.bounds[1] + 6 - lo) / P).astype(int) + 1

    def vox(m, fill=True):
        g = np.zeros(shape, bool)
        v = m.voxelized(P)
        if fill:
            v = v.fill()
        idx = np.round((v.points - lo) / P).astype(int)
        ok = ((idx >= 0) & (idx < shape)).all(1)
        g[tuple(idx[ok].T)] = True
        return g
    wall = vox(W)
    ves = np.zeros(shape, bool)
    hi = lo + shape * P
    for k in ['svc', 'ivc', 'aoAsc', 'aoArch', 'pt', 'pv']:
        for b in load(GREAT[k]).split(only_watertight=False):
            if (b.bounds[1] < lo).any() or (b.bounds[0] > hi).any():
                continue
            ves |= vox(b)
    lab0, n = nd.label(~(wall | ves))
    sz = np.bincount(lab0.ravel())
    order = [i for i in np.argsort(sz)[::-1] if i][:3]   # বাইরে, আর দুটো গহ্বর
    toi = lambda p: tuple(np.round((np.asarray(p) - lo) / P).astype(int))
    side = {}
    for i in order[1:]:
        pts = np.argwhere(lab0 == i) * P + lo
        side['R' if np.linalg.norm(pts.mean(0) - load(TRI).vertices.mean(0)) < np.linalg.norm(pts.mean(0) - load(MIT).vertices.mean(0)) else 'L'] = i
    lab = np.zeros(shape, np.uint8)
    for s, valve, ids in (('R', TRI, (1, 2)), ('L', MIT, (3, 4))):
        cav = lab0 == side[s]
        c, n = annulus(valve)
        idx = np.argwhere(cav)
        d = (idx * P + lo - c) @ n
        cv = cav.copy()
        cv[tuple(idx[np.abs(d) <= 1.0].T)] = False
        l2, k = nd.label(cv)
        s2 = np.bincount(l2.ravel())
        big = [i for i in np.argsort(s2)[::-1] if i][:2]
        for i in big:
            dm = ((np.argwhere(l2 == i) * P + lo - c) @ n).mean()
            lab[l2 == i] = ids[0] if dm < 0 else ids[1]
        # বাকি (তলের ভক্সেল, ছোট টুকরো) সবচেয়ে কাছের প্রকোষ্ঠে
        rest = cav & (lab == 0)
        _, ind = nd.distance_transform_edt(~np.isin(lab, ids), return_indices=True)
        r = np.argwhere(rest)
        lab[tuple(r.T)] = lab[tuple(ind[:, r[:, 0], r[:, 1], r[:, 2]])]
    # auricle: অলিন্দের সরু থলি (morphological opening-এ যা বাদ পড়ে)
    pouch = np.zeros(shape, np.uint8)
    ball = nd.generate_binary_structure(3, 1)
    ball = nd.iterate_structure(ball, 6)
    for a, au in ((1, 5), (3, 6)):
        cav = lab == a
        op = nd.binary_opening(cav, structure=ball)
        rem = cav & ~op
        l3, k = nd.label(rem)
        s3 = np.bincount(l3.ravel())
        best = None
        main_c = np.argwhere(op).mean(0) * P + lo
        for i in [i for i in np.argsort(s3)[::-1] if i][:6]:
            pts = np.argwhere(l3 == i) * P + lo
            cc = pts.mean(0)
            # সামনে আর উপরে থাকা সবচেয়ে বড় থলি (BodyParts3D: y কম = সামনে, z বেশি = উপরে)
            score = s3[i] * (1 if (cc[1] < main_c[1] and cc[2] > main_c[2] - 10) else 0.05)
            if best is None or score > best[0]:
                best = (score, i, cc, s3[i])
        pouch[l3 == best[1]] = au
        print(f'  auricle {CH[au]}: {best[3]} ভক্সেল, কেন্দ্র {best[2].round(0)}')
    outside = lab0 == order[0]
    np.savez_compressed(cf, lab=lab, lo=lo, pouch=pouch, outside=outside)
    return lab, lo, pouch, outside


def annulus(valve, q=0.15):
    """AV ভাল্‌ভের annulus-এর তল: ভাল্‌ভের atrium-দিকের অংশের (প্রথম 15%) PCA তল। n atrium থেকে ventricle-এর দিকে।"""
    G = np.vstack([load(ART['rcaTrunk']).vertices, load(ART['lcx']).vertices, load(VEN['cs']).vertices])
    C = G.mean(0)
    _, _, vt = np.linalg.svd(G - C, full_matrices=False)
    N = vt[2]
    if (load(PAP['lvPost']).vertices.mean(0) - C) @ N < 0:
        N = -N
    V = load(valve).vertices
    d = (V - C) @ N
    R = V[d < np.quantile(d, q)]
    c = R.mean(0)
    _, _, vt = np.linalg.svd(R - c, full_matrices=False)
    n = vt[2]
    if n @ N < 0:
        n = -n
    return c, n


def ring_info(valve):
    c, n = annulus(valve)
    V = load(valve).vertices
    d = (V - c) @ n
    R = V[np.abs(d) < 3]
    # annulus-এর পরিধি: তলে প্রজেক্ট করা বিন্দুগুলোর convex hull-এর পরিধি; r = সমান পরিধির বৃত্তের ব্যাসার্ধ
    from scipy.spatial import ConvexHull
    e1 = unit(np.cross(n, [0, 0, 1]))
    e2 = np.cross(n, e1)
    q = np.c_[(R - c) @ e1, (R - c) @ e2]
    h = ConvexHull(q)
    per = sum(np.linalg.norm(q[h.vertices[i]] - q[h.vertices[i - 1]]) for i in range(len(h.vertices)))
    return c, n, per / (2 * np.pi)


# ---------------------------------------------------------------- মূল কাজ
def build():
    W = main_body(load(WALL))
    C0 = (W.bounds[0] + W.bounds[1]) / 2
    F = Frame(C0)
    print('ভক্সেল ভাগ…')
    lab, lo, pouch, outside = segment(W)
    vol = {CH[i]: int((lab == i).sum() * P ** 3 / 1000) for i in (1, 2, 3, 4)}
    print('  গহ্বরের আয়তন (ml):', vol)

    # দেয়াল হালকা করা
    v, f = decimate(W, 64000)
    wm = trimesh.Trimesh(v, f, process=True)
    wm.remove_unreferenced_vertices()
    v, f = wm.vertices, wm.faces
    assert len(v) < 65535
    vn = wm.vertex_normals
    shape = np.array(lab.shape)
    toi = lambda p: np.clip(np.round((p - lo) / P).astype(int), 0, shape - 1)

    # endocardial কি না: বাইরের দিকে ১.৫ মিমি সরে কোন গহ্বরে পড়ে
    s1 = lab[tuple(toi(v + 1.5 * vn).T)]
    s2 = lab[tuple(toi(v + 2.5 * vn).T)]
    endo = np.where(s1 > 0, s1, s2)
    # বাইরের পৃষ্ঠ (epicardium): বাইরে ১.৫–২.৫ মিমি সরলে হার্টের বাইরের ফাঁকা জায়গায় পড়ে
    o1 = outside[tuple(toi(v + 1.5 * vn).T)] | outside[tuple(toi(v + 2.5 * vn).T)]
    # সবচেয়ে কাছের গহ্বর (দেয়ালের পুরুত্ব পেরিয়ে)
    dist, ind = nd.distance_transform_edt(lab == 0, return_indices=True)
    vi = toi(v)
    near = lab[tuple(ind[:, vi[:, 0], vi[:, 1], vi[:, 2]].T.T)] if False else lab[ind[0][tuple(vi.T)], ind[1][tuple(vi.T)], ind[2][tuple(vi.T)]]
    ch = np.where(endo > 0, endo, near).astype(np.uint8)
    # auricle
    pd_, pind = nd.distance_transform_edt(pouch == 0, return_indices=True)
    pi = pouch[pind[0][tuple(vi.T)], pind[1][tuple(vi.T)], pind[2][tuple(vi.T)]]
    pdist = pd_[tuple(vi.T)]
    for a, au in ((1, 5), (3, 6)):
        sel = (ch == a) & (pi == au) & (pdist < dist[tuple(vi.T)] + 2.5)
        ch[sel] = au
    isendo = endo > 0
    epi_v = ~isendo & o1
    # প্রতিবেশী দিয়ে মসৃণ করা (ছোট ছোট দ্বীপ বাদ)
    nb = wm.vertex_neighbors
    for _ in range(3):
        new = ch.copy()
        for i in range(len(v)):
            if not nb[i]:
                continue
            vals = ch[nb[i]][isendo[nb[i]] == isendo[i]]
            if len(vals) >= 3:
                b = np.bincount(vals, minlength=7)
                if b[ch[i]] < 2:
                    new[i] = b.argmax()
        ch = new
    part = ch + np.where(isendo, 10, 0)

    # ভিউয়ারের স্থানাঙ্কে দিক
    nv = F.tf_dir(vn)
    # বাইরের পৃষ্ঠ: 1 sternocostal, 2 diaphragmatic, 3 left, 4 base
    # সংজ্ঞা দেখার দিক দিয়ে: সামনে থেকে যা দেখা যায় = sternocostal; নিচ থেকে দেখা ventricle = diaphragmatic;
    # পেছন থেকে দেখা atrium = base; বাকি যা বাম থেকে দেখা যায় = left surface।
    fc = v[f].mean(1)
    fa = wm.area_faces
    fn = wm.face_normals
    fch = ch[f].max(1) * 0 + np.array([np.bincount(r_, minlength=7).argmax() for r_ in ch[f]])
    fendo = (~epi_v)[f].sum(1) >= 2
    def visible(d, cell=1.5, tol=2.0):
        d = unit(d)
        a_ = unit(np.cross(d, [0, 0, 1] if abs(d[2]) < .9 else [1, 0, 0]))
        b_ = np.cross(d, a_)
        s_ = np.floor(fc @ a_ / cell).astype(np.int64)
        t_ = np.floor(fc @ b_ / cell).astype(np.int64)
        dep = fc @ d
        key = (s_ + 100000) * 200000 + (t_ + 100000)
        o = np.lexsort((dep, key))
        k = key[o]
        start = np.r_[True, k[1:] != k[:-1]]
        firstdep = np.maximum.accumulate(np.where(start, np.arange(len(o)), 0))
        vis = np.zeros(len(fc), bool)
        vis[o] = dep[o] - dep[o][firstdep] < tol
        return vis & (fn @ d < 0) & ~fendo
    DIRS = {'front': [0, 1, 0], 'below': [0, 0, 1], 'behind': [0, -1, 0], 'left': [-1, 0, 0]}
    VIS = {k: visible(d) for k, d in DIRS.items()}
    fvent = np.isin(fch, (2, 4))
    fsurf = np.zeros(len(f), np.uint8)
    fsurf[VIS['left']] = 3
    fsurf[VIS['behind'] & ~fvent] = 4
    fsurf[VIS['below'] & fvent] = 2
    fsurf[VIS['front']] = 1
    # না দেখা বাইরের মুখগুলো প্রতিবেশী থেকে
    adj = wm.face_adjacency
    for _ in range(30):
        miss = (fsurf == 0) & ~fendo
        if not miss.any():
            break
        cand = np.zeros((len(f), 5), int)
        for x_, y_ in ((0, 1), (1, 0)):
            np.add.at(cand, (adj[:, x_], fsurf[adj[:, y_]]), 1)
        cand[:, 0] = 0
        fill = miss & (cand.max(1) > 0)
        fsurf[fill] = cand[fill].argmax(1)
    surf = np.zeros(len(v), np.uint8)
    for k_ in (3, 4, 2, 1):
        surf[np.unique(f[fsurf == k_].ravel())] = k_
    surf[~epi_v] = 0

    # এলাকা অনুযায়ী ভাগ: প্রতিটা পৃষ্ঠ তার নিজের দিক থেকে দেখলে কোন প্রকোষ্ঠ কতটা (বইয়ের ২/৩–১/৩ মেলানোর জন্য)
    base_f = np.where(fch == 5, 1, np.where(fch == 6, 3, fch))
    frac = {}
    for s_, nm, dk in ((1, 'sternocostal', 'front'), (2, 'diaphragmatic', 'below'), (3, 'left', 'left'), (4, 'base', 'behind')):
        m_ = (fsurf == s_) & VIS[dk]
        w_ = fa * np.abs(fn @ unit(DIRS[dk]))
        tot = w_[m_].sum()
        frac[nm] = {CH[c]: round(float(w_[m_ & (base_f == c)].sum() / tot), 3) for c in (1, 2, 3, 4) if w_[m_ & (base_f == c)].sum() / tot > 0.005}
    print('  পৃষ্ঠের ভাগ:', json.dumps(frac))
    vA = np.zeros(len(v))
    np.add.at(vA, f.ravel(), np.repeat(fa / 3, 3))
    base_ch = np.where(ch == 5, 1, np.where(ch == 6, 3, ch))

    # ------------------------------------------------ মাপ
    kd = cKDTree(v)
    epi = epi_v   # রক্তনালীর মুখের ভেতরের দেয়াল বাদ
    meas = {}
    # দেয়ালের পুরুত্ব: free wall-এর বাইরের বিন্দু থেকে নিজের গহ্বর
    for c, nm in ((2, 'RV'), (4, 'LV'), (1, 'RA'), (3, 'LA')):
        cav = lab == c
        dt = nd.distance_transform_edt(~cav) * P
        sel = epi & (ch == c) & (surf != 0)
        vals = dt[tuple(toi(v[sel]).T)]
        meas['wall_' + nm] = round(float(np.median(vals)), 1)
    # apex, base, মাপ
    atr_pts = v[epi & np.isin(ch, (1, 3)) & (surf == 4)]
    base_c = atr_pts.mean(0)
    vent = np.where(epi & np.isin(ch, (2, 4)))[0]
    apex_i = vent[np.argmax(np.linalg.norm(v[vent] - base_c, axis=1))]
    if ch[apex_i] != 4:
        lvv = np.where(epi & (ch == 4))[0]
        apex_i = lvv[np.argmax(np.linalg.norm(v[lvv] - base_c, axis=1))]
    axis = unit(v[apex_i] - base_c)
    proj = (v[epi] - base_c) @ axis
    meas['apexBase'] = round(float(proj.max() - min(proj.min(), 0)) / 10, 1)
    vv = F.tf(v[epi])
    meas['transverse'] = round(float(vv[:, 0].max() - vv[:, 0].min()) / 10, 1)
    meas['ap'] = round(float(vv[:, 2].max() - vv[:, 2].min()) / 10, 1)
    for k, valve in (('tri', TRI), ('mit', MIT)):
        c, n, r = ring_info(valve)
        meas['circ_' + k] = round(2 * np.pi * r / 10, 1)
    meas['vol'] = vol
    meas['frac'] = frac
    print('  মাপ:', meas)

    # ------------------------------------------------ ল্যান্ডমার্ক
    LM = []
    def addlm(id_, p, n, **kw):
        LM.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=unit(F.tf_dir(n)).round(3).tolist(), **kw))
    def on_wall(p, mask, k=1):
        idx = np.where(mask)[0]
        t = cKDTree(v[idx])
        d, j = t.query(p)
        return idx[j]
    def lm_v(id_, i, **kw):
        addlm(id_, v[i], vn[i], **kw)

    cav_c = {c: np.argwhere(lab == c).mean(0) * P + lo for c in (1, 2, 3, 4)}
    # বাইরের
    lm_v('apex', apex_i)
    bi = on_wall(atr_pts.mean(0) + 0, epi & (surf == 4))
    lm_v('base', bi)
    for s, id_ in ((1, 'sternocostal'), (2, 'diaphragmatic'), (3, 'leftSurf')):
        m = epi & (surf == s)
        cc = v[m].mean(0)
        # কেন্দ্রের কাছের বিন্দু, যার দিক পৃষ্ঠের গড় দিকের সাথে মেলে
        idx = np.where(m)[0]
        mean_n = unit(vn[idx].mean(0))
        score = np.linalg.norm(v[idx] - cc, axis=1) - 25 * (vn[idx] @ mean_n)
        lm_v(id_, idx[np.argmin(score)])
    # বর্ডার
    vvA = F.tf(v)
    def border(a, b, pick):
        """দুই পৃষ্ঠের সীমানার বিন্দু"""
        idx = [i for i in np.where(epi & (surf == a))[0] if any(surf[j] == b for j in nb[i])]
        idx = np.array(idx)
        return idx[pick(vvA[idx])]
    ra = np.where(epi & (ch == 1))[0]
    ymid = np.median(vvA[ra, 1])
    rr = ra[np.abs(vvA[ra, 1] - ymid) < 12]
    lm_v('rightBorder', rr[np.argmin(vvA[rr, 0])])
    ib = border(1, 2, lambda P_: np.argmin(np.abs(P_[:, 0] - np.median(P_[:, 0]))))
    lm_v('infBorder', ib)
    lb = border(1, 3, lambda P_: np.argmin(np.abs(P_[:, 1] - np.median(P_[:, 1]))))
    lm_v('leftBorder', lb)
    # খাঁজ: রক্তনালী যেখানে বসে
    def vessel_mid(fma, q=0.5, ref=None):
        V = load(fma).vertices
        if ref is not None:
            d = np.linalg.norm(V - ref, axis=1)
            return V[np.argsort(d)[int(len(d) * q)]]
        return V[np.argmin(np.linalg.norm(V - V.mean(0), axis=1))]
    lad = load(ART['lad']).vertices
    pda = load(ART['pda']).vertices
    cs = load(VEN['cs']).vertices
    lm_v('antIVgroove', on_wall(lad[np.argmin(np.abs(np.linalg.norm(lad - v[apex_i], axis=1) - 45))], epi))
    lm_v('postIVgroove', on_wall(pda[np.argsort(np.linalg.norm(pda - cs.mean(0), axis=1))[len(pda) // 2]], epi))
    rca = load(ART['rcaTrunk']).vertices
    rca_low = rca[rca[:, 2] < np.quantile(rca[:, 2], 0.6)]
    lm_v('avGrooveR', on_wall(rca_low[np.argmin(np.linalg.norm(rca_low - rca_low.mean(0), axis=1))], epi))
    lcx = load(ART['lcx']).vertices
    stem = load(ART['lcaStem']).vertices.mean(0)
    lcx_near = lcx[np.argsort(np.linalg.norm(lcx - stem, axis=1))[len(lcx) // 5]]
    lm_v('avGrooveL', on_wall(lcx_near, epi))
    lm_v('avGrooveP', on_wall(cs.mean(0), epi))
    crux = pda[np.argmin(np.linalg.norm(pda - cs.mean(0), axis=1))]
    lm_v('crux', on_wall(crux, epi))
    lm_v('incisura', on_wall(lad[np.argmin(np.linalg.norm(lad - v[apex_i], axis=1))], epi))
    svc = load(GREAT['svc']).vertices
    ivc = load(GREAT['ivc']).vertices
    ivc = ivc[ivc[:, 2] > ivc[:, 2].max() - 40]
    svc_low = svc[svc[:, 2] < svc[:, 2].min() + 6].mean(0)
    ivc_top = ivc[ivc[:, 2] > ivc[:, 2].max() - 6].mean(0)
    mid = (svc_low + ivc_top) / 2
    raE = np.where(epi & (ch == 1))[0]
    near_mid = raE[np.linalg.norm(v[raE] - mid, axis=1) < 45]
    lm_v('sulcusTerm', near_mid[np.argmin(v[near_mid, 0] - 0.4 * v[near_mid, 1])])  # ডানে আর একটু পেছনে
    # interatrial groove: base-এ RA আর LA-র সীমানা
    ia = [i for i in np.where(epi & (ch == 1) & (surf == 4))[0] if any(ch[j] == 3 for j in nb[i])]
    ia = np.array(ia)
    nvA = F.tf_dir(vn)
    lm_v('iaGroove', ia[np.argmin(0.5 * np.abs(vvA[ia, 1] - np.median(vvA[ia, 1])) + 20 * nvA[ia, 2])])
    for au, id_, base in ((5, 'rAuricle', 1), (6, 'lAuricle', 3)):
        idx = np.where(epi & (ch == au))[0]
        if len(idx):
            lm_v(id_, idx[np.argmax(np.linalg.norm(v[idx] - cav_c[base], axis=1))])
    # বড় রক্তনালীর মুখ (বাইরে থেকে)
    ao = load(GREAT['aoAsc']).vertices
    pt = load(GREAT['pt']).vertices
    pt_root = load(PUL).vertices.mean(0)
    addlm('aortaRoot', ao[ao[:, 2] < ao[:, 2].min() + 12].mean(0) + np.array([0, -14, 4]), [0, -1, 0.3])
    addlm('ptRoot', pt_root + unit(pt_root - cav_c[2]) * 12, unit(pt_root - cav_c[2]))
    addlm('svcEnd', svc_low + np.array([-10, -2, 8]), [-1, -0.3, 0])
    addlm('ivcEnd', ivc_top + np.array([-11, 0, -10]), [-1, 0, 0])

    # ------------------------------------------------ ভেতরের ল্যান্ডমার্ক
    endo_of = lambda c: isendo & (ch == c)
    def endo_near(p, c):
        return on_wall(p, endo_of(c) | ((ch == c + 4) & isendo if c in (1,) else endo_of(c)))
    # RA
    lm_v('svcOpen', on_wall(svc_low, endo_of(1)), cut='ra')
    lm_v('ivcOpen', on_wall(ivc_top, endo_of(1)), cut='ra')
    racav = np.argwhere(lab == 1) * P + lo
    rk = cKDTree(racav)
    dcs, _ = rk.query(cs)
    cs_open = cs[dcs < np.quantile(dcs, 0.08)].mean(0)
    lm_v('csOpen', on_wall(cs_open, endo_of(1)), cut='ra')
    tc, tn, tr = ring_info(TRI)
    addlm('triOrifice', tc - tn * 3, -tn, cut=['ra', 'rv', 'four'])
    # septum: RA endo যার কাছে LA গহ্বর
    la_dt = nd.distance_transform_edt(lab != 3) * P
    raI = np.where(endo_of(1))[0]
    dla = la_dt[tuple(toi(v[raI]).T)]
    sept = raI[dla < 7]
    w = dla[dla < 7] + 0.06 * np.linalg.norm(v[sept] - ivc_top, axis=1)
    fo = sept[np.argmin(w)]
    lm_v('fossaOvalis', fo, cut='ra')
    meas['septum_fossa'] = round(float(la_dt[tuple(toi(v[fo]))]), 1)
    up = unit(np.array([0, 0, 1.0]))
    lim = sept[np.argmin(np.abs(np.linalg.norm(v[sept] - (v[fo] + up * 9), axis=1)))]
    lm_v('limbus', lim, cut='ra')
    raL = raI[np.linalg.norm(v[raI] - mid, axis=1) < 30]
    crista = raL[np.argmin(v[raL, 0] - 0.5 * v[raL, 1])]
    lm_v('cristaTerm', crista, cut='ra')
    rau = np.where(isendo & (ch == 5))[0]
    if len(rau):
        lm_v('musPect', rau[np.argmin(np.linalg.norm(v[rau] - v[rau].mean(0), axis=1))], cut='ra')
    # Koch-এর ত্রিভুজ: CS-এর মুখ আর tricuspid-এর septal অংশের মাঝে
    tri_v = load(TRI).vertices
    tsep = tri_v[np.argmin(np.linalg.norm(tri_v - cs_open, axis=1))]
    koch_p = (cs_open + tsep) / 2 + up * 5
    avn = on_wall(koch_p, endo_of(1))
    lm_v('avNode', avn, cut=['ra', 'cond'])
    aok = cKDTree(ao)
    d_ao, _ = aok.query(v[raI])
    lm_v('torus', raI[np.argmin(d_ao)], cut='ra')
    # SA node: SVC-র মুখের সামনে-ডান দিক, বাইরের পৃষ্ঠে
    ring_svc = svc[svc[:, 2] < svc[:, 2].min() + 8]
    sa_p = ring_svc[np.argmin(ring_svc[:, 0] + 0.6 * ring_svc[:, 1])]
    san = on_wall(sa_p, epi & (ch == 1))
    lm_v('saNode', san, cut=['cond'])
    # RV
    pc = load(PUL).vertices.mean(0)
    pn = unit(pc - cav_c[2])
    addlm('pulOrifice', pc - pn * 4, -pn, cut=['rv'])
    rvI = np.where(endo_of(2))[0]
    lm_v('infund', on_wall(pc - pn * 18, endo_of(2)), cut='rv')
    sv_c = on_wall((tc + pc) / 2, endo_of(2))
    lm_v('svCrest', sv_c, cut='rv')
    lv_dt = nd.distance_transform_edt(lab != 4) * P
    drv = lv_dt[tuple(toi(v[rvI]).T)]
    rvsept = rvI[drv < 14]
    ap = load(PAP['rvAnt']).vertices
    # papillary-র গোড়া: ভাল্‌ভ থেকে সবচেয়ে দূরের অংশ
    def pap_base_tip(fma, valve_c):
        V = load(fma).vertices
        d = np.linalg.norm(V - valve_c, axis=1)
        return V[d > np.quantile(d, .9)].mean(0), V[d < np.quantile(d, .1)].mean(0)
    apb, apt = pap_base_tip(PAP['rvAnt'], tc)
    sm_sept = rvsept[np.argmin(np.linalg.norm(v[rvsept] - apb, axis=1) + 0.0)]
    lm_v('rvSeptum', rvsept[np.argmin(np.linalg.norm(v[rvsept] - v[rvsept].mean(0), axis=1))], cut=['rv', 'four'])
    for k, id_, vc in (('rvAnt', 'papRvAnt', tc), ('rvPost', 'papRvPost', tc), ('rvSept', 'papRvSept', tc),
                       ('lvAnt', 'papLvAnt', None), ('lvPost', 'papLvPost', None)):
        V = load(PAP[k]).vertices
        c = V.mean(0)
        vc_ = tc if k.startswith('rv') else ring_info(MIT)[0]
        addlm(id_, c, unit(vc_ - c), cut=['rv', 'valve'] if k.startswith('rv') else ['lv', 'valve'])
    # LA
    mc, mn, mr = ring_info(MIT)
    addlm('mitOrifice', mc - mn * 3, -mn, cut=['la', 'lv', 'four'])
    lacav = np.argwhere(lab == 3) * P + lo
    lk = cKDTree(lacav)
    pvs = []
    for b in load(GREAT['pv']).split(only_watertight=False):
        if len(b.faces) < 1000:
            continue
        d, _ = lk.query(b.vertices)
        if d.min() > 8:
            continue
        op = b.vertices[d < d.min() + 3].mean(0)
        pvs.append(op)
    for op in pvs:
        sd = 'R' if op[0] < cav_c[3][0] else 'L'
        others = [q for q in pvs if (q[0] < cav_c[3][0]) == (sd == 'R')]
        hi_ = 'Sup' if op[2] >= max(q[2] for q in others) - 1e-6 else 'Inf'
        lm_v('pv' + sd + hi_, on_wall(op, endo_of(3)), cut='la')
    lau = np.where(isendo & (ch == 6))[0]
    if len(lau):
        lm_v('laAuricleIn', lau[np.argmin(np.linalg.norm(v[lau] - v[lau].mean(0), axis=1))], cut='la')
    laI = np.where(endo_of(3))[0]
    lm_v('laSeptum', laI[np.argmin(np.linalg.norm(v[laI] - v[fo], axis=1))], cut='la')
    # LV
    ao_low = ao[ao[:, 2] < ao[:, 2].min() + 4].mean(0)
    aon = unit(ao[ao[:, 2] > ao[:, 2].min() + 20].mean(0) - ao_low)
    addlm('aorOrifice', ao_low - aon * 3, -aon, cut=['lv', 'four'])
    lvI = np.where(endo_of(4))[0]
    lm_v('aorVest', on_wall(ao_low - aon * 16, endo_of(4)), cut='lv')
    rv_dt = nd.distance_transform_edt(lab != 2) * P
    dlv = rv_dt[tuple(toi(v[lvI]).T)]
    lvsept = lvI[dlv < 14]
    lm_v('ivsMusc', lvsept[np.argmin(np.linalg.norm(v[lvsept] - v[lvsept].mean(0), axis=1))], cut=['lv', 'four'])
    # membranous septum: aortic root-এর ঠিক নিচে septum-এর উপরের অংশ
    memb = lvsept[np.argmin(np.linalg.norm(v[lvsept] - (ao_low - aon * 8), axis=1))]
    lm_v('ivsMemb', memb, cut=['lv'])
    lm_v('lvApexIn', lvI[np.argmin(np.linalg.norm(v[lvI] - v[apex_i], axis=1))], cut=['lv', 'four'])
    # ভাল্‌ভের অংশ
    addlm('triValve', tri_v.mean(0), -tn, cut=['valve'])
    addlm('mitValve', load(MIT).vertices.mean(0), -mn, cut=['valve'])
    addlm('pulValve', pc, pn, cut=['valve'])

    # ------------------------------------------------ মেশ
    core_meshes = [pack(F, 'heart', 'bone', v, f, regions=surf, key='heart')]
    import base64
    core_meshes[0]['p'] = base64.b64encode(part.astype(np.uint8).tobytes()).decode()

    # coronary territory (নিকটতম ধমনী, আনুমানিক)
    terr = np.zeros(len(v), np.uint8)
    T = []
    for k, t in (('rcaTrunk', 1), ('rcaMarg', 1), ('pda', 1), ('rcaPL', 1), ('rcaSept', 1), ('lad', 2), ('ladSept', 2), ('lcx', 3)):
        V = load(ART[k]).vertices
        T.append((V, np.full(len(V), t)))
    TV = np.vstack([a for a, _ in T])
    TT = np.concatenate([b for _, b in T])
    d, j = cKDTree(TV).query(v)
    terr = TT[j].astype(np.uint8)
    core_meshes[0]['t'] = base64.b64encode(terr.tobytes()).decode()

    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    wk = cKDTree(v)
    def addm(key, group, fma, target, layer=None, crop=None, keep=None):
        m = load(fma)
        if crop is not None or keep is not None:
            d, _ = wk.query(m.vertices)
            ok = d < crop if crop is not None else np.ones(len(d), bool)
            if keep is not None:
                ok &= keep(m.vertices)
            kf = ok[m.faces].all(1)
            if kf.sum() < 20:
                return
            m = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
            m.remove_unreferenced_vertices()
        vv, ff = decimate(m, target)
        e = pack(F, key, group, vv, ff, key=key)
        if layer:
            e['layer'] = layer
        lay['meshes'].append(e)
    for k, fma in PAP.items():
        addm(k, 'pap', fma, 1500, 'valve')
    addm('tri', 'valve', TRI, 6000, 'valve')
    addm('mit', 'valve', MIT, 5000, 'valve')
    addm('pul', 'valve', PUL, 4000, 'valve')
    for k, fma in ART.items():
        addm(k, 'artery', fma, 2500 if k in ('lad', 'lcx', 'rcaTrunk', 'rcaMarg') else 1200, 'artery')
    for k, fma in VEN.items():
        addm(k, 'vein', fma, 2000, 'vein')
    # রক্তনালীর বিন্দু: যে দিক থেকে নালীটা সাধারণত দেখা হয় (বইয়ের চিত্রের মতো), সেই দিকে নালীর মাঝের অংশের সবচেয়ে বাইরের বিন্দু
    hc = (W.bounds[0] + W.bounds[1]) / 2
    ANT, INF, POST, LEFT = [0, -1, 0.1], [0, -0.3, -1], [0, 1, -0.2], [1, 0, 0]
    PREF = {'rcaTrunk': ANT, 'rcaMarg': ANT, 'lcaStem': [0.4, -1, 0.3], 'lad': ANT, 'ladSept': ANT, 'rcaSept': INF, 'pda': INF, 'rcaPL': INF,
            'lcx': LEFT, 'cs': POST, 'gcv': [0.5, -1, 0], 'mcv': INF, 'acv': ANT, 'plv': INF}
    for k, fma in list(ART.items()) + list(VEN.items()):
        V = load(fma).vertices
        d0 = unit(np.array(PREF.get(k, ANT), float))
        s = (V - hc) @ d0
        front = V[s > np.quantile(s, 0.7)]            # সেই দিকের অংশ
        dd = np.linalg.norm(front - front.mean(0), axis=1)
        cand = front[dd < np.quantile(dd, 0.5)]        # তার মাঝখান
        lay['anchors'][k] = F.tf(cand[np.argmax((cand - hc) @ d0)]).round(2).tolist()
    addm('aoAsc', 'artery', GREAT['aoAsc'], 2500, 'great')
    addm('aoArch', 'artery', GREAT['aoArch'], 2500, 'great')
    addm('svc', 'vein', GREAT['svc'], 1500, 'great')
    addm('ivc', 'vein', GREAT['ivc'], 1500, 'great', keep=lambda X: X[:, 2] > W.bounds[0][2] - 25)
    addm('pt', 'pa', GREAT['pt'], 4000, 'great', crop=22)
    addm('pv', 'pvein', GREAT['pv'], 3000, 'great', crop=13)

    # স্কিম্যাটিক: aortic valve (annulus ring + ৩ cusp-এর আভাস)
    ring = []
    e1 = unit(np.cross(aon, [1, 0, 0]))
    e2 = np.cross(aon, e1)
    rad = 11
    for a in np.linspace(0, 2 * np.pi, 37):
        ring.append(ao_low + rad * (np.cos(a) * e1 + np.sin(a) * e2))
    lay['tubes'].append(dict(key='aorValve', layer='valve', group='valve', col='#f3e3b0', r=1.2, pts=F.tf(np.array(ring)).round(2).tolist()))
    for k3 in range(3):
        a0 = 2 * np.pi * k3 / 3
        cusp = [ao_low + rad * (np.cos(a0 + t) * e1 + np.sin(a0 + t) * e2) - aon * (5 * np.sin(np.pi * t / (2 * np.pi / 3))) for t in np.linspace(0, 2 * np.pi / 3, 9)]
        lay['tubes'].append(dict(key='aorValve', layer='valve', group='valve', col='#f3e3b0', r=0.8, pts=F.tf(np.array(cusp)).round(2).tolist()))
    # chordae tendineae (স্কিম্যাটিক): papillary-র মাথা থেকে ভাল্‌ভের কিনারায়
    for k, valve in (('rvAnt', TRI), ('rvPost', TRI), ('rvSept', TRI), ('lvAnt', MIT), ('lvPost', MIT)):
        V = load(PAP[k]).vertices
        Vv = load(valve).vertices
        vc = Vv.mean(0)
        tip = V[np.argmin(np.linalg.norm(V - vc, axis=1))]
        dd = np.linalg.norm(Vv - tip, axis=1)
        cand = Vv[np.argsort(dd)[:400]]
        # তিনটা ছড়ানো বিন্দু
        picks = [cand[0]]
        for _ in range(3):
            dmin = np.min([np.linalg.norm(cand - q, axis=1) for q in picks], axis=0)
            picks.append(cand[np.argmax(dmin)])
        for q in picks:
            lay['tubes'].append(dict(key='chordae', layer='valve', group='valve', col='#f7f0d8', r=0.35, pts=F.tf(np.array([tip, (tip + q) / 2, q])).round(2).tolist()))
    # moderator band (septomarginal trabecula): RV septum থেকে anterior papillary-র গোড়া
    sp = v[sm_sept] + vn[sm_sept] * 1.0
    mb = [sp, (sp + apb) / 2 + vn[sm_sept] * 3, apb]
    lay['tubes'].append(dict(key='modBand', layer='valve', group='pap', col='#c96b62', r=2.2, pts=F.tf(np.array(mb)).round(2).tolist()))
    lay['anchors']['modBand'] = F.tf(mb[1]).round(2).tolist()

    # Conducting system (স্কিম্যাটিক), endocardium-এর ঠিক ভেতরে
    def along(p0, p1, mask, n=10, off=1.0):
        pts = []
        idx = np.where(mask)[0]
        t = cKDTree(v[idx])
        for s in np.linspace(0, 1, n):
            q = p0 * (1 - s) + p1 * s
            _, j = t.query(q)
            i = idx[j]
            pts.append(v[i] + vn[i] * off)
        return np.array(pts)
    sa = v[san] + vn[san] * -1.5
    av = v[avn] + vn[avn] * 1.0
    lay['spheres'].append(dict(key='saNode', layer='cond', col='#ffd43b', r=3.2, p=F.tf(sa).round(2).tolist()))
    lay['spheres'].append(dict(key='avNode', layer='cond', col='#ffd43b', r=2.6, p=F.tf(av).round(2).tolist()))
    ra_endo = endo_of(1) | (isendo & (ch == 5))
    # internodal tracts
    ant_mid = on_wall(svc_low + np.array([8, -12, -4]), ra_endo)
    post_mid = on_wall(svc_low + np.array([6, 12, -8]), ra_endo)
    tracts = {'intAnt': [sa, v[ant_mid] + vn[ant_mid], av], 'intMid': [sa, v[post_mid] + vn[post_mid], av],
              'intPost': np.vstack([along(sa, v[crista], ra_endo, 6), along(v[crista], ivc_top + (av - ivc_top) * 0.3, ra_endo, 5)[1:], [av]])}
    for k, pts in tracts.items():
        lay['tubes'].append(dict(key='intTract', layer='cond', group='cond', col='#f2c230', r=0.7, pts=F.tf(np.array(pts)).round(2).tolist()))
    # AV bundle: AV node থেকে muscular septum-এর চূড়া
    crest = on_wall(v[memb] + (v[apex_i] - v[memb]) * 0.15, lv_endo := endo_of(4))
    crest_p = (v[crest] + v[memb]) / 2
    bun = np.array([av, (av + crest_p) / 2, crest_p])
    lay['tubes'].append(dict(key='hisBundle', layer='cond', group='cond', col='#ffd43b', r=1.3, pts=F.tf(bun).round(2).tolist()))
    # right bundle: septum বরাবর moderator band হয়ে anterior papillary
    rb = np.vstack([[crest_p], along(crest_p, sp, endo_of(2), 6, 1.2)[1:], mb[1:]])
    lay['tubes'].append(dict(key='rbb', layer='cond', group='cond', col='#ffd43b', r=1.0, pts=F.tf(rb).round(2).tolist()))
    # left bundle: LV septum বরাবর দুই ভাগে দুই papillary-র গোড়ায়
    mitc = mc
    for k in ('lvAnt', 'lvPost'):
        b_, t_ = pap_base_tip(PAP[k], mitc)
        lb_ = np.vstack([[crest_p], along(crest_p, b_, endo_of(4), 7, 1.2)[1:], [b_]])
        lay['tubes'].append(dict(key='lbb', layer='cond', group='cond', col='#ffd43b', r=1.0, pts=F.tf(lb_).round(2).tolist()))
    lay['anchors'].update({'hisBundle': F.tf(bun[1]).round(2).tolist(), 'rbb': F.tf(rb[len(rb) // 2]).round(2).tolist(),
                           'lbb': F.tf(lb_[len(lb_) // 2]).round(2).tolist(), 'intTract': F.tf(tracts['intPost'][3]).round(2).tolist()})
    # small cardiac vein (স্কিম্যাটিক): RCA-র পাশে right AV groove-এ, CS-এর ডান মাথা পর্যন্ত
    rs = rca[np.argsort(rca[:, 2])]
    path = [rs[int(len(rs) * q)] for q in (0.05, 0.25, 0.45)]
    cs_right = cs[np.argmin(cs[:, 0])]
    sc_pts = []
    for q in path + [cs_right]:
        i = on_wall(q, epi)
        sc_pts.append(v[i] + vn[i] * 2.5)
    lay['tubes'].append(dict(key='scv', layer='vein', group='vein', col='#4a78e0', r=1.3, pts=F.tf(np.array(sc_pts)).round(2).tolist()))
    lay['anchors']['scv'] = F.tf(sc_pts[1]).round(2).tolist()

    # ------------------------------------------------ বুকের খাঁচা ও প্রসঙ্গ
    ctx_pts = []
    for s in 'RL':
        for i, fma in enumerate(CC[s]):
            m = load(fma)
            vv, ff = decimate(m, 900)
            lay['meshes'].append(dict(pack(F, f'cc{s}{i+1}', 'cart', vv, ff, key='cc'), layer='ctx'))
            ctx_pts.append(m.vertices)
        for i, fma in enumerate(RIB[s]):
            m = load(fma)
            keep = m.vertices[:, 1] < C0[1] + 10   # শুধু সামনের অর্ধেক
            kf = keep[m.faces].all(1)
            mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
            mm.remove_unreferenced_vertices()
            vv, ff = decimate(mm, 1100)
            lay['meshes'].append(dict(pack(F, f'rib{s}{i+1}', 'rib', vv, ff, key='rib'), layer='ctx'))
            ctx_pts.append(mm.vertices)
    for fma, k in zip(STERNUM, ('manubrium', 'sternumBody', 'xiphoid')):
        m = load(fma)
        vv, ff = decimate(m, 2500)
        lay['meshes'].append(dict(pack(F, k, 'clav', vv, ff, key='sternum'), layer='ctx'))
        ctx_pts.append(m.vertices)
    for k, fmas, g, t, crop in (('lung', ['FMA7333', 'FMA7383', 'FMA7337', 'FMA7370', 'FMA7371'], 'lung', 14000, None),
                                ('dia', ['FMA13295'], 'muscle', 5000, 90), ('eso', ['FMA7131'], 'trachea', 1500, 60),
                                ('trachea', ['FMA7394', 'FMA7409'], 'trachea', 2500, 80), ('aoDesc', ['FMA3784'], 'artery', 2500, 70),
                                ('thymus', ['FMA71194', 'FMA71195'], 'thymus', 1500, None)):
        for fma in fmas:
            if not os.path.exists(os.path.join(STL, fma + '.stl')):
                continue
            m = load(fma)
            if crop:
                d, _ = wk.query(m.vertices)
                kf = (d < crop)[m.faces].all(1)
                if kf.sum() < 20:
                    continue
                m = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
                m.remove_unreferenced_vertices()
            vv, ff = decimate(m, t // len(fmas))
            e = pack(F, k, g, vv, ff, key=k)
            e['layer'] = 'organ' if g in ('lung', 'trachea', 'thymus') else ('muscle' if g == 'muscle' else 'organ')
            lay['meshes'].append(e)
    for k, fma in (('T5', 'FMA9922'), ('T6', 'FMA9945'), ('T7', 'FMA9968'), ('T8', 'FMA9991'), ('T4', 'FMA9248')):
        m = load(fma)
        vv, ff = decimate(m, 1400)
        lay['meshes'].append(dict(pack(F, k, 'vert', vv, ff, key=k), layer='vert'))

    # ------------------------------------------------ সারফেস মার্কিং (Datta পৃ. ৩৪২–৩৪৩)
    surfm = surface_marking(F, C0, lay, ctx_pts, v[epi], {
        'tri': tc, 'mit': mc, 'pul': pc, 'aor': ao_low}, v[apex_i], meas)

    # কাটার তল: প্রতিটা প্রকোষ্ঠের সামনের দেয়াল সরিয়ে ভেতরটা দেখা (ভিউয়ারের স্থানাঙ্কে)
    cc_v = {c: F.tf(cav_c[c]) for c in (1, 2, 3, 4)}
    cuts = {}
    def cut(k, c_pts, vdir, back=4, dist=300):
        vdir = unit(np.array(vdir, float))
        cpt = np.mean([cc_v[c] for c in c_pts], axis=0)
        n = -vdir
        o = float(n @ (cpt + vdir * back))
        cuts[k] = dict(n=n.round(3).tolist(), o=round(o, 1), view=[vdir.round(3).tolist(), dist, cpt.round(1).tolist()])
    cut('ra', [1], [-0.75, 0.1, 0.65], back=2)
    cut('rv', [2], [-0.1, 0.15, 1], back=4)
    cut('la', [3], [0.45, 0.25, -0.85], back=2)
    cut('lv', [4], [0.9, 0.1, 0.4], back=4)
    # চার প্রকোষ্ঠের তল: চার গহ্বরের কেন্দ্র দিয়ে যাওয়া তল
    Q = np.array([cc_v[c] for c in (1, 2, 3, 4)])
    qc = Q.mean(0)
    _, _, vt = np.linalg.svd(Q - qc, full_matrices=False)
    nf = vt[2]
    if nf[2] < 0:
        nf = -nf   # ক্যামেরা সামনের দিকে
    cuts['four'] = dict(n=(-nf).round(3).tolist(), o=round(float(-nf @ qc), 1), view=[nf.round(3).tolist(), 330, qc.round(1).tolist()])
    cuts['valve'] = dict(cuts['four'])
    cuts['valve']['view'] = [nf.round(3).tolist(), 260, qc.round(1).tolist()]
    core = dict(scale=0.02, meshes=core_meshes, lm=LM, meas=meas, surfm=surfm, cuts=cuts)
    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', lay)
    print('ল্যান্ডমার্ক:', len(LM))


def surface_marking(F, C0, lay, ctx_pts, heart_epi, valves, apex, meas):
    """বইয়ের সারফেস মার্কিংয়ের বিন্দু এই মানুষের বুকের খাঁচায় বসানো, আর আসল হার্টের সামনে থেকে দেখা সীমানার সাথে তুলনা।"""
    st = np.vstack([load(f).vertices for f in STERNUM])
    xm = np.median(st[:, 0])   # মধ্যরেখা
    allb = np.vstack(ctx_pts + [st])
    # সামনের দেয়ালের গভীরতা (x,z) → y
    from scipy.interpolate import griddata
    gx, gz = np.meshgrid(np.arange(xm - 140, xm + 141, 4.0), np.arange(C0[2] - 140, C0[2] + 141, 4.0))
    tb = cKDTree(allb[:, [0, 2]])
    gy = np.full(gx.shape, np.nan)
    for (i, j), _ in np.ndenumerate(gx):
        ids = tb.query_ball_point([gx[i, j], gz[i, j]], 7)
        if ids:
            gy[i, j] = allb[ids, 1].min()
    ok = ~np.isnan(gy)
    gyf = griddata(np.c_[gx[ok], gz[ok]], gy[ok], (gx, gz), method='linear')
    gyn = griddata(np.c_[gx[ok], gz[ok]], gy[ok], (gx, gz), method='nearest')
    gyf = np.where(np.isnan(gyf), gyn, gyf)
    gyf = nd.uniform_filter(gyf, 3)
    def front(x, z, off=4):
        i = np.clip((z - gz[0, 0]) / 4, 0, gz.shape[0] - 1.001)
        j = np.clip((x - gx[0, 0]) / 4, 0, gx.shape[1] - 1.001)
        i0, j0 = int(i), int(j)
        a, b = i - i0, j - j0
        y = (gyf[i0, j0] * (1 - a) * (1 - b) + gyf[i0 + 1, j0] * a * (1 - b) + gyf[i0, j0 + 1] * (1 - a) * b + gyf[i0 + 1, j0 + 1] * a * b)
        return np.array([x, y - off, z])
    # স্টার্নামের পাশের কিনারা (প্রতিটা উচ্চতায়)
    zb = np.arange(st[:, 2].min(), st[:, 2].max(), 2)
    def stern_edge(z, s):
        sel = np.abs(st[:, 2] - z) < 3
        if not sel.any():
            return xm
        return st[sel, 0].min() if s == 'R' else st[sel, 0].max()
    def cc(s, k):
        return load(CC[s][k - 1]).vertices
    def cc_edge_z(s, k, x, edge):
        V = cc(s, k)
        sel = np.abs(V[:, 0] - x) < 4
        if sel.sum() < 5:
            sel = np.argsort(np.abs(V[:, 0] - x))[:40]
        return V[sel, 2].max() if edge == 'upper' else V[sel, 2].min() if edge == 'lower' else V[sel, 2].mean()
    def rib_ant(s, k, x):
        """k-তম রিব বা তার কার্টিলেজের ওই x-এ উচ্চতা (মাঝখান), সামনের অংশ"""
        V = np.vstack([cc(s, k), load(RIB[s][k - 1]).vertices])
        V = V[V[:, 1] < C0[1]]
        sel = np.abs(V[:, 0] - x) < 4
        if sel.sum() < 5:
            sel = np.argsort(np.abs(V[:, 0] - x))[:40]
        Vs = V[sel] if sel.dtype == bool else V[sel]
        Vs = Vs[Vs[:, 1] < Vs[:, 1].min() + 12]
        return Vs[:, 2].min(), Vs[:, 2].max()
    def ics(s, k, x):
        """k-তম intercostal space (k আর k+1 রিবের মাঝে) ওই x-এ"""
        lo_k, _ = rib_ant(s, k, x)
        _, hi_k1 = rib_ant(s, k + 1, x)
        return (lo_k + hi_k1) / 2
    sgn = lambda s: -1 if s == 'R' else 1
    pts = {}
    # ডান বর্ডার
    x = stern_edge(cc_edge_z('R', 3, stern_edge(C0[2], 'R'), 'upper'), 'R') - 12
    pts['rb1'] = front(x, cc_edge_z('R', 3, x, 'upper'))
    x = xm - 37
    pts['rb2'] = front(x, ics('R', 4, x))
    x = stern_edge(cc_edge_z('R', 6, xm - 25, 'mid'), 'R') - 3
    pts['rb3'] = front(x, cc_edge_z('R', 6, x, 'mid'))
    # নিচের বর্ডার
    xi = load(STERNUM[2]).vertices
    pts['xs'] = front(xm, xi[:, 2].max())
    x = xm + 90
    pts['apexBeat'] = front(x, ics('L', 5, x))
    # বাম বর্ডার
    x = stern_edge(C0[2] + 40, 'L') + 12
    pts['lb1'] = front(x, cc_edge_z('L', 2, x, 'lower'))
    # orifice লাইন
    def seg(a, b):
        return [a, b]
    x0 = stern_edge(cc_edge_z('L', 3, xm + 20, 'upper'), 'L')
    z3 = cc_edge_z('L', 3, x0 + 2, 'upper')
    pul = [front(x0 - 12.5, z3), front(x0 + 12.5, z3)]
    x1 = stern_edge(ics('L', 3, xm + 25), 'L')
    zi3 = ics('L', 3, x1 + 3)
    a0 = np.array([x1, zi3])
    dv = np.array([-1, -1]) / np.sqrt(2)
    aor = [front(*(a0)), front(*(a0 + 25 * dv))]
    z4 = cc_edge_z('L', 4, xm + 15, 'mid')
    tri = [front(xm, z4), front(xm - 8, z4 - 39)]
    mit = [front(xm + 20, z4 + 3), front(xm + 20 - 15, z4 + 3 - 26)]
    # শোনার জায়গা
    aus = {'ausAor': front(stern_edge(ics('R', 2, xm - 30), 'R') - 12, ics('R', 2, stern_edge(ics('R', 2, xm - 30), 'R') - 12)),
           'ausPul': front(stern_edge(ics('L', 2, xm + 30), 'L') + 12, ics('L', 2, stern_edge(ics('L', 2, xm + 30), 'L') + 12)),
           'ausTri': front(stern_edge(ics('L', 5, xm + 20), 'L') + 8, ics('L', 5, stern_edge(ics('L', 5, xm + 20), 'L') + 8)),
           'ausMit': pts['apexBeat']}
    def curve(ps, n=24, bulge=None):
        ps = np.array(ps)
        if bulge is not None and len(ps) == 2:
            m = (ps[0] + ps[1]) / 2 + np.array([bulge[0], 0, bulge[1]])
            ps = np.array([ps[0], m, ps[1]])
        return ps
    lines = {
        'mkRight': curve([pts['rb1'], pts['rb2'], pts['rb3']]),
        'mkInf': curve([pts['rb3'], pts['xs'], pts['apexBeat']]),
        'mkLeft': curve([pts['lb1'], pts['apexBeat']], bulge=(14, 8)),
        'mkUpper': curve([pts['rb1'], pts['lb1']]),
        'orPul': np.array(pul), 'orAor': np.array(aor), 'orTri': np.array(tri), 'orMit': np.array(mit),
    }
    cols = {'mk': '#ff8a3d', 'or': '#ffd43b'}
    for k, ps in lines.items():
        # দেয়ালের সামনে রাখা
        ps = np.array([front(p[0], p[2]) for p in ps])
        lay['tubes'].append(dict(key=k, layer='mark', group='mark', col=cols[k[:2]], r=1.3 if k.startswith('mk') else 1.6, pts=F.tf(ps).round(2).tolist()))
    # আসল হার্টের সীমানা (সামনে থেকে দেখা ছায়া)
    H = heart_epi
    xz = H[:, [0, 2]]
    from scipy.spatial import ConvexHull
    ang = np.arctan2(xz[:, 1] - xz[:, 1].mean(), xz[:, 0] - xz[:, 0].mean())
    out = []
    for a in np.linspace(-np.pi, np.pi, 73)[:-1]:
        sel = np.abs(((ang - a + np.pi) % (2 * np.pi)) - np.pi) < 0.06
        if sel.sum():
            d = np.linalg.norm(xz[sel] - xz.mean(0), axis=1)
            q = xz[sel][np.argmax(d)]
            out.append(front(q[0], q[1], 6))
    out.append(out[0])
    out = np.array(out)
    out = np.array([out[i] * .5 + out[i - 1] * .25 + out[(i + 1) % len(out)] * .25 for i in range(len(out))])
    out[-1] = out[0]
    lay['tubes'].append(dict(key='scanOutline', layer='mark', group='mark', col='#63e6be', r=1.0, pts=F.tf(out).round(2).tolist()))
    # আসল ভাল্‌ভের অবস্থান সামনের দেয়ালে
    for k, p in valves.items():
        lay['spheres'].append(dict(key='scan_' + k, layer='mark', col='#63e6be', r=2.6, p=F.tf(front(p[0], p[2], 6)).round(2).tolist()))
    for k, p in aus.items():
        lay['spheres'].append(dict(key=k, layer='mark', col='#f06595', r=3.4, p=F.tf(p).round(2).tolist()))
    # আসল apex কোন intercostal space-এ, মধ্যরেখা থেকে কত দূরে
    ax_ = apex[0]
    zs = [(k, *rib_ant('L', k, ax_)) for k in range(3, 8)]
    sp = None
    for k, lo_, hi_ in zs:
        if apex[2] < hi_ and apex[2] > lo_:
            sp = f'rib{k}'
    for k in range(3, 7):
        lo_k, _ = rib_ant('L', k, ax_)
        _, hi_k1 = rib_ant('L', k + 1, ax_)
        if hi_k1 <= apex[2] <= lo_k:
            sp = f'ics{k}'
    meas['apexScan'] = dict(dx=round(float(ax_ - xm) / 10, 1), space=sp)
    # স্টার্নামের পেছনে হার্টের কত অংশ বাম দিকে
    meas['leftOfMid'] = round(float((H[:, 0] > xm).mean()), 2)
    anchors = {k: F.tf(front(p[0], p[2], 9)).round(2).tolist() for k, p in aus.items()}
    anchors.update({'mkRight': F.tf(front(pts['rb2'][0] - 6, pts['rb2'][2], 9)).round(2).tolist(),
                    'mkLeft': F.tf(lines['mkLeft'][1] + np.array([10, -9, 0])).round(2).tolist(),
                    'mkInf': F.tf(front((pts['xs'][0] + pts['apexBeat'][0]) / 2, (pts['xs'][2] + pts['apexBeat'][2]) / 2 - 8, 9)).round(2).tolist(),
                    'mkUpper': F.tf(front((pts['rb1'][0] + pts['lb1'][0]) / 2, max(pts['rb1'][2], pts['lb1'][2]) + 8, 9)).round(2).tolist(),
                    'scanOutline': F.tf(front(out[np.argmin(out[:, 2])][0] - 38, out[np.argmin(out[:, 2])][2] - 16, 9)).round(2).tolist(),
                    'orPul': F.tf(pul[1] + np.array([24, -3, 10])).round(2).tolist(), 'orAor': F.tf(aor[1] + np.array([-6, -3, -6])).round(2).tolist(),
                    'orTri': F.tf(tri[1] + np.array([-8, -3, -4])).round(2).tolist(), 'orMit': F.tf(mit[0] + np.array([8, -3, 4])).round(2).tolist()})
    lay['anchors'].update(anchors)
    print('  apex (স্ক্যান):', meas['apexScan'], 'বাম দিকে:', meas['leftOfMid'])
    return {k: F.tf(p).round(2).tolist() for k, p in pts.items()}


if __name__ == '__main__':
    build()
