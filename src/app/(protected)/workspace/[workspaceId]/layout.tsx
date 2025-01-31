"use client";
import { Toolbar } from "../_components/toolbar";
import SideBar from "../_components/SideBar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "../_components/workspaceSidebar";
import { LoaderCircleIcon } from "lucide-react";
import useGetInitalData from "@/features/workspaces/hooks/useGetInitalData";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
  const { initalDataLoading } = useGetInitalData();
  if (initalDataLoading) {
    return (
      <div className="w-[95%] h-[95%] flex justify-center items-center">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }
  return (
    <div className=" h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {/* autosave id will be used to save the size after any reload to the screen */}
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"ab-workspace-layout"}
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5e2c5f]"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={20}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;
