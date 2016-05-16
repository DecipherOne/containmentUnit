# This block is used to run casperjs scripts from a web interface.
import json, os, sys
import subprocess,time, requests as serverReq
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict
from containmentUnit.lib.base import BaseController, render
import containmentUnit.lib.proxyPortManager  as portManager
import codecs

#This sets up the system to use utf-8 encoding but also sets standard out to convert properly

class CasperjsController(BaseController):
    APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"
    scriptName ="performanceHarRepo.js "
    waitTime = "1000"
    jsonFile = "TestLinks8081.json"
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
            fIndex = int(portManager.serverPort) + portManager.indexCount + 1
            self.scriptOutputFile = self.scriptDirectory+"/output/scriptOutput"+str(fIndex)+".html"
        else:
            fIndex = int(self.defaultProxyPort)
            fIndex += 1
            self.scriptOutputFile = self.scriptDirectory+"/output/scriptOutput"+str(fIndex)+".html"
            
             
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
                if portManager.indexCount != None:
                    fIndex = int(portManager.serverPort) + portManager.indexCount + 1
                    self.jsonFile = "TestLinks"+str(fIndex)+".json"
                else:
                    fIndex = int(self.defaultProxyPort)
                    fIndex += 1
                    if fIndex < 1000:
                        fIndex = 8081
                    self.jsonFile = "TestLinks"+str(fIndex)+".json" 
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
        
        while count > 0:
        
            
            print "\n \t count is :"+ str(count)

            # We have all our values setup the cmdline cmd
            args = self.casperPath +"casperjs --proxy='http://localhost:"+str(self.myPort) +"' --ssl-protocol='any' --ignore-ssl-errors=true --disc-cache=false " + self.scriptDirectory + self.scriptName + self.scriptDirectory + "/output/"+ self.jsonFile + " " + self.waitTime + " " + self.testLabel + " " + self.myPort
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
                    return self.getScriptOutput(self.scriptOutputFile)
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
        return self.getScriptOutput(self.scriptOutputFile)
        

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
        fileStream = open(self.scriptDirectory+"/output/"+self.jsonFile,'w')
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
        portManager.assignProxyPort()    
        self.myPort = portManager.portMap['portNum'][portManager.indexCount-1]
        
        #startup client instance
        print " Starting new proxy client instance. \n"
        print " In startProxy myPort set to : " + self.myPort
        self.myProxy = self.proxyServer.create_proxy({'httpsProxy':'localhost:'+self.myPort})
        
        #Setting Proxy Read Timeout to inifinite
        payload = {'readTimeout':0,'requestTimeout':-1}
        proxyServerPort = 'http://localhost:'+ str(self.defaultProxyPort)
        serverReq.put('%s/proxy/%s/timeout' % (proxyServerPort, self.myPort), payload)
        portManager.lock.release()
        
    def stopProxy(self):
        
        portManager.lock.acquire()
        self.scriptOutput += "<div>Reached end of script, closing proxy.</div></br>"
        self.myProxy.close()
        portManager.removePortMapEntry(self.myPort)
        
        print " # Getting Ready for shut down proxy eval #"
        
        numOpenPorts = len(portManager.portMap['portNum'])
        
        if numOpenPorts == 0: 
            self.scriptOutput += "<div>All proxy clients closed, stopping proxy server.</div></br>"
            portManager.proxyServer.stop()
            portManager.serverIsRunning = False
            portManager.proxyIsInit = False
        
        portManager.lock.release()
        
    def createHar(self):
         
         portManager.lock.acquire()
         self.myPort = request.params['port']
         payload = {'captureHeaders':True,'captureContent':False,'initialPageRef':request.params['label']}
         proxyServerPort = 'http://localhost:'+ str(portManager.serverPort)
         print " In create Har proxy Server port is : " + proxyServerPort
         print " myPort is : " + str(self.myPort)
         r = serverReq.put('%s/proxy/%s/har' % (proxyServerPort, self.myPort), payload)
         try:
            print "Create Har Response : " + str(r.status_code) + " " + str(r.text)
         except:
            statusCode = str(r.status_code)
            statusText = unicode(r.text)
            print "Create Har Response : " + statusCode.encode("utf-8","replace") + " " + statusText.encode("utf-8","replace")
         portManager.lock.release()
         
    @restrict("GET")     
    def getHar(self):
        """
        Gets the HAR that has been recorded
        """
        
        portManager.lock.acquire()
        self.myPort = request.params['port']
        proxyServerPort = 'http://localhost:'+ str(portManager.serverPort)
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
        
    def getScriptOutput(self,outPutFile):
        
        portManager.lock.acquire()
        filestream = open(outPutFile,'r')
        output = filestream.read()
        filestream.close()
        
        print "Getting Script output, portmanager index at : " + str(portManager.indexCount)
        if portManager.indexCount == 0:
            print " Attempting to delete intermediarey files."
            #delete the intermediary files
            dirPath = self.scriptDirectory+"/output/"
            fileList = os.listdir(dirPath)
            for fileName in fileList:
                pathPlFile = dirPath+"/"+fileName
                if os.path.exists(pathPlFile):
                    os.remove(pathPlFile)
                
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
            
        proxyServerPort = 'http://localhost:'+ str(portManager.serverPort)
        serverReq.put('%s/proxy/%s/limit' % (proxyServerPort, self.myPort), payload)
        portManager.lock.release()
    
    #Documentation Specific Stuff
    @restrict("GET")
    def about(self):
        return render('/home/about.html')
    
    @restrict("GET")
    def manaul(self):
        return render('/home/manual.html')