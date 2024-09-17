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
    .then((res) => res)
    .catch((err) => err.response);

  const user = await response.json();

  return user;
}
