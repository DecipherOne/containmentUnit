# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import threading
from browsermobproxy import Server

serverPort = 0
proxyPortIndex = 0
proxyIsInit = False
serverIsRunning = False
lock = threading.RLock()
portMap = dict()
proxyServer = None
indexCount = None

def init(defaultPort,path):
    global lock
    global proxyPortIndex 
    global serverPort
    global proxyIsInit
    global serverIsRunning
    global proxyServer
    global indexCount
    
    lock.acquire()
    
    serverPort = int(defaultPort)
    proxyPortIndex = serverPort + 1
    proxyIsInit = True
    print "Initializing Proxy Manager - server port : set to : " + str(serverPort)
    print " proxyPortIndex set to : " + str(proxyPortIndex)
    
    #checks to see if the server has already started
    if not serverIsRunning:
        proxyServer = Server(path,{'port':int(serverPort)})
        proxyServer.start()
        serverIsRunning = True
        indexCount = 0
    
    lock.release()


def incrementPort():
    
    global proxyPortIndex 
    global indexCount
    global lock
    lock.acquire()
    
    proxyPortIndex += 1
    indexCount +=1
    print "Incrementing proxy port to : " + str(proxyPortIndex)
    
    lock.release()

def decrementPort():
    global proxyPortIndex
    global indexCount
    global lock
    
    lock.acquire()
    
    proxyPortIndex -= 1
    indexCount -= 1
    print "Decrementing proxy port to : " + str(proxyPortIndex)
    
    lock.release()

def getProxyPort():
    global proxyPortIndex 
    return proxyPortIndex

def addPortMapEntry(instanceId, portNum):
    global portMap
    global lock
    global indexCount
    
    print " # Updating Port Map Entries #"
    print " Current Mappings : " + str(portMap)
    lock.acquire()
    if indexCount==0:
       portMap.update({"instanceId": [str(instanceId)],"portNum":[str(portNum)]})
    else:
        portMap['instanceId'].append(str(instanceId))
        portMap['portNum'].append(str(portNum))
    lock.release()
    print "Mappings after Update : " + str(portMap)
    
def updateInstanceIdForPort(instanceId,portNum):
    global portMap
    global lock
    
    lock.acquire()
    numOfEntries = len(portMap["instanceId"])
    
    for entry in range(0,numOfEntries):
        if portMap["portNum"][entry] == portNum :
            portMap["instanceId"][entry]=instanceId
            break
            
    lock.release()
    
  
def removePortMapEntry(instanceId):
    global portMap
    global lock
    
    lock.acquire()
    numOfEntries = len(portMap)
    
    for entry in range(0,numOfEntries):
        if portMap["instanceId"][entry] == instanceId :
            del portMap["instanceId"][entry]
            del portMap["portNum"][entry]
            break
            
    lock.release()
    

