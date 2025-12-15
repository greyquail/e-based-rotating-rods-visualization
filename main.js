const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// high-res full-screen canvas
function resize() {
  const dpr = window.devicePixelRatio || 1;
  const rectW = window.innerWidth;
  const rectH = window.innerHeight;
  canvas.width  = rectW * dpr;
  canvas.height = rectH * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 1 unit = 1 CSS px
}
window.addEventListener('resize', resize);
resize();

let t = 0;
const E = Math.E;
const path = [];

function draw() {
  const w = canvas.width  / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  const cx = w / 2;
  const cy = h / 2;

  // both hands same radius R
  const R = Math.min(w, h) * 0.35;

  const theta1 = 0.015 * t;
  const theta2 = E * theta1;

  const x1 = cx + R * Math.cos(theta1);
  const y1 = cy + R * Math.sin(theta1);
  const x2 = cx + R * Math.cos(theta2);
  const y2 = cy + R * Math.sin(theta2);

  // endpoint is sum of hands, scaled down
  const ex = cx + (x1 - cx + x2 - cx) * 0.5;
  const ey = cy + (y1 - cy + y2 - cy) * 0.5;

  path.push({ x: ex, y: ey });

  // clear each frame for crisp lines
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // reference circle
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // smooth trail (limited window for perf)
  const N = 4000;
  const start = Math.max(0, path.length - N);
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = start; i < path.length; i++) {
    const p = path[i];
    if (i === start) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  // hands (same length)
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();

  // joints + moving point
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(draw);
}

draw();
