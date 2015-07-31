/* 
    7/31/2015
    CodeMonkeny : Will Canada
    Description : This script is the js Side of our casperjs/python interface
                  Handles all client side request/response
 */
(function($,ecto1){
    
    ecto1.casper = ecto1.casper ||{};
    
    var scriptSelect = $('#casperScripts'),
        jsonSelect   = $('#harPerfJsonFiles'),
        optionsCont  = $('#scriptOptCont');
    
    //harScript name space - all related to our performanceHarRepo.js
    ecto1.casper.harScript = ecto1.casper.harScript || {};
    
    ecto1.casper.harScript.getParameters = function(){
        
    };
    
    // Send a request to python to scan the script directory and return a list
    // of available scripts to be populated in the drop down.
    ecto1.casper.populateAvailableScripts = function(){
        
    };
    
    
    $(document).ready(function(){
        ecto1.casper.populateAvailableScripts();
    });
    
    scriptSelect.on('change',function(){
        switch(scriptSelect.val()){
            case'1':{ //harperf script load additional form fields
                $('#loadBuffer').load("../home/casperForms/crtHarPerfForm.html",function(){
                    optionsCont.append($(this).html());
                }); 
                break;
            }
            default:{
               break;     
            }
        }
    });
   
    
    return ecto1;
    
})(jQuery,ecto1 = window.ecto1 || {});