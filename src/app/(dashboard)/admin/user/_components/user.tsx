"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, Pencil, PencilLine, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DialogCreateUser from "./dialog-create-user";
import { Profile } from "@/types/auth";
import { set } from "zod";
import DialogUpdateUser from "./dialog-update-user";
import DialogDeleteUser from "./dialog-delete-user";

export default function UserManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const [selectedAction, setSelectedAction] = useState<{
    data: Profile;
    type?: "update" | "delete";
  } | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (!openUpdateDialog) setSelectedAction(null);
  }, [openUpdateDialog]);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at")
        .ilike("name", `%${currentSearch}%`);

      if (result.error)
        toast.error("Get User data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const handleOpenUpdateDialog = (data: Profile) => {
    setOpenUpdateDialog(true);
    setSelectedAction({
      data,
      type: "update",
    });
  };
  const handleOpenDeleteDialog = (data: Profile) => {
    setOpenDeleteDialog(true);
    setSelectedAction({
      data,
    });
  };
  const filteredData = useMemo(() => {
    return (users?.data || []).map((user, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        user.id,
        user.name,
        user.role,
        <div key="action" className="flex gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenUpdateDialog(user)}
          >
            <PencilLine className=" size-5 " />
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenDeleteDialog(user)}
          >
            <Trash2 className=" size-5 text-red-600" />
          </Button>
        </div>,
      ];
    });
  }, [users]);

  const totalPages = useMemo(() => {
    return users && users.count !== null
      ? Math.ceil(users.count / currentLimit)
      : 0;
  }, [users]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateUser refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_USER}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateUser
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openUpdateDialog}
        handleChangeOpenDialog={setOpenUpdateDialog}
      />
      <DialogDeleteUser
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openDeleteDialog}
        handleChangeOpenDialog={setOpenDeleteDialog}
      />
    </div>
  );
}
