import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const SEGREDO = process.env.JWT_SEGREDO ?? 'segredo-de-desenvolvimento';

export interface DadosDoToken {
  id: number;
  papel: 'aluno' | 'admin';
}

export function gerarToken(dados: DadosDoToken): string {
  return jwt.sign(dados, SEGREDO, { expiresIn: '7d' });
}

export function usuarioLogado(res: Response): DadosDoToken {
  return res.locals.usuario as DadosDoToken;
}

export function exigirLogin(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization ?? '';
  const token = cabecalho.replace('Bearer ', '');

  if (token === '') {
    res.status(401).json({ erro: 'Você precisa entrar na sua conta.' });
    return;
  }

  try {
    const dados = jwt.verify(token, SEGREDO) as DadosDoToken;
    res.locals.usuario = { id: dados.id, papel: dados.papel };
    next();
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
