// =============================================================
// api.ts
// Funções para conversar com o servidor (backend) usando fetch.
//
// Todo pedido:
//  - vai para "/api/..." (o Vite repassa para o servidor, veja vite.config.ts)
//  - leva o token de login no cabeçalho Authorization
//  - se o servidor responder com erro, lança um Error com a mensagem dele
// =============================================================

import { carregar, remover, salvar } from './utils/armazenamento';

// ---------- Token de login ----------
export function pegarToken(): string {
  return carregar('token', '');
}

export function guardarToken(token: string): void {
  salvar('token', token);
}

export function apagarToken(): void {
  remover('token');
}

// ---------- Função principal ----------
// "async" = a função demora (espera a internet) e devolve uma Promise.
// "await" = espera a resposta chegar antes de continuar.
async function pedir<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + pegarToken(),
      },
      // Só manda corpo quando existe (POST). JSON.stringify transforma o objeto em texto.
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Não foi possível falar com o servidor. Ele está ligado?');
  }

  // 204 = deu certo, mas sem conteúdo
  if (resposta.status === 204) {
    return null as T;
  }

  const dados = await resposta.json().catch(() => null);

  // resposta.ok é true para os códigos 200 a 299
  if (!resposta.ok) {
    throw new Error(dados?.erro ?? 'Erro ' + resposta.status);
  }
  return dados as T;
}

// Atalhos para cada método HTTP
export function apiGet<T>(caminho: string): Promise<T> {
  return pedir<T>('GET', caminho);
}

export function apiPost<T>(caminho: string, corpo?: unknown): Promise<T> {
  return pedir<T>('POST', caminho, corpo ?? {});
}

export function apiDelete(caminho: string): Promise<null> {
  return pedir<null>('DELETE', caminho);
}
