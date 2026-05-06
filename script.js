/* ===================================
AI NEURAL NETWORK BACKGROUND
=================================== */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 40;

/* RENDERER */

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  alpha: true,
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.setPixelRatio(
  window.devicePixelRatio
);

renderer.setClearColor(0x000000, 0);

/* PARTICLES */

const particlesCount = 160;

const positions = [];
const velocities = [];

for (let i = 0; i < particlesCount; i++) {

  positions.push({
    x: (Math.random() - 0.5) * 80,
    y: (Math.random() - 0.5) * 80,
    z: (Math.random() - 0.5) * 80
  });

  velocities.push({
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
  });

}

/* GEOMETRY */

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array(
  particlesCount * 3
);

for (let i = 0; i < particlesCount; i++) {

  vertices[i * 3] =
    positions[i].x;

  vertices[i * 3 + 1] =
    positions[i].y;

  vertices[i * 3 + 2] =
    positions[i].z;
}

geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(vertices, 3)
);

/* MATERIAL */

const material = new THREE.PointsMaterial({

  color: 0x00ffff,

  size: 0.18,

  transparent: true,

  opacity: 0.85
});

/* POINTS */

const points = new THREE.Points(
  geometry,
  material
);

scene.add(points);

/* LINE CONNECTIONS */

const lineMaterial = new THREE.LineBasicMaterial({

  color: 0x00ffff,

  transparent: true,

  opacity: 0.12
});

let linesMesh;

/* MOUSE */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {

  mouseX =
    (e.clientX / window.innerWidth - 0.5) * 2;

  mouseY =
    (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ANIMATION */

function animate() {

  requestAnimationFrame(animate);

  /* MOVE PARTICLES */

  const posArray =
    geometry.attributes.position.array;

  for (let i = 0; i < particlesCount; i++) {

    positions[i].x += velocities[i].x;
    positions[i].y += velocities[i].y;
    positions[i].z += velocities[i].z;

    /* BOUNDS */

    if (positions[i].x > 40 || positions[i].x < -40)
      velocities[i].x *= -1;

    if (positions[i].y > 40 || positions[i].y < -40)
      velocities[i].y *= -1;

    if (positions[i].z > 40 || positions[i].z < -40)
      velocities[i].z *= -1;

    posArray[i * 3] =
      positions[i].x;

    posArray[i * 3 + 1] =
      positions[i].y;

    posArray[i * 3 + 2] =
      positions[i].z;
  }

  geometry.attributes.position.needsUpdate = true;

  /* REMOVE OLD LINES */

  if (linesMesh) {
    scene.remove(linesMesh);
  }

  /* CREATE CONNECTIONS */

  const linePositions = [];

  for (let i = 0; i < particlesCount; i++) {

    for (let j = i + 1; j < particlesCount; j++) {

      const dx =
        positions[i].x - positions[j].x;

      const dy =
        positions[i].y - positions[j].y;

      const dz =
        positions[i].z - positions[j].z;

      const distance =
        Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < 12) {

        linePositions.push(
          positions[i].x,
          positions[i].y,
          positions[i].z
        );

        linePositions.push(
          positions[j].x,
          positions[j].y,
          positions[j].z
        );
      }
    }
  }

  const lineGeometry =
    new THREE.BufferGeometry();

  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      linePositions,
      3
    )
  );

  linesMesh = new THREE.LineSegments(
    lineGeometry,
    lineMaterial
  );

  scene.add(linesMesh);

  /* SUBTLE ROTATION */

  scene.rotation.y += 0.0008;

  /* MOUSE PARALLAX */

  scene.rotation.x +=
    (mouseY * 0.02 - scene.rotation.x) * 0.02;

  scene.rotation.y +=
    (mouseX * 0.02 - scene.rotation.y) * 0.02;

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

/* ===================================
GSAP PREMIUM ANIMATIONS
=================================== */

gsap.registerPlugin(ScrollTrigger);

/* HERO */

gsap.from(".hero-content", {

  opacity: 0,
  y: 100,

  duration: 1.5,

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

/* ===================================
MAGNETIC BUTTONS
=================================== */

const buttons =
  document.querySelectorAll(".btn-primary");

buttons.forEach(btn => {

  btn.addEventListener("mousemove", (e) => {

    const rect =
      btn.getBoundingClientRect();

    const x =
      e.clientX - rect.left - rect.width / 2;

    const y =
      e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.18,
      y: y * 0.18,
      duration: 0.3
    });

  });

  btn.addEventListener("mouseleave", () => {

    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1,0.3)"
    });

  });

});

/* ===================================
COUNTERS
=================================== */

const counters =
  document.querySelectorAll(".counter");

counters.forEach(counter => {

  const target =
    +counter.getAttribute("data-target");

  ScrollTrigger.create({

    trigger: counter,

    start: "top 85%",

    once: true,

    onEnter: () => {

      let current = 0;

      const updateCounter = () => {

        const increment =
          target / 60;

        current += increment;

        if (current < target) {

          counter.innerText =
            Math.ceil(current);

          requestAnimationFrame(updateCounter);

        } else {

          counter.innerText = target;
        }
      };

      updateCounter();
    }
  });

});
