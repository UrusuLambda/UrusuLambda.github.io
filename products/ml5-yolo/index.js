var trainbtn = document.getElementById('train-btn');
var loss = document.getElementById('loss');
var savebtn = document.getElementById('save-btn');
var testbtn = document.getElementById('test-btn');
var togglebtn = document.getElementById('display-toggle-btn');
let totalLoss = 0;
var canvas;

const yolo = ml5.YOLO({ filterBoxesThreshold: 0.03,
			IOUThreshold: 0.3,
			classProbThreshold: 0.03 },
		      modelLoaded);

function modelLoaded(){
    console.log("Done Loding");
    $("#loading").html("Model Loading Done !!<br>モデルのロードが完了しました.");
    status = true;
}


testbtn.onclick = function(){
    if(canvas){
	canvas.clear();
	
	console.log("clear done");
    }

    $("#result-table").html("");

    canvas = new fabric.Canvas('canvas', {
	    });

    var imgElement = document.getElementById('img-target');
    var canvasParentElement = document.getElementById('parent-canvas');


    var fitWidth = imgElement.width;
    var fitHeight = imgElement.height;
    if(canvasParentElement.offsetWidth < imgElement.width){
	fitWidth = canvasParentElement.offsetWidth;
	fitHeight = imgElement.height * canvasParentElement.offsetWidth / imgElement.width;
    }

    var rateWidth = 1.0 * fitWidth / imgElement.width;
    var rateHeight = 1.0 * fitHeight / imgElement.height;
    var imgInstance = new fabric.Image(imgElement, {
	    left: 0,
	    top: 0,
	    scaleX : rateWidth,
	    scaleY : rateHeight
	});

    canvas.add(imgInstance);
    canvas.setWidth(fitWidth);
    canvas.setHeight(fitHeight);
    canvas.renderAll();    
    

    yolo.filterBoxesThreshold = parseFloat($("#fbt-threshold").val());
    yolo.IOUThreshold = parseFloat($("#iou-threshold").val());
    yolo.classProbThreshold = parseFloat($("#cpt-threshold").val());
    
    var childs = $("#train-img-zone0").children();
    
    for(var j = 0; j < childs.length; j++){
	(function(){
	    var childj = childs[j];
	    yolo.detect(childj, function(err, results){
		    console.log(results); // Will output bounding boxes of detected objects
		    var imgElement = document.getElementById('img-target');
		    //Cut and show images of candidate
		    for(var i = 0; i < results.length; i++){
			var result = results[i];
			var left  = imgElement.width * result.x * rateWidth;
			var top  = imgElement.height * result.y * rateHeight;
			var width  = imgElement.width * result.w * rateWidth;
			var height  = imgElement.height * result.h * rateHeight;
			
			var croppedImg = canvas.toDataURL({
				left: left,
				top: top,
				width: width,
				height: height,
			    });
			$("#result-table").append("<div style='display:table-row'><div  style='display:table-cell;max-height:120px;'> <img style='margin:5px;max-height:120px;' src='" + croppedImg + "'></div><div style='display:table-cell;vertical-align:middle;'>"+result.label+"</div><div style='display:table-cell;vertical-align:middle;'>"+ (result.confidence*100) +"</div></div>");
		    }
		    //rectangle
		    for(var i = 0; i < results.length; i++){
			var result = results[i];
			var left  = imgElement.width * result.x * rateWidth;
			var top  = imgElement.height * result.y * rateHeight;
			var width  = imgElement.width * result.w * rateWidth;
			var height  = imgElement.height * result.h * rateHeight;
			
			var rect = new fabric.Rect({
				left: left,
				top: top,
				width: width,
				height: height,
				fill: 'rgba(0,0,0,0)',
				stroke: 'rgba(150,20,20,1)',
				strokeWidth: 5
			    });
			canvas.add(rect);
			canvas.renderAll();
		    }
		});
	})();
    }
};

var category_box_index = 3;

$(document).ready(function(){

	$(document).on("change", ".mainImageInput", function(e){
		var tgt = e.target || window.event.srcElement,
		    files = tgt.files;
		var inputtag = $(this).attr("linktag");

		if (FileReader && files && files.length) {

		    var childs = $("#"+inputtag).children();

		    if($("#img-target")){
			$("#img-target").remove();
			$("#parent-canvas").html("<canvas id='canvas' ></canvas>");			
			$("#result-table").html("");
		    }

		    for (var i = 0; i < files.length; i++)
			{
			    (function(){
				var fr = new FileReader();
				fr.onload = function () {
				    $("#"+inputtag).append("<img class='img-thumb' src='"+fr.result+"' style='  filter: brightness(300%);;display:none;' id='img-target'></img>");
				}
				fr.readAsDataURL(files[i]);
			    })();
			}
		}
	    });
  });
