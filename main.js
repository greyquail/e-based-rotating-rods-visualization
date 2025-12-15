// ========= canvas + resize =========
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // keep 1 CSS px = 1 unit
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// convenience
function clearFull() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
clearFull();

const width = () => canvas.width;
const height = () => canvas.height;
const centerX = () => width() / 2;
const centerY = () => height() / 2;

// ========= state =========
let animationId = null;
let currentMode = null;
let speed = 1.0;
let time = 0;

const trail = [];
const maxTrailLength = 500;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

canvas.style.cursor = 'grab';

// ========= digits of e (short prefix is enough) =========
const E_DIGITS =
    "2718281828459045235360287471352662497757247093699959574966967627724";

// ========= UI wiring =========
document.getElementById('rodsBtn').addEventListener('click', startRods);
document.getElementById('walkBtn').addEventListener('click', startWalk);
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('resetViewBtn').addEventListener('click', resetView);

const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', e => {
    speed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = speed.toFixed(1);
});

// mouse / touch for zoom + pan
canvas.addEventListener('wheel', handleZoom, { passive: false });
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseleave', handleMouseUp);

// ========= transforms =========
function applyTransform() {
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
}

function resetTransform() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function resetView() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
}

// ========= zoom + pan handlers =========
function handleZoom(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * zoomFactor;
    if (newScale < 0.1 || newScale > 10) return;

    offsetX = x - (x - offsetX) * zoomFactor;
    offsetY = y - (y - offsetY) * zoomFactor;
    scale = newScale;
}

function handleMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    canvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (!isDragging) return;
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
}

function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
}

// ========= animation control =========
function stopAnimation() {
    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function setActiveButton(id) {
    document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function clearCanvas() {
    stopAnimation();
    trail.length = 0;
    time = 0;
    resetView();
    clearFull();
    document.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    currentMode = null;
}

// ========= rotating rods (ratio = e) =========
const E = Math.E;

function startRods() {
    stopAnimation();
    setActiveButton('rodsBtn');
    currentMode = 'rods';
    trail.length = 0;
    time = 0;
    animateRods();
}

function animateRods() {
    if (currentMode !== 'rods') return;

    // background
    resetTransform();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, width(), height());

    applyTransform();

    const L1 = 150;
    const L2 = 100;
    const omega1 = 0.02 * speed;
    const omega2 = E * omega1;

    const theta1 = omega1 * time;
    const theta2 = omega2 * time;

    const cx = centerX();
    const cy = centerY();
    const jx = cx + L1 * Math.cos(theta1);
    const jy = cy + L1 * Math.sin(theta1);
    const ex = jx + L2 * Math.cos(theta2);
    const ey = jy + L2 * Math.sin(theta2);

    trail.push({ x: ex, y: ey });
    if (trail.length > maxTrailLength) trail.shift();

    ctx.strokeStyle = 'rgba(0,255,255,0.6)';
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3 / scale;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(jx, jy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(jx, jy); ctx.lineTo(ex, ey); ctx.stroke();

    ctx.fillStyle = '#00ffff';
    ctx.beginPath(); ctx.arc(cx, cy, 5 / scale, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(jx, jy, 4 / scale, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#ff00ff';
    ctx.beginPath(); ctx.arc(ex, ey, 6 / scale, 0, Math.PI * 2); ctx.fill();

    // HUD (no transform)
    resetTransform();
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`ω₂ / ω₁ ≈ e = ${E.toFixed(6)}`, 10, 20);
    ctx.fillText(`Zoom: ${scale.toFixed(2)}x`, 10, 40);

    time++;
    animationId = requestAnimationFrame(animateRods);
}

// ========= digits-of‑e walk =========
function startWalk() {
    stopAnimation();
    setActiveButton('walkBtn');
    currentMode = 'walk';
    trail.length = 0;
    time = 0;
    animateWalk();
}

function animateWalk() {
    if (currentMode !== 'walk') return;

    resetTransform();
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, width(), height());
    applyTransform();

    if (trail.length === 0) trail.push({ x: centerX(), y: centerY() });

    const idx = time % E_DIGITS.length;
    const digit = parseInt(E_DIGITS[idx], 10);

    const dirs = [
        { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
        { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 },
        { x: 0, y: 0 }, { x: 0, y: 0 }
    ];
    const dir = dirs[digit];
    const step = 3 * speed;

    const last = trail[trail.length - 1];
    const nx = last.x + dir.x * step;
    const ny = last.y + dir.y * step;

    trail.push({ x: nx, y: ny });
    if (trail.length > 2000) trail.shift();

    ctx.strokeStyle = `hsl(${digit * 36}, 100%, 50%)`;
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(nx, ny, 3 / scale, 0, Math.PI * 2); ctx.fill();

    resetTransform();
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Digit index: ${idx}`, 10, 20);
    ctx.fillText(`Digit: ${digit}`, 10, 40);

    time++;
    animationId = requestAnimationFrame(animateWalk);
}

