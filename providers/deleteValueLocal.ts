import AsyncStorage from "@react-native-async-storage/async-storage";

export async function deleteValueLocal(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error in key "${key}":`, error);
  }
}
