// URL variables
var pendingUrls = [];

// Create instances
var casper = require('casper').create({
viewportSize: {
    width: 1280,
    height: 768
}}),

utils = require('utils'),
helpers = require('./helpers'),
fs = require('fs'),
page = casper,
har = null,  
iterations = casper.cli.args[2],
waitTime = casper.cli.args[1] || 100,
preservedUrls = null,  
itCount = 0,
jsonFile = casper.cli.args[0],
brandId = null,
uploadPath = 'http://localhost:5000/results/upload',
filePreFix = null,
curPage=null;

casper.resources = [];

if(casper.cli.args.length < 2) {
    casper.echo("Usage: casperjs crt-ContainerPages-HAR.js <json_file_name> <wait_time_in_ms> <times_to_iterate>  <screen_shot_true?optional>");   
}

// Spider from the given URL
function spider(url) {

    // Open the URL
    casper.open(url).then(function() {
        page.endTime = new Date();
        page.title = casper.evaluate(function() {
            return document.title.replace(/\s+/g, "");
        });
        
        brandId = casper.evaluate(function(){
            return document.body.classList[0];
        });
        
        this.wait(waitTime,function(){
          this.echo('waited '+ waitTime +' milli-secs for page load');
          curPage =  getParameterByName('containerName',url);
        });
    });

    casper.then(function(){
         
        filePreFix = casper.evaluate(function() {

            var temp = window.location.origin;

            if(temp.indexOf("dev") > -1){
                return "dev";
            }
            else if(temp.indexOf("test") > -1){
                return "test";
            }
            else{
                return "prod";
            }
        });

        if(brandId === null||brandId==="null"){
            brandId = "NoBrand";   
        }
        
        filePreFix += brandId.toUpperCase() + '_' + curPage;;
       
        // generate har file
        har = helpers.createHAR(filePreFix, page.title, casper.startTime, page.resources);
        har = JSON.stringify(har, undefined, 4);
        har = {'file':har};
        
        page.resources = []; 
        
        if(casper.cli.args.length>2 && casper.cli.args[3]==="true"){
            this.capture('png/' + filePreFix + "_" +  itCount +'.png');
        }
        //Send Data to Har Storage
        this.echo(this.colorizer.format("Attempting to upload Har to : " + uploadPath , 
            { bg:'green',fg: 'yellow', bold: true }));
       
        casper.open(uploadPath, {
            method: 'post',
            headers:{"Content-type": "application/x-www-form-urlencoded"},
            asynch:false,
            data:har
        }).then(function(response){
           

            // Set the status style based on server status code
            var status = this.status().currentHTTPStatus;
            switch(status) {
                case 200: var statusStyle = { fg: 'green', bold: true };
                this.echo(this.colorizer.format("Success : Har Record added to : " + filePreFix , 
                { bg:'yellow',fg: 'green', bold: true }));
                 break;
                case 404: var statusStyle = { fg: 'red', bold: true }; break;
                 default: var statusStyle = { fg: 'magenta', bold: true }; break;
            }

            // Display the spidered URL and status
            this.echo(this.colorizer.format(status, statusStyle) + ' ' + url + ' ' + response.statusText);
        }); 

    });

    casper.then(function(){
        // If there are URLs to be processed
        if (pendingUrls.length > 0) {
            var nextUrl = pendingUrls.shift();
            spider(nextUrl);
        }

    });

}

// when page start
casper.on('load.started', function() {
    this.startTime = new Date();
});

// when resource start 
casper.on('resource.requested', function(req) {
    this.resources[req.id] = {
        request: req,
        startReply: null,
        endReply: null
    };
});

// when resource received
casper.on('resource.received', function(res) {
    if (res.stage === 'start') {
        this.resources[res.id].startReply = res;
    }
    if (res.stage === 'end') {
        this.resources[res.id].endReply = res;
    }    
});

casper.on('http.status.200',function(response){
        this.echo(" here's the status code :" + http.status);

});


// Start spidering
casper.start('localHost',function() {

    if(!jsonFile.length || !isNaN(jsonFile)){
        this.echo(this.colorizer.format("Error : No file for urls specified: ", 
            { bg:'red',fg: 'green', bold: true }));

        return 0;
    }

    var rawJson = fs.read(jsonFile);

    rawJson = JSON.parse(rawJson);

    
    
    for(var links in rawJson){
        pendingUrls = rawJson[links];
        this.echo(this.colorizer.format("Urls loaded From File : " + rawJson[links], 
            { bg:'green',fg: 'yellow', bold: true }));
    }
    
    preservedUrls = pendingUrls.slice();
    
    casper.repeat(iterations,function(){
        itCount++;

        if(itCount > 1){
            pendingUrls = preservedUrls.slice();
        }

        this.echo(this.colorizer.format("itCount : " + itCount, { fg: 'red', bold: true }));
        spider(pendingUrls[0]);
    });
});

// Start the run
casper.run();

function getParameterByName(parameter,page) {
        var match = RegExp('[?&]' + parameter + '=([^&]*)').exec(page);
        return match[1].replace(/\+/g, ' ');
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 &&
        typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}
