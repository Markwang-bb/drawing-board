let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let eraserToggle = document.querySelector(".eraserToggle");
let colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let erasing = false;

function draw(e) {
    if (!painting) return;
    
    let x = e.clientX || e.touches[0].clientX;
    let y = e.clientY || e.touches[0].clientY;

    ctx.beginPath();
    ctx.arc(x, y, erasing ? 20 : 10, 0, 2 * Math.PI);
    ctx.fillStyle = erasing ? 'white' : colorPicker.value;
    ctx.fill();
}

function toggleEraser() {
    erasing = !erasing;
    eraserToggle.textContent = erasing ? '切换画笔' : '切换橡皮擦';
    eraserToggle.classList.toggle('active', erasing);
}

canvas.onmousedown = canvas.ontouchstart = () => painting = true;
canvas.onmouseup = canvas.onmouseout = canvas.ontouchend = () => painting = false;
canvas.onmousemove = canvas.ontouchmove = draw;

eraserToggle.onclick = toggleEraser;
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

canvas.ontouchmove = (e) => {
    e.preventDefault();
    draw(e.touches[0]);
};
