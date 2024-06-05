import { Categoria } from "./Categoria.interfaces";
import { Palabra } from "./Palabra.interfaces";


export interface PalabraPorCategoria{
    idPalabra : string;
    idCategoria : string;
}

export interface PalabraPorCategoriaModelo{
    idPalabra : Palabra;
    idCategoria : Categoria;
}