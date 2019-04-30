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
		isDrawingMode: true,
		backgroundColor: 'rgb(255,255,255)'
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

	
	var customEvtHandler = function (evt) {
	    this.contextContainer.fillStyle = 'white';
	    this.contextContainer.fillRect(0, 0, canvas.width, canvas.height);
	    console.log("beforerender");
	};

	canvas.on('before:render', customEvtHandler);

	
	$("#save-tweet-btn").on("click", function(){
		canvas.idDrawingMode = false;

		canvas.clipTo = function (ctx){
		    ctx.strokeStyle = '#999999';
		    
		    var numbers = $("#mask").css("clip-path").replace("polygon(", "").replace(/%/g,"").replace(")","").split(",");
		    
		    var w = 490,
		    h = 457;		    
		    ctx.beginPath();
		    
		    var posstr = numbers[0];
		    var nums = posstr.split(" ");
		    ctx.moveTo(parseInt(nums[0]) * w / 200, parseInt(nums[1]) * h / 200);
		    
		    for(var i = 1; i < numbers.length;i++){
			var posstr = numbers[i];
			var nums = posstr.split(" ");
			ctx.lineTo(parseInt(nums[1]) * w / 200, parseInt(nums[2]) * h / 200);
		    }
		    
		    posstr = numbers[0];
		    nums = posstr.split(" ");
		    ctx.lineTo(parseInt(nums[0]) * w / 200, parseInt(nums[1]) * h / 200);
		    ctx.closePath();		    
		}
		canvas.renderAll();

		var dfilename = canvas.toDataURL('jpg');

		$('<a>').attr({
			href: dfilename,
			    download:"bodymap.jpg" 
			    })[0].click(function(){
				    canvas.clipTo = function(ctx){};
				    canvas.reanderAll();
				});
		
    });

    });

function check(target){
    var text = encodeURI($("#tweet-textarea").val());
    $("#target-a").attr("href","https://twitter.com/share?text="+text+"&url=https://urusulambda.github.io/products/hau-vis/index.html&via=urusulambda&related=twitterapi,twitter&hashtags=HauVis");
    $("#target-a").attr("target","_blank");
    return true;
}