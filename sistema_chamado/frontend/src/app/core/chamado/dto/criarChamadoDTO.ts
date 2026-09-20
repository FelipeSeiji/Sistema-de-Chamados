import { CategoriaChamado } from '../enums/categoriaChamado';
import { Prioridade } from '../enums/prioridade';

export interface CriarChamadoDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  prioridade: Prioridade;
}