var statusdiv = document.getElementById("status-log");
statusdiv.innerHTML = "モデルをロード中.";
var imglabel = document.getElementById("select-img-label");

imglabel.style.opacity = 0;

function modelLoaded(){
    statusdiv.innerHTML = "モデルのロード完了.<br>続いてパラメータをロード";

    classifier.load("model.json", function(){
	    statusdiv.innerHTML = "パラメータもロード完了.";
	    imglabel.style.opacity = 1;
	});
}

function modelReady(e){
};

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const classifier = featureExtractor.classification(modelReady);

$(document).ready(function(){
	$(".select-img").on('change', function(e){
		var tgt = e.target || window.event.srcElement,
		    files = tgt.files;
		var inputtag = $(this).attr("linktag");
		
		if (FileReader && files && files.length) {
		    var fr = new FileReader();
		    fr.onload = function () {
			var timg = $("#target-img");
			timg.attr("src", fr.result);
			timg.css("opacity", 1);
			
			classifier.classify(timg, function(err, results){
				if(err){
				    alert(err);
				}else{
				    var cellimg = "<img style='object-fit:cover' width='100px' height='100px' src="+$("#target-img").src+"></img>";
				    var cellresult = "<div style='color:red'>"+results[0].label+" : "+(results[0].confidence*100)+"%</div>";
				    $("#result-table").append("<div style='display:table-row;'><div style='display:table-cell;width:150px;'>"+cellimg+"</div><div style='display:table-cell;vertical-align:middle;'>"+cellresult+"</div></div>");
				}
			    });
		    }
		    fr.readAsDataURL(files[0]);
		}
	    });

    });
      
