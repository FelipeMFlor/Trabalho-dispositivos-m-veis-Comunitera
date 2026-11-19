
// =============================================================
// BarraNavegacao.tsx
// Barra roxa fixa no rodapé, com ícones Font Awesome.
// O ícone da tela atual ganha um círculo dourado.
// O admin do D.A. ganha um botão adicional.
// =============================================================

import type { Tela } from '../types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

import {
  faHouse,
  faCalendarDays,
  faTicket,
  faBriefcase,
  faUser,
  faGear
} from '@fortawesome/free-solid-svg-icons';

// Props recebidas do App.tsx
interface Props {
  telaAtual: Tela;
  ehAdmin: boolean;
  aoTrocarTela: (tela: Tela) => void;
}

// Lista dos botões da barra de navegação.
const botoes: { tela: Tela; icone: IconDefinition; nome: string }[] = [
  { tela: 'inicio', icone: faHouse, nome: 'Página inicial' },
  { tela: 'calendario', icone: faCalendarDays, nome: 'Calendário' },
  { tela: 'eventos', icone: faTicket, nome: 'Eventos' },
  { tela: 'vagas', icone: faBriefcase, nome: 'Vagas' },
  { tela: 'hub', icone: faUser, nome: 'Hub TERA' },
];

function BarraNavegacao({ telaAtual, ehAdmin, aoTrocarTela }: Props) {
  // Adiciona o botão administrativo quando o usuário é admin.
  const botoesVisiveis = ehAdmin
    ? [
        ...botoes,
        {
          tela: 'admin' as Tela,
          icone: faGear,
          nome: 'Painel do D.A.'
        }
      ]
    : botoes;

  return (
    <nav className="barra-navegacao">
      {botoesVisiveis.map((botao) => (
        <button
          key={botao.tela}
          className={botao.tela === telaAtual ? 'botao-nav ativo' : 'botao-nav'}
          onClick={() => aoTrocarTela(botao.tela)}
          aria-label={botao.nome}
          title={botao.nome}
        >
          <FontAwesomeIcon icon={botao.icone} />
        </button>
      ))}
    </nav>
  );
}

export default BarraNavegacao;
