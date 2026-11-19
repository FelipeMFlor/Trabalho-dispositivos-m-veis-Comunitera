import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CORES } from '../constants/cores';
import { ProvedorDeDados, useDados } from '../contexto/DadosContexto';

export default function LayoutRaiz() {
  return (
    <SafeAreaProvider>
      <ProvedorDeDados>
        <StatusBar style="dark" />
        <Navegacao />
      </ProvedorDeDados>
    </SafeAreaProvider>
  );
}

function Navegacao() {
  const { usuario, verificando } = useDados();

  if (verificando) {
    return (
      <View style={estilos.carregando}>
        <ActivityIndicator size="large" color={CORES.roxo} />
      </View>
    );
  }

  const logado = usuario !== null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: CORES.fundo } }}>
      <Stack.Protected guard={logado}>
        <Stack.Screen name="(abas)" />
      </Stack.Protected>
      <Stack.Protected guard={!logado}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

const estilos = StyleSheet.create({
  carregando: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CORES.fundo,
  },
});
