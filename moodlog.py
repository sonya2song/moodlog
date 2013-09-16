import webapp2
import json
import datetime
from jinja2 import Environment,FileSystemLoader
from models import Entry
from instancecache import InstanceCache
from google.appengine.api import users
from google.appengine.ext import ndb

jenv=Environment(loader=FileSystemLoader("templates"))
cache=InstanceCache()

class Visualisation(webapp2.RequestHandler):
  
  def get(self):
    user=users.get_current_user()
    if user:
      self.response.headers['Content-type']="text/html ;charset=utf-8"
      self.response.headers['Cache-Control']='public, max-age=7200'
      self.response.headers['Pragma'] = 'Public'
      p=cache.get("visualisation")
      if not p:
        t=jenv.get_template("visualisation.html")
        self.response.write(cache.set("visualisation",t.render(user=user,logouturl=users.create_logout_url("/"))))
      else:
        self.response.write(p)
    else: 
      self.redirect("/")

class MainPage(webapp2.RequestHandler):
  
  def get(self):
    user=users.get_current_user()
    if user:
      self.redirect("/log")
    else:
      p=cache.get("start")
      self.response.headers['Content-type']="text/html; charset=utf-8"
      self.response.headers['Cache-Control']='public, max-age=7200'
      self.response.headers['Pragma'] = 'Public'
      if not p:
        t=jenv.get_template("start.html")
        self.response.write(
          cache.set("start",
            t.render(loginlink=users.create_login_url(self.request.uri))))
      else:
        self.response.write(p)
     

class Entries(webapp2.RequestHandler):
  '''getting and creating entries'''  
  def get(self):
    user=users.get_current_user()
    self.response.headers['Content-type']="application/json"
    if user:
      p=ndb.Key("user-email",user.email())
      nw=datetime.datetime.now()
      oy=datetime.datetime(nw.year-1,nw.month+1,1,0,0)
      entries_query=Entry.query(Entry.time >=oy,ancestor=p)
      entries=entries_query.fetch()
      entries=[{"time":e.time.isoformat(), "note":e.note, "score":e.score} for e in
      entries]
      self.response.write(json.dumps(entries))
    else:
      self.response.write("""{status: "error", reason: "need to log
      in"}""")
      

  def post(self):
    user=users.get_current_user()
    self.response.headers['Content-type']="application/json"
    if user:
      p=ndb.Key("user-email",user.email())
      entry=Entry(parent=p)
      entry.author=user;
      entry.note=self.request.get('note')
      entry.score=float(self.request.get('score'))
      entry.put()
      self.response.write("""{"status": "success" }""")
    else:
      self.response.write("""{"status": "error", reason: "need to log
      in"}""")
      

class Input(webapp2.RequestHandler):
  def get(self):
    user=users.get_current_user()
    if user:
      self.response.headers['Content-type']="text/html ;charset=utf-8"
      self.response.headers['Cache-Control']='public, max-age=7200'
      self.response.headers['Pragma'] = 'Public'
      p=cache.get("input")
      if not p:
        t=jenv.get_template("input.html")
        self.response.write(
          cache.set("input",t.render(user=user,logouturl=users.create_logout_url("/"))))
      else:
        self.response.write(p)
    else:
      self.redirect("/")

application= webapp2.WSGIApplication([
  ('/',MainPage),
  ('/view',Visualisation),
  ('/log',Input),
  ('/api/1/entries',Entries),
  ],debug=True)
