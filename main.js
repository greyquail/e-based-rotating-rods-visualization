const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

let t = 0;
const E = Math.E;
const path = [];           // trail of second-hand endpoint

function draw() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width  / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  const L1 = Math.min(w, h) * 0.22;   // both hands same length
  const L2 = Math.min(w, h) * 0.22;

  const theta1 = 0.01 * t;            // first hand angle
  const theta2 = E * theta1;          // second hand angle (ratio = e)

  const jx = cx + L1 * Math.cos(theta1);
  const jy = cy + L1 * Math.sin(theta1);
  const ex = jx + L2 * Math.cos(theta2);
  const ey = jy + L2 * Math.sin(theta2);

  // store only endpoint of second hand
  path.push({ x: ex, y: ey });

  // clear frame
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // draw smooth trail from all previous endpoints
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  path.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // draw hands
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();  // first
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();  // second

  // joints and drawing point
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(jx, jy, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(draw);
}

draw();
