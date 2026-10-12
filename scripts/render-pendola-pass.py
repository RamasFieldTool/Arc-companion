"""Render manually traced geography in a registered screenshot reference plane.

Reads coordinates only: no screenshot/image source pixels are copied or filtered.
Requires Pillow. Registration matrices are supplied in the JSON so OpenCV is not
needed to reproduce the drawing. The reference plane is not game-world geometry.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json, math
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'assets/maps/pendola-pass-geography.json').read_text())
S=2; WIDTH=HEIGHT=1536; SCALE=1456/1536; OX=40; OY=155
im=Image.new('RGB',(WIDTH*S,HEIGHT*S),'#203840');d=ImageDraw.Draw(im)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def project(frame,p):
    h=data['frames'][frame]['matrix'];x,y=p
    z=h[2][0]*x+h[2][1]*y+h[2][2]
    if abs(z)<1e-8:raise ValueError('Invalid projection denominator')
    return ((h[0][0]*x+h[0][1]*y+h[0][2])/z,(h[1][0]*x+h[1][1]*y+h[1][2])/z)
def screen(p):return ((OX+p[0]*SCALE)*S,(OY+p[1]*SCALE)*S)
def points(frame,vertices):return [screen(project(frame,p)) for p in vertices]
def path(p,color,width):d.line(p,fill=color,width=max(1,int(width*S)),joint='curve')
# Known image coverage, not an invented playable perimeter. The southern reference
# reaches below the overview only in its central/eastern observed strip.
coverage=Image.new('L',im.size);cd=ImageDraw.Draw(coverage)
cd.polygon(points('overview',[(0,0),(1536,0),(1536,1152),(0,1152)]),fill=255)
cd.polygon(points('south',[(0,0),(1536,0),(1536,1008),(0,1008)]),fill=255)
base=Image.new('RGB',im.size,'#e7ece7');im.paste(base,(0,0),coverage)
def hatch_polygon(p,fill,ink,step=13):
    d.polygon(p,fill=fill)
    mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(p,fill=255)
    texture=Image.new('RGB',im.size,fill);td=ImageDraw.Draw(texture)
    xmin=int(min(x for x,y in p));xmax=int(max(x for x,y in p));ymin=int(min(y for x,y in p));ymax=int(max(y for x,y in p))
    for x in range(xmin-(ymax-ymin),xmax+(ymax-ymin),step*S):td.line([(x,ymin),(x+ymax-ymin,ymax)],fill=ink,width=S)
    im.paste(texture,(0,0),mask)
# Validate all digitized vertices against the actually available source frame.
for f in data['features']:
    frame=data['frames'][f['frame']]
    if len(f['vertices'])<2:raise ValueError('Empty geometry: '+f['id'])
    for x,y in f['vertices']:
        if not(0<=x<=frame['imageSize'][0] and 0<=y<=frame['usableMaxY']):raise ValueError('Outside usable reference: '+f['id'])
# Broad terrain/stands are area traces. Hatching is a drawing convention, not
# individual tree/rock positions, altitude contours or additional game data.
for kind in ['terrain','forest','water','transport-deck','transport-line','road','rail','compound','building']:
 for f in data['features']:
    if f['kind']!=kind:continue
    p=points(f['frame'],f['vertices'])
    if kind=='terrain':
        d.polygon(p,fill='#a6b7bd');path(p,'#cbd7d8',2);path(p[1:-1],'#718e99',2)
    elif kind=='forest':hatch_polygon(p,'#c9d6d1','#a7bdb4',10);path(p+[p[0]],'#b0c2b9',1)
    elif kind=='water':
        path(p,'#719cab',11);path(p,'#c5e1e5',7);path(p,'#e7f2f0',1)
    elif kind=='transport-deck':
        d.polygon(p,fill='#708891');path(p+[p[0]],'#445f69',1.5);path(p[:max(2,len(p)//2)],'#a6bac0',2)
    elif kind=='transport-line':path(p,'#617e87',8);path(p,'#a3b9bd',3)
    elif kind=='road':path(p,'#a9b2a7',5);path(p,'#f3f0db',3)
    elif kind=='rail':
        path(p,'#738d92',4);path(p,'#345961',1)
        for a,b in zip(p,p[1:]):
            dx,dy=b[0]-a[0],b[1]-a[1];length=math.hypot(dx,dy)
            for j in range(0,int(length),16*S):
                q=j/length;x=a[0]+q*dx;y=a[1]+q*dy
                path([(x-dy/length*3*S,y+dx/length*3*S),(x+dy/length*3*S,y-dx/length*3*S)],'#5e7980',1)
    elif kind=='compound':path(p,'#f5eee0',4);path(p,'#8b9990',1)
    elif kind=='building':
        d.polygon(p,fill='#617984');path(p+[p[0]],'#2c4c58',1.2);path(p[:2],'#ececda',2)
# Reapply coverage: nothing inferred outside the photographed reference extent.
outside=Image.new('RGB',im.size,'#41565d');im.paste(outside,(0,0),Image.eval(coverage,lambda x:255-x))
d=ImageDraw.Draw(im)
# Labels are anchored to displayed source names. Collision avoidance moves text
# only, with a leader back to its registered reference area. No gameplay dots.
occupied=[]
def intersects(a,b,pad=8*S):return not(a[2]+pad<b[0] or b[2]+pad<a[0] or a[3]+pad<b[1] or b[3]+pad<a[1])
def draw_label(entry):
    major=entry['major'];size=19 if major else 15
    f=ImageFont.truetype(bold if major else font,size*S)
    text=entry['text'];words=text.split();lines=[];current=''
    for word in words:
        candidate=(current+' '+word).strip()
        if current and d.textlength(candidate,font=f)>230*S:lines.append(current);current=word
        else:current=candidate
    if current:lines.append(current)
    w=max(d.textlength(t,font=f) for t in lines)+14*S;h=(len(lines)*(size+4)+8)*S
    anchor=screen(project(entry['frame'],entry['point']))
    candidates=[(0,0),(0,-30),(0,30),(-95,0),(95,0),(0,-64),(0,64),(-145,-45),(145,-45),(-145,50),(145,50)]
    chosen=None
    for dx,dy in candidates:
        cx=anchor[0]+dx*S;cy=anchor[1]+dy*S
        x=max(44*S,min((1492*S)-w,cx-w/2));y=max(160*S,min((1333*S)-h,cy-h/2))
        box=(x,y,x+w,y+h)
        if not any(intersects(box,b) for b in occupied):chosen=box;break
    if chosen is None:raise ValueError('Label cannot be placed without overlap: '+text)
    occupied.append(chosen);x,y,xx,yy=chosen
    if not(x<=anchor[0]<=xx and y<=anchor[1]<=yy):
        target=(max(x,min(xx,anchor[0])),max(y,min(yy,anchor[1])))
        path([anchor,target],'#526f78',1)
    d.rounded_rectangle(chosen,radius=3*S,fill='#243f49' if major else '#f2f3e9',outline='#455f66' if major else '#c2d0ce',width=S)
    for i,t in enumerate(lines):d.text((x+7*S,y+4*S+i*(size+4)*S),t,font=f,fill='#ecd5a4' if major else '#244551')
for e in sorted(data['labels'],key=lambda x:not x['major']):draw_label(e)
# Frame and legend are explicitly non-geographic.
d.rectangle((0,0,WIDTH*S,130*S),fill='#203840')
d.text((40*S,24*S),'PENDOLA PASS',font=ImageFont.truetype(bold,34*S),fill='#f0d59d')
d.text((40*S,77*S),'RAMAS FIELD TOOL · EIGENE KARTENZEICHNUNG',font=ImageFont.truetype(font,16*S),fill='#e8eeee')
d.text((40*S,105*S),'REFERENZEN RÄUMLICH ABGEGLICHEN · SICHTBARE UMRISSE NACHGEZEICHNET',font=ImageFont.truetype(font,12*S),fill='#b9cccf')
d.rectangle((0,1350*S,WIDTH*S,HEIGHT*S),fill='#203840')
legend=[('Verkehrstrasse · Art teils unklar','#708891'),('Gleise im Terminal','#345961'),('Sichtbare Straßen','#f3f0db'),('Überfrorener Fluss','#c5e1e5')]
for i,(t,c) in enumerate(legend):
    x=40+(i%2)*710;y=1372+(i//2)*31
    d.line((x*S,(y+8)*S,(x+37)*S,(y+8)*S),fill=c,width=5*S)
    d.text(((x+50)*S,y*S),t,font=ImageFont.truetype(font,16*S),fill='#e3eae7')
d.text((40*S,1452*S),'ENTWURF · Keine bestätigten Spielmarker · Keine Höhen- oder Maßstabsangaben',font=ImageFont.truetype(font,16*S),fill='#ecd5a4')
d.text((40*S,1480*S),'Kleine, verdeckte Details ausgelassen · Grauer Rand: außerhalb der Bildreferenz',font=ImageFont.truetype(font,15*S),fill='#d1dedf')
d.text((40*S,1508*S),'Bildabgleich geprüft; Umrisse manuell angenähert. Keine Vermessung der Spielwelt.',font=ImageFont.truetype(font,13*S),fill='#b9cccf')
im.save(ROOT/'assets/maps/pendola-pass-rft-base.jpg',quality=94,subsampling=0)
print(f"Rendered {len(data['features'])} traced features and {len(occupied)} non-overlapping labels; {im.size}.")
