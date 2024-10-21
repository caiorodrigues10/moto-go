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

interface IUpdateServiceOrder {
  comments?: string;
  driver_id?: number;
  accepted?: boolean;
}

export type {
  ICreateServiceOrders,
  IServiceOrders,
  IResponseListServiceOrders,
  IListServiceOrders,
  IUpdateServiceOrder,
};
