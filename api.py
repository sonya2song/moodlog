from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from protorpc import remote
from protorpc import messages
import datetime

from models import Entry

allowed_ids=["467877166527.apps.googleusercontent.com",endpoints.API_EXPLORER_CLIENT_ID]
class VoidMessage(messages.Message):
  pass

class EntryMessage(messages.Message):
  score=messages.FloatField(1,required=True)
  note=messages.StringField(2)
  time=messages.StringField(3)
  id=messages.IntegerField(4);

class EntryList(messages.Message):
  items=messages.MessageField(EntryMessage,1,repeated=True)


@endpoints.api(name="moodlog",version="v2",
  description="Api for Moodlog.co",allowed_client_ids=allowed_ids)
class MoodlogApi(remote.Service):
  
  @endpoints.method(EntryMessage,EntryMessage,name="entry.insert",path="entry",http_method="POST")
  def insert_entry(self,request):
    user=endpoints.get_current_user()
    if not user:
      raise endpoints.UnauthorizedException('Invalid token.')
    p=ndb.Key("user-email",user.email())
    entry=Entry(parent=p)
    entry.author=user
    entry.note=request.note
    entry.score=request.score
    entry.put()
    return request
  
  @endpoints.method(EntryMessage,VoidMessage,name="entry.delete",path="entry",http_method="Delete")
  def delete_entry(self,request):
    user=endpoints.get_current_user()
    if not user:
      raise endpoints.UnauthorizedException('Invalid token.')
    k=ndb.Key("user-email",user.email(),"Entry",request.id)
    k.delete()
    return VoidMessage()
  
  @endpoints.method(VoidMessage,EntryList,name="entries.list",path="entry",http_method="GET")
  def list_entries(self,void):
    user=endpoints.get_current_user()
    if not user:
      raise endpoints.UnauthorizedException('Invalid token.')
    p=ndb.Key("user-email",user.email())
    nw=datetime.datetime.now()
    oy=datetime.datetime(nw.year-1,nw.month+1,1,0,0)
    entries_query=Entry.query(Entry.time >=oy,ancestor=p)
    entries=entries_query.fetch()
    el=EntryList()
    el.items=[EntryMessage(note=e.note,score=e.score,time=e.time.isoformat(),
      id=e.key.id())
      for e in entries]
    return el


server=endpoints.api_server([MoodlogApi],restricted=False)
