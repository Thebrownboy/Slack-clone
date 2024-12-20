import { db } from "@/lib/db";
import "server-only";
import bcrypt from "bcryptjs";
export const addNewUser = async (email: string, password: string) => {
  const hasedPaswword = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
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
