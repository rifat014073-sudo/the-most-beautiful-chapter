import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const parameters = {};

parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 2.15;
parameters.branches = 3;
parameters.spin = 3;
parameters.randomness = 5;
parameters.randomnessPower = 4;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#0949f0";

const positions = new Float32Array(parameters.count * 3);
const colors = new Float32Array(parameters.count * 3);

const colorInside = new THREE.Color(parameters.insideColor);
const colorOutside = new THREE.Color(parameters.outsideColor);

for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.pow(
        Math.random() * parameters.randomness,
        Math.random() * parameters.radius
    );

    const spinAngle = radius * parameters.spin;

    const branchAngle =
        ((i % parameters.branches) / parameters.branches) *
        Math.PI * 2;

    const negPos = [1, -1];

    const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        negPos[Math.floor(Math.random() * 2)];

    const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        negPos[Math.floor(Math.random() * 2)];

    const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        negPos[Math.floor(Math.random() * 2)];

    positions[i3] =
        Math.cos(branchAngle + spinAngle) * radius + randomX;

    positions[i3 + 1] = randomY;

    positions[i3 + 2] =
        Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();

    mixedColor.lerp(
        colorOutside,
        Math.random() * radius / parameters.radius
    );

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enabled = false;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Galaxy slowly rotates
    points.rotation.y = elapsedTime * 0.04;
// Automatic smooth zoom out from the beginning
const zoomProgress = THREE.MathUtils.clamp(
    elapsedTime / 18,
    0,
    1
);

const distance = THREE.MathUtils.lerp(
    5,
    75,
    THREE.MathUtils.smoothstep(zoomProgress, 0, 1)
);

    camera.position.x = Math.cos(elapsedTime * 0.05) * distance;
    camera.position.y = distance * 0.35;
    camera.position.z = Math.sin(elapsedTime * 0.05) * distance;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();

// Enable Next button after all messages
setTimeout(() => {
    const nextButton = document.getElementById("nextButton");

    if (nextButton) {
        nextButton.style.pointerEvents = "auto";
    }
}, 18000);
