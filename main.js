const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// full‑screen canvas
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let t = 0;
const E = Math.E;

// last endpoint for trail
let lastX = null;
let lastY = null;

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  // clear only the arms area lightly (keep old trail)
  // comment these two lines if you want *absolutely* no clearing
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, w, h);

  const L1 = Math.min(w, h) * 0.25;
  const L2 = Math.min(w, h) * 0.18;
  const base = 0.012;

  // first hand angle
  const theta1 =
    base * t +
    0.5 * Math.sin(E * base * t * 0.5);

  // second hand angle (e times faster + wobble)
  const theta2 =
    E * base * t +
    0.8 * Math.sin(base * t) +
    0.35 * Math.cos(E * base * t * 0.3);

  // joint and endpoint positions
  const jx = cx + L1 * Math.cos(theta1);
  const jy = cy + L1 * Math.sin(theta1);
  const ex = jx + L2 * Math.cos(theta2);
  const ey = jy + L2 * Math.sin(theta2);

  // trail: only draw a new segment from previous endpoint
  if (lastX !== null && lastY !== null) {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }
  lastX = ex;
  lastY = ey;

  // draw first hand
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(jx, jy);
  ctx.stroke();

  // draw second hand
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(jx, jy);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  // joints
  ctx.fillStyle = '#888888';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(jx, jy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
  ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();
