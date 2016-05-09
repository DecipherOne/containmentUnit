/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * Need to put all init code from the jsloader.html files in here.
 */

(function initTemplates($,ecto1,HARSTORAGE){
    var superpose_form = null;
    
   
    ecto1.initCreate = function(){
        superpose_form = new HARSTORAGE.SuperposeForm();
        superpose_form.addSpinner();
        superpose_form.setTimestamps("step_1_label"); 
    };
    
    
    ecto1.initHome = function(){
       $('#stats_table').dataTable({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
                "sDom": 'R<"H"lfr>t<"F"ip<',
                "bAutoWidth": false,
                "iDisplayLength": 100,
                "aaSorting": [[ 0, "desc" ]]
            });

        $('#summary-table').css('visibility', 'visible'); 
    };
    
    
    return ecto1;
})(jQuery,ecto1 = window.ecto1 || {},HARSTORAGE = window.HARSTORAGE || {});
