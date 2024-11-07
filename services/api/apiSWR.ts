import { getValueLocal } from "@/providers/getValueLocal";

export const fetcher = async (url: string) => {
  const token = await getValueLocal("token");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return response;
};
