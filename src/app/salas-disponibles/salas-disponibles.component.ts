import { Component, OnInit } from '@angular/core';
import { SalaDeJuegoService } from '../services/SalaDeJuego.service';
import { SalaDeJuego } from '../interfaces/SalaDeJuego.interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salas-disponibles',
  templateUrl: './salas-disponibles.component.html',
  styleUrl: './salas-disponibles.component.css'
})
export class SalasDisponiblesComponent implements OnInit{
  salasDeJuego : SalaDeJuego[] = [];
  avatarSalaSeleccionado = {name:'avatarDefault', src:'media/iconSala.png'}
  constructor(private salaDeJuegoServicio:SalaDeJuegoService) { }

  ngOnInit(): void {
    this.obtenerSalasDeJuego();
  }

  obtenerSalasDeJuego(){
    this.salaDeJuegoServicio.encontrarTodos().subscribe((salas : SalaDeJuego[])=>{
      this.salasDeJuego = salas.filter(sala => sala.estado === 'disponible');
    },
  error =>{
    Swal.fire('Error', 'Error al obtener las salas de juego', error.message);
  });
  }

}
