import api from "@/services/api";
import { IServiceTypeResponse } from "./types";
import { getValueLocal } from "@/providers/getValueLocal";

export async function getServicesType(): Promise<IServiceTypeResponse> {
  const token = await getValueLocal("token");

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
