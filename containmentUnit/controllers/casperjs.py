# This block is used to run casperjs scripts from a web interface.
import json, os, sys
import subprocess,time, requests as serverReq
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict
from containmentUnit.lib.base import BaseController, render
import containmentUnit.lib.proxyPortManager  as portManager
import threading

class CasperjsController(BaseController):
    APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"
    scriptName ="performanceHarRepo.js "
    waitTime = "1000"
    jsonFile = "TestLinks.json"
    timesToExe = '3'
    scriptOutput = "::::::::::::::::::::::::::::::::::::::::::"
    proxyServer = None
    myProxy = None
    url = None
    testLabel = '-defaultLabel-'
    throttleSpeed = None
    casperPath = "c:/casperjs/bin/"
    bmpPath = "c:/browsermob-proxy-2.0.0/bin/browsermob-proxy.bat"
    defaultProxyPort = "8080"
    __instance = None
    proxyRunning= False
    myPort = 0
    scriptOutputFile = None 
    
    
        
    def __before__(self):
        """Define version of static content"""
        c.rev = config["app_conf"]["static_version"]
        
        #Get the Paths to our thirdparty executables
        fileStream = open(self.APP_ROOT + "/config/thirdPartyPaths.json",'r')
        outPut = fileStream.read()
        fileStream.close()
        fileStream = json.loads(outPut)
        
        if fileStream['casperjs'] !=  None:
            self.casperPath = fileStream['casperjs']
            
        if fileStream['browser-mob-proxy'] !=  None:
            self.bmpPath = fileStream['browser-mob-proxy']
        
        if fileStream['defaultProxyPort'] != None:
            self.defaultProxyPort = fileStream['defaultProxyPort']
        
        if portManager.indexCount != None:
            self.scriptOutputFile = self.scriptDirectory+"scriptOutput"+str(portManager.indexCount)+".html"
        else:
            self.scriptOutputFile = self.scriptDirectory+"scriptOutput0.html"
            
             
    @restrict("POST")
    def exeScript(self):
        
        
        reqParams = json.loads(request.body)
        
        #setup which script to run
        if reqParams['script']== None or reqParams['timesToExe'] == None :
            return render("/error.html")
        
        #har script
        if reqParams['script']=='1':
            self.scriptName ="performanceHarRepo.js "
            
            if reqParams['urls'] != None:
                self.jsonFile = "TestLinks" + str(portManager.indexCount)+".json"
                self._writeUrlsToFile(reqParams)
            else:
                self.scriptOutput = "<div> Please Enter in Urls to Test </div></br>"
                return self.scriptOutput
        
        if reqParams['waitTime'] != None:
            self.waitTime = reqParams['waitTime']
            
        if reqParams['timesToExe'] != None:
            self.timesToExe = reqParams['timesToExe']
            
        if reqParams['testLabel'] != None:
            self.testLabel = reqParams['testLabel'] 
            
        if reqParams['throttleSpeed'] != None:
            self.throttleSpeed = reqParams['throttleSpeed']
            
        count = int(self.timesToExe)
        self.startProxy()
        
        if self.throttleSpeed != None:
            self.setNetworkSpeed(self.throttleSpeed)
        
        while count>0:
        
            time.sleep(1)
            
            print "\n \t count is :"+ str(count)

            # We have all our values setup the cmdline cmd
            args = self.casperPath +"casperjs --proxy='http://localhost:"+str(self.myPort) +"' --ssl-protocol='any' --ignore-ssl-errors=true --disc-cache=false " + self.scriptDirectory + self.scriptName + self.scriptDirectory + self.jsonFile + " " + self.waitTime + " " + self.testLabel

            print " Here are the altered args : " + args
            myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
            
            try:
                stdout_value, stderr_value = myProc.communicate()
                self.scriptOutput = repr(stdout_value)
                self.scriptErrors = stderr_value
            except:
                print "\n\t Error : could not get script Output. Trying again"
                myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
                try:
                    stdout_value, stderr_value = myProc.communicate()
                    self.scriptOutput = repr(stdout_value)
                    self.scriptErrors = stderr_value
                except:
                    print "\n\t Error: second attempt failed, program will quit."
                    self.stopProxy()
            
            if count== int(self.timesToExe):    
                self._writeOutput(self.scriptOutput)
            else:
                self._appendOutput(self.scriptOutput)

            count -= 1
        
        self.stopProxy()
        print '\n\t Script output:', repr(self.scriptOutput) , '</br>'
        print '\n\t stderr value   :', repr(self.scriptErrors), '</br>'
        
        
        

    @restrict("GET")
    def getAvailableScripts(self):
        #scan the script directory 
        #accumulate all the file names
        #return json array
        return "availableScripts"
    
    @restrict("GET")
    def harJsonFiles(self):
        return render('/home/casperForms/crtHarPerfForm.html')
    
    def _writeUrlsToFile(self,reqParams):
        
        portManager.lock.acquire()
        fileStream = open(self.scriptDirectory+self.jsonFile,'w')
        writeUrls = '{"links":[' + reqParams['urls'] + ']}'
        fileStream.write(writeUrls)
        fileStream.close()
        portManager.lock.release()
        
        
    def startProxy(self):
        
        portManager.lock.acquire()
        myPath = self.bmpPath
            
        #initialize settings for portManager
        if not portManager.proxyIsInit:
            portManager.init(self.defaultProxyPort,myPath)
        
        self.proxyServer = portManager.proxyServer
            
        self.myPort = portManager.getProxyPort()
        portManager.addPortMapEntry(id(self),self.myPort)
        
        #startup client instance
        print " Starting new proxy client instance. \n"
        print " In startProxy myPort set to : " + str(self.myPort)
        self.myProxy = self.proxyServer.create_proxy({'httpsProxy':'localhost:'+str(self.myPort)})
        portManager.incrementPort()
        
        #Setting Proxy Read Timeout to inifinite
        payload = {'readTimeout':0,'requestTimeout':-1}
        proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
        serverReq.put('%s/proxy/%s/timeout' % (proxyServerPort, self.myPort), payload)
        portManager.lock.release()
        
    def stopProxy(self):
        
        portManager.lock.acquire()
        self.scriptOutput += "<div>Reached end of script, closing proxy.</div></br>"
        self.myProxy.close()
        portManager.decrementPort()
        portManager.removePortMapEntry(id(self))
        
        print " Getting Ready for shut down proxy eval"
        print " Current Port : " + str(portManager.getProxyPort())
        print " default Port : " + str(self.defaultProxyPort)
        
        if portManager.getProxyPort() == int(self.defaultProxyPort)+1: 
            self.scriptOutput += "<div>All proxy clients closed, stopping proxy server.</div></br>"
            portManager.proxyServer.stop()
            portManager.serverIsRunning = False
            portManager.proxyIsInit = False
        
        portManager.lock.release()
        
    def createHar(self):
         
         portManager.lock.acquire()
         self.resolveProxyPort()
         payload = {'captureHeaders':True,'captureContent':False,'initialPageRef':request.params['label']}
         proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
         print " In create Har proxy Server port is : " + proxyServerPort
         print " myPort is : " + str(self.myPort)
         r = serverReq.put('%s/proxy/%s/har' % (proxyServerPort, self.myPort), payload)
         print "Create Har Response : " + str(r.status_code) + " " + str(r.text)
         portManager.lock.release()
         
    @restrict("GET")     
    def getHar(self):
        """
        Gets the HAR that has been recorded
        """
        
        portManager.lock.acquire()
        self.resolveProxyPort()
        proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
        r = serverReq.get('%s/proxy/%s/har' % (proxyServerPort, self.myPort))
        
        if r.status_code==200:
            harFile = r.text
            harFile = {"file":harFile}
            customHeaders = {"Content-type": "application/x-www-form-urlencoded",'Automated':'true'}
            #upload our new file to harStorage
            url = '%s/results/upload' % ('http://localhost:5000')
            r=serverReq.post(url,data=harFile,headers=customHeaders)
            portManager.lock.release()
            
        else:
            portManager.lock.release()
            return r  
    
    def _writeOutput(self,data):
        
        portManager.lock.acquire()
        fileStream = open(self.scriptOutputFile,'w')
        fileStream.write(data)
        fileStream.close()
        portManager.lock.release()
        
    def _appendOutput(self,data):
        
        portManager.lock.acquire()
        fileStream = open(self.scriptOutputFile,'a')
        fileStream.write(data)
        fileStream.close()
        portManager.lock.release()
        
    @restrict("GET")    
    def getScriptOutput(self):
        
        portManager.lock.acquire()
        filestream = open(self.scriptOutputFile,'r')
        output = filestream.read()
        filestream.close()
        #delete the intermediary files
        os.remove(self.scriptDirectory+self.jsonFile)
        os.remove(self.scriptOutputFile)
        portManager.lock.release()
        return output
    
    def setNetworkSpeed(self,option):
        
        portManager.lock.acquire()
        if int(option)== 1:
          payload = {'sownstreamKbps':8389,'upstreamKbps':2097}
        elif int(option)== 2:
          payload = {'sownstreamKbps':2097,'upstreamKbps':600}
        elif int(option)== 3:
          payload = {'sownstreamKbps':500,'upstreamKbps':40}
        else:
            portManager.lock.release()
            return
            
        proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
        serverReq.put('%s/proxy/%s/limit' % (proxyServerPort, self.myPort), payload)
        portManager.lock.release()
        
    def getLastProxyPort(self):
        
        portManager.lock.acquire()
        proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
        r = serverReq.get('%s/proxy/' % (proxyServerPort))
        numOpenPorts = 0
        
        if r.status_code==200:
            response = json.loads(r.text)
            
            numOpenPorts = len(response['proxyList'])
            print "# Getting Last Proxy Port Open"
            print " number of currently open ports : " + str(numOpenPorts)
            
            for x in range(0,numOpenPorts):
                print " Port Number : " + str(response['proxyList'][x]['port']) + " is currently open."
                portManager.lock.release()
                return response['proxyList'][numOpenPorts-1]['port']  
        portManager.lock.release()        
        return 0
    
    def resolveProxyPort(self):
         
         portManager.lock.acquire()
        #Need to resolve the correct port with the instance
         
         if self.myPort == 0:
             
            numOfEntries = len(portManager.portMap['instanceId'])
            print "# Resolving Proxy Port #"
            print "Checking Number of Current Port Entries : " + str(numOfEntries)
            if numOfEntries > 1:
               for entry in range(0,numOfEntries):
                   #attempt to resolve the port with the instance
                  if portManager.portMap["instanceId"][entry] == id(self):
                      print "attempting to set port to : " + str(portManager.portMap["portNum"][entry])
                      self.myPort = portManager.portMap["portNum"][entry]
                  else:
                      #couldn't find instance to get last port created assign it and update portmanager
                      print " Could not find instance, assigning last created port."
                      self.myPort = self.getLastProxyPort()
                      portManager.updateInstanceIdForPort(id(self),self.myPort)

            else:
                self.myPort = portManager.portMap["portNum"][0]
                portManager.updateInstanceIdForPort(id(self),self.myPort)
         portManager.lock.release()       
         return self.myPort