import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Vaga } from '../../types';
import { useDados } from '../../contexto/DadosContexto';
import { CORES } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import Botao from '../../components/Botao';
import JanelaModal from '../../components/JanelaModal';

export default function Vagas() {
  const { vagas, candidaturas, candidatar } = useDados();

  const [vagaAberta, setVagaAberta] = useState<Vaga | null>(null);

  return (
    <Tela>
      <Text style={comuns.tituloTela}>Mural de vagas!</Text>

      {vagas.length === 0 && <Text style={[comuns.textoCinza, comuns.centralizado]}>Nenhuma vaga cadastrada ainda...</Text>}

      {vagas.map((vaga, indice) => (
        <View style={[comuns.cartao, estilos.vaga]} key={vaga.id}>
          <View style={estilos.linha}>
            <View style={[estilos.icone, indice % 2 === 1 && { backgroundColor: CORES.escuro }]}>
              <Text style={{ fontSize: 22 }}>{vaga.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.titulo}>{vaga.titulo}</Text>
              <Text style={comuns.textoRoxo}>
                {vaga.empresa} • {vaga.modalidade}
              </Text>
            </View>
          </View>
          <View style={comuns.linhaEntre}>
            <View style={estilos.chip}>
              <Text style={estilos.chipTexto}>{vaga.cargaHoraria}</Text>
            </View>
            <Botao
              texto={candidaturas.includes(vaga.id) ? '✓ Candidatado' : 'ver vaga'}
              pequeno
              aoTocar={() => setVagaAberta(vaga)}
            />
          </View>
        </View>
      ))}

      <JanelaModal titulo={vagaAberta?.titulo ?? ''} aberta={vagaAberta !== null} aoFechar={() => setVagaAberta(null)}>
        {vagaAberta !== null && (
          <>
            <Text style={comuns.textoRoxo}>
              {vagaAberta.empresa} • {vagaAberta.modalidade} • {vagaAberta.cargaHoraria}
            </Text>
            <Text style={{ color: CORES.texto, fontSize: 15 }}>{vagaAberta.descricao}</Text>
            <Text style={comuns.textoNegrito}>Requisitos:</Text>
            <View style={estilos.requisitos}>
              {vagaAberta.requisitos.map((requisito) => (
                <Text key={requisito} style={comuns.textoCinza}>
                  •  {requisito}
                </Text>
              ))}
            </View>

            {candidaturas.includes(vagaAberta.id) ? (
              <Text style={comuns.mensagemSucesso}>✓ Você já se candidatou a esta vaga!</Text>
            ) : (
              <Botao texto="Quero me candidatar!" aoTocar={() => candidatar(vagaAberta.id)} />
            )}
          </>
        )}
      </JanelaModal>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  vaga: { gap: 14 },
  linha: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  icone: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: CORES.roxo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 17, fontWeight: '700', color: CORES.texto },
  chip: { backgroundColor: CORES.fundo, borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 },
  chipTexto: { fontSize: 12, color: CORES.cinza },
  requisitos: { gap: 4, marginBottom: 10, paddingLeft: 6 },
});
