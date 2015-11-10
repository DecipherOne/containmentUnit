@echo off
:: Get ADMIN Privs
:-------------------------------------
mkdir "%windir%\BatchGotAdmin"
net session >NUL 2>&1|| powershell Start-Process '%0' -Verb RunAs&& exit /b|| exit /b
:-------------------------------------
:: End Get ADMIN Privs


REM This File Makes a backup of the monogdb used for harStorage and starts the paster service
SET /A "Count=0"
ECHO +---------------------------------------+
ECHO Backing Up Mongodb files for harStorage to : P:\wcanada\harStorageBackup\data
cd c:\
XCOPY c:\data P:\wcanada\harStorageBackup\data /e /y
ECHO Starting paster service for harStorage
cd c:\harStorage
paster serve --reload production.ini --log-file harStorage.log  


cls
ECHO +---------------------------------------+
ECHO  CRT-HAR Storage Service Log Dump         
ECHO +---------------------------------------+
IF EXIST c:\harStorage\harStorage.log type harStorage.log


