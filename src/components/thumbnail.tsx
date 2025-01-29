/* eslint-disable @next/next/no-img-element */
import React from "react";
import { DialogTrigger, Dialog, DialogContent, DialogTitle } from "./ui/dialog";

export default function Thumbnail({ url }: { url: string | null | undefined }) {
  if (!url) return <></>;
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <img
            src={url}
            alt="Message image"
            className="rounded-md object-fill size-full"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
        <DialogTitle></DialogTitle>

        <img
          src={url}
          alt="Message image"
          className="rounded-md object-fill size-full"
        />
      </DialogContent>
    </Dialog>
  );
}
