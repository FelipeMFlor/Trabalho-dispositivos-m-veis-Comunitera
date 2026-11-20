import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDados } from '../../contexto/DadosContexto';
import { dataDeHoje } from '../../utils/datas';
import { CORES } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import CartaoEvento from '../../components/CartaoEvento';

type Aba = 'proximos' | 'inscricoes';

export default function Eventos() {
  const { eventos, inscricoes, alternarInscricao } = useDados();
  const [aba, setAba] = useState<Aba>('proximos');

  const hoje = dataDeHoje();
  const eventosVisiveis =
    aba === 'proximos'
      ? eventos.filter((evento) => evento.data >= hoje)
      : eventos.filter((evento) => inscricoes.includes(evento.id));

  function botaoDaAba(id: Aba, texto: string) {
    const ativa = aba === id;
    return (
      <Pressable onPress={() => setAba(id)} style={[estilos.aba, ativa && estilos.abaAtiva]}>
        <Text style={[estilos.abaTexto, ativa && estilos.abaTextoAtivo]}>{texto}</Text>
      </Pressable>
    );
  }

  return (
    <Tela>
      <Text style={comuns.tituloTela}>Eventos e inscrições</Text>

      <View style={estilos.abas}>
        {botaoDaAba('proximos', 'Próximos')}
        {botaoDaAba('inscricoes', 'Minhas inscrições (' + inscricoes.length + ')')}
      </View>

      {eventosVisiveis.length === 0 && (
        <Text style={[comuns.textoCinza, comuns.centralizado]}>
          {aba === 'proximos' ? 'Nenhum evento marcado por enquanto.' : 'Você ainda não se inscreveu em nenhum evento.'}
        </Text>
      )}

      {eventosVisiveis.map((evento) => (
        <CartaoEvento
          key={evento.id}
          evento={evento}
          inscrito={inscricoes.includes(evento.id)}
          aoTocarInscricao={alternarInscricao}
        />
      ))}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  abas: { flexDirection: 'row', gap: 22, borderBottomWidth: 1, borderBottomColor: CORES.cinzaClaro },
  aba: { paddingVertical: 8, borderBottomWidth: 3, borderBottomColor: 'transparent', marginBottom: -1 },
  abaAtiva: { borderBottomColor: CORES.dourado },
  abaTexto: { fontSize: 15, color: CORES.cinza },
  abaTextoAtivo: { color: CORES.roxo, fontWeight: '700' },
});
