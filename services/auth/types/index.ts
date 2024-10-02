import { AppResponse } from "@/services/AppResponse";

interface IUserLogin {
  id: number;
  name: string;
  telephone: string;
}
interface ILogin {
  telephone: string;
}

interface ILoginResponse extends AppResponse {
  data?: {
    token: string;
    user: IUserLogin;
  };
}

export type { ILogin, ILoginResponse, IUserLogin };
