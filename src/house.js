import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* Placeholder massing for Hephaestus Hearth.
   Round dimensions below are illustrative. They are not a survey.
   Replace buildPlaceholder() with measured geometry or a loaded model
   and keep the group's ground contact at y = 0. */

const HOME = {
  position: [7.2, 4.9, 12.8],
  target: [0, 2.15, 0.15]
};

function fittedDistance(aspect) {
  const safe = Math.max(aspect || 1, 0.4);
  return 15.1 * Math.max(1, 1.46 / safe);
}

export function startHouse(canvas) {
  const stage = canvas.parentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 760;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(HOME.position[0], HOME.position[1], HOME.position[2]);

  const hemi = new THREE.HemisphereLight(0xc9d6ea, 0x1a2030, 0.78);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xf5f8fc, 1.7);
  key.position.set(-8.2, 12.4, 7.6);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 36;
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -14;
  key.shadow.bias = -0.00018;
  key.shadow.normalBias = 0.035;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xb9c6e6, 0.72);
  rim.position.set(9.5, 6.2, -8);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xd7e4f4, 0.32);
  fill.position.set(1.5, 3.2, 14);
  scene.add(fill);

  const interior = new THREE.PointLight(0xd5eaff, 3.4, 9, 2);
  interior.position.set(-3.1, 1.7, 3.6);
  scene.add(interior);

  const house = buildPlaceholder();
  scene.add(house);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(HOME.target[0], HOME.target[1], HOME.target[2]);
  controls.enableDamping = !reduce;
  controls.dampingFactor = 0.08;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.85;
  controls.minDistance = 8.6;
  controls.maxDistance = 30;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.zoomSpeed = 0.72;
  controls.rotateSpeed = 0.72;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  controls.update();

  const homeDirection = new THREE.Vector3(
    HOME.position[0] - HOME.target[0],
    HOME.position[1] - HOME.target[1],
    HOME.position[2] - HOME.target[2]
  ).normalize();
  const homePosition = new THREE.Vector3();
  const homeTarget = controls.target.clone();
  const offset = new THREE.Vector3();
  const spherical = new THREE.Spherical();
  let userMoved = false;

  function applyHome(moveCamera) {
    const dist = Math.min(controls.maxDistance - 0.4, fittedDistance(camera.aspect));
    homePosition.copy(homeDirection).multiplyScalar(dist).add(homeTarget);
    if (!moveCamera) return;
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
  }

  let idleTimer = 0;
  function pauseAuto() {
    userMoved = true;
    if (reduce) return;
    controls.autoRotate = false;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () {
      controls.autoRotate = true;
    }, 3200);
  }

  controls.addEventListener("start", pauseAuto);

  function nudge(dTheta, dPhi, dRadius) {
    pauseAuto();
    offset.copy(camera.position).sub(controls.target);
    spherical.setFromVector3(offset);
    spherical.theta += dTheta;
    spherical.phi = Math.max(controls.minPolarAngle, Math.min(controls.maxPolarAngle, spherical.phi + dPhi));
    spherical.radius = Math.max(controls.minDistance, Math.min(controls.maxDistance, spherical.radius + dRadius));
    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }

  function reset() {
    userMoved = false;
    applyHome(true);
    if (!reduce) controls.autoRotate = true;
  }

  function onKey(event) {
    const active = document.activeElement;
    if (active !== stage && active !== canvas) return;
    const step = event.shiftKey ? 0.16 : 0.08;
    if (event.key === "ArrowLeft") nudge(step, 0, 0);
    else if (event.key === "ArrowRight") nudge(-step, 0, 0);
    else if (event.key === "ArrowUp") nudge(0, -step, 0);
    else if (event.key === "ArrowDown") nudge(0, step, 0);
    else if (event.key === "+" || event.key === "=") nudge(0, 0, -0.8);
    else if (event.key === "-" || event.key === "_") nudge(0, 0, 0.8);
    else if (event.key === "0" || event.key === "Home") reset();
    else return;
    event.preventDefault();
  }

  function resize() {
    const width = canvas.clientWidth || stage.clientWidth;
    const height = canvas.clientHeight || stage.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    applyHome(!userMoved);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  window.addEventListener("resize", resize);
  window.addEventListener("keydown", onKey);
  resize();

  let running = true;
  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    controls.update();
    renderer.render(scene, camera);
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      return;
    }
    if (!running) {
      running = true;
      frame();
    }
  }

  function onContextLost(event) {
    event.preventDefault();
    running = false;
    stage.classList.add("is-fallback");
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", onVisibility);
  frame();

  return {
    reset,
    dispose() {
      running = false;
      window.clearTimeout(idleTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      controls.dispose();
      renderer.dispose();
    }
  };
}

function buildPlaceholder() {
  const house = new THREE.Group();
  house.name = "placeholder-house";
  house.userData.placeholder = true;
  house.userData.note = "Illustrative boxes and a roof. Not the property.";

  const MAIN = { w: 8.6, d: 7.0, h: 5.45 };
  const WING = { w: 4.7, d: 4.35, h: 2.95 };

  const plaster = new THREE.MeshStandardMaterial({ color: 0xe7eef4, roughness: 0.84, metalness: 0.02 });
  const wingWall = new THREE.MeshStandardMaterial({ color: 0xd5dee8, roughness: 0.86, metalness: 0.02 });
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0xc5d0db, roughness: 0.78, metalness: 0.03 });
  const metal = new THREE.MeshStandardMaterial({
    color: 0x2c3648,
    roughness: 0.42,
    metalness: 0.64,
    side: THREE.DoubleSide
  });
  const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x3c485c, roughness: 0.38, metalness: 0.7 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x151b24, roughness: 0.42, metalness: 0.18 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x6d7886, roughness: 0.92, metalness: 0.04 });
  const lotMat = new THREE.MeshStandardMaterial({ color: 0x151b28, roughness: 0.96, metalness: 0 });
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x1e2736, roughness: 0.9, metalness: 0.02 });
  const glass = new THREE.MeshStandardMaterial({
    color: 0xc9e0ee,
    emissive: 0x93bdd4,
    emissiveIntensity: 0.42,
    metalness: 0.04,
    roughness: 0.08,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const windowGlass = glass.clone();
  windowGlass.opacity = 0.62;
  windowGlass.emissiveIntensity = 0.7;
  windowGlass.depthWrite = true;

  const lot = addBox(house, {
    size: [18.4, 0.16, 15.2],
    position: [0.2, -0.08, 0],
    material: lotMat,
    name: "lot",
    cast: false
  });
  lot.receiveShadow = true;

  const boundary = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8.9, 0.012, -7.4),
      new THREE.Vector3(9.3, 0.012, -7.4),
      new THREE.Vector3(9.3, 0.012, 7.4),
      new THREE.Vector3(-8.9, 0.012, 7.4)
    ]),
    new THREE.LineBasicMaterial({ color: 0xb7c6d6, transparent: true, opacity: 0.32 })
  );
  boundary.name = "lot-line";
  house.add(boundary);

  addBox(house, {
    size: [MAIN.w, 0.42, MAIN.d],
    position: [0, 0.21, 0],
    material: plinthMat,
    name: "plinth"
  });
  addBox(house, {
    size: [MAIN.w, MAIN.h - 0.42, MAIN.d],
    position: [0, 0.42 + (MAIN.h - 0.42) / 2, 0],
    material: plaster,
    name: "main-volume"
  });

  const band = new THREE.MeshStandardMaterial({ color: 0xf7f9fb, roughness: 0.5, metalness: 0.04 });
  addBox(house, {
    size: [5.1, 0.055, 0.06],
    position: [1.55, 2.72, MAIN.d / 2 + 0.03],
    material: band,
    name: "floor-line",
    cast: false,
    receive: false
  });

  const wingX = MAIN.w / 2 + WING.w / 2 - 0.35;
  const wingZ = -0.85;
  addBox(house, {
    size: [WING.w, WING.h, WING.d],
    position: [wingX, WING.h / 2, wingZ],
    material: wingWall,
    name: "wing"
  });
  addBox(house, {
    size: [WING.w + 0.46, 0.12, WING.d + 0.4],
    position: [wingX, WING.h + 0.06, wingZ],
    material: metal,
    name: "wing-roof"
  });

  const roof = new THREE.Mesh(gableRoof(MAIN.w + 0.85, MAIN.d + 0.8, 1.42), metal);
  roof.position.y = MAIN.h;
  roof.name = "main-roof";
  roof.castShadow = true;
  roof.receiveShadow = true;
  house.add(roof);

  addBox(house, {
    size: [MAIN.w + 0.2, 0.07, 0.16],
    position: [0, MAIN.h + 1.45, 0],
    material: ridgeMat,
    name: "ridge",
    receive: false
  });

  addBox(house, {
    size: [0.62, 1.55, 0.62],
    position: [-1.7, MAIN.h + 0.95, -0.15],
    material: stone,
    name: "chimney"
  });
  addBox(house, {
    size: [0.78, 0.08, 0.78],
    position: [-1.7, MAIN.h + 1.74, -0.15],
    material: frameMat,
    name: "chimney-cap",
    receive: false
  });

  addSunroom(house, glass, frameMat, metal);

  addWindow(house, windowGlass, frameMat, { x: -2.55, y: 1.45, z: MAIN.d / 2 + 0.05, w: 1.15, h: 1.35 });
  addWindow(house, windowGlass, frameMat, { x: -0.85, y: 1.45, z: MAIN.d / 2 + 0.05, w: 1.15, h: 1.35 });
  addWindow(house, windowGlass, frameMat, { x: -2.55, y: 3.85, z: MAIN.d / 2 + 0.05, w: 1.15, h: 1.15 });
  addWindow(house, windowGlass, frameMat, { x: -0.85, y: 3.85, z: MAIN.d / 2 + 0.05, w: 1.15, h: 1.15 });
  addWindow(house, windowGlass, frameMat, { x: 1.15, y: 3.85, z: MAIN.d / 2 + 0.05, w: 1.35, h: 1.15 });
  addWindow(house, windowGlass, frameMat, { x: 2.85, y: 3.85, z: MAIN.d / 2 + 0.05, w: 0.95, h: 1.15 });

  addWindow(house, windowGlass, frameMat, { x: MAIN.w / 2 + 0.05, y: 1.7, z: 2.35, w: 1.05, h: 1.2, rotY: Math.PI / 2 });
  addWindow(house, windowGlass, frameMat, { x: MAIN.w / 2 + 0.05, y: 3.9, z: 2.35, w: 1.05, h: 1.05, rotY: Math.PI / 2 });
  addWindow(house, windowGlass, frameMat, {
    x: wingX + WING.w / 2 + 0.04,
    y: 1.55,
    z: wingZ,
    w: 1.25,
    h: 1.1,
    rotY: Math.PI / 2
  });

  addWindow(house, windowGlass, frameMat, { x: wingX - 1.15, y: 1.55, z: wingZ + WING.d / 2 + 0.05, w: 1.2, h: 1.15 });
  addWindow(house, windowGlass, frameMat, { x: wingX + 0.85, y: 1.55, z: wingZ + WING.d / 2 + 0.05, w: 1.2, h: 1.15 });

  const doorX = 1.85;
  const doorZ = MAIN.d / 2 + 0.06;
  addBox(house, {
    size: [1.12, 2.28, 0.06],
    position: [doorX, 1.14, doorZ - 0.02],
    material: frameMat,
    name: "door-frame"
  });
  addBox(house, {
    size: [0.92, 2.05, 0.05],
    position: [doorX, 1.08, doorZ],
    material: new THREE.MeshStandardMaterial({ color: 0x222a36, roughness: 0.55, metalness: 0.12 }),
    name: "door"
  });
  addBox(house, {
    size: [0.28, 0.62, 0.02],
    position: [doorX, 1.62, doorZ + 0.04],
    material: windowGlass,
    name: "door-lite",
    cast: false,
    receive: false
  });
  addBox(house, {
    size: [1.55, 0.06, 0.85],
    position: [doorX, 2.28, doorZ + 0.28],
    material: metal,
    name: "canopy"
  });
  addBox(house, {
    size: [1.7, 0.08, 1.15],
    position: [doorX, 0.04, doorZ + 0.55],
    material: pathMat,
    name: "stoop",
    cast: false
  });
  addBox(house, {
    size: [1.15, 0.04, 3.4],
    position: [doorX, 0.02, doorZ + 2.7],
    material: pathMat,
    name: "path",
    cast: false
  });

  house.position.set(-2.15, 0, -1.15);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(8.2, 48),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.38,
      depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.4, 0.011, 0.1);
  shadow.name = "contact-shadow";
  house.add(shadow);

  return house;
}

function addSunroom(house, glass, frameMat, metal) {
  const x = -2.35;
  const z = 4.35;
  const w = 3.55;
  const d = 2.55;
  const h = 3.05;
  const group = new THREE.Group();
  group.name = "sunroom";
  group.position.set(x, 0, z);

  addBox(group, {
    size: [w, 0.08, d],
    position: [0, 0.04, 0],
    material: frameMat,
    name: "sunroom-floor",
    cast: false
  });
  addBox(group, {
    size: [w + 0.28, 0.1, d + 0.28],
    position: [0, h, 0],
    material: metal,
    name: "sunroom-roof"
  });

  const posts = [
    [-w / 2, d / 2],
    [w / 2, d / 2],
    [-w / 2, -d / 2]
  ];
  posts.forEach(function (corner, index) {
    addBox(group, {
      size: [0.08, h, 0.08],
      position: [corner[0], h / 2, corner[1]],
      material: frameMat,
      name: "post-" + index
    });
  });

  addBox(group, {
    size: [w - 0.08, h - 0.16, 0.04],
    position: [0, h / 2, d / 2],
    material: glass,
    name: "glass-front",
    cast: false,
    receive: false
  });
  addBox(group, {
    size: [0.04, h - 0.16, d - 0.08],
    position: [-w / 2, h / 2, 0],
    material: glass,
    name: "glass-side",
    cast: false,
    receive: false
  });
  addBox(group, {
    size: [w, 0.05, 0.06],
    position: [0, 1.55, d / 2 + 0.02],
    material: frameMat,
    name: "mullion",
    cast: false,
    receive: false
  });
  addBox(group, {
    size: [0.05, h - 0.2, 0.06],
    position: [0, h / 2, d / 2 + 0.02],
    material: frameMat,
    name: "mullion-vertical",
    cast: false,
    receive: false
  });

  house.add(group);
}

function addWindow(parent, glass, frame, spec) {
  const group = new THREE.Group();
  group.name = "window";
  group.position.set(spec.x, spec.y, spec.z);
  group.rotation.y = spec.rotY || 0;
  const depth = 0.06;
  const t = 0.07;
  const bars = [
    [spec.w, t, depth, 0, spec.h / 2 - t / 2, 0],
    [spec.w, t, depth, 0, -spec.h / 2 + t / 2, 0],
    [t, spec.h, depth, spec.w / 2 - t / 2, 0, 0],
    [t, spec.h, depth, -spec.w / 2 + t / 2, 0, 0]
  ];
  bars.forEach(function (bar) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(bar[0], bar[1], bar[2]), frame);
    mesh.position.set(bar[3], bar[4], bar[5]);
    mesh.castShadow = true;
    group.add(mesh);
  });
  const recess = new THREE.Mesh(
    new THREE.BoxGeometry(spec.w - t * 2, spec.h - t * 2, 0.08),
    frame
  );
  recess.position.z = -0.03;
  const pane = new THREE.Mesh(
    new THREE.BoxGeometry(spec.w - t * 2.2, spec.h - t * 2.2, 0.03),
    glass
  );
  pane.position.z = 0.045;
  group.add(recess);
  group.add(pane);
  parent.add(group);
}

function addBox(parent, spec) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(spec.size[0], spec.size[1], spec.size[2]),
    spec.material
  );
  mesh.position.set(spec.position[0], spec.position[1], spec.position[2]);
  mesh.castShadow = spec.cast !== false;
  mesh.receiveShadow = spec.receive !== false;
  if (spec.name) mesh.name = spec.name;
  parent.add(mesh);
  return mesh;
}

function gableRoof(width, depth, rise) {
  const hw = width / 2;
  const hd = depth / 2;
  const positions = [
    -hw, 0, hd, hw, 0, hd, hw, rise, 0,
    -hw, 0, hd, hw, rise, 0, -hw, rise, 0,
    hw, 0, -hd, -hw, 0, -hd, -hw, rise, 0,
    hw, 0, -hd, -hw, rise, 0, hw, rise, 0,
    -hw, 0, hd, -hw, rise, 0, -hw, 0, -hd,
    hw, 0, -hd, hw, rise, 0, hw, 0, hd
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}
