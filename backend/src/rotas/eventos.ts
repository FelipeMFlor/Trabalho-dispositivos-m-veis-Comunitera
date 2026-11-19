import { Router } from 'express';
import db from '../db.ts';
import { exigirAdmin, exigirLogin, usuarioLogado } from '../auth.ts';

const rotas = Router();

rotas.use(exigirLogin);

rotas.get('/', (req, res) => {
  const linhas = db
    .prepare(
      `SELECT id, titulo, local, data, hora, emoji,
              cor_do_topo AS corDoTopo,
              destaque,
              (SELECT COUNT(*) FROM inscricoes WHERE evento_id = eventos.id) AS inscritos
       FROM eventos
       ORDER BY data, hora`,
    )
    .all();

  const eventos = linhas.map((linha) => ({ ...linha, destaque: linha.destaque === 1 }));
  res.json(eventos);
});

rotas.get('/inscricoes', (req, res) => {
  const linhas = db
    .prepare('SELECT evento_id AS id FROM inscricoes WHERE usuario_id = ?')
    .all(usuarioLogado(res).id) as { id: number }[];
  res.json(linhas.map((linha) => linha.id));
});

rotas.post('/', exigirAdmin, (req, res) => {
  const { titulo, local, data, hora, emoji, corDoTopo, destaque } = req.body ?? {};

  if (!titulo || !local || !data || !hora) {
    res.status(400).json({ erro: 'Título, local, data e hora são obrigatórios.' });
    return;
  }

  if (destaque) {
    db.prepare('UPDATE eventos SET destaque = 0').run();
  }

  const resultado = db
    .prepare('INSERT INTO eventos (titulo, local, data, hora, emoji, cor_do_topo, destaque) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(titulo, local, data, hora, emoji || '🎉', corDoTopo === 'escuro' ? 'escuro' : 'roxo', destaque ? 1 : 0);

  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
});

rotas.delete('/:id', exigirAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM eventos WHERE id = ?').run(Number(req.params.id));
  if (resultado.changes === 0) {
    res.status(404).json({ erro: 'Evento não encontrado.' });
    return;
  }
  res.status(204).end();
});

rotas.post('/:id/inscricao', (req, res) => {
  const evento = db.prepare('SELECT id FROM eventos WHERE id = ?').get(Number(req.params.id));
  if (!evento) {
    res.status(404).json({ erro: 'Evento não encontrado.' });
    return;
  }
  db.prepare('INSERT OR IGNORE INTO inscricoes (usuario_id, evento_id) VALUES (?, ?)').run(
    usuarioLogado(res).id,
    Number(req.params.id),
  );
  res.status(201).json({ ok: true });
});

rotas.delete('/:id/inscricao', (req, res) => {
  db.prepare('DELETE FROM inscricoes WHERE usuario_id = ? AND evento_id = ?').run(
    usuarioLogado(res).id,
    Number(req.params.id),
  );
  res.status(204).end();
});

export default rotas;
