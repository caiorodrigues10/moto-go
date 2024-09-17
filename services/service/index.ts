import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "@/services/api";
import { ITypeServiceResponse } from "./types";

export async function getTypeServices(): Promise<ITypeServiceResponse> {
  let token;

  await AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/serviceTypes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}
