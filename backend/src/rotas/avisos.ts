// =============================================================
// rotas/avisos.ts
//   GET    /api/avisos       -> lista os avisos, do mais novo para o mais antigo
//   POST   /api/avisos       -> cria aviso (só admin)
//   DELETE /api/avisos/:id   -> apaga aviso (só admin)
// =============================================================

import { Router } from 'express';
import db from '../db.ts';
import { exigirAdmin, exigirLogin } from '../auth.ts';

const rotas = Router();
rotas.use(exigirLogin);

rotas.get('/', (req, res) => {
  const avisos = db.prepare('SELECT id, titulo, texto FROM avisos ORDER BY id DESC').all();
  res.json(avisos);
});

rotas.post('/', exigirAdmin, (req, res) => {
  const { titulo, texto } = req.body ?? {};
  if (!titulo || !texto) {
    res.status(400).json({ erro: 'Título e texto são obrigatórios.' });
    return;
  }
  const resultado = db.prepare('INSERT INTO avisos (titulo, texto) VALUES (?, ?)').run(titulo, texto);
  res.status(201).json({ id: Number(resultado.lastInsertRowid) });
});

rotas.delete('/:id', exigirAdmin, (req, res) => {
  const resultado = db.prepare('DELETE FROM avisos WHERE id = ?').run(Number(req.params.id));
  if (resultado.changes === 0) {
    res.status(404).json({ erro: 'Aviso não encontrado.' });
    return;
  }
  res.status(204).end();
});

export default rotas;
