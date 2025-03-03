"use client";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/state-store/user-store";
import { Loader, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserButton() {
  const {
    userState: { user, loading },
  } = useCurrentUser();

  if (loading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }
  const avatarFallback = user?.name!.charAt(0).toUpperCase();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative ">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage
            alt={user?.name || undefined}
            src={user?.image || undefined}
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem
          className="h-10 cursor-pointer"
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
