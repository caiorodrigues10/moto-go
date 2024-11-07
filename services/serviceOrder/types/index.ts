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
  active: boolean;
}

interface ICreateServiceOrders {
  service_type_id: number;
  initial_location: {
    lat: number;
    long: number;
  };
  final_location: {
    lat: number;
    long: number;
  };
  driver_id: number | null;
  user_id: number;
  comments: string | null;
  full_address: string | null;
  full_address_destiny: string | null;
}

interface IListServiceOrders
  extends Omit<IServiceOrders, "initial_location" | "final_location"> {
  init_lat: number;
  init_long: number;
  final_lat: number;
  final_long: number;
  user_name: string;
  driver_name: string | null;
  distance: string | null;
  duration: string | null;
  full_address: string | null;
  full_address_destiny: string | null;
  service_type_name: string;
}

interface IResponseListServiceOrders extends AppResponse {
  data?: {
    list: IListServiceOrders[];
    count: number;
  };
}

interface IResponseListServiceOrderByUser extends AppResponse {
  data?: IListServiceOrders;
}

interface IUpdateServiceOrder {
  comments?: string;
  driver_id?: number | null;
  accepted?: boolean;
}

export type {
  ICreateServiceOrders,
  IServiceOrders,
  IResponseListServiceOrders,
  IListServiceOrders,
  IUpdateServiceOrder,
  IResponseListServiceOrderByUser,
};
