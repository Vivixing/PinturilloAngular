import { Injectable } from '@angular/core';
import { CanvasHandlerService } from '../canvas/canvas-handler.service';


@Injectable({
  providedIn: 'root'
})
export class ClearHandlerService {
  private clearElement!: HTMLElement;

  constructor(private canvasHandlerService:CanvasHandlerService) { }

  initializeClearButton(clearButtonId: string): void {
    this.clearElement = document.getElementById(clearButtonId) as HTMLElement;
    this.clearElement.addEventListener('click', this.clearCanvas.bind(this));
  }

  private clearCanvas(): void {
    const ctx = this.canvasHandlerService.getContext();
    const canvas = this.canvasHandlerService.getCanvas();
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.error("Contexto o canvas no disponible");
    }
  }
  
}
