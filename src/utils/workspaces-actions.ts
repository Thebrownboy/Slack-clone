"use server";

import "server-only";
import {
  addWorkSpace,
  deleteWorkSpace,
  generateNewJoinCode,
  getAllWorkSpacesByUserId,
  getMemberByUserIdAndWorkSpaceId,
  getWorkSpaceById,
  getWorkspaceNaiveInfo,
  getWorkSpaces,
  makeUserJoin,
  updateWorkSpace,
} from "./database-utils/workspaces-utils";
import { tUpdatedWorkspace } from "@/types/common-types";
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
  try {
    const response = await getAllWorkSpacesByUserId(userId);
    return response;
  } catch {
    return null;
  }
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
  data: tUpdatedWorkspace
) {
  const updatedWorkspace = await updateWorkSpace(useId, workspaceId, data);
  if (updatedWorkspace) {
    return {
      success: true,
      msg: "updated successfully",
      updatedWorkspace,
    };
  } else {
    return {
      success: false,
      msg: "Unauthorized",
      updatedWorkspace: null,
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

export async function generateNewJoinCodeAction(
  userId: string,
  workspaceId: string
) {
  const updatedWorkSpace = await generateNewJoinCode(userId, workspaceId);
  if (updatedWorkSpace) {
    return {
      success: true,
      updatedWorkSpace,
      msg: "",
    };
  } else {
    return {
      success: false,
      msg: "",
      updatedWorkSpace: null,
    };
  }
}

export async function makeUserJoinAction(
  userId: string,
  workspaceId: string,
  joinCode: string
) {
  const response = await makeUserJoin(userId, workspaceId, joinCode);
  if (!response) {
    return {
      success: false,
      msg: "Unkown error happened",
    };
  }
  if (typeof response == "string") {
    return {
      success: false,
      msg: response,
    };
  }

  return {
    success: true,
    msg: "",
  };
}

export async function getWorkspaceNaiveInfoAction(
  userId: string,
  workspaceId: string
) {
  const response = await getWorkspaceNaiveInfo(userId, workspaceId);

  if (response) {
    return {
      success: true,
      data: response,
    };
  } else {
    return {
      success: false,
      data: response,
    };
  }
}
