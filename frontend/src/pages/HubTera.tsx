import type { Usuario } from '../types';
import { EMAIL_OUVIDORIA, LINK_INSTAGRAM, LINK_WHATSAPP } from '../links';

interface Props {
  usuario: Usuario;
  aoSair: () => void;
}

function HubTera({ usuario, aoSair }: Props) {
  return (
    <div className="tela">
      {/* ---------- Carteirinha ---------- */}
      <section className="carteirinha">
        <span className="carteirinha-titulo">CARTEIRINHA DIGITAL</span>
        <span className="carteirinha-subtitulo">DIRETÓRIO ACADÊMICO TERA</span>

        <div className="carteirinha-linha">
          <div className="carteirinha-foto">👤</div>
          <div className="carteirinha-dados">
            <strong>{usuario.nome}</strong>
            <span>{usuario.curso}</span>
            <span className="texto-dourado">RGM: {usuario.ra}</span>
          </div>
          <div className="carteirinha-qr" title="QR Code">🏁</div>
        </div>
      </section>

      {/* ---------- Atalhos ---------- */}
      <h3 className="titulo-secao">Central do D.A</h3>

      <a className="cartao atalho" href={LINK_WHATSAPP} target="_blank" rel="noreferrer">
        <span>💬</span>
        <strong>Comunidade no WhatsApp</strong>
        <span className="seta-atalho">→</span>
      </a>

      <a className="cartao atalho" href={LINK_INSTAGRAM} target="_blank" rel="noreferrer">
        <span>📸</span>
        <strong>Instagram @tera.fsg</strong>
        <span className="seta-atalho">→</span>
      </a>

      <a className="cartao atalho" href={'mailto:' + EMAIL_OUVIDORIA}>
        <span>✉️</span>
        <strong>
          Fale com a gente!!
          <br />
          Ouvidoria TERA.
        </strong>
        <span className="seta-atalho">→</span>
      </a>

      <button className="botao botao-sair" onClick={aoSair}>
        Sair da conta
      </button>
    </div>
  );
}

export default HubTera;
