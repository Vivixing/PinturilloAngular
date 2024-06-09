import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { environment } from "../environments/environment"
import { PalabraPorCategoria } from "../interfaces/PalabraPorCategoria.interfaces"

@Injectable({
    providedIn: 'root'
})

export class PalabraPorCategoriaService{
    constructor(private http:HttpClient) { }
    urlPalabraPorCategoria = `${environment.serverUrl}`

    encontrarTodos():Observable<PalabraPorCategoria[]>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<PalabraPorCategoria[]>(`${this.urlPalabraPorCategoria}palabraPorCategorias`)
    }

    encontrarIdCategoria(idCategoria:string):Observable<PalabraPorCategoria>{
        return this.http.get<PalabraPorCategoria>(`${this.urlPalabraPorCategoria}palabraPorCategoria/categoria/${idCategoria}`)
    }

    encontrarIdPalabra(idPalabra:string):Observable<PalabraPorCategoria>{
        return this.http.get<PalabraPorCategoria>(`${this.urlPalabraPorCategoria}palabraPorCategoria/palabra/${idPalabra}`)
    }

    guardarPalabraPorCategoria(palabraPorCategoria:PalabraPorCategoria):Observable<PalabraPorCategoria>{
        return this.http.post<PalabraPorCategoria>(`${this.urlPalabraPorCategoria}palabraPorCategoria`,palabraPorCategoria)
    }

    eliminarPalabraPorCategoria(palabraPorCategoria:PalabraPorCategoria, idPalabra:string, idCategoria:string):Observable<PalabraPorCategoria>{
        return this.http.put<PalabraPorCategoria>(`${this.urlPalabraPorCategoria}/${palabraPorCategoria.idCategoria, palabraPorCategoria.idPalabra}palabraPorCategoria/${idPalabra}/${idCategoria}`,palabraPorCategoria)
    }
}