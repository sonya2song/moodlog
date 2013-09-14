import webapp2
from jinja2 import Environment,FileSystemLoader
from models import Entry
from google.appengine.api import users
from google.appengine.ext import ndb

jenv=Environment(loader=FileSystemLoader("templates"))

class Visualisation(webapp2.RequestHandler):
  
  def get(self):
    user=users.get_current_user()
    if user:
      t=jenv.get_template("visualisation.html")
      self.response.headers['Content-type']="text/html ;charset=utf-8"
      self.response.write(t.render(user=user,logouturl=users.create_logout_url("/")))
    else: 
      self.redirect("/")

class MainPage(webapp2.RequestHandler):
  
  def get(self):
    user=users.get_current_user()
    if user:
      self.redirect("/log")
    else:
      t=jenv.get_template("start.html")
      self.response.headers['Content-type']="text/html; charset=utf-8"
      self.response.write(t.render(loginlink=users.create_login_url(self.request.uri)))

class Entries(webapp2.RequestHandler):
  '''getting and creating entries'''  
  def get(self):
    user=users.get_current_user()
    self.response.headers['Content-type']="application/json"
    if user:
      f=open("data/data_sorted.json")
      self.response.write(f.read())
      f.close()
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
      self.response.write("""{status: "success" }""")
    else:
      self.response.write("""{status: "error", reason: "need to log
      in"}""")
      

class Input(webapp2.RequestHandler):
  def get(self):
    user=users.get_current_user()
    if user:
      t=jenv.get_template("input.html")
      self.response.headers['Content-type']="text/html ;charset=utf-8"
      self.response.write(t.render(user=user,logouturl=users.create_logout_url("/")))
    else:
      self.redirect("/")

application= webapp2.WSGIApplication([
  ('/',MainPage),
  ('/view',Visualisation),
  ('/log',Input),
  ('/api/1/entries',Entries),
  ],debug=True)
