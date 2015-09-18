/* 
    7/31/2015
    CodeMonkeny : Will Canada
    Description : This script is the js Side of our casperjs/python interface
                  Handles all client side request/response
 */
(function($,ecto1){
    
    ecto1.casper = ecto1.casper ||{};
    
    var scriptSelect = $('#casperScripts'),
        urlText   = $('#harPerfUrls'),
        optionsCont  = $('#scriptOptCont'),
        submitButton = $('#ghostIt'),
        waitTime = $('#waitTime'),
        timesToExe = $('#timesToExe'),
        scriptOutputCont = $('#scriptOutput'),
        payLoad = null,
        scriptIsRunning = false;
    
    //harScript name space - all related to our performanceHarRepo.js
    ecto1.casper.harScript = ecto1.casper.harScript || {};
    
    
    // Send a request to python to scan the script directory and return a list
    // of available scripts to be populated in the drop down.
    ecto1.casper.populateAvailableScripts = function(directory){
        
    };
    
    
    
    scriptSelect.on('change',function(){
        
        toggleSubmit('enabled');
        removeAppendedNodes();
        
        switch(scriptSelect.val()){
            case'0':{
                    toggleSubmit();
                    break;
            }
            case'1':{ //harperf script load additional form fields
                    
                    if(urlText.length<1){
                        $('#loadBuffer').load("/casperjs/harJsonFiles",function(){
                            optionsCont.append($(this).html());
                        }); 
                        
                        setTimeout(updateUrlText,300);
                    }
                break;
            }
            default:{
               break;     
            }
        }
    });
    submitButton.on('click',function(){
        switch(scriptSelect.val()){
            case'1':{
                    postHarScript();
                    break;
            }
            default:{
                    break;
            }
        }
    });
    
    function updateUrlText(){
        urlText = $('#harPerfUrls');
    }
                
    function removeAppendedNodes(){
        var nodes = $('.appendedNode');
        for(i=0; i < nodes.length; i++){
            
            nodes[i].remove();
        }
    }
    
 
    function postHarScript(){
        
        scriptOutputCont.append('<div>-------Running the selected Script, Please Wait -------</div></br></br>');
        
        payLoad = {
                'script' : scriptSelect.val(),
                'waitTime' : waitTime.val() ,
                'timesToExe' : timesToExe.val(),
                'urls' : urlText.val()
            };
        
        payLoad = JSON.stringify(payLoad);
        
        $.ajax({
            url: "/casperjs/exeScript",
            type: "POST",
            data:  payLoad,
            async: true,
            contentType: 'application/json; charset=utf-8',

            success: function (response) {
                response += '<div>------- End of Script Output ------</div></br></br>';
                scriptOutputCont.append(response);
              
            },
            error: function (response) {
               
               scriptOutputCont.append("There was a problem executing the script : " + response.responseText);
            }
        });
    }
    
    function toggleSubmit(arg){
        
        if(arg==='enabled'){
           submitButton.prop('disabled',false);
           submitButton.css('background-color','#498a2d');
        }
        else{
           submitButton.prop('disabled',true);
           submitButton.css('background-color','red');
        }
    }
    
    
    $(document).ready(function(){
        ecto1.casper.populateAvailableScripts();
        if(scriptSelect.val()==='0'){
            toggleSubmit();
        }
    });
    
    
    return ecto1;
    
})(jQuery,ecto1 = window.ecto1 || {});