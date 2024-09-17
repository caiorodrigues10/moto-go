import {
  IChangeUserPassword,
  ICreateUser,
  ICreateUserResponse,
  IUpdateUser,
  IUpdateUserResponse,
  IValidatePin,
  IValidatePinResponse,
} from "./types";
import api from "@/services/api";
import { AppResponse } from "@/services/AppResponse";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function updateUser(
  data: IUpdateUser,
  id: number
): Promise<IUpdateUserResponse> {
  let token;

  AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, id: undefined }),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function createUser(
  data: ICreateUser
): Promise<ICreateUserResponse> {
  // let token;
  // AsyncStorage.getItem("token").then((res) => {
  //   token = res;
  // });

  const response = await fetch(`${api}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function inactiveUser(id: number): Promise<AppResponse> {
  let token;

  AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function recoveryPassword(data: {
  email: string;
}): Promise<AppResponse> {
  let token;

  AsyncStorage.getItem("token").then((res) => {
    token = res;
  });

  const response = await fetch(`${api}/users/forgotPassword`, {
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

export async function changePassword(
  data: IChangeUserPassword,
  token: string
): Promise<AppResponse> {
  const response = await fetch(
    `${api}/users/forgotPassword/changePassword?token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}
export async function validatePin(
  data: IValidatePin
): Promise<IValidatePinResponse> {
  const response = (await fetch(`${api}/users/validate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response)) as IValidatePinResponse;

  try {
    await AsyncStorage.setItem("token", response?.data?.token || "");
  } catch (e: any) {
    return e.response;
  }

  return response;
}
