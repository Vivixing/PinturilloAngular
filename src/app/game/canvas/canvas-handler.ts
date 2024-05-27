const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext('2d')!;
let color: string = "#000000";
let width: number = 5;
let drawing: boolean = false;
let coords = {x:0, y:0};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
window.addEventListener("resize", adjustCanvasSize);

function startDrawing(e: MouseEvent) { 
    drawing = true; 
    getPosition(e); 
}

function draw(e: MouseEvent){ 
    if (!drawing) return; 
    ctx.beginPath(); 
    ctx.lineWidth = width; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = color;
    ctx.moveTo(coords.x, coords.y);  
    getPosition(e); 
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.stroke();
    ctx.beginPath();
}

function getPosition(e: MouseEvent){ 
    const rect = canvas.getBoundingClientRect();
    coords.x = e.clientX - rect.left; 
    coords.y = e.clientY - rect.top; 
}

function changeColor(selectedColor: string) {
    color = selectedColor;
    console.log("Color seleccionado:", color);
    return color;
}

function changeWidth(num: number) {
    width = num;
    console.log("Ancho seleccionado:", width);
    return width;
}

function adjustCanvasSize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
