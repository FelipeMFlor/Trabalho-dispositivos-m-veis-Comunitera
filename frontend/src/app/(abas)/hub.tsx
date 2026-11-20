import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDados } from '../../contexto/DadosContexto';
import { EMAIL_OUVIDORIA, LINK_INSTAGRAM, LINK_WHATSAPP } from '../../links';
import { abrirLink } from '../../utils/mensagens';
import { CORES, RAIO } from '../../constants/cores';
import { estilos as comuns } from '../../constants/estilos';
import Tela from '../../components/Tela';
import Botao from '../../components/Botao';

type NomeDoIcone = keyof typeof Ionicons.glyphMap;

function Atalho({ icone, texto, link }: { icone: NomeDoIcone; texto: string; link: string }) {
  return (
    <Pressable
      style={({ pressed }) => [comuns.cartao, estilos.atalho, pressed && { opacity: 0.7 }]}
      onPress={() => abrirLink(link)}
    >
      <Ionicons name={icone} size={22} color={CORES.roxo} />
      <Text style={[comuns.textoNegrito, { flex: 1 }]}>{texto}</Text>
      <Ionicons name="arrow-forward" size={20} color={CORES.texto} />
    </Pressable>
  );
}

export default function HubTera() {
  const { usuario, sair } = useDados();

  if (usuario === null) {
    return null;
  }

  return (
    <Tela>
      <View style={estilos.carteirinha}>
        <Text style={estilos.carteirinhaTitulo}>CARTEIRINHA DIGITAL</Text>
        <Text style={estilos.carteirinhaSubtitulo}>DIRETÓRIO ACADÊMICO TERA</Text>

        <View style={estilos.carteirinhaLinha}>
          <View style={estilos.foto}>
            <Ionicons name="person" size={30} color={CORES.roxo} />
          </View>
          <View style={estilos.dados}>
            <Text style={estilos.nome}>{usuario.nome}</Text>
            <Text style={estilos.dadoTexto}>{usuario.curso}</Text>
            <Text style={[estilos.dadoTexto, comuns.textoDourado]}>RGM: {usuario.ra}</Text>
          </View>
          <View style={estilos.qr}>
            <Ionicons name="qr-code" size={30} color={CORES.escuro} />
          </View>
        </View>
      </View>

      <Text style={comuns.tituloSecao}>Central do D.A.</Text>

      <Atalho icone="logo-whatsapp" texto="Comunidade no WhatsApp" link={LINK_WHATSAPP} />
      <Atalho icone="logo-instagram" texto="Instagram @tera.fsg" link={LINK_INSTAGRAM} />
      <Atalho icone="mail" texto={'Fale com a gente!!\nOuvidoria TERA.'} link={'mailto:' + EMAIL_OUVIDORIA} />

      <Botao texto="Sair da conta" tipo="sair" aoTocar={sair} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  carteirinha: {
    backgroundColor: CORES.roxo,
    borderRadius: RAIO,
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: 4,
  },
  carteirinhaTitulo: { color: CORES.dourado, fontWeight: '700', fontSize: 16 },
  carteirinhaSubtitulo: { fontSize: 12, color: CORES.roxoClaro },
  carteirinhaLinha: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 },
  foto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.dourado,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dados: { flex: 1, gap: 2 },
  nome: { color: CORES.branco, fontSize: 18, fontWeight: '700' },
  dadoTexto: { color: CORES.branco, fontSize: 13 },
  qr: {
    width: 52,
    height: 52,
    backgroundColor: CORES.branco,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atalho: { flexDirection: 'row', alignItems: 'center', gap: 14 },
});
