import useGetCurrentMember from "@/features/members/hooks/useGetCurrentMember";
import { Loader } from "lucide-react";
import WorkspaceHeader from "./workspaceHeader";
import { useCurrentUser, useCurrentWorkspace } from "@/state-store/store";

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
  if (workspaceLoading || memberLoading) {
    <div className="flex flex-col bg-[#5E2C5F] h-full  items-center justify-center">
      <Loader className="size-5 animate-spin text-white" />
    </div>;
  }
  // console.log("Workspace sidebar will be render");
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader isAdmin={member?.role === "admin"} />
    </div>
  );
}
