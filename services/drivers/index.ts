import AsyncStorage from "@react-native-async-storage/async-storage";
import { IDriverResponse } from "./types";

import api from "@/services/api";

export async function getDrivers({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<IDriverResponse> {
  let token;

  await AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const pageQuery = page ? "page=" + (page - 1) : "";
  const limitQuery = limit ? "limit=" + limit : "";

  const response = await fetch(`${api}/drivers?${pageQuery}&${limitQuery}`, {
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
