const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
const navbar = document.querySelector(".navbar");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// navabr part animatsiyasi
burger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burger.classList.toggle("toggle");
  });
  
  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
// Particle setup
const particles = [];
const numParticles = 100;

for (let i = 0; i < numParticles; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 1.5,
    dy: (Math.random() - 0.5) * 1.5,
    radius: 2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw particles
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00cfff";
    ctx.fill();
  });

  // Draw connecting lines
  for (let i = 0; i < numParticles; i++) {
    for (let j = i + 1; j < numParticles; j++) {
      let distX = particles[i].x - particles[j].x;
      let distY = particles[i].y - particles[j].y;
      let dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 207, 255, 0.3)";
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();


burger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  burger.classList.toggle("toggle");
});
// Simple form handling (demo only)
document.querySelector(".contact-form").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for contacting us! 🚀 We’ll reply soon.");
    this.reset();
  });
  // ====== HERO 3D BACKGROUND (Three.js) ======
(function initHero3D() {
  const container = document.getElementById("hero-3d");
  if (!container || !window.THREE) return;

  // Scene / Camera / Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.6, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x88ffff, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.PointLight(0x00f5ff, 1.2, 20);
  keyLight.position.set(2, 2, 3);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x0099ff, 1.0, 20);
  rimLight.position.set(-2, -1, -2);
  scene.add(rimLight);

  // 3D Object: torus knot (feels like a futuristic gear)
  const geo = new THREE.TorusKnotGeometry(0.8, 0.22, 180, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0c1f2b,
    metalness: 0.8,
    roughness: 0.25,
    emissive: 0x002a35,
    emissiveIntensity: 0.6
  });
  const knot = new THREE.Mesh(geo, mat);
  scene.add(knot);

  // Wireframe overlay (neon)
  const wire = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const knotWire = new THREE.Mesh(geo.clone(), wire);
  scene.add(knotWire);

  // Starfield
  const starGeom = new THREE.BufferGeometry();
  const starCount = 600;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPos[i] = (Math.random() - 0.5) * 30;
    starPos[i + 1] = (Math.random() - 0.5) * 20;
    starPos[i + 2] = (Math.random() - 0.5) * 30;
  }
  starGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.02, transparent: true, opacity: 0.6 });
  const stars = new THREE.Points(starGeom, starMat);
  scene.add(stars);

  // Parallax on mouse
  const target = { x: 0, y: 0 };
  container.addEventListener("mousemove", (e) => {
    const r = container.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    target.x = (x - 0.5) * 0.7; // sensitivity
    target.y = (y - 0.5) * 0.5;
  });

  // Handle resize
  function onResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onResize);

  // Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // gentle rotation
    knot.rotation.x += 0.004;
    knot.rotation.y += 0.006;
    knotWire.rotation.copy(knot.rotation);

    stars.rotation.y += 0.0008;

    // parallax
    camera.position.x += (target.x - camera.position.x) * 0.04;
    camera.position.y += (-target.y - camera.position.y + 0.6) * 0.04; // keep slight upward tilt
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  // Start
  onResize();
  animate();
})();
