import { Categoria } from "./Categoria.interfaces";

export interface SalaDeJuego{
    idSalaDeJuego ?: number;
    nombre : string;
    idCategoria : string;
    estado : string;
    categoria : string;
}

export interface SalaDeJuegoModelo{
    idSalaDeJuego ?: number;
    nombre : string;
    idCategoria : Categoria;
    estado : string;
    categoria : string;
}