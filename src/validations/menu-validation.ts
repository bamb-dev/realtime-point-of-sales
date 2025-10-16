import z from "zod";

export const MenuSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number(),
  category: z.string(),
  is_available: z.boolean(),
  image_url: z.union([z.string(), z.instanceof(File)]).optional(),
});

export const MenuSchemaForm = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().min(1, "description is required"),
  price: z.string().min(1, "price is required"),
  discount: z.string().min(1, "discount is required"),
  category: z.string().min(1, "category is required"),
  is_available: z.string().min(1, "availabilty is required"),
  image_url: z
    .union([z.string().min(1, "image is required"), z.instanceof(File)])
    .optional(),
});

export type Menu = z.infer<typeof MenuSchema> & {
  id: string;
};
export type MenuForm = z.infer<typeof MenuSchemaForm>;
