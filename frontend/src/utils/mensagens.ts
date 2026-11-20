import { Alert, Linking, Platform } from 'react-native';

export function abrirLink(link: string): void {
  Linking.openURL(link).catch(() => {
    mostrarMensagem('Ops!', 'Não foi possível abrir este link no seu aparelho.');
  });
}

export function mostrarMensagem(titulo: string, texto: string): void {
  if (Platform.OS === 'web') {
    window.alert(titulo + '\n\n' + texto);
    return;
  }
  Alert.alert(titulo, texto);
}

export function confirmar(titulo: string, texto: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(titulo + '\n\n' + texto));
  }

  return new Promise((resolver) => {
    Alert.alert(titulo, texto, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
      { text: 'Apagar', style: 'destructive', onPress: () => resolver(true) },
    ]);
  });
}
