var canvas;

$(document).ready(function(){
	$("#toggle-drawing").on("click", function(){
		//canvas.isDrawingMode = !canvas.isDrawingMode
		if(canvas.freeDrawingBrush.color == "rgba(255, 100, 100, 0.1)"){
		    canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
		    canvas.freeDrawingBrush.color = "white";
		    canvas.freeDrawingBrush.width = 5;

		    canvas.freeDrawingBrush.color = "white";
		    $("#toggle-drawing").html("白モード");
		    $("#toggle-drawing").css("color", "white");
		    $("#toggle-drawing").css("background-color", "red");
		}else{
		    canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
		    canvas.freeDrawingBrush.optimizeOverlapping = false;
		    canvas.freeDrawingBrush.color = "rgba(255, 100, 100, 0.1)";
		    canvas.freeDrawingBrush.width = 10;
		    
		    $("#toggle-drawing").html("赤モード");
		    $("#toggle-drawing").css("color", "red");
		    $("#toggle-drawing").css("background-color", "white");
		}		
	    });
	
	canvas = new fabric.Canvas('canvas', {
		isDrawingMode: true
          });
	fabric.Object.prototype.transparentCorners = false;
	//canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);

	canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
	canvas.freeDrawingBrush.optimizeOverlapping = false;
	canvas.freeDrawingBrush.color = "rgba(255, 100, 100, 0.1)";
	canvas.freeDrawingBrush.width = 10;
	//canvas.setDimensions({width: '100%', height: '100%'});
	canvas.setDimensions({width: 300, height: 300});	

	var imgElement = document.getElementById('body-img');
	var imgInstance = new fabric.Image(imgElement, {
		left: 0,
		top: 0,
		scaleX : 0.5,
		scaleY : 0.5
	    });
	
	canvas.add(imgInstance);
	canvas.bringToFront(imgInstance)
	
	canvas.setHeight(490);
	canvas.setWidth(490);
	canvas.renderAll();
	
	$("#save-tweet-btn").on("click", function(){
		var dfilename = canvas.toDataURL('png');

		/*
		$.ajax({url:'https://upload.twitter.com/1.1/media/upload.json',
			    type:"POST",
			    data:JSON.stringify({media_data:dfilename}),
			    //contentType: 'application/json; charset=utf-8',
			    //dataType: 'json',
			    success:function(result) {
			    console.log(result);
		*/    

		$('<a>').attr({
			href: dfilename,
			    download:"bodymap.png" 
			    })[0].click();
		//});
		
		//}});
    
    });

    });

function check(target){
    var text = encodeURI($("#tweet-textarea").val());
    $("#target-a").attr("href","https://twitter.com/share?text="+text+"&url=https://urusulambda.github.io/products/hau-vis/index.html&via=urusulambda&related=twitterapi,twitter&hashtags=HauVis");
    $("#target-a").attr("target","_blank");
    console.log("check");
    return true;
}