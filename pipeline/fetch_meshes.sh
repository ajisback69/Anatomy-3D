#!/usr/bin/env bash
# BodyParts3D মেশ ডাউনলোড করে (শুধু যেগুলো দরকার)।
# ব্যবহার: bash pipeline/fetch_meshes.sh pipeline/ids_sternum.txt
# ফাইলগুলো যাবে: $BP3D_DIR (ডিফল্ট ../bp3d)
set -euo pipefail
IDS_FILE="$1"
BP3D_DIR="${BP3D_DIR:-../bp3d}"
if [ ! -d "$BP3D_DIR/.git" ]; then
  GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 --filter=blob:none --no-checkout \
    https://github.com/Kevin-Mattheus-Moerman/BodyParts3D "$BP3D_DIR"
  git -C "$BP3D_DIR" config gc.auto 0
fi
PATHS=""
for id in $(grep -v '^#' "$IDS_FILE" | awk '{print $1}'); do
  PATHS="$PATHS assets/BodyParts3D_data/stl/$id.stl"
done
git -C "$BP3D_DIR" checkout HEAD -- assets/BodyParts3D_data/parts_list_e.txt $PATHS
echo "ডাউনলোড শেষ: $BP3D_DIR/assets/BodyParts3D_data/stl"
