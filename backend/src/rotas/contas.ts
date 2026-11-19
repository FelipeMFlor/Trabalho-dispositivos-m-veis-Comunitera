import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.ts';
import { exigirLogin, gerarToken, usuarioLogado } from '../auth.ts';

const rotas = Router();

interface LinhaUsuario {
  id: number;
  nome: string;
  curso: string;
  ra: string;
  senha_hash: string;
  papel: 'aluno' | 'admin';
}

function semSenha(usuario: LinhaUsuario) {
  return { id: usuario.id, nome: usuario.nome, curso: usuario.curso, ra: usuario.ra, papel: usuario.papel };
}

rotas.post('/cadastro', (req, res) => {
  const { nome, curso, ra, senha } = req.body ?? {};

  if (!nome || !curso || !ra || !senha) {
    res.status(400).json({ erro: 'Preencha todos os campos.' });
    return;
  }
  if (isNaN(Number(ra))) {
    res.status(400).json({ erro: 'O RA deve ter só números.' });
    return;
  }
  if (String(senha).length < 6) {
    res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' });
    return;
  }

  const jaExiste = db.prepare('SELECT id FROM usuarios WHERE ra = ?').get(String(ra));
  if (jaExiste) {
    res.status(409).json({ erro: 'Já existe uma conta com esse RA.' });
    return;
  }

  const senhaHash = bcrypt.hashSync(String(senha), 10);
  const resultado = db
    .prepare('INSERT INTO usuarios (nome, curso, ra, senha_hash) VALUES (?, ?, ?, ?)')
    .run(String(nome).trim(), String(curso).trim(), String(ra).trim(), senhaHash);

  const id = Number(resultado.lastInsertRowid);
  const token = gerarToken({ id, papel: 'aluno' });

  res.status(201).json({
    token,
    usuario: { id, nome: String(nome).trim(), curso: String(curso).trim(), ra: String(ra).trim(), papel: 'aluno' },
  });
});

rotas.post('/login', (req, res) => {
  const { ra, senha } = req.body ?? {};

  const usuario = db.prepare('SELECT * FROM usuarios WHERE ra = ?').get(String(ra ?? '').trim()) as
    | LinhaUsuario
    | undefined;

  if (!usuario || !bcrypt.compareSync(String(senha ?? ''), usuario.senha_hash)) {
    res.status(401).json({ erro: 'RA/usuário ou senha incorretos.' });
    return;
  }

  const token = gerarToken({ id: usuario.id, papel: usuario.papel });
  res.json({ token, usuario: semSenha(usuario) });
});

rotas.get('/eu', exigirLogin, (req, res) => {
  const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioLogado(res).id) as
    | LinhaUsuario
    | undefined;

  if (!usuario) {
    res.status(404).json({ erro: 'Usuário não encontrado.' });
    return;
  }
  res.json(semSenha(usuario));
});

export default rotas;
