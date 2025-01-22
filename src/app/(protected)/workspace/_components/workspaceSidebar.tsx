import useGetCurrentMember from "@/features/members/hooks/useGetCurrentMember";
import {
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspaceHeader";
import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";
import SidebarItem from "./sidebarItem";
import useGetCurrentChannels from "@/features/channels/hooks/useGetCurrentChannels";
import WorkspaceSection from "./workspaceSection";

export default function WorkspaceSidebar() {
  const {
    currentWorkspaceState: {
      isLoading: workspaceLoading,
      workSpace: currentWorkSpace,
    },
  } = useCurrentWorkspace((state) => state);
  const workspaceId = currentWorkSpace?.id;
  const {
    userState: { user },
  } = useCurrentUser((state) => state);
  const { loading: memberLoading, member } = useGetCurrentMember(
    workspaceId as string,
    user?.id || ""
  );
  const { currentChannels, isLoading: isCurrentChannelsLoading } =
    useGetCurrentChannels(workspaceId as string, user?.id || "");
  if (workspaceLoading || memberLoading || isCurrentChannelsLoading) {
    <div className="flex flex-col bg-[#5E2C5F] h-full  items-center justify-center">
      <Loader className="size-5 animate-spin text-white" />
    </div>;
  }
  // console.log("Workspace sidebar will be render");
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader isAdmin={member?.role === "admin"} />

      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant={"default"}
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizonal}
          id="draft"
          variant={"default"}
        />
      </div>
      <WorkspaceSection label="channels" hint="New Channels" onNew={() => {}}>
        {currentChannels?.map((item) => {
          return (
            <SidebarItem
              key={item.id}
              icon={HashIcon}
              label={item.name}
              id={item.id}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
}
