import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { SalaDeJuegoService } from '../services/SalaDeJuego.service';
import { SalaDeJuego } from '../interfaces/SalaDeJuego.interfaces';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  modalOpen = false;
  joinRoomForm : FormGroup = new FormGroup({
    username: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)])),
    roomcode: new FormControl(0,Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(4),Validators.pattern(/^[0-9]+$/)]) )
  });
  salasDeJuego : SalaDeJuego[] = [];
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
              private route:Router, 
              private stateService:StateService,
              private salaDeJuegoServicio:SalaDeJuegoService){
  }

  ngOnInit(): void {
    this.obtenerSalasDeJuego();
  }

  changeAvatar(){
    this.modalOpen = true;
  }

  closeAvatarSelection(){
    this.modalOpen = false;
  }

  selectAvatar(avatar:any){
    this.avatarSelected = avatar
    this.modalOpen = false;
  }

  showLoader(){
    Swal.fire({
      title:'Cargando...',
      allowOutsideClick:false,
    })
  }

  hideLoader(){
    Swal.close();
  }
  
  changeName(){
    if(this.joinRoomForm.controls['username'].invalid){
      return;
    }
    this.stateService.updateState({username:this.joinRoomForm.value.username})
  }
  

  joinRoomForId(id:number):void{
    this.joinRoomForm.controls['roomcode'].setValue(id);
    this.joinRoom();
  }
  
  async joinRoom(){
    if(this.joinRoomForm.invalid){
      return;
    }
    this.showLoader();
    try {
      let roomcode = this.joinRoomForm.get('roomcode')?.value;
      let sala = await this.salaDeJuegoServicio.encontrarIdSalaDeJuego(roomcode).toPromise();
    
    if (sala == null) {
      this.hideLoader();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:'El id digitado de la sala de juego no coincide o no existe'
      });
      return;
    }
        await this.unirseSalaJuego.connect(this.joinRoomForm.value.roomcode,this.joinRoomForm.value.username);
        this.hideLoader();
        this.stateService.updateState({roomcode:this.joinRoomForm.value.roomcode,username:this.joinRoomForm.value.username})
        this.route.navigate(['/Game']);
    } catch (error:any) {
      console.log(error);
      this.hideLoader();
      Swal.fire({
        icon:'error',
        title:'Oops...',
        text:'El id digitado de la sala de juego no coincide o no existe'
      });
    }
  }

  obtenerSalasDeJuego(){
    this.salaDeJuegoServicio.encontrarTodos().subscribe((salas : SalaDeJuego[])=>{
      this.salasDeJuego = salas.filter(sala => sala.estado === 'Sin iniciar').slice(0,3);
    },
  error =>{
    Swal.fire('Error', 'Error al obtener las salas de juego', error.message);
  });
  }

}
