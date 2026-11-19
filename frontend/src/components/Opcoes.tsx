import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CORES } from '../constants/cores';

interface Props<T> {
  opcoes: { valor: T; nome: string }[];
  escolhida: T;
  aoEscolher: (valor: T) => void;
  rotulo?: string;
  rolavel?: boolean;
}

function Opcoes<T extends string | number>({ opcoes, escolhida, aoEscolher, rotulo, rolavel = false }: Props<T>) {
  const botoes = opcoes.map((opcao) => {
    const ativa = opcao.valor === escolhida;
    return (
      <Pressable
        key={String(opcao.valor)}
        onPress={() => aoEscolher(opcao.valor)}
        style={[estilos.opcao, !rolavel && estilos.opcaoEsticada, ativa && estilos.opcaoAtiva]}
      >
        <Text style={[estilos.texto, ativa && estilos.textoAtivo]}>{opcao.nome}</Text>
      </Pressable>
    );
  });

  return (
    <View style={estilos.campo}>
      {rotulo && <Text style={estilos.rotulo}>{rotulo}</Text>}
      {rolavel ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.linha}>
          {botoes}
        </ScrollView>
      ) : (
        <View style={[estilos.linha, estilos.quebraLinha]}>{botoes}</View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '600', color: CORES.texto },
  linha: { flexDirection: 'row', gap: 8 },
  quebraLinha: { flexWrap: 'wrap' },
  opcao: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: CORES.branco,
    borderWidth: 1,
    borderColor: CORES.cinzaClaro,
    alignItems: 'center',
  },
  opcaoEsticada: { flexGrow: 1 },
  opcaoAtiva: { backgroundColor: CORES.roxo, borderColor: CORES.roxo },
  texto: { fontSize: 14, fontWeight: '500', color: CORES.texto },
  textoAtivo: { color: CORES.branco },
});

export default Opcoes;
