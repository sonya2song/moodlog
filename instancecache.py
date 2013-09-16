
class InstanceCache():
  def __init__(self):
    self.data={}

  def get(self,key):
    return self.data.get(key,None)

  def set(self,key,value):
    self.data[key]=value
    return value
