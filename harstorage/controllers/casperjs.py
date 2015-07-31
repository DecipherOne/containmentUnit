# This block is used to run casperjs scripts from a web interface.
import os
import subprocess
from pylons import request, tmpl_context as c
from pylons import config
from webhelpers.html.builder import literal

from harstorage.lib.base import BaseController, render

        
APP_ROOT = "C:/Python27/Lib/site-packages/harstorage-1.0-py2.7.egg/harstorage"     
scriptDirectory = APP_ROOT + "/templates/home/CasperScripts/"

#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class CasperjsController(BaseController):
    
    # default script to run
    scriptName ="performanceHarRepo.js "
    waitTime = "100"
    jsonFile = "HighResLinks.json"
    timesToExe = '3'
    
    args ="casperjs " + scriptDirectory + scriptName + " " + scriptDirectory + jsonFile + " " + waitTime + " " + timesToExe;
    
    def exeScript(self,script,timeToWait,jsonFileName,timesToRun):
        
        
        
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
        