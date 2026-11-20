import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Vaga } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { mostrarMensagem } from '../../utils/mensagens';
import { estilos as comuns } from '../../constants/estilos';
import Campo from '../Campo';
import Opcoes from '../Opcoes';
import Botao from '../Botao';
import ItemAdmin from '../ItemAdmin';

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
  const [requisitos, setRequisitos] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar() {
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
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  return (
    <>
      <View style={[comuns.cartao, comuns.formulario]}>
        <Text style={comuns.tituloFormulario}>Nova vaga</Text>
        <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="ex: estágio em suporte" />
        <Campo rotulo="Empresa" value={empresa} onChangeText={setEmpresa} placeholder="ex: FSG, setor de TI" />
        <Opcoes
          rotulo="Modalidade"
          opcoes={[
            { valor: 'Remoto', nome: 'Remoto' },
            { valor: 'Híbrido', nome: 'Híbrido' },
            { valor: 'Presencial', nome: 'Presencial' },
          ]}
          escolhida={modalidade}
          aoEscolher={setModalidade}
        />
        <View style={comuns.gradeDois}>
          <View style={comuns.colunaMetade}>
            <Campo
              rotulo="Carga horária"
              value={cargaHoraria}
              onChangeText={setCargaHoraria}
              placeholder="ex: 30h por semana"
            />
          </View>
          <View style={comuns.colunaMetade}>
            <Campo rotulo="Emoji" value={emoji} onChangeText={setEmoji} maxLength={4} />
          </View>
        </View>
        <Campo rotulo="Descrição" value={descricao} onChangeText={setDescricao} multiline />
        <Campo
          rotulo="Requisitos (um por linha)"
          value={requisitos}
          onChangeText={setRequisitos}
          multiline
          placeholder={'Saber Git\nNoções de React'}
        />

        {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}
        {mensagem !== '' && <Text style={comuns.mensagemSucesso}>{mensagem}</Text>}

        <Botao texto="Cadastrar vaga" aoTocar={cadastrar} />
      </View>

      <Text style={comuns.tituloSecao}>Vagas cadastradas ({vagas.length})</Text>
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
