import { Router } from 'express';
import db from '../db.ts';
import { exigirLogin, usuarioLogado } from '../auth.ts';

const rotas = Router();
rotas.use(exigirLogin);

interface LinhaCompromisso {
  id: number;
  titulo: string;
  data: string;
  hora: string;
  categoria: string;
  usuario_id: number | null;
}

rotas.get('/', (req, res) => {
  const eu = usuarioLogado(res);

  const linhas = db
    .prepare('SELECT * FROM compromissos WHERE usuario_id IS NULL OR usuario_id = ? ORDER BY data, hora')
    .all(eu.id) as unknown as LinhaCompromisso[];

  const compromissos = linhas.map((linha) => ({
    id: linha.id,
    titulo: linha.titulo,
    data: linha.data,
    hora: linha.hora,
    categoria: linha.categoria,
    podeApagar: eu.papel === 'admin' ? linha.usuario_id === null : linha.usuario_id === eu.id,
  }));
  res.json(compromissos);
});

rotas.post('/', (req, res) => {
  const eu = usuarioLogado(res);
  const { titulo, data, hora, categoria } = req.body ?? {};

  if (!titulo || !data || !hora) {
    res.status(400).json({ erro: 'Título, data e hora são obrigatórios.' });
    return;
  }

  const permitidas = eu.papel === 'admin' ? ['academico', 'tera'] : ['academico', 'pessoal'];
  if (!permitidas.includes(categoria)) {
    res.status(400).json({ erro: 'Categoria inválida.' });
    return;
  }

  const dono = eu.papel === 'admin' ? null : eu.id;

  const resultado = db
    .prepare('INSERT INTO compromissos (titulo, data, hora, categoria, usuario_id) VALUES (?, ?, ?, ?, ?)')
    .run(titulo, data, hora, categoria, dono);
  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
});

rotas.delete('/:id', (req, res) => {
  const eu = usuarioLogado(res);
  const compromisso = db.prepare('SELECT * FROM compromissos WHERE id = ?').get(Number(req.params.id)) as
    | LinhaCompromisso
    | undefined;

  if (!compromisso) {
    res.status(404).json({ erro: 'Compromisso não encontrado.' });
    return;
  }

  const podeApagar = eu.papel === 'admin' ? compromisso.usuario_id === null : compromisso.usuario_id === eu.id;
  if (!podeApagar) {
    res.status(403).json({ erro: 'Você não pode apagar este compromisso.' });
    return;
  }

  db.prepare('DELETE FROM compromissos WHERE id = ?').run(compromisso.id);
  res.status(204).end();
});

export default rotas;
