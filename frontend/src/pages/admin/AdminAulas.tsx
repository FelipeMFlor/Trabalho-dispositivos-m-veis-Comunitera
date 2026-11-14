// =============================================================
// AdminAulas.tsx — grade de aulas (usada no "Resumo de Hoje")
// =============================================================

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Aula } from '../../types';
import { apiDelete, apiPost } from '../../api';
import ItemAdmin from '../../components/ItemAdmin';

interface Props {
  aulas: Aula[];
  aoAtualizar: () => void;
}

// A posição na lista é o número do dia: 0 = Domingo ... 6 = Sábado
const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function AdminAulas({ aulas, aoAtualizar }: Props) {
  const [diaDaSemana, setDiaDaSemana] = useState(1);
  const [materia, setMateria] = useState('');
  const [horario, setHorario] = useState('');
  const [sala, setSala] = useState('');
  const [professor, setProfessor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem('');
    setErro('');
    try {
      await apiPost('/aulas', { diaDaSemana, materia, horario, sala, professor });
      setMateria('');
      setHorario('');
      setSala('');
      setProfessor('');
      setMensagem('Aula cadastrada!');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/aulas/' + id);
      aoAtualizar();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <>
      <form className="cartao formulario" onSubmit={cadastrar}>
        <h3>Nova aula</h3>
        <label>
          Dia da semana
          <select value={diaDaSemana} onChange={(e) => setDiaDaSemana(Number(e.target.value))}>
            {DIAS.map((nome, numero) => (
              <option key={numero} value={numero}>
                {nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Matéria
          <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ex: Banco de Dados" />
        </label>
        <div className="grade-dois">
          <label>
            Horário
            <input value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="19:30 - 22:30" />
          </label>
          <label>
            Sala
            <input value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Sala 304" />
          </label>
        </div>
        <label>
          Professor(a)
          <input value={professor} onChange={(e) => setProfessor(e.target.value)} placeholder="Prof. Adélcio" />
        </label>

        {erro !== '' && <p className="mensagem-erro">{erro}</p>}
        {mensagem !== '' && <p className="mensagem-sucesso">{mensagem}</p>}

        <button type="submit" className="botao botao-dourado">
          Cadastrar aula
        </button>
      </form>

      <h3 className="titulo-secao">Grade de aulas ({aulas.length})</h3>
      {aulas.map((aula) => (
        <ItemAdmin
          key={aula.id}
          titulo={DIAS[aula.diaDaSemana] + ' — ' + aula.materia}
          detalhe={aula.horario + ' • ' + aula.sala + ' • ' + aula.professor}
          aoApagar={() => apagar(aula.id)}
        />
      ))}
    </>
  );
}

export default AdminAulas;
