"""Embryology সপ্তাহ ১: নিষেক থেকে implantation পর্যন্ত স্কিম্যাটিক 3D মডেল (আমাদের নিজের, স্ক্যান নয়)।

ব্যবহার: python pipeline/embryo_w1.py   → bones/embryo-w1/data/core.js
একক: মাইক্রোমিটার (µm)। ভিউয়ারের অক্ষ: X ডানে-বাঁয়ে, Y উপরে, Z সামনে।
মাপ মানক বই (Langman, Moore) আর প্রকাশিত মাপের কাছাকাছি: oocyte প্রায় ১১০ µm, zona pellucida প্রায় ১৫ µm পুরু,
ক্লিভেজে মোট আয়তন একই থাকে (কোষ ছোট হয়), blastocyst প্রায় ১৫০–২০০ µm।
প্রতিটা মেশের `stage` = কোন ধাপে দেখা যাবে; `group` = রং (content.js-এর STYLE)।
"""
import os, sys, json, base64
import numpy as np
import trimesh
sys.path.insert(0, os.path.dirname(__file__))
from common import write_js, SCALE

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'embryo-w1', 'data')
rng = np.random.default_rng(7)
MESHES, LM = [], []
RAW = []   # (stage, key, group, trimesh): Langman ডিটেইল ধাপ এগুলো থেকে অবস্থান পড়ে


# ---------------------------------------------------------------- জ্যামিতি সাহায্যকারী
def noise_fn(seed, amp, k=4):
    r = np.random.default_rng(seed)
    dirs = r.normal(size=(k, 3)); dirs /= np.linalg.norm(dirs, axis=1)[:, None]
    ph = r.uniform(0, 6.28, k); fr = r.uniform(1.5, 3.5, k)
    return lambda u: 1 + amp * sum(np.sin(fr[i] * (u @ dirs[i]) * 3.1416 + ph[i]) for i in range(k)) / k


def blob(c, r, sub=3, amp=0.0, seed=0, scale=(1, 1, 1), rot=None):
    m = trimesh.creation.icosphere(subdivisions=sub)
    u = m.vertices.copy()
    f = noise_fn(seed, amp)(u) if amp else 1
    v = u * (np.asarray(f)[:, None] if amp else 1) * r * np.asarray(scale)
    if rot is not None:
        v = v @ rot.T
    return trimesh.Trimesh(v + np.asarray(c, float), m.faces, process=False)


def shell(c, r_out, r_in, sub=4, hole=None, amp=0.0, seed=0, scale=(1, 1, 1)):
    """পুরু খোলস (বাইরের গোলক + ভেতরের উল্টো গোলক); hole=(দিক, কোণ°) হলে ফুটো, কিনারা জোড়া"""
    m = trimesh.creation.icosphere(subdivisions=sub)
    u = m.vertices; F = m.faces
    nf = noise_fn(seed, amp)(u) if amp else np.ones(len(u))
    keep = np.ones(len(F), bool)
    if hole is not None:
        d = np.asarray(hole[0], float); d /= np.linalg.norm(d)
        keep = ~((u[F] @ d).mean(1) > np.cos(np.radians(hole[1])))
    F = F[keep]
    vo = u * (nf * r_out)[:, None] * scale
    vi = u * (nf * r_in)[:, None] * scale
    n = len(u)
    faces = [F, F[:, ::-1] + n]
    if hole is not None:  # কিনারা: খোলা কিনারার প্রান্তগুলো জোড়া
        e = trimesh.Trimesh(u, F, process=False).edges_unique
        cnt = np.zeros(len(e), int)
        ef = trimesh.Trimesh(u, F, process=False)
        bnd = trimesh.grouping.group_rows(ef.edges_sorted, require_count=1)
        for a, b in ef.edges[bnd]:
            faces.append(np.array([[a, b, b + n], [a, b + n, a + n]]))
    return trimesh.Trimesh(np.vstack([vo, vi]) + np.asarray(c, float), np.vstack(faces), process=False)


def tube(pts, r, sides=12):
    pts = np.asarray(pts, float)
    from scipy.interpolate import splprep, splev
    tck, _ = splprep(pts.T, s=0, k=min(3, len(pts) - 1))
    P = np.array(splev(np.linspace(0, 1, max(24, len(pts) * 10)), tck)).T
    T = np.gradient(P, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    up = np.array([0, 1, 0.]) if abs(T[0] @ [0, 1, 0]) < .9 else np.array([1, 0, 0.])
    N = np.cross(T[0], up); N /= np.linalg.norm(N)
    V, Fs = [], []
    rr = np.interp(np.linspace(0, 1, len(P)), np.linspace(0, 1, len(r)), r) if np.ndim(r) else np.full(len(P), r)
    for i, p in enumerate(P):
        N = N - (N @ T[i]) * T[i]; N /= np.linalg.norm(N); Bv = np.cross(T[i], N)
        for a in np.linspace(0, 2 * np.pi, sides, endpoint=False):
            V.append(p + rr[i] * (np.cos(a) * N + np.sin(a) * Bv))
    for i in range(len(P) - 1):
        for j in range(sides):
            a, b = i * sides + j, i * sides + (j + 1) % sides
            Fs += [[a, b, a + sides], [b, b + sides, a + sides]]
    V = np.array(V)
    # মুখ বন্ধ
    c0, c1 = len(V), len(V) + 1
    V = np.vstack([V, P[0], P[-1]])
    for j in range(sides):
        Fs += [[c0, (j + 1) % sides, j], [c1, (len(P) - 1) * sides + j, (len(P) - 1) * sides + (j + 1) % sides]]
    return trimesh.Trimesh(V, np.array(Fs), process=False)


def add(stage, key, group, mesh, name=None):
    v = np.asarray(mesh.vertices); f = np.asarray(mesh.faces)
    assert len(v) < 65535, (key, len(v))
    RAW.append((stage, key, group, mesh))
    q = np.round(v / SCALE).astype(np.int16)
    MESHES.append(dict(name=name or key, group=group, key=key, stage=stage, layer='organ',
                       v=base64.b64encode(q.tobytes()).decode(), f=base64.b64encode(f.astype(np.uint16).tobytes()).decode()))


def lm(stage, id_, p, n):
    n = np.asarray(n, float); n /= np.linalg.norm(n)
    LM.append(dict(id=id_, stage=stage, p=np.round(p, 2).tolist(), n=np.round(n, 3).tolist()))


def surf_pt(c, r, d):
    d = np.asarray(d, float); d /= np.linalg.norm(d)
    return np.asarray(c, float) + d * r, d


def pack_spheres(n, R, r, seed=0, iters=400, inner=None):
    """R ব্যাসার্ধের গোলকের ভেতরে n-টা r ব্যাসার্ধের কোষ ঠাসা (সাধারণ ধাক্কাধাক্কি সিমুলেশন)"""
    g = np.random.default_rng(seed)
    P = g.normal(size=(n, 3)); P /= np.linalg.norm(P, axis=1)[:, None]; P *= (R - r) * g.uniform(.3, 1, (n, 1))
    for _ in range(iters):
        D = P[:, None] - P[None]; dist = np.linalg.norm(D, axis=2) + np.eye(n) * 1e9
        push = np.clip(2 * r * 1.0 - dist, 0, None)[..., None] * D / dist[..., None]
        P += 0.25 * push.sum(1)
        L = np.linalg.norm(P, axis=1); over = L > R - r
        P[over] *= ((R - r) / L[over])[:, None]
    return P


ZO, ZI = 75.0, 60.0          # zona pellucida বাইরে/ভেতরে
OOC = 55.0                   # oocyte
VOL = OOC ** 3


def zona(stage, ro=ZO, ri=ZI, hole=None):
    add(stage, 'zona', 'zona', shell([0, 0, 0], ro, ri, sub=4, hole=hole, amp=.015, seed=stage))


def polar(stage, ids):
    for i, (c, r) in enumerate(ids):
        add(stage, 'pb', 'pb', blob(c, r, 2, .05, 50 + i))


# ================================================================ ধাপ ০: নিষেক
def s0():
    st = 0
    zona(st)
    add(st, 'oocyte', 'cell', blob([0, 0, 0], OOC, 4, .01, 1))
    polar(st, [([0, 57.5, 6], 9.5)])
    add(st, 'spindle', 'spindle', blob([0, 48, 4], 6, 2, 0, 0, scale=(1.6, .6, .6)))
    # corona radiata: zona-র বাইরে follicular কোষ
    for i, d in enumerate(rng.normal(size=(70, 3))):
        d /= np.linalg.norm(d)
        if d[0] > .55 and d[1] < .35:  # একটা দিকে ফাঁকা (sperm যেখানে ঢুকছে)
            continue
        rot = trimesh.geometry.align_vectors([0, 0, 1], d)[:3, :3]
        add(st, 'corona', 'corona', blob(d * (ZO + 8 + rng.uniform(0, 5)), 6.5, 1, .1, 100 + i, scale=(1, 1, 1.5), rot=rot))
    # শুক্রাণু: একটা zona ফুঁড়ে ঢুকছে, কয়েকটা বাইরে
    def sperm(head, d, k):
        d = np.asarray(d, float); d /= np.linalg.norm(d)
        rot = trimesh.geometry.align_vectors([0, 0, 1], d)[:3, :3]
        add(st, 'sperm', 'sperm', blob(head, 2.6, 2, 0, 0, scale=(1, .7, 1.9), rot=rot))
        side = np.cross(d, [0, 1, 0]) if abs(d[1]) < .9 else np.cross(d, [1, 0, 0])
        side /= np.linalg.norm(side)
        pts = [head - d * 4 - d * t * 9 + side * 3 * np.sin(t * 1.2 + k) for t in range(7)]
        add(st, 'sperm', 'sperm', tube(pts, np.linspace(.8, .3, 70), 6))
    d0 = np.array([.82, .1, .56]); d0 /= np.linalg.norm(d0)
    sperm(d0 * (ZI + 6), -d0, 0)
    for k, d in enumerate([[1, -.4, .2], [.7, .2, -.7], [.9, -.1, -.4]]):
        d = np.asarray(d, float); d /= np.linalg.norm(d)
        sperm(d * (ZO + 3), -d, k + 1)
    lm(st, 'f_zona', *surf_pt([0, 0, 0], ZO, [-.3, .5, .8]))
    lm(st, 'f_oocyte', *surf_pt([0, 0, 0], OOC, [-.5, -.4, .75]))
    lm(st, 'f_pb1', np.array([0, 57.5 + 9.5, 6]), [0, 1, .2])
    lm(st, 'f_corona', d0 * 0 + np.array([-50, -45, 60]) * 1.0, [-.5, -.4, .7])
    lm(st, 'f_sperm', d0 * (ZI + 6), d0)
    lm(st, 'f_pvs', np.array([0, -57.5, 0]) * 0 + np.array([0, -36, 41]), [0, -.6, .8])


# ================================================================ ধাপ ১: pronucleus
def s1():
    st = 1
    zona(st)
    add(st, 'oocyte', 'cell', blob([0, 0, 0], OOC, 4, .01, 2))
    add(st, 'pnM', 'pnM', blob([-11, 0, 4], 11, 3, .02, 3))
    add(st, 'pnF', 'pnF', blob([11, 2, 4], 10, 3, .02, 4))
    polar(st, [([4, 57.5, 5], 9.5), ([-12, 56, 10], 8)])
    for i, d in enumerate(rng.normal(size=(18, 3))):
        d /= np.linalg.norm(d)
        rot = trimesh.geometry.align_vectors([0, 0, 1], d)[:3, :3]
        add(st, 'corona', 'corona', blob(d * (ZO + 10), 6, 1, .1, 200 + i, scale=(1, 1, 1.4), rot=rot))
    lm(st, 'p_male', np.array([-11, 0, 15]), [0, 0, 1])
    lm(st, 'p_female', np.array([11, 2, 14]), [0, 0, 1])
    lm(st, 'p_pb2', np.array([-12, 64, 10]), [-.3, 1, .3])
    lm(st, 'p_zona', *surf_pt([0, 0, 0], ZO, [.6, -.3, .75]))


# ================================================================ ক্লিভেজ
CLV = {2: [(-1, 0, 0), (1, 0, 0)],
       3: [(-1, -.2, -.7), (1, -.2, -.7), (0, .9, .5), (0, -.9, .6)],
       4: [(x, y, z) for x in (-1, 1) for y in (-1, 1) for z in (-1, 1)]}


def cleave(st, n, comp=1.0, seed=0, label=''):
    zona(st)
    r = (VOL / n) ** (1 / 3) * comp
    dirs = np.array(CLV[st], float); dirs /= np.linalg.norm(dirs, axis=1)[:, None]
    R = OOC - r * .82 if n > 2 else r * .93
    for i, d in enumerate(dirs):
        c = d * R
        add(st, 'blast', 'cell', blob(c, r, 3, .03, seed + i, scale=(1, 1, 1) if n > 2 else (1, 1.05, 1.05)))
        add(st, 'nuc', 'nuc', blob(c, r * .22, 2, .03, seed + 50 + i))
    polar(st, [([0, 58, 12], 8.5), ([10, 54, -24], 7.5)])
    c0 = dirs[np.argmax(dirs @ [0, -.3, 1])] * R
    lm(st, label + 'blast', c0 + np.array([0, -.3, 1]) / np.linalg.norm([0, -.3, 1]) * r * .97, [0, -.3, 1])
    lm(st, label + 'zona', *surf_pt([0, 0, 0], ZO, [-.6, .55, .55]))
    lm(st, label + 'pb', np.array([0, 66.5, 12]), [0, 1, .3])


def s2(): cleave(2, 2, 1.0, 10, 'c2_')
def s3(): cleave(3, 4, 1.0, 20, 'c4_')
def s4(): cleave(4, 8, 1.0, 30, 'c8_')   # compaction: কোষ চ্যাপ্টা হয়ে একে অপরকে জড়িয়ে ধরে


# ================================================================ ধাপ ৫: morula
def s5():
    st = 5
    zona(st)
    n = 16
    r = (VOL / n) ** (1 / 3) * 0.9
    P = pack_spheres(n, OOC, r, seed=5, iters=800)
    dc = np.linalg.norm(P, axis=1)
    inner = np.argsort(dc)[:4]
    for i, c in enumerate(P):
        g = 'icm' if i in inner else 'troph0'
        add(st, 'm_inner' if i in inner else 'm_outer', g, blob(c, r, 3, .04, 60 + i))
        add(st, 'nuc', 'nuc', blob(c, r * .22, 2, .03, 80 + i))
    o = np.argmax(P @ np.array([0, 0, 1.]))
    lm(st, 'mo_outer', P[o] + np.array([0, 0, r * .95]), [0, 0, 1])
    lm(st, 'mo_inner', P[inner[0]] * 1.0, P[inner[0]] / (np.linalg.norm(P[inner[0]]) + 1e-6) + [0, 0, .5])
    lm(st, 'mo_zona', *surf_pt([0, 0, 0], ZO, [-.6, .5, .6]))


# ================================================================ blastocyst
def blastocyst(st, c, Ro, Ri, icm_dir, hole=None, herni=None, label=''):
    c = np.asarray(c, float)
    d = np.asarray(icm_dir, float); d /= np.linalg.norm(d)
    add(st, 'troph', 'troph', shell(c, Ro, Ri, sub=4, amp=.02, seed=st))
    add(st, 'cavity', 'cavity', blob(c, Ri - 4, 3))
    # embryoblast (inner cell mass): ভেতরের দেয়ালে embryonic pole-এ লেগে থাকা কোষের গুচ্ছ
    P = pack_spheres(14, 28, 8.6, seed=st + 3)
    P[:, 1] *= .55
    rot = trimesh.geometry.align_vectors([0, 1, 0], d)[:3, :3]
    for i, p in enumerate(P):
        q = c + d * (Ri - 12) + p @ rot.T
        add(st, 'icm', 'icm', blob(q, 8.6, 2, .05, 300 + st * 20 + i))
    lm(st, label + 'troph', c + np.array([0, -.5, .85]) / np.linalg.norm([0, -.5, .85]) * Ro, [0, -.5, .85])
    lm(st, label + 'icm', c + d * (Ri - 12) + np.array([0, 0, 18]), [0, 0, 1])
    lm(st, label + 'cav', c + np.array([0, -15, 0]), [0, 0, 1])
    return c


def s6():
    st = 6
    zona(st, 80, 70)
    blastocyst(st, [0, 0, 0], 69, 62, [0, 1, 0], label='b_')
    lm(st, 'b_zona', *surf_pt([0, 0, 0], 80, [.6, .4, .7]))
    lm(st, 'b_pole', np.array([0, 69, 8]), [0, 1, .3])


def s7():
    st = 7
    hd = np.array([1, -.25, .3]); hd /= np.linalg.norm(hd)
    zona(st, 82, 74, hole=(hd, 46))
    blastocyst(st, hd * 38, 70, 63, [-.3, 1, -.1], label='h_')
    lm(st, 'h_bulge', hd * 108, hd)
    lm(st, 'h_zona', *surf_pt([0, 0, 0], 82, [-.6, .5, .6]))


# ================================================================ ধাপ ৮: implantation
def s8():
    st = 8
    # জরায়ুর endometrium: উপরে epithelium, নিচে stroma (glands, capillary)
    W, Dp = 520, 340
    top = -70.0
    epi = trimesh.creation.box(extents=[W, 14, Dp]); epi.apply_translation([0, top - 7, 0])
    hole_c = np.array([0, top, 0])
    # ফুটো জায়গায় epithelium-এর উপরের মুখ সামান্য নামিয়ে দেওয়া (blastocyst ঢুকছে)
    add(st, 'epith', 'epith', epi)
    strm = trimesh.creation.box(extents=[W, 170, Dp]); strm.apply_translation([0, top - 14 - 85, 0])
    add(st, 'stroma', 'stroma', strm)
    for i, x in enumerate([-190, -95, 120, 205]):
        z = rng.uniform(-110, 110)
        pts = [[x, top - 2, z], [x + 8, top - 50, z + 6], [x - 6, top - 100, z - 4], [x + 10, top - 150, z + 8]]
        add(st, 'gland', 'gland', tube(pts, 10, 14))
    for i in range(6):
        z = rng.uniform(-140, 140); y = rng.uniform(top - 150, top - 40)
        pts = [[-W / 2 + 5, y, z], [-80, y + rng.uniform(-20, 20), z + 30], [80, y + rng.uniform(-20, 20), z - 30], [W / 2 - 5, y, z]]
        add(st, 'cap', 'cap', tube(pts, 4.5, 10))
    # blastocyst: embryonic pole নিচে (endometrium-এর দিকে)
    c = np.array([0, top + 58, 0])
    Ro, Ri = 72, 64
    d = np.array([0, -1, 0.])
    add(st, 'cyto', 'troph', shell(c, Ro, Ri, sub=4, amp=.02, seed=88))
    add(st, 'cavity', 'cavity', blob(c, Ri - 4, 3))
    # syncytiotrophoblast: নিচের মেরুতে epithelium ফুঁড়ে stroma-য় ঢোকা অনিয়মিত ভর
    syn = blob(c + d * (Ro + 10), 38, 3, .18, 99, scale=(1.35, .7, 1.25))
    add(st, 'syncytio', 'syncytio', syn)
    # embryoblast → epiblast (নিচে, trophoblast-এর দিকে) + hypoblast (উপরে, cavity-র দিকে)
    rot = np.eye(3)
    for i, (x, z) in enumerate([(x, z) for x in np.linspace(-22, 22, 5) for z in np.linspace(-22, 22, 5) if x * x + z * z < 26 ** 2]):
        add(st, 'epiblast', 'epiblast', blob(c + d * (Ri - 6) + [x, 0, z], 6, 1, 0, 0, scale=(.9, 1.6, .9)))
    for i, (x, z) in enumerate([(x, z) for x in np.linspace(-24, 24, 6) for z in np.linspace(-24, 24, 6) if x * x + z * z < 27 ** 2]):
        add(st, 'hypoblast', 'hypoblast', blob(c + d * (Ri - 17) + [x, 0, z], 5, 1, 0, 0, scale=(1, .8, 1)))
    lm(st, 'i_syn', c + d * (Ro + 10) + np.array([0, 0, 47]), [0, -.2, 1])
    lm(st, 'i_cyto', c + np.array([0, .3, .95]) / np.linalg.norm([0, .3, .95]) * Ro, [0, .3, .95])
    lm(st, 'i_epi', c + d * (Ri - 6) + [0, 0, 20], [0, 0, 1])
    lm(st, 'i_hypo', c + d * (Ri - 17) + [0, 3, 20], [0, .3, 1])
    lm(st, 'i_cav', c + np.array([0, 12, 25]), [0, 0, 1])
    lm(st, 'i_epith', np.array([-170, top, 150]), [0, 1, .3])
    lm(st, 'i_gland', np.array([-190, top - 2, 0]) * 0 + np.array([120, top - 6, 0]), [0, 1, .3])
    lm(st, 'i_stroma', np.array([180, top - 60, Dp / 2]), [0, 0, 1])


# ================================================================ ধাপ ৯: যাত্রাপথ (ডিম্বাশয় → জরায়ু), আলাদা মাপে
def s9():
    st = 9
    # জরায়ু (নাশপাতি আকার), গহ্বর দেখাতে সামনের অর্ধেক কাটা থাকবে (কেটে দেখা মোডে)
    ut = blob([0, -40, 0], 100, 4, 0, 0, scale=(1.0, 1.25, .55))
    add(st, 'uterus', 'uterus', ut)
    add(st, 'utcav', 'cavity', blob([0, -10, 0], 60, 3, 0, 0, scale=(1.0, 1.25, .25)))
    # ডান দিকের uterine tube: intramural → isthmus → ampulla → infundibulum (fimbriae)
    tp = [[85, 55, 0], [140, 70, 0], [200, 70, 8], [255, 55, 18], [300, 20, 25], [310, -20, 25]]
    add(st, 'tube', 'tube', tube(tp, np.linspace(8, 17, 120), 16))
    for k in range(9):
        a = k / 9 * 2 * np.pi
        base = np.array([310, -20, 25])
        add(st, 'tube', 'tube', tube([base, base + [12 * np.cos(a), -18, 12 * np.sin(a)], base + [20 * np.cos(a), -34, 20 * np.sin(a)]], 3.2, 8))
    add(st, 'ovary', 'ovary', blob([255, -60, 10], 34, 3, .06, 5, scale=(1.3, .8, .7)))
    add(st, 'follicle', 'follicle', blob([282, -48, 28], 12, 2))
    path = [([287, -45, 33], 'j_ov'), ([270, 42, 22], 'j_fert'), ([228, 66, 14], 'j_2c'), ([180, 71, 6], 'j_4c'), ([120, 66, 2], 'j_mor'),
            ([30, 20, 10], 'j_bl'), ([-20, 45, 14], 'j_imp')]
    for p, k in path:
        lm(st, k, np.array(p, float), [0, 0, 1])


STAGES = [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9]

if __name__ == '__main__':
    for f in STAGES:
        f()
    import embryo_w1_langman as LD   # Langman 14th অনুযায়ী বাড়তি ডিটেইল আর নতুন ধাপ (পুরোনো সব থাকে)
    LD.run(sys.modules[__name__])
    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', dict(scale=SCALE, meshes=MESHES, lm=LM, meta={}))
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', dict(meshes=[], tubes=[], spheres=[], anchors={}))
    print(len(MESHES), 'মেশ,', len(LM), 'ল্যান্ডমার্ক')
