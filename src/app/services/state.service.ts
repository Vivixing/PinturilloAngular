import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  state={
    username:'',
    roomcode:''
  }
  stateBehaviour:BehaviorSubject<any> = new BehaviorSubject(this.state);
  state$ = this.stateBehaviour.asObservable();
  constructor() { }

  updateState(newState:any):void{
    this.state={...this.state,...newState};
    this.stateBehaviour.next(this.state);
  }
}
