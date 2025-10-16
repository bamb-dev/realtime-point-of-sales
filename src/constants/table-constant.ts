export const HEADER_TABLE_TABLE = [
  "No",
  "Name",
  "Capacity",
  "Status",
  "action",
];

export const INITIAL_TABLE_FORM = {
  name: "",
  capacity: "",
  status: "",
  description: "",
};

export const STATUS_TABLE_RADIO = [
  {
    value: "available",
    label: "Available",
  },
  {
    value: "unavailable",
    label: "Unavailable",
  },
  {
    value: "reserved",
    label: "Reserved",
  },
];

export const INITIAL_STATE_TABLE = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    capacity: [],
    status: [],
    _form: [],
  },
};
