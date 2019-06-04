var camera, controls, scene, renderer;
var obstacles = [];
var rrt;

var limit_max = 150;
var goal_max = limit_max * 2;
var obstacle_size = 5;
var goal_pos = new THREE.Vector3(goal_max, goal_max, goal_max);

Physijs.scripts.worker = '3rdparty/Physijs/physijs_worker.js';
Physijs.scripts.ammo = '3rdparty/Physijs/examples/js/ammo.js';

var initScene, render, applyForce, setMousePosition, mouse_position,
    ground_material, box_material, loader,
    renderer, render_stats, physics_stats, scene, ground, light, camera, box, boxes = [];


class RRT{
    constructor(limit_times, limit_length, scene, obstacles) {
	this.scene = scene;

	this.limit_length = limit_length;
	this.limit_times = limit_times;

	this.nodes = [new THREE.Vector3(0,0,0)];

	this.counter = 0;

	this.nodeParents = [0];

	this.obstacles = obstacles;

	this.start = false;

	var geometry = new THREE.SphereGeometry( 8, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
	this.candSphere = new THREE.Mesh( geometry, material );
	this.candSphere.position.x = 0;
	this.candSphere.position.y = 0;
	this.candSphere.position.z = 0;
	scene.add( this.candSphere );
    }

    setObstacles(obstacles){
	this.obstacles = obstacles;
    }

    getRandomProcess(){
	var x = Math.random() * goal_max*1.2;
	var y = Math.random() * goal_max*1.2;
	var z = Math.random() * goal_max*1.2;
	return new THREE.Vector3(x, y, z);
    }

    isCollision(pos, dirvec){
	var ray = new THREE.Raycaster( pos.clone(), dirvec.clone().normalize() );
	var collisionResults = ray.intersectObjects( this.obstacles );
	if(collisionResults.length > 0 && collisionResults[0].distance < dirvec.length()){
	    return true;
	}else{	
	    return false;
	}
    }

    getNearestIndex(pos){
	var distance = goal_max * 2 * Math.sqrt(3) * 2;
	var min_index = 0;

	//get Nearest Nodes
	for(var i = 0; i < this.nodes.length;i++){
	    var d = pos.distanceTo( this.nodes[i] );

	    if(d < distance){
		min_index = i;
		distance = d;
	    }
	}

	return min_index;
    }

    getCandidateNewPos(pos, min_index){
	var newPos = pos;
	var distance = pos.distanceTo( this.nodes[min_index] );
	if( distance >= this.limit_length){
	    var new_distance = Math.random() * this.limit_length;
	    var subDir = pos.clone().sub(this.nodes[min_index]);
	    newPos = this.nodes[min_index].clone().addScaledVector(subDir, new_distance * 1.0 / distance);
	}

	return newPos;
    }

    addNewNode(newPos, nearestIndex){
	this.nodes.push(newPos);
	this.nodeParents.push(nearestIndex);

	var geometry = new THREE.SphereGeometry( 5, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xf4bf42} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.x = newPos.x;
	sphere.position.y = newPos.y;
	sphere.position.z = newPos.z;
	scene.add( sphere );
    }

    addNewEdge(newPos, oldPos){
	var material = new THREE.LineBasicMaterial({
		color: 0x000000
	    });
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push(newPos,
			       oldPos);
	
	var line = new THREE.Line( geometry, material );
	this.scene.add( line );
    }

    isGoalNear(pos){
	var d = pos.distanceTo( goal_pos );
	if( d < this.limit_length){


	    var material = new THREE.LineBasicMaterial({
		    color: 0xff0000
		});
	    
	    var geometry = new THREE.Geometry();
	    geometry.vertices.push(pos,
				   goal_pos);
	    
	    var line = new THREE.Line( geometry, material );
	    this.scene.add( line );
	    

	    return true;
	}else{
	    return false;
	}
    }

    execProcess(){
	var pos = this.getRandomProcess();
	var nearestIndex = this.getNearestIndex(pos);
	var candidateNewPos = this.getCandidateNewPos(pos, nearestIndex);
	var nearestPos = this.nodes[nearestIndex];
	var candidateNewDir = nearestPos.clone().sub(candidateNewPos);
	
	this.candSphere.position.x = pos.x;
	this.candSphere.position.y = pos.y;
	this.candSphere.position.z = pos.z;

	this.counter++;

	if(this.isCollision(candidateNewPos, candidateNewDir)){
	    return false;
	}else{
	    //Add new point
	    this.addNewNode(candidateNewPos, nearestIndex);
	    	    
	    //Add new edge
	    this.addNewEdge(candidateNewPos, nearestPos);

	    if(this.isGoalNear(candidateNewPos)){
		return true;
	    }else{
		return false;
	    }
	}
    }

    drawAns(){
	var index = this.nodes.length - 1;
	while(index){
	    var aPoint = this.nodes[index];
	    var bPoint = this.nodes[this.nodeParents[index]];

	    var material = new THREE.LineBasicMaterial({
		    color: 0xff0000
		});
	    
	    var geometry = new THREE.Geometry();
	    geometry.vertices.push(aPoint,
				   bPoint);
	    
	    var line = new THREE.Line( geometry, material );
	    this.scene.add( line );
	    
	    index = this.nodeParents[index];
	}
    }

    run(){
	var result = false;
	while(!result && this.counter < this.limit_times){
	    result = this.execProcess();
	}
	
	this.drawAns();
    }

    update(){
	if(this.start){
	    return this.execProcess();
	}else{
	    return false;
	}
    }
};


function addObstacle(){
    var geometry = new THREE.BoxBufferGeometry( 40, 40, 40 );
    var obstacle = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    obstacle.position.x = Math.random() * 200 + 50;
    obstacle.position.y = Math.random() * 200 + 50;
    obstacle.position.z = Math.random() * 200 + 50;
    obstacle.rotation.x = Math.random() * 2 * Math.PI;
    obstacle.rotation.y = Math.random() * 2 * Math.PI;
    obstacle.rotation.z = Math.random() * 2 * Math.PI;
    obstacle.scale.x = Math.random() * 1 + 1;
    obstacle.scale.y = Math.random() * 1 + 1;
    obstacle.scale.z = Math.random() * 1 + 1;
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;
    scene.add( obstacle );
    obstacles.push( obstacle );
    return obstacle;
}

function init() {
    $("#container-canvas").html("");
    camera = new THREE.PerspectiveCamera( 30, 400 / 400, 1, 5000 );
    camera.position.z = 1189;
    camera.position.x = 509;
    camera.position.y = 758;
    var a = new THREE.Euler( -0.567, 0.346, 0.181, 'XYZ' );
    camera.rotation = a;

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    scene.addEventListener(
			   'update',
			   function() {
			       //applyForce();
			       scene.simulate( undefined, 1 );
			   }
			   );

    scene.background = new THREE.Color( 0xf0f0f0 );
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.angle = Math.PI / 9;
    light.castShadow = true;
    light.shadow.camera.near = 1000;
    light.shadow.camera.far = 4000;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add( light );
    for ( var i = 0; i < 6; i ++ ) {
	addObstacle();
    }
    var axes = new THREE.AxisHelper(300);
    scene.add( axes );

    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    var geometry2 = new THREE.SphereGeometry( 10, 32, 32 );
    var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var sphere2 = new THREE.Mesh( geometry2, material2 );
    sphere2.position.x = limit_max * 2;
    sphere2.position.y = limit_max * 2;
    sphere2.position.z = limit_max * 2;
    scene.add( sphere2 );

    const loader = new THREE.TextureLoader();
    ground_material = Physijs.createMaterial(
					     new THREE.MeshLambertMaterial({ map: loader.load('images/checkerboard.jpg') }),
					     .8, // high friction
					     .4 // low restitution
					     );

    //var ground_material.map = new THREE.ImageUtils.loadTexture(  );
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping; 
    ground_material.map.repeat.set( 3, 3 );
    // DoubleSide: render texture on both sides of mesh
    /*
    var floorMaterial = new THREE.MeshBasicMaterial( { map: ground_material.map, side: THREE.DoubleSide } );
    var floorGeometry = new THREE.PlaneGeometry(300, 300, 1, 1);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.x = limit_max;
    floor.position.y = 0;
    floor.position.z = limit_max;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    */

		box_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( 'images/checkerboard.jpg' ) }),
			.4, // low friction
			.6 // high restitution
		);
		box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		box_material.map.repeat.set( .25, .25 );
		
		for ( var i = 0; i < 10; i++ ) {
			box = new Physijs.BoxMesh(
				new THREE.BoxGeometry( 4, 4, 4 ),
				box_material
			);
			box.position.set(
				Math.random() * 50 - 25,
				10 + Math.random() * 5,
				Math.random() * 50 - 25
			);
			box.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);
			box.scale.set(
				Math.random() * 1 + .5,
				Math.random() * 1 + .5,
				Math.random() * 1 + .5
			);
			box.castShadow = true;
			scene.add( box );
			boxes.push( box );
		}

    ground = new Physijs.BoxMesh(
				 new THREE.BoxGeometry(100, 1, 100),
				 ground_material,
				 0 // mass
				 );
    ground.receiveShadow = true;
    scene.add( ground );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(400, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    $("#container-canvas").append( renderer.domElement );
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    var dragControls = new THREE.DragControls( obstacles, camera, renderer.domElement );
    dragControls.addEventListener( 'dragstart', function () {
	    controls.enabled = false;
	} );
    dragControls.addEventListener( 'dragend', function () {
	    controls.enabled = true;
	} );

    window.addEventListener( 'resize', onWindowResize, false );

    //rrt = new RRT(1000, 50, scene, obstacles);

    scene.simulate();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    //renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {

    requestAnimationFrame( animate );
    render();
}

function render() {
    controls.update();
    renderer.render( scene, camera );

    /*
    var result = rrt.update();
    if(result){
	rrt.drawAns();
	rrt.start = false;
    }
    */
}

$(document).ready(function(){
	init();
	animate();
	console.log("Load done");

	$("#start-btn").on("click", function(){
		console.log("start");
		//rrt.run();
		//rrt.start = true;
	    });

	$("#clear-btn").on("click", function(){
		console.log("clear");
		init();
	    });

	$("#add-obstacle-btn").on("click", function(){
		console.log("add obstacle");
		addObstacle();
	    });

    });