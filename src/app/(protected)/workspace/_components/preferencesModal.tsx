import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDeleteWorkspace from "@/features/workspaces/hooks/useDeleteWorkspace";
import useUpdateWorkspace from "@/features/workspaces/hooks/useUpdateWorkspace";
import useConfirm from "@/hooks/useConfirm";
import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PrefernceModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export default function PreferencesModal({
  initialValue,
  open,
  setOpen,
}: PrefernceModalProps) {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);
  const { ConfirmDialog, confirm } = useConfirm(
    "Are you sure?",
    "THis actions is irreversible"
  );
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const {
    userState: { user },
  } = useCurrentUser((state) => state);

  const router = useRouter();
  const {
    updateWorkspaceState,
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);
  const workspaceId = workSpace?.id;
  const { isPending: isUpdatingWorkspace, submitUpdateAction } =
    useUpdateWorkspace(user?.id, workspaceId as string, updateWorkspaceState);
  const { submitDeleteAction } = useDeleteWorkspace(
    user?.id,
    workspaceId as string
  );
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className=" text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    await submitUpdateAction(e, { name: value });
                    setEditOpen(false);
                    setOpen(false);
                    // reload here is a very expensive thing to do
                  }}
                >
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work' , 'Personal' , 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant={"outline"}
                        disabled={isUpdatingWorkspace}
                      >
                        {" "}
                        Cancel
                      </Button>
                    </DialogClose>

                    <Button disabled={isUpdatingWorkspace}> Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={false}
              onClick={async () => {
                const ok = await confirm();
                if (!ok) return;
                await submitDeleteAction();
                router.replace("/");
              }}
              className=" flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold ">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
