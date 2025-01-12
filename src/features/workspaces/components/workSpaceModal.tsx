"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNewWorkspace } from "@/utils/workspaces-actions";
import { MdError } from "react-icons/md";
import useGetCurrentUserWorkSpaces from "@/hooks/useGetCurrentUserWorkSpaces";
import { useWorkSpaceStore } from "@/state-store/store";

export default function WorkSpaceModal() {
  const { setOpen, isOpen: open } = useWorkSpaceStore((state) => state);
  const { data } = useSession();
  const { isFetching: fetching, userWorkSpaces: workSpaces } =
    useGetCurrentUserWorkSpaces(data?.user.id || "");

  useEffect(() => {
    if (workSpaces?.length) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [workSpaces, setOpen]);
  const handleClose = () => {
    setOpen(false);
    updateWorkspaceName("");
    // TODO: Clear Form
  };
  const [workspaceName, updateWorkspaceName] = useState("");
  const [errorMsg, updateErrorMsg] = useState("");
  const [isPending, updateIsPending] = useState(false);
  const submitCreateAction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    if (data?.user.id) {
      updateIsPending(true);
      const response = await createNewWorkspace(workspaceName, data?.user.id);
      if (!response.success) {
        updateErrorMsg(response.msg);
        event.preventDefault();
      }
      updateIsPending(false);
    }
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
