"""থোরাসিক কশেরুকার ডেটা বানায়: bones/thoracic-vertebrae/data/<spec>-core.js, <spec>-layers.js, which.js

স্পেসিমেন (Datta I, পৃ. ১২–১৪): typical (T6), first (T1), ninth (T9), tenth (T10), eleventh (T11), twelfth (T12)।
চালানো: python pipeline/vertebrae.py [spec ...]   (আগে: bash pipeline/fetch_meshes.sh pipeline/ids_vertebrae.txt)

যা মাপা হয়:
  - body: নিচের/উপরের intervertebral disc যে জায়গা ঢেকে রাখে
  - costal facet: আসল রিবের head যেখানে body ছোঁয়; transverse process-এর facet: রিবের tubercle যেখানে ছোঁয়
  - superior/inferior articular facet: উপরের/নিচের কশেরুকা যেখানে ছোঁয়
  - vertebral foramen: মধ্যরেখায় body-র পেছনে সবচেয়ে বড় ফাঁকা বৃত্তের কেন্দ্র
  - মাসল অ্যাটাচমেন্ট: আসল মাসল হাড়ের ২.৫ মিমি-র মধ্যে
অংশের (pedicle, lamina ইত্যাদি) সীমানা জ্যামিতি দিয়ে আনুমানিক।
"""
import os, sys, base64
import numpy as np
import trimesh
from scipy.spatial import cKDTree, Delaunay
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, SCALE

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'thoracic-vertebrae', 'data')
V = {1: 'FMA9165', 2: 'FMA9187', 3: 'FMA9209', 4: 'FMA9248', 5: 'FMA9922', 6: 'FMA9945', 7: 'FMA9968', 8: 'FMA9991',
     9: 'FMA10014', 10: 'FMA10037', 11: 'FMA10059', 12: 'FMA10081', 13: 'FMA13072'}  # 13 = L1
DISC = {1: 'FMA10458', 2: 'FMA13495', 3: 'FMA13500', 4: 'FMA13501', 5: 'FMA13502', 6: 'FMA13503', 7: 'FMA13504',
        8: 'FMA13505', 9: 'FMA13506', 10: 'FMA13507', 11: 'FMA13508', 12: 'FMA13509'}  # Tn আর T(n+1)-এর মাঝের ডিস্ক
RIB = {'R': {1: 'FMA7857', 2: 'FMA7882', 3: 'FMA7909', 4: 'FMA7957', 5: 'FMA8066', 6: 'FMA8175', 7: 'FMA8229', 8: 'FMA8283', 9: 'FMA8364', 10: 'FMA8445', 11: 'FMA8531', 12: 'FMA8533'},
       'L': {1: 'FMA7987', 2: 'FMA8012', 3: 'FMA8039', 4: 'FMA8148', 5: 'FMA8093', 6: 'FMA8202', 7: 'FMA8256', 8: 'FMA8310', 9: 'FMA8391', 10: 'FMA8472', 11: 'FMA8532', 12: 'FMA8534'}}
# রিজিয়ন নম্বর -> মাসল (content.js-এর REG-এর সাথে মেলে); 8 = জোড়ার তল, 14 = ডিস্কের তল
MUSCLES = {1: ('trap', ['FMA33581', 'FMA33584', 'FMA33586', 'FMA33583', 'FMA33585', 'FMA33587']), 2: ('rhomb', ['FMA13381', 'FMA13383', 'FMA13382', 'FMA13384']),
           3: ('lat', ['FMA13358', 'FMA13359']), 4: ('sps', ['FMA13403', 'FMA13404']), 5: ('spi', ['FMA13405', 'FMA13406']),
           6: ('spinalis', ['FMA22779', 'FMA22780']), 7: ('semisp', ['FMA22872', 'FMA22873']), 9: ('multif', ['FMA22878', 'FMA22879']),
           10: ('rot', ['FMA23083']), 11: ('intersp', ['FMA71308']), 12: ('lev', ['FMA74075', 'FMA74077', 'FMA74076', 'FMA74078']),
           13: ('longis', ['FMA22751', 'FMA22753']), 15: ('psoas', ['FMA22342', 'FMA22343']),
           16: ('longcolli', ['FMA46283', 'FMA46285', 'FMA46287', 'FMA46284', 'FMA46286', 'FMA46288']), 17: ('dia', ['FMA13295'])}
SPECS = {'typical': 6, 'first': 1, 'ninth': 9, 'tenth': 10, 'eleventh': 11, 'twelfth': 12}
ART, DISC_R = 8, 14
_cache = {}
def L(f):
    if f not in _cache: _cache[f] = load(f)
    return _cache[f]


def canal_centre(v, body_back_y):
    """মধ্যরেখায় body-র পেছনে সবচেয়ে বড় ফাঁকা বৃত্তের কেন্দ্র = vertebral foramen"""
    zc = np.median(v[:, 2]); sl = v[np.abs(v[:, 2] - zc) < 8]; t = cKDTree(sl[:, :2])
    best = None
    for y in np.linspace(body_back_y, body_back_y + 35, 71):
        for x in np.linspace(-3, 3, 7):
            d, _ = t.query([x, y])
            if best is None or d > best[0]: best = (d, np.array([x, y, zc]))
    return best[1], best[0]


def build(name, n):
    vm = L(V[n]); v0, n0 = vm.vertices, vm.vertex_normals
    F = Frame(v0.mean(0)); T0 = cKDTree(v0)
    def contact(f, thr=2.5, pts=v0):
        d, _ = cKDTree(L(f).vertices).query(pts); return d < thr, d
    # ---- body: ডিস্ক যে জায়গা ঢেকে রাখে
    discs = [DISC[k] for k in (n - 1, n) if k in DISC]
    dxy = np.vstack([L(f).vertices[:, :2] for f in discs])
    hull = Delaunay(dxy)
    def in_body(p):
        return hull.find_simplex(p[:, :2]) >= 0
    body_m = in_body(v0) | (np.min([cKDTree(L(f).vertices).query(v0)[0] for f in discs], axis=0) < 2)
    bb = v0[body_m & (np.abs(v0[:, 0]) < 6)]; body_back = bb[:, 1].max()
    cc, crad = canal_centre(v0, body_back)
    # ---- arch-এর অংশ (আনুমানিক)
    arch = ~body_m; ax = np.abs(v0[:, 0]); maxx = ax[arch].max()
    part = np.ones(len(v0), np.uint8)                              # 1 body
    up_m, _ = contact(V[n - 1]) if n > 1 else (np.zeros(len(v0), bool), None)
    lo_m, _ = contact(V[n + 1])
    zp = (np.linalg.norm(v0[:, None, :] - v0[up_m | lo_m][None, ::7, :], axis=2).min(1) < 6) if (up_m | lo_m).any() else np.zeros(len(v0), bool)
    for i in np.where(arch)[0]:
        x, y = ax[i], v0[i, 1]
        if x < 9 and y > cc[1] + crad + 6: part[i] = 5             # spinous process
        elif x > 0.62 * maxx: part[i] = 4                          # transverse process
        elif y < cc[1] + 2: part[i] = 2                            # pedicle
        else: part[i] = 3                                          # lamina
    part[arch & zp] = 6                                            # articular processes
    # ---- রিবের জোড়া: head (body-তে) আর tubercle (transverse process-এ)
    facets = {}
    for s in 'RL':
        for r in (n, n + 1):
            if r > 12: continue
            m, d = contact(RIB[s][r], 3.0)
            if not m.any(): continue
            P = v0[m]; isb = body_m[m] | (part[m] == 2)
            if isb.any(): facets[(s, r, 'head')] = P[isb]
            if (~isb).any() and r == n and n <= 10:
                tp = P[~isb & (np.abs(P[:, 0]) > 0.45 * maxx)]
                if len(tp): facets[(s, r, 'tub')] = tp
    print(f'T{n}', {f'{s}{r}{k}': len(p) for (s, r, k), p in facets.items()}, 'canal r=%.1f' % crad)
    # ---- রিজিয়ন (decimated মেশে)
    vb, fb = decimate(vm, 9000); _, near = T0.query(vb)
    reg = np.zeros(len(vb), np.uint8); dist = np.full(len(vb), 99.)
    used = {}
    for r, (k, fl) in MUSCLES.items():
        d, _ = cKDTree(np.vstack([L(f).vertices for f in fl])).query(vb); u = (d < 2.5) & (d < dist)
        if u.sum() >= 8: reg[u] = r; dist[u] = d[u]; used[k] = int(u.sum())
    dd = np.min([cKDTree(L(f).vertices).query(vb)[0] for f in discs], axis=0); reg[dd < 1.2] = DISC_R
    art_pts = [p for p in facets.values()] + ([v0[up_m]] if up_m.any() else []) + [v0[lo_m]]
    da, _ = cKDTree(np.vstack(art_pts)).query(vb); reg[da < 1.2] = ART
    print('  muscles', used)
    core = dict(scale=SCALE, meshes=[pack(F, 'vert', 'bone', vb, fb, reg)])
    core['meshes'][0]['p'] = base64.b64encode(part[near].astype(np.uint8).tobytes()).decode()
    # context: উপরের-নিচের কশেরুকা ও ডিস্ক (vert লেয়ার), এই লেভেলের রিব (rib লেয়ার)
    for k in (n - 1, n + 1):
        if k in V and k >= 1:
            lab = 'L1' if k == 13 else f'T{k}'; vv, ff = decimate(L(V[k]), 2500); e = pack(F, lab, 'vert', vv, ff, key=lab); core['meshes'].append(e)
    for f in discs:
        vv, ff = decimate(L(f), 600); core['meshes'].append(pack(F, 'disc' + f, 'disc', vv, ff, key='disc'))
    for s in 'RL':
        for r in (n, n + 1):
            if r <= 12:
                vv, ff = decimate(L(RIB[s][r]), 1500); core['meshes'].append(pack(F, f'rib{s}{r}', 'rib', vv, ff))
    # ---- ল্যান্ডমার্ক (ডান পাশের জোড়া জিনিস; মাঝের জিনিস মধ্যরেখায়)
    lm = []
    def add(id_, p):
        i = T0.query(p)[1]; lm.append(dict(id=id_, p=F.tf(v0[i]).round(2).tolist(), n=F.tf_dir(n0[i]).round(4).tolist()))
    def addfree(id_, p, nrm):
        lm.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=F.tf_dir(np.asarray(nrm, float)).round(4).tolist()))
    bf = v0[body_m & (np.abs(v0[:, 0]) < 5)]; add('bodyAnt', bf[bf[:, 1].argmin()])
    for (s, r, k), P in facets.items():
        if s != 'R': continue
        add({'head': 'cfUp' if r == n else 'cfLow', 'tub': 'tpFacet'}[k], P.mean(0))
    R = v0[v0[:, 0] < 0]
    add('tpTip', R[R[:, 0].argmin()])
    sp = v0[part == 5] if (part == 5).any() else v0; add('spine', sp[sp[:, 1].argmax()])
    if up_m.any():
        u = v0[up_m & (v0[:, 0] < 0)]
        if len(u): add('supArt', u.mean(0))
    lw = v0[lo_m & (v0[:, 0] < 0)]
    if len(lw): add('infArt', lw.mean(0))
    addfree('foramen', cc, [0, 0, 1])
    pd = v0[(part == 2) & (v0[:, 0] < 0)]
    if len(pd):
        pc = pd.mean(0); add('pedicle', pc)
        below = pd[pd[:, 2] < pc[2]]; add('infNotch', below[below[:, 2].argmin()] if len(below) else pc)
    lam = v0[(part == 3) & (v0[:, 0] < 0)]
    if len(lam): add('lamina', lam[lam[:, 1].argmax()])
    core['lm'] = lm
    # মাপ: body-র আড়াআড়ি আর সামনে-পেছনে ব্যাস, spine-এর ঢাল
    bv = v0[body_m]; core['dims'] = dict(tw=float(np.ptp(bv[:, 0])), ap=float(np.ptp(bv[:, 1])), h=float(np.ptp(bv[:, 2])),
                                          spineDrop=float(cc[2] - sp[sp[:, 1].argmax()][2]))
    # ---- লেয়ার
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    for r, (k, fl) in MUSCLES.items():
        if k not in used: continue
        for i, f in enumerate(fl):
            m = L(f); keep = T0.query(m.vertices)[0] < 30
            kf = keep[m.faces].all(1)
            if kf.sum() < 20: continue
            mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False); mm.remove_unreferenced_vertices()
            vv, ff = decimate(mm, 1500); lay['meshes'].append(pack(F, f'{k}{i}', 'muscle', vv, ff, key=k))
    for k, g, f, t in (('aoDesc', 'artery', 'FMA3784', 3000), ('eso', 'trachea', 'FMA7131', 2000)):
        m = L(f); keep = T0.query(m.vertices)[0] < 80; kf = keep[m.faces].all(1)
        if kf.sum() < 20: continue
        mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False); mm.remove_unreferenced_vertices()
        vv, ff = decimate(mm, t); lay['meshes'].append(pack(F, k, g, vv, ff, key=k))
    # স্কিম্যাটিক: spinal cord (canal-এর ভেতর), spinal nerve (inferior notch দিয়ে), sympathetic trunk (রিবের head-এর সামনে), azygos
    ccu = cc + [0, 0, 28]; ccl = cc - [0, 0, 28]
    lay['tubes'].append(dict(key='cord', layer='nerve', group='artery', col='#f2e2a0', r=max(3.5, crad * 0.6), pts=F.tf(np.array([ccu, cc, ccl])).round(2).tolist()))
    lay['anchors']['cord'] = F.tf(cc + [0, 0, 22]).round(2).tolist()
    if len(pd):
        nb = below[below[:, 2].argmin()] if len(below) else pc
        sn = [cc + [-2, 0, nb[2] - cc[2]], nb + [-2, 0, -2], nb + [-22, -6, -10], nb + [-45, -10, -18]]
        lay['tubes'].append(dict(key='spn', layer='nerve', group='artery', col='#f2c230', r=1.6, pts=F.tf(np.array(sn)).round(2).tolist()))
        lay['anchors']['spn'] = F.tf(np.array(sn[2])).round(2).tolist()
    hr = facets.get(('R', n, 'head'))
    if hr is not None:
        h = hr.mean(0) + [0, -9, 0]
        lay['tubes'].append(dict(key='symp', layer='nerve', group='artery', col='#d9b23a', r=1.3, pts=F.tf(np.array([h + [0, 0, 35], h, h - [0, 0, 35]])).round(2).tolist()))
        lay['anchors']['symp'] = F.tf(h + [0, 0, 18]).round(2).tolist()
    ba = bf[bf[:, 1].argmin()]
    az = ba + [-12, 6, 0]
    lay['tubes'].append(dict(key='azygos', layer='vein', group='vein', col='#5d86f0', r=3.0, pts=F.tf(np.array([az + [0, 0, 40], az, az - [0, 0, 40]])).round(2).tolist()))
    lay['anchors']['azygos'] = F.tf(az + [0, 0, 20]).round(2).tolist()
    write_js(os.path.join(OUT, f'{name}-core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, f'{name}-layers.js'), 'window.LAYERS', lay)


def build_which():
    """"কোন নম্বরের কশেরুকা?" ট্রেনারের জন্য ছয়টা কশেরুকা, প্রতিটা নিজের কেন্দ্রে"""
    items = []
    for name, n in SPECS.items():
        m = L(V[n]); Fm = Frame(m.vertices.mean(0)); vv, ff = decimate(m, 3000)
        e = pack(Fm, name, 'which', vv, ff); e['k'] = name; items.append(e)
    write_js(os.path.join(OUT, 'which.js'), 'window.WHICH', dict(items=items))


if __name__ == '__main__':
    only = sys.argv[1:]
    for k, n in SPECS.items():
        if not only or k in only: build(k, n)
    if not only or 'which' in only: build_which()
