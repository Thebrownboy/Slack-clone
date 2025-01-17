import useGetCurrentMember from "@/features/members/hooks/useGetCurrentMember";
import { tWorkspace } from "@/types/common-types";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import WorkspaceHeader from "./workspaceHeader";
import { useCurrentUser } from "@/state-store/store";

export default function WorkspaceSidebar({
  currentWorkSpace,
  loading: workspaceLoading,
}: {
  currentWorkSpace: tWorkspace | null;
  loading: boolean;
}) {
  const { workspaceId } = useParams();
  const { user } = useCurrentUser((state) => state);
  const { loading: memberLoading, member } = useGetCurrentMember(
    workspaceId as string,
    user?.id || ""
  );
  if (workspaceLoading || memberLoading) {
    <div className="flex flex-col bg-[#5E2C5F] h-full  items-center justify-center">
      <Loader className="size-5 animate-spin text-white" />
    </div>;
  }
  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={currentWorkSpace}
        isAdmin={member?.role === "admin"}
      />
    </div>
  );
}
