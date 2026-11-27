
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const parameters = {
    count: 100000,
    size: 0.015,
    radius: 2.15,
    branches: 3,
    spin: 3,
    randomness: 5,
    randomnessPower: 4,
    insideColor: "#ff6030",
    outsideColor: "#0949f0"
};

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

    const signs = [1, -1];

    const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        signs[Math.floor(Math.random() * 2)];

    const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        signs[Math.floor(Math.random() * 2)];

    const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        signs[Math.floor(Math.random() * 2)];

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
    85,
    window.innerWidth / window.innerHeight,
    0.01,
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

// Camera's starting position at 12 seconds
const startCamera = new THREE.Vector3(
    Math.cos(12 * 0.05) * 5,
    1,
    Math.sin(12 * 0.05) * 5
);

// Direction from outside toward and through the galaxy
const flyDirection = startCamera.clone().negate().normalize();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Galaxy keeps rotating
    points.rotation.y = elapsedTime * 0.04;

    if (elapsedTime < 12) {
        // Original view before the journey
        const distance = 5;

        camera.position.x =
            Math.cos(elapsedTime * 0.05) * distance;

        camera.position.y = distance * 0.2;

        camera.position.z =
            Math.sin(elapsedTime * 0.05) * distance;

        camera.lookAt(0, 0, 0);

    } else {
        // Start flying through the galaxy at 12 seconds
        const progress = THREE.MathUtils.clamp(
            (elapsedTime - 12) / 3,
            0,
            1
        );

        const smoothProgress = THREE.MathUtils.smoothstep(
            progress,
            0,
            1
        );

        // Pass through the center and continue inside
        const travelDistance = THREE.MathUtils.lerp(
            0,
            7.2,
            smoothProgress
        );

        camera.position.copy(startCamera).addScaledVector(
            flyDirection,
            travelDistance
        );

        // Look forward in the direction of travel
        const lookTarget = camera.position.clone().addScaledVector(
            flyDirection,
            10
        );

        camera.lookAt(lookTarget);
    }

    renderer.render(scene, camera);

    requestAnimationFrame(tick);
};

tick();

// Enable Next Page after the messages
setTimeout(() => {
    const nextButton = document.getElementById("nextButton");

    if (nextButton) {
        nextButton.style.pointerEvents = "auto";
    }
}, 18000);
