# This block is used to run casperjs scripts from a web interface.
import json, os, sys
import subprocess,time, requests as serverReq
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict
from browsermobproxy import Server
from containmentUnit.lib.base import BaseController, render

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
                self.jsonFile = "TestLinks.json"
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
            args = self.casperPath +"casperjs --proxy='http://localhost:8081' --ssl-protocol='any' --ignore-ssl-errors=true --disc-cache=false " + self.scriptDirectory + self.scriptName + self.scriptDirectory + self.jsonFile + " " + self.waitTime + " " + self.testLabel

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

            count= count-1
        
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
        fileStream = open(self.scriptDirectory+self.jsonFile,'w')
        writeUrls = '{"links":[' + reqParams['urls'] + ']}'
        fileStream.write(writeUrls)
        fileStream.close()
        
        
    def startProxy(self):
        myPath = self.bmpPath
        self.proxyServer = Server(myPath,{'port':8080})
        self.scriptOutput += "<div>Attempting to start Proxy</div></br>"
        self.proxyServer.start()
        self.myProxy = self.proxyServer.create_proxy({'httpsProxy':'localhost:8081'})
        #Setting Proxy Read Timeout to inifinite
        payload = {'readTimeout':0,'requestTimeout':-1}
        serverReq.put('%s/proxy/%s/timeout' % ('http://localhost:8080', '8081'), payload)
        
    def stopProxy(self):
        self.scriptOutput += "<div>Reached end of script, closing proxy.</div></br>"
        self.myProxy.close()
        self.proxyServer.stop()
        
    def createHar(self):
         payload = {'captureHeaders':True,'captureContent':False,'initialPageRef':request.params['label']}
         r = serverReq.put('%s/proxy/%s/har' % ('http://localhost:8080', '8081'), payload)
         print "Create Har Response : " + str(r.status_code) + " " + str(r.text)
         
    @restrict("GET")     
    def getHar(self):
        """
        Gets the HAR that has been recorded
        """
        r = serverReq.get('%s/proxy/%s/har' % ('http://localhost:8080', '8081'))
        
        if r.status_code==200:
            harFile = r.text
            harFile = {"file":harFile}
            customHeaders = {"Content-type": "application/x-www-form-urlencoded",'Automated':'true'}
            #upload our new file to harStorage
            url = '%s/results/upload' % ('http://localhost:5000')
            r=serverReq.post(url,data=harFile,headers=customHeaders)
            
        else:
            return r  
    
    def _writeOutput(self,data):
        fileStream = open(self.scriptDirectory+"scriptOutput.html",'w')
        fileStream.write(data)
        fileStream.close()
        
    def _appendOutput(self,data):
        fileStream = open(self.scriptDirectory+"scriptOutput.html",'a')
        fileStream.write(data)
        fileStream.close()
    @restrict("GET")    
    def getScriptOutput(self):
        filestream = open(self.scriptDirectory+"scriptOutput.html",'r')
        output = filestream.read()
        return output
    
    def setNetworkSpeed(self,option):
        
        if int(option)== 1:
          payload = {'sownstreamKbps':8389,'upstreamKbps':2097}
        elif int(option)== 2:
          payload = {'sownstreamKbps':2097,'upstreamKbps':600}
        elif int(option)== 3:
          payload = {'sownstreamKbps':500,'upstreamKbps':40}
        else:
            return
            

        serverReq.put('%s/proxy/%s/limit' % ('http://localhost:8080', '8081'), payload)