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
  cpf: string;
  name: string;
  telephone?: string;
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
};
