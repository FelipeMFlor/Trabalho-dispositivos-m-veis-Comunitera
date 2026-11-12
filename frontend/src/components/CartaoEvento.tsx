// =============================================================
// CartaoEvento.tsx
// O card de um evento na tela "Eventos & Inscrições":
// topo colorido com emoji + selo da data, título, local/hora
// e o botão de inscrição.
// =============================================================

import type { Evento } from '../types';
import { formatarSelo } from '../utils/datas';

interface Props {
  evento: Evento;
  inscrito: boolean; // o aluno já está inscrito neste evento?
  aoClicarInscricao: (idDoEvento: number) => void;
}

function CartaoEvento({ evento, inscrito, aoClicarInscricao }: Props) {
  return (
    <article className="cartao cartao-evento">
      <div className={'cartao-evento-topo ' + evento.corDoTopo}>
        <span className="cartao-evento-emoji">{evento.emoji}</span>
        <span className="selo-data">{formatarSelo(evento.data)}</span>
      </div>

      <div className="cartao-evento-corpo">
        <h3>{evento.titulo}</h3>
        <p className="texto-roxo">
          {evento.local} • {evento.hora}h
        </p>

        {/* Operador ternário: condição ? se verdadeiro : se falso */}
        <button
          className={inscrito ? 'botao botao-contorno' : 'botao botao-dourado'}
          onClick={() => aoClicarInscricao(evento.id)}
        >
          {inscrito ? '✓ Inscrito — cancelar' : 'Garantir minha vaga!'}
        </button>
      </div>
    </article>
  );
}

export default CartaoEvento;
