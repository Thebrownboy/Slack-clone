"use client";

import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentChannels } from "@/state-store/channel-store";
import { useCurrentMessages } from "@/state-store/channels-messages";
import { useCurrentConversationMessages } from "@/state-store/conversation-store";
import { useCurrentMemberProfile } from "@/state-store/member-profile.store";
import { useCurrentMember } from "@/state-store/member-store";
import { useCurrentThreadData } from "@/state-store/thread-messages";
import { useCurrentUser } from "@/state-store/user-store";
import { useCurrentWorkspace } from "@/state-store/workspace-store";
import { useEffect, useState } from "react";

function WorkspaceLayout({ children }: { children: React.ReactElement }) {
  const { workspaceId } = useGetWorkspaceId();

  // Make them on useEffect unmount
  const { resetData: resetCurrentChannelsData } = useCurrentChannels();
  const { resetData: resetChannelsMessages } = useCurrentMessages();
  const { resetData: restConversationMessages } =
    useCurrentConversationMessages();

  const { resetData: resetCurrentMemberProfile } = useCurrentMemberProfile();
  const { resetData: resetCurrentMember } = useCurrentMember();
  const { restData: resetCurrentThreadData } = useCurrentThreadData();
  const { resetData: resetCurrentUser } = useCurrentUser();
  const { resetData: resetCurrentWorkspaceData, currentWorkspaceState } =
    useCurrentWorkspace();
  const [currentWorkspaceId, updateCurrentWorkspaceId] = useState(workspaceId);
  useEffect(() => {
    return () => {
      if (currentWorkspaceId !== workspaceId) {
        resetCurrentChannelsData();
        // resetChannelsMessages();
        // restConversationMessages();
        // resetCurrentMemberProfile();
        // resetCurrentMember();
        // resetCurrentThreadData();
        // resetCurrentUser();
        // resetCurrentWorkspaceData();
        updateCurrentWorkspaceId(workspaceId);
      }
    };
  }, [
    currentWorkspaceId,

    currentWorkspaceState,
    resetCurrentUser,
    resetCurrentChannelsData,
    restConversationMessages,
    resetChannelsMessages,
    resetCurrentMemberProfile,
    resetCurrentMember,
    resetCurrentThreadData,
    resetCurrentWorkspaceData,
    workspaceId,
  ]);
  return <>{children}</>;
}

export default WorkspaceLayout;
