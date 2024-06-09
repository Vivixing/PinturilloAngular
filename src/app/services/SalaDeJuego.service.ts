import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SalaDeJuego } from "../interfaces/SalaDeJuego.interfaces";


@Injectable({
    providedIn: 'root'
})

export class SalaDeJuegoService{
    constructor(private http:HttpClient) { }
    urlSalaDeJuego = `${environment.serverUrl}`

    encontrarTodos():Observable<SalaDeJuego[]>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<SalaDeJuego[]>(`${this.urlSalaDeJuego}salaDeJuegos`)
    }

    encontrarIdSalaDeJuego(idSalaDeJuego:number):Observable<SalaDeJuego>{
        return this.http.get<SalaDeJuego>(`${this.urlSalaDeJuego}salaDeJuego/${idSalaDeJuego}`)
    }

    encontrarIdCategoria(idCategoria:string):Observable<SalaDeJuego>{
        return this.http.get<SalaDeJuego>(`${this.urlSalaDeJuego}salaDeJuego/categoria/${idCategoria}`)
    }
    
    encontrarPorNombre(nombre:string):Observable<SalaDeJuego>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<SalaDeJuego>(`${this.urlSalaDeJuego}salaDeJuego/${nombre}`)
    }

    guardarSalaDeJuego(salaDeJuego:SalaDeJuego):Observable<SalaDeJuego>{
        return this.http.post<SalaDeJuego>(`${this.urlSalaDeJuego}salaDeJuego`,salaDeJuego)
    }

    actualizarSalaDeJuego(salaDeJuego:SalaDeJuego):Observable<SalaDeJuego>{
        return this.http.put<SalaDeJuego>(`${this.urlSalaDeJuego}salaDeJuego`,salaDeJuego)
    }

    eliminarSalaDeJuego(salaDeJuego:SalaDeJuego, idSalaDeJuego:number):Observable<SalaDeJuego>{
        return this.http.put<SalaDeJuego>(`${this.urlSalaDeJuego}/${salaDeJuego.idSalaDeJuego}SalaDeJuego/${idSalaDeJuego}`,salaDeJuego)
    }
}