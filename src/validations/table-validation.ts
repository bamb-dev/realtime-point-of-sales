import z from "zod";

export const TableSchema = z.object({
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  status: z.string(),
});

export const TableSchemaForm = z.object({
  name: z.string().min(1, "name is required"),
  description: z.string().min(1, "description is required"),
  capacity: z.string().min(1, "capacity is required"),
  status: z.string().min(1, "status is required"),
});

export type Table = z.infer<typeof TableSchema> & {
  id: string;
};
export type TableForm = z.infer<typeof TableSchemaForm>;
