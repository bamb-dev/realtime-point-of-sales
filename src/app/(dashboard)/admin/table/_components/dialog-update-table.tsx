import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateTable } from "../actions";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableForm,
  TableSchemaForm,
} from "@/validations/table-validation";
import { INITIAL_STATE_TABLE } from "@/constants/table-constant";
import FormTable from "./form-table";

export default function DialogUpdateTable({
  refetch,
  currentData,
  openDialog,
  handleChangeOpenDialog,
}: {
  refetch: () => void;
  currentData?: Table;
  openDialog?: boolean;
  handleChangeOpenDialog?: (open: boolean) => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(TableSchemaForm),
  });

  const [updateTableState, updateTableAction, isPendingUpdateTable] =
    useActionState(updateTable, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateTableAction(formData);
    });
  });

  useEffect(() => {
    if (updateTableState?.status === "error") {
      toast.error("Update Table Failed", {
        description: updateTableState.errors?._form?.[0],
      });
    }

    if (updateTableState?.status === "success") {
      toast.success("Update Table Success");
      form.reset();
      handleChangeOpenDialog?.(false);
      refetch();
    }
  }, [updateTableState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description);
      form.setValue("capacity", currentData.capacity.toString());
      form.setValue("status", currentData.status);
    }
  }, [currentData]);

  return (
    <Dialog open={openDialog} onOpenChange={handleChangeOpenDialog}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateTable}
        type="Update"
      />
    </Dialog>
  );
}
