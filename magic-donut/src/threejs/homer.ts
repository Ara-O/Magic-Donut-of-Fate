import * as THREE from "three";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Homer from "../assets/homer.jpg";
let scene: THREE.Scene;
let camera: THREE.Camera;
let homer: THREE.Mesh;
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

  let textureLoader = new THREE.TextureLoader();
  const homerTexture = textureLoader.load(Homer, () => {
    homer = new THREE.Mesh(
      new THREE.SphereGeometry(14),
      new THREE.MeshBasicMaterial({
        map: homerTexture,
      })
    );
    scene.add(homer);
  });

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
  renderer.render(scene, camera);
}
