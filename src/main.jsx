import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, model, controls;

function init() {
	// Scena
	scene = new THREE.Scene();

	// Kamera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0, 1.6, 3); // Ustawienie pozycji kamery

	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Oświetlenie
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(1, 1, 0).normalize();
	scene.add(directionalLight);

	// Kontrole
	controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	// Ładowanie modelu GLTF
	const loader = new GLTFLoader();
	loader.load(
		'src/assets/gltf/potted_plant_01_4k.gltf', // Ścieżka do pliku GLTF
		function (gltf) {
			model = gltf.scene;
			scene.add(model);
		},
		undefined,
		function (error) {
			console.error(error);
		}
	);

	// Obsługa zmiany rozmiaru okna
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	if (model) {
		model.rotation.y += 0.01; // Obrót modelu
	}
	controls.update();
	renderer.render(scene, camera);
}

init();
animate();