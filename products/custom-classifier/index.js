var trainbtn = document.getElementById('train-btn');
var loss = document.getElementById('loss');
var savebtn = document.getElementById('save-btn');
var testbtn = document.getElementById('test-btn');
var addcatebtn = document.getElementById('add-cate-btn');
var togglebtn = document.getElementById('display-toggle-btn');
let totalLoss = 0;

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
const classifier = featureExtractor.classification();

function modelLoaded(){
    console.log("Done Loding");
    $("#loading").html("Model Loading Done !!<br>モデルのロードが完了しました.");
}

trainbtn.onclick = function () {
    var lastPromise;
    var lis = $("#train-img-ul").children();
    featureExtractor.numClasses = lis.length;

    if(lis.length > 2){
	featureExtractor.hiddenUnits = $("#hiddenUnits").value;
	featureExtractor.epochs = $("#epochs").value;
    }

    for(var i = 0; i < lis.length; i++){
	var childs = $("#train-img-zone"+(i+1)).children();
	var classname = $("#train-img-classname"+(i+1)).val();


	if(childs.length == 0){
	    alert(classname+"クラスにはまだ画像がありません.少なくとも1枚は画像をおいてください.");
	    return;
	}

	for(var j = 0; j < childs.length; j++){
	    console.log($("#train-img-classname"+(i+1)).val());
	    
	    lastPromise = classifier.addImage(childs[j], classname);
	}
    }

    loss.innerHTML = 'Loading Img to Classifier... 画像を読み込んでいます. ' + totalLoss;

    lastPromise.then(classifier => classifier.train(function(lossValue) {
	    if (lossValue) {
		totalLoss = lossValue;
		loss.innerHTML = 'Learnign.... Loss: ' + totalLoss;
		console.log(lossValue);
	    } else {
		loss.innerHTML = 'Done Training! Final Loss: ' + totalLoss;
	    }
	    }));
};

savebtn.onclick = function () {
    classifier.save();
};

testbtn.onclick = function(){
    var childs = $("#train-img-zone0").children();
    
    if(childs.length == 0){
	alert(classname+"確認用画像がまだありません.少なくとも1枚は画像をおいてください.");
	return;
    }

    for(var j = 0; j < childs.length; j++){
	(function(){
	    var childj = childs[j];
	    classifier.classify(childj, 
			    function(err, results) {
				// Display any error
				if (err) {
				    console.error(err);
				}
				if (results && results[0]) {
				    console.log(results);
				    var cellimg = "<img style='object-fit:cover' width='100px' height='100px' src="+childj.src+"></img>";
				    var cellresult = "<div style='color:red'>"+results[0].label+" : "+(results[0].confidence*100)+"%</div>";
				    $("#result-table").append("<div style='display:table-row;'><div style='display:table-cell;width:150px;'>"+cellimg+"</div><div style='display:table-cell;vertical-align:middle;'>"+cellresult+"</div></div>");
				}});
	})();
    }
};

var category_box_index = 3;

addcatebtn.onclick = function(){
    var new_li = "<li style='display: inline-block;'><div class='suggest-knowledges' id='suggest-knowledges-raw'><div style='padding:10px;'><div class='train-img-box'><input class='input-class-name' placeholder='ここに何の画像か書いてください' id='train-img-classname"+category_box_index+"'><div class='train-img-zone' id='train-img-zone"+category_box_index+"'></div><label class='image-select-btn'><div>画像を選択</div><input type='file' accept='image/*' name='imgfile' style='display:none' linktag='train-img-zone"+category_box_index+"' class='mainImageInput' multiple></label></div></div></div></li>";

    $("#train-img-ul").append(new_li);
    category_box_index++;

};

togglebtn.onclick = function(){
    $(".train-img-zone").toggleClass("img-zone-toggle");
    $(togglebtn).toggleClass("hide-mode");
};


$(document).ready(function(){
	$(document).on("change", ".mainImageInput", function(e){
		var tgt = e.target || window.event.srcElement,
		    files = tgt.files;
		var inputtag = $(this).attr("linktag");

		if (FileReader && files && files.length) {

		    var childs = $("#"+inputtag).children();

		    $("#"+inputtag + " + label > div").html("画像を選択(" + (childs.length + files.length) + ")");

		    for (var i = 0; i < files.length; i++)
			{
			    (function(){
				var fr = new FileReader();
				fr.onload = function () {
				    $("#"+inputtag).append("<img class='img-thumb' width='50px' height='50px' src='"+fr.result+"'></img>");
				}
				fr.readAsDataURL(files[i]);
			    })();
			}
		}
	    });

        $("#load-btn").on('change', function(e){
                var tgt = e.target || window.event.srcElement,
                    files = tgt.files;

                if (FileReader && files && files.length == 2) {                    
                    var jsonFile = files[0];
                    var binFile = files[1];
                    if(files[0].name.indexOf(".json") < 0){
                        jsonFile = files[1];
                        binFile = files[0];
                    }

                    var fr_weight = new FileReader();
                    fr_weight.onload = function () {
                        var weight_data = fr_weight.result;
                        var fr_json = new FileReader();
                        fr_json.onload = function () {
                            var encodedData = fr_json.result.replace(/^data:\w+\/\w+;base64,/, '');
                            var originJson = JSON.parse(atob(encodedData));

                            originJson["weightsManifest"][0]["paths"][0] = weight_data;

                            var new_fr_json = "data:application/json;base64,"+btoa(JSON.stringify(originJson));
			    $("#load-status").html("<b>Now loading params...<br>学習中です...</b>");
                            classifier.load(new_fr_json, function(){
                                    console.log("load model done");
				    $("#load-status").html("<b>DONE loading params!!!<br>学習完了しました!Test(検証)にお進みください.</b>");
                                });
                        };
                        fr_json.readAsDataURL(jsonFile);
                    }

                    fr_weight.readAsDataURL(binFile);
                }else{
		    alert("JSONファイル(model.json)とbinファイル(model.weight.bin)の両方を指定してください.");
		}
            });

  });
