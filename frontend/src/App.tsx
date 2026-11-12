// =============================================================
// App.tsx
// O componente principal. Ele:
//  1. confere se já existe alguém logado (token salvo);
//  2. busca os dados no servidor (eventos, vagas, avisos...);
//  3. guarda esses dados no estado e decide qual tela mostrar.
// As telas recebem os dados e as funções por "props".
// =============================================================

import { useEffect, useState } from 'react';
import type { Aula, Aviso, Compromisso, Evento, Tela, Usuario, Vaga } from './types';
import { apagarToken, apiDelete, apiGet, apiPost, guardarToken, pegarToken } from './api';

import BarraNavegacao from './components/BarraNavegacao';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Calendario from './pages/Calendario';
import Eventos from './pages/Eventos';
import Vagas from './pages/Vagas';
import HubTera from './pages/HubTera';

function App() {
  // ---------- Estados ----------
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  // Se já existe um token salvo, começamos "verificando" se ele ainda vale
  const [verificando, setVerificando] = useState(pegarToken() !== '');
  const [telaAtual, setTelaAtual] = useState<Tela>('inicio');

  // Dados que vêm do servidor
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [inscricoes, setInscricoes] = useState<number[]>([]);
  const [candidaturas, setCandidaturas] = useState<number[]>([]);
  const [erro, setErro] = useState('');

  // "versao" é só um contador: toda vez que ele muda, os dados são buscados de novo
  const [versao, setVersao] = useState(0);

  function recarregar() {
    setVersao(versao + 1);
  }

  // ---------- 1. Ao abrir o app: o token salvo ainda vale? ----------
  useEffect(() => {
    if (pegarToken() === '') {
      return;
    }
    apiGet<Usuario>('/eu')
      .then((dados) => setUsuario(dados))
      .catch(() => apagarToken()) // token vencido ou falso: pede login de novo
      .finally(() => setVerificando(false));
  }, []); // [] vazio = roda uma vez só, quando o app abre

  // ---------- 2. Buscar os dados sempre que alguém entrar ou "versao" mudar ----------
  useEffect(() => {
    if (usuario === null) {
      return;
    }

    async function buscarTudo() {
      try {
        // Promise.all faz os 7 pedidos ao mesmo tempo e espera todos terminarem
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
      }
    }

    buscarTudo();
  }, [usuario, versao]);

  // ---------- Funções que as telas usam ----------
  function entrar(token: string, novoUsuario: Usuario) {
    guardarToken(token);
    setUsuario(novoUsuario);
    setTelaAtual('inicio');
  }

  function sair() {
    apagarToken();
    setUsuario(null);
  }

  // Roda uma ação no servidor e, se der certo, busca os dados de novo.
  // Se der errado, mostra a mensagem de erro do servidor.
  async function executar(acao: Promise<unknown>) {
    try {
      await acao;
      recarregar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  // Inscreve no evento, ou cancela se já estiver inscrito
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

  function adicionarCompromisso(titulo: string, data: string, hora: string, categoria: string) {
    executar(apiPost('/compromissos', { titulo, data, hora, categoria }));
  }

  function removerCompromisso(id: number) {
    executar(apiDelete('/compromissos/' + id));
  }

  // Os eventos do D.A. também aparecem no calendário, como "Evento TERA".
  // Usamos o id negativo para não misturar com os ids dos compromissos.
  const compromissosDoCalendario: Compromisso[] = [
    ...compromissos,
    ...eventos.map((evento) => ({
      id: -evento.id,
      titulo: evento.titulo,
      data: evento.data,
      hora: evento.hora,
      categoria: 'tera' as const,
      podeApagar: false,
    })),
  ];

  // ---------- Telas ----------
  if (verificando) {
    return (
      <div className="app">
        <p className="texto-cinza centralizado">Carregando...</p>
      </div>
    );
  }

  if (usuario === null) {
    return (
      <div className="app">
        <Login aoEntrar={entrar} />
      </div>
    );
  }

  const ehAdmin = usuario.papel === 'admin';

  return (
    <div className="app">
      <main className="conteudo">
        {/* Faixa de erro (ex: servidor desligado) */}
        {erro !== '' && (
          <div className="faixa-erro">
            <span>{erro}</span>
            <button onClick={recarregar}>Tentar de novo</button>
          </div>
        )}

        {telaAtual === 'inicio' && (
          <Inicio usuario={usuario} eventos={eventos} aulas={aulas} avisos={avisos} aoTrocarTela={setTelaAtual} />
        )}
        {telaAtual === 'calendario' && (
          <Calendario
            compromissos={compromissosDoCalendario}
            ehAdmin={ehAdmin}
            aoAdicionar={adicionarCompromisso}
            aoRemover={removerCompromisso}
          />
        )}
        {telaAtual === 'eventos' && (
          <Eventos eventos={eventos} inscricoes={inscricoes} aoClicarInscricao={alternarInscricao} />
        )}
        {telaAtual === 'vagas' && <Vagas vagas={vagas} candidaturas={candidaturas} aoCandidatar={candidatar} />}
        {telaAtual === 'hub' && <HubTera usuario={usuario} aoSair={sair} />}

      </main>

      <BarraNavegacao telaAtual={telaAtual} ehAdmin={ehAdmin} aoTrocarTela={setTelaAtual} />
    </div>
  );
}

export default App;
