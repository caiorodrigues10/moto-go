import { AppResponse } from "@/services/AppResponse";

interface IUser {
  cpf: string;
  email: string;
  id: number;
  name: string;
  telephone: string;
  active: boolean;
  createdAt: string;
}

interface ICreateUser {
  name: string;
  telephone?: string;
}

interface IUpdateUser {
  name: string;
}

interface IUserByIdResponse extends AppResponse {
  data?: IUser;
}
interface ICreateUserResponse extends AppResponse {
  data?: IUser;
}

interface IUpdateUserResponse extends AppResponse {
  data?: IUser;
}

interface IChangeUserPassword {
  password: string;
  confirmPassword: string;
}

interface IValidatePin {
  telephone: string;
  code: number;
}

interface IValidatePinResponse extends AppResponse {
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
      telephone: string;
    };
  };
}

interface ICreateUserAddress {
  name: string;
  zipcode: string;
  address: string;
  district: string;
  address_number: number;
  city: string;
  state: string;
  complement: string | null;
}

interface IUserAddress {
  id: number;
  user_id: number;
  name: string;
  zipcode: string;
  address: string;
  district: string;
  address_number: number;
  city: string;
  state: string;
  active: boolean;
  complement: string | null;
}

interface IResponseUserAddress extends AppResponse {
  data?: {
    count: number;
    list: IUserAddress[];
  };
}

export type {
  IUser,
  ICreateUser,
  IUserByIdResponse,
  IUpdateUser,
  ICreateUserResponse,
  IUpdateUserResponse,
  IChangeUserPassword,
  IValidatePin,
  IValidatePinResponse,
  ICreateUserAddress,
  IUserAddress,
  IResponseUserAddress,
};
