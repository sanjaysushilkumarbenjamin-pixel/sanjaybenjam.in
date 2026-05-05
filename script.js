// ===== V5 INTERACTIVE PARTICLE SYSTEM =====

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
const particlesCount = 800;
const positions = [];
const geometry = new THREE.BufferGeometry();

for (let i = 0; i < particlesCount; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;

  positions.push(x, y, z);
}

geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 0.03,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// CONNECTION LINES
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.2
});

const lineGeometry = new THREE.BufferGeometry();

camera.position.z = 5;

// MOUSE
let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  particles.rotation.y += 0.0005;

  // PARALLAX
  camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 1.5 - camera.position.y) * 0.05;

  // CONNECTION LOGIC
  const pos = geometry.attributes.position.array;
  const linePositions = [];

  for (let i = 0; i < particlesCount; i++) {
    for (let j = i + 1; j < particlesCount; j++) {
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 1.2) {
        linePositions.push(
          pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
          pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
        );
      }
    }
  }

  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

  scene.children = scene.children.filter(obj => obj.type !== "LineSegments");
  scene.add(lines);

  renderer.render(scene, camera);
}

animate();

// RESIZE
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
