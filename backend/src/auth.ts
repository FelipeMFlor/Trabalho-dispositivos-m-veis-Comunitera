// =============================================================
// auth.ts
// Tudo sobre login:
//  - gerarToken: cria a "pulseira" (token JWT) depois do login
//  - exigirLogin: middleware que só deixa passar quem tem token válido
//  - exigirAdmin: middleware que só deixa passar o admin do D.A.
//
// Middleware = função que roda ANTES da rota, como um porteiro.
// Ela chama next() para deixar passar, ou responde com erro.
// =============================================================

import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const SEGREDO = process.env.JWT_SEGREDO ?? 'segredo-de-desenvolvimento';

// O que guardamos dentro do token
export interface DadosDoToken {
  id: number;
  papel: 'aluno' | 'admin';
}

export function gerarToken(dados: DadosDoToken): string {
  // O token vale por 7 dias. Depois disso o aluno precisa entrar de novo.
  return jwt.sign(dados, SEGREDO, { expiresIn: '7d' });
}

// Pega o usuário logado (guardado pelo exigirLogin em res.locals)
export function usuarioLogado(res: Response): DadosDoToken {
  return res.locals.usuario as DadosDoToken;
}

export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  // O app manda o token no cabeçalho assim:  Authorization: Bearer <token>
  const cabecalho = req.headers.authorization ?? '';
  const token = cabecalho.replace('Bearer ', '');

  if (token === '') {
    res.status(401).json({ erro: 'Você precisa entrar na sua conta.' });
    return;
  }

  try {
    // verify confere a assinatura e a validade. Se o token for falso, dá erro.
    const dados = jwt.verify(token, SEGREDO) as DadosDoToken;
    res.locals.usuario = { id: dados.id, papel: dados.papel };
    next(); // pode passar!
  } catch {
    res.status(401).json({ erro: 'Sessão expirada. Entre novamente.' });
  }
}

export function exigirAdmin(req: Request, res: Response, next: NextFunction) {
  if (usuarioLogado(res).papel !== 'admin') {
    res.status(403).json({ erro: 'Somente a diretoria do D.A. pode fazer isso.' });
    return;
  }
  next();
}
