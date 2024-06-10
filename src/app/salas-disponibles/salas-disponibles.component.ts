import { Component, OnInit } from '@angular/core';
import { SalaDeJuegoService } from '../services/SalaDeJuego.service';
import { SalaDeJuego } from '../interfaces/SalaDeJuego.interfaces';
import { StateService } from '../services/state.service';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-salas-disponibles',
  templateUrl: './salas-disponibles.component.html',
  styleUrl: './salas-disponibles.component.css'
})
export class SalasDisponiblesComponent implements OnInit{
  salasDeJuego : SalaDeJuego[] = [];
  username:string='';
  subscription : Subscription = new Subscription();
  avatarSalaSeleccionado = {name:'avatarDefault', src:'media/iconSala.png'}
  constructor(private route:Router,private unirseSalaJuego:SocketService, private salaDeJuegoServicio:SalaDeJuegoService, private stateService:StateService) { }

  ngOnInit(): void {
    this.obtenerSalasDeJuego();
    this.subscription = this.stateService.state$.subscribe((state)=>{
    this.username = state.username;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  obtenerSalasDeJuego(){
    this.salaDeJuegoServicio.encontrarTodos().subscribe((salas : SalaDeJuego[])=>{
      this.salasDeJuego = salas.filter(sala => sala.estado === 'Sin iniciar');
    },
  error =>{
    Swal.fire('Error', 'Error al obtener las salas de juego', error.message);
    console.log(error);
  });
  }

  joinRoom(roomcode:number){
    this.unirseSalaJuego.connect(roomcode.toString(), this.username);
    this.route.navigate(['/Game']);
  }
}
