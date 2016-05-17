import json, os, sys
import re, shutil
import subprocess,time, requests as serverReq
from pylons import request, response , tmpl_context as c
from pylons import config
from pylons.controllers.util import redirect
from pylons.decorators.rest import restrict
from browsermobproxy import Server
from time import strftime
from containmentUnit.lib.base import BaseController, render
import containmentUnit.lib.proxyPortManager  as portManager

#print "app root is: " + APP_ROOT;
#This opens a pipe to the standard cmd shell and sets input and output
class WraithController(BaseController):
    # default script to run
    APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) 
    scriptDirectory = APP_ROOT + "/public/Wraith/configs/"
    siteName = 'default'
    paths ='defaultPaths'
    scriptOutput = ""
    args=''
    reqParams=''
    protocol='https'
    rawPathData =''
    updatingRecord = False
    
    
    def __before__(self):
        """Define version of static content"""
        c.rev = config["app_conf"]["static_version"]
        
        
    def _updateRequestData(self,requirePaths):
        portManager.lock.acquire()
        self.reqParams = json.loads(request.body)
        
        if self.reqParams['siteName'] != None:
            self.siteName = self.reqParams['siteName']
            
        if requirePaths and self.reqParams['paths'] != None:
            self.paths = self.reqParams['paths']
            data = self.reqParams['paths']
            data = str(data).encode('utf-8')
            data = data.replace("u'","'")
            self.rawPathData = data
            self.paths = json.loads(data)
           
            
        if self.reqParams['protocol'] != "https":
            self.protocol = "http"
        portManager.lock.release()
            
        
    @restrict("POST")
    def generateSiteYaml(self):
        
        self._updateRequestData(True)
        
        portManager.lock.acquire()
        if self._addSiteToExisting() == False:
            return self.scriptOutput
        
        
        print "Generating Yaml File for : " + self.siteName;
        #hard code the browser to phantom for now
        yamlCache = "# Wraith Yaml Generated Automagically on : " + time.strftime("%m/%d/%Y") + " @ " + time.strftime("%H:%M:%S") + "\n"
        yamlCache +="# SiteName :" + self.siteName + "\n"
        yamlCache += 'browser: "phantomjs" \n'
        yamlCache += 'domains: \n'
        #must convert . to _ for domain otherwise gallery will not be built successfully
        tempName = self.siteName
        tempName = tempName.replace('.','_') 
        yamlCache += ' ' + tempName+': ' + self.protocol +'://'+ self.siteName + '\n'
        #loop through and get the label and url for each path
        yamlCache += 'paths: \n'
        
        if self.updatingRecord :
            #we need to read the paths from the file
            self.paths = self._getScriptOutput('/pathData/'+self.siteName+'_paths.json')
            self.paths = json.loads(self.paths)
            
        pathSize = len(self.paths['paths'] )
        count = 0
        while count < pathSize:
            yamlCache += " " + self.paths['paths'][count]['label'] + ": /" + self.paths['paths'][count]['url'] + "\n"
            count+=1
    
        #TODO: figure out why this call isn't working on fresh installs
        #yamlCache += "\nbefore_capture: '" +self.scriptDirectory+ "../javascript/wait--phantom.js'\n"  
        #set viewport widths to test
        yamlCache += '\nscreen_widths: \n'
        yamlCache += " - 320 \n" + " - 667 \n" + " - 768 \n" + " - 1024 \n" + " - 1280 \n" + " - 1920 \n \n"
        yamlCache += "resize_or_reload: 'reload' \n"
        
        #setup directory for site specific images
        yamlCache += "history_dir: screenCaptures/" + self.siteName + "_base_shots \n"
        yamlCache += "directory: screenCaptures/" + self.siteName + "_latest_shots \n"
        
        yamlCache +="fuzz: '20%' \n"
        yamlCache +="theshold: 5 \n"
        
        yamlCache +="\ngallery: \n"
        yamlCache +=" template: 'slideshow_template' \n"
        yamlCache +=" thumb_width: 250 \n"
        yamlCache +=" thumb_height: 250 \n"
        
        yamlCache +="\nmode: diffs_only \n"
        yamlCache +="verbose: false \n"
        yamlCache +="highligt_color: purple \n"
        yamlCache +="phantomjs_options: '--ignore-ssl-errors=true --ssl-protocol=tlsv1'"
        
        self._writeOutput(yamlCache,self.siteName+'_History.yaml')
        print "Yaml file successfully created :)"
        
        portManager.lock.release()
        
        if self.updatingRecord == False :
            return self.generateBaseTestImages()
        else:
            self.scriptOutput += "Yaml file successfully modified :)"
            return self.scriptOutput 
        
        
    def updateSitePaths(self):
       
        portManager.lock.acquire()
        self.reqParams = json.loads(request.body)
        self.siteName = self.reqParams['siteName']
        selfSiteName = self.siteName
        selfPaths = self.reqParams['paths']
        selfRemovePaths = self.reqParams['removePaths']
        selfPathMasterDict = json.loads(selfPaths)
        selfPathArray = selfPathMasterDict['paths']
        filePath = "pathData/" + selfSiteName + "_paths.json"
        fileStream = self._getScriptOutput(filePath)
        selfPathName = None
        self.updatingRecord = True
        
        print "Updating Path Records for : " + selfSiteName
        
        if selfRemovePaths == "True" or selfRemovePaths == True:
        #Removes Selected Paths
            if fileStream != "":
                pathDict = json.loads(fileStream)
                pathArray = pathDict['paths']
                newPathDict = json.loads(fileStream)
                newPathArray = newPathDict['paths']
                

                #Iterates for each path selected
                for x in range(0, len(selfPathArray)):
                    selfPathDict = selfPathArray[x]
                    selfPathName = selfPathDict['url']
                
                    #Iterates for each path in file
                    for i in range(0, len(pathArray)):
                        urlDict = pathArray[i]
                        #Looks for a match between selected path and path in file and removes it
                        if urlDict['url'] == selfPathName:
                            newPathArray.remove(pathArray[i])
                            self.scriptOutput += "Path : " + selfPathName + "<span style='font-color:red;'> Deleted</span></br>"

                #Rewrites all paths to file based on newPathArray
                self._writeOutput('{"paths":[', filePath)
                for y in range(0, len(newPathArray)):
                    self._appendOutput(json.dumps(newPathArray[y]), filePath)
                    if y < (len(newPathArray) - 1):
                        self._appendOutput(',', filePath)
                self._appendOutput(']}', filePath)
                portManager.lock.release()
                return self.generateSiteYaml()
            else:
                #Should only occur in error. You can't select an existing path if the file is empty
                self.scriptOutput += "File is empty, path not found."
                portManager.lock.release()
                return self.generateSiteYaml()
            portManager.lock.release()
            return self.scriptOutput
        
        else:
        #Adds Entered Paths
            if fileStream != "":
            #Adds Paths to file already containing at least one path
                pathDict = json.loads(fileStream)
                pathArray = pathDict['paths']
                newPathArray = []

                #Adds all existing paths to the array that will be used to repopulate the file
                for i in range(0, len(pathArray)):
                    newPathArray.append(pathArray[i])

                #Iterates through each path to be added
                for x in range(0, len(selfPathArray)):
                    selfPathDict = selfPathArray[x]
                    selfPathName = selfPathDict['url']
                    duplicatePath = False

                    #Iterates for each path in file
                    for r in range(0, len(pathArray)):
                        urlDict = pathArray[r]
                        #Looks for a match between selected path and path in file and flags it
                        if urlDict['url'] == selfPathName:
                            self.scriptOutput += selfPathName + " already exists.</br>"
                            duplicatePath = True

                    #If not matching, adds new path to the array that will be used to repopulate the file
                    if duplicatePath == False:
                        newPathArray.append(selfPathArray[x])
                        self.scriptOutput += "Path : " + selfPathName + " added successfully</br>"
                    
                #Rewrites all paths to file based on newPathArray
                self._writeOutput('{"paths":[', filePath)
                for y in range(0, len(newPathArray)):
                    self._appendOutput(json.dumps(newPathArray[y]), filePath)
                    if y < (len(newPathArray) - 1):
                        self._appendOutput(',', filePath)
                self._appendOutput(']}', filePath)
                portManager.lock.release()
                return self.generateSiteYaml()
            else:
            #Adds Paths to file that is empty
                #Writes all paths to file based on entered paths
                self._writeOutput('{"paths":[', filePath)
                for y in range(0, len(selfPathArray)):
                    self._appendOutput(json.dumps(selfPathArray[y]), filePath)
                    if y < (len(selfPathArray) - 1):
                        self._appendOutput(',', filePath)
                self._appendOutput(']}', filePath)

                self.scriptOutput += "Path : " + selfPathName + " added successfully</br>"
                portManager.lock.release()
                return self.generateSiteYaml()
            portManager.lock.release()
            return self.scriptOutput
        
        
    def generateBaseTestImages(self):
        print "Generating Base Images for : " + self.siteName
        
        self._updateRequestData(False)
         # We have all our values setup the cmdline cmd
        args ="wraith history " + self.scriptDirectory + self.siteName+"_History.yaml"

        myProc = subprocess.Popen(args,shell=True,cwd=self.scriptDirectory,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);

        try:
            stdout_value, stderr_value = myProc.communicate()
            self.scriptOutput = repr(stdout_value)
            self.scriptErrors = stderr_value
        except:
            print "\n\t Error : could not get script Output. Trying again"
            myProc = subprocess.Popen(args,shell=True,cwd=self.scriptDirectory,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
            try:
                stdout_value, stderr_value = myProc.communicate()
                self.scriptOutput = repr(stdout_value)
                self.scriptErrors = stderr_value
            except:
                print "\n\t Error: second attempt failed, program will quit."
                

        self._writeOutput(self.scriptOutput,'logs/'+self.siteName+'_GenBaseImageOutput.log')
        

        print '\n\t Script output:', repr(self.scriptOutput) , '</br>'
        print '\n\t stderr value   :', repr(self.scriptErrors), '</br>'
        
    def getLatestTestImages(self):
    
        self._updateRequestData(False)
        
        print "Getting the Latest Images for Comparison for : " + self.siteName
        
         # We have all our values setup the cmdline cmd
        args ="wraith latest " + self.scriptDirectory + self.siteName+"_History.yaml"

        myProc = subprocess.Popen(args,shell=True,cwd=self.scriptDirectory,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);

        try:
            stdout_value, stderr_value = myProc.communicate()
            self.scriptOutput = repr(stdout_value)
            self.scriptErrors = stderr_value
        except:
            print "\n\t Error : could not get script Output. Trying again"
            myProc = subprocess.Popen(args,shell=True,cwd=self.scriptDirectory,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
            try:
                stdout_value, stderr_value = myProc.communicate()
                self.scriptOutput = repr(stdout_value)
                self.scriptErrors = stderr_value
            except:
                print "\n\t Error: second attempt failed, program will quit."
                

        self._addSiteToGalleryIndex()
        self._writeOutput(self.scriptOutput,'logs/'+self.siteName+'_GetLatestImageOutput.log')
        

        print '\n\t Script output:', repr(self.scriptOutput) , '</br>'
        print '\n\t stderr value   :', repr(self.scriptErrors), '</br>'
        
    @restrict("PUT")
    def removeExistingSite(self):
        #Delete log files
        portManager.lock.acquire()
        self.siteName = request.params['siteName']
        
        latestLog = self.scriptDirectory+'logs/' + self.siteName +'_GetLatestImageOutput.log' 
        baseLog = self.scriptDirectory+'logs/' + self.siteName +'_GenBaseImageOutput.log'
        baseDirectory = self.scriptDirectory + "screenCaptures/" + self.siteName + "_base_shots"
        latestDirectory = self.scriptDirectory + "screenCaptures/" + self.siteName + "_latest_shots"
        pathsFile = self.scriptDirectory+'pathData/' + self.siteName +'_paths.json'
        historyFile = self.scriptDirectory + self.siteName +'_History.yaml'
        
        if os.path.isfile(latestLog):
            os.remove(latestLog)
        if os.path.isfile(baseLog):
            os.remove(baseLog)
        
        #Delete Images and Folders
        if os.path.exists(baseDirectory):
            shutil.rmtree(baseDirectory)
            
        if os.path.exists(latestDirectory):
            shutil.rmtree(latestDirectory)
        
        #Delete Path Files
        if os.path.isfile(pathsFile):
            os.remove(pathsFile)
        
        #Delete yaml
        if os.path.isfile(historyFile):
            os.remove(historyFile)
        
        #remove site from existingSites.config
        f = open(self.scriptDirectory + "existingSites.config","r+")
        d = f.readlines()
        f.seek(0)
        
        for i in d:
            if i != self.siteName+'\n':
                f.write(i)
                
        f.truncate()
        f.close()
        
        #remove site From Gallery Index
        f = open(self.scriptDirectory + "wraithGalleryIndex.html","r+")
        d = f.readlines()
        f.seek(0)
        search = '<span class="wcSite"><label>Site : </label>'+self.siteName+'</span>'
        for i in d:
            if not re.search(search,i):
                f.write(i)
                
        f.truncate()
        f.close()
        portManager.lock.release()
        return "Site : " + self.siteName + " has been removed from the system."
    
    
    def _writeOutput(self,data,filename):
        portManager.lock.acquire()
        fileStream = open(self.scriptDirectory+filename,'w')
        fileStream.write(data)
        fileStream.close()
        portManager.lock.release()
        
    def _appendOutput(self,data,filename):
        portManager.lock.acquire()
        fileStream = open(self.scriptDirectory+filename,'a')
        fileStream.write(data)
        fileStream.close()
        portManager.lock.release()
        
    def _getScriptOutput(self,filename):
       
        fileStream = open(self.scriptDirectory+filename,'r')
        output = fileStream.read()
        fileStream.close();
        
        return output
    
    @restrict("GET")
    def loadWraithForm(self):
        return render('/home/casperForms/wraithForm.html')
    
    @restrict("GET")
    def loadWraithGalleryIndex(self):
        return self._getScriptOutput('wraithGalleryIndex.html')
    
    @restrict("GET")
    def loadWraithGallery(self):
        return self._getScriptOutput('screenCaptures/'+request.params['siteName']+'_latest_shots/gallery.html')
    
    @restrict("GET")
    def getExistingSites(self):
        # Read existing site entries from log
        portManager.lock.acquire()
        fileStream = open(self.scriptDirectory+"existingSites.config",'r')
        temp = fileStream.read().splitlines()
        newtemp = ''
        count = 1
        for entry in temp:
            if count != len(temp):
                newtemp += '{"siteName": "' +entry +'"},'
            else:
                newtemp += '{"siteName": "' +entry +'"}'
            count += 1  
        temp = '{"sites":['+str(newtemp)+']}'
        portManager.lock.release()
        return json.dumps(temp)
        
    @restrict("GET")
    def getExistingSitePaths(self):
        # Read site paths from json file
        output = self._getScriptOutput('/pathData/'+request.params['siteName']+'_paths.json')
        return output
    
    def _addSiteToExisting(self):
        print "Adding site to existingSites.config "
        fileStream = self._getScriptOutput('existingSites.config')
        portManager.lock.acquire()
        foundSite = False
        if fileStream != None:
           
            with open(self.scriptDirectory+'existingSites.config') as f:
                print("stream is open")
                
                for line in f:
                    if self.siteName+'\n'==line:
                        foundSite = True
                        break
            
                        
            if foundSite:
                if self.updatingRecord :
                    print("Existing Record is being updated.")
                    portManager.lock.release()
                    return True
                else:
                    print("The Site Already Exists.")
                    self.scriptOutput += self.siteName + " already exists, please remove or update paths to edit."
                    portManager.lock.release()
                    return False
                    
            else:
                print("attempting to write output")
                self._appendOutput(self.siteName+'\n','existingSites.config')
                #preserve our paths to file so we can reference them from the web interface.
                self._writeOutput(self.rawPathData,"pathData/"+self.siteName+'_paths.json')
                self.scriptOutput += "Site : " + self.siteName + " added Successfully"
                portManager.lock.release()
                return True
        else:
            self._writeOutput(self.siteName+'\n','existingSites.config')
            #preserve our paths to file so we can reference them from the web interface.
            self._writeOutput(self.rawPathData,"pathData/"+self.siteName+'_paths.json')
            self.scriptOutput += "Site : " + self.siteName + " added Successfully"
            portManager.lock.release()
            return True
        portManager.lock.release()
        return False
    
    def _addSiteToGalleryIndex(self):
        print "# Adding site to wraithGalleryIndex.html #"
        
        timeStamp = strftime("%A %m/%d/%y @ %I:%M:%S %p") 
        
        myFile = self.scriptDirectory+'wraithGalleryIndex.html'
        link = '<a href="wraith/loadWraithGallery?siteName=' + self.siteName +'" target="_blank"><div class="wraithGalCard"><span class="wraithLogo"></span><span class="wcSite"><label>Site : </label>' + self.siteName + '</span><span class="wcLastUpdate">'+ timeStamp.encode('utf-8') +'</span></div></a>\n'
        foundSite = False
        portManager.lock.acquire()
        if os.path.isfile(self.scriptDirectory+'wraithGalleryIndex.html'):
            if os.stat(myFile).st_size > 0 :
                with open(myFile) as f:
                    print("# Opened wriathGalleryIndex #")
                    search = '<span class="wcSite"><label>Site : </label>'+self.siteName+'</span>'
                    for line in f:
                        
                        if re.search(search,line):
                            foundSite = True
                if foundSite:            
                    print("The Gallery Already Exists.")
                    self.scriptOutput += self.siteName + "'s gallery is already listed."
                    self.__updateGalleryIndex()
                    portManager.lock.release()
                    return

                else:
                    print("Adding site to gallery Index.")
                    self._appendOutput(link,'wraithGalleryIndex.html')
                    portManager.lock.release()
                    return
            else:
                print("Adding site to gallery Index.")
                self._writeOutput(link,'wraithGalleryIndex.html')
                portManager.lock.release()
                return
        else:
            print("# wriathGalleryIndex is empty adding site to file. #")
            self._writeOutput(link,'wraithGalleryIndex.html')
            portManager.lock.release()
            return
        
    def __updateGalleryIndex(self):
        timeStamp = strftime("%A %m/%d/%y @ %I:%M:%S %p") 
        link = '<a href="wraith/loadWraithGallery?siteName=' + self.siteName +'" target="_blank"><div class="wraithGalCard"><span class="wraithLogo"></span><span class="wcSite"><label>Site : </label>' + self.siteName + '</span><span class="wcLastUpdate">'+ timeStamp.encode('utf-8') +'</span></div></a>\n'
        portManager.lock.acquire()
        #update gallery index
        f = open(self.scriptDirectory + "wraithGalleryIndex.html","r+")
        d = f.readlines()
        f.seek(0)
        search = '<span class="wcSite"><label>Site : </label>'+self.siteName+'</span>'
        for i in d:
            if re.search(search,i):
                f.write(link)
            else:
                f.write(i)
                
        f.truncate()
        f.close()
        portManager.lock.release()
        
       
    
    @restrict("GET")
    def returnProcessOutput(self):
        #GenerateBaseImage Output
        output = "Arguments did not match logs.argument passed -> " + request.params['num']
        
        if request.params['num'] == "1":
            output = self._getScriptOutput('logs/'+request.params['siteName']+'_GenBaseImageOutput.log')
        #GetLatestTestImages Output    
        elif request.params['num'] == "2":
            output = self._getScriptOutput('logs/'+request.params['siteName']+'_GetLatestImageOutput.log')     
       
        return output
            
            
            