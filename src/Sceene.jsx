import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, model, floor;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

function init() {
    // Scena
    scene = new THREE.Scene();

    // Kamera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

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

    // Podłoże - Szachownica
    const floorSize = 200;
    const floorSegments = 20;
    const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize, floorSegments, floorSegments);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x808080,
        vertexColors: true
    });
    floorGeometry.rotateX(-Math.PI / 2);

    const colors = [];
    const color1 = new THREE.Color(0x808080); // Szary
    const color2 = new THREE.Color(0xFFFFFF); // Biały
    for (let i = 0; i < floorSegments; i++) {
        for (let j = 0; j < floorSegments; j++) {
            const color = (i + j) % 2 === 0 ? color1 : color2;
            for (let k = 0; k < 6; k++) {
                colors.push(color.r, color.g, color.b);
            }
        }
    }
    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);

    // Ładowanie modelu GLTF
    const loader = new GLTFLoader();
    loader.load(
        'src/assets/gltf/potted_plant_01_4k.gltf', // Ścieżka do pliku GLTF
        function (gltf) {
            model = gltf.scene;
            model.position.set(0, 0, 0);
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    // Obsługa zmiany rozmiaru okna
    window.addEventListener('resize', onWindowResize, false);

    // Obsługa klawiatury
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        if (moveForward) model.position.z -= 0.1;
        if (moveBackward) model.position.z += 0.1;
        if (moveLeft) model.position.x -= 0.1;
        if (moveRight) model.position.x += 0.1;

        // Ustawienie kamery na model
        camera.position.set(
            model.position.x + 10,
            model.position.y + 5,
            model.position.z + 10
        );
        camera.lookAt(model.position);
    }

    renderer.render(scene, camera);
}

init();
animate();
