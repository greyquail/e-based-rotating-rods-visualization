const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// fullscreen canvas
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let t = 0;
const E = Math.E;

// store only the endpoint path
const path = [];   // {x,y}

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  // NO CLEARING – pattern accumulates over time

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

  // record endpoint only
  path.push({ x: ex, y: ey });

  // draw ONE continuous curve of the endpoint path
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  path.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // optional: draw arms (if you don't want them, delete this block)
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();

  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(jx, jy, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();
