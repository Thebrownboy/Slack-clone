"use client";
import { Button } from "@/components/ui/button";
import { useWorkSpaceStore } from "@/state-store/store";
import { tWorkspace } from "@/types/common-types";
import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";
import { Info, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Toolbar = () => {
  const { workspaceId } = useParams();
  const userWorkSpaces = useWorkSpaceStore((state) => state.workSpaces);
  const [currentWorkSpace, updateCurrentWorkSpace] = useState<
    tWorkspace | undefined | null
  >(undefined);
  useEffect(() => {
    const getCurrentWorkspace = async () => {
      const response = await getWorkSpaceByIdAction(workspaceId as string | "");
      updateCurrentWorkSpace(response);
    };
    getCurrentWorkspace();
  }, [workspaceId, userWorkSpaces]);

  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 "
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search {currentWorkSpace?.name}
          </span>
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
