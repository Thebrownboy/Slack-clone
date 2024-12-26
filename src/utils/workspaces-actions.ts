"use server";

import "server-only";
import { addWorkSpace, getWorkSpaces } from "./database";

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
