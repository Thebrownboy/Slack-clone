/* eslint-disable */
"use client";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useCurrentWorkspace } from "@/state-store/workspace-store";
import { Info, Search } from "lucide-react";
import { useState } from "react";
import { useCurrentChannels } from "@/state-store/channel-store";
import useGetWorkspaceMembers from "@/features/members/hooks/useGetWorkspaceMembers";
import Link from "next/link";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";

export const Toolbar = () => {
  const {
    currentWorkspaceState: { workSpace },
  } = useCurrentWorkspace((state) => state);
  const { currentChannlesState } = useCurrentChannels();
  const { currentWorkspaceMembers } = useGetWorkspaceMembers();
  const { workspaceId } = useGetWorkspaceId();
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
      <div className="flex-1"></div>
      <div className="min-w-[280px] max-[642px] grow-[2] shrink">
        <Button
          onClick={() => setOpen(true)}
          size={"sm"}
          className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 "
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">Search {workSpace?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Type a command or search"
            {...({} as any)}
          />
          <CommandList>
            <CommandEmpty>No results found </CommandEmpty>
            <CommandGroup heading="Channels">
              {currentChannlesState.currentChannels?.map((item, index) => {
                return (
                  <Link
                    onClick={() => setOpen(false)}
                    key={index}
                    href={`/workspace/${workspaceId}/channel/${item.id}`}
                  >
                    <CommandItem>{item.name}</CommandItem>
                  </Link>
                );
              })}
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Users">
              {currentWorkspaceMembers?.map((member, index) => {
                return (
                  <Link
                    onClick={() => setOpen(false)}
                    key={index}
                    href={`/workspace/${workspaceId}/member/${member.member.userId}`}
                  >
                    <CommandItem>{member.user.name}</CommandItem>
                  </Link>
                );
              })}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button variant={"transparent"} size={"iconSm"}>
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
