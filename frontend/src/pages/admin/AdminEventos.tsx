import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Evento } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { formatarDiaMes } from '../../utils/datas';
import ItemAdmin from '../../components/ItemAdmin';

interface Props {
  eventos: Evento[];
  aoAtualizar: () => void;
}

function AdminEventos({ eventos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [emoji, setEmoji] = useState('🎉');
  const [corDoTopo, setCorDoTopo] = useState<'roxo' | 'escuro'>('roxo');
  const [destaque, setDestaque] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem('');
    setErro('');
    try {
      await apiPost('/eventos', { titulo, local, data, hora, emoji, corDoTopo, destaque });
      setTitulo('');
      setLocal('');
      setData('');
      setHora('');
      setEmoji('🎉');
      setCorDoTopo('roxo');
      setDestaque(false);
      setMensagem('Evento cadastrado! Os alunos já podem ver.');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/eventos/' + id);
      aoAtualizar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <>
      <form className="cartao formulario" onSubmit={cadastrar}>
        <h3>Novo evento</h3>
        <label>
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Festa de Fim de Ano" />
        </label>
        <label>
          Local
          <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex: Bar Janela" />
        </label>
        <div className="grade-dois">
          <label>
            Data
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          <label>
            Hora
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          </label>
        </div>
        <div className="grade-dois">
          <label>
            Emoji
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} />
          </label>
          <label>
            Cor do card
            <select value={corDoTopo} onChange={(e) => setCorDoTopo(e.target.value as 'roxo' | 'escuro')}>
              <option value="roxo">Roxo</option>
              <option value="escuro">Escuro</option>
            </select>
          </label>
        </div>
        <label className="label-checkbox">
          <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} />
          Mostrar como destaque na Página inicial
        </label>

        {erro !== '' && <p className="mensagem-erro">{erro}</p>}
        {mensagem !== '' && <p className="mensagem-sucesso">{mensagem}</p>}

        <button type="submit" className="botao botao-dourado">
          Cadastrar evento
        </button>
      </form>

      <h3 className="titulo-secao">Eventos cadastrados ({eventos.length})</h3>
      {eventos.map((ev) => (
        <ItemAdmin
          key={ev.id}
          titulo={ev.emoji + ' ' + ev.titulo + (ev.destaque ? ' ⭐' : '')}
          detalhe={formatarDiaMes(ev.data) + ' às ' + ev.hora + ' • ' + ev.local + ' • ' + ev.inscritos + ' inscrito(s)'}
          aoApagar={() => apagar(ev.id)}
        />
      ))}
    </>
  );
}

export default AdminEventos;
