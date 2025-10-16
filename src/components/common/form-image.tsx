import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage, Trash2, X } from "lucide-react";
import { getImageData } from "@/lib/utils";
import { Preview } from "@/types/general";
import { Button } from "../ui/button";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 rounded-lg">
                {!!preview?.displayUrl ? (
                  <AvatarImage
                    src={preview?.displayUrl}
                    alt="preview"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center aspect-square rounded-lg">
                    <FileImage className="w-4 h-4" />
                  </div>
                )}
              </Avatar>

              <Button
                type="button"
                hidden={!preview?.displayUrl}
                variant={"ghost"}
                onClick={async (event) => {
                  onChange(event);
                  setPreview?.({
                    file: new File([], "empty.txt", { type: "text/plain" }),
                    displayUrl: "",
                  });
                }}
              >
                <Trash2 />
              </Button>
              <Input
                type="file"
                name={rest.name}
                ref={rest.ref}
                onBlur={rest.onBlur}
                disabled={rest.disabled}
                accept=".jpg, .jpeg, .png, .webp, .svg"
                onChange={async (event) => {
                  onChange(event);
                  const { file, displayUrl } = getImageData(event);
                  if (file) {
                    setPreview?.({
                      file,
                      displayUrl,
                    });
                  }
                }}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
