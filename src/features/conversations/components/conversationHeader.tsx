import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";

interface channelHeaderProps {
  memberName?: string | null;
  memberImage?: string | null;
  onClick?: () => void;
}

export default function ConversationHeader({
  memberName = "Member",
  memberImage,
  onClick,
}: channelHeaderProps) {
  const avatarFallback = memberName?.charAt(0).toUpperCase();
  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <Button
        variant={"ghost"}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={"sm"}
        onClick={onClick}
      >
        <Avatar className="size-5 mr-2">
          <AvatarImage src={memberImage || undefined}></AvatarImage>
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-2.5 ml-2" />
      </Button>
    </div>
  );
}
