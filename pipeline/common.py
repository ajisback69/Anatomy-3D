"""সব হাড়ের জন্য কমন টুল: মেশ লোড, হালকা করা (decimate), ভিউয়ারের ফরম্যাটে প্যাক করা।

ভিউয়ারের স্থানাঙ্ক (three.js):
  X = রোগীর বাম দিক (+), Y = উপর (+), Z = সামনে (+)
BodyParts3D-এর স্থানাঙ্ক (মিলিমিটার):
  x = রোগীর বাম (+), y = পেছন (+), z = উপর (+)
প্রতিটা হাড়ের মডেল সেই হাড়ের কেন্দ্রকে (C) শূন্য ধরে সাজানো হয়।
"""
import base64, json, os
import numpy as np
import trimesh
import fast_simplification as fs

BP3D_DIR = os.environ.get('BP3D_DIR', os.path.join(os.path.dirname(__file__), '..', '..', 'bp3d'))
STL = os.path.join(BP3D_DIR, 'assets', 'BodyParts3D_data', 'stl')
SCALE = 0.02  # int16 কোয়ান্টাইজেশন: 1 ইউনিট = 0.02 মিমি


def load(fma):
    m = trimesh.load(os.path.join(STL, fma + '.stl'))
    m.merge_vertices()
    return m


class Frame:
    """একটা হাড়ের কেন্দ্র ধরে BodyParts3D থেকে ভিউয়ারের স্থানাঙ্কে বদলায়।"""
    def __init__(self, center):
        self.C = np.asarray(center, float)

    def tf(self, v):
        v = np.asarray(v, float) - self.C
        return np.stack([v[..., 0], v[..., 2], -v[..., 1]], -1)

    def tf_dir(self, n):
        n = np.asarray(n, float)
        return np.stack([n[..., 0], n[..., 2], -n[..., 1]], -1)


def decimate(mesh, target_faces):
    r = max(0.0, 1 - target_faces / len(mesh.faces))
    if r <= 0:
        return mesh.vertices, mesh.faces
    v, f = fs.simplify(mesh.vertices.astype(np.float32), mesh.faces.astype(np.int32), target_reduction=r)
    return v, f


def pack(frame, name, group, v, f, regions=None, key=None):
    q = np.round(frame.tf(v) / SCALE).astype(np.int16)
    e = dict(name=name, group=group,
             v=base64.b64encode(q.tobytes()).decode(),
             f=base64.b64encode(np.asarray(f).astype(np.uint16).tobytes()).decode())
    if regions is not None:
        e['r'] = base64.b64encode(np.asarray(regions).astype(np.uint8).tobytes()).decode()
    if key:
        e['key'] = key
    return e


def write_js(path, varname, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as fh:
        fh.write(f'{varname}=' + json.dumps(obj, separators=(',', ':')) + ';\n')
    print(f'{path}: {os.path.getsize(path)/1e6:.2f} MB')


def half_width_fn(verts, bins=80):
    """প্রতিটা উচ্চতায় (z) হাড়ের অর্ধেক প্রস্থ, মধ্যরেখা থেকে।"""
    zb = np.linspace(verts[:, 2].min(), verts[:, 2].max(), bins)
    hw = np.array([np.abs(verts[(verts[:, 2] >= zb[max(i-1, 0)]) & (verts[:, 2] <= zb[min(i+1, bins-1)]), 0]).max()
                   for i in range(bins)])
    return lambda z: np.interp(z, zb, hw)
