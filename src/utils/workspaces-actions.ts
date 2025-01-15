"use server";

import "server-only";
import {
  addWorkSpace,
  deleteWorkSpace,
  getAllWorkSpacesByUserId,
  getMemberByUserIdAndWorkSpaceId,
  getWorkSpaceById,
  getWorkSpaces,
  updateWorkSpace,
} from "./database";
import { tWorkspace } from "@/types/common-types";

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

export async function getWorkSpaceByIdAction(id: string) {
  return await getWorkSpaceById(id);
}

export async function getMemberByUserIdAndWorkSpaceIdAction(
  userId: string,
  workspaceId: string
) {
  return await getMemberByUserIdAndWorkSpaceId(userId, workspaceId);
}

export async function updateWorkSpaceAction(
  useId: string,
  workspaceId: string,
  data: tWorkspace
) {
  if (await updateWorkSpace(useId, workspaceId, data)) {
    return {
      success: true,
      msg: "updated successfully",
    };
  } else {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }
}

export async function deleteWorkSpaceAction(
  useId: string,
  workspaceId: string
) {
  if (await deleteWorkSpace(useId, workspaceId)) {
    return {
      success: true,
      msg: "updated successfully",
    };
  } else {
    return {
      success: false,
      msg: "Unauthorized",
    };
  }
}
