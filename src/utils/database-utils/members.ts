import { db } from "@/lib/db";
import "server-only";

export async function updateMember({
  userId,
  memberId,
  role,
  workspaceId,
}: {
  userId: string;
  // the user that is doing the action
  memberId: string;
  // the member that will be updated
  workspaceId: string;
  role: "admin" | "member";
}) {
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });
  // the member that is doing the action MUST be admin
  if (!member || member.role !== "admin") {
    return null;
  }
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  const isWorkspaceOwner = workspace?.id === userId;
  // if you are trying to update the workspace owner , return
  if (workspace?.userId === memberId) return null;

  const _updatedMember = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });
  // if you are not the workspace owner , and you are trying to change the role of an admin ,
  // you don't have the permission to do this even if you are an admin
  if (!isWorkspaceOwner && _updatedMember?.role === "admin") return null;

  const updatedMember = await db.members.update({
    data: {
      role,
    },
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });

  return updatedMember;
}

export async function removeMember({
  userId,
  memberId,
  workspaceId,
}: {
  userId: string;
  // the user that is doing the action
  memberId: string;
  // the member that will be updated
  workspaceId: string;
}) {
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });
  if (!member) {
    return null;
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  const isWorkspaceOwner = workspace?.id === userId;
  // if you are trying to remove  the workspace owner , return ,even if you are admin
  if (workspace?.userId === memberId) return null;

  const _updatedMember = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });
  // if you are not the workspace owner , and you are trying to remove an admin , even if yourself
  // you don't have the permission to do this even if you are an admin
  if (!isWorkspaceOwner && _updatedMember?.role === "admin") return null;
  // if you are trying to remove your self
  if (_updatedMember?.userId === userId && member.role === "admin") {
    return null;
  }

  await db.message.deleteMany({
    where: {
      memberId,
      workspaceId,
    },
  });
  await db.reactions.deleteMany({
    where: {
      memberId,
      workspaceId,
    },
  });
  await db.conversation.deleteMany({
    where: {
      workspaceId,
      OR: [{ memberOneId: memberId }, { memberTwoId: memberId }],
    },
  });
  const removedMember = await db.members.delete({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });
  return removedMember;
}
