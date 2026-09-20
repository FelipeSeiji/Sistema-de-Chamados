import { Departamento } from '../model/enums/usuarioDepartamento';
import { UsuarioTipo } from '../model/enums/usuarioTipo';

export interface UsuarioResponseDTO {
  id: string;
  nome: string;
  username: string;
  email: string;
  departamento: Departamento;
  usuarioTipo: UsuarioTipo;
  criadoEm?: string;
  atualizadoEm?: string;
}