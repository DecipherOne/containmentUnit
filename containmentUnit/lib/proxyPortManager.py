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

def init(defaultPort,path):
    global lock
    global proxyPortIndex 
    global serverPort
    global proxyIsInit
    global serverIsRunning
    global proxyServer
    
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
    
    lock.release()


def incrementPort():
    
    global proxyPortIndex 
    global lock
    lock.acquire()
    
    proxyPortIndex += 1
    print "Incrementing proxy port to : " + str(proxyPortIndex)
    
    lock.release()

def decrementPort():
    global proxyPortIndex
    global lock
    
    lock.acquire()
    
    proxyPortIndex -= 1
    print "Decrementing proxy port to : " + str(proxyPortIndex)
    
    lock.release()

def getProxyPort():
    global proxyPortIndex 
    return proxyPortIndex

def addPortMapEntry(instanceId, portNum):
    global portMap
    global lock
    
    lock.acquire()
    portMap.update({"entries":[{"instanceId": str(instanceId),"portNum":str(portNum)}]})
    lock.release()
    
def updateInstanceIdForPort(instanceId,portNum):
    global portMap
    global lock
    
    lock.acquire()
    numOfEntries = len(portMap)
    
    for entry in range(0,numOfEntries):
        if portMap["entries"][entry]["portNum"] == portNum :
            portMap.portMap["entries"][entry]["instanceId"]=instanceId
            break
            
    lock.release()
    
  
def removePortMapEntry(instanceId):
    global portMap
    global lock
    
    lock.acquire()
    numOfEntries = len(portMap)
    
    for entry in range(0,numOfEntries):
        if portMap["entries"][entry]["instanceId"] == instanceId :
            del portMap["entries"][entry]
            break
            
    lock.release()
    

