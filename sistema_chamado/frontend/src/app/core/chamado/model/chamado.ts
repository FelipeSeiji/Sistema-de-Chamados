import { Usuario } from "../../usuario/model/usuario";
import { CategoriaChamado } from "../enums/categoriaChamado";
import { Prioridade } from "../enums/prioridade";
import { StatusChamado } from "../enums/statusChamado";

export interface Chamado {
    id?: string;
    titulo: string;
    descricao: string;
    solucao?: string | null;
    categoria: CategoriaChamado;
    criadoEm?: string;
    status: StatusChamado;
    prioridade: Prioridade;
    usuarioId: string;
    usuarioNome: string;
}

export interface CategoriaInfo {
    value: CategoriaChamado;
    label: string;
    icone: string;
    subcategorias: string[];
}
