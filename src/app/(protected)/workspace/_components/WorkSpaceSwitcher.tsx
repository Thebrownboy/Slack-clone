import useGetCurrentUserWorkSpaces from "@/features/workspaces/hooks/useGetCurrentUserWorkSpaces";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/../src/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCreateWorkspaceModal,
  useCurrentUser,
  useCurrentWorkspace,
} from "@/state-store/store";
import { Button } from "@/components/ui/button";
export default function WorkSpaceSwitcher() {
  const {
    currentWorkspaceState: { workSpace, isLoading },
  } = useCurrentWorkspace((state) => state);
  const workspaceId = workSpace?.id;
  const router = useRouter();
  const {
    userState: { user },
  } = useCurrentUser((state) => state);

  const setOpen = useCreateWorkspaceModal((state) => state.setOpen);

  const { userWorkSpaces } = useGetCurrentUserWorkSpaces(user?.id || "");
  const filteredWorkspaces = userWorkSpaces?.filter(
    (workspace) => workspace.id !== workspaceId
  );
  return (
    <DropdownMenu>
      {/* as child allows you to replace the default component with a custom child element while keeping the define classes  */}
      <DropdownMenuTrigger asChild>
        <Button className="rounded flex justify-center items-center size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {isLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workSpace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workSpace?.id}`)}
          className="  cursor-pointer  flex flex-col justify-start items-start capitalize "
        >
          <p className=" max-w-full truncate"> {workSpace?.name}</p>
          <span className="text-xs text-muted-foreground">
            {" "}
            Active Workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map((item) => (
          <DropdownMenuItem
            onClick={() => router.push(`/workspace/${item.id}`)}
            key={item.id}
            className=" cursor-pointer capitalize "
          >
            <div className="size-9 relative overflow-hidden bg-[] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {item.name.charAt(0).toUpperCase()}
            </div>
            <p className=" max-w-full truncate"> {item?.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className=" cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
