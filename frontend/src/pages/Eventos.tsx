// =============================================================
// Eventos.tsx  —  "3. Eventos"
// Duas abas: "Próximos" (todos os eventos) e
// "Minhas Inscrições" (só os eventos em que o aluno se inscreveu).
// =============================================================

import { useState } from 'react';
import type { Evento } from '../types';
import CartaoEvento from '../components/CartaoEvento';

interface Props {
  eventos: Evento[]; // vêm do servidor
  inscricoes: number[]; // lista com os ids dos eventos inscritos
  aoClicarInscricao: (idDoEvento: number) => void;
}

function Eventos({ eventos, inscricoes, aoClicarInscricao }: Props) {
  const [aba, setAba] = useState<'proximos' | 'inscricoes'>('proximos');

  // Decide quais eventos aparecem, de acordo com a aba escolhida
  const eventosVisiveis =
    aba === 'proximos' ? eventos : eventos.filter((evento) => inscricoes.includes(evento.id));

  return (
    <div className="tela">
      <h1 className="titulo-tela">Eventos & Inscrições</h1>

      <div className="abas">
        <button className={aba === 'proximos' ? 'aba ativa' : 'aba'} onClick={() => setAba('proximos')}>
          Próximos
        </button>
        <button className={aba === 'inscricoes' ? 'aba ativa' : 'aba'} onClick={() => setAba('inscricoes')}>
          Minhas Inscrições ({inscricoes.length})
        </button>
      </div>

      {eventosVisiveis.length === 0 && (
        <p className="texto-cinza centralizado">
          {aba === 'proximos' ? 'Nenhum evento cadastrado ainda.' : 'Você ainda não se inscreveu em nenhum evento.'}
        </p>
      )}

      {eventosVisiveis.map((evento) => (
        <CartaoEvento
          key={evento.id}
          evento={evento}
          inscrito={inscricoes.includes(evento.id)}
          aoClicarInscricao={aoClicarInscricao}
        />
      ))}
    </div>
  );
}

export default Eventos;
