import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  modalOpen = false;
  joinRoomForm : FormGroup = new FormGroup({
    name: new FormControl ('',Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20),Validators.pattern(/^[A-Za-z\s\xF1\xD1]+$/)])),
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

  joinRoom(){
    if(this.joinRoomForm.invalid){
      return;
    }
    console.log(this.joinRoomForm.value);
  }
}
