import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Compromisso } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { formatarDiaMes } from '../../utils/datas';
import ItemAdmin from '../../components/ItemAdmin';

interface Props {
  compromissos: Compromisso[]; //só os gerais do DA
  aoAtualizar: () => void;
}

function AdminCalendario({ compromissos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [categoria, setCategoria] = useState<'academico' | 'tera'>('academico');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem('');
    setErro('');
    try {
      await apiPost('/compromissos', { titulo, data, hora, categoria });
      setTitulo('');
      setData('');
      setHora('');
      setMensagem('Data adicionada ao calendário de todos!');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/compromissos/' + id);
      aoAtualizar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <>
      <form className="cartao formulario" onSubmit={cadastrar}>
        <h3>Nova data no calendário</h3>
        <label>
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Prova de Redes" />
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
        <label>
          Categoria
          <select value={categoria} onChange={(e) => setCategoria(e.target.value as 'academico' | 'tera')}>
            <option value="academico">Acadêmico</option>
            <option value="tera">Evento TERA</option>
          </select>
        </label>

        {erro !== '' && <p className="mensagem-erro">{erro}</p>}
        {mensagem !== '' && <p className="mensagem-sucesso">{mensagem}</p>}

        <button type="submit" className="botao botao-dourado">
          Adicionar data
        </button>
      </form>

      <h3 className="titulo-secao">Datas cadastradas ({compromissos.length})</h3>
      {compromissos.map((c) => (
        <ItemAdmin
          key={c.id}
          titulo={c.titulo}
          detalhe={formatarDiaMes(c.data) + ' às ' + c.hora + ' • ' + (c.categoria === 'tera' ? 'Evento TERA' : 'Acadêmico')}
          aoApagar={() => apagar(c.id)}
        />
      ))}
    </>
  );
}

export default AdminCalendario;
