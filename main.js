const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;
const E = Math.E;
const path = [];  // only endpoint points

function draw() {
  const w  = canvas.width;
  const h  = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const L1 = Math.min(w, h) * 0.25;
  const L2 = Math.min(w, h) * 0.18;

  const theta1 = 0.02 * t;
  const theta2 = E * theta1;

  const jx = cx + L1 * Math.cos(theta1);
  const jy = cy + L1 * Math.sin(theta1);
  const ex = jx + L2 * Math.cos(theta2);
  const ey = jy + L2 * Math.sin(theta2);

  // store only the endpoint path
  path.push({ x: ex, y: ey });

  // clear frame
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // smooth continuous trail
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  path.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // hands
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();

  // joints
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(jx, jy, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(draw);
}

draw();
