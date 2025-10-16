import z from "zod";

export const loginSchemaForm = z.object({
  email: z
    .string()
    .min(1, "email is required")
    .email("please enter a valid email"),
  password: z.string().min(1, "password is required"),
});

export const createUserSchemaForm = z.object({
  name: z.string().min(1, "name is required"),
  email: z
    .string()
    .min(1, "email is required")
    .email("please enter a valid email"),
  password: z.string().min(1, "password is required"),
  role: z.string().min(1, "Role is required"),
  avatar_url: z.union([z.string(), z.instanceof(File)]).optional(),
});
export const updateUserSchemaForm = z.object({
  name: z.string().min(1, "name is required"),
  role: z.string().min(1, "Role is required"),
  avatar_url: z.union([z.string(), z.instanceof(File)]).optional(),
});
export type LoginForm = z.infer<typeof loginSchemaForm>;
export type CreateUserForm = z.infer<typeof createUserSchemaForm>;
export type UpdateUserForm = z.infer<typeof updateUserSchemaForm>;
