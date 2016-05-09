/* 
    2/17/2016
    CodeMonkeny(s) : Will Canada, Connor Finholt
    Description : This script is the front end handler for executing wraith from our python web interface.
 */

(function WraithControl($,ecto1){
    
    $(document).ready(function(){
        setTimeout(function(){
    
            //Make sure our namespaces are defined this allows us to access and resuse functionality across scripts.
            ecto1.casper = ecto1.casper ||{};
            ecto1.wraith = ecto1.wraith ||{};
            //Set all of our variables at the top as javascript uses hoisting anyways. http://www.w3schools.com/js/js_hoisting.asp 
            //We also do not have to create mulitple references to the same dom elements this way.
            var pathCheckbox = $("#newPathCheck"),
                 siteCheckbox = $("#newSiteCheck"),
                 siteName = $("#newSiteName"),
                 updateButton = $("#updateData"),
                 pathCheckbox = $("#newPathCheck"),
                 pathSelect = $("#existingPathsSel"),
                 secureCheckbox = $('#secureProtoCheck'),
                 siteSelect = $('#existingSiteSel'),
                 removeButton = $("#removeData"),
                 baseImageCheckbox = $('#newBaselineCheck'),
                 urlText = $('#pathsInput'),
                 resultsCont = $('#resultsCont'),
                 scriptOutputCont = $('#scriptOutputCont'),
                 pathLabel = $('#newPathLabel'),
                 removeSiteCheckbox = $('#removeSiteCheck'),
                 penumbraTab = $('#mainContent ul li:nth-child(3)'),
                 executeButton = $('#ghostIt');


            //Gets our data from the backend
            function getExistingSites(){
                $.ajax({
                    url: "/wraith/getExistingSites",
                    type: "GET",

                    success:function(response){
                       populateExistingSites(response);
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            }

            function populateExistingSites(response){

                //Removes extra quotes and parses the data
                var temp = JSON.parse(response).slice(0,response.length-1);
                temp = JSON.parse(temp);

                siteSelect.children("option").remove();
                siteSelect.append("<option>Please Choose</option>");
                for (i = 0; i < temp.sites.length; i++) {
                    siteSelect.append("<option value = "+temp.sites[i].siteName+">"+temp.sites[i].siteName+"</option>");
                }
            }

            function getSitePaths(arg){
                $.ajax({
                    url: "/wraith/getExistingSitePaths?siteName="+encodeURI(arg),
                    type: "GET",

                    success:function(response){
                       populatePaths(response);
                    },
                    error:function(){
                        resultsCont.prepend("Problem updating results, please refresh the page manually.");
                    }         
                });
            }

            function populatePaths(response){

                var temp = JSON.parse(response);

                //Removes existing children every time a new site is selected
                pathSelect.children("option").remove();
                pathSelect.append("<option>Existing Paths</option>");

                //Populates path select box with backend data
                for(i = 0; i < temp.paths.length; i++) {
                    pathSelect.append("<option value = "+temp.paths[i].url+">"+temp.paths[i].url+"</option>");
                }
            }

            //Responsible for adding or removing a site path to an existing site   
            function updateSitePaths(arg){


                var delPath = false,
                    update = false,
                    builtPaths = '',
                    payLoad = null,
                    pathLabels=null,
                    pathUrls=null,
                    protocol="https";

                if(arg!==true && arg !==false){
                    arg=false;
                }

                delPath = arg;

                if(delPath){

                    if(pathSelect.children().length<=2 || $('#existingPathsSel :selected').length > pathSelect.children.length-1){
                        alert("You can not delete all paths from a site. Sites require atleast one path.");
                        return;
                    }
                    if(confirm("Delete The Selected Test Paths From The System?")){
                        update = true;
                    }
                }
                else{
                   if(confirm("Add" + urlText.val() + " as paths to site" + siteSelect.val() + " ?")){
                        update = true;
                        ecto1.aux.toggleButtonState(updateButton);
                    } 
                }

                if(update){

                    //Deleting Paths
                    if(delPath){

                        //Build up list of the selected Paths
                        var selectedPaths = [];
                        $("#existingPathsSel :selected").each(function(){
                            selectedPaths.push($(this).val());
                        });

                        //We need to build up our path object
                        for(var i=0; i < selectedPaths.length; i++){
                            if(i===selectedPaths.length-1){
                              builtPaths += '{"url": "' + selectedPaths[i] + '", "label":"removeLabel"}';   
                            }
                            else{
                               builtPaths += '{"url": "' + selectedPaths[i] + '", "label":"removeLabel"},';  
                            }
                        }
                        builtPaths = '{"paths":['+builtPaths+']}';

                    }
                    else{ //Adding Paths
                        //Every Path Entry requires a lable, we need to validate this and inform the user if this requirment is not met.
                        pathLabels = pathLabel.val().split(",");
                        pathUrls   = urlText.val().split(",");

                        if(pathLabels.length!==pathUrls.length||pathLabels[0].valueOf()===""){
                           return alert("Every path entry requires a label. Label 1 is associated with Path 1. Please make sure you have at least one path and each path has a label.");
                        }
                        else{
                             siteCheckbox.trigger('click');
                            //We need to build up our path object
                            for(var i=0; i < pathLabels.length; i++){
                                if(i===pathLabels.length-1){
                                  builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'}';   
                                }
                                else{
                                   builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'},';  
                                }
                            }
                            builtPaths = '{"paths":['+builtPaths+']}';
                        }

                        if(!secureCheckbox.is(':checked')){
                            protocol="http";
                        }
                    }

                    payLoad = {
                        'siteName' : siteSelect.val(),
                        'paths' : builtPaths,
                        'protocol' : protocol,
                        'removePaths': delPath
                    };


                    payLoad = JSON.stringify(payLoad);

                    $.ajax({
                        url: "/wraith/updateSitePaths",
                        type: "POST",
                        data: payLoad,
                        async: true,
                        timeout:0,
                        contentType: 'application/json; charset=utf-8',

                        beforeSend:function(){
                           scriptOutputCont.html('--- Script Output ---');
                           scriptOutputCont.append('<div>------- Updating Site Paths for : ' + siteSelect.val() + ' -------</div></br></br>');
                           scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                             ecto1.aux.startTimer(); 
                           });

                        },

                        success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';
                                scriptOutputCont.append(response);
                                getSitePaths(siteSelect.val());
                                if(!delPath){
                                    urlText.val('');
                                    pathLabel.val('');
                                    pathCheckbox.prop('checked',false);
                                    pathCheckbox.trigger('change');
                                    pathCheckbox.prop('checked',false);
                                }
                            },
                        error:function(response){
                            scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                        },
                        complete: function(){
                            ecto1.aux.stopTimer();
                        }
                    });    
                }
            }

            function getLatestTestImages(){
                var protocol = 'https';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                var payload = {
                    'siteName' : siteSelect.val(),
                    'protocol' : protocol
                },
                p = '?siteName='+siteSelect.val()+'&num=2';

                payload = JSON.stringify(payload);

                $.ajax({
                    url: "/wraith/getLatestTestImages",
                    type: "POST",
                    data: payload,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.html('--- Script Output ---');
                       scriptOutputCont.append('<div>------- Getting Latest Images for site : ' + siteSelect.val() + ' -------</div></br></br>');
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success: function (response) {

                        $.ajax({
                            url: "wraith/returnProcessOutput"+encodeURI(p),
                            type: "GET",

                            success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';
                                scriptOutputCont.append(response);
                                siteSelect.prop('disabled',false);
                                siteSelect.trigger('change');
                                siteCheckbox.prop('disabled',false);
                                pathSelect.prop('disabled',false);
                                setTimeout(function(){
                                    alert("Latest Images Successfully updated");
                                },200);
                            },
                            error:function(response){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            }

                        });

                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();
                    }
                });
            }

            function addNewSite(){

               if(siteName.val()===""){
                   alert("Please make sure you have filled out the new site information.");
                   return;
               }

               var builtPaths ='',
                   protocol ='https',
                   payLoad = '',
                   p = '?siteName='+siteName.val()+'&num=1',
                   pathLabels = '',
                   pathUrls = '';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                //Every Path Entry requires a lable, we need to validate this and inform the user if this requirment is not met.
                pathLabels = pathLabel.val().split(",");
                pathUrls   = urlText.val().split(",");

                if(pathLabels.length!==pathUrls.length||pathLabels[0].valueOf()===""){
                   return alert("Every path entry requires a label. Label 1 is associated with Path 1. Please make sure you have at least one path and each path has a label.");
                }
                else{
                     disableAllControls();
                    //We need to build up our path object
                    for(var i=0; i < pathLabels.length; i++){
                        if(i===pathLabels.length-1){
                          builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'}';   
                        }
                        else{
                           builtPaths += '{"url": '+pathUrls[i]+ ', "label":'+ pathLabels[i] +'},';  
                        }
                    }
                    builtPaths = '{"paths":['+builtPaths+']}';
                }

                payLoad = {
                        'siteName' : siteName.val(),
                        'paths' : builtPaths,
                        'protocol' : protocol
                    };


                payLoad = JSON.stringify(payLoad);

                $.ajax({
                    url: "/wraith/generateSiteYaml",
                    type: "POST",
                    data:  payLoad,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                    beforeSend:function(){
                       scriptOutputCont.html("---Script OutPut---");
                       scriptOutputCont.append('<div>------- Adding New Entry for site : ' + siteName.val() + ' -------</div></br></br>');
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });

                    },

                    success: function (response) {

                        scriptOutputCont.append(response);

                        if(!response.includes("already exists")){
                            $.ajax({
                                url: "wraith/returnProcessOutput"+encodeURI(p),
                                type: "GET",

                                success:function(response){
                                    response += '</br><div>------- End of Script Output ------</div></br></br>';
                                    scriptOutputCont.append(response);
                                    getExistingSites();
                                },
                                error:function(){
                                    scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                                }
                            });
                        }
                        else{
                            alert(response);
                        }

                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();                
                        siteSelect.prop('disabled',false);
                        siteSelect.trigger('change');
                        siteCheckbox.prop('disabled',false);
                        pathSelect.prop('disabled',false);
                    }
                });
            }

            function genNewBaseImages(){
                var protocol = 'https';

                if(!secureCheckbox.is(':checked')){
                    protocol="http";
                }

                var payload = {
                    'siteName' : siteSelect.val(),
                    'protocol' : protocol
                },
                p = '?siteName='+siteSelect.val()+'&num=1';

                payload = JSON.stringify(payload);

                $.ajax({
                    url: "/wraith/generateBaseTestImages",
                    type: "POST",
                    data: payload,
                    async: true,
                    timeout:0,
                    contentType: 'application/json; charset=utf-8',

                   beforeSend:function(){
                       scriptOutputCont.html('--- Script Output ---');
                       scriptOutputCont.append('<div>------- Regenerating Base Test Images for site : ' + siteSelect.val() + ' -------</div></br></br>');
                       ecto1.aux.toggleButtonState(updateButton);
                       baseImageCheckbox.prop('checked',false);
                       baseImageCheckbox.prop('disabled',true);
                       scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                         ecto1.aux.startTimer(); 
                       });
                    },

                    success: function (response) {

                        $.ajax({
                            url: "wraith/returnProcessOutput"+encodeURI(p),
                            type: "GET",

                            success:function(response){
                                response += '</br><div>------- End of Script Output ------</div></br></br>';

                                scriptOutputCont.append(response);
                                siteSelect.prop('disabled',false);
                                siteSelect.trigger('change');
                                setTimeout(function(){
                                    alert('Base Images Generated Successfully');
                                },200);
                            },
                            error:function(){
                                scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));
                            } 
                        }); 
                    },
                    error: function (response) {   
                        scriptOutputCont.append("Problem retrieving script output : " + JSON.stringify(response));    
                    },
                    complete: function(){
                        ecto1.aux.stopTimer();
                    }
                });
            }

            function removeExistingSite(){

                if($('#existingSiteSel').children().length <= 2){
                    alert('The system requires at least one site exists. If you wish to delete this site, add another first.');
                    removeSiteCheckbox.trigger('click');
                    return;
                }

                if(confirm("Are you sure you wish to delete the site " + siteSelect.val() + "? \n This will completely remove all paths and images from the system.")){

                    ecto1.aux.toggleButtonState(updateButton);

                    $.ajax({
                        url: "/wraith/removeExistingSite?siteName="+encodeURI(siteSelect.val()),
                        type: "PUT",
                        beforeSend:function(){
                            scriptOutputCont.html("---Script Output---");
                            scriptOutputCont.append('<div>------- Attempting to Delete : ' + siteSelect.val() + ' -------</div></br></br>');
                            scriptOutputCont.append("<div id='timer'>Starting Timer</div>").each(function(){
                              ecto1.aux.startTimer(); 
                            });
                         },

                        success:function(response){
                           scriptOutputCont.append(response);
                           getExistingSites();
                        },
                        error:function(response){
                             scriptOutputCont.append("Problem removing the site : " + response);
                            ;
                        },
                        complete: function(){
                            ecto1.aux.stopTimer();
                            removeSiteCheckbox.trigger('click');

                        }
                    });
                }
            }

            function getWraithGalleries(){
                $.ajax({
                     url: "/wraith/loadWraithGalleryIndex",
                     type: "GET",

                     success:function(response){
                        $('#linkCont').html(response);
                     },
                     error:function(){
                         $('#linkCont').prepend("Problem updating results, please refresh the page manually.");
                     }         
                });
            }

            penumbraTab.on('click',function(){
                getWraithGalleries();
            });

            function disableAllControls(){
                pathCheckbox.prop('disabled',true);
                pathCheckbox.prop('checked',false);
                siteCheckbox.prop('disabled',true);
                siteCheckbox.prop('checked',false);
                siteName.prop('disabled',true);
                pathSelect.prop('disabled',true);
                siteSelect.prop('disabled',true);
                secureCheckbox.prop('disabled',true);
                secureCheckbox.prop('checked',false);
                baseImageCheckbox.prop('disabled',true);
                baseImageCheckbox.prop('checked',false);
                urlText.prop('disabled',true);
                removeSiteCheckbox.prop('disabled',true);
                removeSiteCheckbox.prop('checked',false);
                pathLabel.prop('disabled',true);
                ecto1.aux.toggleButtonState(updateButton);
                ecto1.aux.toggleButtonState(removeButton);

            }



            //Allows our event handlers to be assigned dynamically/ at load time.

            function attachEventHandlers(){
                pathCheckbox = $("#newPathCheck"),
                siteCheckbox = $("#newSiteCheck"),
                siteName = $("#newSiteName"),
                updateButton = $("#updateData"),
                pathCheckbox = $("#newPathCheck"),
                pathSelect = $("#existingPathsSel"),
                siteSelect = $('#existingSiteSel'),
                removeButton = $("#removeData"),
                secureCheckbox = $('#secureProtoCheck'),
                baseImageCheckbox = $('#newBaselineCheck'),
                urlText = $('#pathsInput'),
                removeSiteCheckbox = $('#removeSiteCheck'),
                pathLabel = $('#newPathLabel');

                 //Was once newSiteChecked()
                siteCheckbox.on('change',function(e){

                    e.stopImmediatePropagation();

                    //Enables button and textbox when checked
                    if ($(siteCheckbox).is(':checked')) {
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        siteName.prop('disabled',false);
                        secureCheckbox.prop('disabled',false);
                        secureCheckbox.prop('checked',true);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',true);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',true);
                        urlText.prop('disabled',false);
                        pathLabel.prop('disabled',false);
                        siteSelect.prop('disabled',true);
                        siteSelect.prop('selectedIndex',0);
                        //Removes existing children every time a new site is selected
                        pathSelect.children("option").remove();
                        pathSelect.append("<option>Existing Paths</option>");
                        ecto1.aux.toggleButtonState(executeButton);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                    }

                    //Disables button and textbox when unchecked
                    else {
                        siteName.prop('disabled',true);
                        ecto1.aux.toggleButtonState(updateButton);
                        siteSelect.prop('disabled',false);
                        secureCheckbox.prop('disabled',true);
                        secureCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',false);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        if(siteSelect.prop('selectedIndex')>0){
                            removeSiteCheckbox.prop('disabled',false);
                        }   
                    }
                });


                baseImageCheckbox.on('click', function() {
                    if ($(baseImageCheckbox).is(':checked')) {
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        ecto1.aux.toggleButtonState(executeButton);
                        pathSelect.prop('disabled',true);
                        pathCheckbox.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                    }
                    else {
                        ecto1.aux.toggleButtonState(updateButton);
                        pathSelect.prop('disabled',false);
                        pathCheckbox.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                    }
                });

                //Enables/disables specific form elements when a selection is made.
                siteSelect.on('change', function(){
                    if(siteSelect.val() !== '' && siteSelect.val() !== 'Please Choose'){
                        //If we have a selection, disabled everything else, except for path alteration options, gen new base images, and the run script button
                        getSitePaths(siteSelect.val());
                        baseImageCheckbox.prop('disabled',false);
                        baseImageCheckbox.prop('checked',false);
                        ecto1.aux.toggleButtonState(executeButton,'enabled');
                        pathCheckbox.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                    }
                    else {
                        baseImageCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                        ecto1.aux.toggleButtonState(executeButton);
                        ecto1.aux.toggleButtonState(updateButton);
                        //Removes existing children every time a new site is selected
                        pathSelect.children("option").remove();
                        pathSelect.append("<option>Existing Paths</option>");
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                    }
                });

                removeSiteCheckbox.on("change",function(){
                    if(removeSiteCheckbox.is(':checked')){
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        ecto1.aux.toggleButtonState(executeButton);
                        siteName.prop('disabled',true);
                        secureCheckbox.prop('disabled',true);
                        secureCheckbox.prop('checked',false);
                        baseImageCheckbox.prop('disabled',true);
                        baseImageCheckbox.prop('checked',false);
                        pathCheckbox.prop('disabled',true);
                        pathCheckbox.prop('checked',false);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        pathSelect.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                    }
                    else{
                        ecto1.aux.toggleButtonState(updateButton);
                        siteName.prop('disabled',true);
                        baseImageCheckbox.prop('disabled',false);
                        pathCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                        pathSelect.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                    }

                });

                //Was removePathChecked
                pathSelect.on('change', function(){
                    //All this event handler needs to do is enable the submit button to remove the path if a value is selected.
                    //The data will be manipulated on the backend and returned to the front end.
                    if(pathSelect.val() !== null && pathSelect.val() !="Existing Paths"){
                        ecto1.aux.toggleButtonState(removeButton,'enabled');
                    }
                    else{
                       ecto1.aux.toggleButtonState(removeButton); 
                    }
                });

                //Remove selections if the user selects outside.
                pathSelect.on('blur',function(){  
                    setTimeout(function(){
                       pathSelect.prop('selectedIndex',0); 
                       ecto1.aux.toggleButtonState(removeButton); 
                    },450);

                });

                updateButton.on('click',function() {
                    //This method should build a payload to be submitted to the back end. The data will be updated there and returned to front end.
                    //We are adding a new site
                    if(siteCheckbox.is(":checked")){
                        setTimeout(function(){
                            addNewSite();
                        },200);

                    }
                    else if(baseImageCheckbox.is(":checked")){

                        genNewBaseImages();
                    }
                    else if(pathCheckbox.is(":checked")){
                        updateSitePaths(); 
                    }
                    else if(removeSiteCheckbox.is(":checked")){
                        removeExistingSite();
                    }
                });

                removeButton.on('click',function() {
                    updateSitePaths(true);
                });

                pathCheckbox.on('change',function(){
                    if(pathCheckbox.is(':checked')){
                        secureCheckbox.prop('disabled',false);
                        urlText.prop('disabled',false);
                        pathLabel.prop('disabled',false);
                        ecto1.aux.toggleButtonState(updateButton,'enabled');
                        pathSelect.prop('disabled',true);
                        baseImageCheckbox.prop('disabled',true);
                        siteCheckbox.prop('disabled',true);
                        siteSelect.prop('disabled',true);
                        removeSiteCheckbox.prop('disabled',true);
                        removeSiteCheckbox.prop('checked',false);
                    }
                    else{
                        secureCheckbox.prop('disabled',true);
                        urlText.prop('disabled',true);
                        pathLabel.prop('disabled',true);
                        ecto1.aux.toggleButtonState(updateButton);
                        pathSelect.prop('disabled',false);
                        baseImageCheckbox.prop('disabled',false);
                        siteCheckbox.prop('disabled',false);
                        removeSiteCheckbox.prop('disabled',false);
                        siteSelect.prop('disabled',false);
                    }

                });

                getExistingSites();
            }

            ecto1.wraith.attachEventHandlers = function(){
                return attachEventHandlers();
            };

            ecto1.wraith.getLatestImages = function(){
                return getLatestTestImages();
            };

            ecto1.wraith.disableControls = function(){
                return disableAllControls();
            };

            $(document).ready(function(){
                getWraithGalleries(); 
            });


            return ecto1;
        },1000);
        
    });
    
})(jQuery,ecto1 = window.ecto1 || {});