"use server";

import { auth } from "@/auth";
import { getMemberByUserIdAndWorkSpaceId } from "@/utils/database";
import { redirect } from "next/navigation";
export default async function WorkSpace({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  // you have userId and workspace id , the only thing you should do is to look at the member table with both userId and workspaceId
  // if exists so the user has the right to go to this workspace , if not the user is not allowed
  const session = await auth();
  console.log(session?.user.id);
  const member = await getMemberByUserIdAndWorkSpaceId(
    session?.user.id || "",
    workspaceId
  );

  if (!member) {
    redirect("/");
  }

  return <div>id:{workspaceId}</div>;
}
