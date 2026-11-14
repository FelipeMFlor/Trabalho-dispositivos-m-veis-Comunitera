// =============================================================
// AdminVagas.tsx — cadastrar e apagar vagas do mural
// =============================================================

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Vaga } from '../../types';
import { apiDelete, apiPost } from '../../api';
import ItemAdmin from '../../components/ItemAdmin';

interface Props {
  vagas: Vaga[];
  aoAtualizar: () => void;
}

function AdminVagas({ vagas, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [modalidade, setModalidade] = useState('Remoto');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [emoji, setEmoji] = useState('💼');
  const [descricao, setDescricao] = useState('');
  const [requisitos, setRequisitos] = useState(''); // um por linha
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem('');
    setErro('');
    try {
      await apiPost('/vagas', { titulo, empresa, modalidade, cargaHoraria, emoji, descricao, requisitos });
      setTitulo('');
      setEmpresa('');
      setCargaHoraria('');
      setEmoji('💼');
      setDescricao('');
      setRequisitos('');
      setMensagem('Vaga cadastrada! Os alunos já podem ver.');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/vagas/' + id);
      aoAtualizar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <>
      <form className="cartao formulario" onSubmit={cadastrar}>
        <h3>Nova vaga</h3>
        <label>
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Estágio em Suporte" />
        </label>
        <label>
          Empresa
          <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Ex: FSG — Setor de TI" />
        </label>
        <div className="grade-dois">
          <label>
            Modalidade
            <select value={modalidade} onChange={(e) => setModalidade(e.target.value)}>
              <option>Remoto</option>
              <option>Híbrido</option>
              <option>Presencial</option>
            </select>
          </label>
          <label>
            Carga horária
            <input value={cargaHoraria} onChange={(e) => setCargaHoraria(e.target.value)} placeholder="Ex: 30h/semana" />
          </label>
        </div>
        <label>
          Emoji
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} />
        </label>
        <label>
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} />
        </label>
        <label>
          Requisitos (um por linha)
          <textarea
            value={requisitos}
            onChange={(e) => setRequisitos(e.target.value)}
            rows={3}
            placeholder={'Saber Git\nNoções de React'}
          />
        </label>

        {erro !== '' && <p className="mensagem-erro">{erro}</p>}
        {mensagem !== '' && <p className="mensagem-sucesso">{mensagem}</p>}

        <button type="submit" className="botao botao-dourado">
          Cadastrar vaga
        </button>
      </form>

      <h3 className="titulo-secao">Vagas cadastradas ({vagas.length})</h3>
      {vagas.map((vaga) => (
        <ItemAdmin
          key={vaga.id}
          titulo={vaga.emoji + ' ' + vaga.titulo}
          detalhe={vaga.empresa + ' • ' + vaga.modalidade + ' • ' + vaga.candidatos + ' candidato(s)'}
          aoApagar={() => apagar(vaga.id)}
        />
      ))}
    </>
  );
}

export default AdminVagas;
