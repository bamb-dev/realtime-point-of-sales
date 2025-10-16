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
import { cn } from "@/lib/utils";
import { Table } from "@/validations/table-validation";
import { HEADER_TABLE_TABLE } from "@/constants/table-constant";
import DialogCreateTable from "./dialog-create-table";
import DialogUpdateTable from "./dialog-update-table";
import DialogDeleteTable from "./dialog-delete-table";

export default function TableManagement() {
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
    data: Table;
    type?: "update" | "delete";
  } | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (!openUpdateDialog) setSelectedAction(null);
  }, [openUpdateDialog]);

  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tables", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("tables")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `name.ilike.%${currentSearch}%,description .ilike.%${currentSearch}%,status.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Table data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const handleOpenUpdateDialog = (data: Table) => {
    setOpenUpdateDialog(true);
    setSelectedAction({
      data,
      type: "update",
    });
  };
  const handleOpenDeleteDialog = (data: Table) => {
    setOpenDeleteDialog(true);
    setSelectedAction({
      data,
    });
  };
  const filteredData = useMemo(() => {
    return (tables?.data || []).map((table: Table, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex flex-col gap-0.5" key={table.id}>
          <h2 className="font-bold">{table.name}</h2>
          <p className="text-xs">{table.description}</p>
        </div>,
        table.capacity,

        <div
          key={table.id}
          className={cn("px-2 py-1 rounded-full  text-white w-fit capitalize", {
            "bg-green-600": table.status === "available",
            "bg-red-500": table.status === "unavailable",
            "bg-yellow-500": table.status === "reserved",
          })}
        >
          {table.status}
        </div>,
        <div key="action" className="flex gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenUpdateDialog(table)}
          >
            <PencilLine className=" size-5 " />
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => handleOpenDeleteDialog(table)}
          >
            <Trash2 className=" size-5 text-red-600" />
          </Button>
        </div>,
      ];
    });
  }, [tables]);

  const totalPages = useMemo(() => {
    return tables && tables.count !== null
      ? Math.ceil(tables.count / currentLimit)
      : 0;
  }, [tables]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search ...."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogCreateTable refetch={refetch} />
          </Dialog>
        </div>
      </div>
      <DataTable
        header={HEADER_TABLE_TABLE}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
      <DialogUpdateTable
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openUpdateDialog}
        handleChangeOpenDialog={setOpenUpdateDialog}
      />
      <DialogDeleteTable
        refetch={refetch}
        currentData={selectedAction?.data}
        openDialog={openDeleteDialog}
        handleChangeOpenDialog={setOpenDeleteDialog}
      />
    </div>
  );
}
