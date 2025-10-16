"use server";
import { createClient } from "@/lib/supabase/server";
import { Cart, OrderFormState } from "@/types/order";
import { FormState } from "@/types/general";
import { OrderSchema } from "@/validations/order-validation";
import { redirect } from "next/navigation";

export async function createOrder(
  prevState: OrderFormState,
  formData: FormData
) {
  const validatedFields = OrderSchema.safeParse({
    customer_name: formData?.get("customer_name"),
    table_id: formData?.get("table_id"),
    status: formData?.get("status"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const order_id = `WPUCOURSE-${new Date().getTime()}`;

  const [ordersResult, tablesResult] = await Promise.all([
    supabase.from("orders").insert({
      customer_name: validatedFields.data!.customer_name,
      order_id: order_id,
      table_id: validatedFields.data!.table_id,
      status: validatedFields.data!.status,
    }),
    supabase
      .from("tables")
      .update({
        status: `${
          validatedFields.data.status === "reserved"
            ? "reserved"
            : "unavailable"
        }`,
      })
      .eq("id", validatedFields.data.table_id),
  ]);

  const ordersError = ordersResult.error;
  const tablesError = tablesResult.error;

  if (ordersError || tablesError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(ordersError ? [ordersError.message] : []),
          ...(tablesError ? [tablesError.message] : []),
        ],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function updateRerservation(
  prevState: FormState,
  formData: FormData
) {
  const supabase = await createClient();

  const [ordersResult, tablesResult] = await Promise.all([
    supabase
      .from("orders")
      .update({
        status: formData?.get("status"),
      })
      .eq("id", formData?.get("id")),
    supabase
      .from("tables")
      .update({
        status: `${
          formData?.get("status") === "proccess" ? "unavailable" : "available"
        }`,
      })
      .eq("id", formData?.get("table_id")),
  ]);

  const ordersError = ordersResult.error;
  const tablesError = tablesResult.error;

  if (ordersError || tablesError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(ordersError ? [ordersError.message] : []),
          ...(tablesError ? [tablesError.message] : []),
        ],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function addOrderItem(
  prevState: OrderFormState,
  data: { order_id: string; items: Cart[] }
) {
  const supabase = await createClient();
  const payload = data.items.map(({ total, menu, ...item }) => item);
  const { error } = await supabase.from("orders_menus").insert(payload);
  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }
  redirect(`/order/${data.order_id}`);
}

export async function updateStatusOrder(
  prevState: FormState,
  formData: FormData
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders_menus")
    .update({ status: formData.get("status") })
    .eq("id", formData.get("id"));
  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function payment(
  prevState: FormState,
  data: { id: string; table: string }
) {
  const supabase = await createClient();
  const [ordersResult, tablesResult] = await Promise.all([
    supabase
      .from("orders")
      .update({ status: "settled" })
      .eq("order_id", data.id),
    supabase
      .from("tables")
      .update({ status: "available" })
      .eq("id", data.table),
  ]);
  const OrderError = ordersResult.error;
  const TablesError = tablesResult.error;
  if (OrderError || TablesError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [
          ...(OrderError ? [OrderError.message] : []),
          ...(TablesError ? [TablesError.message] : []),
        ],
      },
    };
  }
  return {
    status: "success",
  };
}
