import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const DialogDelete = ({
  open,
  onOpenChange,
  title,
  onSubmit,
  isLoading,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Delete {title}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{" "}
              <span className="lowercase">{title}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button formAction={onSubmit} variant="destructive">
              {isLoading ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDelete;
