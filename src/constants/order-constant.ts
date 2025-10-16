export const HEADER_TABLE_TABLE = [
  "No",
  "Order Id",
  "Customer Name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_ORDER_FORM = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_STATE_ORDER = {
  status: "idle",
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

export const STATUS_ORDER_RADIO = [
  {
    value: "proccess",
    label: "Proccess",
  },
  {
    value: "reserved",
    label: "Reserved",
  },
];
export const HEADER_TABLE_DETAIL_ORDER = [
  "No",
  "Menu",
  "Total",
  "Status",
  "Action",
];

export const FILTER_MENU = [
  {
    value: "",
    label: "All",
  },
  {
    value: "mains",
    label: "Mains",
  },
  {
    value: "sides",
    label: "Sides",
  },
  {
    value: "desserts",
    label: "Desserts",
  },
  {
    value: "beverages",
    label: "Beverages",
  },
];
