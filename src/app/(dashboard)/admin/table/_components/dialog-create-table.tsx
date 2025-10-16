import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormTable from "./form-table";
import { TableForm, TableSchemaForm } from "@/validations/table-validation";
import {
  INITIAL_STATE_TABLE,
  INITIAL_TABLE_FORM,
} from "@/constants/table-constant";
import { createTable } from "../actions";

export default function DialogCreateTable({
  refetch,
}: {
  refetch: () => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(TableSchemaForm),
    defaultValues: INITIAL_TABLE_FORM,
  });

  const [createTableState, createTableAction, isPendingCreateTable] =
    useActionState(createTable, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createTableAction(formData);
    });
  });

  useEffect(() => {
    if (createTableState?.status === "error") {
      toast.error("Create Table Failed", {
        description: createTableState.errors?._form?.[0],
      });
    }

    if (createTableState?.status === "success") {
      toast.success("Create Table Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createTableState]);

  return (
    <FormTable
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateTable}
      type="Create"
    />
  );
}
