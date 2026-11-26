"""Trachea আর bronchial tree: BodyParts3D-এর trachea (FMA7394) আর bronchus (FMA7409) থেকে, সব ভাগ আর মাপ স্ক্যান থেকে।

ব্যবহার: python pipeline/trachea.py → bones/trachea/data/core.js, layers.js
লেখা: Datta I, Chapter 4 (The Trachea; Right and Left Bronchi), বইয়ের পৃ. 46–51 (PDF = বই + 14)।
p (PARTS): 1 trachea, 2 right principal, 3 left principal, 4 Rt upper lobe (eparterial), 5 Rt middle lobe, 6 Rt lower lobe,
           7 Lt upper lobe, 8 Lt lower lobe bronchus, 9 segmental ও ছোট শাখা
t (TERR):  কোন broncho-pulmonary segment-এ (lungs.py-র মতো একই স্কিম্যাটিক segment)
"""
import os, sys, json, base64
import numpy as np
import trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, STL
from lungs import SEG, unit, b64, LOBES

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'trachea', 'data')
LOBE_PART = {'RU': 4, 'RM': 5, 'RL': 6, 'LU': 7, 'LL': 8}
VERT = [('C5', 'FMA12523'), ('C6', 'FMA12524'), ('C7', 'FMA12525'), ('T1', 'FMA9165'), ('T2', 'FMA9187'), ('T3', 'FMA9209'),
        ('T4', 'FMA9248'), ('T5', 'FMA9922'), ('T6', 'FMA9945'), ('T7', 'FMA9968')]
CTX = dict(eso='FMA7131', aoArch='FMA3768', aoAsc='FMA3736', aoDesc='FMA3784', bct='FMA3932nsn', lcca='FMA4058', rcca='FMA3941',
           lsca='FMA4694', rsca='FMA3953', lbcv='FMA4761', rbcv='FMA4751', svc='FMA4720', pa='FMA66326', pv='FMA66643', heart='FMA7274',
           thyroidCart='FMA55099', rSternothy='FMA13350', lSternothy='FMA13351')


def main():
    tr = load('FMA7394').split(only_watertight=False)
    tr = max(tr, key=lambda b: len(b.vertices))
    trees = [b for b in load('FMA7409').split(only_watertight=False) if len(b.vertices) > 1000]
    trR = min(trees, key=lambda b: b.vertices[:, 0].mean()); trL = max(trees, key=lambda b: b.vertices[:, 0].mean())
    lobes = {k: load(f) for k, f, *_ in LOBES}
    LT = {}
    for k, m in lobes.items():
        vv, ff = decimate(m, 20000); mm = trimesh.Trimesh(vv, ff, process=True)
        LT[k] = (cKDTree(mm.vertices), mm.vertex_normals.copy())
    C0 = (tr.bounds[0] + tr.bounds[1]) / 2 + np.array([0, 0, -60])
    F = Frame(C0)
    vert = {k: load(f) for k, f in VERT}
    man = load('FMA7486'); body = load('FMA7487')
    LM, meas, core_meshes = [], {}, []

    def lm(id_, p, n, **kw):
        LM.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=unit(F.tf_dir(n)).round(3).tolist(), **kw))

    def level(z):
        best = None
        for k, m in vert.items():
            zb = m.vertices[:, 2]
            body_ = m.vertices[m.vertices[:, 1] < np.percentile(m.vertices[:, 1], 35)]   # সামনের body অংশ
            lo, hi = body_[:, 2].min(), body_[:, 2].max()
            if lo - 4 <= z <= hi + 4:
                d = abs(z - (lo + hi) / 2)
                if best is None or d < best[1]:
                    best = (k, d, lo, hi)
        if best is None:
            return '?'
        k, _, lo, hi = best
        pos = 'upper border' if z > hi - (hi - lo) * .25 else ('lower border' if z < lo + (hi - lo) * .25 else 'body')
        return f'{k} ({pos})'

    # ---- trachea: কেন্দ্ররেখা (প্রতি ৪ মিমিতে আড়াআড়ি টুকরার কেন্দ্র), মাপ
    tv = tr.vertices
    zs = np.arange(tv[:, 2].min() + 2, tv[:, 2].max() - 1, 4)
    cl, wid, dep = [], [], []
    for z in zs:
        b = tv[np.abs(tv[:, 2] - z) < 1.5]
        if len(b) < 10:
            continue
        cl.append(b.mean(0)); wid.append(np.ptp(b[:, 0])); dep.append(np.ptp(b[:, 1]))
    cl = np.array(cl); wid = np.array(wid); dep = np.array(dep)
    # carina: দুই principal bronchus যেখানে মেলে; trachea-র সবচেয়ে নিচের মধ্যরেখার বিন্দু
    bothv = np.vstack([trR.vertices, trL.vertices])
    mid = bothv[np.abs(bothv[:, 0] - cl[:, 0].mean()) < 3]
    carina = mid[np.argmax(mid[:, 2])] if len(mid) else tv[np.argmin(tv[:, 2])]
    top = tv[np.argmax(tv[:, 2])]
    meas['trachLen'] = round((top[2] - carina[2]) / 10, 1)
    good = (zs[:len(wid)] > carina[2] + 15)
    meas['trachW'] = round(float(np.median(wid[good])) / 10, 1)
    meas['trachD'] = round(float(np.median(dep[good])) / 10, 1)
    meas['topLevel'] = level(top[2])
    meas['carinaLevel'] = level(carina[2])
    mz = man.vertices[:, 2].min(); bz = body.vertices[:, 2].max()
    sang = (mz + bz) / 2
    meas['carinaVsSternalAngle'] = round((carina[2] - sang) / 10, 1)
    meas['deviation'] = round(float(cl[0, 0] - cl[-1, 0]), 1)

    # ---- bronchial tree: কোন lobe-এর ভেতরে, hilum থেকে কত দূরে
    def classify(tree, side):
        v, f = decimate(tree, 30000)
        m = trimesh.Trimesh(v, f, process=True); m.remove_unreferenced_vertices()
        v, f = m.vertices, m.faces
        p = np.full(len(v), 2 if side == 'R' else 3, np.uint8)
        t = np.zeros(len(v), np.uint8)
        inside = np.zeros(len(v), bool)
        keys = ['RU', 'RM', 'RL'] if side == 'R' else ['LU', 'LL']
        entry = {}
        for k in keys:
            lt, ln = LT[k]
            dd, ii = lt.query(v)
            ins = (np.sum((v - lt.data[ii]) * ln[ii], 1) < 0) & (dd < 60)
            if ins.sum() < 20:
                continue
            inside |= ins
            # hilum entry: এই lobe-এর ভেতরের বিন্দুগুলোর মধ্যে carina-র সবচেয়ে কাছের
            iv = np.where(ins)[0]
            e = v[iv[np.argmin(np.linalg.norm(v[iv] - carina, axis=1))]]
            entry[k] = e
            de = np.linalg.norm(v[iv] - e, axis=1)
            p[iv] = LOBE_PART[k]
            # segment: lobe-এর নিজের normalised অক্ষে নিকটতম বীজ
            lv = lobes[k].vertices; lo, hi = lv.min(0), lv.max(0)
            U = (v[iv] - lo) / (hi - lo)
            if side == 'R':
                U[:, 0] = 1 - U[:, 0]
            U[:, 1] = 1 - U[:, 1]
            seeds = np.array([s for _, s in SEG[k]]); ids = np.array([i for i, _ in SEG[k]])
            W = np.array([1.0, 1.0, 1.25])
            t[iv] = ids[np.argmin(((U[:, None, :] - seeds[None]) * W) ** 2 @ np.ones(3), axis=1)]
        # lobe-এর বাইরে কিন্তু hilum-এর কাছে: lobar bronchus-এর গোড়া (principal থেকে আলাদা করতে কাছের lobe entry দেখে)
        out = np.where(~inside)[0]
        if entry:
            ek = list(entry); E_ = np.array([entry[k] for k in ek])
            dist_ = np.linalg.norm(v[out][:, None] - E_[None], axis=2)
            p[out] = np.array([LOBE_PART[k] for k in ek])[np.argmin(dist_, 1)]
        return v, f, p, t, entry

    trees_out = {}
    for side, tree in (('R', trR), ('L', trL)):
        v, f, p, t, entry = classify(tree, side)
        trees_out[side] = (v, p, entry)
        e = pack(F, 'bron' + side, 'bone', v, f, regions=np.zeros(len(v), np.uint8), key='bron' + side)
        e['p'] = b64(p, np.uint8); e['t'] = b64(t, np.uint8)
        core_meshes.append(e)
        # principal bronchus: carina থেকে গোলাকার খোলস ধরে এগিয়ে প্রথম শাখা পর্যন্ত (দৈর্ঘ্য, দিক, কোণ, চওড়া)
        tv_ = tree.vertices; tt_ = cKDTree(tv_)
        last_c, blen, cents = None, None, []
        for rr in np.arange(6, 90, 3):
            dd_ = np.linalg.norm(tv_ - carina, axis=1)
            sh = np.where((dd_ >= rr) & (dd_ < rr + 3))[0]
            if len(sh) < 8:
                continue
            # সংযুক্ত গুচ্ছ গোনা
            sub = tv_[sh]; st_ = cKDTree(sub); lab_ = -np.ones(len(sub), int); nc = 0
            for a0 in range(len(sub)):
                if lab_[a0] >= 0:
                    continue
                stack = [a0]; lab_[a0] = nc
                while stack:
                    x = stack.pop()
                    for y in st_.query_ball_point(sub[x], 3.5):
                        if lab_[y] < 0:
                            lab_[y] = nc; stack.append(y)
                nc += 1
            big = [c_ for c_ in range(nc) if (lab_ == c_).sum() >= 40]
            if len(big) >= 2 and rr > 18:
                blen = rr; break
            last_c = sub.mean(0); cents.append((rr, last_c))
        if last_c is not None:
            near_ = [c_ for r_, c_ in cents if r_ <= 10]; mid__ = [c_ for r_, c_ in cents if 14 <= r_ <= 26]
            d = unit(np.mean(mid__, 0) - (np.mean(near_, 0) if near_ else carina)) if mid__ else unit(last_c - carina)
            ax = unit(cl[0] - cl[-1]) if cl[0][2] < cl[-1][2] else unit(cl[-1] - cl[0])   # trachea-র নিচের দিকে অক্ষ
            meas['angle' + side] = round(float(np.degrees(np.arccos(np.clip(d @ ax, -1, 1)))), 0)
            meas['len' + side] = round(float(blen or np.linalg.norm(last_c - carina)) / 10, 1)
            pv_ = v[(np.linalg.norm(v - carina, axis=1) < (blen or 30)) & (p == (2 if side == 'R' else 3))]
            mid_ = carina + d * (blen or 30) / 2
            if len(pv_):
                lm('principal' + side, pv_[np.argmin(np.linalg.norm(pv_ - mid_, axis=1))], [(-1 if side == 'R' else 1), -.5, 0])
                meas['width' + side] = round(float(2 * np.median(np.linalg.norm(np.cross(pv_ - carina, d), axis=1))) / 10, 1)
            # carina থেকে প্রথম শাখা পর্যন্ত principal bronchus
            p[(np.linalg.norm(v - carina, axis=1) < (blen or 30)) & ~np.isin(np.arange(len(v)), [])] = (2 if side == 'R' else 3)
            e['p'] = b64(p, np.uint8)
        for k, e_ in entry.items():
            q = v[p == LOBE_PART[k]]
            if len(q):
                c = q[np.argmin(np.linalg.norm(q - q.mean(0), axis=1))]
                lm('lobar_' + k, c, [(-1 if side == 'R' else 1), -.6, .2])
        for sid in np.unique(t[t > 0]):
            q = v[t == sid]
            c = q[np.argmin(np.linalg.norm(q - q.mean(0), axis=1))]
            lm(f's~{int(sid)}', c, [0, -1, 0], show='seg')
    if 'angleR' in meas and 'angleL' in meas:
        meas['subcarinal'] = meas['angleR'] + meas['angleL']

    # trachea মেশ
    v, f = decimate(tr, 12000)
    m = trimesh.Trimesh(v, f, process=True); m.remove_unreferenced_vertices()
    v, f = m.vertices, m.faces
    e = pack(F, 'trachea', 'bone', v, f, regions=np.zeros(len(v), np.uint8), key='trachea')
    e['p'] = b64(np.ones(len(v)), np.uint8); e['t'] = b64(np.zeros(len(v)), np.uint8)
    core_meshes.insert(0, e)
    lm('carina', carina + np.array([0, -2, -2]), [0, -1, -.3])
    lm('trachTop', top, [0, -1, .3])
    i = np.argmin(np.abs(cl[:, 2] - (top[2] + carina[2]) / 2)); q = tv[np.argmin(np.linalg.norm(tv - (cl[i] + [0, -30, 0]), axis=1))]
    lm('trachAnt', q, [0, -1, 0])
    q = tv[np.argmin(np.linalg.norm(tv - (cl[i] + [0, 30, 0]), axis=1))]
    lm('trachPost', q, [0, 1, 0])
    # sternal angle-এর লেভেল (manubrium আর body-র জোড়) সামনে
    sa_pts = np.vstack([man.vertices, body.vertices]); sa = sa_pts[np.argmin(np.abs(sa_pts[:, 2] - sang) + np.abs(sa_pts[:, 0]) * .2 + sa_pts[:, 1] * .05)]
    lm('sternalAngle', sa, [0, -1, 0])

    # ---- C-আকৃতির cartilage ring (স্কিম্যাটিক, পেছনে ফাঁকা: trachealis)
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    nring = 18
    zr = np.linspace(top[2] - 4, carina[2] + 12, nring)
    for z in zr:
        b = tv[np.abs(tv[:, 2] - z) < 1.5]
        if len(b) < 10:
            continue
        c = b.mean(0); rx = np.ptp(b[:, 0]) / 2 + .9; ry = np.ptp(b[:, 1]) / 2 + .9
        a = np.radians(np.linspace(-150, 150, 22))   # পেছনে ৬০° ফাঁকা
        pts = np.c_[c[0] + rx * np.sin(a), c[1] - ry * np.cos(a), np.full(len(a), z)]
        lay['tubes'].append(dict(key='ring', layer='ring', group='ring', col='#e8f1f4', r=1.4, pts=F.tf(pts).round(2).tolist()))
    lay['anchors']['ring'] = F.tf(np.array([cl[len(cl) // 2][0], cl[len(cl) // 2][1] - meas['trachD'] * 5 - 1, cl[len(cl) // 2][2]])).round(2).tolist()
    # trachealis (পেছনের পেশি অংশ) চিহ্ন
    lm('trachealis', tv[np.argmin(np.linalg.norm(tv - (cl[len(cl) // 2] + [0, 30, 0]), axis=1))], [0, 1, 0])

    def addl(k, m, group, layer, nfaces, key=None):
        vv, ff = decimate(m, nfaces)
        ee = pack(F, k, group, vv, ff, key=key or k); ee['layer'] = layer
        lay['meshes'].append(ee)
    for k, fma in CTX.items():
        if not os.path.exists(os.path.join(STL, fma + '.stl')):
            continue
        g = {'eso': 'eso', 'heart': 'heart', 'thyroidCart': 'cart', 'rSternothy': 'muscle', 'lSternothy': 'muscle', 'pa': 'pa', 'pv': 'pvein'}.get(k, 'artery' if k in ('aoArch', 'aoAsc', 'aoDesc', 'bct', 'lcca', 'rcca', 'lsca', 'rsca') else 'vein')
        lyr = 'muscle' if g == 'muscle' else ('organ' if k in ('eso', 'heart', 'thyroidCart') else 'great')
        addl(k, load(fma), g, lyr, 6000 if k == 'heart' else 2500)
    for k, m in vert.items():
        addl(k, m, 'vert', 'vert', 1500)
    for i, x in enumerate(['FMA7486', 'FMA7487']):
        addl('sternum%d' % i, load(x), 'clav', 'vert', 2000, key='sternum')
    for k in lobes:
        addl('lung' + k, lobes[k], 'lung', 'lung', 4000, key='lung')

    core = dict(scale=0.02, meshes=core_meshes, lm=LM, meas=meas)
    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', lay)
    print('মাপ:', json.dumps(meas, ensure_ascii=False))
    print('ল্যান্ডমার্ক:', len(LM))


if __name__ == '__main__':
    main()
