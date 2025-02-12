import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetFullMember from "@/features/conversations/hooks/useGetFullCurrentMember";
import { AlertTriangle, MailIcon, XIcon } from "lucide-react";
import Link from "next/link";

interface IProfileProps {
  memberId: string | null;
  onClose: () => void;
}
function Profile({ memberId, onClose }: IProfileProps) {
  const { fullMember } = useGetFullMember(memberId as string);
  console.log("Memmber is herer ", fullMember);
  console.log(" I am her ");
  if (!fullMember) {
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
  return (
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
  );
}

export default Profile;
