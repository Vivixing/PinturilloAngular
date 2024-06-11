import { Categoria } from "./Categoria.interfaces";

export interface SalaDeJuego{
    idSalaDeJuego ?: string;
    nombre : string;
    idCategoria : string;
    estado : string;
    categoria : string;
}

export interface SalaDeJuegoModelo{
    idSalaDeJuego ?: string;
    nombre : string;
    idCategoria : Categoria;
    estado : string;
    categoria : string;
}