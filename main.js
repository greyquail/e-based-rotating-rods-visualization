const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// full‑screen canvas with devicePixelRatio
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);   // 1 unit = 1 CSS px
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// time and math
let t = 0;
const E = Math.E;

// store ALL points, never removed
const trail = [];

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  // NO CLEARING – every frame draws on top of previous frames

  // arm params
  const L1 = Math.min(w, h) * 0.18;
  const L2 = Math.min(w, h) * 0.12;
  const omega1 = 0.02;
  const omega2 = E * omega1;

  const theta1 = omega1 * t;
  const theta2 = omega2 * t;

  const jx = cx + L1 * Math.cos(theta1);
  const jy = cy + L1 * Math.sin(theta1);
  const ex = jx + L2 * Math.cos(theta2);
  const ey = jy + L2 * Math.sin(theta2);

  // record endpoint forever
  trail.push({ x: ex, y: ey });

  // draw full accumulated path
  ctx.strokeStyle = 'rgba(0,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  trail.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // optional arms + nodes (can comment out if you want only the path)
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();

  ctx.fillStyle = '#00ffff';
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(jx, jy, 4, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ff00ff';
  ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();
