import { db } from "@/lib/db";
import "server-only";
import bcrypt from "bcryptjs";
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
  const { id: workspaceId } = await db.workspace.create({
    data: {
      name,
      userId,
      joinCode: "123456",
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
