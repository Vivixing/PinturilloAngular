import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Categoria } from "../interfaces/Categoria.interfaces";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class CategoriaService{
    constructor(private http:HttpClient) { }
    urlCategoria = `${environment.serverUrl}`

    encontrarTodos():Observable<Categoria[]>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<Categoria[]>(`${this.urlCategoria}categorias`)
    }

    encontrarIdCategoria(id:string):Observable<Categoria>{
        return this.http.get<Categoria>(`${this.urlCategoria}categoria/${id}`)
    }

    encontrarPorNombre(nombre:string):Observable<Categoria>{ 
        //Observable es asíncrono, permite obtener datos a menera que estén disponibles
        return this.http.get<Categoria>(`${this.urlCategoria}categoria/${nombre}`)
    }

    guardarCategoria(categoria:Categoria):Observable<Categoria>{
        return this.http.post<Categoria>(`${this.urlCategoria}categoria`,categoria)
    }

    actualizarCategoria(categoria:Categoria):Observable<Categoria>{
        return this.http.put<Categoria>(`${this.urlCategoria}categoria`,categoria)
    }

    eliminarCategoria(categoria:Categoria, id:string):Observable<Categoria>{
        return this.http.put<Categoria>(`${this.urlCategoria}/${categoria.idCategoria}categoria/${id}`,categoria)
    }
}