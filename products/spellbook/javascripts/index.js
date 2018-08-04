/*
  Spell Book Children Web Game

  index.js
  
  Urusu Lambda 2018/07/29
*/


/*
Game Variables
 */
var player;
var stars;
var bombs;
var platforms, config, game;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var canvas, ctx;

/*
tensorflow variables
*/
var model;
var classNames = [];
var coords = [];
var mousePressed = false;
var mode;

var spellUpdate = false;
var pictureUpdate = false;

//Timer callback for spell recognition
setInterval(function(){
	if(spellUpdate){
	    var c=document.getElementById("canvas-spell");
	    Tesseract.recognize(c)
		.progress(function  (p) { console.log('progress', p)    })
		.then(function (result) { 
			console.log(result);
			$("#result-txt-spell").html(result.text);
			console.log('result', result) })
	    spellUpdate = false;
	}
    },2200);

//Timer callback for picture recognition
setInterval(function(){
	if(pictureUpdate){
	    getFrame();
	    pictureUpdate = false;
	}
    },2500);

$(document).ready(function(){
	start();

	var w = $('.game-main-panel').width();
	var h = $('.game-main-panel').height();

	//-----------------------------------------------
	//    Setup GAME
	//-----------------------------------------------
	config = {
	    type: Phaser.AUTO,
	    parent: "game-main-panel",
	    width: w,
	    height: h,
	    physics: {
	    default: 'arcade',
	    arcade: {
		    gravity: { y: 300 },
		    debug: true
		}
	    },
	    scene: {
		preload: preload,
		create: create,
		update: update
	    }
	};

	game = new Phaser.Game(config);

	function preload ()
	{
	    this.load.image('sky', 'uploads/sky.png');
	    this.load.image('ground', 'uploads/platform.png');
	    this.load.image('star', 'uploads/star.png');
	    this.load.image('bomb', 'uploads/bomb.png');
	    this.load.spritesheet('dude', 'uploads/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	function create ()
	{
	    this.add.image(400, 230, 'sky').setScale(2.2);

	    platforms = this.physics.add.staticGroup();

	    var base_ground = platforms.create(0, h-30, 'ground');
	    base_ground.scaleX = 10;
	    base_ground.refreshBody();

	    platforms.create(700, 0.7*h, 'ground');

	    // The player and its settings
	    player = this.physics.add.sprite(100, 100, 'dude');
	    player.setBounce(0.4);
	    player.setCollideWorldBounds(true);

	    //  Our player animations, turning, walking left and walking right.
	    this.anims.create({
		    key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
			});
	    this.anims.create({
		    key: 'turn',
			frames: [ { key: 'dude', frame: 4 } ],
			frameRate: 20
			});
	    this.anims.create({
		    key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
			});

	    //  Input Events
	    cursors = this.input.keyboard.createCursorKeys();
	    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
	    stars = this.physics.add.group({
		    key: 'star',
		    repeat: 11,
		    setXY: { x: 12, y: 0, stepX: 70 }
		});
	    stars.children.iterate(function (child) {
		    //  Give each star a slightly different bounce
		    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});

	    bombs = this.physics.add.group();

	    //  The score
	    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

	    //  Collide the player and the stars with the platforms
	    this.physics.add.collider(player, platforms);
	    this.physics.add.collider(stars, platforms);
	    this.physics.add.collider(bombs, platforms);
	    this.physics.add.overlap(player, stars, collectStar, null, this);
	    this.physics.add.collider(player, bombs, hitBomb, null, this);
	}

	function update ()
	{
	    if (gameOver)
		{
		    return;
		}
	    if (cursors.left.isDown)
		{
		    player.setVelocityX(-160);
		    player.anims.play('left', true);
		}
	    else if (cursors.right.isDown)
		{
		    player.setVelocityX(160);
		    player.anims.play('right', true);
		}
	    else
		{
		    player.setVelocityX(0);
		    player.anims.play('turn');
		}
	    if (cursors.up.isDown && player.body.touching.down)
		{
		    player.setVelocityY(-300);
		}
	}

	function collectStar (player, star)
	{
	    star.disableBody(true, true);
	    //  Add and update the score
	    score += 10;
	    scoreText.setText('Score: ' + score);
	    if (stars.countActive(true) === 0)
		{
		    //  A new batch of stars to collect
		    stars.children.iterate(function (child) {
			    child.enableBody(true, child.x, 0, true, true);
			});
		    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
		    var bomb = bombs.create(x, 16, 'bomb');
		    bomb.setBounce(1);
		    bomb.setCollideWorldBounds(true);
		    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		    bomb.allowGravity = false;
		}
	}

	function hitBomb (player, bomb)
	{
	    this.physics.pause();
	    player.setTint(0xff0000);
	    player.anims.play('turn');
	    gameOver = true;
	}

	//-----------------------------------------------
	//    Setup Spell Canvas
	//-----------------------------------------------
	{
	    var canvasSpell = this.__canvas = new fabric.Canvas('canvas-spell', {
		    isDrawingMode: true,
		    backgroundColor: 'rgb(250,250,250)',
		});
	    
	    var canvas_pw = $('.game-interface-spell').width();
	    var canvas_ph = $('.game-interface-spell').height();
	    canvasSpell.setWidth(canvas_pw);
	    canvasSpell.setHeight(canvas_ph);
	    
	    fabric.Object.prototype.transparentCorners = false;
	    
	    canvasSpell.freeDrawingBrush = new fabric['PencilBrush'](canvasSpell);
	    canvasSpell.freeDrawingBrush.color = "black";
	    canvasSpell.freeDrawingBrush.width = 10;
	    
	    canvasSpell.setBackgroundImage("uploads/notebook.jpeg", canvasSpell.renderAll.bind(canvasSpell), {
		    backgroundImageOpacity: 0.5,
			backgroundImageStretch: false
			});

	    $('#clear-button-spell').click(function() {
		    canvasSpell.clear();
		    canvasSpell.setBackgroundImage("uploads/notebook.jpeg", canvasSpell.renderAll.bind(canvasSpell), {
			    backgroundImageOpacity: 0.5,
				backgroundImageStretch: false
				});
		});
	    
	    canvasSpell.on('mouse:up', function(e) {
		    spellUpdate = true;
		});
	}
	
	//-----------------------------------------------
	//    Setup Picture Canvas
	//-----------------------------------------------
	{
	    canvas = this.__canvas2 = new fabric.Canvas('canvas-drawing', {
		    isDrawingMode: true,
		    backgroundColor: 'rgb(250,250,250)',
		});
	    
	    var canvas_pw = $('.game-interface-picture').width();
	    var canvas_ph = $('.game-interface-picture').height();
	    canvas.setWidth(canvas_pw);
	    canvas.setHeight(canvas_ph);
	    
	    fabric.Object.prototype.transparentCorners = false;
	    
	    canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
	    canvas.freeDrawingBrush.color = "black";
	    canvas.freeDrawingBrush.width = 10;

	    $('#clear-button-pic').click(function() {
		    canvas.clear();
		    canvas.backgroundColor = '#ffffff';
		    coords = [];
		});

	    canvas.on('mouse:up', function(e) {
		    mousePressed = false;
		    pictureUpdate = true;
		});
	    canvas.on('mouse:down', function(e) {
		    mousePressed = true;
		});
	    canvas.on('mouse:move', function(e) {
		    recordCoor(e);
		});
	}
    });

///////////////////////////////////////////////////////////////
// Under is for TensorFlow QuickDraw Recognition Util Functions
///////////////////////////////////////////////////////////////

function recordCoor(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;
    
    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer);
    }
}

function getMinBox() {
    var coorX = coords.map(function(p) {
        return p.x
	});
    var coorY = coords.map(function(p) {
        return p.y
	});

    var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY)
    }
    var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY)
    }

    return {
        min: min_coords,
	    max: max_coords
	    }
}

function getImageData() {
    const mbb = getMinBox();
    const dpi = window.devicePixelRatio;
    const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
							 (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
    return imgData;
}

function getFrame() {
    if (coords.length >= 2) {
        const imgData = getImageData();
	const pred = model.predict(preprocess(imgData)).dataSync();
	const indices = findIndicesOfMax(pred, 5);
	const probs = findTopValues(pred, 5);
	const names = getClassNames(indices);

	var names_list = "";
	for(var i = 0; i < names.length;i++){
	    names_list += names[i];
	    names_list += ",";
	}
	$("#result-txt-pic").html(names_list);
    }
}

function getClassNames(indices) {
    var outp = [];
    for (var i = 0; i < indices.length; i++)
	outp[i] = classNames[indices[i]];
    return outp;
}

async function loadDict() {
    if (mode == 'ar')
        loc = 'model2/class_names_ar.txt';
    else
	loc = 'model2/class_names.txt';
    
    await $.ajax({
	    url: loc,
		dataType: 'text',
		}).done(success);
}

function success(data) {
    const lst = data.split(/\n/);
    for (var i = 0; i < lst.length - 1; i++) {
	let symbol = lst[i];
	classNames[i] = symbol;
    }
}

function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i);
        if (outp.length > count) {
            outp.sort(function(a, b) {
		    return inp[b] - inp[a];
		});
            outp.pop();
        }
    }
    return outp;
}

function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count);
    for (var i = 0; i < indices.length; i++){
        outp[i] = inp[indices[i]];
    }
    return outp;
}

function preprocess(imgData) {
    return tf.tidy(() => {
	    let tensor = tf.fromPixels(imgData, numChannels = 1);
	    const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
	    const offset = tf.scalar(255.0);
	    const normalized = tf.scalar(1.0).sub(resized.div(offset));
	    const batched = normalized.expandDims(0);
	    return batched;
	});
}

async function start() {
    model = await tf.loadModel('model2/model.json');
    model.predict(tf.zeros([1, 28, 28, 1]));
    canvas.isDrawingMode = 1;
    await loadDict();
}
