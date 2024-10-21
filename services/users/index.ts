import { getValueLocal } from "@/providers/getValueLocal";
import { AppResponse } from "@/services/AppResponse";
import api from "@/services/api";
import {
  IChangeUserPassword,
  ICreateUser,
  ICreateUserAddress,
  ICreateUserResponse,
  IResponseUserAddress,
  IUpdateUser,
  IUpdateUserResponse,
  IUserByIdResponse,
  IValidatePin,
  IValidatePinResponse,
} from "./types";

export async function updateUser(
  data: IUpdateUser,
  id: number
): Promise<IUpdateUserResponse> {
  const token = await getValueLocal("token");

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
  const response = await fetch(`${api}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function recoveryPassword(data: {
  email: string;
}): Promise<AppResponse> {
  const token = await getValueLocal("token");

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

  return response;
}

export async function driverValidatePin(
  data: IValidatePin
): Promise<IValidatePinResponse> {
  const response = (await fetch(`${api}/drivers/validateDriver`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response)) as IValidatePinResponse;

  return response;
}

export async function createUserAddress(
  data: ICreateUserAddress
): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/userAddress`, {
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

export async function updateUserAddress(
  data: ICreateUserAddress,
  id: number
): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/userAddress/${id}`, {
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

export async function getUserAddress({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<IResponseUserAddress> {
  const token = await getValueLocal("token");

  const pageQuery = page ? "page=" + (page - 1) : "";
  const limitQuery = limit ? "limit=" + limit : "";

  const response = await fetch(
    `${api}/userAddress?${pageQuery}&${limitQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function deleteUserAddress({
  id,
}: {
  id: number;
}): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/userAddress/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function getUserById(id: number): Promise<IUserByIdResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/users/${id}`, {
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

export async function updateFCMTokenUser(data: {
  fcmToken: string;
}): Promise<AppResponse> {
  const token = await getValueLocal("token");

  console.log(data.fcmToken, "testeee");

  const response = await fetch(`${api}/users/fcmToken`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  console.log(response);

  return response;
}
