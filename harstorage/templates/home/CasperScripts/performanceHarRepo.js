// URL variables
var pendingUrls = [];

// Create instances
var casper = require('casper').create({
viewportSize: {
    width: 1280,
    height: 768
}}),

utils = require('utils'),
fs = require('fs'),
page = casper,
har = null, 
harLabel = casper.cli.args[2],
waitTime = casper.cli.args[1] || 100,
itCount = 0,
jsonFile = casper.cli.args[0],
brandId = null,
uploadPath = 'http://localhost:5000/results/upload',
filePreFix = null,
curPage=null,
gotHar =false;
cacheBust=0;

casper.resources = [];

if(casper.cli.args.length < 2) {
    casper.echo("Usage: casperjs crt-ContainerPages-HAR.js <json_file_name> <wait_time_in_ms> <test_label>");   
}

// Spider from the given URL
function spider(url) {

    // Open the URL
    casper.echo("</br><div> --- Browsing To : " + url + " ---</div></br>");
        //initalize har for proxy
    casper.open('http://localhost:5000/casperjs/createHar?label='+harLabel);
    
    casper.thenOpen(url).then(function() {

        this.wait(waitTime,function(){
          this.echo('<div> waited '+ waitTime +' milli-secs for page load </div>');
        });
    });
   
    

    
        
    // generate har file
    casper.thenOpen('http://localhost:5000/casperjs/getHar').then(function(response){

        if(response.status===200||response.status===0){
            this.echo("<div>Har File created and added to storage successfully.</div></br>");
        }
        else{
            this.echo("Could not retrieve har." + JSON.stringify(response));
        }
    });
       

    

    casper.then(function(){ //Problem is potentially here!
        // If there are URLs to be processed
        
        var nextUrl = pendingUrls.shift();
        if(nextUrl===undefined){
            return;
        }
        spider(nextUrl);
        

    });

}

// Start spidering
casper.start('localhost:5000',function() {

    if(!jsonFile.length || !isNaN(jsonFile)){
        this.echo(this.colorizer.format("<div> Error : No file for urls specified: </div> ", 
            { bg:'red',fg: 'green', bold: true }));

        return 0;
    }

    var rawJson = fs.read(jsonFile);

    rawJson = JSON.parse(rawJson);
    
   
    for(var links in rawJson){

        pendingUrls = rawJson[links];
        this.echo(this.colorizer.format("</br><div> Urls loaded From File : " + rawJson[links] + " </div></br>", 
            { bg:'green',fg: 'yellow', bold: true }));
    }
   
   
    var firstUrl = pendingUrls.shift();
    spider(firstUrl);
    
});

// Start the run
casper.run();

function getParameterByName(parameter,page) {
        var match = RegExp('[?&]' + parameter + '=([^&]*)').exec(page);
        return match[1].replace(/\+/g, ' ');
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match !== null && match.length > 2 &&
        typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
}
