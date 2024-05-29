import { Component, ElementRef, Inject, OnInit, AfterViewInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SocketService } from '../services/socket.service';
import { time } from 'console';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  isBrowser: boolean;

  timeLeft: number = 90;
  color: string = "#000000";
  width: number = 5;
  drawing: boolean = false;
  coords = { x: 0, y: 0 };
  word: string = '';
  username: string = 'userWeb';
  players: {username: string, puntos: number}[] = [];
  messages: {user:string, message:string}[] = [];
  gameStarted: boolean = false;

  constructor(private socket: SocketService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.socket.$subject.subscribe((message) => {
      try {
        message = JSON.parse(message);
        if (message && message.type != null) {
          if (message.type === 'TURN') {
            console.log('Turno Jugador:', message.data);
          }
          else if (message.type === 'ANNOUNCEMENT') {
            alert(message.data);
            console.log('Aviso:', message.data);
          }
          else if (message.type === 'MESSAGE') {
            var chat = message.data.split(':');
            this.messages.push({user: chat[0], message: chat[1]});
            console.log(message.data);
          }
          else if (message.type === 'WORD') {
            this.word = message.data;
            console.log('Palabra a Dibujar:', message.data);
          }

          else if (message.type === 'GUESSWORD') {
            alert(message.data);
            console.log(message.data);
          }

          else if (message.type === 'USER_TURN') {
            alert(message.data + ' esta dibujando');
            console.log('Jugador Dibujando:', message.data);
          }

          else if (message.type === 'TIME') {
            this.timeLeft = message.data;
            console.log('Tiempo Restante:', message.data);
          }

          else if (message.type === 'USER_END_TURN') {
            alert('El turno de ' + message.data + ' ha terminado')
            console.log('El turno de', message.data , 'ha terminado');
          }

          else if (message.type === 'END_GAME') {
            alert('Fin del Juego');
            console.log(message.data);
          }

          else if (message.type === 'RESULTS') {
            console.log(message.data);
          }

          else if (message.type === 'POINTS') {
              console.log('Puntos:', message.data);
          }

          else if (message.type === 'JOIN_ROOM') {
            alert('Jugador Conectado: ' + message.data);
            console.log('Jugador Conectado:', message.data);
          }

          else if (message.type === 'LEAVE_ROOM') {
            alert('Jugador Desconectado: ' + message.data);
            this.players = this.players.filter(player => player.username !== message.data);
            console.log('Jugador Desconectado:', message.data);
          }

          else if (message.type === 'PLAYERS') {
            this.players = message.data;
            this.players.sort((a, b) => b.puntos - a.puntos);
            console.log('Jugadores:', message.data);
          }

          else if (message.type === 'CLEAR') {
            this.clearCanvas();
          }
          else {
            console.log('Mensaje no reconocido:', message);
          }
        } else {
          console.log('Mensaje nulo:', message);
        }
      } catch (error) {
        console.error('Error al convertir el mensaje: ', error, message);
      }
    });
  }

  ngOnInit(): void {
    console.log("Is browser:", this.isBrowser);
    if (this.isBrowser) {
      this.socket.connect(1, this.username);
      this.players.push({username: this.username, puntos: 0});
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.setupCanvas();
    }
  }
  startGame() {
    const message = {
      type: 'START_GAME',
      data: ''
    };
    this.socket.SendMessage(JSON.stringify(message));
    if(this.players.length > 1){
      this.gameStarted = true;
    }
  }

  sendMessage() {
    const message = (document.getElementById('message') as HTMLInputElement).value;
    console.log('Mensaje:', message);
    const messageToSend = {
      type: 'SEND_MESSAGE',
      data: message
    };
    this.socket.SendMessage(JSON.stringify(messageToSend));
    this.messages.push({user: 'me', message: message});
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
  }
}

changeCustomColor(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target && target.value) {
    this.color = target.value;
  }
}


  changeWidth(num: number): void {
    this.width = num;
    console.log("Ancho seleccionado:", this.width);
  }
}
