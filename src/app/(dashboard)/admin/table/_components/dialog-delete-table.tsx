"use client";
import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { Table } from "@/validations/table-validation";
import { deleteTable } from "../actions";

const DialogDeleteTable = ({
  refetch,
  currentData,
  openDialog,
  handleChangeOpenDialog,
}: {
  refetch: () => void;
  currentData?: Table;
  openDialog?: boolean;
  handleChangeOpenDialog?: (open: boolean) => void;
}) => {
  const [deleteTableState, deleteTableAction, isLoading] = useActionState(
    deleteTable,
    INITIAL_STATE_ACTION
  );
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    startTransition(() => {
      deleteTableAction(formData);
    });
  };
  useEffect(() => {
    if (deleteTableState?.status === "error") {
      toast.error("Delete Table Failed", {
        description: deleteTableState.errors?._form,
      });
    }
    if (deleteTableState?.status === "success") {
      toast.success("Delete Table Success");
      handleChangeOpenDialog?.(false);
      refetch();
    }
  }, [deleteTableState]);

  return (
    <DialogDelete
      open={openDialog}
      onOpenChange={handleChangeOpenDialog}
      title="Table"
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

export default DialogDeleteTable;
