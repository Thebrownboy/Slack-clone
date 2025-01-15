import { db } from "@/lib/db";
import "server-only";
import bcrypt from "bcryptjs";
import { tWorkspace } from "@/types/common-types";
export const addNewUser = async (
  email: string,
  password: string,
  name: string
) => {
  const hasedPaswword = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hasedPaswword,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      sucess: false,
    };
  }
};

export async function findUserByEmail(email: string) {
  try {
    const user = await db.user.findFirst({
      where: { email },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findUserById(id: string) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function getWorkSpaces() {
  return await db.workspace.findMany({});
}

export async function addWorkSpace(name: string, userId: string) {
  const generateCode = () => {
    const code = Array.from(
      { length: 6 },
      () =>
        "0123456789abcdefjhijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
    ).join("");

    return code;
  };
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
}

export async function getAllWorkSpacesByUserId(userId: string) {
  return await db.workspace.findMany({
    where: {
      Member: {
        some: {
          userId,
        },
      },
    },
  });
}

export async function getWorkSpaceById(id: string) {
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

export async function updateWorkSpace(
  userId: string,
  workspaceId: string,
  data: tWorkspace
) {
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
