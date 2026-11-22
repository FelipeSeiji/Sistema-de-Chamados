import { CategoriaChamado } from '../../../chamado/enums/categoriaChamado';
import { Departamento } from '../enums/usuarioDepartamento';
export interface CategoriaInfo { value: CategoriaChamado; label: string; icon: string; badgeClass: string; }
export const CATEGORIAS_CONFIG: CategoriaInfo[] = [
  { value: CategoriaChamado.TI_EQUIPAMENTOS, label: 'TI · Equipamentos', icon: '', badgeClass: '' },
  { value: CategoriaChamado.TI_SOFTWARE, label: 'TI · Software', icon: '', badgeClass: '' },
  { value: CategoriaChamado.TI_REDE, label: 'TI · Rede', icon: '', badgeClass: '' },
  { value: CategoriaChamado.TI_ACESSO, label: 'TI · Acesso', icon: '', badgeClass: '' },
  { value: CategoriaChamado.ENG_AUDIO, label: 'Engenharia · Áudio', icon: '', badgeClass: '' },
  { value: CategoriaChamado.ENG_VIDEO, label: 'Engenharia · Vídeo', icon: '', badgeClass: '' },
  { value: CategoriaChamado.ENG_REDE, label: 'Engenharia · Rede', icon: '', badgeClass: '' },
  { value: CategoriaChamado.ENG_ACESSO, label: 'Engenharia · Acesso', icon: '', badgeClass: '' }
];
export const PRIORIDADES_LIST = ['BAIXA','MEDIA','ALTA','URGENTE'];
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
