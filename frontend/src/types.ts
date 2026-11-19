export interface Usuario {
  id: number;
  nome: string;
  curso: string;
  ra: string;
  papel: 'aluno' | 'admin';
}

export type Categoria = 'academico' | 'pessoal' | 'tera';

export interface Compromisso {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  categoria: Categoria;
  podeApagar: boolean;
}

export interface Evento {
  id: number;
  titulo: string;
  local: string;
  data: string;
  hora: string;
  emoji: string;
  corDoTopo: 'roxo' | 'escuro';
  destaque: boolean;
  inscritos: number;
}

export interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  modalidade: string;
  cargaHoraria: string;
  emoji: string;
  descricao: string;
  requisitos: string[];
  candidatos: number;
}

export interface Aula {
  id: number;
  diaDaSemana: number;
  materia: string;
  horario: string;
  sala: string;
  professor: string;
}

export interface Aviso {
  id: number;
  titulo: string;
  texto: string;
}

export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}
