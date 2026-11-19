import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { CORES } from '../constants/cores';

interface Props extends TextInputProps {
  rotulo: string;
}

function Campo({ rotulo, multiline, ...resto }: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        multiline={multiline}
        placeholderTextColor={CORES.cinza}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        style={[estilos.caixa, multiline && estilos.caixaGrande, focado && estilos.caixaFocada]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '600', color: CORES.texto },
  caixa: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: CORES.cinzaClaro,
    borderRadius: 12,
    backgroundColor: CORES.branco,
    color: CORES.texto,
  },
  caixaGrande: { minHeight: 90, textAlignVertical: 'top' },
  caixaFocada: { borderColor: CORES.roxo },
});

export default Campo;
