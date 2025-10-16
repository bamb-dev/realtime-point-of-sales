"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PencilLine, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";
import Image from "next/image";
import { cn, convertIRD } from "@/lib/utils";
import { HEADER_TABLE_MENU } from "@/constants/menu-constant";
import DialogCreateMenu from "./dialog-create-menu";
import DialogUpdateMenu from "./dialog-update-menu";
import DialogDeleteMenu from "./dialog-delete-menu";

export default function MenuManagement() {
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
    data: Menu;
    type?: "update" | "delete";
  } | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (!openUpdateDialog) setSelectedAction(null);
  }, [openUpdateDialog]);

  const {
    data: menus,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menus", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("menus")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%,category.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Menu data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const handleOpenUpdateDialog = (data: Menu) => {
    setOpenUpdateDialog(true);
    setSelectedAction({
      data,
      type: "update",
    });
  };
  const handleOpenDeleteDialog = (data: Menu) => {
    setOpenDeleteDialog(true);
    setSelectedAction({
      data,
    });
  };
  const filteredData = useMemo(() => {
    return (menus?.data || []).map((menu: Menu, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2" key={menu.id}>
          <Image
            src={menu.image_url as string}
            width={40}
            height={40}
            alt={menu.name}
            className="rounded"
          />
          {menu.name}
        </div>,
        menu.category,
        <div key={menu.id}>
          <p>Base: {convertIRD(menu.price)}</p>
          <p>Discount: {menu.discount}</p>
          <p>
            After Discount:{" "}
            {convertIRD(menu.price - (menu.price * menu.discount) / 100)}
          </p>
        </div>,
        <div
          key={menu.id}
          className={cn(
            "px-2 py-1 rounded-full  text-white w-fit",
            menu.is_available ? "bg-green-600" : "bg-red-500"
          )}
        >
          {menu.is_available ? "Available" : "Not Available"}
        </div>,
        <div key="action" className="flex gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenUpdateDialog(menu)}
          >
            <PencilLine className=" size-5 " />
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenDeleteDialog(menu)}
          >
            <Trash2 className=" size-5 text-red-600" />
          </Button>
        </div>,
      ];
    });
  }, [menus]);

  const totalPages = useMemo(() => {
    return menus && menus.count !== null
      ? Math.ceil(menus.count / currentLimit)
      : 0;
  }, [menus]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateMenu refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_MENU}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateMenu
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openUpdateDialog}
        handleChangeOpenDialog={setOpenUpdateDialog}
      />
      <DialogDeleteMenu
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openDeleteDialog}
        handleChangeOpenDialog={setOpenDeleteDialog}
      />
    </div>
  );
}
