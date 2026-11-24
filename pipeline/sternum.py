"""স্টার্নামের ডেটা বানায়: bones/sternum/data/core.js ও layers.js

চালানোর নিয়ম (রিপোর মূল ফোল্ডার থেকে):
  pip install -r pipeline/requirements.txt
  bash pipeline/fetch_meshes.sh pipeline/ids_sternum.txt
  python pipeline/sternum.py

যা হিসাব করে:
  - তিন অংশের মেশ (manubrium, body, xiphoid), হালকা করে
  - costal notch: আসল costal cartilage স্টার্নামকে যেখানে ছোঁয়
  - joint (manubriosternal, xiphisternal): দুই অংশ যেখানে মেলে
  - মাসল অ্যাটাচমেন্ট: আসল মাসল হাড়ের ২.৫ মিমি-র মধ্যে যেখানে আসে
  - ভার্টিব্রাল লেভেল: ল্যান্ডমার্কের উচ্চতায় কোন কশেরুকা/ডিস্ক
  - স্কিম্যাটিক: internal thoracic vessel, parasternal node, intercostal nerve
"""
import os, sys
import numpy as np
import trimesh
from scipy.spatial import cKDTree
sys.path.insert(0, os.path.dirname(__file__))
from common import load, Frame, decimate, pack, write_js, half_width_fn, SCALE

OUT = os.path.join(os.path.dirname(__file__), '..', 'bones', 'sternum', 'data')

PARTS = [('FMA7486', 'manubrium', 7000), ('FMA7487', 'body', 10000), ('FMA7488', 'xiphoid', 2600)]
CC = {'R': ['FMA7875', 'FMA7886', 'FMA7913', 'FMA7976', 'FMA8070', 'FMA8194', 'FMA8248'],
      'L': ['FMA8005', 'FMA8031', 'FMA8058', 'FMA8167', 'FMA8112', 'FMA8221', 'FMA8275']}
RIB = {'R': ['FMA7857', 'FMA7882', 'FMA7909', 'FMA7957', 'FMA8066', 'FMA8175', 'FMA8229'],
       'L': ['FMA7987', 'FMA8012', 'FMA8039', 'FMA8148', 'FMA8093', 'FMA8202', 'FMA8256']}
CLAV = {'R': 'FMA13322', 'L': 'FMA13323'}
# অ্যাটাচমেন্ট রিজিয়ন নম্বর -> মাসলের মেশ (নম্বরগুলো content.js-এর REG-এর সাথে মেলে)
MUSCLE_REGIONS = {1: ['FMA79979', 'FMA79980'], 2: ['FMA13408', 'FMA13409'], 3: ['FMA13346', 'FMA13347'],
                  4: ['FMA13350', 'FMA13351'], 5: ['FMA9761', 'FMA9762'], 6: ['FMA13295'],
                  7: ['FMA13377', 'FMA13378'], 9: ['FMA11336'], 10: ['FMA13336', 'FMA13337']}
ARTICULAR = 8
LAYER_MESHES = [  # key, group, files, faces
    ('pm', 'muscle', ['FMA79979', 'FMA79980', 'FMA34690', 'FMA34691'], 3500), ('scm', 'muscle', ['FMA13408', 'FMA13409'], 3000),
    ('sh', 'muscle', ['FMA13346', 'FMA13347'], 1500), ('sth', 'muscle', ['FMA13350', 'FMA13351'], 1500),
    ('tt', 'muscle', ['FMA9761', 'FMA9762'], 2000), ('dia', 'muscle', ['FMA13295'], 7000),
    ('ra', 'muscle', ['FMA13377', 'FMA13378'], 3500), ('eo', 'muscle', ['FMA13336', 'FMA13337'], 4000), ('la', 'muscle', ['FMA11336'], 1500),
    ('aoAsc', 'artery', ['FMA3736'], 2500), ('aoArch', 'artery', ['FMA3768'], 2500), ('bct', 'artery', ['FMA3932nsn'], 1500),
    ('lcca', 'artery', ['FMA4058'], 1500), ('lsa', 'artery', ['FMA4694'], 1500), ('rcca', 'artery', ['FMA3941'], 1500),
    ('rsa', 'artery', ['FMA3953'], 1500), ('aoDesc', 'artery', ['FMA3784'], 3000),
    ('svc', 'vein', ['FMA4720'], 1500), ('rbcv', 'vein', ['FMA4751'], 1200), ('lbcv', 'vein', ['FMA4761'], 1500),
    ('rscv', 'vein', ['FMA4755'], 1000), ('lscv', 'vein', ['FMA4763'], 1000),
    ('heart', 'heart', ['FMA7274'], 9000),
    ('lung', 'lung', ['FMA7333', 'FMA7383', 'FMA7337', 'FMA7370', 'FMA7371'], 16500),
    ('thymus', 'thymus', ['FMA71194', 'FMA71195'], 2000), ('trachea', 'trachea', ['FMA7394'], 2500), ('eso', 'trachea', ['FMA7131'], 2000),
]
# ভিউয়ারে কোন লেয়ারে যাবে, যদি group থেকে আলাদা হয়
LAYER_OVERRIDE = {'aoDesc': 'vert', 'eso': 'vert'}
VERT = [('T1', 'FMA9165'), ('T2', 'FMA9187'), ('T3', 'FMA9209'), ('T4', 'FMA9248'), ('T5', 'FMA9922'),
        ('T6', 'FMA9945'), ('T7', 'FMA9968'), ('T8', 'FMA9991'), ('T9', 'FMA10014'), ('T10', 'FMA10037')]
DISC = ['FMA10458', 'FMA13495', 'FMA13500', 'FMA13501', 'FMA13502', 'FMA13503', 'FMA13504', 'FMA13505', 'FMA13506', 'FMA13507']


def main():
    orig = {name: load(f) for f, name, _ in PARTS}
    st = trimesh.util.concatenate(list(orig.values()))
    allv, nrm = st.vertices, st.vertex_normals
    F = Frame(allv.mean(0))
    stT = cKDTree(allv)
    ptree = {k: cKDTree(m.vertices) for k, m in orig.items()}
    cc = {s: [load(k) for k in CC[s]] for s in 'RL'}
    clav = {s: load(CLAV[s]) for s in 'RL'}
    halfw = half_width_fn(allv)

    # ---------- costal notch: cartilage যেখানে ছোঁয় ----------
    notch = {}
    for s in 'RL':
        for n, m in enumerate(cc[s], 1):
            best = None
            for c in m.split(only_watertight=False):
                d, _ = stT.query(c.vertices)
                if (d < 3).any() and (best is None or d.min() < best[0]):
                    best = (d.min(), c.vertices[d < 3])
            _, idx = stT.query(best[1]); P = allv[np.unique(idx)]
            notch[(s, n)] = dict(p=P.mean(0), z0=P[:, 2].min(), z1=P[:, 2].max())
    zc = lambda s, n: (notch[(s, n)]['z0'] + notch[(s, n)]['z1']) / 2

    def junction(a, b):
        d, _ = ptree[b].query(orig[a].vertices); return orig[a].vertices[d < 2.0]
    J1, J2 = junction('manubrium', 'body'), junction('body', 'xiphoid')

    # ---------- bone meshes + অ্যাটাচমেন্ট রিজিয়ন ----------
    core = dict(scale=SCALE, meshes=[])
    mus = {}
    for fl in MUSCLE_REGIONS.values():
        for f in fl: mus[f] = load(f)
    mT = {r: cKDTree(np.vstack([mus[f].vertices for f in fl])) for r, fl in MUSCLE_REGIONS.items()}
    artT = cKDTree(np.vstack([m.vertices for s in 'RL' for m in cc[s]] + [clav['R'].vertices, clav['L'].vertices]))
    for f, name, target in PARTS:
        v, fc = decimate(orig[name], target)
        dist = np.full(len(v), 99.); reg = np.zeros(len(v), np.uint8)
        for r, t in mT.items():
            d, _ = t.query(v); upd = (d < 2.5) & (d < dist); reg[upd] = r; dist[upd] = d[upd]
        d, _ = artT.query(v); reg[(d < 0.7) | ((d < 1.2) & (reg == 0))] = ARTICULAR
        core['meshes'].append(pack(F, name, 'bone', v, fc, reg))
    for s in 'RL':
        for i, m in enumerate(cc[s], 1):
            v, fc = decimate(m, 700); core['meshes'].append(pack(F, f'cc{s}{i}', 'cart', v, fc))
        for i, k in enumerate(RIB[s], 1):
            v, fc = decimate(load(k), 1500); core['meshes'].append(pack(F, f'rib{s}{i}', 'rib', v, fc))
        v, fc = decimate(clav[s], 2200); core['meshes'].append(pack(F, f'clav{s}', 'clav', v, fc))

    # ---------- ল্যান্ডমার্ক ----------
    lm = []
    def snap(p):
        _, i = stT.query(p); return allv[i], nrm[i]
    def add(id_, p, n):
        lm.append(dict(id=id_, p=F.tf(p).round(2).tolist(), n=F.tf_dir(n).round(4).tolist()))
    def midline_ant(z, part, w=2.5, x0=0):
        vv = orig[part].vertices; sel = vv[(np.abs(vv[:, 0] - x0) < w) & (np.abs(vv[:, 2] - z) < 1.5)]
        return snap(sel[sel[:, 1].argmin()])
    mv, bv, xv = orig['manubrium'].vertices, orig['body'].vertices, orig['xiphoid'].vertices
    top = mv[np.abs(mv[:, 0]) < 3]; zj = top[:, 2].max()
    add('jugular', *snap(top[top[:, 2].argmax()]))
    for s in 'RL':
        d, _ = cKDTree(clav[s].vertices).query(mv); add('clav' + s, *snap(mv[d < 1.6].mean(0)))
    for (s, n), o in notch.items(): add(f'cn{s}{n}', *snap(o['p']))
    a = J1[np.abs(J1[:, 0]) < 3]; za = a[:, 2].mean(); add('angle', *snap(a[a[:, 1].argmin()]))
    a = J2[np.abs(J2[:, 0]) < 3]; zx = a[:, 2].mean(); add('xsj', *snap(a[a[:, 1].argmin()]))
    for n in (3, 4, 5): add(f'ridge{n}', *midline_ant((zc('R', n) + zc('L', n)) / 2, 'body'))
    add('xtip', *snap(xv[xv[:, 2].argmin()]))
    add('antman', *midline_ant(1318, 'manubrium'))
    add('antbody', *midline_ant(1228, 'body', 2.5, 9))
    pb = allv[(np.abs(allv[:, 0]) < 3) & (np.abs(allv[:, 2] - 1240) < 2)]; add('postbody', *snap(pb[pb[:, 1].argmax()]))
    pm = mv[(np.abs(mv[:, 0]) < 3) & (np.abs(mv[:, 2] - 1318) < 2)]; add('postman', *snap(pm[pm[:, 1].argmax()]))
    z = (zc('R', 1) + 1300) / 2; sl = mv[np.abs(mv[:, 2] - z) < 1.5]; add('latman', *snap(sl[sl[:, 0].argmin()]))
    core['lm'] = lm
    core['dims'] = dict(man=float(np.ptp(mv[:, 2])), body=float(np.ptp(bv[:, 2])), xip=float(np.ptp(xv[:, 2])),
                        total=float(np.ptp(allv[:, 2])), width_man=float(np.ptp(mv[:, 0])))

    # ---------- লেয়ার মেশ ----------
    lay = dict(meshes=[], tubes=[], spheres=[])
    for key, g, fl, t in LAYER_MESHES:
        for i, f in enumerate(fl):
            v, fc = decimate(mus[f] if f in mus else load(f), t // len(fl))
            e = pack(F, f'{key}{i}' if len(fl) > 1 else key, g, v, fc, key=key)
            if key in LAYER_OVERRIDE: e['layer'] = LAYER_OVERRIDE[key]
            lay['meshes'].append(e)
    vc = {}
    for n, f in VERT:
        m = load(f); v, fc = decimate(m, 1400); lay['meshes'].append(pack(F, n, 'vert', v, fc, key=n)); vc[n] = m.vertices
    for i, f in enumerate(DISC, 1):
        m = load(f); v, fc = decimate(m, 300); lay['meshes'].append(pack(F, f'D{i}', 'disc', v, fc, key=f'D{i}')); vc[f'D{i}'] = m.vertices

    # ---------- ভার্টিব্রাল লেভেল (স্ক্যানে মাপা) ----------
    def zr(n):
        v = vc[n]; a = v[v[:, 1] < np.percentile(v[:, 1], 35)]; return a[:, 2].min(), a[:, 2].max()
    lev = {n: zr(n) for n in vc}
    hits = lambda z: [n for n, (a, b) in lev.items() if a <= z <= b]
    core['levels'] = {k: float(F.tf([0, 0, z])[1]) for k, z in (('jug', zj), ('ang', za), ('xsj', zx))}
    core['levelHits'] = {'jug': hits(zj), 'ang': hits(za), 'xsj': hits(zx)}
    print('লেভেল (D4 = T4/T5 ডিস্ক):', core['levelHits'])

    # ---------- স্কিম্যাটিক পথ ----------
    sg = {'R': -1, 'L': 1}
    def cc_post(s, k, x):
        v = cc[s][k - 1].vertices; sel = v[np.abs(v[:, 0] - x) < 4]
        return (sel if len(sel) else v)[:, 1].max()
    def tube(key, layer, group, col, r, pts):
        lay['tubes'].append(dict(key=key, layer=layer, group=group, col=col, r=r, pts=F.tf(np.array(pts)).round(2).tolist()))
    anchors = {}
    for s in 'RL':
        g = sg[s]
        sub = load('FMA3953' if s == 'R' else 'FMA4694').vertices
        o = sub[cKDTree(sub).query([g * (halfw(zc(s, 1)) + 14), -150, zc(s, 1) + 28])[1]]
        pts = [np.array([g * (halfw(zc(s, k)) + 12), cc_post(s, k, g * (halfw(zc(s, k)) + 12)) + 3.5, zc(s, k)]) for k in range(1, 7)]
        z6 = notch[(s, 6)]['z0']
        split = np.array([g * (halfw(z6) + 12), pts[-1][1] + 1, (z6 + notch[(s, 7)]['z1']) / 2])
        tube('ita', 'artery', 'artery', '#ff5a4d', 1.3, [o] + pts + [split])
        tube('sea', 'artery', 'artery', '#ff5a4d', 1.0, [split, split + [-g, 1, -18], split + [0, -4, -45]])
        tube('mph', 'artery', 'artery', '#ff5a4d', 1.0, [split, split + [g * 18, 2, -14], split + [g * 40, 6, -30], split + [g * 62, 12, -46]])
        bcv = load('FMA4751' if s == 'R' else 'FMA4761').vertices
        vo = bcv[cKDTree(bcv).query([g * (halfw(zc(s, 1)) + 9), -150, zc(s, 1) + 22])[1]]
        tube('itv', 'vein', 'vein', '#5d86f0', 1.5, [vo] + [p + [-g * 4.5, .5, 0] for p in pts] + [split + [-g * 4.5, .5, -4]])
        for k in range(1, 6):
            zi = (notch[(s, k)]['z0'] + notch[(s, k + 1)]['z1']) / 2; a = (pts[k - 1] + pts[k]) / 2
            p = F.tf([a[0] - g * 2, a[1] - 1.5, zi]).round(2).tolist()
            lay['spheres'].append(dict(key='nodes', layer='lymph', col='#5cc27a', r=2.3, p=p))
            if s == 'L' and k == 3: anchors['nodes'] = p
        for k in range(2, 7):
            zi = (notch[(s, k)]['z0'] + notch[(s, k + 1)]['z1']) / 2
            e = g * halfw(zi); yp = (pts[k - 1][1] + pts[min(k, 5)][1]) / 2
            sa = allv[np.abs(allv[:, 2] - zi) < 2]; yant = sa[:, 1].min() if len(sa) else -200
            npts = [[g * 80, yp - 4, zi - 1], [g * 45, yp - 5, zi], [e + g * 7, yp - 7, zi], [e + g * 5, yant - 6, zi], [e + g * 20, yant - 9, zi + 1]]
            tube('nerve', 'nerve', 'artery', '#f2c230', .75, npts)
            if s == 'L' and k == 4: anchors['nerve'] = F.tf(npts[3]).round(2).tolist()
        if s == 'R':
            anchors['ita'] = F.tf(pts[3]).round(2).tolist()
    lay['anchors'] = anchors

    write_js(os.path.join(OUT, 'core.js'), 'window.DATA', core)
    write_js(os.path.join(OUT, 'layers.js'), 'window.LAYERS', lay)


if __name__ == '__main__':
    main()
