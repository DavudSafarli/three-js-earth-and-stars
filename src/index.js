var THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls');
var camera, scene, renderer, pointLight, controls;
var cloudMesh, earthMesh;



function init() {
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
	camera.position.set(0, 100, 20)
	// camera.lookAt(new THREE.Vector3(105, 100, 0))


	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	// renderer.setClearColor(0xff0000)
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.setClearColor( 0xfff6e6 );
	document.body.appendChild(renderer.domElement);

	// Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target = new THREE.Vector3(0, 50, 0);
	// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
	controls.update();
	controls.maxDistance = 80;
	controls.minDistance = 10;
	
	controls.enablePan = false;
	

	// Starts
	var geometry = new THREE.SphereBufferGeometry(100, 32, 32)
	
	var material = new THREE.MeshBasicMaterial()
	material.map = THREE.ImageUtils.loadTexture('src/textures/milky_way8k.jpg')
	material.side = THREE.BackSide;
	
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = 50
	scene.add(mesh)


	// Earth
	var geometry = new THREE.SphereBufferGeometry(5, 32, 32)
	var material = new THREE.MeshPhongMaterial()
	material.bumpMap = THREE.ImageUtils.loadTexture('src/textures/earth1.jpg')
	material.bumpScale = 0.3
	material.map = THREE.ImageUtils.loadTexture('src/textures/earth1.jpg')
	material.specularMap = THREE.ImageUtils.loadTexture('src/textures/earth1.jpg')
	material.specular = new THREE.Color(0xfdb813)
	material.shininess = 15
	earthMesh = new THREE.Mesh(geometry, material)
	earthMesh.position.x = 0;
	earthMesh.position.y = 50;
	scene.add(earthMesh)

    // Clouds
	var geometry   = new THREE.SphereGeometry(5.1, 32, 32)
	var material  = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.3
    })
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load( "src/textures/earthcloud1.jpg", function ( map ) {
        map.anisotropy = 80;
        material.map = map;
        material.needsUpdate = true;
    } );
	cloudMesh = new THREE.Mesh(geometry, material)
	cloudMesh.position.x = 0;
	cloudMesh.position.y = 50;
	scene.add(cloudMesh)

	// Ambient Light
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

	// Point Light
	pointLight = new THREE.PointLight(0xffffff, 0.8);
	pointLight.position.set(0, 50, 0);
	pointLight.castShadow = true;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;
	scene.add(pointLight);


	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
	animate()
}

var theta = 0;
function update() {
	earthMesh.rotation.y = theta/600
	cloudMesh.rotation.y = theta/400;
	theta += 1;
	pointLight.position.x = 40 * Math.sin(THREE.Math.degToRad(theta));
	// pointLight.position.y += 1 * Math.sin(THREE.Math.degToRad(theta));
	pointLight.position.z = 40 * Math.cos(THREE.Math.degToRad(theta));
}

function animate() {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	update();
}
init()