"use server";
import "server-only";
import { getWorkspaceMembers } from "./database-utils/channels-utils";
import { removeMember, updateMember } from "./database-utils/members";
import pusherServer from "@/lib/pusher";
import { tWorkspaceMembers } from "@/types/common-types";

export async function getWorkspaceMembersAction(
  workspaceId: string,
  userId: string
) {
  return await getWorkspaceMembers(workspaceId, userId);
}

export async function updateMemberAction(data: {
  userId: string;
  // the user that is doing the action
  memberId: string;
  // the member that will be updated
  workspaceId: string;
  role: "admin" | "member";
}) {
  const updatedUser = await updateMember(data);

  if (updatedUser) {
    return {
      success: true,
      updatedMember: updatedUser,
    };
  } else {
    return {
      success: false,
      updatedMember: updatedUser,
    };
  }
}

export async function removeMemberAction(data: {
  userId: string;
  // the user that is doing the action
  memberId: string;
  // the member that will be updated
  workspaceId: string;
}) {
  const removedUser = await removeMember(data);

  if (removedUser) {
    return {
      success: true,
      updatedMember: removedUser,
    };
  } else {
    return {
      success: false,
      updatedMember: removedUser,
    };
  }
}

export async function triggerAddUserToWorkspace(
  member: tWorkspaceMembers | null
) {
  console.log("I will trigger hrerh rehre herhrhe rhe rheh", member);
  if (member) {
    console.log("I will send the trigger ");
    // sending the message on the workspace instead of just channel
    await pusherServer.trigger(
      member.member.workspaceId,
      "add-user-to-workspace",
      member
    );
  }
}

export async function triggerRemoveUserFromWorkspace(member: {
  workspaceId: string;
  userId: string;
  role: "admin" | "member";
}) {
  console.log("I will trigger hrerh rehre herhrhe rhe rheh", member);
  if (member) {
    console.log("I will send the trigger ");
    // sending the message on the workspace instead of just channel
    await pusherServer.trigger(
      member.workspaceId,
      "remove-user-from-workspace",
      member
    );
  }
}
