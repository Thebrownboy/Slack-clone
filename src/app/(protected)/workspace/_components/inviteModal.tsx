import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import useNewJoinCode from "@/features/workspaces/hooks/useNewJoinCode";
import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import { DialogClose } from "@radix-ui/react-dialog";
import useConfirm from "@/hooks/useConfirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  joinCode: string;
  name: string;
  workspaceId: string;
}
export default function InviteModal({
  open,
  setOpen,
  joinCode,
  name,
  workspaceId,
}: InviteModalProps) {
  const { ConfirmDialog, confirm } = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      console.log("I am here ");
      toast.success("Invite link copied to clipbaord");
    });
  };
  const {
    userState: { user },
  } = useCurrentUser((state) => state);
  const { updateWorkspaceState } = useCurrentWorkspace((state) => state);
  const { submitUpdateAction, isPending } = useNewJoinCode(
    user?.id || "",
    workspaceId,
    updateWorkspaceState
  );
  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;
    try {
      await submitUpdateAction();
      toast.success("Invite code re-generated");
    } catch {
      toast.error("Failed to regenreate invite code ");
    }
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className=" text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>
              Copy link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className=" flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant={"outline"}
            >
              {" "}
              New Code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
