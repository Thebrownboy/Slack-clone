import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { useParams } from "next/navigation";

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
interface UserItemProps {
  id: string;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
  currentUserId: string;
}
function UserItem({
  id,
  image,
  label = "Member",
  variant,
  currentUserId,
}: UserItemProps) {
  const { workspaceId } = useParams();
  const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button
      variant={"transparent"}
      className={cn(userItemVariants({ variant: variant }))}
      size={"sm"}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className=" rounded-md bg-sky-500 text-white ">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">
          {label} {currentUserId == id ? "(you)" : ""}
        </span>
      </Link>
    </Button>
  );
}

export default UserItem;
