import { useState } from 'react';
import type { Aula, Aviso, Compromisso, Evento, Vaga } from '../../types';
import AdminEventos from './AdminEventos';
import AdminVagas from './AdminVagas';
import AdminAvisos from './AdminAvisos';
import AdminAulas from './AdminAulas';
import AdminCalendario from './AdminCalendario';

interface Props {
  eventos: Evento[];
  vagas: Vaga[];
  avisos: Aviso[];
  aulas: Aula[];
  compromissos: Compromisso[];
  aoAtualizar: () => void;
}

type Aba = 'eventos' | 'vagas' | 'avisos' | 'aulas' | 'calendario';

const ABAS: { id: Aba; nome: string }[] = [
  { id: 'eventos', nome: '🎟️ Eventos' },
  { id: 'vagas', nome: '💼 Vagas' },
  { id: 'avisos', nome: '🔔 Avisos' },
  { id: 'aulas', nome: '📚 Aulas' },
  { id: 'calendario', nome: '📅 Calendário' },
];

function PainelAdmin({ eventos, vagas, avisos, aulas, compromissos, aoAtualizar }: Props) {
  const [aba, setAba] = useState<Aba>('eventos');

  return (
    <div className="tela">
      <h1 className="titulo-tela">Painel do D.A.</h1>
      <p className="texto-cinza">Tudo que você cadastrar aqui aparece para todos os alunos!</p>

      <div className="painel-abas">
        {ABAS.map((item) => (
          <button key={item.id} className={aba === item.id ? 'filtro ativo' : 'filtro'} onClick={() => setAba(item.id)}>
            {item.nome}
          </button>
        ))}
      </div>

      {aba === 'eventos' && <AdminEventos eventos={eventos} aoAtualizar={aoAtualizar} />}
      {aba === 'vagas' && <AdminVagas vagas={vagas} aoAtualizar={aoAtualizar} />}
      {aba === 'avisos' && <AdminAvisos avisos={avisos} aoAtualizar={aoAtualizar} />}
      {aba === 'aulas' && <AdminAulas aulas={aulas} aoAtualizar={aoAtualizar} />}
      {/* Para o admin, "podeApagar" = compromisso geral do DA */}
      {aba === 'calendario' && (
        <AdminCalendario compromissos={compromissos.filter((c) => c.podeApagar)} aoAtualizar={aoAtualizar} />
      )}
    </div>
  );
}

export default PainelAdmin;
