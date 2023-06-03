import * as THREE from "three";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene: THREE.Scene;
let camera: THREE.Camera;
let donut: THREE.Mesh;
let renderer: THREE.Renderer;

export default function createDonut(canvas: HTMLCanvasElement) {
  let sizes = {
    width: canvas.width,
    height: canvas.height,
    aspectRatio: canvas.width / canvas.height,
  };

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, sizes.aspectRatio, 0.1, 100);
  camera.position.z = 30;
  const controls = new ArcballControls(camera, canvas);
  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });
  controls.enableZoom = false;
  scene.add(camera);

  donut = new THREE.Mesh(
    new THREE.TorusGeometry(10, 4.5, 16, 100),
    new THREE.MeshNormalMaterial()
  );

  scene.add(donut);
  scene.background = null;
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });

  //@ts-expect-error
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  donut.rotation.y += 0.01;
  renderer.render(scene, camera);
}
