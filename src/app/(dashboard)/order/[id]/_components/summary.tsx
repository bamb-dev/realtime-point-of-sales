import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { usePricing } from "@/hooks/use-pricing";
import { convertIRD } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { payment } from "../../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/strores/auth-store";

export default function Summary({
  order,
  orderMenu,
  id,
  refetchOrder,
}: {
  order: {
    customer_name: string;
    tables: { name: string; id: string }[];
    status: string;
  };
  refetchOrder: () => void;
  orderMenu:
    | { menus: Menu; quantity: number; status: string }[]
    | null
    | undefined;
  id: string;
}) {
  const profile = useAuthStore((state) => state.profile);
  const router = useRouter();
  const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

  const isAllowedAll = useMemo(() => {
    return orderMenu?.every((item) => item.status === "served");
  }, [orderMenu]);

  const [paymentState, paymentAction, isPendingPayment] = useActionState(
    payment,
    INITIAL_STATE_ACTION
  );

  const handlePayment = (id: string, table: string) => {
    startTransition(() => paymentAction({ id, table }));
  };

  useEffect(() => {
    if (paymentState?.status === "error") {
      toast.error("pay Failed", {
        description: paymentState.errors?._form?.[0],
      });
    }

    if (paymentState?.status === "success") {
      toast.success("pay Success");
      router.push(`/order/`);
      refetchOrder();
    }
  }, [paymentState]);
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Information</h3>
        {order && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={order?.customer_name} disabled />
            </div>
            <div className="space-y-2">
              <Label>Table</Label>
              <Input
                value={(order?.tables as unknown as { name: string })?.name}
                disabled
              />
            </div>
          </div>
        )}
        <Separator />
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm">{convertIRD(totalPrice)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Tax (12%)</p>
            <p className="text-sm">{convertIRD(tax)}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm">Service (5%)</p>
            <p className="text-sm">{convertIRD(service)}</p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Total</p>
            <p className="text-lg font-semibold">{convertIRD(grandTotal)}</p>
          </div>
          {order?.status === "proccess" &&
            orderMenu &&
            orderMenu.length > 0 &&
            profile?.role !== "kitchen" && (
              <Button
                type="submit"
                className="w-full font-semibold bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
                disabled={!isAllowedAll || isPendingPayment}
                onClick={() =>
                  handlePayment(
                    id,
                    (order?.tables as unknown as { id: string })?.id
                  )
                }
              >
                {isPendingPayment ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
