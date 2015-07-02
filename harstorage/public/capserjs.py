# This block is used to run casperjs scripts from a web interface.
import os
import subprocess
        
APP_ROOT = "C:\Python27\Lib\site-packages\harstorage-1.0-py2.7.egg\harstorage"     
scriptDirectory = APP_ROOT + "\\templates\\home\\CasperScripts\\"
args ="casperjs " + scriptDirectory + "performanceHarRepo.js " + scriptDirectory + "HighResLinks.json 100 3";
#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class CapserjsController():
    
    def exe(self):
        myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
        stdout_value, stderr_value = myProc.communicate('through stdin to stdout\n')
        print '\n\tcombined output:', repr(stdout_value)
        print '\n\tstderr value   :', repr(stderr_value)