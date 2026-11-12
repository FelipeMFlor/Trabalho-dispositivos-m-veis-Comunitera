// =============================================================
// server.ts
// Ponto de partida do servidor (API).
// Liga o Express, "pendura" as rotas e começa a escutar na porta.
// =============================================================

import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import './db.ts'; // abre o banco e cria as tabelas logo ao ligar

import rotasContas from './rotas/contas.ts';
import rotasEventos from './rotas/eventos.ts';
import rotasVagas from './rotas/vagas.ts';
import rotasAvisos from './rotas/avisos.ts';
import rotasAulas from './rotas/aulas.ts';
import rotasCompromissos from './rotas/compromissos.ts';

const app = express();

// Faz o Express entender o corpo dos pedidos em JSON (req.body)
app.use(express.json());

// Rota simples para testar se o servidor está vivo
app.get('/api', (req, res) => {
  res.json({ mensagem: 'API do Comunitera funcionando!' });
});

// Cada grupo de rotas fica em um arquivo
app.use('/api', rotasContas);
app.use('/api/eventos', rotasEventos);
app.use('/api/vagas', rotasVagas);
app.use('/api/avisos', rotasAvisos);
app.use('/api/aulas', rotasAulas);
app.use('/api/compromissos', rotasCompromissos);

// Se nenhuma rota respondeu: 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Se acontecer algum erro inesperado, responde 500 em vez de derrubar o servidor
app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno no servidor.' });
});

const PORTA = Number(process.env.PORTA ?? 3000);
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}/api`);
});
