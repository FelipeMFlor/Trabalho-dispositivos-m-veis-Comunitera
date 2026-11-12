// =============================================================
// types.ts
// Aqui ficam os "formatos" (tipos) dos dados usados no app.
// O TypeScript usa essas definições para avisar quando
// esquecemos um campo ou usamos um valor errado.
// Os dados chegam do servidor já neste formato.
// =============================================================

// As telas que existem no app. "admin" só aparece para a diretoria.
export type Tela = 'inicio' | 'calendario' | 'eventos' | 'vagas' | 'hub' | 'admin';

// Dados de quem fez login.
export interface Usuario {
  id: number;
  nome: string;
  curso: string;
  ra: string; // RA = Registro Acadêmico (o admin usa "admin")
  papel: 'aluno' | 'admin';
}

// Categoria de um compromisso do calendário.
export type Categoria = 'academico' | 'pessoal' | 'tera';

// Um compromisso que aparece no Calendário.
export interface Compromisso {
  id: number;
  titulo: string;
  data: string; // formato "AAAA-MM-DD", ex: "2026-11-09"
  hora: string; // formato "HH:MM", ex: "18:00"
  categoria: Categoria;
  podeApagar: boolean; // o servidor diz se quem está logado pode apagar
}

// Um evento do D.A. em que o aluno pode se inscrever.
export interface Evento {
  id: number;
  titulo: string;
  local: string;
  data: string; // "AAAA-MM-DD"
  hora: string; // "HH:MM"
  emoji: string;
  corDoTopo: 'roxo' | 'escuro';
  destaque: boolean; // true = aparece no card grande da Página inicial
  inscritos: number; // quantos alunos se inscreveram
}

// Uma vaga de estágio/emprego do Mural de Vagas.
export interface Vaga {
  id: number;
  titulo: string;
  empresa: string;
  modalidade: string; // Remoto, Híbrido ou Presencial
  cargaHoraria: string;
  emoji: string;
  descricao: string;
  requisitos: string[];
  candidatos: number; // quantos alunos se candidataram
}

// Uma aula da grade (usada no "Resumo de Hoje").
export interface Aula {
  id: number;
  diaDaSemana: number; // 0 = domingo, 1 = segunda ... 6 = sábado
  materia: string;
  horario: string;
  sala: string;
  professor: string;
}

// Um aviso publicado pela diretoria do D.A. (abre no sininho).
export interface Aviso {
  id: number;
  titulo: string;
  texto: string;
}

// Resposta do servidor ao entrar ou se cadastrar
export interface RespostaLogin {
  token: string;
  usuario: Usuario;
}
