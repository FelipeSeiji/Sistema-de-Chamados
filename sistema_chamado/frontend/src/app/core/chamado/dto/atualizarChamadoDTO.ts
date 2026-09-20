import { StatusChamado } from '../enums/statusChamado';

export interface AtualizarChamadoDTO {
    solucao: string;
    status: StatusChamado;
}