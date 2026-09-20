import { Departamento } from './enums/usuarioDepartamento';
import { UsuarioTipo } from './enums/usuarioTipo';

export interface Usuario {
  id?: string;
  nome: string;
  username: string;
  email: string;
  password?: string;
  departamento: Departamento;
  usuarioTipo: UsuarioTipo;
  criadoEm?: string;
  atualizadoEm?: string;
}