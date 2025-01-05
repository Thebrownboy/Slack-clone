"use server";

import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";

export default async function WorkSpace({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const response = await getWorkSpaceByIdAction(workspaceId);
  console.log(response);
  return <div>id:{workspaceId}</div>;
}
