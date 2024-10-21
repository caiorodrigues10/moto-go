import api from "@/services/api";
import { ILogin, ILoginResponse } from "./types";

export async function login(data: ILogin): Promise<ILoginResponse> {
  const response = await fetch(`${api}/users/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function driverLogin(data: ILogin): Promise<ILoginResponse> {
  const response = await fetch(`${api}/drivers/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}
