import { Pressable, StyleSheet, Text } from 'react-native';
import { CORES } from '../constants/cores';

interface Props {
  texto: string;
  aoTocar: () => void;
  tipo?: 'dourado' | 'contorno' | 'sair';
  pequeno?: boolean;
  desativado?: boolean;
}

function Botao({ texto, aoTocar, tipo = 'dourado', pequeno = false, desativado = false }: Props) {
  return (
    <Pressable
      onPress={aoTocar}
      disabled={desativado}
      style={({ pressed }) => [
        estilos.botao,
        estilos[tipo],
        pequeno && estilos.pequeno,
        pressed && estilos.pressionado,
        desativado && estilos.desativado,
      ]}
    >
      <Text style={[estilos.texto, tipo === 'contorno' && estilos.textoRoxo, tipo === 'sair' && estilos.textoVermelho]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dourado: { backgroundColor: CORES.dourado },
  contorno: { borderWidth: 2, borderColor: CORES.roxo },
  sair: { borderWidth: 2, borderColor: CORES.vermelho, marginTop: 10 },
  pequeno: { alignSelf: 'flex-start', paddingVertical: 9 },
  pressionado: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  desativado: { opacity: 0.6 },
  texto: { fontWeight: '700', fontSize: 15, color: CORES.texto },
  textoRoxo: { color: CORES.roxo },
  textoVermelho: { color: CORES.vermelho },
});

export default Botao;
