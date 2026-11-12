// =============================================================
// Calendario.tsx  —  "2. Calendário"
// Mostra o mês em forma de grade, deixa escolher um dia,
// filtrar por categoria e adicionar compromissos (botão +).
// =============================================================

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Categoria, Compromisso } from '../types';
import Modal from '../components/Modal';
import {
  NOMES_DOS_MESES,
  dataDeHoje,
  diasNoMes,
  formatarDiaMes,
  montarData,
  primeiroDiaDaSemana,
} from '../utils/datas';

interface Props {
  compromissos: Compromisso[];
  ehAdmin: boolean; // admin cria compromissos gerais (todos os alunos veem)
  aoAdicionar: (titulo: string, data: string, hora: string, categoria: Categoria) => void;
  aoRemover: (id: number) => void;
}

type Filtro = 'todos' | 'academico' | 'pessoal';

const LETRAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Texto que aparece embaixo do título do compromisso
const NOME_DA_CATEGORIA: Record<Categoria, string> = {
  academico: 'Acadêmico',
  pessoal: 'Pessoal',
  tera: 'Evento TERA',
};

function Calendario({ compromissos, ehAdmin, aoAdicionar, aoRemover }: Props) {
  const hoje = new Date();

  // Mês e ano que estão aparecendo na tela (começa no mês atual)
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth()); // 0 = janeiro
  const [diaSelecionado, setDiaSelecionado] = useState(dataDeHoje());
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Estados do formulário de novo compromisso
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<Categoria>(ehAdmin ? 'academico' : 'pessoal');

  // ---------- Navegar entre os meses ----------
  function mesAnterior() {
    if (mes === 0) {
      setMes(11);
      setAno(ano - 1);
    } else {
      setMes(mes - 1);
    }
  }

  function proximoMes() {
    if (mes === 11) {
      setMes(0);
      setAno(ano + 1);
    } else {
      setMes(mes + 1);
    }
  }

  // ---------- Filtro por categoria ----------
  // "Todos" mostra tudo; "Acadêmico" e "Pessoal" mostram só a categoria escolhida
  const compromissosFiltrados = compromissos.filter((c) => filtro === 'todos' || c.categoria === filtro);

  // ---------- Montar a grade do mês ----------
  // Começa com espaços vazios (null) até o dia da semana em que o mês começa
  const celulas: (number | null)[] = [];
  for (let i = 0; i < primeiroDiaDaSemana(ano, mes); i++) {
    celulas.push(null);
  }
  for (let dia = 1; dia <= diasNoMes(ano, mes); dia++) {
    celulas.push(dia);
  }

  // Verifica se um dia tem algum compromisso (para mostrar a bolinha)
  function temCompromisso(data: string): boolean {
    return compromissosFiltrados.some((c) => c.data === data);
  }

  // Compromissos do dia escolhido, em ordem de horário
  const doDia = compromissosFiltrados
    .filter((c) => c.data === diaSelecionado)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  // ---------- Salvar novo compromisso ----------
  function salvarCompromisso(evento: FormEvent) {
    evento.preventDefault();
    if (novoTitulo.trim() === '' || novaHora === '') {
      return;
    }
    // Quem salva de verdade é o App, que manda para o servidor
    aoAdicionar(novoTitulo.trim(), diaSelecionado, novaHora, novaCategoria);
    // Limpa e fecha o formulário
    setNovoTitulo('');
    setNovaHora('');
    setFormularioAberto(false);
  }

  return (
    <div className="tela">
      <h1 className="titulo-tela">Calendário</h1>

      {/* ---------- Abas de filtro ---------- */}
      <div className="filtros">
        <button className={filtro === 'todos' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('todos')}>
          Todos
        </button>
        <button className={filtro === 'academico' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('academico')}>
          Acadêmico
        </button>
        <button className={filtro === 'pessoal' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('pessoal')}>
          Pessoal
        </button>
      </div>

      {/* ---------- Grade do mês ---------- */}
      <div className="cartao calendario">
        <div className="calendario-topo">
          <button className="seta" onClick={mesAnterior} aria-label="Mês anterior">‹</button>
          <h2>
            {NOMES_DOS_MESES[mes]} {ano}
          </h2>
          <button className="seta" onClick={proximoMes} aria-label="Próximo mês">›</button>
        </div>

        <div className="calendario-grade">
          {LETRAS_DA_SEMANA.map((letra, indice) => (
            <span key={indice} className="calendario-letra">{letra}</span>
          ))}

          {celulas.map((dia, indice) => {
            if (dia === null) {
              return <span key={indice}></span>;
            }
            const data = montarData(ano, mes, dia);
            let classe = 'calendario-dia';
            if (data === diaSelecionado) classe += ' selecionado';
            if (data === dataDeHoje()) classe += ' hoje';
            return (
              <button key={indice} className={classe} onClick={() => setDiaSelecionado(data)}>
                {dia}
                {temCompromisso(data) && <span className="bolinha"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Lista do dia ---------- */}
      <h3 className="titulo-secao">Eventos de {formatarDiaMes(diaSelecionado)}</h3>

      {doDia.length === 0 && <p className="texto-cinza">Nada marcado para este dia.</p>}

      {doDia.map((c) => (
        <div key={c.id} className={'cartao cartao-com-barra barra-' + c.categoria}>
          <div className="linha-entre">
            <strong>{c.titulo}</strong>
            {c.podeApagar && (
              <button className="botao-apagar" onClick={() => aoRemover(c.id)} aria-label="Apagar">
                🗑️
              </button>
            )}
          </div>
          <small className={c.categoria === 'tera' ? 'texto-dourado' : 'texto-roxo'}>
            {NOME_DA_CATEGORIA[c.categoria]} • {c.hora}
          </small>
        </div>
      ))}

      {/* ---------- Botão flutuante "+" ---------- */}
      <button className="botao-flutuante" onClick={() => setFormularioAberto(true)} aria-label="Novo compromisso">
        +
      </button>

      {/* ---------- Formulário de novo compromisso ---------- */}
      {formularioAberto && (
        <Modal titulo={'Novo compromisso — ' + formatarDiaMes(diaSelecionado)} aoFechar={() => setFormularioAberto(false)}>
          <form className="formulario" onSubmit={salvarCompromisso}>
            <label>
              Título
              <input value={novoTitulo} onChange={(e) => setNovoTitulo(e.target.value)} placeholder="Ex: Estudar para a prova" />
            </label>
            <label>
              Horário
              <input type="time" value={novaHora} onChange={(e) => setNovaHora(e.target.value)} />
            </label>
            <label>
              Categoria
              <select value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value as Categoria)}>
                {/* O aluno cria compromissos só dele; o admin cria para todos */}
                {ehAdmin ? (
                  <>
                    <option value="academico">Acadêmico (todos os alunos veem)</option>
                    <option value="tera">Evento TERA (todos os alunos veem)</option>
                  </>
                ) : (
                  <>
                    <option value="pessoal">Pessoal</option>
                    <option value="academico">Acadêmico</option>
                  </>
                )}
              </select>
            </label>
            <button type="submit" className="botao botao-dourado">
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Calendario;
