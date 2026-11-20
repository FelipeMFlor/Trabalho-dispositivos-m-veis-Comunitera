import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { confirmar } from '../utils/mensagens';
import { CORES } from '../constants/cores';
import { estilos as comuns } from '../constants/estilos';

interface Props {
  titulo: string;
  detalhe: string;
  aoApagar: () => void;
}

function ItemAdmin({ titulo, detalhe, aoApagar }: Props) {
  async function confirmarApagar() {
    if (await confirmar('Apagar "' + titulo + '"?', 'Isso não pode ser desfeito.')) {
      aoApagar();
    }
  }

  return (
    <View style={[comuns.cartao, estilos.item]}>
      <View style={estilos.textos}>
        <Text style={comuns.textoNegrito}>{titulo}</Text>
        <Text style={[comuns.textoCinza, { fontSize: 12 }]}>{detalhe}</Text>
      </View>
      <Pressable onPress={confirmarApagar} accessibilityLabel={'Apagar ' + titulo} hitSlop={8}>
        <Ionicons name="trash-outline" size={20} color={CORES.vermelho} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  textos: { flex: 1, gap: 2 },
});

export default ItemAdmin;
