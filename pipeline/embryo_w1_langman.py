"""সপ্তাহ ১: Langman's Medical Embryology 14th ed., Chapter 3 (বইয়ের পৃষ্ঠা 34–49) অনুযায়ী বাড়তি ডিটেইল।

embryo_w1.py-এর পুরোনো মডেল সব থাকে; এই ফাইল শুধু যোগ করে:
  * পুরোনো ধাপগুলোতে: oolemma-র microvilli, cortical granule, mitochondria, MII spindle-এর তন্তু ও ক্রোমোজোম,
    corona-র নিউক্লিয়াস ও transzonal process, শুক্রাণুর acrosome ও midpiece, নিষেকের তিন ধাপের শুক্রাণু,
    pronucleus-এর nucleolus, sperm aster, zona-য় আটকে থাকা শুক্রাণু, trophoblast-এর কোষ-সীমানা ও নিউক্লিয়াস,
    endometrium-এর epithelial কোষ, পেঁচানো গ্রন্থি, spiral artery, stromal কোষ, syncytium-এর নিউক্লিয়াস, AVE,
    যাত্রাপথে প্রতিটা দিনের ছোট ভ্রূণ, ডিম্বাশয়ে follicle আর corpus luteum।
  * নতুন ধাপ: পরিণত vesicular (Graafian) follicle (Fig. 3.3A), ovulation (3.3B), corpus luteum (3.3C),
    compaction-হওয়া ৮-কোষ (Fig. 3.9B), দেরির blastocyst-এ epiblast/hypoblast/AVE (Fig. 3.11B)।
ধাপের ক্রম ORDER-এ; content.js-এর ORDER একই হতে হবে।
"""
import numpy as np
import trimesh
from scipy.spatial import SphericalVoronoi
from scipy.interpolate import splprep, splev

E = None
g = np.random.default_rng(1414)

# ভিউয়ারের ধাপের ক্রম (সংখ্যা = পাইপলাইনের ধাপ-আইডি)
ORDER = [10, 12, 14, 0, 1, 2, 3, 4, 11, 5, 6, 7, 13, 8, 9]


# ---------------------------------------------------------------- সাহায্যকারী
def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def rot_to(d):
    return trimesh.geometry.align_vectors([0, 0, 1], unit(d))[:3, :3]


def ell(c, r3, sub=1, d=None, amp=0.0, seed=0):
    """উপবৃত্তাকার বস্তু; r3-এর z অক্ষ d দিকে"""
    return E.blob(c, 1.0, sub, amp, seed, scale=r3, rot=None if d is None else rot_to(d))


def seg(a, b, r, sides=5):
    a = np.asarray(a, float); b = np.asarray(b, float)
    if np.linalg.norm(b - a) < 1e-6:
        b = a + [0, 0, .01]
    return trimesh.creation.cylinder(radius=r, segment=[a, b], sections=sides)


def cone(base, tip, r, sides=4):
    base = np.asarray(base, float); tip = np.asarray(tip, float)
    h = np.linalg.norm(tip - base)
    m = trimesh.creation.cone(radius=r, height=h, sections=sides)
    m.apply_transform(trimesh.geometry.align_vectors([0, 0, 1], (tip - base) / h))
    m.apply_translation(base)
    return m


def curve(pts, n=40):
    pts = np.asarray(pts, float)
    tck, _ = splprep(pts.T, s=0, k=min(3, len(pts) - 1))
    return np.array(splev(np.linspace(0, 1, n), tck)).T


def tube2(P, r, sides=10):
    """নমুনা না বাড়িয়ে দেওয়া বিন্দু দিয়েই নল (হালকা মেশ)"""
    P = np.asarray(P, float)
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    up = np.array([0, 1, 0.]) if abs(T[0] @ [0, 1, 0]) < .9 else np.array([1, 0, 0.])
    N = unit(np.cross(T[0], up))
    rr = np.full(len(P), r) if np.ndim(r) == 0 else np.interp(np.linspace(0, 1, len(P)), np.linspace(0, 1, len(r)), r)
    V, F = [], []
    for i, p in enumerate(P):
        N = unit(N - (N @ T[i]) * T[i]); Bv = np.cross(T[i], N)
        for a in np.linspace(0, 2 * np.pi, sides, endpoint=False):
            V.append(p + rr[i] * (np.cos(a) * N + np.sin(a) * Bv))
    for i in range(len(P) - 1):
        for j in range(sides):
            a, b = i * sides + j, i * sides + (j + 1) % sides
            F += [[a, b, a + sides], [b, b + sides, a + sides]]
    c0 = len(V); V += [P[0], P[-1]]
    for j in range(sides):
        F += [[c0, (j + 1) % sides, j], [c0 + 1, (len(P) - 1) * sides + j, (len(P) - 1) * sides + (j + 1) % sides]]
    return trimesh.Trimesh(np.array(V), np.array(F), process=False)


def helix(p0, axis, length, rad, turns, n=None):
    axis = unit(axis)
    a = np.cross(axis, [1, 0, 0] if abs(axis[0]) < .9 else [0, 1, 0]); a = unit(a); b = np.cross(axis, a)
    n = n or int(turns * 10) + 2
    t = np.linspace(0, 1, n)
    return np.asarray(p0, float) + np.outer(t * length, axis) + rad * (np.outer(np.cos(t * turns * 2 * np.pi), a) + np.outer(np.sin(t * turns * 2 * np.pi), b))


def fib(n, seed=0):
    i = np.arange(n) + .5
    phi = np.arccos(1 - 2 * i / n); th = np.pi * (1 + 5 ** .5) * i + seed
    return np.c_[np.cos(th) * np.sin(phi), np.cos(phi), np.sin(th) * np.sin(phi)]


def jitter_dirs(n, amt, seed):
    r = np.random.default_rng(seed)
    D = fib(n, seed) + r.normal(scale=amt, size=(n, 3))
    return D / np.linalg.norm(D, axis=1)[:, None]


def addm(stage, key, group, ms, lim=60000):
    """অনেক ছোট মেশ জুড়ে এক বা একাধিক মেশ (প্রতিটা ভিউয়ারের uint16 সীমার নিচে)"""
    if isinstance(ms, trimesh.Trimesh):
        ms = [ms]
    buf, n = [], 0
    for m in ms:
        if n + len(m.vertices) > lim and buf:
            E.add(stage, key, group, trimesh.util.concatenate(buf)); buf, n = [], 0
        buf.append(m); n += len(m.vertices)
    if buf:
        E.add(stage, key, group, trimesh.util.concatenate(buf))


def raw(stage, key):
    return [m for s, k, gr, m in E.RAW if s == stage and k == key]


def centre(m):
    return np.asarray(m.vertices).mean(0)


def in_sphere(n, R, seed, avoid=()):
    """R গোলকের ভেতরে n-টা এলোমেলো বিন্দু; avoid = [(কেন্দ্র, ব্যাসার্ধ)]"""
    r = np.random.default_rng(seed); out = []
    while len(out) < n:
        p = r.uniform(-R, R, 3)
        if np.linalg.norm(p) > R or any(np.linalg.norm(p - np.asarray(c)) < rr for c, rr in avoid):
            continue
        out.append(p)
    return np.array(out)


def mitos(c, R, n, seed, avoid=()):
    """cytoplasm-এর mitochondria (ছোট লম্বাটে দানা)"""
    r = np.random.default_rng(seed)
    return [ell(np.asarray(c) + p, (.7, .7, 1.6), 0, r.normal(size=3)) for p in in_sphere(n, R, seed, avoid)]


def microvilli(c, R, n, seed, h=2.6, rb=.42, skip=None):
    out = []
    for d in jitter_dirs(n, .02, seed):
        if skip is not None and skip(d):
            continue
        out.append(cone(np.asarray(c) + d * (R - .6), np.asarray(c) + d * (R + h), rb))
    return out


def troph_cells(c, Ro, Ri, n, seed, skip=None):
    """Spherical Voronoi: trophoblast-এর চ্যাপ্টা কোষের সীমানা (বাইরে সামান্য উঁচু রেখা) আর নিউক্লিয়াস (ভেতরের দিকে ফোলা)"""
    c = np.asarray(c, float)
    P = jitter_dirs(n, .12, seed)
    sv = SphericalVoronoi(P, 1.0)
    sv.sort_vertices_of_regions()
    edges = set()
    for reg in sv.regions:
        for a, b in zip(reg, reg[1:] + reg[:1]):
            edges.add((min(a, b), max(a, b)))
    lines, nucs = [], []
    for a, b in edges:
        va, vb = sv.vertices[a], sv.vertices[b]
        if skip is not None and (skip(va) and skip(vb)):
            continue
        k = max(2, int(np.degrees(np.arccos(np.clip(va @ vb, -1, 1))) / 6) + 1)
        pts = [unit(va * (1 - t) + vb * t) for t in np.linspace(0, 1, k + 1)]
        for p, q in zip(pts, pts[1:]):
            lines.append(seg(c + p * (Ro + .5), c + q * (Ro + .5), .55, 5))
    for d in P:
        if skip is not None and skip(d):
            continue
        rm = (Ro + Ri) / 2 - .9
        nucs.append(ell(c + d * rm, (3.6, 2.8, 1.9 + (Ro - Ri) * .12), 1, d))
    return lines, nucs


def comp_cells(C, r, Rb, gap=.8, sub=4, smooth=6):
    """Compaction: প্রতিটা কোষ গোলক, প্রতিবেশীর সাথে সমতল মুখে চাপা (bisector plane) আর বাইরের গোলক Rb-তে সীমিত"""
    C = np.asarray(C, float)
    base = trimesh.creation.icosphere(subdivisions=sub)
    U = base.vertices
    out = []
    for i, ci in enumerate(C):
        t = np.full(len(U), r)
        for j, cj in enumerate(C):
            if i == j:
                continue
            dv = cj - ci; L = np.linalg.norm(dv); n = dv / L
            un = U @ n
            m = un > 1e-6
            t[m] = np.minimum(t[m], (L / 2 - gap / 2) / un[m])
        cu = U @ ci
        tmax = -cu + np.sqrt(np.maximum(cu ** 2 - ci @ ci + Rb ** 2, 0))
        t = np.minimum(t, tmax)
        m = trimesh.Trimesh(ci + U * t[:, None], base.faces.copy(), process=False)
        trimesh.smoothing.filter_taubin(m, iterations=smooth)
        out.append(m)
    return out


def sperm_full(st, head, d, k, acro='intact', tail_len=7, key='sperm'):
    """শুক্রাণু: মাথা (নিউক্লিয়াস), acrosome cap, midpiece, লেজ। d = চলার দিক।
    acro: intact (capacitated, বাঁধার আগে), react (acrosome reaction: থলি ভেঙে enzyme বেরোচ্ছে), none (ঢুকে গেছে)"""
    d = unit(d); head = np.asarray(head, float)
    R = rot_to(d)
    E.add(st, key, 'sperm', E.blob(head, 2.6, 2, 0, 0, scale=(1, .7, 1.9), rot=R))
    side = unit(np.cross(d, [0, 1, 0]) if abs(d[1]) < .9 else np.cross(d, [1, 0, 0]))
    pts = [head - d * 4 - d * t * 9 + side * 3 * np.sin(t * 1.2 + k) for t in range(tail_len)]
    P = curve(pts, 60)
    E.add(st, key, 'sperm', E.tube(pts, np.linspace(.8, .3, 70), 6))
    mid = P[:9]
    E.add(st, 'midp', 'midp', E.tube(mid, .95, 8))
    if acro == 'intact':
        u = trimesh.creation.icosphere(subdivisions=2)
        keep = u.vertices[u.faces].mean(1)[:, 2] > -.15
        cap = trimesh.Trimesh(u.vertices * np.array([2.85, 2.05, 5.3]) @ R.T + head + d * .5, u.faces[keep], process=True)
        E.add(st, 'acro', 'acro', cap)
    elif acro == 'react':
        ves = [E.blob(head + d * 3 + p, .45, 0) for p in in_sphere(22, 4.5, int(abs(head[0] * 10)) + k)]
        addm(st, 'acrov', 'acro', ves)
    return P


# ================================================================ ধাপ ০: নিষেক (Fig. 3.5, 3.6A)
def d0():
    st = 0
    O = np.zeros(3)
    d0v = unit([.82, .1, .56])
    entry = lambda d: d @ d0v > .93 or d @ unit([0, 57.5, 6]) > .97
    addm(st, 'mv', 'mv', microvilli(O, E.OOC, 1100, 3, skip=entry))
    cg = [E.blob(d * g.uniform(51.6, 53.6), .95, 0) for d in jitter_dirs(320, .05, 4)]
    addm(st, 'cg', 'cg', cg)
    addm(st, 'mito', 'mito', mitos(O, 47, 170, 5, avoid=[([0, 48, 4], 12)]))
    # MII spindle: দুই মেরু, তন্তু, মাঝখানের metaphase plate-এ ক্রোমোজোম
    sc = np.array([0, 48, 4.])
    poles = [sc + [-10.5, 0, 0], sc + [10.5, 0, 0]]
    fib_ = []
    for p in poles:
        for a in np.linspace(0, 2 * np.pi, 12, endpoint=False):
            q = sc + [0, 3.2 * np.cos(a), 3.2 * np.sin(a)]
            fib_.append(seg(p, q, .22, 4))
    addm(st, 'sfib', 'fibre', fib_)
    ch = []
    for i, a in enumerate(np.linspace(0, 2 * np.pi, 23, endpoint=False)):
        rr = 1.2 + 1.9 * (i % 3) / 2
        q = sc + [0, rr * np.cos(a), rr * np.sin(a)]
        ch.append(seg(q - [.9, 0, 0], q + [.9, 0, 0], .45, 5))
    addm(st, 'mchr', 'chrom', ch)
    # corona radiata: প্রতিটা কোষের নিউক্লিয়াস, আর অর্ধেক কোষে zona-র ভেতরে ঢোকা transzonal process
    nucs, tz = [], []
    for i, m in enumerate(raw(st, 'corona')):
        c = centre(m); d = unit(c)
        nucs.append(ell(c + d * 1.2, (2.3, 2.3, 3.4), 1, d))
        if i % 2 == 0:
            tip = d * g.uniform(62, 68) + np.cross(d, [0, 1, 0]) * g.uniform(-1.5, 1.5)
            tz.append(E.tube([c - d * 8, (c - d * 8 + tip) / 2 + g.normal(scale=.6, size=3), tip], np.linspace(.75, .35, 10), 5))
    addm(st, 'cnuc', 'cnuc', nucs)
    addm(st, 'tzp', 'tzp', tz)
    # বাইরের cumulus কোষ (আলগা)
    cum = []
    for i, d in enumerate(jitter_dirs(110, .25, 9)):
        if d[0] > .45 and d[1] < .45:
            continue
        c = d * g.uniform(ZO2 + 4, ZO2 + 22)
        cum.append(E.blob(c, 6.2, 1, .12, 400 + i))
        cum.append(ell(c, (2.1, 2.1, 2.1), 0))
    addm(st, 'cumulus', 'cumulus', cum)
    # পুরোনো শুক্রাণুগুলোতে acrosome/midpiece (একই জ্যামিতি থেকে)
    #   ঢুকে পড়া শুক্রাণু (ধাপ ৩): acrosome নেই; zona-য় তার পথ
    E.add(st, 'track', 'track', E.tube([d0v * (E.ZO + 2), d0v * (E.ZI - .5)], 1.7, 8))
    for p in in_sphere(26, 5, 11):
        E.add(st, 'acrov', 'acro', E.blob(d0v * (E.ZO - 2) + p, .45, 0))
    for k, dd in enumerate([[1, -.4, .2], [.7, .2, -.7], [.9, -.1, -.4]]):
        dd = unit(dd); head = dd * (E.ZO + 3); R = rot_to(-dd)
        u = trimesh.creation.icosphere(subdivisions=2)
        keep = u.vertices[u.faces].mean(1)[:, 2] > -.15
        E.add(st, 'acro', 'acro', trimesh.Trimesh(u.vertices * np.array([2.85, 2.05, 5.3]) @ R.T + head - dd * .5, u.faces[keep], process=True))
        side = unit(np.cross(-dd, [0, 1, 0]))
        pts = [head + dd * 4 + dd * t * 9 + side * 3 * np.sin(t * 1.2 + k + 1) for t in range(7)]
        E.add(st, 'midp', 'midp', E.tube(curve(pts, 60)[:9], .95, 8))
    # নতুন শুক্রাণু: ধাপ ১ (corona-র ফাঁক দিয়ে), ধাপ ২ (zona-র মাঝপথে, acrosome reaction)
    d1 = unit([-.25, .7, .67]); sperm_full(st, d1 * (E.ZO + 13), -d1, 2, 'intact')
    d2 = unit([-.62, -.48, .62]); sperm_full(st, d2 * (E.ZO - 6), -d2, 3, 'react')
    E.add(st, 'track', 'track', E.tube([d2 * (E.ZO + 2), d2 * (E.ZO - 4)], 1.7, 8))
    E.lm(st, 'f_ph1', d1 * (E.ZO + 13) + [0, 0, 3], [0, .3, 1])
    E.lm(st, 'f_ph2', d2 * (E.ZO - 3), d2)
    E.lm(st, 'f_acro', np.array([1, -.4, .2]) / np.linalg.norm([1, -.4, .2]) * (E.ZO + 3) + [0, 0, 3], [.3, 0, 1])
    E.lm(st, 'f_mid', d1 * (E.ZO + 20), [0, .3, 1])
    E.lm(st, 'f_mv', unit([-.55, -.1, .83]) * 57, [-.55, -.1, .83])
    E.lm(st, 'f_cg', unit([-.2, -.75, .63]) * 53, [-.2, -.75, .63])
    E.lm(st, 'f_spindle', sc + [0, 0, 4], [0, .2, 1])
    E.lm(st, 'f_tzp', unit([-.75, .15, .64]) * 67, [-.75, .15, .64])
    E.lm(st, 'f_cum', unit([-.6, -.6, .55]) * (ZO2 + 15), [-.6, -.6, .55])
    E.lm(st, 'f_mito', np.array([-18, -14, 30.]), [0, 0, 1])


ZO2 = 97.0   # corona-র বাইরের সীমা প্রায়


# ================================================================ ধাপ ১: zygote (Fig. 3.6B,C)
def d1():
    st = 1
    O = np.zeros(3)
    addm(st, 'mv', 'mv', microvilli(O, E.OOC, 850, 13, h=2.2, skip=lambda d: d @ unit([0, 57.5, 5]) > .97))
    addm(st, 'mito', 'mito', mitos(O, 47, 130, 15, avoid=[([-11, 0, 4], 13), ([11, 2, 4], 12)]))
    # nucleolus precursor bodies: দুই pronucleus-এর ছোঁয়ার দিকে সারি বাঁধে
    npb = []
    for c, sx in (([-11, 0, 4], 1), ([11, 2, 4], -1)):
        for j, (y, z) in enumerate([(-5, 1), (0, -3), (4.5, 2), (1, 5), (-3, -5)]):
            npb.append(E.blob(np.array(c) + [sx * 5.5, y * .9, z * .9], 1.9 + .3 * (j % 2), 1))
    addm(st, 'npb', 'npb', npb)
    # sperm aster: শুক্রাণুর centrosome থেকে microtubule রশ্মি
    cs = np.array([-4, -13, 9.])
    E.add(st, 'centro', 'centro', E.blob(cs, 1.4, 1))
    rays = []
    for d in jitter_dirs(46, .2, 17):
        rays.append(seg(cs + d * 1.5, cs + d * g.uniform(14, 30), .18, 4))
    addm(st, 'aster', 'fibre', rays)
    # লেজ খুলে গিয়ে নষ্ট হচ্ছে
    E.add(st, 'sptail', 'spdeg', E.tube([[-17, -6, 10], [-24, -14, 14], [-30, -10, 22], [-38, -16, 26], [-45, -14, 24]], np.linspace(.5, .25, 20), 5))
    # zona-য় আটকে থাকা শুক্রাণু (Fig. 3.6B)
    for k, dd in enumerate([[.5, -.6, .62], [-.7, -.2, .69], [.75, .45, .48]]):
        dd = unit(dd)
        sperm_full(st, dd * (E.ZO - 5), -dd, k + 5, 'react', key='spstuck')
    # cortical granule-এর উপাদান perivitelline space-এ (zona reaction)
    cgx = [E.blob(d * g.uniform(56, 59.3), .7, 0) for d in jitter_dirs(170, .06, 19)]
    addm(st, 'cgx', 'cgx', cgx)
    E.lm(st, 'p_npb', np.array([-5.5, -1, 12]), [0, 0, 1])
    E.lm(st, 'p_aster', cs + [0, 0, 2], [0, 0, 1])
    E.lm(st, 'p_tail', np.array([-38, -16, 27.5]), [-.2, -.2, 1])
    E.lm(st, 'p_stuck', unit([-.7, -.2, .69]) * (E.ZO - 1), unit([-.7, -.2, .69]))
    E.lm(st, 'p_cgx', unit([.35, -.6, .72]) * 58, [.35, -.6, .72])
    E.lm(st, 'p_mv', unit([.2, -.35, .91]) * 56.5, [.2, -.35, .91])


# ================================================================ ধাপ ২–৫: ক্লিভেজ ও morula — নিউক্লিওলাস আর mitochondria
def d_cleave(st, seed):
    nuc = raw(st, 'nuc')
    cells = raw(st, 'blast') + raw(st, 'm_inner') + raw(st, 'm_outer')
    nl, mt = [], []
    for i, m in enumerate(nuc):
        c = centre(m); rn = np.ptp(m.vertices[:, 0]) / 2
        nl += [E.blob(c + [rn * .3, rn * .2, rn * .25], rn * .28, 1), E.blob(c - [rn * .3, rn * .15, -rn * .2], rn * .22, 1)]
    for i, m in enumerate(cells):
        c = centre(m); rc = np.ptp(m.vertices[:, 0]) / 2
        n = int(np.clip(rc * 1.6, 18, 70))
        mt += [ell(c + p, (.7, .7, 1.6), 0, g.normal(size=3)) for p in in_sphere(n, rc * .82, seed + i, avoid=[([0, 0, 0], rc * .3)])]
    addm(st, 'nucl', 'npb', nl)
    addm(st, 'mito', 'mito', mt)


# ================================================================ নতুন ধাপ ১১: compaction (Fig. 3.9B)
def d11():
    st = 11
    E.zona(st)
    dirs = np.array(E.CLV[4], float); dirs /= np.linalg.norm(dirs, axis=1)[:, None]
    C = dirs * E.OOC * .5 + g.normal(scale=1.2, size=(8, 3))
    cells = comp_cells(C, 44, E.OOC * .96, gap=.9)
    for i, m in enumerate(cells):
        E.add(st, 'kblast', 'cell', m)
    nl, mt, mv = [], [], []
    for i, c in enumerate(C):
        E.add(st, 'nuc', 'nuc', E.blob(c * .92, 6.2, 2, .03, 900 + i))
        nl += [E.blob(c * .92 + [1.5, 1, 1], 1.7, 1), E.blob(c * .92 - [1.6, 1, -.8], 1.3, 1)]
        mt += [ell(c * .9 + p, (.7, .7, 1.6), 0, g.normal(size=3)) for p in in_sphere(40, 17, 700 + i, avoid=[([0, 0, 0], 8)])]
    addm(st, 'nucl', 'npb', nl)
    addm(st, 'mito', 'mito', mt)
    # polarization: বাইরের (apical) মুখে microvilli, ভেতরের মুখ মসৃণ
    for i, m in enumerate(cells):
        V = np.asarray(m.vertices); N = np.asarray(m.vertex_normals)
        out = np.where((np.linalg.norm(V, axis=1) > E.OOC * .96 - 1.2) & (np.sum(V * N, 1) / np.linalg.norm(V, axis=1) > .8))[0]
        for j in np.random.default_rng(i).choice(out, min(70, len(out)), replace=False):
            mv.append(cone(V[j] - N[j] * .4, V[j] + N[j] * 2.2, .4))
    addm(st, 'mv', 'mv', mv)
    E.polar(st, [([0, 58, 12], 8.5), ([10, 54, -24], 7.5)])
    # tight junction: দুই কোষের সীমানা যেখানে বাইরের পৃষ্ঠে পৌঁছায়
    a, b = C[np.argsort(C @ [0, -.3, 1])[-2:]]
    tj = unit((a + b) / 2) * E.OOC * .955
    E.lm(st, 'k8_tj', tj, unit(tj))
    top = C[np.argmax(C @ unit([.3, .2, 1]))]
    E.lm(st, 'k8_cell', unit(top) * E.OOC * .97, unit(top))
    E.lm(st, 'k8_flat', (a + b) / 2, [0, 0, 1])
    E.lm(st, 'k8_mv', unit(C[np.argmax(C @ unit([-1, .3, .6]))]) * (E.OOC * .96 + 1), unit(C[np.argmax(C @ unit([-1, .3, .6]))]))
    E.lm(st, 'k8_zona', *E.surf_pt([0, 0, 0], E.ZO, [-.6, .55, .55]))
    E.lm(st, 'k8_pb', np.array([0, 66.5, 12]), [0, 1, .3])


# ================================================================ ধাপ ৫ (বদলি): compaction-হওয়া ১৬-কোষ morula, ভেতরের ৪টা কোষ সত্যিই ভেতরে
def d5_morula():
    st = 5
    E.MESHES[:] = [m for m in E.MESHES if m['stage'] != st]
    E.RAW[:] = [x for x in E.RAW if x[0] != st]
    E.LM[:] = [l for l in E.LM if l['stage'] != st]
    E.zona(st)
    tet = np.array([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1.]]) / np.sqrt(3)
    inner = tet * 9.5
    outer = jitter_dirs(12, .04, 55) * 37
    C = np.vstack([inner, outer])
    cells = comp_cells(C, 46, E.OOC * .96, gap=.9, sub=4)
    nl, mt = [], []
    for i, (c, m) in enumerate(zip(C, cells)):
        isin = i < 4
        E.add(st, 'm_inner' if isin else 'm_outer', 'icm' if isin else 'troph0', m)
        cc = np.asarray(m.vertices).mean(0)
        E.add(st, 'nuc', 'nuc', E.blob(cc, 4.6, 2, .03, 960 + i))
        nl.append(E.blob(cc + [1.2, .8, .8], 1.3, 1))
        mt += [ell(cc + p, (.7, .7, 1.6), 0, g.normal(size=3)) for p in in_sphere(14, 10, 760 + i, avoid=[([0, 0, 0], 6)])]
    addm(st, 'nucl', 'npb', nl); addm(st, 'mito', 'mito', mt)
    rmax = max(np.linalg.norm(np.asarray(m.vertices), axis=1).max() for m in cells[:4])
    print('morula: ভেতরের কোষের সবচেয়ে দূরের বিন্দু', round(rmax, 1), '/ সীমা', round(E.OOC * .96, 1))
    o = np.argmax(C[4:] @ np.array([0, 0, 1.])) + 4
    E.lm(st, 'mo_outer', unit(C[o]) * E.OOC * .96, unit(C[o]))
    E.lm(st, 'mo_inner', C[0] + [0, 0, 3], [0, 0, 1])
    E.lm(st, 'mo_zona', *E.surf_pt([0, 0, 0], E.ZO, [-.6, .5, .6]))
    E.lm(st, 'mo_gj', (C[0] + C[1]) / 2, [0, 0, 1])


# ================================================================ ধাপ ৬, ৭: blastocyst — trophoblast কোষ, ICM নিউক্লিয়াস
def d_blast(st, c, Ro, Ri, n, seed):
    lines, nucs = troph_cells(c, Ro, Ri, n, seed)
    addm(st, 'tline', 'tline', lines)
    addm(st, 'tnuc', 'tnuc', nucs)
    nn = [E.blob(centre(m), 3.4, 1, .05, seed + i) for i, m in enumerate(raw(st, 'icm'))]
    addm(st, 'inuc', 'nuc', nn)


# ================================================================ নতুন ধাপ ১৩: দেরির blastocyst (দিন ৫.৫–৬), epiblast/hypoblast/AVE (Fig. 3.11B)
def d13():
    st = 13
    c = np.zeros(3); Ro, Ri = 74, 66; d = np.array([0, 1, 0.])
    E.add(st, 'troph', 'troph', E.shell(c, Ro, Ri, sub=4, amp=.02, seed=131))
    E.add(st, 'cavity', 'cavity', E.blob(c, Ri - 4, 3))
    lines, nucs = troph_cells(c, Ro, Ri, 90, 133)
    addm(st, 'tline', 'tline', lines); addm(st, 'tnuc', 'tnuc', nucs)
    # epiblast: polar trophoblast-এর নিচে লম্বা কোষের থালা
    epi, hyp, ave, en = [], [], [], []
    for x in np.arange(-30, 31, 6.2):
        for z in np.arange(-30, 31, 6.2):
            rr = np.hypot(x, z)
            if rr > 31:
                continue
            y = np.sqrt(max(Ri ** 2 - rr ** 2, 0)) - 8.5
            epi.append(E.blob([x, y, z], 1, 1, .04, int(abs(x * 7 + z) + 1000), scale=(3, 7.5, 3)))
            en.append(E.blob([x, y + 1.5, z], 1.6, 1))
    for x in np.arange(-33, 34, 7):
        for z in np.arange(-33, 34, 7):
            rr = np.hypot(x, z)
            if rr > 34:
                continue
            y = np.sqrt(max(Ri ** 2 - rr ** 2, 0)) - 20
            (ave if x > 15 else hyp).append(E.blob([x, y + (1.5 if x > 15 else 0), z], 1, 1, .05, int(abs(x * 3 + z) + 2000), scale=(3.6, 2.6 if x <= 15 else 4, 3.6)))
    addm(st, 'epiblast', 'epiblast', epi); addm(st, 'enuc', 'nuc', en)
    addm(st, 'hypoblast', 'hypoblast', hyp); addm(st, 'ave', 'ave', ave)
    E.lm(st, 'l_epi', np.array([0, Ri - 8.5, 31]), [0, .2, 1])
    E.lm(st, 'l_hypo', np.array([-6, Ri - 22, 33]), [0, -.2, 1])
    E.lm(st, 'l_ave', np.array([27, Ri - 19, 0]), [1, -.3, 0])
    E.lm(st, 'l_polar', np.array([0, Ro, 0]) + [0, 0, 0], [0, 1, .2])
    E.lm(st, 'l_mural', unit([0, -.7, .7]) * Ro, [0, -.7, .7])
    E.lm(st, 'l_cav', np.array([0, -15, 0]), [0, 0, 1])
    E.lm(st, 'l_cranial', np.array([40, Ri - 15, 0]), [1, 0, 0])


# ================================================================ ধাপ ৮: implantation (Fig. 3.10C, 3.13)
def d8():
    st = 8
    top = -70.0; W, Dp = 520, 340
    c = np.array([0, top + 58, 0]); Ro, Ri = 72, 64
    sy_c = c + [0, -(Ro + 10), 0]; sy_r = np.array([38 * 1.35, 38 * .7, 38 * 1.25])
    in_syn = lambda p, s=1.0: np.sum(((np.asarray(p) - sy_c) / (sy_r * s)) ** 2) < 1
    mouths = []
    for m in raw(st, 'gland'):
        V = np.asarray(m.vertices); mouths.append(V[V[:, 1] > top - 3].mean(0))
    # নতুন পেঁচানো গ্রন্থি (secretory phase), lumen সহ
    newg = [(-235, -60), (-140, 110), (-40, -140), (60, 135), (175, -120), (240, 40), (-70, 150)]
    gl, lum, ring = [], [], []
    for i, (x, z) in enumerate(newg):
        P = helix([x, top - 4, z], [0, -1, 0], 160, 6.5 + i % 2, 5.5 + i % 3)
        P[0] = [x, top + 1, z]
        gl.append(tube2(P, np.r_[np.full(len(P) - 6, 6.5), np.linspace(6.5, 5, 6)], 12))
        lum.append(tube2(P, 2.3, 7))
        mouths.append(np.array([x, top, z]))
    addm(st, 'cgland', 'gland', gl); addm(st, 'glum', 'glum', lum)
    for mo in mouths:
        t = trimesh.creation.torus(major_radius=7.5, minor_radius=1.6, major_sections=18, minor_sections=6)
        t.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
        t.apply_translation([mo[0], top + .4, mo[2]])
        ring.append(t)
    addm(st, 'gmouth', 'glum', ring)
    # epithelium: প্রতিটা columnar কোষের উপরের গম্বুজ আর ভেতরের নিউক্লিয়াস
    hemi = trimesh.creation.icosphere(subdivisions=1)
    keep = hemi.vertices[hemi.faces].mean(1)[:, 1] > -.05
    hm = trimesh.Trimesh(hemi.vertices, hemi.faces[keep], process=False); hm.remove_unreferenced_vertices()
    hv, hf = hm.vertices, hm.faces
    domes, enuc = [], []
    sp = 10.5
    for j, z in enumerate(np.arange(-Dp / 2 + 5, Dp / 2 - 4, sp * .866)):
        for x in np.arange(-W / 2 + 5 + (j % 2) * sp / 2, W / 2 - 4, sp):
            p = np.array([x, top, z])
            if np.sum((np.array([x, z]) / [sy_r[0] * 1.08, sy_r[2] * 1.08]) ** 2) < 1:
                continue
            if any(np.hypot(x - mo[0], z - mo[2]) < 10 for mo in mouths):
                continue
            domes.append(trimesh.Trimesh(hv * [5.1, 2.3, 5.1] + p, hf, process=False))
            enuc.append(ell(p + [0, -8, 0], (1.9, 3.6, 1.9), 0))
    addm(st, 'ecell', 'epith', domes); addm(st, 'enuc', 'nuc', enuc)
    # spiral artery: গভীর থেকে উঠে পেঁচিয়ে epithelium-এর নিচে capillary-তে খোলে
    art = []
    for i, (x, z) in enumerate([(-170, 40), (-60, -90), (95, 60), (200, -40), (20, 120)]):
        P = helix([x, top - 182, z], [0, 1, 0], 135, 9, 4.5)
        art.append(tube2(P, np.linspace(4.2, 2.6, len(P)), 9))
        e = P[-1]
        for a in range(3):
            q = e + [np.cos(a * 2.1) * 30, 18 + 8 * a, np.sin(a * 2.1) * 30]
            q[1] = min(q[1], top - 14)
            art.append(tube2(curve([e, (e + q) / 2 + [0, 6, 0], q], 10), 2.2, 7))
    addm(st, 'spart', 'art', art)
    # venule/sinusoid: চওড়া অনিয়মিত শিরা
    ven = []
    for i, (z, y) in enumerate([(-100, top - 120), (70, top - 135), (140, top - 95)]):
        ven.append(E.tube([[-W / 2 + 6, y, z], [-120, y + 10, z + 15], [-20, y - 8, z - 10], [100, y + 12, z + 8], [W / 2 - 6, y, z]], np.array([5, 7, 9, 7, 5.]), 12))
    addm(st, 'venule', 'ven', ven)
    # stromal (decidual) কোষ
    sc = []
    r = np.random.default_rng(81)
    while len(sc) < 520:
        p = np.array([r.uniform(-W / 2 + 6, W / 2 - 6), r.uniform(top - 250, top - 18), r.uniform(-Dp / 2 + 6, Dp / 2 - 6)])
        if in_syn(p, 1.05):
            continue
        sc.append(ell(p, (2.6, 1.8, 2.2), 0, r.normal(size=3)))
    addm(st, 'snuc', 'snuc', sc)
    # syncytiotrophoblast-এর ভেতরে অনেক নিউক্লিয়াস (কোষের সীমানা নেই)
    sn, r = [], np.random.default_rng(83)
    while len(sn) < 80:
        p = sy_c + r.uniform(-1, 1, 3) * sy_r
        if in_syn(p, .82):
            sn.append(ell(p, (2.4, 1.9, 2.4), 0, r.normal(size=3)))
    addm(st, 'synuc', 'synuc', sn)
    # cytotrophoblast-এর কোষ (সীমানা, নিউক্লিয়াস); নিচে syncytium-এ ঢাকা অংশ বাদ
    lines, nucs = troph_cells(c, Ro, Ri, 80, 85, skip=lambda dd: dd[1] < -.55)
    addm(st, 'tline', 'tline', lines); addm(st, 'tnuc', 'tnuc', nucs)
    # AVE: hypoblast-এর এক প্রান্তে (ভবিষ্যৎ cranial দিক)
    ave = [E.blob(c + [x, -(Ri - 17) + 4.8, z], 1, 1, .05, int(abs(x + z) + 3000), scale=(3.5, 3.6, 3.5)) for x in (18, 24) for z in (-9, -3, 3, 9)]
    addm(st, 'ave', 'ave', ave)
    E.lm(st, 'i_ecell', np.array([-150, top + 2.3, 110]), [0, 1, .2])
    E.lm(st, 'i_cgland', np.array([-235, top - 60, -60 + 12]), [0, 0, 1])
    E.lm(st, 'i_mouth', np.array([60, top + 1, 135]), [0, 1, .3])
    E.lm(st, 'i_spart', np.array([95 + 12, top - 110, 60]), [1, 0, .4])
    E.lm(st, 'i_venule', np.array([-200, top - 120, -100 + 9]), [0, 0, 1])
    E.lm(st, 'i_snuc', np.array([150, top - 200, Dp / 2]), [0, 0, 1])
    E.lm(st, 'i_synuc', sy_c + [20, -5, 30], [0, 0, 1])
    E.lm(st, 'i_tline', c + unit([.5, .5, .7]) * (Ro + .5), unit([.5, .5, .7]))
    E.lm(st, 'i_ave', c + [21, -(Ri - 17) + 8.5, 0], [.3, 1, .2])


# ================================================================ ধাপ ৯: যাত্রাপথ — প্রতিটা দিনের ছোট ভ্রূণ, ডিম্বাশয়ের ভেতরে follicle
def mini(kind, p, s=1.0):
    p = np.asarray(p, float); out = []   # (group, mesh)
    Z = lambda: ('zona', E.shell(p, 5.6 * s, 4.7 * s, sub=2))
    if kind in ('ooc', 'zyg', 2, 4, 'mor'):
        out.append(Z())
    if kind == 'ooc':
        out.append(('cell', E.blob(p, 4.3 * s, 2)))
        for d in jitter_dirs(26, .1, 3):
            out.append(('corona', E.blob(p + d * 6.6 * s, .9 * s, 0)))
    if kind == 'zyg':
        out += [('cell', E.blob(p, 4.3 * s, 2)), ('pnM', E.blob(p + [-1, 0, 1.2], 1.1 * s, 1)), ('pnF', E.blob(p + [1, 0, 1.2], 1. * s, 1))]
    if kind in (2, 4):
        dirs = np.array(E.CLV[2 if kind == 2 else 3], float); dirs /= np.linalg.norm(dirs, axis=1)[:, None]
        r = 4.3 * s / kind ** (1 / 3)
        for d in dirs:
            out.append(('cell', E.blob(p + d * r * (.93 if kind == 2 else 1.05), r, 2)))
    if kind == 'mor':
        for q in E.pack_spheres(16, 4.4 * s, 1.55 * s, seed=4, iters=300):
            out.append(('troph0', E.blob(p + q, 1.55 * s, 1)))
    if kind in ('bl', 'imp'):
        out += [('troph', E.shell(p, 6.5 * s, 5.6 * s, sub=2)), ('icm', E.blob(p + [0, 3.4 * s, 0], 2.6 * s, 1, 0, 0, scale=(1.2, .6, 1.2)))]
    return out


def d9():
    st = 9
    S = 1.5   # Langman Fig. 3.12-এর মতো ভ্রূণগুলো বড় করে আঁকা
    for kind, key, p in [('ooc', 'mini_ooc', [287, -45, 33]), ('zyg', 'mini_zyg', [270, 42, 22]), (2, 'mini_2c', [228, 66, 14]),
                         (4, 'mini_4c', [180, 71, 6]), ('mor', 'mini_mor', [120, 66, 2]), ('bl', 'mini_bl', [30, 20, 10]), ('imp', 'mini_imp', [-20, 45, 14])]:
        for gr, m in mini(kind, p, S):
            E.add(st, key, gr, m)
    # ডিম্বাশয়: primordial, primary, secondary (antrum), পরিণত follicle, corpus luteum, corpus albicans
    oc = np.array([255, -60, 10.]); orad = np.array([44, 27, 24.])
    r = np.random.default_rng(91)
    pf, prim = [], []
    for d in jitter_dirs(46, .25, 92):
        pf.append(E.blob(oc + d * orad * .86, 1.6, 1))
    for d in jitter_dirs(7, .3, 93):
        prim.append(E.blob(oc + d * orad * .72, 3.2, 1))
    addm(st, 'ov_prim', 'follicle', pf + prim)
    for k, d in enumerate([[-.6, .4, .6], [.1, -.5, -.8]]):
        q = oc + unit(d) * orad * .62
        E.add(st, 'ov_sec', 'follicle', E.shell(q, 7, 5.2, sub=2))
        E.add(st, 'ov_sec', 'antrum', E.blob(q, 5.2, 2))
        E.add(st, 'ov_sec', 'cell', E.blob(q + unit(d) * -3.2, 1.6, 1))
    E.add(st, 'cl', 'luteal', E.blob(oc + [-30, -8, 16], 11, 3, .12, 95))
    E.add(st, 'calb', 'calb', E.blob(oc + [-18, -12, -18], 6, 2, .15, 96))
    # জরায়ুর endometrium স্তর (secretory/progestational)
    E.add(st, 'endo', 'endo', E.blob([0, -10, 0], 68, 3, .02, 97, scale=(1.0, 1.2, .42)))
    E.lm(st, 'j_cl', oc + [-30, -8, 27], [0, 0, 1])
    E.lm(st, 'j_endo', np.array([-55, -40, 26]), [0, 0, 1])
    E.lm(st, 'j_prim', oc + unit([.3, .5, .8]) * orad * .9, [0, .3, 1])


# ================================================================ নতুন ধাপ ১০, ১২, ১৪: follicle, ovulation, corpus luteum (Fig. 3.2C, 3.3)
FC = np.array([0, 40, 0.]); RF = 300.0; SURF = 250.0


def ovary_stroma(st, hole_r=RF, collapsed=False):
    """ডিম্বাশয়ের একটা অংশ: ডিম্বাকার stroma, উপরের পৃষ্ঠে follicle ফুলে আছে (boolean দিয়ে follicle-এর জায়গা ফাঁকা)"""
    R3 = np.array([500, 330, 420.]); oc = np.array([0, SURF - R3[1], 0])
    ov = E.blob(oc, 1, 4, .015, 7, scale=R3)
    cut = trimesh.creation.icosphere(subdivisions=4, radius=hole_r + .5); cut.apply_translation(FC)
    E.add(st, 'ostroma', 'ostroma', ov.difference(cut))
    skin = E.shell(oc, 1, .985, sub=4, amp=.015, seed=7, scale=R3)
    cut2 = trimesh.creation.icosphere(subdivisions=4, radius=hole_r + 7.5); cut2.apply_translation(FC)
    E.add(st, 'osurf', 'osurf', skin.difference(cut2))
    vs = []
    for i, (z, y) in enumerate([(-200, -180), (180, -150), (-120, 60), (150, 20)]):
        vs.append(('art' if i % 2 == 0 else 'ven', E.tube([[-430, y, z], [-250, y + 30, z + 20], [-120, y - 15, z - 10], [150, y + 20, z], [430, y, z + 15]], 5.5 - i % 2, 10)))
    for gr, m in vs:
        E.add(st, 'ovessel', gr, m)


def theca(st, hole=None, amp=.02, scale=(1, 1, 1)):
    up = np.array([0, 1, 0.])
    E.add(st, 'thex', 'thex', E.shell(FC, RF, RF - 15, sub=4, hole=hole, amp=amp, seed=st + 1, scale=scale))
    E.add(st, 'thin', 'thin', E.shell(FC, RF - 15, RF - 33, sub=4, hole=hole, amp=amp, seed=st + 1, scale=scale))
    # theca interna-র capillary জাল (apex/stigma-য় নেই)
    P = jitter_dirs(120, .1, st + 7)
    sv = SphericalVoronoi(P, 1.0); sv.sort_vertices_of_regions()
    edges = {(min(a, b), max(a, b)) for reg in sv.regions for a, b in zip(reg, reg[1:] + reg[:1])}
    cap = []
    for a, b in edges:
        va, vb = sv.vertices[a], sv.vertices[b]
        if va @ up > .9 or vb @ up > .9:
            continue
        if hole is not None and (va @ unit(hole[0]) > np.cos(np.radians(hole[1] + 4)) or vb @ unit(hole[0]) > np.cos(np.radians(hole[1] + 4))):
            continue
        cap.append(seg(FC + va * (RF - 15.5) * scale, FC + vb * (RF - 15.5) * scale, 1.8, 5))
    addm(st, 'tcap', 'art', cap)
    # theca externa-র বড় নালী (মেরিডিয়ান বরাবর)
    big = []
    for i, a in enumerate(np.linspace(0, 2 * np.pi, 8, endpoint=False)):
        pts = [FC + np.array([np.cos(a) * np.sin(t), np.cos(t), np.sin(a) * np.sin(t)]) * (RF - 7) * scale for t in np.radians(np.linspace(32, 150, 7))]
        big.append(('art' if i % 2 == 0 else 'ven', E.tube(pts, 3.4, 8)))
    for gr, m in big:
        E.add(st, 'tvessel', gr, m)


def oocyte_complex(st, p, corona_n=70, cum_n=0, cum_r=(88, 115), seed=0):
    p = np.asarray(p, float)
    E.add(st, 'zona', 'zona', E.shell(p, E.ZO, E.ZI, sub=4, amp=.015, seed=st))
    E.add(st, 'oocyte', 'cell', E.blob(p, E.OOC, 4, .01, st))
    E.add(st, 'pb', 'pb', E.blob(p + [0, 57.5, 6], 9.5, 2, .05, 50))
    E.add(st, 'spindle', 'spindle', E.blob(p + [0, 48, 4], 6, 2, 0, 0, scale=(1.6, .6, .6)))
    cor = []
    for i, d in enumerate(jitter_dirs(corona_n, .08, seed)):
        cor.append(E.blob(p + d * (E.ZO + 8 + g.uniform(0, 4)), 1, 1, .1, 100 + i, scale=(6.5, 6.5, 9.5), rot=rot_to(d)))
    addm(st, 'corona', 'corona', cor)
    cum = []
    for i, d in enumerate(jitter_dirs(cum_n, .3, seed + 1) if cum_n else []):
        cum.append(E.blob(p + d * g.uniform(*cum_r), 6.4, 1, .12, 500 + i))
    if cum:
        addm(st, 'cumc', 'cumulus', cum)
    addm(st, 'mito', 'mito', mitos(p, 46, 120, seed + 3, avoid=[([0, 48, 4], 12)]))


def granulosa_nuclei(st, r0, r1, n, seed, hole=None, scale=(1, 1, 1)):
    r = np.random.default_rng(seed); out = []
    while len(out) < n:
        d = unit(r.normal(size=3))
        if hole is not None and d @ unit(hole[0]) > np.cos(np.radians(hole[1] + 2)):
            continue
        out.append(ell(FC + d * r.uniform(r0 + 2, r1 - 2) * scale, (2, 2, 2.6), 0, r.normal(size=3)))
    addm(st, 'gnuc', 'nuc', out)


def d10():
    st = 10
    ovary_stroma(st)
    theca(st)
    E.add(st, 'gran', 'gran', E.shell(FC, RF - 33, RF - 64, sub=4, amp=.025, seed=101))
    granulosa_nuclei(st, RF - 64, RF - 33, 1300, 102)
    E.add(st, 'antrum', 'antrum', E.blob(FC, RF - 66, 4))
    # cumulus oophorus: পাশ থেকে antrum-এ ঢুকে থাকা ঢিবি, ভেতরে oocyte
    dc = unit([-1, -.3, .25])
    E.add(st, 'cumulus', 'cumulus', E.blob(FC + dc * 190, 112, 4, .04, 103, scale=(1, 1, 1)))
    cn = [ell(FC + dc * 190 + p, (2, 2, 2.4), 0, g.normal(size=3)) for p in in_sphere(380, 108, 104, avoid=[(dc * -15, 96)])]
    addm(st, 'cnucm', 'nuc', cn)
    oocyte_complex(st, FC + dc * 175, 70, 0, seed=105)
    # stigma: apex-এ রক্তনালীহীন ফ্যাকাশে জায়গা
    up = np.array([0, 1, 0.])
    u = trimesh.creation.icosphere(subdivisions=4)
    keep = (u.vertices[u.faces].mean(1) @ up) > np.cos(np.radians(13))
    E.add(st, 'stigma', 'stigma', trimesh.Trimesh(u.vertices * (RF + 1.2) + FC, u.faces[keep], process=True))
    q = FC + dc * 175
    E.lm(st, 'fo_stigma', FC + up * (RF + 1.5), [0, 1, .2])
    E.lm(st, 'fo_thex', FC + unit([.5, .45, .74]) * RF, [.5, .45, .74])
    E.lm(st, 'fo_thin', FC + unit([.62, .1, .78]) * (RF - 24), [0, 0, 1])
    E.lm(st, 'fo_gran', FC + unit([.55, -.2, .81]) * (RF - 48), [0, 0, 1])
    E.lm(st, 'fo_antrum', FC + [80, 30, 0], [0, 0, 1])
    E.lm(st, 'fo_cum', FC + dc * 190 + [0, -60, 70], [0, -.4, 1])
    E.lm(st, 'fo_oocyte', q + [0, 0, E.OOC], [0, 0, 1])
    E.lm(st, 'fo_zona', q + unit([.2, -.4, .9]) * E.ZO, [.2, -.4, .9])
    E.lm(st, 'fo_corona', q + unit([.3, .6, .75]) * (E.ZO + 10), [.3, .6, .75])
    E.lm(st, 'fo_pb', q + [0, 67, 6], [0, 1, .2])
    E.lm(st, 'fo_stroma', np.array([-330, 0, 350]), [0, 0, 1])
    E.lm(st, 'fo_surf', np.array([300, SURF + 7, 200]), [0, 1, .3])
    E.lm(st, 'fo_vessel', FC + unit([np.cos(0) * np.sin(np.radians(70)), np.cos(np.radians(70)), 0]) * (RF + 2), [1, .3, 0])
    E.lm(st, 'fo_cap', FC + unit([.2, .2, .96]) * (RF - 15) , [0, 0, 1])


def d12():
    st = 12
    up = np.array([0, 1, 0.])
    hole = (up, 20)
    ovary_stroma(st)
    sc = (1, .93, 1)
    theca(st, hole=hole, amp=.05, scale=sc)
    E.add(st, 'gran', 'gran', E.shell(FC, RF - 33, RF - 66, sub=4, hole=hole, amp=.06, seed=121, scale=sc))
    granulosa_nuclei(st, RF - 66, RF - 33, 900, 122, hole=hole, scale=sc)
    E.add(st, 'clot', 'clot', E.blob(FC + [0, 120, 0], 95, 3, .2, 123, scale=(1.3, .7, 1.2)))
    E.add(st, 'antrum', 'antrum', E.blob(FC, RF - 70, 3, 0, 0, scale=(1, .9, 1)))
    # বেরিয়ে আসা তরলের ধারা আর cumulus মেঘে ঘেরা oocyte
    E.add(st, 'fluid', 'antrum', E.blob(FC + up * (RF + 40), 70, 3, .1, 124, scale=(.8, 1.3, .8)))
    p = np.array([60, 470, 40.])
    oocyte_complex(st, p, 60, 150, (90, 125), seed=125)
    # fimbriae ঝাড়ু দিচ্ছে
    fb = []
    for k in range(8):
        a = -1.1 + k * .28
        b0 = np.array([-330 + 30 * np.sin(a), 600, 40 * np.cos(a * 3)])
        fb.append(E.tube([b0, b0 + [70, -60 + 15 * np.sin(k), 30 * np.sin(a)], b0 + [150 + 20 * k % 3, -120 - 10 * (k % 2), 50 * np.sin(a)]], np.linspace(12, 6, 10), 10))
    addm(st, 'fimb', 'tube', fb)
    E.lm(st, 'ov_rupt', FC + unit([.25, 1, .3]) * (RF * .93 + 3), [0, 1, .3])
    E.lm(st, 'ov_ooc', p + [0, 0, E.OOC], [0, 0, 1])
    E.lm(st, 'ov_cum', p + unit([-.5, -.4, .77]) * 110, [-.5, -.4, .77])
    E.lm(st, 'ov_clot', FC + [0, 120, 114], [0, 0, 1])
    E.lm(st, 'ov_fimb', np.array([-210, 520, 30]), [0, 0, 1])
    E.lm(st, 'ov_gran', FC + unit([.6, -.2, .77]) * (RF - 50) * .95, [0, 0, 1])
    E.lm(st, 'ov_fluid', FC + up * (RF + 40) + [0, 0, 56], [0, 0, 1])


def d14():
    st = 14
    ovary_stroma(st)
    E.add(st, 'thex', 'thex', E.shell(FC, RF, RF - 14, sub=4, amp=.03, seed=141))
    E.add(st, 'luteal', 'luteal', E.shell(FC, RF - 14, RF - 105, sub=4, amp=.09, seed=142))
    E.add(st, 'fibrin', 'fibrin', E.blob(FC, RF - 108, 4, .1, 143))
    ln = []
    r = np.random.default_rng(144)
    while len(ln) < 1400:
        d = unit(r.normal(size=3))
        ln.append(ell(FC + d * r.uniform(RF - 98, RF - 22), (3.2, 3.2, 3.2), 0))
    addm(st, 'lnuc', 'nuc', ln)
    vs = []
    for d in jitter_dirs(46, .2, 145):
        pts = [FC + d * RF, FC + (d + r.normal(scale=.03, size=3)) * (RF - 50), FC + (d + r.normal(scale=.05, size=3)) * (RF - 100)]
        vs.append(E.tube(pts, np.linspace(2.6, 1.4, 10), 6))
    addm(st, 'lcap', 'art', vs)
    E.lm(st, 'cl_luteal', FC + unit([.4, .3, .87]) * (RF - 60), [0, 0, 1])
    E.lm(st, 'cl_theca', FC + unit([.6, .55, .58]) * RF, [.6, .55, .58])
    E.lm(st, 'cl_fibrin', FC + [0, 0, 120], [0, 0, 1])
    E.lm(st, 'cl_vessel', FC + unit([-.5, .4, .77]) * (RF - 2), [-.5, .4, .77])
    E.lm(st, 'cl_stroma', np.array([-330, 0, 350]), [0, 0, 1])


# ================================================================ প্রতিটা গঠনে একটা বিন্দু (যেগুলোর আগে থেকে বিন্দু নেই)
VIEWDIR = {10: [.25, .4, 1], 12: [.2, .3, 1], 14: [.25, .4, 1], 0: [.35, .3, 1], 1: [.2, .2, 1], 2: [.2, .3, 1], 3: [.3, .35, 1], 4: [.3, .35, 1],
           11: [.3, .35, 1], 5: [.3, .3, 1], 6: [.3, .25, 1], 7: [.7, .2, .7], 13: [.35, .2, 1], 8: [.45, .35, 1], 9: [0, .1, 1]}
SURF_G = {'zona', 'troph', 'epith', 'stroma', 'ostroma', 'osurf', 'thex', 'thin', 'gran', 'uterus', 'endo', 'luteal', 'tline', 'stigma'}
OPEN_G = {'cavity', 'antrum', 'glum'}


def auto_markers():
    """যে গঠনের কোনো বিন্দু নেই তার সামনের দিকের (ক্যামেরামুখী) মাঝামাঝি পৃষ্ঠে একটা বিন্দু। নাম content.js-এর STR থেকে।"""
    from scipy.spatial import cKDTree
    stages = sorted({s for s, *_ in E.RAW})
    added = 0
    for st in stages:
        bykey = {}
        for s, k, gr, m in E.RAW:
            if s == st:
                bykey.setdefault(k, [gr, []])[1].append(m)
        V = {k: np.vstack([np.asarray(m.vertices) for m in ms]) for k, (gr, ms) in bykey.items()}
        trees = {k: cKDTree(v) for k, v in V.items()}
        covered = set()
        for l in E.LM:
            if l['stage'] != st:
                continue
            p = np.array(l['p'])
            dk = min(trees, key=lambda k: trees[k].query(p)[0])
            covered.add(dk)
        d = unit(VIEWDIR.get(st, [0, 0, 1]))
        for k, (gr, ms) in bykey.items():
            if k in covered:
                continue
            m = trimesh.util.concatenate(ms) if len(ms) > 1 else ms[0]
            v = np.asarray(m.vertices); n = np.asarray(m.vertex_normals)
            c = v.mean(0); rel = v - c
            along = rel @ d; perp = np.linalg.norm(rel - np.outer(along, d), axis=1)
            ext = max(np.ptp(v, 0).max(), 1e-3)
            score = along / ext - .7 * perp / ext + .3 * (n @ d)
            i = int(np.argmax(score))
            ty = 'surf' if gr in SURF_G else 'open' if gr in OPEN_G else 'part'
            E.lm(st, f'a~{ty}~{k}~{st}', v[i].copy(), n[i].copy() if np.linalg.norm(n[i]) > 0 else d)
            added += 1
    print('স্বয়ংক্রিয় বিন্দু:', added)


# ================================================================ চালানো
def run(mod):
    global E
    E = mod
    d0(); d1()
    d_cleave(2, 1200); d_cleave(3, 1300); d_cleave(4, 1400)
    d5_morula()
    d11()
    d_blast(6, [0, 0, 0], 69, 62, 70, 61)
    hd = unit([1, -.25, .3])
    d_blast(7, hd * 38, 70, 63, 72, 71)
    d13(); d8(); d9(); d10(); d12(); d14()
    auto_markers()
    remap = {old: i for i, old in enumerate(ORDER)}
    for m in E.MESHES:
        m['stage'] = remap[m['stage']]
    for l in E.LM:
        l['stage'] = remap[l['stage']]
    # প্রতিটা ধাপ আলাদা ফাইলে (data/stage-<k>.js); ভিউয়ার ধাপ খুললে তবেই লোড করে। core.js-এ শুধু ল্যান্ডমার্ক।
    import os, glob, json
    for f in glob.glob(os.path.join(E.OUT, 'stage-*.js')):
        os.remove(f)
    for k in range(len(ORDER)):
        ms = [m for m in E.MESHES if m['stage'] == k]
        with open(os.path.join(E.OUT, f'stage-{k}.js'), 'w') as fh:
            fh.write('window.STAGEDATA=window.STAGEDATA||{};window.STAGEDATA[%d]=' % k + json.dumps(dict(meshes=ms), separators=(',', ':')) + ';')
        print(f'stage-{k}.js', round(os.path.getsize(os.path.join(E.OUT, f'stage-{k}.js')) / 1e6, 2), 'MB', len(ms), 'মেশ')
    E.MESHES[:] = []
