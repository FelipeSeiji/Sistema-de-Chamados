import { Departamento } from '../model/enums/usuarioDepartamento';
import { UsuarioTipo } from '../model/enums/usuarioTipo';

export interface CriarUsuarioDTO {
  nome: string;
  username: string;
  email: string;
  password?: string;
  departamento: Departamento;
  usuarioTipo: UsuarioTipo;
}