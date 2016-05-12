# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

import threading
from browsermobproxy import Server
import sys 
import codecs
#This sets up the system to use utf-8 encoding but also sets standard out to convert properly
#reload(sys) 
#sys.setdefaultencoding('utf-8') 
#UTF8Writer = codecs.getwriter('utf8')
#sys.stdout = UTF8Writer(sys.stdout)

serverPort = 0
proxyIsInit = False
serverIsRunning = False
lock = threading.RLock()
portMap = dict()
proxyServer = None
indexCount = 0

def init(defaultPort,path):
    global lock
    global serverPort
    global proxyIsInit
    global serverIsRunning
    global proxyServer
    global indexCount
    
    lock.acquire()
    
    serverPort = int(defaultPort)
    proxyIsInit = True
    print "Initializing Proxy Manager - server port : set to : " + str(serverPort)
    
    #checks to see if the server has already started
    if not serverIsRunning:
        proxyServer = Server(path,{'port':int(serverPort)})
        proxyServer.start()
        serverIsRunning = True
        
    
    lock.release()


def incrementIndex():
    global indexCount
    global lock
    lock.acquire()
    indexCount +=1
    lock.release()

def decrementIndex():
    global indexCount
    global lock
    lock.acquire()
    indexCount -= 1
    lock.release()

def assignProxyPort():
    global portMap
    global lock
    global indexCount
    global serverPort
    global indexCount
    
    print " # Assigning Proxy Port # "
    
    clientPort = serverPort + 1
    assigned = False
    foundPort = False
    
    if indexCount != 0:
        numOpenPorts = len(portMap['portNum'])
    
        print "   -- Number of Open Ports : " + str(numOpenPorts)
        if numOpenPorts > 0:

            count = 1
            while not assigned:

                testPort = serverPort + count
                testPort = str(testPort)
                
                print "     -- Looking for test port : " + testPort

                for i in range(0,numOpenPorts):
                    if testPort == portMap['portNum'][i]:
                        foundPort = True
                        print "     -- test port : " + testPort + " already mapped."

                if foundPort:
                    foundPort = False

                else:
                    #we have an open port, go a head an assign it to he client
                    print " Didn't find the port, mapping client to port : " + testPort
                    clientPort = testPort
                    assigned = True
                    break


                count += 1
            
    addPortMapEntry(clientPort)

def addPortMapEntry(portNum):
    global portMap
    global lock
    global indexCount
    
    print " # Updating Port Map Entries #".encode("utf-8")
    print " Current Mappings : " + str(portMap)
    lock.acquire()
    if indexCount==0:
       portMap.update({"portNum":[str(portNum)]})
    else:
        portMap['portNum'].append(str(portNum))
        
    incrementIndex()
    
    print "Mappings after Update : " + str(portMap)
    lock.release()
    
    
def removePortMapEntry(portNum):
    global portMap
    global lock
    
    lock.acquire()
    numOfEntries = len(portMap["portNum"])
    
    for entry in range(0,numOfEntries):
        if portMap["portNum"][entry] == portNum :
            del portMap["portNum"][entry]
            decrementIndex()
            break
            
    lock.release()
    

