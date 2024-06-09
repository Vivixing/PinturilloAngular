import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  modalOpen = false;
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
}
