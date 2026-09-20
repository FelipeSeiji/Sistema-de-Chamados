import { Departamento } from '../model/enums/usuarioDepartamento';
import { UsuarioTipo } from '../model/enums/usuarioTipo';

export interface AtualizarUsuarioDTO {
  nome: string;
  email: string;
  departamento: Departamento;
  usuarioTipo: UsuarioTipo;
}