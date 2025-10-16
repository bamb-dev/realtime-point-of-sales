"use client";
import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import useDataTable from "@/hooks/use-data-table";
import { createClientSupabase } from "@/lib/supabase/default";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { cn, convertIRD } from "@/lib/utils";
import { HEADER_TABLE_DETAIL_ORDER } from "@/constants/order-constant";
import Summary from "./summary";
import { updateStatusOrder } from "../../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useAuthStore } from "@/strores/auth-store";
export default function DetailOrder({ id }: { id: string }) {
  const profile = useAuthStore((state) => state.profile);
  const supabase = createClientSupabase();
  const { currentPage, currentLimit, handleChangePage, handleChangeLimit } =
    useDataTable();

  const { data: order, refetch: refetchOrder } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const result = await supabase
        .from("orders")
        .select("id, customer_name, status, payment_url, tables (name, id)")
        .eq("order_id", id)
        .single();

      if (result.error)
        toast.error("Get Order data failed", {
          description: result.error.message,
        });

      return result.data;
    },
    enabled: !!id,
  });

  const {
    data: orderMenu,
    isLoading: isLoadingOrderMenu,
    refetch: refetchOrdersMenus,
  } = useQuery({
    queryKey: ["orders_menus", order?.id, currentPage, currentLimit],
    queryFn: async () => {
      const result = await supabase
        .from("orders_menus")
        .select("*, menus (id, name, image_url, price)", { count: "exact" })
        .eq("order_id", order?.id)
        .order("status");

      if (result.error)
        toast.error("Get order menu data failed", {
          description: result.error.message,
        });

      return result;
    },
    enabled: !!order?.id,
  });
  useEffect(() => {
    if (!order?.id) return;
    const channel = supabase
      .channel("orders-menus-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders_menus",
          filter: `order_id=eq.${order?.id}`,
        },
        (payload) => {
          refetchOrdersMenus();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [order?.id]);
  const [
    updateStatusOrderState,
    updateStatusOrderAction,
    isPendingUpdateStatusOrder,
  ] = useActionState(updateStatusOrder, INITIAL_STATE_ACTION);

  const handleUpdateStatusOrder = (data: { id: string; status: string }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => updateStatusOrderAction(formData));
  };
  useEffect(() => {
    if (updateStatusOrderState?.status === "error") {
      toast.error("update status menu Failed", {
        description: updateStatusOrderState.errors?._form,
      });
    }
    if (updateStatusOrderState?.status === "success") {
      toast.success("update status menu Success");
    }
  }, [updateStatusOrderState]);

  const filteredData = useMemo(() => {
    return (orderMenu?.data || []).map((item, index) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2" key={item.id}>
          <Image
            src={item.menus.image_url}
            alt={item.menus.name}
            width={40}
            height={40}
            className="rounded"
          />
          <div className="flex flex-col">
            {item.menus.name} x {item.quantity}
            <span className="text-xs text-muted-foreground">
              {item.notes || "No Notes"}
            </span>
          </div>
        </div>,
        <div key={item.id}>{convertIRD(item.menus.price * item.quantity)}</div>,
        <div
          key={item.id}
          className={cn("px-2 py-1 rounded-full text-white w-fit capitalize", {
            "bg-gray-500": item.status === "pending",
            "bg-yellow-500": item.status === "proccess",
            "bg-blue-500": item.status === "ready",
            "bg-green-500": item.status === "served",
          })}
        >
          {item.status}
        </div>,
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              className={cn(
                "data-[state-open]:bg-muted text-muted-foreground size-8",
                { hidden: item.status === "served" }
              )}
              size="icon"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {["pending", "proccess", "ready"].map((status, index) => {
              const nextStatus = ["proccess", "ready", "served"][index];
              return (
                item.status === status && (
                  <DropdownMenuItem
                    key={status}
                    className="capitalize"
                    onClick={() =>
                      handleUpdateStatusOrder({
                        id: item.id,
                        status: nextStatus,
                      })
                    }
                  >
                    {nextStatus}
                  </DropdownMenuItem>
                )
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>,
      ];
    });
  }, [orderMenu?.data]);

  const totalPages = useMemo(() => {
    return orderMenu && orderMenu.count !== null
      ? Math.ceil(orderMenu.count / currentLimit)
      : 0;
  }, [orderMenu]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-2xl font-bold">Detail Order</h1>
        {profile?.role !== "kitchen" && (
          <Link href={`/order/${id}/add`}>
            <Button>Add Order Item</Button>
          </Link>
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="lg:w-2/3">
          <DataTable
            header={HEADER_TABLE_DETAIL_ORDER}
            data={filteredData}
            isLoading={isLoadingOrderMenu}
            totalPages={totalPages}
            currentPage={currentPage}
            currentLimit={currentLimit}
            onChangePage={handleChangePage}
            onChangeLimit={handleChangeLimit}
          />
        </div>
        <div className="lg:w-1/3">
          {order && (
            <Summary
              order={order}
              orderMenu={orderMenu?.data}
              id={id}
              refetchOrder={refetchOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
