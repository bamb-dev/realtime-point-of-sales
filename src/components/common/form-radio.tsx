import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function FormRadio<T extends FieldValues>({
  form,
  name,
  label,
  radioItem,
  wrap,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  radioItem: { value: string; label: string; disabled?: boolean }[];
  wrap?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={"flex" + (wrap ? " flex-col" : "")}
            >
              {radioItem.map((item) => (
                <FormItem className="flex items-center gap-3" key={item.label}>
                  <FormControl>
                    <RadioGroupItem
                      value={item.value}
                      disabled={item.disabled}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{item.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
