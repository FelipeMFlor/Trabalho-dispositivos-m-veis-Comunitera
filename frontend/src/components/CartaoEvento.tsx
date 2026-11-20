import { StyleSheet, Text, View } from 'react-native';
import type { Evento } from '../types';
import { formatarSelo } from '../utils/datas';
import { CORES } from '../constants/cores';
import { estilos as comuns } from '../constants/estilos';
import Botao from './Botao';

interface Props {
  evento: Evento;
  inscrito: boolean;
  aoTocarInscricao: (idDoEvento: number) => void;
}

function CartaoEvento({ evento, inscrito, aoTocarInscricao }: Props) {
  return (
    <View style={[comuns.cartao, estilos.cartao]}>
      <View style={[estilos.topo, { backgroundColor: evento.corDoTopo === 'escuro' ? CORES.escuro : CORES.roxo }]}>
        <Text style={estilos.emoji}>{evento.emoji}</Text>
        <View style={estilos.selo}>
          <Text style={estilos.seloTexto}>{formatarSelo(evento.data)}</Text>
        </View>
      </View>

      <View style={estilos.corpo}>
        <Text style={estilos.titulo}>{evento.titulo}</Text>
        <Text style={comuns.textoRoxo}>
          {evento.local} • {evento.hora}h
        </Text>

        <View style={{ marginTop: 8 }}>
          <Botao
            texto={inscrito ? '✓ Inscrito — cancelar' : 'Garantir minha vaga!'}
            tipo={inscrito ? 'contorno' : 'dourado'}
            aoTocar={() => aoTocarInscricao(evento.id)}
          />
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { padding: 0, overflow: 'hidden' },
  topo: { height: 110, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 38 },
  selo: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: CORES.dourado,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  seloTexto: { fontSize: 12, fontWeight: '700', color: CORES.texto },
  corpo: { padding: 16, gap: 6 },
  titulo: { fontSize: 18, fontWeight: '700', color: CORES.texto },
});

export default CartaoEvento;
