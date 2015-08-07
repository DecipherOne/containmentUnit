# This block is used to run casperjs scripts from a web interface.
import json

import subprocess
from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict


from harstorage.lib.base import BaseController, render

        
APP_ROOT = "C:/Python27/Lib/site-packages/harstorage-1.0-py2.7.egg/harstorage"     
scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"

#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class CasperjsController(BaseController):
    
    def __before__(self):
        """Define version of static content"""

        c.rev = config["app_conf"]["static_version"]
    
    # default script to run
    scriptName ="performanceHarRepo.js "
    waitTime = "100"
    jsonFile = "HighResLinks.json"
    timesToExe = '3'
    
   
    
    def exeScript(self):
        
        reqParams = json.loads(request.body)
        
        #setup which script to run
        if reqParams['script']== None or reqParams['timesToExe'] == None :
            return render("/error.html")
        
        #har script
        if reqParams['script']=='1':
            scriptName ="performanceHarRepo.js "
        # if(reqParams['jsonFile'] == 1:
            jsonFile = "HighResLinks.json"
                
        if reqParams['waitTime'] != None:
            waitTime = reqParams['waitTime']
            
        if reqParams['timesToExe'] != None:
            timesToExe = reqParams['timesToExe']
        
        # We have all our values setup the cmdline cmd
        args ="casperjs " + scriptDirectory + scriptName + " " + scriptDirectory + jsonFile + " " + waitTime + " " + timesToExe;
        
        
        myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
        stdout_value, stderr_value = myProc.communicate('through stdin to stdout\n')
        scriptOutput = stdout_value
        scriptErrors = stderr_value
        print '\n\t combined output:', repr(stdout_value)
        print '\n\t stderr value   :', repr(stderr_value)
# need to return this to the output section of the calling page. scriptOutput + scriptErrors


    def getAvailableScripts(self):
        #scan the script directory 
        #accumulate all the file names
        #return json array
        return "availableScripts"
    
    def harJsonFiles(self):
        return render('/home/casperForms/crtHarPerfForm.html')
        