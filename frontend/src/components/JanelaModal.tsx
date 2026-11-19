import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CORES } from '../constants/cores';

interface Props {
  titulo: string;
  aberta: boolean;
  aoFechar: () => void;
  children: ReactNode;
}

function JanelaModal({ titulo, aberta, aoFechar, children }: Props) {
  const margens = useSafeAreaInsets();

  return (
    <Modal
      visible={aberta}
      transparent
      animationType="slide"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView style={estilos.fundo} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={aoFechar} />

        <View style={[estilos.caixa, { paddingBottom: 30 + margens.bottom }]}>
          <View style={estilos.topo}>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Pressable style={estilos.fechar} onPress={aoFechar} accessibilityLabel="Fechar">
              <Ionicons name="close" size={18} color={CORES.texto} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  caixa: {
    backgroundColor: CORES.branco,
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 22,
    paddingHorizontal: 20,
    gap: 10,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  titulo: { flex: 1, color: CORES.roxo, fontSize: 19, fontWeight: '700' },
  fechar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: CORES.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: { gap: 10 },
});

export default JanelaModal;
