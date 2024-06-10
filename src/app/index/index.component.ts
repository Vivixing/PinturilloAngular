import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SocketService } from '../services/socket.service';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  modalOpen = false;
  joinRoomForm : FormGroup = new FormGroup({
    username: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)])),
    roomcode: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.pattern(/^([0-9])*$/)]))
  });
  avatarSelected = {name:'avatarDefault', src:'media/usuario.png'}
  avatarList = [
    {name:'avatar1', src:'media/avatar1.svg'},
    {name:'avatar2', src:'media/avatar2.svg'},
    {name:'avatar3', src:'media/avatar3.svg'},
    {name:'avatar4', src:'media/avatar4.svg'},
    {name:'avatar5', src:'media/avatar5.svg'},
    {name:'avatar6', src:'media/avatar6.svg'}
  ]

  constructor(private unirseSalaJuego:SocketService, private route:Router, private stateService:StateService){

  }

  ngOnInit(): void {
    
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

  async joinRoom(){
    if(this.joinRoomForm.invalid){
      return;
    }
    this.showLoader();
    try {
      await this.unirseSalaJuego.connect(this.joinRoomForm.value.roomcode,this.joinRoomForm.value.username);
      this.hideLoader();
      this.stateService.updateState({roomcode:this.joinRoomForm.value.roomcode,username:this.joinRoomForm.value.username})
      this.route.navigate(['/Game',this.joinRoomForm.value.roomcode, this.joinRoomForm.value.username]);
      this.joinRoomForm.reset();
    } catch (error:any) {
      console.log(error);
      this.hideLoader();
      Swal.fire({
        icon:'error',
        title:'Oops...',
        text:error.error.message
      });
    }
    
    
  }
}
