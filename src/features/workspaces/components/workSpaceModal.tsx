"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdError } from "react-icons/md";
import useGetCurrentUserWorkSpaces from "@/features/workspaces/hooks/useGetCurrentUserWorkSpaces";
import useCreateWorkspace from "../hooks/useCreateWorkspace";
import useGetUserId from "@/hooks/useGetUserId";
import { useCreateWorkspaceModal } from "@/state-store/workspace-store";

export default function WorkSpaceModal() {
  const { setOpen, isOpen: open } = useCreateWorkspaceModal((state) => state);
  const { userId } = useGetUserId();

  const { isFetching: fetching, userWorkSpaces: workSpaces } =
    useGetCurrentUserWorkSpaces();
  const {
    errorMsg,
    isPending,
    submitCreateAction,
    updateWorkspaceName,
    workspaceName,
  } = useCreateWorkspace();
  useEffect(() => {
    if (userId) {
      setOpen(false);
      return;
    }
    if (workSpaces?.length) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [workSpaces, setOpen, userId]);
  const handleClose = () => {
    setOpen(false);
    updateWorkspaceName("");
    // TODO: Clear Form
  };

  return (
    <Dialog open={!fetching && open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a WorkSpace</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitCreateAction}>
          <Input
            value={workspaceName}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g 'Work', 'Personal' , 'Home',"
            onChange={(e) => updateWorkspaceName(e.target.value)}
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>
              {isPending ? (
                <div className=" rounded-full  animate-spin size-5 border border-t-transparent"></div>
              ) : (
                "Create"
              )}
            </Button>
          </div>

          {errorMsg && (
            <div className=" bg-red-400 p-3 rounded-md flex  gap-3 items-center text-red-700 font-bold ">
              <MdError size={20} />
              <p> {errorMsg || "Something went wrong"}</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
