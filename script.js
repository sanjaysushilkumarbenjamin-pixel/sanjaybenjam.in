// INTERACTIVE THREE.JS PARTICLES

const canvas = document.getElementById("bg");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// PARTICLES
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positions = new Float32Array(particlesCount * 3);
const originalPositions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  const val = (Math.random() - 0.5) * 10;
  positions[i] = val;
  originalPositions[i] = val;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// MATERIAL
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0x00ffff,
  transparent: true,
  opacity: 0.8
});

// MESH
const particlesMesh = new THREE.Points(
  particlesGeometry,
  particlesMaterial
);

scene.add(particlesMesh);

camera.position.z = 5;

// 🖱️ MOUSE TRACKING
let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
});

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  // subtle rotation
  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0002;

  // PARALLAX CAMERA
camera.position.x += (mouse.x * 2 - camera.position.x) * 0.08;
camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.08;

  // PARTICLE WAVE MOTION
  const pos = particlesGeometry.attributes.position.array;

  for (let i = 0; i < pos.length; i += 3) {
    const x = originalPositions[i];
    const y = originalPositions[i + 1];

    pos[i + 2] =
      originalPositions[i + 2] +
      Math.sin(Date.now() * 0.001 + x + y) * 0.05;
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg") });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ffff });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.002;
  sphere.rotation.y += 0.003;
  renderer.render(scene, camera);
}

animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    ctx.fillStyle = "cyan";
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  requestAnimationFrame(animate);
}

animate();

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.refresh();

// HERO TEXT REVEAL
gsap.from(".hero-content h1", {
  opacity: 0,
  y: 50,
  duration: 1.5
});

// SECTIONS FADE IN
gsap.utils.toArray("section").forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 80,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%"
    }
  });
});


document.addEventListener("mousemove", e => {
  document.body.style.backgroundPosition = `${e.clientX}px ${e.clientY}px`;
});

gsap.from(".card", {
  opacity: 0,
  y: 80,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: ".cards",
    start: "top 80%"
  }
});

gsap.from(".authority div", {
  opacity: 0,
  y: 30,
  stagger: 0.2,
  duration: 1,
  scrollTrigger: {
    trigger: ".authority",
    start: "top 80%"
  }
});

gsap.from(".story h2, .story p, .story h3", {
  opacity: 0,
  y: 40,
  stagger: 0.3,
  duration: 1,
  scrollTrigger: {
    trigger: ".story",
    start: "top 80%"
  }
});

gsap.to(".hero-content", {
  y: 10,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: "power1.inOut"
});

const glow = document.querySelector(".cursor-glow");

window.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

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
  duration: 1,
  delay: 0.3
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

const glow = document.querySelector(".cursor-glow");

window.addEventListener("mousemove", (e) => {

  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";

});

window.addEventListener("mousemove", (e) => {

  const x = (window.innerWidth / 2 - e.clientX) / 40;
  const y = (window.innerHeight / 2 - e.clientY) / 40;

  gsap.to(".hero-content", {
    x: -x,
    y: -y,
    duration: 1.5
  });

});
