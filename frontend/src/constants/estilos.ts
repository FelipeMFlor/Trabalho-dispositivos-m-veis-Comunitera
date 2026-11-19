import { StyleSheet } from 'react-native';
import { CORES, RAIO } from './cores';

export const estilos = StyleSheet.create({
  tituloTela: {
    color: CORES.roxo,
    fontSize: 26,
    fontWeight: '700',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.texto,
    marginTop: 10,
  },

  textoRoxo: { color: CORES.roxo, fontSize: 14 },
  textoDourado: { color: CORES.dourado, fontWeight: '600' },
  textoCinza: { color: CORES.cinza, fontSize: 14 },
  textoNegrito: { fontWeight: '700', fontSize: 15, color: CORES.texto },
  centralizado: { textAlign: 'center', marginTop: 30 },

  linhaEntre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  cartao: {
    backgroundColor: CORES.branco,
    borderRadius: RAIO,
    padding: 16,
    shadowColor: CORES.roxo,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  cartaoComBarra: {
    gap: 4,
    borderLeftWidth: 6,
    borderLeftColor: CORES.dourado,
  },

  mensagemErro: { color: CORES.vermelho, fontSize: 14, fontWeight: '600' },
  mensagemSucesso: { color: CORES.verde, fontWeight: '700' },

  formulario: { gap: 14 },
  tituloFormulario: { color: CORES.roxo, fontSize: 17, fontWeight: '700' },

  gradeDois: { flexDirection: 'row', gap: 12 },
  colunaMetade: { flex: 1 },
});
