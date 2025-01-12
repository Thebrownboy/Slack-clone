"use client";
import { Toolbar } from "../_components/toolbar";
import SideBar from "../_components/SideBar";
import { Loader2Icon } from "lucide-react";

import useWorkspaceGaurd from "@/hooks/useWorkspaceGaurd";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
  // using this techinque here will not affect the performance cuz children can be server components as they wanna
  const { loading } = useWorkspaceGaurd();
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <Loader2Icon className="animate-spin" size={60}></Loader2Icon>
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
            <div>Channles SideBar</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;
