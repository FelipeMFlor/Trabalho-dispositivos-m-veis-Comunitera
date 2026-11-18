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
  ehAdmin: boolean; 
  aoAdicionar: (titulo: string, data: string, hora: string, categoria: Categoria) => void;
  aoRemover: (id: number) => void;
}

type Filtro = 'todos' | 'academico' | 'pessoal';

const LETRAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const NOME_DA_CATEGORIA: Record<Categoria, string> = {
  academico: 'Acadêmico',
  pessoal: 'Pessoal',
  tera: 'Evento TERA',
};

function Calendario({ compromissos, ehAdmin, aoAdicionar, aoRemover }: Props) {
  const hoje = new Date();

  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState(dataDeHoje());
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<Categoria>(ehAdmin ? 'academico' : 'pessoal');

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

  const compromissosFiltrados = compromissos.filter((c) => filtro === 'todos' || c.categoria === filtro);

  const celulas: (number | null)[] = [];
  for (let i = 0; i < primeiroDiaDaSemana(ano, mes); i++) {
    celulas.push(null);
  }
  for (let dia = 1; dia <= diasNoMes(ano, mes); dia++) {
    celulas.push(dia);
  }

  function temCompromisso(data: string): boolean {
    return compromissosFiltrados.some((c) => c.data === data);
  }

  const doDia = compromissosFiltrados
    .filter((c) => c.data === diaSelecionado)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  function salvarCompromisso(evento: FormEvent) {
    evento.preventDefault();
    if (novoTitulo.trim() === '' || novaHora === '') {
      return;
    }
    aoAdicionar(novoTitulo.trim(), diaSelecionado, novaHora, novaCategoria);
    setNovoTitulo('');
    setNovaHora('');
    setFormularioAberto(false);
  }

  return (
    <div className="tela">
      <h1 className="titulo-tela">Seu calendário!</h1>

      {/* ---------- Abas de filtro ---------- */}
      <div className="filtros">
        <button className={filtro === 'todos' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('todos')}>
          todos
        </button>
        <button className={filtro === 'academico' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('academico')}>
          acadêmico
        </button>
        <button className={filtro === 'pessoal' ? 'filtro ativo' : 'filtro'} onClick={() => setFiltro('pessoal')}>
          pessoal
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

      {doDia.length === 0 && <p className="texto-cinza">Nada marcado para este dia...</p>}

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
