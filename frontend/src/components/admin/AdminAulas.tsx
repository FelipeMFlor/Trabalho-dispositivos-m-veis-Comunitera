import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Aula } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { mostrarMensagem } from '../../utils/mensagens';
import { estilos as comuns } from '../../constants/estilos';
import Campo from '../Campo';
import Opcoes from '../Opcoes';
import Botao from '../Botao';
import ItemAdmin from '../ItemAdmin';

interface Props {
  aulas: Aula[];
  aoAtualizar: () => void;
}

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const OPCOES_DE_DIA = DIAS.map((nome, numero) => ({ valor: numero, nome: nome.slice(0, 3) }));

function AdminAulas({ aulas, aoAtualizar }: Props) {
  const [diaDaSemana, setDiaDaSemana] = useState(1);
  const [materia, setMateria] = useState('');
  const [horario, setHorario] = useState('');
  const [sala, setSala] = useState('');
  const [professor, setProfessor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar() {
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
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  return (
    <>
      <View style={[comuns.cartao, comuns.formulario]}>
        <Text style={comuns.tituloFormulario}>Nova aula</Text>
        <Opcoes rotulo="Dia da semana" opcoes={OPCOES_DE_DIA} escolhida={diaDaSemana} aoEscolher={setDiaDaSemana} rolavel />
        <Campo rotulo="Matéria" value={materia} onChangeText={setMateria} placeholder="Ex: Banco de Dados" />
        <View style={comuns.gradeDois}>
          <View style={comuns.colunaMetade}>
            <Campo rotulo="Horário" value={horario} onChangeText={setHorario} placeholder="19:30 - 22:30" />
          </View>
          <View style={comuns.colunaMetade}>
            <Campo rotulo="Sala" value={sala} onChangeText={setSala} placeholder="Sala 304" />
          </View>
        </View>
        <Campo rotulo="Professor(a)" value={professor} onChangeText={setProfessor} placeholder="Prof. Adélcio" />

        {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}
        {mensagem !== '' && <Text style={comuns.mensagemSucesso}>{mensagem}</Text>}

        <Botao texto="Cadastrar aula" aoTocar={cadastrar} />
      </View>

      <Text style={comuns.tituloSecao}>Grade de aulas ({aulas.length})</Text>
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
