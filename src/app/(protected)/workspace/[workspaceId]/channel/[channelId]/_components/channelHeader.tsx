import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditChannelNameModal from "@/features/channels/components/editChannelNameModal";
import useDeleteChannel from "@/features/channels/hooks/useDeleteChannel";
import useConfirm from "@/hooks/useConfirm";
import { useCurrentMember } from "@/state-store/member-store";
import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";

interface channelHeaderProps {
  channelName: string;
}

export default function ChannelHeader({ channelName }: channelHeaderProps) {
  const { confirm, ConfirmDialog } = useConfirm(
    "Are you sure",
    "This action is irreversible"
  );
  const { submitDeleteAction, isPending } = useDeleteChannel();
  const {
    currentMemberState: { member },
  } = useCurrentMember((state) => state);
  return (
    <>
      <ConfirmDialog />
      <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-lg font-semibold px-2 overflow-hidden w-auto "
              size={"sm"}
            >
              <span className=" truncate"># {channelName}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 bg-gray-50 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>

            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <EditChannelNameModal channelName={channelName} />
              {member?.role === "admin" && (
                <button
                  disabled={isPending}
                  onClick={async () => {
                    const ok = await confirm();
                    if (!ok) return;
                    await submitDeleteAction();
                  }}
                  className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                >
                  <TrashIcon className="size-4 " />
                  <p className="text-sm font-semibold">Delete channel</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
