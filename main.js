let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let eraserToggle = document.querySelector(".eraserToggle");
let eraserSizes = document.querySelector(".eraserSizes");
let eraserSizeButtons = document.querySelectorAll(".eraserSize");
let brushStyleButtons = document.querySelectorAll(".brushStyle");
let colorPicker = document.getElementById("colorPicker");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let painting = false;
let erasing = false;
let lastX = 0;
let lastY = 0;
let eraserSize = 20; // 默认中等大小
let brushStyle = 'normal'; // 默认普通笔触

function draw(e) {
    if (!painting) return;
    
    let x = e.clientX || e.touches[0].clientX;
    let y = e.clientY || e.touches[0].clientY;

    if (erasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.globalCompositeOperation = 'source-over';
        let color = colorPicker.value;
        
        switch (brushStyle) {
            case 'normal':
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                ctx.stroke();
                break;
            case 'rough':
                ctx.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(lastX + Math.random() * 2 - 1, lastY + Math.random() * 2 - 1);
                    ctx.lineTo(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }
                break;
            case 'dashed':
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(x, y);
                ctx.lineWidth = 2;
                ctx.strokeStyle = color;
                ctx.setLineDash([5, 10]);
                ctx.stroke();
                ctx.setLineDash([]);
                break;
            case 'watercolor':
                let r = parseInt(color.substr(1, 2), 16);
                let g = parseInt(color.substr(3, 2), 16);
                let b = parseInt(color.substr(5, 2), 16);
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5, 
                            Math.random() * 5 + 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},0.1)`;
                    ctx.fill();
                }
                break;
            case 'crayon':
                ctx.lineWidth = 8;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.shadowBlur = 1;
                ctx.shadowColor = color;
                
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(lastX + Math.random() * 4 - 2, lastY + Math.random() * 4 - 2);
                    ctx.lineTo(x + Math.random() * 4 - 2, y + Math.random() * 4 - 2);
                    let r = parseInt(color.substr(1, 2), 16);
                    let g = parseInt(color.substr(3, 2), 16);
                    let b = parseInt(color.substr(5, 2), 16);
                    ctx.strokeStyle = `rgb(${r + Math.random() * 20 - 10}, ${g + Math.random() * 20 - 10}, ${b + Math.random() * 20 - 10})`;
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
                break;
        }
    }

    [lastX, lastY] = [x, y];
}

function startPosition(e) {
    painting = true;
    [lastX, lastY] = [e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY];
    if (brushStyle === 'watercolor' || brushStyle === 'crayon') {
        draw(e); // 立即开始绘制，以避免单击时没有效果
    }
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function toggleEraser() {
  erasing = !erasing;
  eraserToggle.classList.toggle('active', erasing);
  eraserSizes.style.display = erasing ? 'flex' : 'none';
  
  // 更新图标
  const icon = eraserToggle.querySelector('i');
  icon.classList.toggle('ri-toggle-line', !erasing);
  icon.classList.toggle('ri-toggle-fill', erasing);
}

function setEraserSize(size) {
    switch(size) {
        case 'small': eraserSize = 10; break;
        case 'medium': eraserSize = 20; break;
        case 'large': eraserSize = 30; break;
    }
    eraserSizeButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function setBrushStyle(style) {
    brushStyle = style;
    brushStyleButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
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
eraserSizeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => setEraserSize(e.target.dataset.size));
});
brushStyleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => setBrushStyle(e.target.dataset.style));
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
