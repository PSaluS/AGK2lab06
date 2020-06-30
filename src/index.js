import * as THREE from "three";
import OrbitControls from 'three-orbitcontrols';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth /
    window.innerHeight,
    0.1,
    2000
);
let scale = 0.1;
let imgW, imgH = 0;
var controls = new OrbitControls( camera, renderer.domElement );
let geometry;
let geometryMorf;
let vertices = [];
let quad_uvs =
[
0.0, 0.0,
1.0, 0.0,
1.0, 1.0,
0.0, 1.0,
1.0, 1.0,
1.0, 0.0
];
const materialMesh = new THREE.MeshBasicMaterial( { color: 0x00aa00, wireframe: true});
let materialSolid;
let mesh;
let image = new MarvinImage();
let image2 = new MarvinImage();
let imageValueRed = [];
let imageValueRed2 = [];
let imageValueGreen = [];
let imageValueBlue = [];
let viue = 2;
let morf = false;
let morfScal = 0.1;
let morfValue = 0;

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  function light() {
    var AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    var PointLight = new THREE.PointLight(0xffffff, 1, 1000);
    PointLight.position.set(0,50,0);
    scene.add(PointLight);
    scene.add(AmbientLight);
  };

function load() {
	if(imageValueRed.length == 0) {
	image.load('./bitmap/teren.png', function () {
		imgH = image.height;
		imgW = image.height;
		for(let i=0; i < (image.width*image.height)*4; i+=2) {
			imageValueRed.push(image.imageData.data[i]);
			i++;
			imageValueGreen.push(image.imageData.data[i]);
			i++;
			imageValueBlue.push(image.imageData.data[i]);
		}
		// terren(imageValueRed);
		image2.load('./bitmap/teren2.png', function () {
			for(let i=0; i < (image2.width*image2.height)*4; i+=4) {
				imageValueRed2.push(image2.imageData.data[i]);}
			terren(imageValueRed);
			build();
		});
	});
	
}
}

function terren(value) {

	// while(scene.children.length > 3) {
	// 	scene.remove(scene.children[scene.children.length-1]);
	// }
let z=0;
let przes=1;
	for (let i=0 ; i< (imgW*(imgH-1))-1; i++) {

		 if(i != 0 && (i%((imgW*przes)-1)) == 0) {
			 i++;
			 z++;
			 przes++;
			}

		geometry = new THREE.BufferGeometry();
		geometryMorf = new THREE.BufferGeometry();
		vertices = new Float32Array( [
			(i)%imgW, value[i]*scale, z,
			(i+1)%imgW, value[i+1+imgW]*scale, z+1,
			(i+1)%imgW, value[i+1]*scale, z,

			(i+1)%imgW, value[i+1+imgW]*scale, z+1,
			(i)%imgW, value[i]*scale, z,
			(i)%imgW, value[i+imgW]*scale, z+1
			 ] );

		let morfPosition =  new Float32Array([
			(i)%imgW, imageValueRed2[i]*scale, z,
			(i+1)%imgW, imageValueRed2[i+1+imgW]*scale, z+1,
			(i+1)%imgW, imageValueRed2[i+1]*scale, z,

			(i+1)%imgW, imageValueRed2[i+1+imgW]*scale, z+1,
			(i)%imgW, imageValueRed2[i]*scale, z,
			(i)%imgW, imageValueRed2[i+imgW]*scale, z+1
			 ]);

			 let uvs = new Float32Array( quad_uvs);
			 geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			 geometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
			 geometry.computeFaceNormals();
			 geometry.computeVertexNormals();


			//  geometry.morphAttributes.setAttribute( 'position', new THREE.BufferAttribute( morfPosition, 3 ) );
			geometry.morphAttributes.position = [];
			geometry.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( morfPosition, 3 );
			geometry.morphTargetInfluences = [0];
			//  let position = geometry.attributes.position.array;
			//  let morfPosition = [];
			//  let direction = new THREE.Vector3( 1, 0, 0 ).normalize();
			//  let vertex = new THREE.Vector3();

			 if (viue == 1) {
			 	mesh = new THREE.Mesh( geometry, materialMesh );
			 } if(viue == 2) {
				//  let red = Math.round(value[i]);
				//  let green = Math.round(255 - value[i]);

				//  let col = new THREE.Color(`rgb(${red}, ${green}, 0)`);
				 materialSolid = new THREE.MeshLambertMaterial( { color: 0x00aa00, morphTargets: true});
				mesh = new THREE.Mesh( geometry, materialSolid );
			 } if (viue == 3) {
				let blue = imageValueBlue[i];
				let green = imageValueGreen[i];
				let col = new THREE.Color(`rgb(0, ${green}, ${blue})`);
				materialSolid = new THREE.MeshLambertMaterial( { color: col});
			   	mesh = new THREE.Mesh( geometry, materialSolid );
			 } if (viue == 4) {
				 let texLoader = new THREE.TextureLoader();
				//  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				//  texture.repeat.set(32,32);

				 materialSolid = new THREE.MeshBasicMaterial( { map: texLoader.load( './bitmap/Tex.jpg' ) } );
				 mesh = new THREE.Mesh( geometry, materialSolid );
			 }
			 scene.add(mesh);
	}
	console.log(scene.children[4]);	
}

  function init() {
    camera.position.set(64	, 100, 64);
    camera.lookAt(0,0,0);
    scene.add(camera);
    renderer.setSize(
      window.innerWidth,
    	window.innerHeight
      );
      renderer.setClearColor(0x000000, 1);
      document.body.appendChild(renderer.domElement);
	  light();
	  load();
	}

	function build() {
		requestAnimationFrame(build);
		if(morf) {
			// scene.children[4].morphTargetInfluences[0]=0.5;
			if(morfValue<1)
			morfValue+=morfScal;
			console.log("Morf: "+morfValue);
			for(let i=4; i<scene.children.length; i++) {
				scene.children[i].morphTargetInfluences[0] = morfValue;
			}
		}
		// console.log(scene.children[4]);
        render();
	}

	function keyPutDown (event) {
		const keyCode = event.which;
		const arrDash = 0.05;
		switch (keyCode) {
			case(81):
			scale += arrDash;
			// ref();
			break;
			case(65):
			scale -= arrDash;
			// ref();
			break;
			case(49):
			viue = 1;
			// ref();
			break;
			case(50):
			viue = 2;
			// ref();
			break;
			case(51):
			viue = 3;
			// ref();
			break;
			case(52):
			viue = 4;
			// ref();
			break;
			case(53):
			if(morf)	morf=false;
			else morf=true;
			break;
		}
		}

		// function ref() {
		// 	while(scene.children.length > 3) {
		// 		scene.remove(scene.children[scene.children.length-1]);
		// 	}
		// 	build();
		// }

window.onload = init();

document.addEventListener("keydown", keyPutDown);