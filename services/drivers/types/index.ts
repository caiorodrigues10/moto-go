import { AppResponse } from "@/services/AppResponse";

interface IDriver {
  id: number;
  name: string;
  telephone: string;
  document: string;
  created_at: Date;
  active: boolean;
  fcm_token: string | null;
  profile_picture: string | null;
  created_by: number;
  lat: number;
  long: number;
}

interface IDriverResponse extends AppResponse {
  data?: {
    count: number;
    list: IDriver[];
  };
}

interface IDriverById extends AppResponse {
  data?: IDriver;
}

interface IUpdateDriver {
  name?: string;
  profilePicture?: string;
}

interface IValidateCodeDriverResponse extends AppResponse {
  data?: {
    token: string;
    driver: {
      name: string;
      id: number;
      telephone: string;
    };
  };
}

interface IDriverByIdResponse extends AppResponse {
  data?: IDriver;
}

export type {
  IDriverResponse,
  IDriverById,
  IDriver,
  IUpdateDriver,
  IValidateCodeDriverResponse,
  IDriverByIdResponse,
};
