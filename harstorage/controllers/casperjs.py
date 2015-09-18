# This block is used to run casperjs scripts from a web interface.
import json

import subprocess
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict


from harstorage.lib.base import BaseController, render

        


#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class CasperjsController(BaseController):
    # default script to run
    APP_ROOT = "C:/Python27/Lib/site-packages/harstorage-1.0-py2.7.egg/harstorage"     
    scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"
    scriptName ="performanceHarRepo.js "
    waitTime = "100"
    jsonFile = "HighResLinks.json"
    timesToExe = '3'
    scriptOutput = ""
    
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
            scriptName ="performanceHarRepo.js "
            
        if reqParams['urls'] != None:
            self.writeUrlsToFile(reqParams)
            self.jsonFile = "HighResLinks.json"
                
        if reqParams['waitTime'] != None:
            waitTime = reqParams['waitTime']
            
        if reqParams['timesToExe'] != None:
            timesToExe = reqParams['timesToExe']
        
        # We have all our values setup the cmdline cmd
        args ="casperjs " + self.scriptDirectory + self.scriptName + self.scriptDirectory + self.jsonFile + " " + self.waitTime + " " + timesToExe;
    
        myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
        stdout_value, stderr_value = myProc.communicate('through stdin to stdout\n')
        self.scriptOutput = repr(stdout_value)
        self.scriptErrors = stderr_value
        print '\n\t Script output:', repr(self.scriptOutput)
        print '\n\t stderr value   :', repr(self.scriptErrors)
        
        return self.scriptOutput


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
        
    
        
        
        
        