"use client";
import { Button } from "@/components/ui/button";
import { useCurrentWorkspace } from "@/state-store/store";
import { Info, Search } from "lucide-react";

export const Toolbar = () => {
  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 "
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workSpace?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
