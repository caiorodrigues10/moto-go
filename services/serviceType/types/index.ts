import { AppResponse } from "@/services/AppResponse";

interface IServiceType {
  id: number;
  description: string;
  active: boolean;
}

interface IServiceTypeResponse extends AppResponse {
  data?: IServiceType[];
}

export type { IServiceType, IServiceTypeResponse };
