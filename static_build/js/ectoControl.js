/* 
    7/31/2015
    CodeMonkeny : Will Canada
    Description : This script is the js Side of our casperjs/python interface
                  Handles all client side request/response
 */
(function EctoControl($,ecto1){
    
    $(document).ready(function(){
        setTimeout(function(){
            
            ecto1.casper = ecto1.casper ||{};
    
            var scriptSelect = $('#casperScripts'),
                urlText   = $('#harPerfUrls'),
                optionsCont  = $('#scriptOptCont'),
                submitButton = $('#ghostIt'),
                waitTime = $('#waitTime'),
                waitTimeCont = $('#waitTimeCont'),
                timesToExe = $('#timesToExe'),
                timesToExeCont = $('#exeTimeCont'),
                scriptOutputCont = $('#scriptOutput'),
                payLoad = null,
                scriptIsRunning = false,
                testLabel = $('#testLabel'),
                start = null,
                target = null,
                myTimer = null,
                elapsed = '0.0',
                mainContent = $('#mainContent'),
                resultsTab = $('#mainContent ul li:first-child'),
                resultsCont = $('#resultsCont'),
                enableThrottle = $('#enableThrottle'),
                throttleCont   = $('#throttlingCont'),
                throttleSpeed = $('#networkThrottle');


            ecto1.aux = ecto1.aux || {};
            ecto1.wraith = ecto1.wraith ||{};


            // Send a request to python to scan the script directory and return a list
            // of available scripts to be populated in the drop down.
            ecto1.casper.populateAvailableScripts = function(directory){

            };

            enableThrottle.on('click',function(){
                if($(enableThrottle).is(":checked")){
                    throttleSpeed.prop('disabled',false);
                }
                else{
                   throttleSpeed.prop('disabled',true); 
                }

            });


            resultsTab.on('click',function(){
                $.ajax({
                    url: "/results/results",
                    type: "GET",

                    success:function(response){
                        resultsCont.html(response);
                        $('#stats_table').dataTable({
                            "bJQueryUI": true,
                            "sPaginationType": "full_numbers",
                            "sDom": 'R<"H"lfr>t<"F"ip<',
                            "bAutoWidth": false,
                            "iDisplayLength": 100,
                            "aaSorting": [[ 0, "desc" ]]
                        });
                        $('#summary-table').css('visibility', 'visible');
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            });


            scriptSelect.on('change',function(){


                removeAppendedNodes();


                switch(scriptSelect.val()){
                    case'0':{
                            toggleButtonState(submitButton);
                            break;
                    }
                    case'1':{ //harperf script load additional form fields
                            showCasperOptions();   
                            toggleButtonState(submitButton,'enabled');
                            $('#loadBuffer').load("/casperjs/harJsonFiles",function(){
                                optionsCont.append($(this).html());
                            }); 

                            setTimeout(updateUrlText,2000);

                        break;
                    }
                    case '2':{
                            toggleButtonState(submitButton);
                            hideCasperOptions();
                             $('#loadBuffer').load("/wraith/loadWraithForm",function(){
                                    optionsCont.append($(this).html());
                                }); 
                            setTimeout(ecto1.wraith.attachEventHandlers,1000);

                            break;
                    }
                    default:{
                       break;     
                    }
                }
            });
            submitButton.on('click',function(){
                 scriptOutputCont.html('');
                switch(scriptSelect.val()){
                    case'1':{
                            postHarScript();
                            break;
                    }
                    case'2':{
                            ecto1.wraith.disableControls();
                            ecto1.wraith.getLatestImages();
                            break;
                    }
                    default:{
                            break;
                    }
                }
                toggleButtonState(submitButton);
            });

            function updateUrlText(){
                urlText = $('#harPerfUrls');
                testLabel = $('#testLabel');
            }

            function removeAppendedNodes(){
                var nodes = $('.appendedNode');
                for(i=0; i < nodes.length; i++){

                    nodes[i].remove();
                }
            }


            function postHarScript(){

                scriptOutputCont.append('<div>-------Running the selected Script, Please Wait -------</div></br></br>');
                var tempTime = waitTime.val();
                var speed = 0;
                if(tempTime<1){
                    tempTime=1;
                }

                if(enableThrottle.is(":checked")){
                    speed = throttleSpeed.val();
                }
                tempTime = String(tempTime*1000);

                payLoad = {
                        'script' : scriptSelect.val(),
                        'waitTime' : tempTime ,
                        'timesToExe' : timesToExe.val(),
                        'urls' : urlText.val(),
                        'testLabel': testLabel.val(),
                        'throttleSpeed':speed
                    };

                payLoad = JSON.stringify(payLoad);

                $.ajax({
                    url: "/casperjs/exeScript",
                    type: "POST",
                    data:  payLoad,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success: function (response) {

                        $.ajax({
                            url: "casperjs/getScriptOutput",
                            type: "GET",

                            success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';
                                scriptOutputCont.append(response);
                            },
                            error:function(){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            }

                        });

                    },
                    error: function (response) {

                       if(response.status===0){
                           $.ajax({
                            url: "casperjs/getScriptOutput",
                            type: "GET",

                            success:function(response){
                                scriptOutputCont.append(response);
                            },
                            error:function(){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            }

                        });
                           return;
                       }
                       if(response.responseText.length){
                            scriptOutputCont.append("There was a problem executing the script : " + response.responseText);
                       }
                       else{
                           scriptOutputCont.append("There was a problem executing the script : " + JSON.stringify(response)); 
                       }
                    },
                    complete: function(){
                        toggleButtonState(submitButton,'enabled');
                        ecto1.aux.stopTimer();
                    }

                });
            }

            function toggleButtonState(target,arg){
                var button = $(target);

                if(arg==='enabled'){
                   button.prop('disabled',false);
                   button.css('background-color','#498a2d');
                }
                else{
                   button.prop('disabled',true);
                   button.css('background-color','red');
                }
            }


            $(document).ready(function(){
                ecto1.casper.populateAvailableScripts();
                if(scriptSelect.val()==='0'){
                    toggleButtonState(submitButton);
                }
            });


            ecto1.aux.toggleButtonState = function(target,arg){
                return toggleButtonState(target,arg);
            };
            ecto1.aux.startTimer = function(){
                start = new Date().getTime();
                target = $('#timer');
                var hrs=0,mins=0,secs=0;

                myTimer = setInterval(function()
                {
                    var time = new Date().getTime() - start;

                    elapsed = Math.floor(time / 100) / 10;
                    if(Math.round(elapsed) === elapsed) { elapsed += '.0'; }

                    secs = Math.floor(elapsed%60);
                    if(elapsed>3599){
                       hrs = Math.floor(elapsed/3600);
                       mins = Math.floor(elapsed/60)%60;

                    }
                    else if( elapsed > 59){
                      mins = Math.floor(elapsed/60)%60; 
                    }

                    $(target).html(" Script has been running for " +hrs+" :hours " + mins + " :minutes " + secs +" :seconds.");

                }, 100);
            };

            ecto1.aux.stopTimer = function(){
                clearInterval(myTimer);
            };

            function hideCasperOptions(){
                waitTimeCont.hide();
                timesToExeCont.hide();
                throttleCont.hide();

            }

            function showCasperOptions(){
                 waitTimeCont.show();
                timesToExeCont.show();
                throttleCont.show();
            }

            ecto1.casper.hideOptions = function(){
                return hideCasperOptions();
            };

            ecto1.casper.showOptions = function(){
                return showCasperOptions();
            };


            return ecto1;
        },3000);
    });
    
})(jQuery,ecto1 = window.ecto1 || {});