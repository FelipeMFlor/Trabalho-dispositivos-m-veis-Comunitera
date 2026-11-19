import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Aula, Aviso, Categoria, Compromisso, Evento, Usuario, Vaga } from '../types';
import { apagarToken, apiDelete, apiGet, apiPost, carregarTokenSalvo, guardarToken } from '../api';
import { mostrarMensagem } from '../utils/mensagens';

interface Dados {
  usuario: Usuario | null;
  verificando: boolean;
  ehAdmin: boolean;
  eventos: Evento[];
  vagas: Vaga[];
  avisos: Aviso[];
  aulas: Aula[];
  compromissos: Compromisso[];
  inscricoes: number[];
  candidaturas: number[];
  erro: string;
  atualizando: boolean;
  recarregar: () => void;
  entrar: (token: string, usuario: Usuario) => void;
  sair: () => void;
  alternarInscricao: (idDoEvento: number) => void;
  candidatar: (idDaVaga: number) => void;
  adicionarCompromisso: (titulo: string, data: string, hora: string, categoria: Categoria) => void;
  removerCompromisso: (id: number) => void;
}

const Contexto = createContext<Dados | null>(null);

export function useDados(): Dados {
  const dados = useContext(Contexto);
  if (dados === null) {
    throw new Error('useDados precisa estar dentro do <ProvedorDeDados>');
  }
  return dados;
}

export function ProvedorDeDados({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [verificando, setVerificando] = useState(true);

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [inscricoes, setInscricoes] = useState<number[]>([]);
  const [candidaturas, setCandidaturas] = useState<number[]>([]);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);

  const [versao, setVersao] = useState(0);

  function recarregar() {
    setVersao((v) => v + 1);
  }

  useEffect(() => {
    async function conferirToken() {
      const token = await carregarTokenSalvo();
      if (token === '') {
        setVerificando(false);
        return;
      }
      try {
        setUsuario(await apiGet<Usuario>('/eu'));
      } catch {
        await apagarToken();
      } finally {
        setVerificando(false);
      }
    }

    conferirToken();
  }, []);

  useEffect(() => {
    if (usuario === null) {
      return;
    }

    async function buscarTudo() {
      setAtualizando(true);
      try {
        const [ev, va, av, au, co, ins, can] = await Promise.all([
          apiGet<Evento[]>('/eventos'),
          apiGet<Vaga[]>('/vagas'),
          apiGet<Aviso[]>('/avisos'),
          apiGet<Aula[]>('/aulas'),
          apiGet<Compromisso[]>('/compromissos'),
          apiGet<number[]>('/eventos/inscricoes'),
          apiGet<number[]>('/vagas/candidaturas'),
        ]);
        setEventos(ev);
        setVagas(va);
        setAvisos(av);
        setAulas(au);
        setCompromissos(co);
        setInscricoes(ins);
        setCandidaturas(can);
        setErro('');
      } catch (e) {
        setErro((e as Error).message);
      } finally {
        setAtualizando(false);
      }
    }

    buscarTudo();
  }, [usuario, versao]);

  function entrar(token: string, novoUsuario: Usuario) {
    guardarToken(token);
    setUsuario(novoUsuario);
  }

  function sair() {
    apagarToken();
    setUsuario(null);
  }

  async function executar(acao: Promise<unknown>) {
    try {
      await acao;
      recarregar();
    } catch (e) {
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  function alternarInscricao(idDoEvento: number) {
    if (inscricoes.includes(idDoEvento)) {
      executar(apiDelete('/eventos/' + idDoEvento + '/inscricao'));
    } else {
      executar(apiPost('/eventos/' + idDoEvento + '/inscricao'));
    }
  }

  function candidatar(idDaVaga: number) {
    executar(apiPost('/vagas/' + idDaVaga + '/candidatura'));
  }

  function adicionarCompromisso(titulo: string, data: string, hora: string, categoria: Categoria) {
    executar(apiPost('/compromissos', { titulo, data, hora, categoria }));
  }

  function removerCompromisso(id: number) {
    executar(apiDelete('/compromissos/' + id));
  }

  const valor: Dados = {
    usuario,
    verificando,
    ehAdmin: usuario?.papel === 'admin',
    eventos,
    vagas,
    avisos,
    aulas,
    compromissos,
    inscricoes,
    candidaturas,
    erro,
    atualizando,
    recarregar,
    entrar,
    sair,
    alternarInscricao,
    candidatar,
    adicionarCompromisso,
    removerCompromisso,
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
