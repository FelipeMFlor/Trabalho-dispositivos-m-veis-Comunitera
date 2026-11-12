// =============================================================
// Modal.tsx
// Uma "janela" que abre por cima da tela (fundo escurecido).
// Usada para: avisos, detalhes da vaga e novo compromisso.
//
// "children" é o conteúdo que fica DENTRO da tag:
//   <Modal titulo="Oi" aoFechar={...}> conteúdo aqui </Modal>
// =============================================================

import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
}

function Modal({ titulo, aoFechar, children }: Props) {
  return (
    // Clicar no fundo escuro fecha o modal
    <div className="modal-fundo" onClick={aoFechar}>
      {/* stopPropagation: clicar DENTRO da caixa não fecha */}
      <div className="modal-caixa" onClick={(e) => e.stopPropagation()}>
        <div className="modal-topo">
          <h2>{titulo}</h2>
          <button className="modal-fechar" onClick={aoFechar} aria-label="Fechar">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
