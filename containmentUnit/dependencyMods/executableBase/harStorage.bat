@echo off
REM This File Makes a backup of the monogdb used for harStorage and starts the paster service

ECHO +---------------------------------------+
REM ECHO Backing Up Mongodb files for harStorage to : P:\wcanada\harStorageBackup\data
REM cd c:\
REM XCOPY c:\data P:\wcanada\harStorageBackup\data /e /y
ECHO Starting paster service for harStorage
cd c:\harStorage\
paster serve --reload production.ini --log-file harStorage.log  





