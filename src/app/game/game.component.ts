import { Component } from '@angular/core';
import { TimerHandlerService } from './timer/timer-handler.service';
import { CanvasHandlerService } from './canvas/canvas-handler.service';
import { ClearHandlerService } from './clear/clear-handler.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  constructor(private timerHandlerService:TimerHandlerService,
              private canvasHandlerService:CanvasHandlerService,
              private clearHandlerService:ClearHandlerService
  ){}
  
  ngAfterViewInit(){
    this.canvasHandlerService.initializeCanvas('gameCanvas');
    this.clearHandlerService.initializeClearButton('clear');
  }

  changeColor(color:string){
    this.canvasHandlerService.changeColor(color);
  }

  changeWidth(width:number){
    this.canvasHandlerService.changeWidth(width);
  }

  startCountdown(): void{
    this.timerHandlerService.countdown();
  }
}
