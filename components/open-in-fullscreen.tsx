"use client";

import { type ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type OpenInFullscreenProps = {
  trigger: ReactNode;
  children: ReactNode;
  tooltipLabel?: string;
};

export function OpenInFullscreen({
  trigger,
  children,
  tooltipLabel,
}: OpenInFullscreenProps) {
  const [open, setOpen] = useState(false);

  const dialogContent = (
    <DialogContent className="h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] sm:max-w-[95vw]">
      <DialogTitle className="sr-only">Image viewer</DialogTitle>
      <div className="flex h-full w-full items-center justify-center overflow-auto p-0">
        <div className="flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>
    </DialogContent>
  );

  if (tooltipLabel) {
    return (
      <Tooltip>
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          </DialogTrigger>
          {dialogContent}
        </Dialog>
        <TooltipContent>
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
