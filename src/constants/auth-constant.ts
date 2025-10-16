export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_LOGIN = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_STATE_PROFILE = {
  id: "",
  name: "",
  role: "",
  avatar_url: "",
};

export const INITIAL_CREATE_USER_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
  avatar_url: "",
};

export const INITIAL_STATE_CREATE_USER = {
  status: "idle",
  errors: {
    name: [],
    email: [],
    role: [],
    password: [],
    avatar_url: [],
    _form: [],
  },
};

export const INITIAL_STATE_UPDATE_USER = {
  status: "idle",
  errors: {
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const ROLE_LIST = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "cashier",
    label: "Cashier",
  },
  {
    value: "kitchen",
    label: "Kitchen",
  },
];
