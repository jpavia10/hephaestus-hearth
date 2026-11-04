import * as THREE from "three";

/* Cool-midnight dust behind the desk.
   The Prometheus Hub field is a scroll-morph simulation in ember and gold.
   This one stays silver, pearl, and muted lavender, and it does not morph. */

const vert = /* glsl */ `
uniform float uTime;
uniform float uSize;
attribute float aSeed;
varying float vSeed;
void main() {
  vec3 pos = position;
  pos.x += sin(uTime * 0.15 + aSeed * 12.0) * 0.028;
  pos.y += cos(uTime * 0.12 + aSeed * 9.0) * 0.02;
  vec4 mv = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  vSeed = aSeed;
  float size = uSize * mix(0.65, 1.75, aSeed);
  gl_PointSize = size * (190.0 / max(0.55, -mv.z));
  gl_PointSize = clamp(gl_PointSize, 1.0, 26.0);
}
`;

const frag = /* glsl */ `
precision highp float;
varying float vSeed;
void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;
  float glow = clamp(0.04 / max(d, 0.018) - 0.07, 0.0, 0.8);
  float core = smoothstep(0.5, 0.05, d) * 0.32;
  float alpha = max(glow, core);
  if (alpha < 0.02) discard;
  vec3 steel = vec3(0.58, 0.72, 0.88);
  vec3 pearl = vec3(0.94, 0.96, 1.0);
  vec3 lav = vec3(0.73, 0.75, 0.92);
  vec3 color = mix(steel, pearl, smoothstep(0.12, 0.7, glow));
  color = mix(color, lav, vSeed * 0.42);
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(Math.PI * 2 * v);
}

export function startField(canvas) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 720px)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "default"
  });
  renderer.setClearColor(0x05060a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
  camera.position.set(0, 0.08, 4.35);

  const count = small ? 2800 : 5600;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const x = gauss() * 1.05;
    const y = gauss() * 0.7;
    const z = gauss() * 0.55;
    positions[i * 3] = x * 1.15 + y * 0.22;
    positions[i * 3 + 1] = y * 1.02;
    positions[i * 3 + 2] = z;
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: small ? 5.2 : 6.4 }
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  function onPointer(event) {
    pointer.x = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    pointer.y = (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1;
  }

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (height < 1) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  window.addEventListener("resize", resize);
  if (!reduce) window.addEventListener("pointermove", onPointer);
  resize();

  let running = true;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    const time = reduce ? 0 : clock.getElapsedTime();
    material.uniforms.uTime.value = time;
    if (!reduce) {
      points.rotation.y = time * 0.025;
      points.rotation.x = Math.sin(time * 0.08) * 0.04;
      const targetX = pointer.x * 0.16;
      const targetY = 0.08 - pointer.y * 0.06;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY - camera.position.y) * 0.04;
    }
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      return;
    }
    if (!running) {
      running = true;
      clock.getDelta();
      frame();
    }
  }

  document.addEventListener("visibilitychange", onVisibility);
  frame();

  return function dispose() {
    running = false;
    resizeObserver.disconnect();
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
