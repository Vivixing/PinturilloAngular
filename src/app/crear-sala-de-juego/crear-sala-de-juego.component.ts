import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../interfaces/Categoria.interfaces';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { CategoriaService } from '../services/Categoria.service';
import Swal from 'sweetalert2';
import { SalaDeJuegoService } from '../services/SalaDeJuego.service';
import { SalaDeJuego } from '../interfaces/SalaDeJuego.interfaces';

@Component({
  selector: 'app-crear-sala-de-juego',
  templateUrl: './crear-sala-de-juego.component.html',
  styleUrl: './crear-sala-de-juego.component.css'
})
export class CrearSalaDeJuegoComponent implements  OnInit {
  modalOpen = false;
  createRoomForm : FormGroup = new FormGroup({
    nombreSala: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])),
  })
  categorias : Categoria[] = [];
  idCategoria: string = '';
  nombreCategoria : string = '';
  constructor(private unirseSalaJuego:SocketService, 
    private salaDeJuegoService: SalaDeJuegoService,
    private route:Router, 
    private stateService:StateService,
    private categoriaService : CategoriaService){
  }
  
  ngOnInit(): void {
    this.obtenerCategorias();
  }

  showLoader(){
    Swal.fire({
      title:'Cargando 7u7...',
      allowOutsideClick:false,
    })
  }

  hideLoader(){
    Swal.close();
  }

  categoriaSeleccionada(id: string, nombre:string){
    this.idCategoria = id
    this.nombreCategoria = nombre
  }
  async createRoom(){
    if(this.createRoomForm.invalid){
      return;
    }
    this.showLoader();
    try {
      this.hideLoader();
      const salaDeJuego : SalaDeJuego ={
        nombre: this.createRoomForm.value.nombreSala,
        idCategoria: this.idCategoria,
        estado: 'Sin iniciar',
        categoria: this.nombreCategoria
      };
    this.salaDeJuegoService.guardarSalaDeJuego(salaDeJuego).subscribe(
      (salaDeJuego: SalaDeJuego)=>{
        Swal.fire('Sala de juego creada', 'La sala de juego ha sido creada con éxito', 'success');
      },
      error =>{
        Swal.fire('Error', 'Error al crear la sala de juego', error.message);
      }
    )
    } catch (error:any){
        console.log(error);
        this.hideLoader();
        Swal.fire({
          icon:'error',
          title:'Oops...',
          text:error.error.message
        });
    }
  }
  
  obtenerCategorias(){
    this.categoriaService.encontrarTodos().subscribe((categorias : Categoria[])=>{
      this.categorias = categorias;
    },
  error =>{
    Swal.fire('Error', 'Error al obtener las salas de juego', error.message);
  });
  }
  
}