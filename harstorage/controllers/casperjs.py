# This block is used to run casperjs scripts from a web interface.
import json

import subprocess,time, requests as serverReq
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict
from browsermobproxy import Server

from harstorage.lib.base import BaseController, render

        


#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class CasperjsController(BaseController):
    # default script to run
    APP_ROOT = "C:/Python27/Lib/site-packages/harstorage-1.0-py2.7.egg/harstorage"     
    scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"
    scriptName ="performanceHarRepo.js "
    waitTime = "1000"
    jsonFile = "HighResLinks.json"
    timesToExe = '3'
    scriptOutput = ""
    proxyServer = None
    myProxy = None
    url = None
    testLabel = '-defaultLabel-'
    
    
    def __before__(self):
        """Define version of static content"""

        c.rev = config["app_conf"]["static_version"]
    
    
    def exeScript(self):
        
        reqParams = json.loads(request.body)
        
        #setup which script to run
        if reqParams['script']== None or reqParams['timesToExe'] == None :
            return render("/error.html")
        
        #har script
        if reqParams['script']=='1':
            self.scriptName ="performanceHarRepo.js "
            
        if reqParams['urls'] != None:
            self.writeUrlsToFile(reqParams)
            self.jsonFile = "HighResLinks.json"
        else:
            self.scriptOutput = "<div> Please Enter in Urls to Test </div></br>"
            return self.scriptOutput
        
        if reqParams['waitTime'] != None:
            self.waitTime = reqParams['waitTime']
            
        if reqParams['timesToExe'] != None:
            self.timesToExe = reqParams['timesToExe']
            
        if reqParams['testLabel'] != None:
            self.testLabel = reqParams['testLabel'] 
        
        count = int(self.timesToExe)
        self.startProxy()
        
        while count>0:
        
            time.sleep(1)
            
            print "\n \t count is :"+ str(count)

            # We have all our values setup the cmdline cmd
            args ="casperjs --proxy='http://localhost:8081' --ssl-protocol='any' --ignore-ssl-errors=true --disc-cahce=false " + self.scriptDirectory + self.scriptName + self.scriptDirectory + self.jsonFile + " " + self.waitTime + " " + self.testLabel

            myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);

            stdout_value, stderr_value = myProc.communicate()
            self.scriptOutput = repr(stdout_value)
            self.scriptErrors = stderr_value
            
            if count== int(self.timesToExe):    
                self.writeOutput(self.scriptOutput)
            else:
                self.appendOutput(self.scriptOutput)
                
            print '\n\t Script output:', repr(self.scriptOutput) , '</br>'
            print '\n\t stderr value   :', repr(self.scriptErrors), '</br>'

            count= count-1
            
        
        
        self.stopProxy()


    def getAvailableScripts(self):
        #scan the script directory 
        #accumulate all the file names
        #return json array
        return "availableScripts"
    
    def harJsonFiles(self):
        return render('/home/casperForms/crtHarPerfForm.html')
    
    def writeUrlsToFile(self,reqParams):
        fileStream = open(self.scriptDirectory+self.jsonFile,'w')
        writeUrls = '{"links":[' + reqParams['urls'] + ']}'
        fileStream.write(writeUrls)
        fileStream.close()
        
        
    def startProxy(self):
        self.proxyServer = Server('C:/browsermob-proxy-2.0.0/bin/browsermob-proxy.bat',{'port':8080})
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
         serverReq.put('%s/proxy/%s/har' % ('http://localhost:8080', '8081'), payload)
         
        
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
            return   
    
    def writeOutput(self,data):
        fileStream = open(self.scriptDirectory+"scriptOutput.html",'w')
        fileStream.write(data)
        fileStream.close()
        
    def appendOutput(self,data):
        fileStream = open(self.scriptDirectory+"scriptOutput.html",'a')
        fileStream.write(data)
        fileStream.close()
        
    def getScriptOutput(self):
        filestream = open(self.scriptDirectory+"scriptOutput.html",'r')
        output = filestream.read()
        return output
        
    
        
        
        
        