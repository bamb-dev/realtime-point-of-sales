import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createOrder } from "../actions";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import FormRadio from "@/components/common/form-radio";
import { Loader2 } from "lucide-react";
import { OrderForm, OrderSchemaForm } from "@/validations/order-validation";
import FormSelect from "@/components/common/form-select";
import {
  INITIAL_ORDER_FORM,
  INITIAL_STATE_ORDER,
  STATUS_ORDER_RADIO,
} from "@/constants/order-constant";
import { Table } from "@/validations/table-validation";

export default function DialogCreateOrder({ table }: { table: any }) {
  const form = useForm<OrderForm>({
    resolver: zodResolver(OrderSchemaForm),
    defaultValues: INITIAL_ORDER_FORM,
  });

  const [createOrderState, createOrderAction, isPendingCreateOrder] =
    useActionState(createOrder, INITIAL_STATE_ORDER);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      createOrderAction(formData);
    });
  });

  useEffect(() => {
    if (createOrderState?.status === "error") {
      toast.error("Create Order Failed", {
        description: createOrderState.errors?._form?.[0],
      });
    }

    if (createOrderState?.status === "success") {
      toast.success("Create Order Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
    }
  }, [createOrderState]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <div className="flex justify-between mt-3">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>Create new Order here</DialogDescription>
          </DialogHeader>
          <Button
            variant={"outline"}
            onClick={() => form.reset()}
            className="text-red-600 hover:text-red-500"
          >
            Reset
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4 max-h-[50vh] overflow-auto px-2 pb-2">
            <FormInput
              form={form}
              name={"customer_name"}
              label="Customer Name"
              placeholder="Insert name here"
            />
            <FormSelect
              form={form}
              name={"table_id"}
              label="Table"
              selectItem={table.map((item: Table) => ({
                value: `${item.id}`,
                label: `${item.name} - (${item.capacity}) > ${item.status}`,
                disabled: item.status !== "available",
              }))}
            />
            <FormRadio
              form={form}
              name={"status"}
              label="Status"
              radioItem={STATUS_ORDER_RADIO}
              wrap={false}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isPendingCreateOrder ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
