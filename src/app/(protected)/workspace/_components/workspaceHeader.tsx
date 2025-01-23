import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Hint } from "@/components/ui/hint";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import PreferencesModal from "./preferencesModal";
import { useState } from "react";
import { useCurrentWorkspace } from "@/state-store/store";
import InviteModal from "./inviteModal";

export default function WorkspaceHeader({
  isAdmin,
}: {
  readonly isAdmin: boolean;
}) {
  const {
    currentWorkspaceState: { workSpace: workspace },
  } = useCurrentWorkspace((state) => state);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace?.name || ""}
        joinCode={workspace?.joinCode || ""}
        workspaceId={workspace?.id || ""}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace?.name || ""}
      />
      <div className=" flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"transparent"}
              className="font-semibold text-lg w-auto p-1.5 overflow-hidden "
            >
              <span className=" truncate capitalize">{workspace?.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className=" size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex  items-center justify-center">
                {workspace?.name.charAt(0).toUpperCase()}
              </div>
              <div className=" flex flex-col items-start">
                <p className=" font-bold">{workspace?.name}</p>
                <p className=" text-xs text-muted-foreground ">
                  active workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className=" cursor-pointer py-2"
                  onClick={() => {
                    setInviteOpen(true);
                  }}
                >
                  Invite people to {workspace?.name}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className=" cursor-pointer py-2"
                  onClick={() => {
                    setPreferencesOpen(true);
                  }}
                >
                  Prefrences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Hint label="Filter" side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New message " side="bottom">
            <Button variant={"transparent"} size={"iconSm"}>
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
}
