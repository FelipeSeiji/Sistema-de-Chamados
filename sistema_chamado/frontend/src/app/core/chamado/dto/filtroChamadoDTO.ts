import { CategoriaChamado } from '../enums/categoriaChamado';
import { Prioridade } from '../enums/prioridade';
import { StatusChamado } from '../enums/statusChamado';

export interface FiltroChamadoDTO {
  status?: StatusChamado;
  prioridade?: Prioridade;
  categoria?: CategoriaChamado;
  termoBusca?: string;
  dataInicio?: string;
  dataFim?: string;
}