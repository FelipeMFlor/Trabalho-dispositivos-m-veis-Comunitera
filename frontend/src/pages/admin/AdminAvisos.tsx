// =============================================================
// AdminAvisos.tsx — publicar e apagar avisos (aparecem no sininho)
// =============================================================

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Aviso } from '../../types';
import { apiDelete, apiPost } from '../../api';
import ItemAdmin from '../../components/ItemAdmin';

interface Props {
  avisos: Aviso[];
  aoAtualizar: () => void;
}

function AdminAvisos({ avisos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function publicar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem('');
    setErro('');
    try {
      await apiPost('/avisos', { titulo, texto });
      setTitulo('');
      setTexto('');
      setMensagem('Aviso publicado! Ele aparece no sininho da Página inicial.');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/avisos/' + id);
      aoAtualizar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <>
      <form className="cartao formulario" onSubmit={publicar}>
        <h3>Novo aviso</h3>
        <label>
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Reunião do D.A." />
        </label>
        <label>
          Texto
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={3} />
        </label>

        {erro !== '' && <p className="mensagem-erro">{erro}</p>}
        {mensagem !== '' && <p className="mensagem-sucesso">{mensagem}</p>}

        <button type="submit" className="botao botao-dourado">
          Publicar aviso
        </button>
      </form>

      <h3 className="titulo-secao">Avisos publicados ({avisos.length})</h3>
      {avisos.map((aviso) => (
        <ItemAdmin key={aviso.id} titulo={aviso.titulo} detalhe={aviso.texto} aoApagar={() => apagar(aviso.id)} />
      ))}
    </>
  );
}

export default AdminAvisos;
