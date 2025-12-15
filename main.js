const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// full‑screen canvas
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // clear once on resize
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// parametric curve using e as irrational ratio
function getPoint(theta, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.42;

  // z(θ) = e^{iθ} + e^{i e θ} (real + imaginary parts)
  const x = Math.cos(theta) + Math.cos(Math.E * theta);
  const y = Math.sin(theta) + Math.sin(Math.E * theta);

  return {
    x: cx + (x / 2) * R,
    y: cy + (y / 2) * R
  };
}

let lastTheta = 0;
let lastPoint = null;

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;

  const theta = lastTheta + 0.02;      // increases forever
  const p = getPoint(theta, w, h);

  if (!lastPoint) {
    lastPoint = getPoint(0, w, h);
  }

  // single clean, uniform stroke each frame (no segments clutter)
  ctx.strokeStyle = '#cccccc';         // soft gray like the pi image
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();

  lastPoint = p;
  lastTheta = theta;

  requestAnimationFrame(animate);
}

animate();
