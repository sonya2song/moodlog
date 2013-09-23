from google.appengine.ext import ndb

class Entry(ndb.Model):
    """Models an individual Guestbook entry with author, content, and
    date."""
    author = ndb.UserProperty()
    note = ndb.TextProperty(indexed=False)
    score = ndb.FloatProperty(indexed=False)
    time = ndb.DateTimeProperty(auto_now_add=True)

