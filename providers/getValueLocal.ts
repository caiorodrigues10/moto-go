import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getValueLocal(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null;
  } catch (error) {
    console.error(`Erro ao obter o valor da chave "${key}":`, error);
    return null;
  }
}
