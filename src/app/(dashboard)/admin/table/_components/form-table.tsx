import FormInput from "@/components/common/form-input";
import FormRadio from "@/components/common/form-radio";
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
import { STATUS_TABLE_RADIO } from "@/constants/table-constant";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormTable<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  handleFormReset,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  handleFormReset?: () => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <div className="flex justify-between mt-3">
          <DialogHeader>
            <DialogTitle>{type} Table</DialogTitle>
            <DialogDescription>
              {type === "Create"
                ? "Register new table here"
                : "Make changes table here"}
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
            <FormInput
              form={form}
              name={"capacity" as Path<T>}
              label="Capacity"
              placeholder="Insert capacity here"
              type="number"
            />
            <FormRadio
              form={form}
              name={"status" as Path<T>}
              label="Status"
              radioItem={STATUS_TABLE_RADIO}
              wrap={false}
            />
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
