var camera, controls, scene, renderer;
var obstacles = [];
var rrt;
var candSphere;
var particle_filter;

var limit_max = 150;
var goal_max = limit_max * 2;
var obstacle_size = 5;
var goal_pos = new THREE.Vector3(goal_max, goal_max, goal_max);

Physijs.scripts.worker = '3rdparty/Physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

var initScene, render, applyForce, setMousePosition, mouse_position,
    ground_material, box_material, loader,
    renderer, render_stats, physics_stats, scene, ground, light, camera, box, boxes = [];

const PARTICLE_NUM = 100;
var particles = [];

class ParticleFilter{
    constructor() {
	this.scene = scene;
    }

    update(){
	//update
	for(var i = 0; i < particles.length; i++){
	    var particle = particles[i];
	    particle.position.x = Math.random() * 50 - 25 + target_box.position.x;
	    particle.position.y = Math.random() * 50 - 25 + target_box.position.y;
	    particle.position.z = Math.random() * 50 - 25 + target_box.position.z;
	}
	
    }
};

function addObservedPos(){
    var geometry = new THREE.SphereGeometry( 8, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    candSphere = new THREE.Mesh( geometry, material );
    candSphere.position.x = 0;
    candSphere.position.y = 100;
    candSphere.position.z = 0;
    scene.add( candSphere );
}

function updateObservedPos(){
    candSphere.position.x = target_box.position.x + Math.random() * 6 - 3;
    candSphere.position.y = target_box.position.y + Math.random() * 6 - 3;
    candSphere.position.z = target_box.position.z + Math.random() * 6 - 3;
}

function addParticle(){
    var geometry = new THREE.SphereGeometry( 3, 8, 8 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var particle = new THREE.Mesh( geometry, material );

    particle.position.x = Math.random() * 200 + 50;
    particle.position.y = Math.random() * 200 + 50;
    particle.position.z = Math.random() * 200 + 50;
    particle.rotation.x = Math.random() * 2 * Math.PI;
    particle.rotation.y = Math.random() * 2 * Math.PI;
    particle.rotation.z = Math.random() * 2 * Math.PI;
    particle.scale.x = Math.random() * 1 + 1;
    particle.scale.y = Math.random() * 1 + 1;
    particle.scale.z = Math.random() * 1 + 1;
    particle.castShadow = true;
    particle.receiveShadow = true;
    scene.add( particle );
    particles.push( particle );
    return particle;
}

function init() {
    particle_filter = new ParticleFilter();

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
			       updateObservedPos();
			       particle_filter.update();
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
    for ( var i = 0; i < PARTICLE_NUM; i ++ ) {
	addParticle();
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
    box_material = Physijs.createMaterial(
					  new THREE.MeshLambertMaterial({ map: loader.load( 'images/checkerboard.jpg' ) }),
					  .4, // low friction
					  .6 // high restitution
					  );
    box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    box_material.map.repeat.set( .25, .25 );
    
    box = new Physijs.BoxMesh(
			      new THREE.BoxGeometry( 4, 4, 4 ),
			      box_material
			      );
    box.position.set(
		     Math.random() * 250 - 25,
		     100 + Math.random() * 150,
		     Math.random() * 250 - 25
		     );
    box.rotation.set(
		     Math.random() * Math.PI * 2,
		     Math.random() * Math.PI * 2,
		     Math.random() * Math.PI * 2
		     );
    box.scale.set(
		  Math.random() * 10 + .5,
		  Math.random() * 10 + .5,
		  Math.random() * 10 + .5
		  );
    box.castShadow = true;
    scene.add( box );
    target_box = box;

    ground = new Physijs.BoxMesh(
				 new THREE.BoxGeometry(1000, 1, 1000),
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
    addObservedPos();

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

function resetBoxes(){
    target_box.position.y += 100 + Math.random() * 50;
    target_box.__dirtyPosition = true;
}

$(document).ready(function(){
	init();
	animate();
	console.log("Load done");

	$("#start-btn").on("click", function(){
		console.log("start");
		resetBoxes();
		//rrt.run();
		//rrt.start = true;
	    });

	$("#clear-btn").on("click", function(){
		console.log("clear");
		resetBoxes();
		init();
	    });

	$("#add-obstacle-btn").on("click", function(){
		console.log("add obstacle");
		addParticle();
	    });

    });