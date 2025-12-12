"use client";

import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type OpenInFullscreenProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export function OpenInFullscreen({ trigger, children }: OpenInFullscreenProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-hidden p-0 md:max-h-[90vh] md:max-w-[90vw]">
        <DialogTitle className="sr-only">Image viewer</DialogTitle>
        <div className="flex h-full w-full items-center justify-center p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
