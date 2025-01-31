"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCreateChannel from "../hooks/useCreateChannel";

export default function CreateChannelModal() {
  const {
    channelName,
    updateName,
    isOpen,
    setOpen,
    isPending,
    submitCreateAction,
  } = useCreateChannel();
  const handleClose = () => {
    updateName("");
    setOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    updateName(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Add a channel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitCreateAction}>
          <Input
            value={channelName}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <div className=" flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
