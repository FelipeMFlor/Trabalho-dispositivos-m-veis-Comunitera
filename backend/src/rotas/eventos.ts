// =============================================================
// rotas/eventos.ts
//   GET    /api/eventos                 -> lista os eventos (qualquer logado)
//   POST   /api/eventos                 -> cria evento (só admin)
//   DELETE /api/eventos/:id             -> apaga evento (só admin)
//   GET    /api/eventos/inscricoes      -> ids dos eventos em que EU me inscrevi
//   POST   /api/eventos/:id/inscricao   -> me inscrever
//   DELETE /api/eventos/:id/inscricao   -> cancelar minha inscrição
// =============================================================

import { Router } from 'express';
import db from '../db.ts';
import { exigirAdmin, exigirLogin, usuarioLogado } from '../auth.ts';

const rotas = Router();

// Todas as rotas daqui precisam de login
rotas.use(exigirLogin);

rotas.get('/', (req, res) => {
  // "AS corDoTopo" renomeia a coluna para o nome que o app usa.
  // A subconsulta conta quantas pessoas se inscreveram em cada evento.
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

  // No SQLite verdadeiro/falso é 1/0. Convertemos para true/false.
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

  // Se este evento for o destaque, os outros deixam de ser (só um aparece na Página inicial)
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
  res.status(204).end(); // 204 = deu certo, sem nada para devolver
});

rotas.post('/:id/inscricao', (req, res) => {
  const evento = db.prepare('SELECT id FROM eventos WHERE id = ?').get(Number(req.params.id));
  if (!evento) {
    res.status(404).json({ erro: 'Evento não encontrado.' });
    return;
  }
  // "OR IGNORE": se já estiver inscrito, não faz nada (e não dá erro)
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
