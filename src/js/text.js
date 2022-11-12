import * as THREE from 'three';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import Stats from 'three/addons/libs/stats.module.js';

THREE.Cache.enabled = true;

let container, stats, hex;

let camera, cameraTarget, scene, renderer;

let group, textMesh1, textMesh2, textGeo, materials;

let firstLetter = true;

let text = 'three.js',

bevelEnabled = true,

font = undefined,

fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
fontWeight = 'bold'; // normal bold

const height = 20,
size = 30,
hover = 30,

curveSegments = 4,

bevelThickness = 2,
bevelSize = 1.5;



const fontMap = {

	'helvetiker': 0,
	'optimer': 1,
	'gentilis': 2,
	'droid/droid_sans': 3,
	'droid/droid_serif': 4

};

const weightMap = {

	'regular': 0,
	'bold': 1

};

const reverseFontMap = [];
const reverseWeightMap = [];

for ( const i in fontMap ) reverseFontMap[ fontMap[ i ] ] = i;
for ( const i in weightMap ) reverseWeightMap[ weightMap[ i ] ] = i;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

let fontIndex = 1;

init();
animate();

function decimalToHex( d ) {

	let hex = Number( d ).toString( 16 );
	hex = '000000'.substring( 0, 6 - hex.length ) + hex;
	return hex.toUpperCase();

}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// CAMERA

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1500 );
	camera.position.set( 0, 400, 700 );

	cameraTarget = new THREE.Vector3( 0, 150, 0 );

	// SCENE

	scene = new THREE.Scene();

	// LIGHTS

	const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
	dirLight.position.set( 0, 0, 1 ).normalize();
	scene.add( dirLight );

	const pointLight = new THREE.PointLight( 0xffffff, 1.5 );
	pointLight.position.set( 0, 100, 90 );
	scene.add( pointLight );

	// Get text from hash

	const hash = document.location.hash.slice( 1 );

	if ( hash.length !== 0 ) {

		const colorhash = hash.substring( 0, 6 );
		const fonthash = hash.substring( 6, 7 );
		const weighthash = hash.substring( 7, 8 );
		const bevelhash = hash.substring( 8, 9 );
		const texthash = hash.substring( 10 );

		hex = colorhash;
		pointLight.color.setHex( parseInt( colorhash, 16 ) );

		fontName = reverseFontMap[ parseInt( fonthash ) ];
		fontWeight = reverseWeightMap[ parseInt( weighthash ) ];

		bevelEnabled = parseInt( bevelhash );

		text = decodeURI( texthash );


	} else {

		pointLight.color.setHSL( Math.random(), 1, 0.5 );
		hex = decimalToHex( pointLight.color.getHex() );

	}

	materials = [
		new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
		new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
	];

	group = new THREE.Group();
	group.position.y = 100;

	scene.add( group );

	loadFont();

	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry( 10000, 10000 ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
	);
	plane.position.y = 100;
	plane.rotation.x = - Math.PI / 2;
	scene.add( plane );

	// RENDERER

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
	renderer.setClearColor( 0x000000, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// STATS

	stats = new Stats();
	//container.appendChild( stats.dom );

	// EVENTS

	container.style.touchAction = 'none';
	container.addEventListener( 'pointerdown', onPointerDown );

	document.addEventListener( 'keypress', onDocumentKeyPress );
	document.addEventListener( 'keydown', onDocumentKeyDown );



	//

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function boolToNum( b ) {

	return b ? 1 : 0;

}



function onDocumentKeyDown( event ) {

	if ( firstLetter ) {

		firstLetter = false;
		text = '';

	}

	const keyCode = event.keyCode;

	// backspace

	if ( keyCode == 8 ) {

		event.preventDefault();

		text = text.substring( 0, text.length - 1 );
		refreshText();

		return false;

	}

}

function onDocumentKeyPress( event ) {

	const keyCode = event.which;

	// backspace

	if ( keyCode == 8 ) {

		event.preventDefault();

	} else {

		const ch = String.fromCharCode( keyCode );
		text += ch;

		refreshText();

	}

}

function loadFont() {

	const loader = new FontLoader();
	loader.load( 'fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {

		font = response;

		refreshText();

	} );

}

function createText() {

	textGeo = new TextGeometry( 'Lorenzo Del Forno', {

		font: font,

		size: size,
		height: height,
		curveSegments: curveSegments,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled

	} );

	textGeo.computeBoundingBox();

	const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	textMesh1 = new THREE.Mesh( textGeo, materials );

	textMesh1.position.x = centerOffset;
	textMesh1.position.y = hover;
	textMesh1.position.z = 0;

	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;

	group.add( textMesh1 );

	

}

function refreshText() {

	group.remove( textMesh1 );

	if ( ! text ) return;

	createText();

}

function getCursorPosition(event) {
	var xCursorPosition = event.clientX;
	var yCursorPosition = event.clientY;
	console.log("x: ", xCursorPosition, "y: ", yCursorPosition);
	
}

function onPointerDown( event ) {

	if ( event.isPrimary === false ) return;

	pointerXOnPointerDown = event.clientX - windowHalfX;
	targetRotationOnPointerDown = targetRotation;

	document.addEventListener( 'pointermove', onPointerMove );
	document.addEventListener( 'pointerup', onPointerUp );

}

function onPointerMove( event ) {

	if ( event.isPrimary === false ) return;

	pointerX = event.clientX - windowHalfX;

	targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

}

function onPointerUp() {

	if ( event.isPrimary === false ) return;

	document.removeEventListener( 'pointermove', onPointerMove );
	document.removeEventListener( 'pointerup', onPointerUp );

}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();
	

}

function render() {

	group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

	camera.lookAt( cameraTarget );

	renderer.clear();
	renderer.render( scene, camera );

}