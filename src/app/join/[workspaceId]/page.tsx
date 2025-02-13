"use client";

import { Button } from "@/components/ui/button";
import useGetWorkspaceInfo from "@/features/workspaces/hooks/useGetWorkspaceInfo";
import useJoinWorkspace from "@/features/workspaces/hooks/useJoinWorkspace";
import { useCurrentUser } from "@/state-store/store";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";
import { toast } from "sonner";
interface JoinPageProps {
  params: Promise<{ workspaceId: string }>;
}
export default function JoinPage({ params }: JoinPageProps) {
  const { workspaceId } = React.use(params);
  const {
    userState: { user },
  } = useCurrentUser();
  const router = useRouter();
  const { currentWorkSpaceInfo, loading } = useGetWorkspaceInfo(
    workspaceId,
    user?.id || ""
  );
  const { submitJoinAction, isPending } = useJoinWorkspace(
    user?.id || "",
    workspaceId
  );
  const isMember = useMemo(
    () => currentWorkSpaceInfo?.isMember,
    [currentWorkSpaceInfo?.isMember]
  );
  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);
  if (loading || isPending) {
    return (
      <div className=" h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground " />
      </div>
    );
  }

  const handleComplete = async (value: string) => {
    const response = await submitJoinAction(value);
    console.log(response);
    if (response?.success) {
      toast.success("Workspace joined.");
      router.replace(`/workspace/${workspaceId}`);
    }

    toast.error(response?.msg);
  };
  return (
    <div className=" h-full flex flex-col gap-y-8 justify-center items-center bg-white p-8 rounded-lg shadow-md">
      <Image src="/point.png" width={60} height={60} alt="Logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className=" flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold ">
            Join {currentWorkSpaceInfo?.workspaceName}
          </h1>

          <p className="text-md text-muted-foreground">
            {" "}
            Enter the workspace code to join{" "}
          </p>
        </div>
        <VerificationInput
          onComplete={handleComplete}
          length={6}
          classNames={{
            container: "flex gap-x-2",
            character:
              "uppercase h-auto  rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black ",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div className=" flex gap-x-4 ">
        <Button className="" size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Back to home </Link>
        </Button>
      </div>
    </div>
  );
}
