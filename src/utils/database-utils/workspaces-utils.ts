import { db } from "@/lib/db";
import "server-only";
import { tUpdatedWorkspace } from "@/types/common-types";

export async function getWorkSpaces() {
  return await db.workspace.findMany({});
}

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefjhijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};
export async function addWorkSpace(name: string, userId: string) {
  if (!userId) return null;
  const { id: workspaceId } = await db.workspace.create({
    data: {
      name,
      userId,
      joinCode: generateCode(),
    },
  });

  await db.members.create({
    data: {
      role: "admin",
      userId,
      workspaceId,
    },
  });

  // at least one channel
  await db.channels.create({
    data: {
      name: "general",
      workspaceId,
    },
  });
}

export async function getAllWorkSpacesByUserId(userId: string) {
  if (!userId) {
    return null;
  }

  try {
    return await db.workspace.findMany({
      where: {
        Member: {
          some: {
            userId,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getWorkSpaceById(id: string) {
  if (!id) return null;
  return await db.workspace.findUnique({
    where: {
      id,
    },
  });
}

export async function getMemberByUserIdAndWorkSpaceId(
  userId: string,
  workspaceId: string
) {
  return await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
}

export async function getFullMemberByUserIdAndWorkSpaceId(
  userId: string,
  workspaceId: string
) {
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: member?.userId,
    },
  });
  return {
    ...member,
    name: user?.name,
    image: user?.image,
    email: user?.email,
  };
}

export async function updateWorkSpace(
  userId: string,
  workspaceId: string,
  data: tUpdatedWorkspace
) {
  if (!userId || !workspaceId) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!member || member.role !== "admin") {
    return null;
  }
  const updatedWorkSpace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data,
  });
  return updatedWorkSpace;
}

export async function deleteWorkSpace(userId: string, workspaceId: string) {
  if (!userId || !workspaceId) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!member || member.role !== "admin") {
    return null;
  }
  const deleteWorkSpace = await db.workspace.delete({
    where: {
      id: workspaceId,
    },
  });

  return deleteWorkSpace;
}
export async function generateNewJoinCode(userId: string, workspaceId: string) {
  if (!userId) return null;

  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (!member || member.role !== "admin") {
    return null;
  }
  const newJoinCode = generateCode();

  const updatedWorkspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      joinCode: newJoinCode,
    },
  });

  return updatedWorkspace;
}

export async function getWorkspaceNaiveInfo(
  userId: string,
  workspaceId: string
) {
  if (!userId) return null;

  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  return {
    workspaceName: workspace?.name,
    isMember: !!member,
  };
}

export async function makeUserJoin(
  userId: string,
  workspaceId: string,
  joinCode: string
) {
  if (!userId) {
    return null;
  }
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (workspace?.joinCode !== joinCode.toLowerCase()) {
    return null;
  }
  const existingMembmer = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (existingMembmer) {
    return null;
  }
  await db.members.create({
    data: {
      userId,
      workspaceId,
      role: "member",
    },
  });
  return workspace.id;
}
