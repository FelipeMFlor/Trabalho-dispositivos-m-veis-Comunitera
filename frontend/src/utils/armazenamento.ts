import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvar<T>(chave: string, valor: T): Promise<void> {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch {}
}

export async function carregar<T>(chave: string, valorPadrao: T): Promise<T> {
  try {
    const texto = await AsyncStorage.getItem(chave);
    if (texto === null) {
      return valorPadrao;
    }
    return JSON.parse(texto) as T;
  } catch {
    return valorPadrao;
  }
}

export async function remover(chave: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(chave);
  } catch {}
}
