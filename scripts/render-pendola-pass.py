"""Own schematic drawing from visual screenshot references; no source pixels used.
Coordinates are approximate, in the overview reference frame. Not a survey.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math
ROOT=Path(__file__).resolve().parents[1]
S=2
im=Image.new('RGB',(3072,3072),'#dbe4e3'); d=ImageDraw.Draw(im)
def pts(p): return [(int(x*S),int((y+145)*S)) for x,y in p]
def poly(p,fill,outline=None): d.polygon(pts(p),fill=fill); line(p+[p[0]],outline,2) if outline else None
def line(p,fill,w=2): d.line(pts(p),fill=fill,width=int(w*S),joint='curve')
def rect(x,y,w,h,angle=0):
    c=math.cos(math.radians(angle));s=math.sin(math.radians(angle))
    p=[(x+u*c-v*s,y+u*s+v*c) for u,v in [(0,0),(w,0),(w,h),(0,h)]]
    poly(p,'#697d81','#314950');line([p[0],p[1]],'#f0f3e9',3)
def road(p,w=10):line(p,'#b4b8ae',w+4);line(p,'#eeeadd',w);line(p,'#c5c5b7',1)
def rail(p,w=8):
    line(p,'#7c8d90',w+6);line(p,'#344d56',w);line(p,'#b4c7c8',2)
    for a,b in zip(p,p[1:]):
        dx,dy=b[0]-a[0],b[1]-a[1];length=math.hypot(dx,dy)
        for i in range(0,int(length),12):
            t=i/length;x=a[0]+dx*t;y=a[1]+dy*t
            line([(x-dy/length*(w/2+3),y+dx/length*(w/2+3)),(x+dy/length*(w/2+3),y-dx/length*(w/2+3))],'#50666d',2)
# Broad visible valley walls: simplified polygons, no invented contour/elevation data.
for p in [
[(0,0),(620,0),(545,150),(500,240),(395,300),(275,345),(195,320),(65,260),(0,350)],
[(0,350),(120,315),(225,375),(355,425),(390,490),(270,500),(180,560),(80,535),(0,600)],
[(680,0),(870,0),(825,160),(740,290),(675,375),(610,435),(485,465),(425,440),(545,310),(610,185)],
[(0,670),(200,720),(260,800),(220,920),(100,1030),(0,1080)],
[(285,720),(475,715),(580,805),(600,915),(505,950),(420,910),(340,840)],
[(710,880),(785,940),(800,1070),(760,1240),(630,1280),(580,1160),(640,1010)],
[(1220,0),(1536,0),(1536,1260),(1275,1240),(1350,1120),(1340,965),(1220,875),(1260,750),(1350,665),(1300,520),(1410,390),(1300,250)]
]:
    poly(p,'#a6b8ba'); q=[(x+10,y-10) for x,y in p[1:-1]];line(q,'#eaf0ed',7)
# Frozen channel visible across all four frames.
river=[(830,0),(790,125),(750,230),(720,320),(715,410),(735,515),(770,610),(780,710),(785,830),(780,940),(815,1060),(830,1210),(820,1280)]
line(river,'#6d949f',24);line(river,'#b4d9dc',17);line(river,'#e4f2ee',3)
# Eastern stream near the loading platforms; end is cropped in the references.
line([(1080,815),(1140,840),(1155,890),(1210,910),(1250,895),(1285,940),(1370,1010)],'#91b6bd',15)
# Visible western transport corridors and eastward bridge.
rail([(0,400),(160,435),(280,495),(420,520),(580,535),(725,535),(875,575)],12)
rail([(0,560),(180,590),(310,630),(470,680),(610,745),(720,820)],12)
rail([(0,735),(130,750),(245,770)],8)
rail([(660,310),(635,415),(620,500),(660,650),(765,800),(900,910),(930,1050)],6)
road([(900,0),(860,155),(805,270),(790,390),(815,500),(900,610),(950,735),(970,880),(1010,1020),(995,1260)],9)
road([(725,260),(680,360),(660,430),(690,520),(725,590),(745,710),(730,820),(760,930),(760,1050),(775,1240)],9)
road([(695,520),(820,510),(950,500),(1030,410),(1140,390)],7)
road([(730,820),(660,855),(585,880),(545,825),(500,790)],7)
# Almatera station: grouped long roofs visible in overview and centre frame.
for x,y,w,h in [(595,395,20,92),(622,400,20,100),(650,410,22,105),(590,515,98,16)]:rect(x,y,w,h,15)
# Western village roofs shown as large parallel groups, individual footprints unresolved.
for x,y,w,h in [(265,480,225,28),(205,540,290,25),(250,588,285,25),(190,645,300,24)]:rect(x,y,w,h,11)
# Military supermarket complex.
rect(702,615,48,83);rect(700,700,87,27);rect(765,649,21,67)
# Reception facility and station yard: visible elongated plan.
for i in range(5):rail([(855+i*20,585),(910+i*20,820)],3)
rect(840,590,19,122,-12);rect(915,610,20,124,-12);rect(865,757,95,25,-12)
# Loading platform roofs. Count/layout simplified from the visible screenshot.
for i in range(8):rect(926,847+i*22,150,10,-14)
# Observatory outlined compound and two telescope pads.
poly([(1030,350),(1180,348),(1190,405),(1230,407),(1230,452),(1010,450),(1010,405),(1030,405)],'#becbc8','#5c797f')
rect(1050,360,110,36);rect(1095,407,120,20)
for x,y,r in [(1125,270,23),(1175,210,19)]:
    d.ellipse([(int((x-r)*S),int((y+145-r)*S)),(int((x+r)*S),int((y+145+r)*S))],fill='#8dabad',outline='#3a5e66',width=4)
# Small named structures visible in zoom references: generalized footprints only.
rect(722,72,22,35);rect(685,320,15,20);rect(1210,610,26,16)
rect(730,1080,32,20);rect(735,1110,23,15)
rect(1020,1075,35,55,-32);rect(1020,1140,32,44,-32)
# Old-town cluster depicted only inside the observed southern area.
for x,y,w,h,a in [(835,1180,23,20,15),(864,1160,20,28,-10),(892,1185,18,20,10),(916,1210,24,18,-15)]:rect(x,y,w,h,a)
# Labels (German screenshot names); international UI exposes original names separately.
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def label(text,x,y,size=17,major=False):
    f=ImageFont.truetype(bold if major else font,size*S); box=d.textbbox((0,0),text,font=f);w=box[2];h=box[3]-box[1]; xx=x*S-w/2;yy=(y+145)*S
    d.rounded_rectangle((xx-7*S,yy-4*S,xx+w+7*S,yy+h+9*S),radius=3*S,fill='#263e46' if major else '#eaf0eb')
    d.text((xx,yy-box[1]),text,font=f,fill='#f2d8a0' if major else '#203c45')
for t,x,y in [('NÖRDLICHE GLEISE',790,190),('DORF ALMATERA',380,570),('FRACHTTERMINAL',932,810),('SÜDLICHER PASS',855,1260)]:label(t,x,y,23,True)
for t,x,y in [('Forscherunterkünfte',750,45),('Einsatzturm',656,290),('Weltraumteleskop',1130,300),('Cielo Sereno-Observatorium',1160,470),('Almatera-Station',620,370),('Bahnknotenpunkt',855,545),('Militärsupermarkt',680,740),('Wetterstation',1240,640),('Kontrollierte Empfangsanlage',1020,565),('Bahnhof',962,770),('Transittunnel',475,785),('Ladeplattformen',1135,945),('Raststätte',735,1050),('Umspannwerk',1110,1120),('Altstadt',873,1225),('Überfrorener Fluss',735,985)]:label(t,x,y)
# Non-geographic frame, no invented scale or north arrow.
d.rectangle((0,0,3072,125*S),fill='#203840')
d.text((45*S,25*S),'PENDOLA PASS',font=ImageFont.truetype(bold,36*S),fill='#f1d59f')
d.text((45*S,78*S),'RAMAS FIELD TOOL · EIGENE KARTENZEICHNUNG · ENTWURF',font=ImageFont.truetype(font,16*S),fill='#e1ebea')
d.rectangle((0,1440*S,3072,3072),fill='#203840')
d.text((40*S,1455*S),'SCHEMATISCH · Positionen angenähert · Keine bestätigten Spielmarker',font=ImageFont.truetype(font,19*S),fill='#e1ebea')
d.text((40*S,1490*S),'Referenz: vier Spielkarten-Screenshots · Randbereiche und Details unvollständig',font=ImageFont.truetype(font,16*S),fill='#f1d59f')
im.save(ROOT/'assets/maps/pendola-pass-rft-base.jpg',quality=94,subsampling=0)
