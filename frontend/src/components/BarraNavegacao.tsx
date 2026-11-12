// =============================================================
// BarraNavegacao.tsx
// A barra roxa fixa no rodapé, com os ícones das telas.
// O ícone da tela atual ganha um círculo dourado.
// O admin do D.A. ganha um botão a mais: ⚙️ Painel do D.A.
// =============================================================

import type { Tela } from '../types';

// Props = informações que o componente recebe de quem o usa (App.tsx)
interface Props {
  telaAtual: Tela;
  ehAdmin: boolean;
  aoTrocarTela: (tela: Tela) => void;
}

// Lista dos botões da barra. Cada um tem a tela que abre,
// o ícone (emoji) e um nome para leitores de tela (acessibilidade).
const botoes: { tela: Tela; icone: string; nome: string }[] = [
  { tela: 'inicio', icone: '🏠', nome: 'Página inicial' },
  { tela: 'calendario', icone: '📅', nome: 'Calendário' },
  { tela: 'eventos', icone: '🎟️', nome: 'Eventos' },
  { tela: 'vagas', icone: '💼', nome: 'Vagas' },
  { tela: 'hub', icone: '👤', nome: 'Hub TERA' },
];

function BarraNavegacao({ telaAtual, ehAdmin, aoTrocarTela }: Props) {
  // Para o admin, junta o botão do painel no fim da lista
  const botoesVisiveis = ehAdmin
    ? [...botoes, { tela: 'admin' as Tela, icone: '⚙️', nome: 'Painel do D.A.' }]
    : botoes;

  return (
    <nav className="barra-navegacao">
      {/* map = repete o botão para cada item da lista */}
      {botoesVisiveis.map((botao) => (
        <button
          key={botao.tela}
          className={botao.tela === telaAtual ? 'botao-nav ativo' : 'botao-nav'}
          onClick={() => aoTrocarTela(botao.tela)}
          aria-label={botao.nome}
          title={botao.nome}
        >
          {botao.icone}
        </button>
      ))}
    </nav>
  );
}

export default BarraNavegacao;
