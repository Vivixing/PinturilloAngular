import { Component, ElementRef, Inject, OnInit, AfterViewInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  isBrowser: boolean;

  timeLeft: number = 99;
  color: string = "#000000";
  width: number = 5;
  drawing: boolean = false;
  coords = { x: 0, y: 0 };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    console.log("Platform ID:", platformId);
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log("Is browser:", this.isBrowser);
    if (this.isBrowser) {
      this.startCountdown();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupCanvas();
    }
  }

  setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
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

    this.adjustCanvasSize(canvas);
  }

  countdown() {
    this.timeLeft--;
    if (this.timeLeft > 0) {
      setTimeout(() => this.countdown(), 1000);
    }
  }
  
  
  startCountdown() {
    setTimeout(() => this.countdown(), 1000);
  }

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.error('Unable to get 2D context');
    }
  }

  startDrawing(e: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    this.drawing = true;
    this.coords = this.getPosition(e, canvas);
}

draw(e: MouseEvent, ctx: CanvasRenderingContext2D): void {
    if (!this.drawing) return;
    const canvas = this.canvasRef.nativeElement;
    const { x, y } = this.getPosition(e, canvas);

    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.coords.x, this.coords.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    this.coords = { x, y };
}

getPosition(e: MouseEvent, canvas: HTMLCanvasElement): { x: number, y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}


  stopDrawing(ctx: CanvasRenderingContext2D): void {
    this.drawing = false;
    ctx.beginPath();
  }


  adjustCanvasSize(canvas: HTMLCanvasElement): void {;
    const ctx = canvas.getContext('2d');
    if(!ctx) {
      console.error('Unable to get 2D context');
      return;
    }
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.putImageData(imageData, 0, 0);
}


changeColor(selectedColor: string): void {
  if (selectedColor) {
    this.color = selectedColor;
    console.log("Color seleccionado:", this.color);
  }
}

changeCustomColor(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target && target.value) {
    this.color = target.value;
    console.log("Color seleccionado:", this.color);
  }
}


  changeWidth(num: number): void {
    this.width = num;
    console.log("Ancho seleccionado:", this.width);
  }
}
