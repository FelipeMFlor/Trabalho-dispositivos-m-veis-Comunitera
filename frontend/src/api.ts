import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { carregar, remover, salvar } from './utils/armazenamento';

function descobrirEnderecoApi(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'web') {
    return 'http://' + window.location.hostname + ':3000/api';
  }
  const enderecoDoExpo = Constants.expoConfig?.hostUri;
  const ip = enderecoDoExpo ? enderecoDoExpo.split(':')[0] : 'localhost';
  return 'http://' + ip + ':3000/api';
}

export const ENDERECO_API = descobrirEnderecoApi();

let tokenAtual = '';

export async function carregarTokenSalvo(): Promise<string> {
  tokenAtual = await carregar('token', '');
  return tokenAtual;
}

export async function guardarToken(token: string): Promise<void> {
  tokenAtual = token;
  await salvar('token', token);
}

export async function apagarToken(): Promise<void> {
  tokenAtual = '';
  await remover('token');
}

async function pedir<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  let resposta: Response;

  try {
    resposta = await fetch(ENDERECO_API + caminho, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + tokenAtual,
      },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error('Não foi possível falar com o servidor. Ele está ligado?');
  }

  if (resposta.status === 204) {
    return null as T;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.erro ?? 'Erro ' + resposta.status);
  }
  return dados as T;
}

export function apiGet<T>(caminho: string): Promise<T> {
  return pedir<T>('GET', caminho);
}

export function apiPost<T>(caminho: string, corpo?: unknown): Promise<T> {
  return pedir<T>('POST', caminho, corpo ?? {});
}

export function apiDelete(caminho: string): Promise<null> {
  return pedir<null>('DELETE', caminho);
}
