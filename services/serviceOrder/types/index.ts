import { AppResponse } from "@/services/AppResponse";

interface IServiceOrders {
  id: number;
  service_type_id: number;
  initial_location: any;
  final_location: any;
  created_at: Date;
  end_at: Date | null;
  driver_id: number | null;
  user_id: number;
  comments: string | null;
  accepted: boolean;
}

interface ICreateServiceOrders {
  service_type_id: number;
  initial_location: {
    lat: string;
    long: string;
  };
  final_location: {
    lat: string;
    long: string;
  };
  driver_id: number | null;
  user_id: number;
  comments: string | null;
}

interface IListServiceOrders
  extends Omit<IServiceOrders, "initial_location" | "final_location"> {
  init_lat: string;
  init_long: string;
  final_lat: string;
  final_long: string;
  user_name: string;
  driver_name: string | null;
}

interface IResponseListServiceOrders extends AppResponse {
  data?: {
    list: IListServiceOrders[];
    count: number;
  };
}

export type {
  ICreateServiceOrders,
  IServiceOrders,
  IResponseListServiceOrders,
  IListServiceOrders,
};
