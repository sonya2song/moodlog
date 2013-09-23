import webapp2
import json
import datetime
from models import Entry

class MainPage(webapp2.RequestHandler):
  
  def get(self):
    self.redirect("http://moodlog.co")
     
  def head(self): 
    self.redirect("http://moodlog.co")
    
application= webapp2.WSGIApplication([
  ('/',MainPage),
  ],debug=True)
