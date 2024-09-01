let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let eraserToggle = document.querySelector(".eraserToggle");
let colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let erasing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!painting) return;
    
    let x = e.clientX || e.touches[0].clientX;
    let y = e.clientY || e.touches[0].clientY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.lineWidth = erasing ? 40 : 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = erasing ? 'white' : colorPicker.value;
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

function startPosition(e) {
    painting = true;
    [lastX, lastY] = [e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY];
}

function endPosition() {
    painting = false;
}

function toggleEraser() {
    erasing = !erasing;
    eraserToggle.textContent = erasing ? '切换画笔' : '切换橡皮擦';
    eraserToggle.classList.toggle('active', erasing);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mouseout', endPosition);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPosition(e.touches[0]);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchcancel', endPosition);
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e.touches[0]);
});

eraserToggle.onclick = toggleEraser;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
