The folders in this directory are specific modifications used to support formatting and or alterations necessary for the project to run for our use cases.

bmpExtract - These files are modified versions of browsermob-proxy0.7.1py27.egg files. These are modified so that the server can be correctly shut down from windows. 
Simply open the egg file in the location for your system usually pythonroot/libs/site-packages or in the .egg folder in this project , then replace the files in the egg with the ones from this folder.

executableBase - This is a copy of the the paster ini file that is responsible for executing the paste service. 
Also are examples of batch files for windows that can be used to execute the service on schedule or executed at startup.

wraith_customFiles - These are altered versions of the templates that wraith uses. 
These are altered to dump out a url using the rest service built for the containment unit so that internal paths are not exposed to the web interface. 
As well as allow gallery images to show up correctly through use of the access endpoint.

Locate your wraith installation on windows possibly : 
C:\tools\ruby22\lib\ruby\gems\2.2.0\gems\wraith-3.1.2