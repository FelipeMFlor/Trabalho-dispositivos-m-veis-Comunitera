import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDados } from '../../contexto/DadosContexto';
import { LINK_INSTAGRAM, LINK_WHATSAPP } from '../../links';
import { formatarDiaMes } from '../../utils/datas';
import { abrirLink } from '../../utils/mensagens';
import { CORES, RAIO } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import Botao from '../../components/Botao';
import JanelaModal from '../../components/JanelaModal';

export default function Inicio() {
  const { usuario, eventos, aulas, avisos } = useDados();

  const [avisosAbertos, setAvisosAbertos] = useState(false);

  const primeiroNome = usuario?.nome.split(' ')[0] ?? '';

  const eventoDestaque = eventos.find((evento) => evento.destaque);

  const diaDeHoje = new Date().getDay();
  const aulasDeHoje = aulas.filter((aula) => aula.diaDaSemana === diaDeHoje);

  return (
    <Tela>
      <View style={estilos.cabecalho}>
        <View style={estilos.avatar}>
          <Text style={{ fontSize: 22 }}>🐸</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={estilos.ola}>Olá, {primeiroNome}!</Text>
          <Text style={estilos.bemVindo}>Bem-vindo ao COMUNITERA! (:</Text>
        </View>
        <Pressable style={estilos.sino} onPress={() => setAvisosAbertos(true)} accessibilityLabel="Avisos">
          <Ionicons name="notifications" size={20} color={CORES.roxo} />
          {avisos.length > 0 && (
            <View style={estilos.bolinhaAviso}>
              <Text style={estilos.bolinhaAvisoTexto}>{avisos.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {eventoDestaque && (
        <View style={estilos.destaque}>
          <Text style={estilos.destaqueEtiqueta}>EVENTO EM DESTAQUE</Text>
          <Text style={estilos.destaqueTitulo}>{eventoDestaque.titulo}</Text>
          <Text style={estilos.destaqueTexto}>
            {eventoDestaque.local} • {formatarDiaMes(eventoDestaque.data)} às {eventoDestaque.hora}
          </Text>
          <Botao texto="Ver Detalhes" pequeno aoTocar={() => router.navigate('/eventos')} />
        </View>
      )}

      <Text style={comuns.tituloSecao}>Resumo de hoje</Text>
      {aulasDeHoje.length === 0 ? (
        <View style={[comuns.cartao, comuns.cartaoComBarra]}>
          <Text style={comuns.textoCinza}>Sem aulas hoje!</Text>
        </View>
      ) : (
        aulasDeHoje.map((aula) => (
          <View style={[comuns.cartao, comuns.cartaoComBarra]} key={aula.id}>
            <Text style={comuns.textoNegrito}>{aula.materia}</Text>
            <Text style={comuns.textoRoxo}>
              {aula.horario} • {aula.sala}
            </Text>
            <Text style={[comuns.textoCinza, { fontSize: 12 }]}>{aula.professor}</Text>
          </View>
        ))
      )}

      <Text style={comuns.tituloSecao}>Canais da comunidade</Text>
      <View style={comuns.gradeDois}>
        <Pressable style={[comuns.cartao, estilos.canal]} onPress={() => abrirLink(LINK_WHATSAPP)}>
          <Ionicons name="logo-whatsapp" size={24} color={CORES.verde} />
          <View>
            <Text style={comuns.textoNegrito}>WhatsApp</Text>
            <Text style={[comuns.textoRoxo, { fontSize: 12 }]}>Comunidade</Text>
          </View>
        </Pressable>
        <Pressable style={[comuns.cartao, estilos.canal]} onPress={() => abrirLink(LINK_INSTAGRAM)}>
          <Ionicons name="logo-instagram" size={24} color={CORES.roxo} />
          <View>
            <Text style={comuns.textoNegrito}>Instagram</Text>
            <Text style={[comuns.textoRoxo, { fontSize: 12 }]}>@tera.fsg</Text>
          </View>
        </Pressable>
      </View>

      <JanelaModal titulo="Avisos do D.A." aberta={avisosAbertos} aoFechar={() => setAvisosAbertos(false)}>
        {avisos.length === 0 && <Text style={comuns.textoCinza}>Nenhum aviso por enquanto...</Text>}
        {avisos.map((aviso) => (
          <View style={estilos.aviso} key={aviso.id}>
            <Text style={comuns.textoNegrito}>{aviso.titulo}</Text>
            <Text style={[comuns.textoCinza, { marginTop: 4 }]}>{aviso.texto}</Text>
          </View>
        ))}
      </JanelaModal>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: CORES.roxo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ola: { fontSize: 15, color: CORES.texto },
  bemVindo: { color: CORES.roxo, fontSize: 17, fontWeight: '700' },
  sino: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CORES.branco,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: CORES.roxo,
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bolinhaAviso: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: CORES.dourado,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bolinhaAvisoTexto: { fontSize: 11, fontWeight: '700', color: CORES.texto },

  destaque: {
    backgroundColor: CORES.roxo,
    borderRadius: RAIO,
    padding: 20,
    alignItems: 'flex-start',
    gap: 6,
  },
  destaqueEtiqueta: { color: CORES.dourado, fontSize: 13, fontWeight: '600' },
  destaqueTitulo: { color: CORES.branco, fontSize: 22, fontWeight: '700' },
  destaqueTexto: { color: CORES.roxoClaro, fontSize: 14, marginBottom: 8 },

  canal: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  aviso: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: CORES.cinzaClaro },
});
