// ===============================
// INIT GSAP
// ===============================
gsap.registerPlugin(ScrollTrigger);

// ===============================
// CURSOR GLOW
// ===============================
const glow = document.querySelector(".cursor-glow");

window.addEventListener("mousemove", (e) => {
  if (glow) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});

// ===============================
// THREE.JS PARTICLES (STABLE VERSION)
// ===============================
const canvas = document.getElementById("bg");

if (canvas) {

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  // PARTICLES
  const particlesCount = 700;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    size: 0.025,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.7
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 5;

  // MOUSE
  let mouse = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ANIMATION LOOP
  function animate() {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    // PARALLAX
    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 1.2 - camera.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // RESIZE FIX
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// ===============================
// HERO CINEMATIC ANIMATION
// ===============================
gsap.from(".hero-content h1", {
  opacity: 0,
  y: 80,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".hero-content p", {
  opacity: 0,
  y: 40,
  delay: 0.3,
  stagger: 0.2,
  duration: 1
});

// ===============================
// HERO SCROLL PARALLAX
// ===============================
gsap.to(".hero-content", {
  y: -100,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// ===============================
// SECTION REVEALS
// ===============================
gsap.utils.toArray("section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 60,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 85%"
    }
  });
});

// ===============================
// CARDS ANIMATION
// ===============================
gsap.from(".card", {
  opacity: 0,
  y: 100,
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".cards",
    start: "top 85%"
  }
});

// ===============================
// CTA ANIMATION
// ===============================
gsap.from(".lead", {
  opacity: 0,
  scale: 0.95,
  scrollTrigger: {
    trigger: ".lead",
    start: "top 85%"
  }
});

const isMobile = window.innerWidth < 768;
const particlesCount = isMobile ? 400 : 700;

// 3D TILT EFFECT
const card = document.querySelector(".profile-image");

if (card) {

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    card.querySelector("img").style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.querySelector("img").style.transform =
      "rotateX(0) rotateY(0) scale(1)";
  });

}

if (window.innerWidth < 768) {
  const img = document.querySelector(".profile-image img");
  if (img) {
    img.style.transform = "none";
  }
}


