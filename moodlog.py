import webapp2
from models import Entry

class MainPage(webapp2.RequestHandler):
  
  def get(self):
    f=open("index.html")
    self.response.headers['Content-type']="text/html ;charset=utf-8"
    self.response.write(f.read())

application= webapp2.WSGIApplication([
  ('/',MainPage),
  ],debug=True)
