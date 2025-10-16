"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClientSupabase } from "@/lib/supabase/default";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, ScrollTextIcon, Trash2 } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Order } from "@/validations/order-validation";
import { HEADER_TABLE_TABLE } from "@/constants/order-constant";
import DialogCreateOrder from "./dialog-create-order";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { updateRerservation } from "../actions";

import Link from "next/link";
import CustomTooltip from "@/components/common/custom-tooltip";
import { useAuthStore } from "@/strores/auth-store";

export default function OrderManagement() {
  const profile = useAuthStore((state) => state.profile);
  const supabase = createClientSupabase();

  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();
  const [selectedAction, setSelectedAction] = useState<{
    data: Order;
    type?: "update" | "delete";
  } | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (!openUpdateDialog) setSelectedAction(null);
  }, [openUpdateDialog]);

  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const result = await supabase
        .from("tables")
        .select("id, name, status, capacity")
        .order("status")
        .order("capacity");
      return result;
    },
  });

  const {
    data: orders,
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("orders")
        .select(
          `id, order_id, customer_name, status, payment_url, tables (name, id)`,
          { count: "exact" }
        )
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `order_id.ilike.%${currentSearch}%, customer_name.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const [reservedState, reservedAction] = useActionState(
    updateRerservation,
    INITIAL_STATE_ACTION
  );

  const handleReserved = async ({
    id,
    status,
    table_id,
  }: {
    id: string;
    status: string;
    table_id: string;
  }) => {
    const formData = new FormData();
    Object.entries({ id, status, table_id }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    startTransition(() => {
      reservedAction(formData);
    });
  };

  useEffect(() => {
    if (reservedState?.status === "error") {
      toast.error("Update Reservation Failed", {
        description: reservedState.errors?._form?.[0],
      });
    }

    if (reservedState?.status === "success") {
      toast.success("Update Reservation Success");
    }
  }, [reservedState]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          refetchOrders();
          refetchTables();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredData = useMemo(() => {
    return (orders?.data || []).map((order, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        order.order_id,
        order.customer_name,
        (order.tables as unknown as { name: string }).name ?? "",
        <div
          key={order.id}
          className={cn("px-2 py-1 rounded-full  text-white w-fit capitalize", {
            "bg-lime-600": order.status === "settled",
            "bg-sky-500": order.status === "proccess",
            "bg-amber-500": order.status === "reserved",
            "bg-red-500": order.status === "canceled",
          })}
        >
          {order.status}
        </div>,
        <div key="action" className="flex gap-1">
          {order.status === "reserved" && profile?.role !== "kitchen" ? (
            <>
              <CustomTooltip text="Process" classNameText="text-sky-500">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() =>
                    handleReserved({
                      id: order.id,
                      status: "proccess",
                      table_id: (order.tables as unknown as { id: string }).id,
                    })
                  }
                >
                  <Link2Icon className="size-5 text-amber-500" />
                </Button>
              </CustomTooltip>
              <CustomTooltip text="Cancel" classNameText="text-red-600">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={() =>
                    handleReserved({
                      id: order.id,
                      status: "canceled",
                      table_id: (order.tables as unknown as { id: string }).id,
                    })
                  }
                >
                  <Ban className=" size-5 text-red-600" />
                </Button>
              </CustomTooltip>
            </>
          ) : order.status !== "canceled" ? (
            <CustomTooltip text="Detail">
              <Button variant="ghost" className="cursor-pointer" asChild>
                <Link href={`/order/${order.order_id}`}>
                  <ScrollTextIcon className="size-5 text-sky-500" />
                </Link>
              </Button>
            </CustomTooltip>
          ) : order.status === "canceled" && profile?.role !== "kitchen" ? (
            <Button variant="ghost" className="cursor-pointer">
              <Trash2 className="size-5 text-red-500" />
            </Button>
          ) : null}
        </div>,
      ];
    });
  }, [orders]);

  const totalPages = useMemo(() => {
    return orders && orders.count !== null
      ? Math.ceil(orders.count / currentLimit)
      : 0;
  }, [orders]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search ...."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          {profile?.role !== "kitchen" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create</Button>
              </DialogTrigger>
              <DialogCreateOrder table={tables?.data || []} />
            </Dialog>
          )}
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
    </div>
  );
}
