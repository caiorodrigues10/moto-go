import api from "@/services/api";
import { fetcher } from "@/services/api/apiSWR";
import useSWR from "swr";

export function useApi<Data = any>(route: string) {
  const { data, error, isLoading, mutate } = useSWR<Data>(
    `${api}${route}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  };
}
