import z from "zod";

export const OrderSchemaForm = z.object({
  customer_name: z.string().min(1, "name is required"),
  table_id: z.string().min(1, "Select a table"),
  status: z.string().min(1, "Select a status"),
});

export const OrderSchema = z.object({
  table_id: z.string(),
  customer_name: z.string(),
  status: z.string(),
});

export type Order = z.infer<typeof OrderSchema> & {
  id: string;
};

export type OrderForm = z.infer<typeof OrderSchemaForm>;
