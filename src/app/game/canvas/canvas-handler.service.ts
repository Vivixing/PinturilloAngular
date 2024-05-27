import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanvasHandlerService {

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private color: string = "#000000";
  private width: number = 5;
  private drawing: boolean = false;
  private coords = { x: 0, y: 0 };

  constructor() {}

  initializeCanvas(canvasId: string): void {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.adjustCanvasSize();
    this.ctx = this.canvas.getContext('2d')!;

    this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
    this.canvas.addEventListener("mouseout", this.stopDrawing.bind(this));
    window.addEventListener("resize", this.adjustCanvasSize.bind(this));
  }

  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  private startDrawing(e: MouseEvent): void {
    this.drawing = true;
    this.getPosition(e);
  }

  private draw(e: MouseEvent): void {
    if (!this.drawing) return;
    this.ctx.beginPath();
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.color;
    this.ctx.moveTo(this.coords.x, this.coords.y);
    this.getPosition(e);
    this.ctx.lineTo(this.coords.x, this.coords.y);
    this.ctx.stroke();
  }

  private stopDrawing(): void {
    this.drawing = false;
    this.ctx.stroke();
    this.ctx.beginPath();
  }

  private getPosition(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.coords.x = e.clientX - rect.left;
    this.coords.y = e.clientY - rect.top;
  }

  changeColor(selectedColor: string): void {
    this.color = selectedColor;
    console.log("Color seleccionado:", this.color);
  }

  changeWidth(num: number): void {
    this.width = num;
    console.log("Ancho seleccionado:", this.width);
  }

  @HostListener('window:resize')
  private adjustCanvasSize(): void {
    if (this.canvas) {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }
  }
}
