import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{

  @ViewChild('canvasElement', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  timeLeft: number = 99;
  color: string = "#000000";
  width: number = 5;
  drawing: boolean = false;
  coords = {x: 0, y: 0};

  constructor( ){
    this.canvasRef = {} as ElementRef<HTMLCanvasElement>
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  startCountdown() {
    const countdown = () => {
      this.timeLeft--;
      const timeElement = document.getElementById("time");
      if(timeElement){
        timeElement.innerHTML = String(this.timeLeft);
      }
      if (this.timeLeft > 0) {
        setTimeout(countdown, 1000);
      }
    };
    setTimeout(countdown, 1000);
  }
  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.error('Unable to get 2D context');
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Unable to get 2D context');
      return;
    }

    canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
    canvas.addEventListener("mousemove", (e) => this.draw(e, ctx));
    canvas.addEventListener("mouseup", () => this.stopDrawing(ctx));
    canvas.addEventListener("mouseout", () => this.stopDrawing(ctx));
    window.addEventListener("resize", () => this.adjustCanvasSize(canvas));
  }

  startDrawing(e: MouseEvent) { 
    const canvas = this.canvasRef.nativeElement;
    this.drawing = true; 
    this.getPosition(e, canvas); 
  }

  draw(e: MouseEvent, ctx: CanvasRenderingContext2D) { 
    if (!this.drawing) return; 
    ctx.beginPath(); 
    ctx.lineWidth = this.width; 
    ctx.lineCap = 'round'; 
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.coords.x, this.coords.y);  
    const canvas = this.canvasRef.nativeElement;
    this.getPosition(e, canvas); 
    ctx.lineTo(this.coords.x, this.coords.y);
    ctx.stroke();
  }

  stopDrawing(ctx: CanvasRenderingContext2D) {
    this.drawing = false;
    ctx.stroke();
    ctx.beginPath();
  }

  getPosition(e: MouseEvent, canvas: HTMLCanvasElement){ 
    const rect = canvas.getBoundingClientRect();
    this.coords.x = e.clientX - rect.left; 
    this.coords.y = e.clientY - rect.top; 
  }

  adjustCanvasSize(canvas: HTMLCanvasElement) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  changeColor(selectedColor: string) {
    this.color = selectedColor;
    console.log("Color seleccionado:", this.color);
  }

  changeWidth(num: number) {
    this.width = num;
    console.log("Ancho seleccionado:", this.width);
  }
  


}
