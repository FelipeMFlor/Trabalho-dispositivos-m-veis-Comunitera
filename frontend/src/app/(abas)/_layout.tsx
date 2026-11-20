import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CORES } from '../../constants/cores';
import { useDados } from '../../contexto/DadosContexto';

type NomeDoIcone = keyof typeof FontAwesome6.glyphMap;

function iconeDaAba(nome: NomeDoIcone) {
  return function Icone({ focused }: { focused: boolean }) {
    return (
      <View style={[estilos.circulo, focused && estilos.circuloAtivo]}>
        <FontAwesome6 name={nome} solid size={20} color={focused ? '#44245F' : '#FFFFFF'} />
      </View>
    );
  };
}

export default function LayoutDasAbas() {
  const { ehAdmin } = useDados();
  const margens = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [estilos.barra, { bottom: 16 + margens.bottom }],
        tabBarItemStyle: estilos.item,
        tabBarIconStyle: estilos.icone,
        sceneStyle: { backgroundColor: CORES.fundo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Página inicial', tabBarIcon: iconeDaAba('house') }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendário', tabBarIcon: iconeDaAba('calendar-days') }} />
      <Tabs.Screen name="eventos" options={{ title: 'Eventos', tabBarIcon: iconeDaAba('ticket') }} />
      <Tabs.Screen name="vagas" options={{ title: 'Vagas', tabBarIcon: iconeDaAba('briefcase') }} />
      <Tabs.Screen name="hub" options={{ title: 'Hub TERA', tabBarIcon: iconeDaAba('user') }} />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Painel do D.A.',
          tabBarIcon: iconeDaAba('gear'),
          href: ehAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}

const estilos = StyleSheet.create({
  barra: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.roxo,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingHorizontal: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  item: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  icone: { width: 48, height: 48 },
  circulo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloAtivo: { backgroundColor: '#F4C95D' },
});
