const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

// store the full path of the endpoint
const path = [];

function animate() {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  const cx = w / 2;
  const cy = h / 2;

  // base radius
  const R = Math.min(w, h) * 0.45;

  // two “clock hands” on the same circle:
  // first hand angle θ
  // second hand angle e·θ (irrational ratio)
  const theta = 0.01 * t;
  const thetaE = E * theta;

  // endpoints of the two hands on the circle
  const x1 = cx + R * Math.cos(theta);
  const y1 = cy + R * Math.sin(theta);

  const x2 = cx + R * Math.cos(thetaE);
  const y2 = cy + R * Math.sin(thetaE);

  // the moving point is the *vector sum* of the two hands
  const px = cx + (x1 - cx) + (x2 - cx);
  const py = cy + (y1 - cy) + (y2 - cy);

  path.push({ x: px, y: py });

  // clear once per frame to keep lines crisp
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);

  // outer reference circle (like pi image)
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // draw full path (smooth petals)
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
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x2, y2); ctx.stroke();

  // joints and moving point
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();

  t++;
  requestAnimationFrame(animate);
}

animate();
