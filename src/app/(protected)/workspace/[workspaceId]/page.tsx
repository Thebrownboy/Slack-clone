"use server";
import { auth } from "@/auth";
import {
  createChannel,
  getWorkspaceChannels,
} from "@/utils/database-utils/channels-utils";
import { getMemberByUserIdAndWorkSpaceId } from "@/utils/database-utils/workspaces-utils";

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
  console.log(channels, currentUser);
  if (!channels || !channels.length) {
    if (session?.user?.id && currentUser?.role === "admin") {
      const channelCreated = await createChannel(
        workspaceId,
        session?.user?.id,
        "general"
      );
      if (channelCreated) {
        return redirect(
          `/workspace/${workspaceId}/channel/${channelCreated?.id}`
        );
      }
    } else return redirect("/");
  } else {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }
}
