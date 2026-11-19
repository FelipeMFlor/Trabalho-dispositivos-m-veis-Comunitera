import { Router } from 'express';
import db from '../db.ts';
import { exigirAdmin, exigirLogin, usuarioLogado } from '../auth.ts';

const rotas = Router();
rotas.use(exigirLogin);

rotas.get('/', (req, res) => {
  const linhas = db
    .prepare(
      `SELECT id, titulo, empresa, modalidade, carga_horaria AS cargaHoraria, emoji, descricao, requisitos,
              (SELECT COUNT(*) FROM candidaturas WHERE vaga_id = vagas.id) AS candidatos
       FROM vagas
       ORDER BY id DESC`,
    )
    .all();

  const vagas = linhas.map((linha) => ({
    ...linha,
    requisitos: String(linha.requisitos)
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r !== ''),
  }));
  res.json(vagas);
});

rotas.get('/candidaturas', (req, res) => {
  const linhas = db
    .prepare('SELECT vaga_id AS id FROM candidaturas WHERE usuario_id = ?')
    .all(usuarioLogado(res).id) as { id: number }[];
  res.json(linhas.map((linha) => linha.id));
});

rotas.post('/', exigirAdmin, (req, res) => {
  const { titulo, empresa, modalidade, cargaHoraria, emoji, descricao, requisitos } = req.body ?? {};

  if (!titulo || !empresa || !modalidade || !cargaHoraria || !descricao) {
    res.status(400).json({ erro: 'Preencha título, empresa, modalidade, carga horária e descrição.' });
    return;
  }

  const resultado = db
    .prepare(
      'INSERT INTO vagas (titulo, empresa, modalidade, carga_horaria, emoji, descricao, requisitos) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .run(titulo, empresa, modalidade, cargaHoraria, emoji || '💼', descricao, requisitos ?? '');

  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
});

rotas.delete('/:id', exigirAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM vagas WHERE id = ?').run(Number(req.params.id));
  if (resultado.changes === 0) {
    res.status(404).json({ erro: 'Vaga não encontrada.' });
    return;
  }
  res.status(204).end();
});

rotas.post('/:id/candidatura', (req, res) => {
  const vaga = db.prepare('SELECT id FROM vagas WHERE id = ?').get(Number(req.params.id));
  if (!vaga) {
    res.status(404).json({ erro: 'Vaga não encontrada.' });
    return;
  }
  db.prepare('INSERT OR IGNORE INTO candidaturas (usuario_id, vaga_id) VALUES (?, ?)').run(
    usuarioLogado(res).id,
    Number(req.params.id),
  );
  res.status(201).json({ ok: true });
});

export default rotas;
