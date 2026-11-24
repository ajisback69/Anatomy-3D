"""একটা হাড়ের পেজ প্রকাশের জন্য dist/<হাড়>/ ফোল্ডারে সাজায়।
ব্যবহার: python tools/make_artifact.py sternum
ফলাফল: dist/sternum/ (index.html, content.js, data/, viewer/), যেকোনো স্ট্যাটিক হোস্টে বা Claude artifact হিসেবে তোলা যায়।"""
import os, shutil, sys
root = os.path.join(os.path.dirname(__file__), '..')
bone = sys.argv[1]
src, out = os.path.join(root, 'bones', bone), os.path.join(root, 'dist', bone)
shutil.rmtree(out, ignore_errors=True)
shutil.copytree(src, out)
shutil.copytree(os.path.join(root, 'viewer'), os.path.join(out, 'viewer'))
p = os.path.join(out, 'index.html')
html = open(p).read().replace('../../viewer/', 'viewer/')
open(p, 'w').write(html)
for dp, _, fs in os.walk(out):
    for f in fs: print(os.path.relpath(os.path.join(dp, f), out))
