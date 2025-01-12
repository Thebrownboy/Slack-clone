"use client";
import UserButton from "@/features/auth/components/userButton";
import WorkSpaceSwitcher from "./WorkSpaceSwitcher";

export default function SideBar() {
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-[10px] justify-between">
      <WorkSpaceSwitcher />
      <div>
        <UserButton />
      </div>
    </aside>
  );
}
