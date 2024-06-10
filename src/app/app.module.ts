import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { GameComponent } from './game/game.component';
import { SalasDisponiblesComponent } from './salas-disponibles/salas-disponibles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CrearSalaDeJuegoComponent } from './crear-sala-de-juego/crear-sala-de-juego.component';



@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ResultadoComponent,
    GameComponent,
    SalasDisponiblesComponent,
    CrearSalaDeJuegoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
