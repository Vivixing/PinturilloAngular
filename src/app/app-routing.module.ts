import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { GameComponent } from './game/game.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { SalasDisponiblesComponent } from './salas-disponibles/salas-disponibles.component';

const routes: Routes = [
  {path:'', redirectTo:'Index', pathMatch:'full'},
  {path:'Index', component: IndexComponent},
  {path:'Game/:roomcode/:username', component:GameComponent},
  {path:'Result', component:ResultadoComponent},
  {path:'SalasDisponibles', component:SalasDisponiblesComponent},
  {path:'**', redirectTo:'Index', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
