const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

function setupCanvas() {
    canvas.width = 475;
    canvas.height = 600;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawRect(x, y, width, height, color, wireframe=false) {
    if (wireframe) {
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, width, height);
        return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
function Rect(x, y, width, height, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, width, height);
}

function drawLine(x1, y1, x2, y2, color, width = 2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
}

function randomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function onCanvasClick(callback) {
    canvas.addEventListener("click", (event) => {
        const pos = getMousePos(event);
        callback(pos);
    });
}

function drawText(text, x, y, size, color = "black") {
    ctx.font = size + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function dot(a, b) {
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result += a[i] * b[i];
    }
    return result;
  }

function gaussianRandom(mean=0, stdev=1) {
    // Box–Muller transform
    const u = 1 - Math.random(); // Converting [0,1) to (0,1], avoid log(0)
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

// Auto-setup the canvas on load
setupCanvas();
