import { HttpClient } from "@angular/common/http"
import { environment } from "../environments/environment"
import { Observable } from "rxjs"
import { Palabra } from "../interfaces/Palabra.interfaces"
import { Injectable } from "@angular/core"

@Injectable({
    providedIn: 'root'
})

export class PalabraService{
    constructor(private http:HttpClient) { }
    urlPalabra = `${environment.serverUrl}`

    encontrarTodos():Observable<Palabra[]>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<Palabra[]>(`${this.urlPalabra}palabras`)
    }

    encontrarIdPalabra(id:string):Observable<Palabra>{
        return this.http.get<Palabra>(`${this.urlPalabra}palabra/${id}`)
    }

    encontrarPorTexto(texto:string):Observable<Palabra>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<Palabra>(`${this.urlPalabra}palabra/${texto}`)
    }

    guardarPalabra(palabra:Palabra):Observable<Palabra>{
        return this.http.post<Palabra>(`${this.urlPalabra}Palabra`,palabra)
    }

    actualizarPalabra(palabra:Palabra):Observable<Palabra>{
        return this.http.put<Palabra>(`${this.urlPalabra}Palabra`,palabra)
    }

    eliminarPalabra(palabra:Palabra, id:string):Observable<Palabra>{
        return this.http.put<Palabra>(`${this.urlPalabra}/${palabra.idPalabra}Palabra/${id}`,palabra)
    }
}