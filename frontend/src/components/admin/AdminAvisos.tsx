import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Aviso } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { mostrarMensagem } from '../../utils/mensagens';
import { estilos as comuns } from '../../constants/estilos';
import Campo from '../Campo';
import Botao from '../Botao';
import ItemAdmin from '../ItemAdmin';

interface Props {
  avisos: Aviso[];
  aoAtualizar: () => void;
}

function AdminAvisos({ avisos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  async function publicar() {
    setMensagem('');
    setErro('');
    try {
      await apiPost('/avisos', { titulo, texto });
      setTitulo('');
      setTexto('');
      setMensagem('Aviso publicado! Ele aparece no sininho da Página inicial.');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/avisos/' + id);
      aoAtualizar();
    } catch (e) {
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  return (
    <>
      <View style={[comuns.cartao, comuns.formulario]}>
        <Text style={comuns.tituloFormulario}>Novo aviso</Text>
        <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex: Reunião do D.A." />
        <Campo rotulo="Texto" value={texto} onChangeText={setTexto} multiline />

        {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}
        {mensagem !== '' && <Text style={comuns.mensagemSucesso}>{mensagem}</Text>}

        <Botao texto="Publicar aviso" aoTocar={publicar} />
      </View>

      <Text style={comuns.tituloSecao}>Avisos publicados ({avisos.length})</Text>
      {avisos.map((aviso) => (
        <ItemAdmin key={aviso.id} titulo={aviso.titulo} detalhe={aviso.texto} aoApagar={() => apagar(aviso.id)} />
      ))}
    </>
  );
}

export default AdminAvisos;
