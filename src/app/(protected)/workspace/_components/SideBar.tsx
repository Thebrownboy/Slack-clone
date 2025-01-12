"use client";
import UserButton from "@/features/auth/components/userButton";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";
import SidebarButton from "@/components/sidebar-button";
import { BellIcon, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export default function SideBar() {
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[10px] justify-between">
      <div className=" flex flex-col gap-7">
        <WorkSpaceSwitcher />
        <SidebarButton icon={Home} label="Home" isActive={true} />
        <SidebarButton icon={MessagesSquare} label="DMs" isActive={true} />
        <SidebarButton icon={BellIcon} label="activity" isActive={true} />
        <SidebarButton icon={MoreHorizontal} label="More" isActive={true} />
      </div>
      <div>
        <UserButton />
      </div>
    </aside>
  );
}
