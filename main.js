const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// full‑screen canvas
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// time, constant, and infinite trail
let t = 0;
const E = Math.E;
const trail = [];   // stores {x,y,hue}

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  // NO CLEAR – everything accumulates forever

  // arm lengths relative to screen
  const L1 = Math.min(w, h) * 0.25;
  const L2 = Math.min(w, h) * 0.18;

  const base = 0.012;

  // richer e-based motion
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

  // color based on time
  const hue = (t * 0.3) % 360;
  trail.push({ x: ex, y: ey, hue });

  // draw colored segments for whole history
  ctx.lineWidth = 2;
  for (let i = 1; i < trail.length; i++) {
    const p0 = trail[i - 1];
    const p1 = trail[i];
    ctx.strokeStyle = `hsl(${p1.hue}, 100%, 60%)`;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  // optional arms + joints (can remove if you want only the trail)
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();

  ctx.fillStyle = '#00ffff';
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(jx, jy, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();
