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

