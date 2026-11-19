import type { ReactNode } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES } from '../constants/cores';
import { useDados } from '../contexto/DadosContexto';

interface Props {
  children: ReactNode;
  flutuante?: ReactNode;
}

function Tela({ children, flutuante }: Props) {
  const { erro, atualizando, recarregar } = useDados();

  return (
    <SafeAreaView style={estilos.area} edges={['top']}>
      {erro !== '' && (
        <View style={estilos.faixaErro}>
          <Text style={estilos.faixaErroTexto}>{erro}</Text>
          <Pressable onPress={recarregar}>
            <Text style={estilos.faixaErroBotao}>Tentar de novo</Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        contentContainerStyle={estilos.conteudo}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={recarregar} colors={[CORES.roxo]} tintColor={CORES.roxo} />
        }
      >
        {children}
      </ScrollView>

      {flutuante}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: CORES.fundo },
  conteudo: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 14,
  },
  faixaErro: {
    backgroundColor: CORES.vermelhoClaro,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  faixaErroTexto: { flex: 1, color: CORES.vermelho, fontSize: 14, fontWeight: '600' },
  faixaErroBotao: { color: CORES.vermelho, fontWeight: '700', textDecorationLine: 'underline' },
});

export default Tela;
