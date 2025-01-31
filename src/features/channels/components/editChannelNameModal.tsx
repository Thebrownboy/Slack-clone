import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useEditChannel from "../hooks/useEditChannelName";
import { useCurrentMember } from "@/state-store/store";

export default function EditChannelNameModal({
  channelName,
}: {
  channelName: string;
}) {
  const {
    currentMemberState: { member },
  } = useCurrentMember((state) => state);

  const {
    editChannelState,
    editOpen,
    setEditOpen,
    setValue,
    value,
    submitEditNameAction,
  } = useEditChannel(channelName);
  const handleClose = () => {
    setValue(channelName);
    setEditOpen(!editOpen);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  return (
    <Dialog open={editOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <p className=" text-sm font-semibold">channel name</p>
            {member?.role === "admin" && (
              <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                Edit
              </p>
            )}
          </div>

          <p className="text-sm "># {channelName}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename this channel </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitEditNameAction}>
          <Input
            value={value}
            disabled={editChannelState.isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="e.g. plan-budget"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"} disabled={editChannelState.isPending}>
                {" "}
                Cancel
              </Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
