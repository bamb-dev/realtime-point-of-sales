export type AuthFormState = {
  status?: string;
  errors?: {
    name?: string[];
    email?: string[];
    role?: string[];
    password?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
};

export type Profile = {
  id?: string;
  name?: string;
  role?: string;
  avatar_url?: string;
};
