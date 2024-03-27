import * as THREE from "./modules/build/three.module.js";
import { FlyControls } from "./modules/FlyControls.js";
import { Lensflare, LensflareElement } from "./modules/Lensflare.js" ;

let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();

// animate()
init();

function init() {
  // camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );
  camera.position.z = 250;

  // scene
  scene = new THREE.Scene();
  // scene.background = new THREE.Color().setHSL(0.1, 0.8, 0.07); //h,s,l = 「色相(Hue)」「彩度(Saturation)」「輝度（Lightness)」
  // scene.fog = new THREE.Fog(scene.background, 3500, 15000);

  // geometry
  const size = 250;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff, //鏡面反射
    shininess: 50, //輝度 // luminance
  });

  for (let i = 0; i < 2500; i++) {
    const mesh = new THREE.Mesh(geometry, material);

    //Positon random
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    // Rotation degree and random selection
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    scene.add(mesh);
  }

  //Parallel light source
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
  scene.add(dirLight);

  // Add lensFraire
  const textureLoader = new THREE.TextureLoader();
  const textureFlare = textureLoader.load('./textures/LensFlare.png');


  addLight(0.08, 0.3, 0.9, 0, 0, -1000);

  // Add a point light source
  function addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 0.7, 2000); //color, intensity, attenuation
    // light.color.setHSL(h, s, l);
    // light.position.set(x, y, z);
    dirLight.position.set(0, -3, 0).normalize(); //Y軸下方向から光源が出てる。
    dirLight.color.setHSL(0.1, 0.3, 0.5);
    scene.add(addLight);

    const lensflare = new Lensflare();
    lensflare.addElement(
        new LensflareElement(textureFlare, 700, 0, light.color)
    );

    scene.add(lensflare);
  }

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding; // more light
  document.body.appendChild(renderer.domElement);

  // function of mouse
  controls = new FlyControls(camera, renderer.domElement);

    controls.movementSpeed = 2500;
    controls.rollSpeed = Math.PI / 20;

  animate();
  //   renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

    const delta = clock.getDelta(); //Get elapsed time
    controls.update(delta);
  renderer.render(scene, camera);
}
