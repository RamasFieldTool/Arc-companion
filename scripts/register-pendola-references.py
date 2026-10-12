"""Optional alignment reproduction from privately supplied reference photos.

Requires OpenCV + NumPy. Does not copy photographs into the repository.
Usage: python3 scripts/register-pendola-references.py /path/to/references
Prints matrices/statistics; the render script reads the checked-in coordinate JSON.
"""
import argparse,json
from pathlib import Path
import cv2,numpy as np
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('reference_directory',type=Path)
args=parser.parse_args()
files=['image-1791749818451.jpg','image-1791750210769.jpg','image-1791750240938.jpg','image-1791750265128.jpg']
images=[cv2.imread(str(args.reference_directory/f),cv2.IMREAD_GRAYSCALE) for f in files]
if any(x is None for x in images):raise SystemExit('All four reference files must be supplied; none are included in this repository.')
sift=cv2.SIFT_create(nfeatures=16000,contrastThreshold=0.025)
features=[sift.detectAndCompute(cv2.GaussianBlur(x,(3,3),0),None) for x in images]
results={}
for idx,name in enumerate(['overview','north','middle','south']):
    if idx==0:continue
    ka,da=features[idx];kb,db=features[0]
    candidates=cv2.BFMatcher().knnMatch(da,db,k=2)
    matches=[a for a,b in candidates if a.distance<0.68*b.distance]
    a=np.float32([ka[m.queryIdx].pt for m in matches]);b=np.float32([kb[m.trainIdx].pt for m in matches])
    h,mask=cv2.findHomography(a,b,cv2.RANSAC,4.0)
    if h is None:raise SystemExit('Image registration failed: '+name)
    keep=mask[:,0].astype(bool)
    if keep.sum()<20:raise SystemExit('Too few consistent reference features: '+name)
    predicted=cv2.perspectiveTransform(a.reshape(-1,1,2),h)[:,0,:]
    error=np.linalg.norm(predicted[keep]-b[keep],axis=1)
    results[name]={'matrix':h.tolist(),'matches':len(matches),'inliers':int(keep.sum()),'medianResidualPx':float(np.median(error)),'p95ResidualPx':float(np.quantile(error,.95))}
print(json.dumps(results,indent=2))
