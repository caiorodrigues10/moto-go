import { getValueLocal } from "@/providers/getValueLocal";
import api from "@/services/api";
import { AppResponse } from "../AppResponse";
import {
  ICreateServiceOrders,
  IResponseListServiceOrders,
  IUpdateServiceOrder,
} from "./types";

export async function getServiceOrder({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}): Promise<IResponseListServiceOrders> {
  const token = await getValueLocal("token");

  const pageQuery = page ? "page=" + (page - 1) : "";
  const limitQuery = limit ? "limit=" + limit : "";

  const response = await fetch(
    `${api}/serviceOrders?${pageQuery}&${limitQuery}`,
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

export async function getServiceOrderByDriver(): Promise<IResponseListServiceOrders> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/serviceOrders/drivers`, {
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

export async function updateServiceOrder(
  data: IUpdateServiceOrder,
  id: number
): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/serviceOrders/${id}`, {
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

export async function createServiceOrder(
  data: ICreateServiceOrders
): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/serviceOrders`, {
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

export async function cancelServiceOrder(id: number): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/serviceOrders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}

export async function finishServiceOrder(id: number): Promise<AppResponse> {
  const token = await getValueLocal("token");

  const response = await fetch(`${api}/serviceOrders/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  return response;
}
