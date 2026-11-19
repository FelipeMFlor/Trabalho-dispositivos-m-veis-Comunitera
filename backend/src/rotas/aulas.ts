import { Router } from 'express';
import db from '../db.ts';
import { exigirAdmin, exigirLogin } from '../auth.ts';

const rotas = Router();
rotas.use(exigirLogin);

rotas.get('/', (req, res) => {
  const aulas = db
    .prepare(
      `SELECT id, dia_da_semana AS diaDaSemana, materia, horario, sala, professor
       FROM aulas
       ORDER BY dia_da_semana, horario`,
    )
    .all();
  res.json(aulas);
});

rotas.post('/', exigirAdmin, (req, res) => {
  const { diaDaSemana, materia, horario, sala, professor } = req.body ?? {};
  const dia = Number(diaDaSemana);

  if (!materia || !horario || !sala || !professor || isNaN(dia) || dia < 0 || dia > 6) {
    res.status(400).json({ erro: 'Preencha todos os campos da aula.' });
    return;
  }

  const resultado = db
    .prepare('INSERT INTO aulas (dia_da_semana, materia, horario, sala, professor) VALUES (?, ?, ?, ?, ?)')
    .run(dia, materia, horario, sala, professor);
  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
});

rotas.delete('/:id', exigirAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM aulas WHERE id = ?').run(Number(req.params.id));
  if (resultado.changes === 0) {
    res.status(404).json({ erro: 'Aula não encontrada.' });
    return;
  }
  res.status(204).end();
});

export default rotas;
