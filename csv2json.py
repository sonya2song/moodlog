import csv
import json

f=open("data_sorted.csv")
r=csv.DictReader(f)
d=json.dumps([i for i in r])
f.close()
f=open("data_sorted.json","w")
f.write("draw(%s)"%d)
f.close()
