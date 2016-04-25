# Containment Unit

A collection of front end performance tools.

Includes : 
A custom version of HarStorage - https://code.google.com/archive/p/harstorage/
Also allows execution of casperjs scripts through the Python interpreter, through a web interface. 
Also makes use of Wraith https://github.com/BBC-News/wraith with a web interface for regression image testing.

Python Dependencies - pyMongo 2.8
                    - Browser Mob Proxy 0.7.1 (modified)
                    - harStorage Custom
                    - pylons 1.0
                    - paste 2.0.2
                    
Ruby Dependencies   - Wraith 3.1.2 (Requires own versions of phantomjs and casperjs)
                  

Other Dependencies - Python 2.7
                   - Phantomjs 1.9.7
                   - Casperjs 1.1.0 beta
                   
                   
Setup Instructions - This project currently a collection of open source tools. Each must be setup in the appropriate order.

    Install python 2.7 https://www.python.org/downloads/release/python-2710/
    Install ruby 2.2     http://rubyinstaller.org/downloads/
    Install Phantomjs 1.9.7 https://github.com/ariya/phantomjs/releases or https://bitbucket.org/ariya/phantomjs/downloads
    Install Casperjs 1.1.0  https://github.com/n1k0/casperjs/releases

   From the cmd line install Wraith - gem install Wraith

    (However you install make sure your paths are set correctly!)
    

Use - 
