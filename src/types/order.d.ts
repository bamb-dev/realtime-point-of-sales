import { Menu } from "@/validations/menu-validation";

export type OrderFormState = {
  status?: string;
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    status?: string[];
    _form?: string[];
  };
};

export type Cart = {
  menu_id: string;
  menu: Menu;
  total: number;
  quantity: number;
  notes: string;
  order_id?: string;
};
