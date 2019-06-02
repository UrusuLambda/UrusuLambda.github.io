
var alltags = ["planning", 
	       "deeplearning",
	       "tracking",
	       "search",
	       "simulator",
	       ];

function toggleDisplay(target){

    for(var i = 0; i < alltags.length; i++){
	$(".ul-"+alltags[i]).addClass("not-showing");
    }
    $(target).removeClass("not-showing");
}

function allDisplay(){
    for(var i = 0; i < alltags.length; i++){
	$(".ul-"+alltags[i]).removeClass("not-showing");
    }
}

$(document).ready(function(){
	$(".li-all").on("click", function(e){
		allDisplay();
	    });

	for(var i = 0; i < alltags.length; i++){
	    (function(){
		var targetTag = alltags[i];
		$(".li-"+targetTag).on("click", function(e){
			toggleDisplay(".ul-"+targetTag);
		    });
	    })();
	}
    });