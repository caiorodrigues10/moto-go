import { IUserLogin } from "@/services/auth/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setUserLocal({
  user,
  token,
  typeUser,
}: {
  user: IUserLogin;
  token: string;
  typeUser: "driver" | "user";
}) {
  try {
    await AsyncStorage.multiSet([
      ["id", String(user.id)],
      ["name", String(user.name)],
      ["telephone", user.telephone],
      ["token", token],
      ["typeUser", typeUser],
    ]);
  } catch (e: any) {
    console.error("Error to save data in AsyncStorage", e);
    return { error: true, message: e.message || "Error" };
  }
}

export async function setValueLocal({
  key,
  value,
}: {
  key: string;
  value: string;
}) {
  try {
    await AsyncStorage.setItem(key, value);
    return { success: true };
  } catch (error) {
    console.error("Error saving data to AsyncStorage:", error);
    return { error: true, message: error || "Error saving data" };
  }
}
