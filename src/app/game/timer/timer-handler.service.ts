import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerHandlerService {

  timeLeft: number = 99;

  countdown():void {
    this.timeLeft--;
    const timeElement = document.getElementById("time");
    if (timeElement) {
      timeElement.innerHTML = String(this.timeLeft);
    } else {
      console.error("Elemento 'time' no encontrado");
    }
    if (timeLeft > 0) {
      setTimeout(()=> this.countdown(),1000);
    }
}

  constructor() { }
}
