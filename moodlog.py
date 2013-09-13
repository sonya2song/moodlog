import webapp2
from jinja2 import Environment,FileSystemLoader
from models import Entry
from google.appengine.api import users
from google.appengine.ext import ndb

jenv=Environment(loader=FileSystemLoader("templates"))

class MainPage(webapp2.RequestHandler):
  
  def get(self):
    f=open("index.html")
    self.response.headers['Content-type']="text/html ;charset=utf-8"
    self.response.write(f.read())

class Entries(webapp2.RequestHandler):
  '''getting and creating entries'''  
  def get(self):
    f=open("data/data_sorted.json")
    self.response.headers['Content-type']="application/json"
    self.response.write(f.read())
    f.close()

  def post(self):
    note=self.request.get('note')
    score=self.request.get('score')

application= webapp2.WSGIApplication([
  ('/',MainPage),
  ('/api/1/entries',Entries),
  ],debug=True)
