"use server";

import "server-only";
import {
  addWorkSpace,
  getAllWorkSpacesByUserId,
  getWorkSpaces,
} from "./database";

// these files are treated as server actions

export async function getWorkAllWorkSpacesAction() {
  return await getWorkSpaces();
}

export async function createNewWorkspace(name: string, id: string) {
  try {
    await addWorkSpace(name, id);
    return {
      success: true,
      msg: "Workspace created successfully",
    };
  } catch {
    return {
      success: false,
      msg: "Unkown Error Happend",
    };
  }
}

// this is an action
// another layer of abstraction
// even if the function is just a single line , but it's essential to have this level of abstraction
export async function getAllWorkSpacesOfUserAction(userId: string) {
  return await getAllWorkSpacesByUserId(userId);
}
