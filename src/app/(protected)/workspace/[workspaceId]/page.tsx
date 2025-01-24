"use server";
import { auth } from "@/auth";
import {
  createChannel,
  getMemberByUserIdAndWorkSpaceId,
  getWorkspaceChannels,
} from "@/utils/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
export default async function WorkSpace({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  cookies();
  // it's recommened to await params , and mandatory in NEXT15
  const { workspaceId } = await params;

  const session = await auth();
  const channels = await getWorkspaceChannels(
    workspaceId,
    session?.user?.id || ""
  );
  const currentUser = await getMemberByUserIdAndWorkSpaceId(
    session?.user?.id || "",
    workspaceId
  );
  if (!channels || !channels.length) {
    if (session?.user?.id && currentUser?.role === "admin") {
      const channelCreated = await createChannel(
        workspaceId,
        session?.user?.id,
        "general"
      );
      if (channelCreated) {
        console.log("I will log ");
        return redirect(
          `/workspace/${workspaceId}/channel/${channelCreated?.id}`
        );
      }
    } else return redirect("/");
  } else {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }
}
