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
  } catch {
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
  } catch {
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
