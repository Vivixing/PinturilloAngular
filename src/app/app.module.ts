import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { GameComponent } from './game/game.component';



@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ResultadoComponent,
    GameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
