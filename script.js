/* =========================
THREE.JS PARTICLE SYSTEM
========================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
camera.position.z = 30;

/* PARTICLES */

const particlesGeometry = new THREE.BufferGeometry();

const particlesCount = 2500;

const posArray = new Float32Array(
  particlesCount * 3
);

for (let i = 0; i < particlesCount * 3; i++) {

  posArray[i] = (Math.random() - 0.5) * 120;

}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(posArray, 3)
);

/* MATERIAL */

const particlesMaterial = new THREE.PointsMaterial({

  size: 0.08,

  color: 0x00ffff,

  transparent: true,

  opacity: 0.7
});

/* MESH */

const particlesMesh = new THREE.Points(
  particlesGeometry,
  particlesMaterial
);

scene.add(particlesMesh);

/* MOUSE */

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {

  mouseX = event.clientX;
  mouseY = event.clientY;

});

/* ANIMATION */

function animate() {

  requestAnimationFrame(animate);

  particlesMesh.rotation.y += 0.0008;
  particlesMesh.rotation.x += 0.0003;

  particlesMesh.rotation.y +=
    (mouseX * 0.0000008);

  particlesMesh.rotation.x +=
    (mouseY * 0.0000008);

  renderer.render(scene, camera);
}

animate();

/* RESPONSIVE */

window.addEventListener("resize", () => {

  camera.aspect =
    window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

});

/* =========================
GSAP ANIMATIONS
========================= */

gsap.registerPlugin(ScrollTrigger);

/* HERO */

gsap.from(".hero-content", {

  opacity: 0,
  y: 100,

  duration: 1.4,

  ease: "power4.out"
});

/* NAV */

gsap.from(".nav", {

  opacity: 0,
  y: -40,

  duration: 1
});

/* CARDS */

gsap.from(".card", {

  scrollTrigger: {
    trigger: ".cards",
    start: "top 80%"
  },

  opacity: 0,
  y: 80,

  stagger: 0.2,

  duration: 1.2,

  ease: "power3.out"
});

/* BIO */

gsap.from(".profile-image", {

  scrollTrigger: {
    trigger: ".bio",
    start: "top 80%"
  },

  opacity: 0,
  x: -100,

  duration: 1.2
});

gsap.from(".bio-content", {

  scrollTrigger: {
    trigger: ".bio",
    start: "top 80%"
  },

  opacity: 0,
  x: 100,

  duration: 1.2
});
