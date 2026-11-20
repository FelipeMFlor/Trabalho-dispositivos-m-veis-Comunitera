import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Categoria, Compromisso } from '../../types';
import { useDados } from '../../contexto/DadosContexto';
import {
  NOMES_DOS_MESES,
  dataDeHoje,
  diasNoMes,
  formatarDiaMes,
  montarData,
  primeiroDiaDaSemana,
} from '../../utils/datas';
import { horaValida, mascaraHora } from '../../utils/mascaras';
import { confirmar } from '../../utils/mensagens';
import { CORES } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import Opcoes from '../../components/Opcoes';
import JanelaModal from '../../components/JanelaModal';
import Campo from '../../components/Campo';
import Botao from '../../components/Botao';

type Filtro = 'todos' | 'academico' | 'pessoal';

const LETRAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const NOME_DA_CATEGORIA: Record<Categoria, string> = {
  academico: 'Acadêmico',
  pessoal: 'Pessoal',
  tera: 'Evento TERA',
};

const COR_DA_CATEGORIA: Record<Categoria, string> = {
  academico: CORES.roxo,
  pessoal: CORES.lilas,
  tera: CORES.dourado,
};

export default function Calendario() {
  const { compromissos, eventos, ehAdmin, adicionarCompromisso, removerCompromisso } = useDados();
  const hoje = new Date();

  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSelecionado, setDiaSelecionado] = useState(dataDeHoje());
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<Categoria>(ehAdmin ? 'academico' : 'pessoal');
  const [erroFormulario, setErroFormulario] = useState('');

  const todosOsCompromissos: Compromisso[] = [
    ...compromissos,
    ...eventos.map((evento) => ({
      id: -evento.id,
      titulo: evento.titulo,
      data: evento.data,
      hora: evento.hora,
      categoria: 'tera' as const,
      podeApagar: false,
    })),
  ];

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

  const compromissosFiltrados = todosOsCompromissos.filter((c) => filtro === 'todos' || c.categoria === filtro);

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

  function salvarCompromisso() {
    if (novoTitulo.trim() === '') {
      setErroFormulario('Dê um título para o compromisso.');
      return;
    }
    if (!horaValida(novaHora)) {
      setErroFormulario('Digite o horário no formato HH:MM, ex: 18:30.');
      return;
    }
    adicionarCompromisso(novoTitulo.trim(), diaSelecionado, novaHora, novaCategoria);
    setNovoTitulo('');
    setNovaHora('');
    setErroFormulario('');
    setFormularioAberto(false);
  }

  function abrirFormulario() {
    setErroFormulario('');
    setFormularioAberto(true);
  }

  async function apagarCompromisso(compromisso: Compromisso) {
    if (await confirmar('Apagar "' + compromisso.titulo + '"?', 'Isso não pode ser desfeito.')) {
      removerCompromisso(compromisso.id);
    }
  }

  const categoriasDoFormulario: { valor: Categoria; nome: string }[] = ehAdmin
    ? [
        { valor: 'academico', nome: 'Acadêmico (todos)' },
        { valor: 'tera', nome: 'Evento TERA (todos)' },
      ]
    : [
        { valor: 'pessoal', nome: 'Pessoal' },
        { valor: 'academico', nome: 'Acadêmico' },
      ];

  const botaoMais = (
    <Pressable
      style={({ pressed }) => [estilos.botaoFlutuante, pressed && { opacity: 0.8 }]}
      onPress={abrirFormulario}
      accessibilityLabel="Novo compromisso"
    >
      <Ionicons name="add" size={32} color={CORES.texto} />
    </Pressable>
  );

  return (
    <Tela flutuante={botaoMais}>
      <Text style={comuns.tituloTela}>Seu calendário!</Text>

      <Opcoes
        opcoes={[
          { valor: 'todos', nome: 'todos' },
          { valor: 'academico', nome: 'acadêmico' },
          { valor: 'pessoal', nome: 'pessoal' },
        ]}
        escolhida={filtro}
        aoEscolher={setFiltro}
      />

      <View style={comuns.cartao}>
        <View style={estilos.topo}>
          <Pressable style={estilos.seta} onPress={mesAnterior} accessibilityLabel="Mês anterior">
            <Ionicons name="chevron-back" size={22} color={CORES.roxo} />
          </Pressable>
          <Text style={estilos.nomeDoMes}>
            {NOMES_DOS_MESES[mes]} {ano}
          </Text>
          <Pressable style={estilos.seta} onPress={proximoMes} accessibilityLabel="Próximo mês">
            <Ionicons name="chevron-forward" size={22} color={CORES.roxo} />
          </Pressable>
        </View>

        <View style={estilos.grade}>
          {LETRAS_DA_SEMANA.map((letra, indice) => (
            <View key={'letra' + indice} style={estilos.celula}>
              <Text style={estilos.letra}>{letra}</Text>
            </View>
          ))}

          {celulas.map((dia, indice) => {
            if (dia === null) {
              return <View key={indice} style={estilos.celula} />;
            }
            const data = montarData(ano, mes, dia);
            const selecionado = data === diaSelecionado;
            const ehHoje = data === dataDeHoje();
            return (
              <View key={indice} style={estilos.celula}>
                <Pressable
                  style={[estilos.dia, selecionado && estilos.diaSelecionado]}
                  onPress={() => setDiaSelecionado(data)}
                >
                  <Text style={[estilos.diaTexto, ehHoje && estilos.diaHoje, selecionado && estilos.diaTextoSelecionado]}>
                    {dia}
                  </Text>
                  {temCompromisso(data) && <View style={estilos.bolinha} />}
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={comuns.tituloSecao}>Eventos de {formatarDiaMes(diaSelecionado)}</Text>

      {doDia.length === 0 && <Text style={comuns.textoCinza}>Nada marcado para este dia...</Text>}

      {doDia.map((c) => (
        <View
          key={c.id}
          style={[comuns.cartao, comuns.cartaoComBarra, { borderLeftColor: COR_DA_CATEGORIA[c.categoria] }]}
        >
          <View style={comuns.linhaEntre}>
            <Text style={[comuns.textoNegrito, { flex: 1 }]}>{c.titulo}</Text>
            {c.podeApagar && (
              <Pressable onPress={() => apagarCompromisso(c)} accessibilityLabel="Apagar" hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={CORES.vermelho} />
              </Pressable>
            )}
          </View>
          <Text style={c.categoria === 'tera' ? comuns.textoDourado : comuns.textoRoxo}>
            {NOME_DA_CATEGORIA[c.categoria]} • {c.hora}
          </Text>
        </View>
      ))}

      <JanelaModal
        titulo={'Novo compromisso — ' + formatarDiaMes(diaSelecionado)}
        aberta={formularioAberto}
        aoFechar={() => setFormularioAberto(false)}
      >
        <View style={comuns.formulario}>
          <Campo
            rotulo="Título"
            value={novoTitulo}
            onChangeText={setNovoTitulo}
            placeholder="Ex: Estudar para a prova"
          />
          <Campo
            rotulo="Horário"
            value={novaHora}
            onChangeText={(texto) => setNovaHora(mascaraHora(texto))}
            placeholder="HH:MM"
            keyboardType="number-pad"
            maxLength={5}
          />
          <Opcoes rotulo="Categoria" opcoes={categoriasDoFormulario} escolhida={novaCategoria} aoEscolher={setNovaCategoria} />

          {erroFormulario !== '' && <Text style={comuns.mensagemErro}>{erroFormulario}</Text>}

          <Botao texto="Salvar" aoTocar={salvarCompromisso} />
        </View>
      </JanelaModal>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  nomeDoMes: { color: CORES.roxo, fontSize: 20, fontWeight: '700' },
  seta: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  grade: { flexDirection: 'row', flexWrap: 'wrap' },
  celula: { width: `${100 / 7}%`, aspectRatio: 1, padding: 2 },
  letra: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: CORES.cinza, paddingTop: 10 },
  dia: { flex: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  diaSelecionado: { backgroundColor: CORES.dourado },
  diaTexto: { fontSize: 14, color: CORES.texto },
  diaHoje: { color: CORES.roxo, fontWeight: '800' },
  diaTextoSelecionado: { color: CORES.texto, fontWeight: '700' },
  bolinha: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: CORES.roxo,
  },

  botaoFlutuante: {
    position: 'absolute',
    right: 24,
    bottom: 110,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CORES.dourado,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
});
