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
    nombreUsuario: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])),
    nombreSala: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)]))
  })
  categorias : Categoria[] = [];
  idCategoria: string = '';
  nombreCategoria : string = '';
  avatarSalaSeleccionado = {name:'avatarDefault', src:'media/iconSala.png'}
  avatarSelected = {name:'avatarDefault', src:'media/usuario.png'}
  avatarList = [
    {name:'avatar1', src:'media/avatar1.svg'},
    {name:'avatar2', src:'media/avatar2.svg'},
    {name:'avatar3', src:'media/avatar3.svg'},
    {name:'avatar4', src:'media/avatar4.svg'},
    {name:'avatar5', src:'media/avatar5.svg'},
    {name:'avatar6', src:'media/avatar6.svg'}
  ]

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
  changeAvatar(){
    this.modalOpen = true;
  }

  closeAvatarSelection(){
    this.modalOpen = false;
  }

  selectAvatar(avatar:any){
    this.avatarSelected = avatar;
    this.modalOpen = false;
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
        //Con el idSalaDeJuego! se asegura de que ese id no será undefined, es decir, que en este caso tendrá un valor.
        this.unirseSalaJuego.connect((salaDeJuego.idSalaDeJuego!).toString(),this.createRoomForm.value.nombreUsuario,this.avatarSelected.src);
        this.stateService.updateState({roomcode:salaDeJuego.idSalaDeJuego,username:this.createRoomForm.value.nombreUsuario, avatar:this.avatarSelected.src});
        this.route.navigate(['/Game']);
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