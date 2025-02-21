import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetFullMember from "@/features/conversations/hooks/useGetFullCurrentMember";
import { AlertTriangle, ChevronDown, MailIcon, XIcon } from "lucide-react";
import Link from "next/link";
import useUpdateMember from "../hooks/useUpdateMember";
import useRemoveMember from "../hooks/useRemoveMember";
import useGetUserId from "@/hooks/useGetUserId";
import useConfirm from "@/hooks/useConfirm";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { triggerRemoveUserFromWorkspace } from "@/utils/members-actions";

interface IProfileProps {
  memberId: string | null;
  onClose: () => void;
}
function Profile({ memberId, onClose }: IProfileProps) {
  const router = useRouter();
  const { fullMember } = useGetFullMember(memberId as string);
  const { userId } = useGetUserId();
  const { fullMember: currentFullMember } = useGetFullMember(userId || "");
  const { handleSubmit: handleUpdate } = useUpdateMember(memberId || "");
  const { handleSubmit: handleRemove } = useRemoveMember(memberId || "");
  const { ConfirmDialog: ConfirmLeave, confirm: handleLeaveConfirm } =
    useConfirm("Leave this  workspace ", "Are you sure?");
  const { ConfirmDialog: ConfirmRemove, confirm: handleRemoveConfirm } =
    useConfirm("Remove member", "Are you sure?");
  const { ConfirmDialog: ConfirmUpdate, confirm: handleUpdateConfirm } =
    useConfirm("update Member", "Are you sure?");
  if (!fullMember || !currentFullMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold ">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className=" size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex flex-col gap-y-2  h-full items-center justify-start">
          <AlertTriangle className=" size-5  text-muted-foreground " />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }
  const avatarFallback = fullMember.name?.[0] ?? "M";

  const handleDeleteSubmit = async () => {
    const ok = await handleRemoveConfirm();
    if (!ok) return;
    const deletedMember = await handleRemove();
    if (deletedMember.success) {
      toast.success("User deleted successfully ");
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
          window.location.reload();
        }, 2000);
      });
    } else {
      toast.error(" can't delete this user ");
    }
  };

  const handleLeaveSubmit = async () => {
    const ok = await handleLeaveConfirm();
    if (!ok) return;
    const deletedMember = await handleRemove();
    if (deletedMember.success) {
      toast.success("you have left successfully ");
      await triggerRemoveUserFromWorkspace(
        deletedMember.updatedMember as {
          workspaceId: string;
          userId: string;
          role: "admin" | "member";
        }
      );
      router.replace("/");
    } else {
      toast.error(" can't leave ");
    }
  };

  const handleUpadateSubmit = async (role: "admin" | "member") => {
    const ok = await handleUpdateConfirm();
    if (!ok) return;
    const updatedMember = await handleUpdate(role);
    if (updatedMember.success) {
      toast.success("you have update the role successfully ");
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
          window.location.reload();
        }, 2000);
      });
    } else {
      toast.error(" can't change role  ");
    }
  };

  return (
    <>
      <ConfirmLeave />
      <ConfirmRemove />
      <ConfirmUpdate />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-[49px] border-b">
          <p className="text-lg font-bold ">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className=" size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className=" flex flex-col  p-4  items-center justify-start">
          <Avatar className=" max-w-[256px] max-h-[256px] size-full ">
            <AvatarImage src={fullMember.image ?? ""} />
            <AvatarFallback className=" aspect-square text-6xl">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className=" flex flex-col p-4 ">
          <p className="text-xl font-bold">{fullMember.name}</p>
          {/* you are looking at yourself  */}
          {currentFullMember.role === "admin" &&
          currentFullMember.userId !== fullMember.userId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full capitalize">
                    {fullMember.role} <ChevronDown className=" size-4 ml-2 " />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" w-full">
                  <DropdownMenuRadioGroup
                    value={fullMember.role}
                    onValueChange={(role) =>
                      handleUpadateSubmit(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      {" "}
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      {" "}
                      member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleDeleteSubmit}
                variant={"outline"}
                className="w-full"
              >
                Remove
              </Button>
            </div>
          ) : currentFullMember.userId === memberId &&
            currentFullMember.role !== "admin" ? (
            <div className=" mt-4">
              <Button
                onClick={handleLeaveSubmit}
                variant={"outline"}
                className=" w-full"
              >
                Leave
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">contanct information</p>
          <div className=" flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center ">
              <MailIcon className="size-4" />
            </div>
            <div className=" flex flex-col">
              <p className=" text-[12px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${fullMember.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {fullMember.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
