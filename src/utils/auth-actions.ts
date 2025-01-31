"use server";
import "server-only";
import { getUser } from "./authentication";

export async function getUserAction(userId: string) {
  const user = await getUser(userId);

  return user;
}
