export const HEADER_TABLE_MENU = [
  "No",
  "Name",
  "Category",
  "Description",
  "Price",
  "action",
];
export const INITIAL_MENU_FORM = {
  name: "",
  category: "",
  description: "",
  price: "",
  discount: "",
  image_url: "",
  is_available: "",
};

export const CATEGORY_LIST = [
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

export const AVAILABILITY_RADIO = [
  {
    value: "true",
    label: "Available",
  },
  {
    value: "false",
    label: "Unavailable",
  },
];

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    category: [],
    price: [],
    discount: [],
    is_available: [],
    image_url: [],
    _form: [],
  },
};
