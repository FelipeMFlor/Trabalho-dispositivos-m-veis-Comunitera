// =============================================================
// Vagas.tsx  —  "4. Vagas"
// Mural com vagas de estágio/emprego. "Ver Vaga" abre os detalhes
// e o aluno pode marcar que se candidatou.
// =============================================================

import { useState } from 'react';
import type { Vaga } from '../types';
import Modal from '../components/Modal';

interface Props {
  vagas: Vaga[]; // vêm do servidor
  candidaturas: number[]; // ids das vagas em que o aluno se candidatou
  aoCandidatar: (idDaVaga: number) => void;
}

function Vagas({ vagas, candidaturas, aoCandidatar }: Props) {
  // Guarda a vaga que está aberta no modal (ou null = nenhuma)
  const [vagaAberta, setVagaAberta] = useState<Vaga | null>(null);

  return (
    <div className="tela">
      <h1 className="titulo-tela">Mural de Vagas</h1>

      {vagas.length === 0 && <p className="texto-cinza centralizado">Nenhuma vaga cadastrada ainda.</p>}

      {vagas.map((vaga) => (
        <article className="cartao vaga" key={vaga.id}>
          <div className="vaga-linha">
            <span className="vaga-icone">{vaga.emoji}</span>
            <div>
              <h3>{vaga.titulo}</h3>
              <p className="texto-roxo">
                {vaga.empresa} • {vaga.modalidade}
              </p>
            </div>
          </div>
          <div className="linha-entre">
            <span className="chip">{vaga.cargaHoraria}</span>
            <button className="botao botao-dourado botao-pequeno" onClick={() => setVagaAberta(vaga)}>
              {candidaturas.includes(vaga.id) ? '✓ Candidatado' : 'Ver Vaga'}
            </button>
          </div>
        </article>
      ))}

      {/* Modal com os detalhes da vaga escolhida */}
      {vagaAberta !== null && (
        <Modal titulo={vagaAberta.titulo} aoFechar={() => setVagaAberta(null)}>
          <p className="texto-roxo">
            {vagaAberta.empresa} • {vagaAberta.modalidade} • {vagaAberta.cargaHoraria}
          </p>
          <p>{vagaAberta.descricao}</p>
          <strong>Requisitos:</strong>
          <ul className="lista-requisitos">
            {vagaAberta.requisitos.map((requisito) => (
              <li key={requisito}>{requisito}</li>
            ))}
          </ul>

          {candidaturas.includes(vagaAberta.id) ? (
            <p className="mensagem-sucesso">✓ Você já se candidatou a esta vaga.</p>
          ) : (
            <button className="botao botao-dourado" onClick={() => aoCandidatar(vagaAberta.id)}>
              Quero me candidatar
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Vagas;
