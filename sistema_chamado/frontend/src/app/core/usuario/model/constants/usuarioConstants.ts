import { CategoriaChamado } from "../../../chamado/model/enums/categoriaChamado";
import { Prioridade } from "../../../chamado/model/enums/prioridade";
import { Departamento } from "../enums/usuarioDepartamento";

export interface CategoriaInfo {
  value: CategoriaChamado;
  label: string;
  icon: string;
  badgeClass: string;
}

export const CATEGORIAS_CONFIG: CategoriaInfo[] = [
  {
    value: CategoriaChamado.HARDWARE,
    label: 'Hardware e Equipamentos',
    icon: 'bi-laptop',
    badgeClass: 'badge-hardware'
  },
  {
    value: CategoriaChamado.SOFTWARE,
    label: 'Software e Sistemas',
    icon: 'bi-code-slash',
    badgeClass: 'badge-software'
  },
  {
    value: CategoriaChamado.REDE,
    label: 'Redes e Internet',
    icon: 'bi-wifi',
    badgeClass: 'badge-rede'
  },
  {
    value: CategoriaChamado.TELEFONIA,
    label: 'Telefonia e Ramais',
    icon: 'bi-telephone',
    badgeClass: 'badge-telefonia'
  },
  {
    value: CategoriaChamado.IMPRESSORA,
    label: 'Impressoras e Copiadoras',
    icon: 'bi-printer',
    badgeClass: 'badge-impressora'
  },
  {
    value: CategoriaChamado.ACROSS,
    label: 'Sistema Across / Exibição',
    icon: 'bi-tv',
    badgeClass: 'badge-across'
  },
  {
    value: CategoriaChamado.OUTROS,
    label: 'Outros Assuntos / Geral',
    icon: 'bi-three-dots',
    badgeClass: 'badge-outros'
  }
];

export const PRIORIDADES_LIST = [
  { value: 'URGENTE' as Prioridade, label: 'Urgente', badgeClass: 'bg-danger' },
  { value: 'ALTA' as Prioridade, label: 'Alta', badgeClass: 'bg-warning text-dark' },
  { value: 'NORMAL' as Prioridade, label: 'Normal', badgeClass: 'bg-info text-dark' },
  { value: 'BAIXA' as Prioridade, label: 'Baixa', badgeClass: 'bg-secondary' }
];

export const DEPARTAMENTOS_LIST: { value: Departamento; label: string }[] = [
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'DIRETORIA', label: 'Diretoria' },
  { value: 'ENTRETENIMENTO', label: 'Entretenimento' },
  { value: 'ESTAGIO', label: 'Estágio' },
  { value: 'JORNALISMO', label: 'Jornalismo' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'OPEC', label: 'OPEC' },
  { value: 'OPERACOES', label: 'Operações' },
  { value: 'PROGRAMACAO', label: 'Programação' },
  { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
  { value: 'TECNOLOGIA', label: 'Tecnologia' }
];