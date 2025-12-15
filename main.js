// Euler's number to 1000 digits for digit-based visualizations
const E_DIGITS = "271828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516642742746639193200305992181741359662904357290033429526059563073813232862794349076323382988075319525101901157383418793070215408914993488416750924476146066808226480016847741185374234544243710753907774499206955170276183860626133138458300075204493382656029760673711320070932870912744374704723069697720931014169283681902551510865746377211125238978442505695369677078544996996794686445490598793163688923009879312773617821542499922957635148220826989519366803318252886939849465916653840572422365648386666610264976371006420189768177106535723866057966799936411287314014527002894818275119042982618259962126567321069056277769823793423686262520743692514038954142865551316823796939109517302333808045234906083625522334389337243508909250304651963710685098458434231521001365";

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

// Animation state
let animationId = null;
let currentMode = null;
let speed = 1.0;
let time = 0;

// Trail effect for rotating rods
const trail = [];
const maxTrailLength = 500;

// Zoom and pan state
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

// Event listeners
document.getElementById('rodsBtn').addEventListener('click', () => startRods());
document.getElementById('walkBtn').addEventListener('click', () => startWalk());
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('resetViewBtn').addEventListener('click', resetView);

const speedSlider = document.getElementById('speedSlider');
speedSlider.addEventListener('input', (e) => {
    speed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = speed.toFixed(1);
});

// Mouse controls
canvas.addEventListener('wheel', handleZoom);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mouseleave', handleMouseUp);

// Math constants
const E = Math.E;

/**
 * Rotating Rods Visualization
 * Two connected arms rotating at speeds with ratio = e
 */
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

    // Clear with transform reset
    resetTransform();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    // Apply current transform
    applyTransform();

    // Arm parameters
    const L1 = 150;
    const L2 = 100;
    const omega1 = 0.02 * speed;
    const omega2 = E * omega1;

    // Calculate angles and positions
    const theta1 = omega1 * time;
    const theta2 = omega2 * time;
    const jointX = centerX + L1 * Math.cos(theta1);
    const jointY = centerY + L1 * Math.sin(theta1);
    const endX = jointX + L2 * Math.cos(theta2);
    const endY = jointY + L2 * Math.sin(theta2);

    // Add to trail
    trail.push({ x: endX, y: endY });
    if (trail.length > maxTrailLength) trail.shift();

    // Draw trail
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2 / scale; // Scale line width for consistency
    ctx.beginPath();
    trail.forEach((point, i) => {
        i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Draw arms
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3 / scale;
    ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(jointX, jointY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(jointX, jointY); ctx.lineTo(endX, endY); ctx.stroke();

    // Draw joints
    ctx.fillStyle = '#00ffff';
    ctx.beginPath(); ctx.arc(centerX, centerY, 5 / scale, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(jointX, jointY, 4 / scale, 0, Math.PI * 2); ctx.fill();

    // Draw endpoint
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath(); ctx.arc(endX, endY, 6 / scale, 0, Math.PI * 2); ctx.fill();

    // Display info (in screen space)
    resetTransform();
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`θ₁ = ${(theta1 % (Math.PI * 2)).toFixed(3)} rad`, 10, 20);
    ctx.fillText(`θ₂ = ${(theta2 % (Math.PI * 2)).toFixed(3)} rad`, 10, 40);
    ctx.fillText(`Trail: ${trail.length}`, 10, 60);
    ctx.fillText(`Zoom: ${scale.toFixed(2)}x`, 10, 80);

    time++;
    animationId = requestAnimationFrame(animateRods);
}

/**
 * Digits of e Walk Visualization
 */
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, width, height);
    applyTransform();

    // Initialize starting position
    if (trail.length === 0) trail.push({ x: centerX, y: centerY });

    const digitIndex = time % E_DIGITS.length;
    const digit = parseInt(E_DIGITS[digitIndex]);
    const directions = [
        { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
        { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 },
        { x: 0, y: 0 }, { x: 0, y: 0 }
    ];

    const dir = directions[digit];
    const stepSize = 3 * speed;
    const lastPos = trail[trail.length - 1];
    const newX = lastPos.x + dir.x * stepSize;
    const newY = lastPos.y + dir.y * stepSize;

    trail.push({ x: newX, y: newY });
    if (trail.length > 2000) trail.shift();

    // Draw path
    ctx.strokeStyle = `hsl(${(digit * 36) % 360}, 100%, 50%)`;
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    trail.forEach((point, i) => {
        i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Draw current position
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(newX, newY, 3 / scale, 0, Math.PI * 2); ctx.fill();

    // Display info
    resetTransform();
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(`Digit #${digitIndex}: ${digit}`, 10, 20);
    ctx.fillText(`Path: ${trail.length}`, 10, 40);

    time++;
    animationId = requestAnimationFrame(animateWalk);
}

// Zoom and pan controls
function handleZoom(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * zoomFactor;
    
    if (newScale >= 0.1 && newScale <= 10) {
        offsetX = x - (x - offsetX) * zoomFactor;
        offsetY = y - (y - offsetY) * zoomFactor;
        scale = newScale;
    }
}

function handleMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX - offsetX;
    dragStartY = e.clientY - offsetY;
    canvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
    }
}

function handleMouseUp() {
    isDragging = false;
    canvas.style.cursor = 'grab';
}

function resetView() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
}

function applyTransform() {
    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
}

function resetTransform() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function clearCanvas() {
    stopAnimation();
    resetTransform();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    trail.length = 0;
    time = 0;
    resetView();
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    currentMode = null;
}

function setActiveButton(buttonId) {
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
}

// Initialize
canvas.style.cursor = 'grab';
clearCanvas();
