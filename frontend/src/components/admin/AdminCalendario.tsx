import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Compromisso } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { formatarDiaMes } from '../../utils/datas';
import { dataParaServidor, horaValida, mascaraData, mascaraHora } from '../../utils/mascaras';
import { mostrarMensagem } from '../../utils/mensagens';
import { estilos as comuns } from '../../constants/estilos';
import Campo from '../Campo';
import Opcoes from '../Opcoes';
import Botao from '../Botao';
import ItemAdmin from '../ItemAdmin';

interface Props {
  compromissos: Compromisso[];
  aoAtualizar: () => void;
}

function AdminCalendario({ compromissos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [categoria, setCategoria] = useState<'academico' | 'tera'>('academico');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function cadastrar() {
    setMensagem('');
    setErro('');

    const dataCerta = dataParaServidor(data);
    if (data !== '' && dataCerta === '') {
      setErro('Data inválida. Use DD/MM/AAAA.');
      return;
    }
    if (hora !== '' && !horaValida(hora)) {
      setErro('Hora inválida. Use HH:MM.');
      return;
    }

    try {
      await apiPost('/compromissos', { titulo, data: dataCerta, hora, categoria });
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
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  return (
    <>
      <View style={[comuns.cartao, comuns.formulario]}>
        <Text style={comuns.tituloFormulario}>Nova data no calendário</Text>
        <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex: Prova de Redes" />
        <View style={comuns.gradeDois}>
          <View style={comuns.colunaMetade}>
            <Campo
              rotulo="Data"
              value={data}
              onChangeText={(texto) => setData(mascaraData(texto))}
              placeholder="DD/MM/AAAA"
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
          <View style={comuns.colunaMetade}>
            <Campo
              rotulo="Hora"
              value={hora}
              onChangeText={(texto) => setHora(mascaraHora(texto))}
              placeholder="HH:MM"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
        </View>
        <Opcoes
          rotulo="Categoria"
          opcoes={[
            { valor: 'academico', nome: 'Acadêmico' },
            { valor: 'tera', nome: 'Evento TERA' },
          ]}
          escolhida={categoria}
          aoEscolher={setCategoria}
        />

        {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}
        {mensagem !== '' && <Text style={comuns.mensagemSucesso}>{mensagem}</Text>}

        <Botao texto="Adicionar data" aoTocar={cadastrar} />
      </View>

      <Text style={comuns.tituloSecao}>Datas cadastradas ({compromissos.length})</Text>
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
