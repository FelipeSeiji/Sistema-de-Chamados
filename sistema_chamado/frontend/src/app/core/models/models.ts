export type UsuarioTipo = 'ADMIN' | 'TECH' | 'USER';

export type StatusChamado = 'ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO' | 'CONCLUIDO' | 'CANCELADO';

export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type Departamento =
  | 'ADMINISTRATIVO'
  | 'COMERCIAL'
  | 'DIRETORIA'
  | 'ENTRETENIMENTO'
  | 'ESTAGIO'
  | 'JORNALISMO'
  | 'MARKETING'
  | 'OPEC'
  | 'OPERACOES'
  | 'PROGRAMACAO'
  | 'RECURSOS_HUMANOS'
  | 'TECNOLOGIA';

export type CategoriaChamado =
  | 'TI_EQUIPAMENTOS'
  | 'TI_SOFTWARE'
  | 'TI_REDE'
  | 'TI_ACESSO'
  | 'ENG_AUDIO'
  | 'ENG_VIDEO'
  | 'ENG_REDE'
  | 'ENG_ACESSO';

export interface Usuario {
  id?: string;
  nome: string;
  username: string;
  email: string;
  password?: string;
  departamento: Departamento;
  criadoEm?: string;
  atualizadoEm?: string;
  usuarioTipo: UsuarioTipo;
  statusChamado?: StatusChamado;
}

export interface Chamado {
  id?: string;
  titulo: string;
  descricao: string;
  solucao?: string | null;
  categoria: CategoriaChamado;
  criadoEm?: string;
  status: StatusChamado;
  prioridade: Prioridade;
  usuario: Usuario;
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface TrocarSenhaDTO {
  senhaAtual: string;
  novaSenha: string;
}

export interface AtualizarChamadoDTO {
  solucao: string;
  status: StatusChamado;
}

export interface MotivoDTO {
  motivo?: string;
}

export interface EditarChamadoDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaChamado;
  prioridade: Prioridade;
}

export interface CategoriaInfo {
  value: CategoriaChamado;
  label: string;
  icone: string;
  subcategorias: string[];
}

export const CATEGORIAS_CONFIG: CategoriaInfo[] = [
  {
    value: 'TI_EQUIPAMENTOS',
    label: 'TI / Equipamentos & Periféricos',
    icone: '🖥️',
    subcategorias: ['Computador não liga', 'Monitor / Teclado / Mouse', 'Impressora', 'Instalação física']
  },
  {
    value: 'TI_SOFTWARE',
    label: 'TI / Softwares & Sistemas',
    icone: '💻',
    subcategorias: ['Instalação de software', 'Falha em programa', 'Office 365 / Outlook', 'Sistema interno']
  },
  {
    value: 'TI_REDE',
    label: 'TI / Conectividade & Rede',
    icone: '🌐',
    subcategorias: ['Sem acesso à internet', 'Wi-Fi corporativo', 'Cabo de rede desconectado', 'Acesso a pastas na rede']
  },
  {
    value: 'TI_ACESSO',
    label: 'TI / Contas, Senhas & Acessos',
    icone: '🔐',
    subcategorias: ['Redefinição de senha', 'Criação de novo usuário', 'Permissão em pastas/pastas compartilhadas', 'E-mail corporativo']
  },
  {
    value: 'ENG_AUDIO',
    label: 'Engenharia / Áudio & Microfones',
    icone: '🎤',
    subcategorias: ['Mesa de som', 'Microfone de estúdio', 'Ruído/Chiado na captação', 'Intercom/Comunicação']
  },
  {
    value: 'ENG_VIDEO',
    label: 'Engenharia / Vídeo & Câmeras',
    icone: '🎥',
    subcategorias: ['Câmera de estúdio', ' switcher / corte de vídeo', 'Iluminação de estúdio', 'Teleprompter']
  },
  {
    value: 'ENG_REDE',
    label: 'Engenharia / Transmissão & Playout',
    icone: '📡',
    subcategorias: ['Servidor de exibição', 'Link ao vivo / Mochilink', 'Transmissão satélite/antena', 'Sinal fora do ar']
  },
  {
    value: 'ENG_ACESSO',
    label: 'Engenharia / Ilhas & Infraestrutura Técnica',
    icone: '🎬',
    subcategorias: ['Ilha de edição de vídeo', 'Storage de pós-produção', 'Ingest de matérias', 'Nobreak / Sala técnica']
  }
];

export const DEPARTAMENTOS_LIST: { value: Departamento; label: string }[] = [
  { value: 'TECNOLOGIA', label: 'Tecnologia / TI' },
  { value: 'JORNALISMO', label: 'Jornalismo' },
  { value: 'OPERACOES', label: 'Operações / Engenharia' },
  { value: 'PROGRAMACAO', label: 'Programação' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'ENTRETENIMENTO', label: 'Entretenimento' },
  { value: 'OPEC', label: 'OPEC' },
  { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
  { value: 'ADMINISTRATIVO', label: 'Administrativo' },
  { value: 'DIRETORIA', label: 'Diretoria' },
  { value: 'ESTAGIO', label: 'Estágio' }
];
