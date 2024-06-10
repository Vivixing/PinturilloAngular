import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private ws: WebSocket | undefined;

  url  = 'http://localhost:3000';
  subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public $subject: Observable<any> = this.subject.asObservable();
  constructor(private router: Router) {
  }

  connect(idSalaDeJuego: string, username: string) {
    this.ws = new WebSocket(`${this.url}/ws/room/${idSalaDeJuego}/${username}`);
    this.ws.onopen = () => {
      console.log('Connected to server');
    }

    this.ws.onmessage = (event) => {
      this.subject.next(event.data);
    }

    this.ws.onclose = () => {
      console.log('Disconnected from server');
    }
  } 
  WebSocketConnect(){
    return this.ws;
  }

  SendMessage(message: string) {
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      }
    }
    else {
      console.log('No connection to server');
    }
  }
}
