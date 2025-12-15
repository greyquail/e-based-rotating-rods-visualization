const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // clear once when size changes
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let t = 0;
const E = Math.E;

// last endpoint position (start at center)
let lastX = canvas.width / (window.devicePixelRatio || 1) / 2;
let lastY = canvas.height / (window.devicePixelRatio || 1) / 2;

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  const L1 = Math.min(w, h) * 0.25;
  const L2 = Math.min(w, h) * 0.18;
  const base = 0.012;

  const theta1 =
    base * t +
    0.5 * Math.sin(E * base * t * 0.5);

  const theta2 =
    E * base * t +
    0.8 * Math.sin(base * t) +
    0.35 * Math.cos(E * base * t * 0.3);

  const jx = cx + L1 * Math.cos(theta1);
  const jy = cy + L1 * Math.sin(theta1);
  const ex = jx + L2 * Math.cos(theta2);
  const ey = jy + L2 * Math.sin(theta2);

  // draw ONLY from previous endpoint to new endpoint
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // update last point
  lastX = ex;
  lastY = ey;

  t++;
  requestAnimationFrame(animate);
}

animate();
