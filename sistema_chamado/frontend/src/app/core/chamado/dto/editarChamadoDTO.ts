import { CategoriaChamado } from '../enums/categoriaChamado';
import { Prioridade } from '../enums/prioridade';

export interface EditarChamadoDTO {
    titulo: string;
    descricao: string;
    categoria: CategoriaChamado;
    prioridade: Prioridade;
}