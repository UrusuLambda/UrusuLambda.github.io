
// Grab all the DOM elements
var charaButton = document.getElementById('charaButton');
var amountOfImages = document.getElementById('amountOfImages');
var train = document.getElementById('train');
var loss = document.getElementById('loss');
var result = document.getElementById('result');
var confidence = document.getElementById('confidence');
var predict = document.getElementById('predict');
var img1 = document.getElementById('img1'); // The image we want to classify
var img2 = document.getElementById('img2'); // The image we want to classify
var img3 = document.getElementById('img3'); // The image we want to classify
var img4 = document.getElementById('img4'); // The image we want to classify
var imgchoose = document.getElementById('blah'); // The image we want to classify

// A variable to store the total loss
let totalLoss = 0;

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(img4, videoReady);

function modelLoaded(){
    console.log("Done Loding");
}

// Predict the current frame.
function predict() {
    classifier.predict(img1, gotResults);
}

// A function to be called when the video is finished loading
function videoReady() {
    console.log( 'Video ready!');
}

// When the Cat button is pressed, add the current frame
// from the video with a label of cat to the classifier
amountOfImagesDic = {};

charaButton.onclick = function () {
    var charactor_name = $("#charactor_name").val();
    classifier.addImage(img2, charactor_name);
    if(amountOfImagesDic[charactor_name]){
	amountOfImagesDic[charactor_name] += 1;
    }else { 
	amountOfImagesDic[charactor_name] = 0;
    }
    amountOfImages.innerText +=1;
}
    
// When the train button is pressed, train the classifier
// With all the given cat and dog images
    train.onclick = function () {
	classifier.train(function(lossValue) {
		if (lossValue) {
		    totalLoss = lossValue;
		    loss.innerHTML = 'Loss: ' + totalLoss;
		} else {
		    loss.innerHTML = 'Done Training! Final Loss: ' + totalLoss;
		}
	    });
    }
	
    // Show the results
	function gotResults(err, results) {
	    // Display any error
	    if (err) {
		console.error(err);
	    }
	    if (results && results[0]) {
		result.innerText = results[0].label;
		confidence.innerText = results[0].confidence;
		classifier.classify(img3, gotResults);
	    }
	}

// Start predicting when the predict button is clicked
predict.onclick = function () {
    classifier.classify(img4, gotResults);
}
    
    
    function readURL(input) {
	console.log("here2");
	if (input.files && input.files[0]) {
	    console.log("changed");
	    var reader = new FileReader();
	    
	    reader.onload = function (e) {
		$('#blah')
		.attr('src', e.target.result)
		.width(150)
		.height(200);
		
		var imgchoose = document.getElementById('imgchoose');
		
		ml5.imageClassifier('MobileNet')
		.then(classifier => classifier.classify(imgchoose))
		.then(results => {
			result.innerText = results[0].label;
			confidence.innerText = results[0].confidence.toFixed(4);
		    });
	    };
	    
	    reader.readAsDataURL(input.files[0]);
	}
    }



$(document).ready(function(){
	$("#mainImageInput").on('change', function(e){
		console.log("here");
		readURL(this);
	    });
	
	var imgchoose = document.getElementById('blah');
	
	ml5.imageClassifier('MobileNet')
	    .then(classifier => classifier.classify(imgchoose))
	    .then(results => {
		    result.innerText = results[0].label;
		    confidence.innerText = results[0].confidence.toFixed(4);
		});

	var name = "frandle";
	$.get("https://www.google.com/search?tbm=isch&q=" + name, function(response) {
		console.log(response);
	    });
	
    });
	//$(document).ready(function(){
//  });
