// =============================================================
// Inicio.tsx  —  "1. Página inicial"
// Saudação, evento em destaque, aula de hoje e canais da comunidade.
// =============================================================

import { useState } from 'react';
import type { Aula, Aviso, Evento, Tela, Usuario } from '../types';
import { LINK_INSTAGRAM, LINK_WHATSAPP } from '../links';
import Modal from '../components/Modal';
import { formatarDiaMes } from '../utils/datas';

interface Props {
  usuario: Usuario;
  eventos: Evento[];
  aulas: Aula[];
  avisos: Aviso[];
  aoTrocarTela: (tela: Tela) => void;
}

function Inicio({ usuario, eventos, aulas, avisos, aoTrocarTela }: Props) {
  // Controla se o modal de avisos (sininho) está aberto
  const [avisosAbertos, setAvisosAbertos] = useState(false);

  // Pega só o primeiro nome: "Maria Silva" -> "Maria"
  const primeiroNome = usuario.nome.split(' ')[0];

  // find = procura o primeiro evento marcado como destaque
  const eventoDestaque = eventos.find((evento) => evento.destaque);

  // filter = pega só as aulas do dia da semana de hoje
  const diaDeHoje = new Date().getDay();
  const aulasDeHoje = aulas.filter((aula) => aula.diaDaSemana === diaDeHoje);

  return (
    <div className="tela">
      {/* ---------- Cabeçalho ---------- */}
      <header className="inicio-cabecalho">
        <div className="avatar-pequeno">🐸</div>
        <div className="inicio-saudacao">
          <span>Olá, {primeiroNome}!</span>
          <strong>Bem-vindo ao COMUNITERA!</strong>
        </div>
        <button className="botao-sino" onClick={() => setAvisosAbertos(true)} aria-label="Avisos">
          🔔
          {avisos.length > 0 && <span className="bolinha-aviso">{avisos.length}</span>}
        </button>
      </header>

      {/* ---------- Evento em destaque ---------- */}
      {eventoDestaque && (
        <section className="destaque">
          <span className="destaque-etiqueta">EVENTO EM DESTAQUE</span>
          <h2>{eventoDestaque.titulo}</h2>
          <p>
            {eventoDestaque.local} • {formatarDiaMes(eventoDestaque.data)} às {eventoDestaque.hora}
          </p>
          <button className="botao botao-dourado botao-pequeno" onClick={() => aoTrocarTela('eventos')}>
            Ver Detalhes
          </button>
        </section>
      )}

      {/* ---------- Resumo de hoje ---------- */}
      <h3 className="titulo-secao">Resumo de Hoje</h3>
      {aulasDeHoje.length === 0 ? (
        <div className="cartao cartao-com-barra">
          <p className="texto-cinza">Sem aulas hoje. Aproveite o descanso! 😄</p>
        </div>
      ) : (
        aulasDeHoje.map((aula) => (
          <div className="cartao cartao-com-barra" key={aula.id}>
            <strong>{aula.materia}</strong>
            <span className="texto-roxo">
              {aula.horario} • {aula.sala}
            </span>
            <small className="texto-cinza">{aula.professor}</small>
          </div>
        ))
      )}

      {/* ---------- Canais da comunidade ---------- */}
      <h3 className="titulo-secao">Canais da Comunidade</h3>
      <div className="grade-dois">
        <a className="cartao canal" href={LINK_WHATSAPP} target="_blank" rel="noreferrer">
          <span className="canal-icone">💬</span>
          <div>
            <strong>WhatsApp</strong>
            <small className="texto-roxo">Comunidade</small>
          </div>
        </a>
        <a className="cartao canal" href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
          <span className="canal-icone">📸</span>
          <div>
            <strong>Instagram</strong>
            <small className="texto-roxo">@tera.fsg</small>
          </div>
        </a>
      </div>

      {/* ---------- Modal de avisos ---------- */}
      {avisosAbertos && (
        <Modal titulo="Avisos do D.A." aoFechar={() => setAvisosAbertos(false)}>
          {avisos.length === 0 && <p className="texto-cinza">Nenhum aviso por enquanto.</p>}
          {avisos.map((aviso) => (
            <div className="aviso" key={aviso.id}>
              <strong>{aviso.titulo}</strong>
              <p>{aviso.texto}</p>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

export default Inicio;
