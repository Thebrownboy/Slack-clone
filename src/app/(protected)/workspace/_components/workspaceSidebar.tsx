import useGetCurrentMember from "@/features/members/hooks/useGetCurrentMember";
import {
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";
import WorkspaceHeader from "./workspaceHeader";
import {
  useCreateChannelModal,
  useCurrentWorkspace,
} from "@/state-store/store";
import SidebarItem from "./sidebarItem";
import useGetCurrentChannels from "@/features/channels/hooks/useGetCurrentChannels";
import WorkspaceSection from "./workspaceSection";
import useGetWorkspaceMembers from "@/features/members/hooks/useGetWorkspaceMembers";
import UserItem from "./userItem";
import { useParams } from "next/navigation";

export default function WorkspaceSidebar() {
  const { setOpen } = useCreateChannelModal((state) => state);
  const {
    currentWorkspaceState: { isLoading: workspaceLoading },
  } = useCurrentWorkspace((state) => state);

  const { loading: memberLoading, member } = useGetCurrentMember();
  const { currentChannels, isLoading: isCurrentChannelsLoading } =
    useGetCurrentChannels();

  const { channelId } = useParams();

  const { currentWorkspaceMembers, isLoading: currentMembersLoading } =
    useGetWorkspaceMembers();
  if (
    workspaceLoading ||
    memberLoading ||
    isCurrentChannelsLoading ||
    currentMembersLoading
  ) {
    <div className="flex flex-col bg-[#5E2C5F] h-full  items-center justify-center">
      <Loader className="size-5 animate-spin text-white" />
    </div>;
  }
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
      <WorkspaceSection
        label="channels"
        hint="New Channels"
        onNew={
          member?.role === "admin"
            ? () => {
                setOpen(true);
              }
            : undefined
        }
      >
        {currentChannels?.map((item) => {
          return (
            <SidebarItem
              key={item.id}
              icon={HashIcon}
              label={item.name}
              id={item.id}
              variant={item.id === channelId ? "active" : "default"}
            />
          );
        })}
      </WorkspaceSection>

      <WorkspaceSection label="Direct Messages" hint="New Direct Messages">
        {currentWorkspaceMembers?.map((item) => {
          return (
            <UserItem
              id={item.user.id || ""}
              image={item.user.image || ""}
              label={item.user.name || ""}
              variant={"default"}
              key={item.user.id}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
}
