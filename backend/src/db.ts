// =============================================================
// db.ts
// Abre o banco de dados SQLite (um arquivo só: comunitera.db),
// cria as tabelas na primeira vez e coloca alguns dados de exemplo.
// O SQLite já vem dentro do Node (node:sqlite), não precisa instalar.
// =============================================================

import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';

// Abre (ou cria, se não existir) o arquivo do banco
const db = new DatabaseSync('comunitera.db');

// Faz o SQLite respeitar as chaves estrangeiras (REFERENCES)
db.exec('PRAGMA foreign_keys = ON;');

// ---------- Criação das tabelas ----------
// "IF NOT EXISTS" = só cria se ainda não existir.
// Assim podemos rodar isso toda vez que o servidor liga.
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL,
    curso       TEXT    NOT NULL,
    ra          TEXT    NOT NULL UNIQUE,      -- login do aluno (o admin usa "admin")
    senha_hash  TEXT    NOT NULL,
    papel       TEXT    NOT NULL DEFAULT 'aluno'  -- 'aluno' ou 'admin'
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo       TEXT    NOT NULL,
    local        TEXT    NOT NULL,
    data         TEXT    NOT NULL,   -- "AAAA-MM-DD"
    hora         TEXT    NOT NULL,   -- "HH:MM"
    emoji        TEXT    NOT NULL DEFAULT '🎉',
    cor_do_topo  TEXT    NOT NULL DEFAULT 'roxo',  -- 'roxo' ou 'escuro'
    destaque     INTEGER NOT NULL DEFAULT 0        -- 0 = não, 1 = sim
  );

  CREATE TABLE IF NOT EXISTS vagas (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo         TEXT NOT NULL,
    empresa        TEXT NOT NULL,
    modalidade     TEXT NOT NULL,
    carga_horaria  TEXT NOT NULL,
    emoji          TEXT NOT NULL DEFAULT '💼',
    descricao      TEXT NOT NULL,
    requisitos     TEXT NOT NULL DEFAULT ''  -- um requisito por linha
  );

  CREATE TABLE IF NOT EXISTS avisos (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo     TEXT NOT NULL,
    texto      TEXT NOT NULL,
    criado_em  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS aulas (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    dia_da_semana   INTEGER NOT NULL,  -- 0 = domingo ... 6 = sábado
    materia         TEXT    NOT NULL,
    horario         TEXT    NOT NULL,
    sala            TEXT    NOT NULL,
    professor       TEXT    NOT NULL
  );

  -- Compromissos do calendário.
  -- usuario_id vazio (NULL) = compromisso geral do D.A., todo mundo vê.
  -- usuario_id preenchido   = compromisso pessoal, só o dono vê.
  CREATE TABLE IF NOT EXISTS compromissos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT    NOT NULL,
    data        TEXT    NOT NULL,
    hora        TEXT    NOT NULL,
    categoria   TEXT    NOT NULL,  -- 'academico', 'pessoal' ou 'tera'
    usuario_id  INTEGER REFERENCES usuarios(id) ON DELETE CASCADE
  );

  -- Quem se inscreveu em qual evento
  CREATE TABLE IF NOT EXISTS inscricoes (
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    evento_id   INTEGER NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, evento_id)
  );

  -- Quem se candidatou a qual vaga
  CREATE TABLE IF NOT EXISTS candidaturas (
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vaga_id     INTEGER NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, vaga_id)
  );
`);

// ---------- Login mestre do D.A. ----------
// Se ainda não existir nenhum admin, cria um com o usuário e a senha do .env
const usuarioAdmin = process.env.ADMIN_USUARIO ?? 'admin';
const senhaAdmin = process.env.ADMIN_SENHA ?? 'TeraAdmin2026';

const adminExiste = db.prepare("SELECT id FROM usuarios WHERE papel = 'admin'").get();
if (!adminExiste) {
  db.prepare('INSERT INTO usuarios (nome, curso, ra, senha_hash, papel) VALUES (?, ?, ?, ?, ?)').run(
    'Diretoria D.A.',
    'Diretório Acadêmico TERA',
    usuarioAdmin,
    bcrypt.hashSync(senhaAdmin, 10),
    'admin',
  );
  console.log(`Login mestre do D.A. criado (usuário: ${usuarioAdmin}).`);
}

// ---------- Dados de exemplo ----------
// Só entram se o banco estiver vazio (primeira vez), para o app não começar em branco.
// Depois disso, quem cadastra tudo é o admin pelo Painel do D.A.
function tabelaVazia(tabela: string): boolean {
  const linha = db.prepare(`SELECT COUNT(*) AS total FROM ${tabela}`).get() as { total: number };
  return linha.total === 0;
}

if (tabelaVazia('eventos')) {
  const inserir = db.prepare(
    'INSERT INTO eventos (titulo, local, data, hora, emoji, cor_do_topo, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  inserir.run('Recepção de Calouros TERA', 'Bar Janela', '2026-11-20', '20:00', '🎉', 'roxo', 1);
  inserir.run('Workshop React & Cloud', 'Teatro da FSG', '2026-11-25', '19:30', '💻', 'escuro', 0);
  inserir.run('Hackathon TERA 24h', 'Bloco H', '2026-12-05', '09:00', '🏆', 'roxo', 0);
}

if (tabelaVazia('vagas')) {
  const inserir = db.prepare(
    'INSERT INTO vagas (titulo, empresa, modalidade, carga_horaria, emoji, descricao, requisitos) VALUES (?, ?, ?, ?, ?, ?, ?)',
  );
  inserir.run(
    'Dev React Native Jr', 'TechLabs Caxias', 'Remoto', '30h/semana', '🚀',
    'Ajudar o time a criar e manter aplicativos de celular usando React Native.',
    'Conhecer JavaScript ou TypeScript\nNoções de React\nVontade de aprender',
  );
  inserir.run(
    'Estágio UI/UX Design', 'Agência Digital', 'Híbrido', '20h/semana', '💡',
    'Criar telas e protótipos no Figma junto com o time de design.',
    'Saber usar o Figma\nEstar cursando Tecnologia',
  );
}

if (tabelaVazia('avisos')) {
  const inserir = db.prepare('INSERT INTO avisos (titulo, texto) VALUES (?, ?)');
  inserir.run('Inscrições abertas!', 'A Recepção de Calouros já está com inscrições abertas na aba Eventos.');
  inserir.run('Reunião do D.A.', 'Toda quinta às 18h na sala do Diretório. Todos são bem-vindos.');
}

if (tabelaVazia('aulas')) {
  const inserir = db.prepare('INSERT INTO aulas (dia_da_semana, materia, horario, sala, professor) VALUES (?, ?, ?, ?, ?)');
  inserir.run(1, 'Programação para dispositivos móveis', '19:30 - 22:30', 'Sala 304', 'Prof. Adélcio');
  inserir.run(2, 'Banco de Dados', '19:30 - 22:30', 'Lab. 2', 'Profª. Marina');
  inserir.run(3, 'Engenharia de Software', '19:30 - 22:30', 'Sala 210', 'Prof. Ricardo');
  inserir.run(4, 'Desenvolvimento Web', '19:30 - 22:30', 'Lab. 4', 'Profª. Juliana');
  inserir.run(5, 'Redes de Computadores', '19:30 - 21:00', 'Sala 305', 'Prof. Carlos');
}

if (tabelaVazia('compromissos')) {
  const inserir = db.prepare('INSERT INTO compromissos (titulo, data, hora, categoria) VALUES (?, ?, ?, ?)');
  inserir.run('Entrega Projeto', '2026-11-09', '18:00', 'academico');
  inserir.run('Prova de Banco de Dados', '2026-11-17', '19:30', 'academico');
  inserir.run('Apresentação do TCC', '2026-12-02', '20:00', 'academico');
}

export default db;
