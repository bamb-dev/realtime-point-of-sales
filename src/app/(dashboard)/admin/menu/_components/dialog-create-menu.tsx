import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createMenu } from "../actions";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import {
  INITIAL_MENU_FORM,
  INITIAL_STATE_MENU,
} from "@/constants/menu-constant";
import FormMenu from "./form-menu";
import { MenuForm, MenuSchemaForm } from "@/validations/menu-validation";

export default function DialogCreateMenu({ refetch }: { refetch: () => void }) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(MenuSchemaForm),
    defaultValues: INITIAL_MENU_FORM,
  });

  const [createMenuState, createMenuAction, isPendingCreateMenu] =
    useActionState(createMenu, INITIAL_STATE_MENU);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, key === "image_url" ? preview?.file ?? "" : value);
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (createMenuState?.status === "error") {
      toast.error("Create Menu Failed", {
        description: createMenuState.errors?._form?.[0],
      });
    }

    if (createMenuState?.status === "success") {
      toast.success("Create Menu Success");
      form.reset();
      setPreview(undefined);
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    }
  }, [createMenuState]);

  return (
    <FormMenu
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateMenu}
      type="Create"
      preview={preview}
      setPreview={setPreview}
    />
  );
}
