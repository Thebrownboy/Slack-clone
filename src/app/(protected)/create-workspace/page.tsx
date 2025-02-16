"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useCreateWorkspace from "@/features/workspaces/hooks/useCreateWorkspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { MdError } from "react-icons/md";

function CreateWorkSpace() {
  const router = useRouter();
  const { data } = useSession();
  const {
    errorMsg,
    isPending,
    submitCreateAction,
    updateWorkspaceName,
    workspaceName,
  } = useCreateWorkspace(data?.user?.id);
  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.push("/");
      }}
    >
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

export default CreateWorkSpace;
