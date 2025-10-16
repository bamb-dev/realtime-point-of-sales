"use client";
import DialogDelete from "@/components/common/dialog-delete";
import { Profile } from "@/types/auth";
import { startTransition, useActionState, useEffect } from "react";
import { deleteUser } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";

const DialogDeleteUser = ({
  refetch,
  currentData,
  openDialog,
  handleChangeOpenDialog,
}: {
  refetch: () => void;
  currentData?: Profile;
  openDialog?: boolean;
  handleChangeOpenDialog?: (open: boolean) => void;
}) => {
  const [deleteUserState, deleteUserAction, isLoading] = useActionState(
    deleteUser,
    INITIAL_STATE_ACTION
  );
  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData!.id as string);
    formData.append("avatar_url", currentData!.avatar_url as string);
    startTransition(() => {
      deleteUserAction(formData);
    });
  };
  useEffect(() => {
    if (deleteUserState?.status === "error") {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form,
      });
    }
    if (deleteUserState?.status === "success") {
      toast.success("Delete User Success");
      handleChangeOpenDialog?.(false);
      refetch();
    }
  }, [deleteUserState]);

  return (
    <DialogDelete
      open={openDialog}
      onOpenChange={handleChangeOpenDialog}
      title="User"
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
};

export default DialogDeleteUser;
