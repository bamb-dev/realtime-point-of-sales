import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormRadio from "@/components/common/form-radio";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { AVAILABILITY_RADIO, CATEGORY_LIST } from "@/constants/menu-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormMenu<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
  handleFormReset,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
  handleFormReset?: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <div className="flex justify-between mt-3">
          <DialogHeader>
            <DialogTitle>{type} Menu</DialogTitle>
            <DialogDescription>
              {type === "Create"
                ? "Register new menu here"
                : "Make changes menu here"}
            </DialogDescription>
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
              name={"name" as Path<T>}
              label="Name"
              placeholder="Insert name here"
            />
            <FormInput
              form={form}
              name={"description" as Path<T>}
              label="Description"
              placeholder="Insert description here"
              type="textarea"
            />
            <FormSelect
              form={form}
              name={"category" as Path<T>}
              label="Category"
              selectItem={CATEGORY_LIST}
            />
            <FormImage
              form={form}
              name={"image_url" as Path<T>}
              label="Image"
              preview={preview}
              setPreview={setPreview}
            />
            <FormRadio
              form={form}
              name={"is_available" as Path<T>}
              label="Availability"
              radioItem={AVAILABILITY_RADIO}
              wrap={false}
            />
            <div className="flex gap-2">
              <FormInput
                form={form}
                name={"price" as Path<T>}
                label="Price"
                placeholder="Insert price here"
                type="number"
              />
              <FormInput
                form={form}
                name={"discount" as Path<T>}
                label="Discount (%)"
                placeholder="Insert discount here"
                type="number"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
