import { Component, ElementRef, Inject, OnInit, AfterViewInit, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SocketService } from '../services/socket.service';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import { StateService } from '../services/state.service';
import { Subscription } from 'rxjs';
import { RankingService } from '../services/ranking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasElement', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  isBrowser: boolean;


  roomcode:string='';
  username:string='';
  avatar:string='';
  subscription : Subscription = new Subscription();

  timeLeft: number = 90;
  color: string = "#000000";
  width: number = 5;
  drawing: boolean = false;
  coords = { x: 0, y: 0 };
  word: string = '';
  players: {username: string, puntos: number, avatar:string}[] = [];
  messages: {avatar:string, user:string, message:string}[] = [];
  gameStarted: boolean = true;
  rondas = 1;
  rondaActual = 0;
  turnoActual = 0;

  constructor(private socket: SocketService, @Inject(PLATFORM_ID) private platformId: Object, private route:ActivatedRoute, private stateService:StateService, private rankingService: RankingService, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.socket.$subject.subscribe((message) => {
      try {
        message = JSON.parse(message);
        if (message && message.type != null) {
          if (message.type === 'TURN') {
            this.turnoActual = message.data;
            console.log('Turno Jugador:', message.data);
          }
          else if (message.type === 'CLEAR') {
            this.clearCanvas();
          }
          else if (message.type === 'DRAW') {
            console.log('Dibujando:', message.data);
            const canvas = this.canvasRef.nativeElement;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const image = new Image();
              image.onload = () => {
                ctx.drawImage(image, 0, 0);
              };
              image.src = message.data;
            } else {
              console.error('Unable to get 2D context');
            }
          }
          
          else if (message.type === 'ANNOUNCEMENT') {
            Swal.fire({
              title: 'Aviso',
              text: message.data,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
            console.log('Aviso:', message.data);
          }
          else if (message.type === 'MESSAGE') {
            var chat = message.data.split(':');
            this.messages.push({avatar:chat[0],user: chat[1], message: chat[2]});
          }
          else if (message.type === 'WORD') {
            this.word = message.data;
            console.log('Palabra a Dibujar:', message.data);
          }

          else if (message.type === 'GUESSWORD') {
            Swal.fire({
              title: 'Adivinaste la Palabra',
              text: message.data,
              icon: 'success',
              confirmButtonText: 'Ok'
            });
            console.log(message.data);
          }

          else if (message.type === 'USER_TURN') {
            Swal.fire({
              title: 'Turno de Dibujar',
              text: message.data,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
            console.log('Jugador Dibujando:', message.data);
          }

          else if (message.type === 'TIME') {
            this.timeLeft = message.data;
            console.log('Tiempo Restante:', message.data);
          }

          else if (message.type === 'USER_END_TURN') {
            this.word = '';
            Swal.fire({
              title: 'Turno Terminado',
              text: message.data,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
            console.log('El turno de', message.data , 'ha terminado');
          }

          else if(message.type === 'GAME_STARTED') {
            this.gameStarted = message.data;
            console.log('Juego Iniciado:', message.data);
          }
          
          else if (message.type === 'END_GAME') {
            Swal.fire({
              title: 'Fin del Juego',
              text: message.data,
              icon: 'info',
              confirmButtonText: 'Ok'
            });
            console.log(message.data);
            rankingService.updateRanking(this.players);
            this.router.navigate(['/Result']);
          }

          else if (message.type === 'RESULTS') {
            console.log(message.data);
          }

          else if (message.type === 'POINTS') {
              console.log('Puntos:', message.data);
          }

          else if (message.type === 'JOIN_ROOM') {
            var newPlayer = message.data.split(',');
            Swal.fire({
              title: 'Jugador Conectado',
              text: newPlayer[0],
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          }

          else if (message.type === 'LEAVE_ROOM') {
            Swal.fire({
              title: 'Jugador Desconectado',
              text: message.data,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            this.players = this.players.filter(player => player.username !== message.data);
            console.log('Jugador Desconectado:', message.data);
          }

          else if (message.type === 'PLAYERS') {
            this.players = message.data;
            for (let player of this.players) {
              player.avatar = decodeURIComponent(player.avatar);
            }
            this.players.sort((a, b) => b.puntos - a.puntos);
            console.log('Jugadores:', message.data);
          }

          else if(message.type === 'MAX_ROUNDS') {
            this.rondas = message.data;
            console.log('Rondas:', message.data);
          }

          else if(message.type === 'ROUND') {
            this.rondaActual = message.data;
            console.log('Ronda:', message.data);
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
  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.subscription = this.stateService.state$.subscribe((state)=>{
        this.username = state.username;
        this.roomcode = state.roomcode;
        this.avatar = state.avatar;
      })
      //Se debe traer como se maneja en el app.routing.module.ts del /Game
      //this.roomcode = this.route.snapshot.paramMap.get('roomcode') ?? '';
      //this.username = this.route.snapshot.paramMap.get('name') ?? '';
      this.players.push({username: this.username, puntos: 0, avatar: this.avatar});
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
    this.messages.push({avatar: this.avatar, user: 'me', message: message});
  }

  sendDrawing(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const image = canvas.toDataURL(); // This converts the canvas content to a data URL representing the image
      const message = {
        type: 'DRAW',
        data: image
      };
      this.socket.SendMessage(JSON.stringify(message)); // Make sure the method name is correct ("sendMessage" instead of "SendMessage")
    } else {
      console.error('Unable to get 2D context');
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

  clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      console.error('Unable to get 2D context');
    }
    if(this.turnoActual == 1){
      let message = {
        type: 'CLEAR',
        data: ''
      };
      this.socket.SendMessage(JSON.stringify(message));
    }
  }

  startDrawing(e: MouseEvent): void {
    if(this.turnoActual == 1){
    const canvas = this.canvasRef.nativeElement;
    this.drawing = true;
    this.coords = this.getPosition(e, canvas);
    }
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
    this.sendDrawing();
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

  updateGameRanking(){
    const ranking = this.players.map(player => {
      return {username: player.username, puntos: player.puntos};
    });
    this.rankingService.updateRanking(ranking);
  }
}
