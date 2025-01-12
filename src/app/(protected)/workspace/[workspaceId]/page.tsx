"use server";

import { getWorkSpaceByIdAction } from "@/utils/workspaces-actions";

export default async function WorkSpace({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  await getWorkSpaceByIdAction(workspaceId);
  return <div>id:{workspaceId}</div>;
}
