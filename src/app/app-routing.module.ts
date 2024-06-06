import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { GameComponent } from './game/game.component';
import { ResultadoComponent } from './resultado/resultado.component';

const routes: Routes = [
  {path:'', redirectTo:'Index', pathMatch:'full'},
  {path:'Index', component: IndexComponent},
  {path:'Game', component:GameComponent},
  {path:'Result', component:ResultadoComponent},
  {path:'**', redirectTo:'Index', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
