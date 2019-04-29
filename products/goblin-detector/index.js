var trainbtn = document.getElementById('train-btn');
var loss = document.getElementById('loss');
var savebtn = document.getElementById('save-btn');
var testbtn = document.getElementById('test-btn');
var togglebtn = document.getElementById('display-toggle-btn');
let totalLoss = 0;
var canvas;

const yolo = ml5.YOLO({ filterBoxesThreshold: 0.02,
			IOUThreshold: 0.2,
			classProbThreshold: 0.03 },
		      modelLoaded);

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification();

function modelLoaded(){
    console.log("Done Loding");
    $("#loading").html("Model Loading Done !!<br>モデルのロードが完了しました.");
    status = true;

    classifier.load("model2.json", function(){
	    $("#loading").html("パラメータもロード完了.<br>以下にて画像を選択してください.");
	});

}


testbtn.onclick = function(){
    if(canvas){
	canvas.clear();
	
	console.log("clear done");
    }

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
			if(result.label){// == "person"){
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

			    $("#result-table").append("<div style='display:table-row'><div  style='display:table-cell;max-height:120px;'> <img style='margin:5px;max-height:120px;' src='" + croppedImg + "'></div><div style='display:table-cell;vertical-align:middle;' id='crop-label"+i+"'></div><div style='display:table-cell;vertical-align:middle;'>"+ (result.confidence*100) +"</div></div>");

			    
			    
			}
		    }
		    //rectangle
		    for(var i = 0; i < results.length; i++){
			var result = results[i];
			if(result.label){// == "person"){
			    
			    (function(){
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
				var yololabel = result.label;

				var clid = "#crop-label"+i;
				var imgElem = document.createElement("img");
				imgElem.src = croppedImg;
				classifier.classify(imgElem, function(err, results){
					if(err){
					    alert(err);
					}else{
					    if(results[0].label == "ゴブリン"){
						if(results[0].confidence <= 0.99){
						    results[0].label = "notゴブリン";
						}

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
					    var cellresult = "";
					    if(results[0].label == "ゴブリン"){
						cellresult = "<div>これは<b style='color:red'>"+results[0].label+"</b> ("+(results[0].confidence*100)+"%)</div><br>Yolo : "+yololabel;
					    }else{
						cellresult = "<div>これは<b style='color:blue'>ゴブリンじゃないな</b></div>";
					    }
					    $(clid).html(cellresult);
					}
				    });
			    })();
			    
			}
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
