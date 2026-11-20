import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import type { Evento } from '../../types';
import { apiDelete, apiPost } from '../../api';
import { formatarDiaMes } from '../../utils/datas';
import { dataParaServidor, horaValida, mascaraData, mascaraHora } from '../../utils/mascaras';
import { mostrarMensagem } from '../../utils/mensagens';
import { CORES } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Campo from '../Campo';
import Opcoes from '../Opcoes';
import Botao from '../Botao';
import ItemAdmin from '../ItemAdmin';

interface Props {
  eventos: Evento[];
  aoAtualizar: () => void;
}

function AdminEventos({ eventos, aoAtualizar }: Props) {
  const [titulo, setTitulo] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [emoji, setEmoji] = useState('🎉');
  const [corDoTopo, setCorDoTopo] = useState<'roxo' | 'escuro'>('roxo');
  const [destaque, setDestaque] = useState(false);
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
      await apiPost('/eventos', { titulo, local, data: dataCerta, hora, emoji, corDoTopo, destaque });
      setTitulo('');
      setLocal('');
      setData('');
      setHora('');
      setEmoji('🎉');
      setCorDoTopo('roxo');
      setDestaque(false);
      setMensagem('Evento cadastrado! Os alunos já podem ver.');
      aoAtualizar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function apagar(id: number) {
    try {
      await apiDelete('/eventos/' + id);
      aoAtualizar();
    } catch (e) {
      mostrarMensagem('Ops!', (e as Error).message);
    }
  }

  return (
    <>
      <View style={[comuns.cartao, comuns.formulario]}>
        <Text style={comuns.tituloFormulario}>Novo evento</Text>
        <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Ex: Festa de Fim de Ano" />
        <Campo rotulo="Local" value={local} onChangeText={setLocal} placeholder="Ex: Bar Janela" />
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
        <Campo rotulo="Emoji" value={emoji} onChangeText={setEmoji} maxLength={4} />
        <Opcoes
          rotulo="Cor do card"
          opcoes={[
            { valor: 'roxo', nome: 'Roxo' },
            { valor: 'escuro', nome: 'Escuro' },
          ]}
          escolhida={corDoTopo}
          aoEscolher={setCorDoTopo}
        />

        <View style={estilos.linhaSwitch}>
          <Switch
            value={destaque}
            onValueChange={setDestaque}
            trackColor={{ true: CORES.roxo, false: CORES.cinzaClaro }}
            thumbColor={CORES.branco}
          />
          <Text style={{ flex: 1, color: CORES.texto }}>Mostrar como destaque na Página inicial</Text>
        </View>

        {erro !== '' && <Text style={comuns.mensagemErro}>{erro}</Text>}
        {mensagem !== '' && <Text style={comuns.mensagemSucesso}>{mensagem}</Text>}

        <Botao texto="Cadastrar evento" aoTocar={cadastrar} />
      </View>

      <Text style={comuns.tituloSecao}>Eventos cadastrados ({eventos.length})</Text>
      {eventos.map((ev) => (
        <ItemAdmin
          key={ev.id}
          titulo={ev.emoji + ' ' + ev.titulo + (ev.destaque ? ' ⭐' : '')}
          detalhe={formatarDiaMes(ev.data) + ' às ' + ev.hora + ' • ' + ev.local + ' • ' + ev.inscritos + ' inscrito(s)'}
          aoApagar={() => apagar(ev.id)}
        />
      ))}
    </>
  );
}

const estilos = StyleSheet.create({
  linhaSwitch: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});

export default AdminEventos;
