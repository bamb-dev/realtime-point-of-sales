"use client";
import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";
import { deleteMenu } from "../actions";

const DialogDeleteMenu = ({
  refetch,
  currentData,
  openDialog,
  handleChangeOpenDialog,
}: {
  refetch: () => void;
  currentData?: Menu;
  openDialog?: boolean;
  handleChangeOpenDialog?: (open: boolean) => void;
}) => {
  const [deleteMenuState, deleteMenuAction, isLoading] = useActionState(
    deleteMenu,
    INITIAL_STATE_ACTION
  );
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    formData.append("image_url", currentData!.image_url as string);
    startTransition(() => {
      deleteMenuAction(formData);
    });
  };
  useEffect(() => {
    if (deleteMenuState?.status === "error") {
      toast.error("Delete Menu Failed", {
        description: deleteMenuState.errors?._form,
      });
    }
    if (deleteMenuState?.status === "success") {
      toast.success("Delete Menu Success");
      handleChangeOpenDialog?.(false);
      refetch();
    }
  }, [deleteMenuState]);

  return (
    <DialogDelete
      open={openDialog}
      onOpenChange={handleChangeOpenDialog}
      title="Menu"
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

export default DialogDeleteMenu;
