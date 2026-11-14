// =============================================================
// ItemAdmin.tsx
// Uma linha das listas do Painel do D.A.: título, detalhes e o
// botão de apagar (que pergunta antes, para evitar acidentes).
// =============================================================

interface Props {
  titulo: string;
  detalhe: string;
  aoApagar: () => void;
}

function ItemAdmin({ titulo, detalhe, aoApagar }: Props) {
  function confirmarApagar() {
    // confirm() abre uma caixinha do navegador com "OK" e "Cancelar"
    if (confirm('Apagar "' + titulo + '"? Isso não pode ser desfeito.')) {
      aoApagar();
    }
  }

  return (
    <div className="cartao item-admin">
      <div>
        <strong>{titulo}</strong>
        <small className="texto-cinza">{detalhe}</small>
      </div>
      <button className="botao-apagar" onClick={confirmarApagar} aria-label={'Apagar ' + titulo}>
        🗑️
      </button>
    </div>
  );
}

export default ItemAdmin;
