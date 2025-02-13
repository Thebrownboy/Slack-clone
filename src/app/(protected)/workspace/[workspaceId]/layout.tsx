"use client";
import { Toolbar } from "../_components/toolbar";
import SideBar from "../_components/SideBar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "../_components/workspaceSidebar";
import { Loader, LoaderCircleIcon } from "lucide-react";
import useGetInitalData from "@/features/workspaces/hooks/useGetInitalData";
import { Thread } from "@/features/messages/components/thread";
import {
  useCurrentMemberProfile,
  useCurrentThreadData,
} from "@/state-store/store";
import Profile from "@/features/members/components/profile";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
  const { parentMessageId, parentMessageIndex, restData } =
    useCurrentThreadData();
  const { currentMemberProfileId, updateCurrentMemberProfileId } =
    useCurrentMemberProfile();
  const showPanel = !!parentMessageId || !!currentMemberProfileId;
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
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as string}
                    onClose={() => {
                      restData();
                    }}
                    messageIndex={parentMessageIndex}
                  />
                ) : currentMemberProfileId ? (
                  <Profile
                    memberId={currentMemberProfileId}
                    onClose={() => {
                      updateCurrentMemberProfileId(null);
                    }}
                  />
                ) : (
                  <div className=" flex h-full justify-center items-center ">
                    <Loader className=" size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;
