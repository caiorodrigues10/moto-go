import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IDriverByIdResponse,
  IDriverResponse,
  IUpdateDriver,
  IValidateCodeDriverResponse,
} from "./types";

import api from "@/services/api";
import { AppResponse } from "../AppResponse";
import { IValidatePin } from "../users/types";

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

export async function updateDriver(data: IUpdateDriver): Promise<AppResponse> {
  let token;

  await AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/drivers/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function validateCodeDriver(
  data: IValidatePin
): Promise<IValidateCodeDriverResponse> {
  let token;

  await AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/drivers/validateDriver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function getDriverById(id: string): Promise<IDriverByIdResponse> {
  let token;

  await AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/drivers/${id}`, {
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
