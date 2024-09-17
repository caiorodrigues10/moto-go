import { AppResponse } from "@/services/AppResponse";

interface ITypeService {
  id: number;
  description: string;
  active: boolean;
}

interface ITypeServiceResponse extends AppResponse {
  data?: ITypeService[];
}

export type { ITypeService, ITypeServiceResponse };
