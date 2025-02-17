import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useGetWorkspaceMembers from "@/features/members/hooks/useGetWorkspaceMembers";
import useGetWorkspaceId from "@/hooks/useGetWorkspaceId";
import { useCurrentChannels } from "@/state-store/channel-store";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface CommandListProps {
  open: boolean;
  setOpen: (newValue: boolean) => void;
}
function CommandList({ open, setOpen }: CommandListProps) {
  const { currentChannlesState } = useCurrentChannels();
  const { currentWorkspaceMembers } = useGetWorkspaceMembers();
  const { workspaceId } = useGetWorkspaceId();
  const [search, updateSearch] = useState("");

  const filteredChannels = currentChannlesState.currentChannels?.filter(
    (item) =>
      item.name.replace("-", " ").toLowerCase().includes(search.toLowerCase())
  );
  const filterdMembers = currentWorkspaceMembers?.filter((item) =>
    item.user.name?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-h-[350px] overflow-y-scroll overflow-x-hidden p-3 items-start gap-0">
        <DialogHeader className=" relative">
          <div className="relative">
            <Input
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-9"
              autoFocus
            ></Input>
            <SearchIcon
              color="#64748b"
              size={20}
              className=" absolute top-1/4 left-2"
            ></SearchIcon>
          </div>
        </DialogHeader>
        {!(filteredChannels?.length === 0) && (
          <p className="text-[#64748b]">channels</p>
        )}
        {filteredChannels?.map((item, index) => {
          return (
            <Link
              onClick={() => {
                setOpen(false);
              }}
              className="p-0"
              key={index}
              href={`/workspace/${workspaceId}/channel/${item.id}`}
            >
              <p className=" rounded-md px-2 py-2 hover:bg-[#f1f5f9]">
                {item.name}
              </p>
            </Link>
          );
        })}
        {!(filterdMembers?.length === 0 || filteredChannels?.length === 0) && (
          <div className=" w-[105%] h-[1px] bg-[#e2e8f0] mt-1"></div>
        )}
        {!(filterdMembers?.length === 0) && (
          <p className="text-[#64748b] mt-2">users</p>
        )}
        {filterdMembers?.map((item, index) => {
          return (
            <Link
              onClick={() => setOpen(false)}
              className="p-0"
              key={index}
              href={`/workspace/${workspaceId}/member/${item.user.id}`}
            >
              <p className="rounded-md  px-2 py-2 hover:bg-[#f1f5f9]">
                {item.user.name}
              </p>
            </Link>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}

export default CommandList;
