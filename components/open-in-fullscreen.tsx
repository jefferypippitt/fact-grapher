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
      <DialogContent className="h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] sm:max-w-[95vw]">
        <DialogTitle className="sr-only">Image viewer</DialogTitle>
        <div className="flex h-full w-full items-center justify-center overflow-auto p-0">
          <div className="flex h-full w-full items-center justify-center">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
