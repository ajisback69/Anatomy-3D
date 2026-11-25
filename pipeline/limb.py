"""Upper limb-এর হাড়: clavicle, scapula, humerus, radius, ulna।

ব্যবহার: python pipeline/limb.py [bone ...]
আউটপুট: bones/<bone>/data/core.js, layers.js

সব মাপ ডান পাশের হাড়ে (Datta-র চিত্রও ডান পাশের)। বাম পাশেরটা শুধু "ডান না বাম?" ট্রেনারে।
- মাসলের অ্যাটাচমেন্ট: মাসলের মেশ হাড়ের ২.৫ মিমির মধ্যে যেখানে, সেটাই তার জায়গা।
- জোড়ার তল (region 8): পাশের হাড়ের সবচেয়ে কাছের অংশ (থ্রেশহোল্ড হাড় অনুযায়ী)।
- অংশ (parts) আর ল্যান্ডমার্ক: হাড়ের লম্বা অক্ষ আর শরীরের দিক (সামনে, ভেতরে, উপরে) থেকে মাপা।
স্ক্যানে নার্ভ আর হাতের রক্তনালী নেই, সেগুলো স্কিম্যাটিক (মাপা ল্যান্ডমার্কে বসানো)।
"""
import os, sys, base64
import numpy as np
import trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, SCALE

ROOT = os.path.join(os.path.dirname(__file__), '..', 'bones')
ARTIC = 8
# BodyParts3D-এর দিক (ডান পাশের হাড়ের জন্য): x+ = রোগীর বাম = medial, y+ = পেছন, z+ = উপর
LAT, MED, ANT, POST, UP, DOWN = (np.array(a, float) for a in ([-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, 1], [0, 0, -1]))

M = {  # মাসল (ডান)
    'deltAnt': ['FMA34680'], 'deltMid': ['FMA34682'], 'deltPost': ['FMA34684'],
    'trapDesc': ['FMA33586'], 'trapTrans': ['FMA33584'], 'trapAsc': ['FMA33581'],
    'pmClav': ['FMA34690'], 'pmStern': ['FMA79979'], 'pmAbd': ['FMA45874'], 'pmin': ['FMA13375'],
    'scm': ['FMA13408'], 'sth': ['FMA13346'], 'subcl': ['FMA13412'], 'omo': ['FMA13348'], 'lev': ['FMA32540'],
    'rhMin': ['FMA13383'], 'rhMaj': ['FMA13381'], 'serr': ['FMA13398'], 'lat': ['FMA13358'],
    'supra': ['FMA32544'], 'infra': ['FMA32547'], 'tmin': ['FMA32553'], 'tmaj': ['FMA32551'], 'subsc': ['FMA13414'],
    'bicLong': ['FMA37686'], 'bicShort': ['FMA37684'], 'cb': ['FMA37665'], 'brach': ['FMA37668'],
    'triLong': ['FMA37699'], 'triLat': ['FMA37697'], 'triMed': ['FMA37695'], 'anc': ['FMA37705'],
    'br': ['FMA38486'], 'ecrl': ['FMA38495'], 'ecrb': ['FMA38498'], 'ed': ['FMA38501'], 'edm': ['FMA38504'],
    'pt': ['FMA38560', 'FMA38562'], 'fcr': ['FMA38460'], 'pl': ['FMA38463'], 'fcu': ['FMA38617', 'FMA38619'],
    'fds': ['FMA38638', 'FMA38640'], 'fdp': ['FMA38479'], 'fpl': ['FMA38482'], 'pq': ['FMA38454'], 'sup': ['FMA38513'],
    'apl': ['FMA38516'], 'epb': ['FMA38519'], 'epl': ['FMA38522'], 'ei': ['FMA38525'], 'iom': ['FMA23707'],
}
B_ = {'clavicle': ('FMA13322', 'FMA13323'), 'scapula': ('FMA13395', 'FMA13396'), 'humerus': ('FMA23130', 'FMA23131'),
      'radius': ('FMA23464', 'FMA23465'), 'ulna': ('FMA23467', 'FMA23468')}
MANUB, RIB1, CC1 = 'FMA7486', 'FMA7857', 'FMA7875'
RIBS_R = ['FMA7882', 'FMA7909', 'FMA7957', 'FMA8066', 'FMA8175', 'FMA8229']
SCAPH, LUNATE, TRIQ = 'FMA24435', 'FMA24437', 'FMA24439'


def unit(v):
    v = np.asarray(v, float)
    return v / (np.linalg.norm(v, axis=-1, keepdims=True) + 1e-12)


class Bone:
    def __init__(self, name, faces):
        R, L = B_[name]
        self.m = load(R)
        self.mL = load(L)
        self.v, self.n = self.m.vertices, self.m.vertex_normals
        self.C = (self.m.bounds[0] + self.m.bounds[1]) / 2
        self.F = Frame(self.C)
        self.T = cKDTree(self.v)
        # লম্বা অক্ষ (PCA), উপরের দিকে (+z) মুখ করানো
        c = self.v.mean(0)
        _, _, vt = np.linalg.svd(self.v - c, full_matrices=False)
        ax = vt[0]
        if ax[2] < 0:
            ax = -ax
        self.ax = ax
        s = (self.v - c) @ ax
        self.t = (s - s.min()) / (s.max() - s.min())   # 0 = নিচের/দূরের প্রান্ত, 1 = উপরের
        self.vb, self.fb = decimate(self.m, faces)
        self.near = self.T.query(self.vb)[1]
        self.lm = []
        self.meta = {}

    # ---- সাহায্যকারী ----
    def contact(self, fmas, thr=2.5, on=None):
        P = np.vstack([load(f).vertices for f in fmas]) if not isinstance(fmas, np.ndarray) else fmas
        d, _ = cKDTree(P).query(self.v if on is None else on)
        return d < thr, d

    def ext(self, d, mask=None):
        """mask-এর মধ্যে d দিকে সবচেয়ে দূরের vertex"""
        idx = np.arange(len(self.v)) if mask is None else np.where(mask)[0]
        return idx[np.argmax(self.v[idx] @ unit(d))]

    def medoid(self, mask):
        idx = np.where(mask)[0]
        c = self.v[idx].mean(0)
        return idx[np.argmin(np.linalg.norm(self.v[idx] - c, axis=1))]

    def tband(self, a, b):
        return (self.t >= a) & (self.t <= b)

    def add(self, id_, i=None, p=None, n=None):
        if i is not None:
            p, nn = self.v[i], self.n[i]
        else:
            j = self.T.query(p)[1]
            nn = self.n[j]
            p = p if n is not None else self.v[j]
        n = nn if n is None else unit(n)
        self.lm.append(dict(id=id_, p=self.F.tf(p).round(2).tolist(), n=unit(self.F.tf_dir(n)).round(3).tolist()))

    def surf_at(self, t0, d, off=3.0, w=0.012):
        """t0 উচ্চতায় d দিকে হাড়ের পৃষ্ঠবিন্দু, পৃষ্ঠ থেকে off মিমি বাইরে (স্কিম্যাটিক নালীর পথের জন্য)"""
        m = np.abs(self.t - t0) < w
        if m.sum() < 3:
            m = np.abs(self.t - t0) < 3 * w
        i = self.ext(d, m)
        return self.v[i] + self.n[i] * off

    def zone(self, z, full=True):
        """বইয়ের বর্ণনার এলাকা: (t0, t1, দিক বা None, ন্যূনতম dot)। MRI-তে মাসল হাড়ের গায়ে অনেক জায়গায় লেগে থাকে,
        তাই আসল ছোঁয়া শুধু বইয়ে বলা এলাকার ভেতরে নেওয়া হয়।"""
        t = self.t if full else self.t[self.near]
        n = self.n if full else self.n[self.near]
        m = (t >= z[0]) & (t <= z[1])
        if len(z) > 2 and z[2] is not None:
            m &= n @ unit(z[2]) > (z[3] if len(z) > 3 else 0.2)
        return m

    def mcontact(self, keys, z=None, thr=2.5):
        m, d = self.contact(sum((M[k] for k in keys), []), thr)
        return m & self.zone(z) if z is not None else m

    def regions(self, muscles, joints, thr=2.5, zones=None):
        """muscles: {region: [fma...]}; joints: [(fmas, thr)] → region 8; zones: {region: zone}"""
        reg = np.zeros(len(self.vb), np.uint8)
        dist = np.full(len(self.vb), 99.)
        zones = zones or {}
        for r, fl in muscles.items():
            fl = sum((M[k] if k in M else [k] for k in fl), [])
            d, _ = cKDTree(np.vstack([load(f).vertices for f in fl])).query(self.vb)
            u = (d < thr) & (d < dist)
            if r in zones:
                z = zones[r]
                u &= z[self.near] if isinstance(z, np.ndarray) else self.zone(z, full=False)
            reg[u] = r
            dist[u] = d[u]
        self.art = np.zeros(len(self.vb), bool)
        for fl, jt in joints:
            P = np.vstack([load(f).vertices for f in fl]) if not isinstance(fl, np.ndarray) else fl
            d, _ = cKDTree(P).query(self.vb)
            self.art |= d < d.min() + jt   # MRI-তে জোড়ার ফাঁক থাকে, তাই সবচেয়ে কাছের দূরত্ব থেকে jt মিমি
        reg[self.art] = ARTIC
        return reg

    def core(self, reg, part, ctx=()):
        e = pack(self.F, 'bone', 'bone', self.vb, self.fb, reg)
        e['p'] = base64.b64encode(part[self.near].astype(np.uint8).tobytes()).decode()
        core = dict(scale=SCALE, meshes=[e], lm=self.lm, meta=self.meta)
        FL = Frame((self.mL.bounds[0] + self.mL.bounds[1]) / 2)
        vL, fL = decimate(self.mL, 4000)
        vR, fR = decimate(self.m, 4000)
        core['side'] = dict(R=pack(self.F, 'sideR', 'side', vR, fR), L=pack(FL, 'sideL', 'side', vL, fL))
        return core


def layers(B, muscles, neighbours, tubes, extra=(), crop=35):
    """muscles: [(key, [M keys], faces)] জোড়া মাসলের মেশ (হাড়ের কাছে কাটা); neighbours: [(key, fma, faces)]"""
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    T = B.T
    for key, ks, n in muscles:
        for i, f in enumerate(sum((M[k] for k in ks), [])):
            m = load(f)
            d, _ = T.query(m.vertices)
            kf = (d < crop)[m.faces].all(1)
            if kf.sum() < 30:
                continue
            mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
            mm.remove_unreferenced_vertices()
            v, ff = decimate(mm, n)
            lay['meshes'].append(pack(B.F, f'{key}{i}', 'muscle', v, ff, key=key))
    for key, f, n, *rest in neighbours:
        m = load(f)
        if rest and rest[0]:
            d, _ = T.query(m.vertices)
            kf = (d < rest[0])[m.faces].all(1)
            m = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
            m.remove_unreferenced_vertices()
        v, ff = decimate(m, n)
        e = pack(B.F, key, 'vert', v, ff, key=key)
        e['layer'] = 'vert'
        lay['meshes'].append(e)
    for key, layer, group, col, r, pts in tubes:
        lay['tubes'].append(dict(key=key, layer=layer, group=group, col=col, r=r, pts=B.F.tf(np.array(pts)).round(2).tolist()))
        lay['anchors'][key] = B.F.tf(np.array(pts)[len(pts) // 2]).round(2).tolist()
    for key, g, f, n, layer in extra:
        m = load(f)
        d, _ = T.query(m.vertices)
        kf = (d < 60)[m.faces].all(1)
        mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False)
        mm.remove_unreferenced_vertices()
        v, ff = decimate(mm, n)
        e = pack(B.F, key, g, v, ff, key=key)
        e['layer'] = layer
        lay['meshes'].append(e)
    return lay


def save(name, core, lay):
    out = os.path.join(ROOT, name, 'data')
    write_js(os.path.join(out, 'core.js'), 'window.DATA', core)
    write_js(os.path.join(out, 'layers.js'), 'window.LAYERS', lay)
    print(name, 'ল্যান্ডমার্ক', len(core['lm']), 'meta', core['meta'])


# ================================================================ HUMERUS
def humerus():
    B = Bone('humerus', 14000)
    v, t = B.v, B.t
    scap = load(B_['scapula'][0]).vertices
    rad = load(B_['radius'][0]).vertices
    uln = load(B_['ulna'][0]).vertices
    # head: glenoid-এর দিকে মুখ করা উপরের অংশ; গোলক ফিট
    top = B.tband(0.86, 1.0)
    gc = scap[cKDTree(scap).query(v[top])[0].argmin()] if False else None
    dsc, _ = cKDTree(scap).query(v)
    headc = top & (dsc < np.quantile(dsc[top], 0.25))
    ds2, _ = cKDTree(v).query(scap)
    glen = scap[ds2 < ds2.min() + 4].mean(0)       # glenoid-এর কেন্দ্র: humerus-এর সবচেয়ে কাছের অংশ
    P = v[headc]
    A = np.c_[2 * P, np.ones(len(P))]
    sol = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)[0]
    cen, rr = sol[:3], np.sqrt(sol[3] + (sol[:3] ** 2).sum())
    dc = np.linalg.norm(v - cen, axis=1)
    facing = np.einsum('ij,ij->i', B.n, unit(v - cen)) > 0.6
    hdir = unit(glen - cen)
    head = top & (np.abs(dc - rr) < 3) & facing & (unit(v - cen) @ hdir > np.cos(np.radians(72)))
    B.meta['headDir'] = hdir.round(2).tolist()
    # tubercles
    gt_m = B.mcontact(['supra', 'infra', 'tmin'], (.85, 1, LAT + POST * .3 + UP * .3, 0), 3.0)
    lt_m = B.mcontact(['subsc'], (.84, .97, ANT + MED * .2, .3), 3.0)
    up = B.tband(0.8, 1.0) & ~head
    # lower end
    low = B.tband(0, 0.13)
    dr, _ = cKDTree(rad).query(v)
    du, _ = cKDTree(uln).query(v)
    cap = low & (dr < dr.min() + 5) & (dr < du + 1)
    tro = low & (du < du.min() + 5) & ~cap
    part = np.full(len(v), 4, np.uint8)          # 4 shaft
    part[up] = 5                                 # upper end বাকি (neck)
    part[up & gt_m & (v @ LAT > np.median(v[up] @ LAT))] = 2
    part[up & lt_m] = 3
    part[head] = 1
    part[low] = 8                                # epicondyles ইত্যাদি
    part[cap] = 6
    part[tro] = 7
    # regions
    MUS = {1: ['supra'], 2: ['infra'], 3: ['tmin'], 4: ['subsc'], 5: ['pmClav', 'pmStern', 'pmAbd'], 6: ['lat'], 7: ['tmaj'],
           9: ['deltAnt', 'deltMid', 'deltPost'], 10: ['cb'], 11: ['brach'], 12: ['triLat'], 13: ['triMed'], 14: ['br'],
           15: ['ecrl'], 16: ['pt'], 17: ['fcr', 'pl', 'fds', 'fcu'], 18: ['ecrb', 'ed', 'edm'], 19: ['anc']}
    Z = {1: (.9, 1, UP + LAT * .3, 0), 2: (.86, .98, POST + LAT * .4, 0), 3: (.83, .93, POST + LAT * .3, 0), 4: (.84, .97, ANT + MED * .3, .1),
         5: (.68, .86, ANT + LAT * .5, .1), 6: (.72, .86, ANT, .1), 7: (.7, .86, ANT + MED, .1), 9: (.5, .72, LAT + ANT * .3, .1),
         10: (.42, .62, MED, .1), 11: (.08, .5, ANT, .1), 12: (.58, .86, POST + LAT * .4, .1), 13: (.1, .56, POST, .1),
         14: (.17, .36, LAT, .2), 15: (.1, .19, LAT, .2), 16: (.08, .2, MED + ANT * .5, .2), 17: (0, .12, MED + ANT * .3, .1),
         18: (0, .12, LAT + ANT * .3, .1), 19: (0, .1, POST + LAT * .5, .1)}
    reg = B.regions(MUS, [([B_['radius'][0]], 4.0), ([B_['ulna'][0]], 4.0)], zones=Z)
    reg[(part[B.near] == 1)] = ARTIC
    # ---- ল্যান্ডমার্ক ----
    B.add('head', B.ext(unit(MED + UP * .6 + POST * .3), head))
    i_gt = B.ext(LAT, up & gt_m) if (up & gt_m).any() else B.ext(LAT, up)
    B.add('gtub', i_gt)
    i_lt = B.ext(ANT, up & lt_m) if (up & lt_m).any() else B.ext(ANT + MED * .5, up)
    B.add('ltub', i_lt)
    # intertubercular sulcus: tubercle দুটোর মাঝে সামনে, সবচেয়ে পেছনে বসা বিন্দু
    mid = (v[i_gt] + v[i_lt]) / 2
    band = B.tband(B.t[i_lt] - 0.08, B.t[i_lt] - 0.02)
    cand = np.where(band & (np.linalg.norm(v[:, :2] - mid[:2], axis=1) < 14) & (B.n @ ANT > 0.3))[0]
    i_sul = cand[np.argmax(v[cand] @ POST)] if len(cand) else B.ext(ANT, band)
    B.add('sulcus', i_sul)
    # anatomical neck: head-এর কিনারা (নিচে-ভেতরে)
    rim = top & (np.abs(dc - rr) < 6) & ~head & (v @ MED > np.quantile(v[top] @ MED, .6))
    B.add('anatNeck', B.ext(DOWN, rim) if rim.any() else B.ext(MED, B.tband(.88, .9)))
    tsn = 0.83
    B.add('surgNeck', B.ext(POST + LAT * .3, B.tband(tsn - .01, tsn + .01)))
    B.meta['tSurgNeck'] = tsn
    # deltoid tuberosity: deltoid-এর ছোঁয়ার কেন্দ্র (shaft-এ)
    dm = B.mcontact(['deltAnt', 'deltMid', 'deltPost'], Z[9])
    i_dt = B.medoid(dm) if dm.sum() > 5 else B.ext(LAT + ANT * .3, B.tband(.6, .62))
    B.add('deltTub', i_dt)
    B.meta['tDelt'] = float(t[i_dt])
    cbm = B.mcontact(['cb'], Z[10])
    B.add('cbImp', B.medoid(cbm) if cbm.sum() > 5 else B.ext(MED, B.tband(.55, .57)))
    # spiral groove: lateral head আর medial head-এর মাঝখানে পেছনের পৃষ্ঠ
    tl = B.mcontact(['triLat'], Z[12])
    tm = B.mcontact(['triMed'], Z[13])
    tlo = np.quantile(t[tl], .05) if tl.sum() > 5 else .6
    thi = np.quantile(t[tm], .95) if tm.sum() > 5 else .5
    tg = float(np.clip((tlo + thi) / 2, .42, .62))
    B.meta['tGroove'] = float(tg)
    B.add('spiral', B.ext(POST + LAT * .4, B.tband(tg - .015, tg + .015)))
    # নিচের প্রান্ত
    B.add('medEpi', B.ext(MED, low))
    B.add('latEpi', B.ext(LAT, low))
    B.add('capitulum', B.ext(ANT + DOWN * .5, cap) if cap.any() else B.ext(ANT + LAT * .5, low))
    B.add('trochlea', B.ext(DOWN, tro) if tro.any() else B.ext(DOWN + MED * .3, low))
    # fossae: নিচের প্রান্তে সামনে/পেছনে সবচেয়ে গভীর (পৃষ্ঠ যেখানে ভেতরে বসে)
    def fossa(face, xsel):
        band = B.tband(.06, .16)
        xs = v @ MED
        lo_, hi_ = np.quantile(xs[band], xsel)
        m = band & (xs > lo_) & (xs < hi_) & (B.n @ face > 0.4)
        idx = np.where(m)[0]
        return idx[np.argmin(v[idx] @ face)] if len(idx) else B.ext(face, band)
    B.add('olecFossa', fossa(POST, (.35, .7)))
    B.add('coronFossa', fossa(ANT, (.5, .8)))
    B.add('radFossa', fossa(ANT, (.15, .45)))
    B.add('ulnarGroove', B.ext(POST + MED * 1.2, B.tband(.05, .1)))
    B.add('medSupra', B.ext(MED, B.tband(.17, .22)))
    B.add('latSupra', B.ext(LAT, B.tband(.17, .22)))
    # ---- স্কিম্যাটিক নার্ভ ----
    ax = [B.surf_at(tsn + .01, MED + POST * .3, 4), B.surf_at(tsn, POST, 4), B.surf_at(tsn - .005, POST + LAT, 4), B.surf_at(tsn - .01, LAT + ANT * .4, 5)]
    rad_n = [B.surf_at(tg + .1, MED + POST, 4), B.surf_at(tg + .04, POST + MED * .2, 3.5), B.surf_at(tg, POST + LAT * .4, 3.5), B.surf_at(tg - .05, LAT + POST * .3, 3.5),
             B.surf_at(tg - .12, LAT + ANT * .3, 5), B.surf_at(.13, ANT + LAT * .6, 8), B.surf_at(.05, ANT + LAT * .3, 10)]
    uln_n = [B.surf_at(.55, MED + POST * .2, 6), B.surf_at(.35, MED + POST * .5, 5), B.surf_at(.18, MED + POST * .8, 4), v[B.ext(POST + MED * 1.2, B.tband(.05, .1))] + POST * 3, B.surf_at(-.0, MED + ANT * .2, 6)]
    pchav = [p + np.array([0, 0, -2.5]) for p in ax]
    pfb = [p + np.array([0, 2.5, 1.5]) for p in rad_n[:5]]
    tubes = [('axN', 'nerve', 'nerve', '#f2c230', 1.4, ax), ('pcha', 'artery', 'artery', '#e0443e', 1.0, pchav),
             ('radN', 'nerve', 'nerve', '#f2c230', 1.6, rad_n), ('pfb', 'artery', 'artery', '#e0443e', 1.0, pfb),
             ('ulnN', 'nerve', 'nerve', '#f2c230', 1.6, uln_n)]
    lay = layers(B, [('supra', ['supra'], 1500), ('infra', ['infra'], 1500), ('tmin', ['tmin'], 1000), ('subsc', ['subsc'], 1800),
                     ('pm', ['pmClav', 'pmStern', 'pmAbd'], 1500), ('lat', ['lat'], 1200), ('tmaj', ['tmaj'], 1000),
                     ('delt', ['deltAnt', 'deltMid', 'deltPost'], 2500), ('cb', ['cb'], 1000), ('brach', ['brach'], 1500),
                     ('triLat', ['triLat'], 1500), ('triMed', ['triMed'], 1500), ('triLong', ['triLong'], 1000), ('bic', ['bicLong', 'bicShort'], 1500),
                     ('br', ['br'], 1000), ('ecrl', ['ecrl'], 800), ('pt', ['pt'], 900), ('cfo', ['fcr', 'pl', 'fds', 'fcu'], 1500),
                     ('ceo', ['ecrb', 'ed', 'edm'], 1500), ('anc', ['anc'], 700)],
                [('scapula', B_['scapula'][0], 4000), ('radius', B_['radius'][0], 1800, 60), ('ulna', B_['ulna'][0], 1800, 60), ('clavicle', B_['clavicle'][0], 1500)],
                tubes, crop=40)
    save('humerus', B.core(reg, part), lay)


# ================================================================ CLAVICLE
def clavicle():
    B = Bone('clavicle', 6000)
    v = B.v
    # লম্বা অক্ষ: ভেতর (sternal) থেকে বাইরে (acromial)
    s = (v - v.mean(0)) @ unit(B.ax if abs(B.ax[0]) > .5 else LAT)
    if np.corrcoef(s, v @ LAT)[0, 1] < 0:
        s = -s
    tm = (s - s.min()) / (s.max() - s.min())    # 0 = sternal, 1 = acromial
    B.t = 1 - tm                                 # Bone.t: surf_at ইত্যাদির জন্য (1 = sternal)
    man = load(MANUB).vertices
    acr = load(B_['scapula'][0]).vertices
    dman, _ = cKDTree(np.vstack([man, load(CC1).vertices])).query(v)
    dacr, _ = cKDTree(acr).query(v)
    part = np.full(len(v), 2, np.uint8)
    part[tm > 2 / 3] = 3
    part[tm < .1] = 1
    part[tm > .93] = 4
    MUS = {1: ['deltAnt'], 2: ['trapDesc'], 3: ['pmClav'], 4: ['scm'], 5: ['subcl'], 6: ['sth']}
    # বইয়ের এলাকা (t: 1 = sternal প্রান্ত, 0 = acromial)
    Z = {1: (0, .36, ANT + UP * .5, 0), 2: (0, .36, POST + UP * .5, 0), 3: (.48, .95, ANT, .2), 4: (.62, .97, UP, .1), 5: (.28, .72, DOWN, .2), 6: (.82, 1, POST, .1)}
    reg = B.regions(MUS, [([MANUB, CC1], 3.0), ([B_['scapula'][0]], 3.0)], zones=Z)
    # ল্যান্ডমার্ক
    st = tm < .1
    B.add('sternalEnd', B.ext(MED + DOWN * .2, st))
    B.add('acromialEnd', B.ext(LAT, tm > .93))
    # conoid tubercle: নিচের পৃষ্ঠে, পেছনের কিনারার কাছে, lateral ১/৩-এর শুরুতে
    band = (tm > .62) & (tm < .74)
    B.add('conoid', B.ext(DOWN + POST * .8, band))
    B.add('trapezoid', B.ext(DOWN + ANT * .2, (tm > .76) & (tm < .86)))
    sc = B.mcontact(['subcl'], Z[5], 3.0)
    B.add('subclGroove', B.medoid(sc & (tm > .25) & (tm < .75)) if (sc & (tm > .25) & (tm < .75)).sum() > 5 else B.ext(DOWN, (tm > .45) & (tm < .55)))
    B.add('costoclav', B.ext(DOWN + POST * .3, (tm > .04) & (tm < .14)))
    B.add('curveJn', B.ext(ANT, (tm > .62) & (tm < .7)))
    B.add('medConvex', B.ext(ANT, (tm > .3) & (tm < .4)))
    B.add('latConcave', B.ext(ANT + UP * .2, (tm > .8) & (tm < .88)))
    B.add('nutrient', B.ext(POST, (tm > .45) & (tm < .55)))
    B.add('upperSurf', B.ext(UP, (tm > .7) & (tm < .85)))
    B.meta['length'] = round(float(s.max() - s.min()) / 10, 1)
    # রিলেশন: আসল subclavian artery/vein + স্কিম্যাটিক brachial plexus
    sa = load('FMA3953').vertices
    pts_plex = []
    for q in (.2, .4, .6, .8):
        i = B.ext(POST + DOWN * .3, (tm > q - .05) & (tm < q + .05))
        pts_plex.append(v[i] + POST * 14 + UP * 6 + LAT * 0)
    supsc = [v[B.ext(POST + UP, (tm > q - .05) & (tm < q + .05))] + POST * 4 + UP * 2 for q in (.25, .45, .65, .85)]
    tubes = [('plexus', 'nerve', 'nerve', '#f2c230', 2.2, pts_plex), ('supscV', 'artery', 'artery', '#e0443e', 1.0, supsc)]
    lay = layers(B, [('delt', ['deltAnt'], 1500), ('trap', ['trapDesc'], 1500), ('pm', ['pmClav'], 1500), ('scm', ['scm'], 1500), ('subcl', ['subcl'], 1000), ('sth', ['sth'], 800)],
                 [('manubrium', MANUB, 2500), ('rib1', RIB1, 1500), ('cc1', CC1, 800), ('scapula', B_['scapula'][0], 4000)], tubes,
                 extra=[('sa', 'artery', 'FMA3953', 1500, 'artery'), ('sv', 'vein', 'FMA4755', 1500, 'vein')], crop=30)
    save('clavicle', B.core(reg, part), lay)


# ================================================================ SCAPULA
def scapula():
    B = Bone('scapula', 16000)
    v, n = B.v, B.n
    hum = load(B_['humerus'][0]).vertices
    cla = load(B_['clavicle'][0]).vertices
    dh, _ = cKDTree(hum).query(v)
    gl = dh < dh.min() + 4                          # glenoid: humerus-এর head-এর সবচেয়ে কাছের অংশ
    gc = v[gl].mean(0)
    gn = unit(n[gl].mean(0))
    # body-র তল: glenoid থেকে দূরের অংশের PCA; dorsal দিক পেছনে
    far = np.linalg.norm(v - gc, axis=1) > 45
    c0 = v[far].mean(0)
    _, _, vt = np.linalg.svd(v[far] - c0, full_matrices=False)
    nb = vt[2] if vt[2] @ POST > 0 else -vt[2]
    h = (v - c0) @ nb                               # + = dorsal
    emed = unit(MED - (MED @ nb) * nb)
    eup = unit(np.cross(nb, emed)) if np.cross(nb, emed) @ UP > 0 else -unit(np.cross(nb, emed))
    xm, zu = v @ emed, v @ eup
    # প্রতিটা উচ্চতায় medial আর lateral কিনারা
    zb = np.linspace(zu.min(), zu.max(), 60)
    bi = np.clip(np.searchsorted(zb, zu) - 1, 0, 58)
    mx = np.array([xm[bi == k].max() if (bi == k).any() else np.nan for k in range(59)])
    mn = np.array([xm[bi == k].min() if (bi == k).any() else np.nan for k in range(59)])
    dmed = mx[bi] - xm
    dlat = xm - mn[bi]
    dors, vent = n @ nb > .3, n @ nb < -.3
    gz = gc @ eup
    dc = np.linalg.norm(v - gc, axis=1)
    # spine+acromion আর coracoid আলাদা টুকরো: body-র মতো (তলের কাছে, glenoid-এর ভেতরের দিকে) vertex বাদ দিলে দুটো আলাদা অংশ থাকে
    from scipy.sparse import coo_matrix
    from scipy.sparse.csgraph import connected_components
    gxm = gc @ emed
    keep = (zu > gz - 45) & ~((np.abs(h) < 6) & (xm > gxm + 12)) & ~(dc < 14)
    E = B.m.edges_unique
    ek = keep[E].all(1)
    G = coo_matrix((np.ones(ek.sum()), (E[ek, 0], E[ek, 1])), shape=(len(v), len(v)))
    ncomp, lab = connected_components(G, directed=False)
    def comp_of(i):
        return (lab == lab[i]) & keep
    i_dors = np.where(keep)[0][np.argmax(h[keep])]
    sa = comp_of(i_dors)
    cand = keep & ~sa & (zu > gz)
    i_cor = np.where(cand)[0][np.argmax(v[cand] @ ANT)] if cand.any() else None
    cora = comp_of(i_cor) & (zu > gz - 5) & (xm < gxm + 16) if i_cor is not None else np.zeros(len(v), bool)
    acro = sa & (xm < gxm + 6) & (zu > gz + 4)
    spine = sa & ~acro & (h > 3)
    neck = (dc < 20) & ~acro & ~cora
    part = np.full(len(v), 1, np.uint8)             # 1 body
    part[spine] = 2
    part[acro] = 3
    part[cora] = 4
    part[neck] = 5
    part[gl] = 6
    sp_z = np.median(zu[spine]) if spine.any() else gz
    infang = zu.min()
    MUS = {1: ['subsc'], 2: ['serr'], 3: ['supra'], 4: ['infra'], 5: ['tmin'], 6: ['tmaj'], 7: ['lat'], 9: ['deltAnt', 'deltMid', 'deltPost'],
           10: ['trapDesc', 'trapTrans', 'trapAsc'], 11: ['lev'], 12: ['rhMin'], 13: ['rhMaj'], 14: ['pmin'], 15: ['cb', 'bicShort'],
           16: ['bicLong'], 17: ['triLong'], 18: ['omo']}
    body = part == 1
    Z = {1: vent & body & (dmed > 6), 2: vent & (dmed < 14), 3: dors & body & (zu > sp_z) & (dmed > 3), 4: dors & body & (zu < sp_z) & (dlat > 8) & (dmed > 3),
         5: dors & (dlat < 14) & (zu > infang + 40) & (zu < gz - 10), 6: dors & (dlat < 25) & (zu < infang + 45) & (zu > infang + 8), 7: (zu < infang + 18),
         9: spine | acro, 10: spine | acro, 11: (dmed < 12) & (zu > sp_z + 5), 12: (dmed < 12) & (np.abs(zu - sp_z) < 14), 13: (dmed < 12) & (zu < sp_z - 8),
         14: cora, 15: cora, 16: (dc < 30) & (zu > gz), 17: (dc < 35) & (zu < gz), 18: (zu > zu.max() - 40) & ~acro & ~cora & (h < 6)}
    reg = B.regions(MUS, [([B_['humerus'][0]], 4.0), ([B_['clavicle'][0]], 3.0)], zones=Z)
    reg[gl[B.near] & (reg == 0)] = ARTIC
    # ---- ল্যান্ডমার্ক ----
    B.add('glenoid', p=gc, n=gn)
    B.add('supraGT', B.ext(eup, gl | ((dc < 16) & (zu > gz))))
    lowrim = (dc < 30) & (zu < gz - 10) & (dlat < 10)
    B.add('infraGT', B.ext(-eup + unit(-emed) * .3, (dc < 32) & (zu < gz - 12) & (dlat < 12)) if lowrim.any() else B.ext(-eup, dc < 30))
    B.add('coracoidTip', B.ext(ANT + LAT * .2, cora))
    B.add('acromionTip', B.ext(ANT + LAT * .3, acro))
    B.add('acromialAngle', B.ext(POST + LAT, acro))
    dcl, _ = cKDTree(cla).query(v)
    ai = np.where(acro)[0]
    B.add('clavFacet', ai[np.argmin(dcl[ai])])
    # crest of spine: সবচেয়ে dorsal রেখা, মাঝামাঝি
    sp_idx = np.where(spine)[0]
    mid_sp = sp_idx[np.abs(xm[sp_idx] - np.median(xm[sp_idx])) < 8]
    B.add('crest', mid_sp[np.argmax(h[mid_sp])] if len(mid_sp) else B.ext(nb, spine))
    B.add('spineRoot', B.ext(emed, spine))
    root_x = xm[B.ext(emed, spine)]
    dtub = sp_idx[np.abs(xm[sp_idx] - (root_x - 18)) < 5]
    B.add('deltTubSc', dtub[np.argmax(h[dtub] - zu[dtub] * .3)] if len(dtub) else B.ext(nb, spine))
    sgn = (dc > 12) & (dc < 32) & dors & (np.abs(zu - gz - 8) < 10) & ~acro & ~spine
    B.add('spinoglenoid', B.medoid(sgn) if sgn.sum() > 3 else B.ext(nb, neck))
    # suprascapular notch: superior border-এর খাঁজ, coracoid-এর গোড়ার ঠিক ভেতরে
    topb = (zu > zu.max() - 45) & ~acro & ~cora & (h < 8) & (h > -8)
    tb = np.where(topb)[0]
    xs = np.linspace(np.quantile(xm[tb], .05), np.quantile(xm[tb], .6), 25)
    prof = [(x, tb[np.abs(xm[tb] - x) < 2.5]) for x in xs]
    prof = [(x, ii[np.argmax(zu[ii])]) for x, ii in prof if len(ii)]
    k = int(np.argmin([zu[i] for x, i in prof[:max(3, len(prof) // 2)]]))
    i_notch = prof[k][1]
    B.add('suprascNotch', i_notch)
    B.add('supAngle', B.ext(UP + MED * .8, ~acro & ~cora))
    B.add('infAngle', B.ext(DOWN, None))
    i_mb = B.ext(emed, np.abs(zu - (sp_z + infang) / 2) < 6)
    B.add('medBorder', i_mb)
    i_lb = B.ext(-emed, np.abs(zu - (gz + infang) / 2) < 6)
    B.add('latBorder', i_lb)
    B.add('supBorder', prof[min(len(prof) - 1, k + 6)][1])
    B.add('subscFossa', B.medoid(vent & body & (dmed > 20) & (dlat > 15)))
    B.add('supraFossa', B.medoid(dors & body & (zu > sp_z + 6)))
    B.add('infraFossa', B.medoid(dors & body & (zu < sp_z - 15) & (dlat > 15) & (dmed > 15)))
    B.meta['spineZ'] = float(sp_z - gz)
    # ---- স্কিম্যাটিক নালী ও নার্ভ ----
    pn = v[i_notch]
    sup_n = [pn + eup * 22 + nb * 4 - emed * 4, pn + nb * 2 + eup * 1, pn + nb * 6 - eup * 6 - emed * 6, v[B.ext(nb, (dc < 30) & (zu > gz) & dors & ~acro)] + nb * 3]
    sgp = v[B.ext(nb, sgn)] if sgn.any() else gc + nb * 10
    sup_n += [sgp + nb * 3, v[B.medoid(dors & body & (zu < sp_z - 15) & (dlat > 15) & (dmed > 15))] + nb * 4]
    sup_a = [pn + eup * 26 + nb * 2 + emed * 4, pn + eup * 6 + nb * 1, pn + eup * 3 + nb * 8 - emed * 8, sup_n[3] + eup * 3]
    lig = [pn - emed * 5 + eup * 4, pn + eup * 4.5, pn + emed * 5 + eup * 4]
    lbm = v[B.ext(-emed, np.abs(zu - (gz - 35)) < 5)]
    csa = [lbm + ANT * 10 + DOWN * 2, lbm - emed * 4, lbm + nb * 6 + emed * 6, lbm + nb * 6 + emed * 25 - eup * 6]
    mb_pts = [v[B.ext(emed, np.abs(zu - z0) < 5)] + emed * 5 + nb * 2 for z0 in np.linspace(zu.max() - 10, infang + 15, 6)]
    dsn = [p + nb * 3 for p in mb_pts]
    acc = [v[B.ext(UP + MED * .8, ~acro & ~cora)] + nb * 10 + eup * 18 + emed * 10, v[B.ext(UP + MED * .8, ~acro & ~cora)] + nb * 8, v[B.ext(UP + MED * .8, ~acro & ~cora)] + nb * 9 - eup * 25 + emed * 6]
    tubes = [('supscN', 'nerve', 'nerve', '#f2c230', 1.4, sup_n), ('supscA', 'artery', 'artery', '#e0443e', 1.2, sup_a), ('tsl', 'organ', 'organ', '#d8d2c0', 1.3, lig),
             ('circScap', 'artery', 'artery', '#e0443e', 1.2, csa), ('dsn', 'nerve', 'nerve', '#f2c230', 1.1, dsn), ('dtca', 'artery', 'artery', '#e0443e', 1.0, mb_pts),
             ('accN', 'nerve', 'nerve', '#f2c230', 1.3, acc)]
    lay = layers(B, [('subsc', ['subsc'], 2000), ('serr', ['serr'], 2500), ('supra', ['supra'], 1500), ('infra', ['infra'], 1800), ('tmin', ['tmin'], 900), ('tmaj', ['tmaj'], 1000),
                     ('lat', ['lat'], 1500), ('delt', ['deltAnt', 'deltMid', 'deltPost'], 2500), ('trap', ['trapDesc', 'trapTrans', 'trapAsc'], 2500), ('lev', ['lev'], 900),
                     ('rhMin', ['rhMin'], 700), ('rhMaj', ['rhMaj'], 1000), ('pmin', ['pmin'], 900), ('cbb', ['cb', 'bicShort'], 1000), ('bicLong', ['bicLong'], 800),
                     ('triLong', ['triLong'], 900), ('omo', ['omo'], 600)],
                [('humerus', B_['humerus'][0], 2500, 90), ('clavicle', B_['clavicle'][0], 1500)] + [(f'rib{i+2}', f, 900, 70) for i, f in enumerate(RIBS_R)],
                tubes, crop=35)
    save('scapula', B.core(reg, part), lay)


# ================================================================ RADIUS / ULNA
def radius():
    B = Bone('radius', 7000)
    v, t = B.v, B.t
    hum = load(B_['humerus'][0]).vertices
    uln = load(B_['ulna'][0]).vertices
    dU, _ = cKDTree(uln).query(v)
    dH, _ = cKDTree(hum).query(v)
    carp = np.vstack([load(SCAPH).vertices, load(LUNATE).vertices])
    dC, _ = cKDTree(carp).query(v)
    bic = B.mcontact(['bicLong', 'bicShort'], (.75, .95, MED + ANT * .3, -.2), 3.0)
    part = np.full(len(v), 4, np.uint8)               # 4 shaft
    part[t > .9] = 2                                  # neck
    part[t > .95] = 1                                 # head
    part[bic] = 3                                     # tuberosity
    part[t < .1] = 5                                  # lower end
    sty = (t < .06) & (v @ LAT > np.quantile(v[t < .06] @ LAT, .8))
    part[sty] = 6
    MUS = {1: ['bicLong', 'bicShort'], 2: ['sup'], 3: ['pt'], 4: ['fds'], 5: ['fpl'], 6: ['pq'], 7: ['apl'], 9: ['epb'], 10: ['br'], 11: ['iom']}
    Z = {1: (.75, .95, MED, -.3), 2: (.62, .95, LAT, -.3), 3: (.45, .65, LAT, .1), 4: (.62, .85, ANT, .1), 5: (.3, .8, ANT, .1), 6: (.05, .28, ANT, .1),
         7: (.4, .75, POST, .1), 9: (.15, .45, POST, .1), 10: (.02, .15, LAT, .1), 11: (.1, .85, MED, .1)}
    reg = B.regions(MUS, [([B_['humerus'][0]], 3.0), ([B_['ulna'][0]], 2.5), ([SCAPH, LUNATE], 3.0)], zones=Z)
    head = t > .95
    B.add('head', B.ext(UP, head))
    B.add('headRim', B.ext(MED, B.tband(.95, .99)))
    B.add('neck', B.ext(LAT + ANT * .3, B.tband(.9, .93)))
    B.add('radTub', B.medoid(bic) if bic.sum() > 4 else B.ext(MED, B.tband(.85, .88)))
    B.add('ptImp', B.medoid(B.mcontact(['pt'], Z[3])) if B.mcontact(['pt'], Z[3]).sum() > 4 else B.ext(LAT, B.tband(.52, .55)))
    B.add('intBorder', B.ext(MED, B.tband(.45, .5)))
    B.add('antBorder', B.ext(ANT + LAT * .4, B.tband(.6, .65)))
    B.add('postBorder', B.ext(POST + LAT * .3, B.tband(.45, .5)))
    B.add('antSurf', B.ext(ANT, B.tband(.4, .45)))
    B.add('nutrient', B.ext(ANT + MED * .5, B.tband(.55, .6)))
    B.add('styloid', B.ext(DOWN + LAT * .3, sty))
    ul = (t < .12) & (dU < dU[t < .12].min() + 3)
    B.add('ulnarNotch', B.medoid(ul) if ul.sum() > 3 else B.ext(MED, B.tband(.03, .08)))
    lst = B.tband(.03, .09)
    xs = v @ LAT
    mid_x = np.median(xs[lst])
    cand = lst & (np.abs(xs - mid_x) < 8)
    B.add('lister', B.ext(POST, cand))
    B.add('carpalSurf', B.ext(DOWN, (t < .04) & (dC < dC.min() + 4)))
    B.add('antLowerRidge', B.ext(ANT, B.tband(.04, .08)))
    # স্কিম্যাটিক: posterior interosseous nerve (supinator-এর দুই স্তরের মাঝে), radial artery (নিচের প্রান্তের সামনে), EPL tendon (Lister-এর পাশ দিয়ে)
    pin = [B.surf_at(.97, LAT + ANT * .5, 8), B.surf_at(.88, LAT + ANT * .2, 4), B.surf_at(.8, LAT + POST * .5, 3.5), B.surf_at(.72, POST + LAT * .3, 5), B.surf_at(.62, POST, 7)]
    ra = [B.surf_at(.35, ANT + MED * .2, 7), B.surf_at(.2, ANT, 5), B.surf_at(.08, ANT + LAT * .2, 4), B.surf_at(.03, LAT, 5), B.surf_at(-.02, POST + LAT, 6)]
    epl = [B.surf_at(.25, POST + MED * .2, 4), B.surf_at(.1, POST, 2.5), B.surf_at(.04, POST + MED * .2, 2.5), B.surf_at(-.03, POST + LAT * .8, 6)]
    tubes = [('pin', 'nerve', 'nerve', '#f2c230', 1.3, pin), ('radA', 'artery', 'artery', '#e0443e', 1.4, ra), ('eplT', 'organ', 'organ', '#f4efe2', 1.4, epl)]
    lay = layers(B, [('bic', ['bicLong', 'bicShort'], 1200), ('sup', ['sup'], 1200), ('pt', ['pt'], 900), ('fds', ['fds'], 1200), ('fpl', ['fpl'], 1000),
                     ('pq', ['pq'], 700), ('apl', ['apl'], 800), ('epb', ['epb'], 700), ('br', ['br'], 900), ('iom', ['iom'], 1200)],
                [('humerus', B_['humerus'][0], 1500, 50), ('ulna', B_['ulna'][0], 2500), ('scaphoid', SCAPH, 600), ('lunate', LUNATE, 600)], tubes, crop=25)
    save('radius', B.core(reg, part), lay)


def ulna():
    B = Bone('ulna', 7000)
    v, t = B.v, B.t
    hum = load(B_['humerus'][0]).vertices
    rad = load(B_['radius'][0]).vertices
    dH, _ = cKDTree(hum).query(v)
    dR, _ = cKDTree(rad).query(v)
    troch = (t > .8) & (dH < dH.min() + 4)
    tz = v[troch] @ UP
    tn_lo = np.quantile(t[troch], .1) if troch.any() else .86
    part = np.full(len(v), 4, np.uint8)
    part[t > tn_lo - .02] = 2                         # coronoid অঞ্চল
    part[(t > np.quantile(t[troch], .55)) & (v @ POST > np.quantile(v[t > .9] @ POST, .3))] = 1   # olecranon
    part[troch] = 3                                   # trochlear notch
    rn = (t > .8) & (dR < dR[t > .8].min() + 3) & (v @ LAT > np.median(v[t > .8] @ LAT))
    part[rn] = 7                                      # radial notch
    part[t < .08] = 5                                 # head
    sty = (t < .05) & (v @ (POST + MED) > np.quantile(v[t < .05] @ (POST + MED), .75))
    part[sty] = 6
    MUS = {1: ['triLong', 'triLat', 'triMed'], 2: ['brach'], 3: ['anc'], 4: ['sup'], 5: ['fdp'], 6: ['pq'], 7: ['apl'], 9: ['epl'], 10: ['ei'], 11: ['fcu'], 12: ['fds', 'pt'], 13: ['iom']}
    Z = {1: (.93, 1, UP + POST, -.2), 2: (.72, .9, ANT, .1), 3: (.72, .97, LAT + POST, .1), 4: (.68, .86, LAT, .1), 5: (.25, .9, MED + ANT * .5, .1), 6: (.05, .25, ANT, .1),
         7: (.5, .75, POST + LAT * .3, .1), 9: (.3, .6, POST + LAT * .3, .1), 10: (.15, .35, POST + LAT * .3, .1), 11: (.45, .97, MED + POST * .5, .1), 12: (.75, .9, MED + ANT, .1), 13: (.1, .8, LAT, .1)}
    reg = B.regions(MUS, [([B_['humerus'][0]], 3.0), ([B_['radius'][0]], 2.5)], zones=Z)
    B.add('olecranon', B.ext(UP + POST * .3, t > .95))
    B.add('olecPost', B.ext(POST, B.tband(.9, .96)))
    B.add('trochNotch', B.ext(ANT, troch) if troch.any() else B.ext(ANT, B.tband(.88, .92)))
    B.add('coronoid', B.ext(ANT + UP * .2, B.tband(tn_lo - .05, tn_lo + .02)))
    br = B.mcontact(['brach'], Z[2])
    B.add('ulnTub', B.medoid(br) if br.sum() > 4 else B.ext(ANT, B.tband(.8, .83)))
    B.add('radNotch', B.medoid(rn) if rn.sum() > 3 else B.ext(LAT, B.tband(.86, .9)))
    sc_ = B.tband(.74, .84) & (v @ LAT > np.quantile(v[B.tband(.74, .84)] @ LAT, .85))
    B.add('supCrest', B.ext(LAT + POST * .5, sc_))
    B.add('sublime', B.ext(MED + UP * .2, B.tband(tn_lo - .04, tn_lo + .01)))
    B.add('intBorder', B.ext(LAT, B.tband(.45, .5)))
    B.add('postBorder', B.ext(POST, B.tband(.45, .5)))
    B.add('antSurf', B.ext(ANT + MED * .2, B.tband(.5, .55)))
    B.add('medSurf', B.ext(MED, B.tband(.55, .6)))
    B.add('head', B.ext(LAT + DOWN * .3, t < .06))
    B.add('styloid', B.ext(DOWN, sty))
    B.add('ecuGroove', B.ext(POST + MED * .2, B.tband(.02, .06)))
    # স্কিম্যাটিক: ulnar nerve (FCU-র দুই head-এর মাঝ দিয়ে, ulna-র ভেতরের দিক ঘেঁষে) আর ulnar artery
    un = [B.surf_at(1.03, MED + POST, 8), B.surf_at(.95, MED + POST * .5, 5), B.surf_at(.85, MED + ANT * .3, 6), B.surf_at(.6, MED + ANT * .6, 7), B.surf_at(.3, ANT + MED * .4, 7), B.surf_at(.05, ANT + MED * .3, 8)]
    ua = [p + ANT * 3 + LAT * 3 for p in un[2:]]
    tubes = [('ulnN', 'nerve', 'nerve', '#f2c230', 1.5, un), ('ulnA', 'artery', 'artery', '#e0443e', 1.3, ua)]
    lay = layers(B, [('tri', ['triLong', 'triLat', 'triMed'], 1500), ('brach', ['brach'], 1200), ('anc', ['anc'], 700), ('sup', ['sup'], 1000), ('fdp', ['fdp'], 1500),
                     ('pq', ['pq'], 700), ('apl', ['apl'], 800), ('epl', ['epl'], 800), ('ei', ['ei'], 600), ('fcu', ['fcu'], 1200), ('fdsPt', ['fds', 'pt'], 1200), ('iom', ['iom'], 1200)],
                [('humerus', B_['humerus'][0], 1500, 50), ('radius', B_['radius'][0], 2500)], tubes, crop=25)
    save('ulna', B.core(reg, part), lay)


# ================================================================ HAND
CARP = [('scaphoid', 'FMA24435'), ('lunate', 'FMA24437'), ('triquetral', 'FMA24439'), ('pisiform', 'FMA24441'),
        ('trapezium', 'FMA24443'), ('trapezoid', 'FMA23725'), ('capitate', 'FMA24446'), ('hamate', 'FMA24448')]
MCS = [('mc1', 'FMA24464'), ('mc2', 'FMA24466'), ('mc3', 'FMA24468'), ('mc4', 'FMA24470'), ('mc5', 'FMA24472')]
PHAL = [('pp1', 'FMA24450'), ('pp2', 'FMA24451'), ('pp3', 'FMA24452'), ('pp4', 'FMA24453'), ('pp5', 'FMA24454'),
        ('mp2', 'FMA24455'), ('mp3', 'FMA24456'), ('mp4', 'FMA24457'), ('mp5', 'FMA24458'),
        ('dp1', 'FMA24459'), ('dp2', 'FMA24460'), ('dp3', 'FMA24461'), ('dp4', 'FMA24462'), ('dp5', 'FMA24463')]
CARP_L = {'scaphoid': 'FMA24436', 'lunate': 'FMA24438', 'triquetral': 'FMA24440', 'pisiform': 'FMA24442', 'trapezium': 'FMA24444',
          'trapezoid': 'FMA24445', 'capitate': 'FMA24447', 'hamate': 'FMA24449'}
HM = {'fcu': ['FMA38617'], 'ecrl': ['FMA38495'], 'ecrb': ['FMA38498'], 'fcr': ['FMA38460'], 'apl': ['FMA38516'], 'adm': ['FMA37396'], 'apb': ['FMA37386'],
      'op': ['FMA37390'], 'odm': ['FMA37400'], 'fdmb': ['FMA37398'], 'fpb': ['FMA46110', 'FMA65198'], 'add': ['FMA46121', 'FMA46123'], 'dio': ['FMA42404'],
      'pio': ['FMA42402'], 'fdp': ['FMA38479'], 'fds': ['FMA38638'], 'fpl': ['FMA38482'], 'epl': ['FMA38522'], 'epb': ['FMA38519'], 'ext': ['FMA38501', 'FMA38525', 'FMA38504']}


def hand():
    allb = CARP + MCS + PHAL
    meshes = [(k, load(f)) for k, f in allb]
    V = np.vstack([m.vertices for _, m in meshes])
    C = (V.min(0) + V.max(0)) / 2
    F = Frame(C)
    # palm-এর দিক: স্ক্যানে হাতের তালু কোন দিকে (metacarpal-গুলোর তল থেকে, flexor retinaculum-এর দিকে)
    mcv = np.vstack([m.vertices for k, m in meshes if k.startswith('mc') and k != 'mc1'])
    c0 = mcv.mean(0)
    _, _, vt = np.linalg.svd(mcv - c0, full_matrices=False)
    palm = vt[2] if (load('FMA40120').vertices.mean(0) - c0) @ vt[2] > 0 else -vt[2]
    vs, fs, part, offs = [], [], [], 0
    ids = {k: i + 1 for i, (k, _) in enumerate(allb)}
    for k, m in meshes:
        n = 1400 if k in dict(CARP) else 1100 if k.startswith('mc') else 600
        v, f = decimate(m, n)
        vs.append(v); fs.append(np.asarray(f) + offs); part.append(np.full(len(v), ids[k], np.uint8)); offs += len(v)
    vb, fb, part = np.vstack(vs), np.vstack(fs), np.concatenate(part)
    T = cKDTree(vb)
    nb = trimesh.Trimesh(vb, fb, process=False).vertex_normals
    # regions: মাসল (২.৫ মিমি) আর জোড়ার তল (পাশের হাড় ১.৫ মিমির মধ্যে)
    reg = np.zeros(len(vb), np.uint8)
    dist = np.full(len(vb), 99.)
    MUS = {1: 'fcu', 2: 'ecrl', 3: 'ecrb', 4: 'fcr', 5: 'apl', 6: 'adm', 7: 'apb', 9: 'op', 10: 'odm', 11: 'fdmb', 12: 'fpb', 13: 'add', 14: 'dio', 15: 'pio',
           16: 'fdp', 17: 'fds', 18: 'fpl', 19: 'epl', 20: 'epb', 21: 'ext'}
    # বইয়ে বলা হাড় (অন্য হাড়ে ছোঁয়া বাদ)
    ON = {1: ['pisiform'], 2: ['mc2'], 3: ['mc3'], 4: ['mc2', 'mc3', 'trapezium'], 5: ['mc1'], 6: ['pisiform', 'pp5'], 7: ['scaphoid', 'trapezium', 'pp1'],
          9: ['mc1', 'trapezium'], 10: ['mc5', 'hamate'], 11: ['hamate', 'pp5'], 12: ['trapezium', 'pp1'], 13: ['mc3', 'capitate', 'trapezoid', 'mc2', 'pp1'],
          14: ['mc1', 'mc2', 'mc3', 'mc4', 'mc5', 'pp2', 'pp3', 'pp4'], 15: ['mc1', 'mc2', 'mc4', 'mc5', 'pp1', 'pp2', 'pp4', 'pp5'],
          16: ['dp2', 'dp3', 'dp4', 'dp5'], 17: ['mp2', 'mp3', 'mp4', 'mp5'], 18: ['dp1'], 19: ['dp1'], 20: ['pp1'], 21: ['mp2', 'mp3', 'mp4', 'mp5', 'dp2', 'dp3', 'dp4', 'dp5']}
    for r, k in MUS.items():
        d, _ = cKDTree(np.vstack([load(f).vertices for f in HM[k]])).query(vb)
        u = (d < 2.5) & (d < dist) & np.isin(part, [ids[b] for b in ON[r]])
        reg[u] = r; dist[u] = d[u]
    for k, m in meshes:
        own = part == ids[k]
        d, _ = cKDTree(vb[~own]).query(vb[own])
        idx = np.where(own)[0][d < 1.6]
        reg[idx] = ARTIC
    e = pack(F, 'hand', 'bone', vb, fb, reg)
    e['p'] = base64.b64encode(part.tobytes()).decode()
    core = dict(scale=SCALE, meshes=[e], lm=[], meta=dict(palm=F.tf_dir(palm).round(3).tolist()), ids=ids)
    lm = core['lm']
    D = dict(meshes)
    def addp(id_, p, n):
        lm.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=unit(F.tf_dir(n)).round(3).tolist()))
    def ext(k, d, mask=None):
        m = D[k]
        vv, nn = m.vertices, m.vertex_normals
        idx = np.arange(len(vv)) if mask is None else np.where(mask(vv))[0]
        i = idx[np.argmax(vv[idx] @ unit(d))]
        addp_ = (vv[i], nn[i])
        return addp_
    LATh, MEDh = LAT, MED
    # মধ্যম আঙুলের দিক (নিচে)
    dist_dir = unit(D['dp3'].vertices.mean(0) - D['capitate'].vertices.mean(0))
    prox = -dist_dir
    rad = unit(D['mc1'].vertices.mean(0) - D['mc5'].vertices.mean(0))
    rad = unit(rad - (rad @ dist_dir) * dist_dir - (rad @ palm) * palm)
    for id_, k, d in [('scaphTub', 'scaphoid', palm + rad * .6 + dist_dir * .4), ('trapCrest', 'trapezium', palm + rad * .3), ('pisiform', 'pisiform', palm - rad * .3),
                      ('hookHam', 'hamate', palm), ('capHead', 'capitate', prox + palm * .2), ('lunatePalm', 'lunate', palm), ('triq', 'triquetral', -rad + prox * .2),
                      ('trapezoid', 'trapezoid', -palm), ('mc3Styl', 'mc3', -palm + rad * .5 + prox * .9), ('mc5Tub', 'mc5', -rad + prox * .8), ('mc1Base', 'mc1', prox),
                      ('mc2Base', 'mc2', -palm + prox * .8), ('mc1Head', 'mc1', dist_dir), ('mc3Head', 'mc3', dist_dir), ('pp3Base', 'pp3', palm + prox * .3),
                      ('mp3', 'mp3', palm), ('dpTuft', 'dp3', palm + dist_dir * .6), ('dp1', 'dp1', palm + dist_dir * .4), ('mc4Base', 'mc4', -palm + prox * .8)]:
        p, n_ = ext(k, d)
        addp(id_, p, n_)
    # flexor retinaculum (আসল) আর median nerve, ulnar nerve ও artery (স্কিম্যাটিক)
    lay = dict(meshes=[], tubes=[], spheres=[], anchors={})
    ret = load('FMA40120'); v, f = decimate(ret, 1500)
    e = pack(F, 'ret', 'organ', v, f, key='ret'); e['layer'] = 'organ'; lay['meshes'].append(e)
    for key, k, n in [('fcu', 'fcu', 1500), ('ecrl', 'ecrl', 700), ('ecrb', 'ecrb', 700), ('fcr', 'fcr', 700), ('apl', 'apl', 700), ('adm', 'adm', 700), ('apb', 'apb', 700),
                      ('op', 'op', 800), ('odm', 'odm', 700), ('fdmb', 'fdmb', 500), ('fpb', 'fpb', 900), ('add', 'add', 1200), ('dio', 'dio', 2500), ('pio', 'pio', 1500),
                      ('fdp', 'fdp', 2200), ('fds', 'fds', 1500), ('fpl', 'fpl', 900), ('epl', 'epl', 700), ('epb', 'epb', 700), ('ext', 'ext', 2000)]:
        for i, fm in enumerate(HM[k]):
            m = load(fm)
            d, _ = T.query(m.vertices)
            kf = (d < 25)[m.faces].all(1)
            if kf.sum() < 30:
                continue
            mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False); mm.remove_unreferenced_vertices()
            v, f = decimate(mm, n)
            lay['meshes'].append(pack(F, f'{key}{i}', 'muscle', v, f, key=key))
    for k, fm in [('radius', B_['radius'][0]), ('ulna', B_['ulna'][0])]:
        m = load(fm); d, _ = T.query(m.vertices); kf = (d < 40)[m.faces].all(1)
        mm = trimesh.Trimesh(m.vertices, m.faces[kf], process=False); mm.remove_unreferenced_vertices()
        v, f = decimate(mm, 1200); e = pack(F, k, 'vert', v, f, key=k); e['layer'] = 'vert'; lay['meshes'].append(e)
    # carpal tunnel-এর ভেতর দিয়ে median nerve: retinaculum-এর ঠিক নিচে (dorsal দিকে), capitate-এর সামনে
    rv = ret.vertices
    rc = rv.mean(0)
    cap = D['capitate'].vertices.mean(0)
    # tunnel-এর ভেতর: retinaculum-এর পেছনে (dorsal), carpal হাড়ের সামনে
    tun = rc * .4 + cap * .6
    mn = [tun + prox * 45 + palm * 4, tun + prox * 18, tun, tun + dist_dir * 18 + palm * 3, tun + dist_dir * 30 + palm * 6]
    lay['tubes'].append(dict(key='median', layer='nerve', group='nerve', col='#f2c230', r=2.0, pts=F.tf(np.array(mn)).round(2).tolist()))
    pis = D['pisiform'].vertices.mean(0); hook = D['hamate'].vertices[np.argmax(D['hamate'].vertices @ palm)]
    gy = (pis + hook) / 2 + palm * 6 + rad * 3
    un = [gy + prox * 45, gy + prox * 12, gy, gy + dist_dir * 14 - rad * 4, gy + dist_dir * 26 - rad * 8]
    lay['tubes'].append(dict(key='ulnarN', layer='nerve', group='nerve', col='#f2c230', r=1.6, pts=F.tf(np.array(un)).round(2).tolist()))
    lay['tubes'].append(dict(key='ulnarA', layer='artery', group='artery', col='#e0443e', r=1.3, pts=F.tf(np.array(un) + rad * 4 + palm * 1).round(2).tolist()))
    for k, pts in (('median', mn), ('ulnarN', un)):
        lay['anchors'][k] = F.tf(pts[2]).round(2).tolist()
    lay['anchors']['ulnarA'] = F.tf(np.array(un[1]) + rad * 4).round(2).tolist()
    lay['anchors']['ret'] = F.tf(rc + palm * 2).round(2).tolist()
    core['meta']['retC'] = F.tf(tun).round(1).tolist()
    core['meta']['tunnelView'] = unit(F.tf_dir(prox * .75 + palm * .65)).round(3).tolist()
    # "কোনটা?" ট্রেনার: আটটা carpal (ডান), নিজের কেন্দ্রে
    items = []
    for k, f in CARP:
        m = load(f); Fk = Frame((m.bounds[0] + m.bounds[1]) / 2); v, ff = decimate(m, 2500)
        it = pack(Fk, k, 'which', v, ff); it['k'] = k; items.append(it)
    write_js(os.path.join(ROOT, 'hand', 'data', 'which.js'), 'window.WHICH', dict(items=items))
    # ডান না বাম: scaphoid (বইয়ে tubercle দিয়ে পাশ চেনা)
    mR, mL = load('FMA24435'), load('FMA24436')
    FR, FL = Frame((mR.bounds[0] + mR.bounds[1]) / 2), Frame((mL.bounds[0] + mL.bounds[1]) / 2)
    vR, fR = decimate(mR, 2500); vL, fL = decimate(mL, 2500)
    core['side'] = dict(R=pack(FR, 'sideR', 'side', vR, fR), L=pack(FL, 'sideL', 'side', vL, fL))
    save('hand', core, lay)


if __name__ == '__main__':
    names = sys.argv[1:] or ['clavicle', 'scapula', 'humerus', 'radius', 'ulna']
    for n in names:
        globals()[n]()
